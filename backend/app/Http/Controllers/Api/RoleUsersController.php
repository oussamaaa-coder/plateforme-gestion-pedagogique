<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Support\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class RoleUsersController extends Controller
{
    protected function role(): string
    {
        return 'etudiant';
    }

    public function index(Request $request)
    {
        $role = $this->role();

        $query = User::query()->where('role', $role)->with(['filiere', 'groupe']);

        if ($search = $request->query('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('nom', 'like', "%{$search}%")
                    ->orWhere('prenom', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('cin', 'like', "%{$search}%")
                    ->orWhereRaw("CONCAT(prenom, ' ', nom) like ?", ["%{$search}%"])
                    ->orWhereRaw("CONCAT(nom, ' ', prenom) like ?", ["%{$search}%"]);
            });
        }

        if ($request->filled('filiere_id')) {
            $query->where('filiere_id', $request->integer('filiere_id'));
        }

        if ($request->filled('groupe_id')) {
            $query->where('groupe_id', $request->integer('groupe_id'));
        }

        $perPage = min(max((int) $request->query('per_page', 15), 1), 100);
        $result = $query->orderByDesc('id')->paginate($perPage);

        return ApiResponse::ok($result, 'Liste chargée.', [
            'filters' => [
                'role' => $role,
                'search' => $search ?? null,
                'filiere_id' => $request->query('filiere_id'),
                'groupe_id' => $request->query('groupe_id'),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $role = $this->role();

        $rules = [
            'nom' => ['required', 'string', 'max:100'],
            'prenom' => ['required', 'string', 'max:100'],
            'email' => ['required', 'email', 'max:150', Rule::unique('users', 'email')],
            'password' => ['required', 'string', 'min:6'],
        ];

        if ($role === 'etudiant') {
            $rules = array_merge($rules, [
                'date_naissance' => ['required', 'date'],
                'cin' => ['required', 'string', 'max:20', Rule::unique('users', 'cin')],
                'filiere_id' => ['required', 'integer', 'exists:filieres,id'],
                'groupe_id' => ['required', 'integer', 'exists:groupes,id'],
                'numero_liste' => ['nullable', 'integer', 'min:1'],
                'annee_scolaire' => ['required', 'string', 'max:20'],
            ]);
        }

        if ($role === 'formateur') {
            $rules = array_merge($rules, [
                'specialite' => ['nullable', 'string', 'max:100'],
            ]);
        }

        $data = $request->validate($rules);

        // Validation additionnelle : combinaison unique Nom + Prénom
        $nom = $data['nom'] ?? null;
        $prenom = $data['prenom'] ?? null;
        if ($nom && $prenom) {
            $exists = User::query()
                ->where('role', $role)
                ->where('nom', $nom)
                ->where('prenom', $prenom)
                ->exists();

            if ($exists) {
                return ApiResponse::error("Un étudiant avec le nom '$nom' et prénom '$prenom' existe déjà.", [
                    'nom' => ['Ce nom et prénom sont déjà enregistrés pour un autre étudiant.']
                ], 422);
            }
        }
        $data['role'] = $role;
        $data['name'] = ($data['prenom'] ?? '') . ' ' . ($data['nom'] ?? '');

        $user = User::query()->create($data);

        return ApiResponse::ok($user, 'Utilisateur créé.', [
            'changed' => array_keys($data),
        ], 201);
    }

    public function show(Request $request, User $user)
    {
        $role = $this->role();

        if ($user->role !== $role) {
            return ApiResponse::error('Ressource introuvable.', null, 404, 'NOT_FOUND');
        }

        return ApiResponse::ok($user->load(['filiere', 'groupe', 'notes.module', 'notes.formateur', 'absences.module']), 'Détails chargés.');
    }

    public function update(Request $request, User $user)
    {
        $role = $this->role();

        if ($user->role !== $role) {
            return ApiResponse::error('Ressource introuvable.', null, 404, 'NOT_FOUND');
        }

        $rules = [
            'nom' => ['sometimes', 'required', 'string', 'max:100'],
            'prenom' => ['sometimes', 'required', 'string', 'max:100'],
            'email' => ['sometimes', 'required', 'email', 'max:150', Rule::unique('users', 'email')->ignore($user->id)],
            'password' => ['sometimes', 'nullable', 'string', 'min:6'],
        ];

        if ($role === 'etudiant') {
            $rules = array_merge($rules, [
                'date_naissance' => ['sometimes', 'required', 'date'],
                'cin' => ['sometimes', 'required', 'string', 'max:20', Rule::unique('users', 'cin')->ignore($user->id)],
                'filiere_id' => ['sometimes', 'required', 'integer', 'exists:filieres,id'],
                'groupe_id' => ['sometimes', 'required', 'integer', 'exists:groupes,id'],
                'numero_liste' => ['sometimes', 'nullable', 'integer', 'min:1'],
                'annee_scolaire' => ['sometimes', 'required', 'string', 'max:20'],
            ]);
        }

        if ($role === 'formateur') {
            $rules = array_merge($rules, [
                'specialite' => ['sometimes', 'nullable', 'string', 'max:100'],
            ]);
        }

        $data = $request->validate($rules);

        // Validation additionnelle : combinaison unique Nom + Prénom
        if (isset($data['nom']) || isset($data['prenom'])) {
            $nom = $data['nom'] ?? $user->nom;
            $prenom = $data['prenom'] ?? $user->prenom;
            $exists = User::query()
                ->where('role', $role)
                ->where('nom', $nom)
                ->where('prenom', $prenom)
                ->where('id', '!=', $user->id)
                ->exists();

            if ($exists) {
                return ApiResponse::error("Un étudiant avec le nom '$nom' et prénom '$prenom' existe déjà.", [
                    'nom' => ['Ce nom et prénom sont déjà enregistrés pour un autre étudiant.']
                ], 422);
            }
        }

        $changed = array_keys($data);

        if (array_key_exists('password', $data) && ($data['password'] === null || $data['password'] === '')) {
            unset($data['password']);
            $changed = array_values(array_diff($changed, ['password']));
        }

        // Update 'name' if prenom or nom changed
        if (isset($data['prenom']) || isset($data['nom'])) {
            $prenom = $data['prenom'] ?? $user->prenom;
            $nom = $data['nom'] ?? $user->nom;
            $data['name'] = trim(($prenom ?? '') . ' ' . ($nom ?? ''));
            if (!in_array('name', $changed)) {
                $changed[] = 'name';
            }
        }

        $user->fill($data)->save();

        return ApiResponse::ok($user->fresh(), 'Utilisateur mis à jour.', [
            'changed' => $changed,
        ]);
    }

    public function destroy(Request $request, User $user)
    {
        $role = $this->role();

        if ($user->role !== $role) {
            return ApiResponse::error('Ressource introuvable.', null, 404, 'NOT_FOUND');
        }

        $id = $user->id;
        $user->delete();

        return ApiResponse::ok(['id' => $id], 'Utilisateur supprimé.', [
            'changed' => ['deleted'],
        ]);
    }
}

