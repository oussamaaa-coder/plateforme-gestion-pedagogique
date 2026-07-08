<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Note;
use App\Support\ApiResponse;
use Illuminate\Http\Request;

class NotesController extends Controller
{
    /**
     * Liste des notes avec filtrage avancé.
     *
     * Filtres supportés :
     *  - user_id        : ID de l'étudiant
     *  - module_id      : ID du module
     *  - type_controle  : CC | EFM | EFM_Regional | EFF
     *  - filiere_id     : ID de la filière (via module)
     *  - annee          : 1 | 2 (via module)
     *  - search         : recherche libre (nom/prénom étudiant, nom module)
     */
    public function index(Request $request)
    {
        $query = Note::query()->with(['user.groupe', 'module.filiere', 'formateur']);

        // ── Filtres directs ────────────────────────────────────
        if ($request->user()->role === 'etudiant') {
            $query->where('user_id', $request->user()->id);
        } elseif ($request->filled('user_id')) {
            $query->where('user_id', $request->integer('user_id'));
        }
        if ($request->filled('module_id')) {
            $query->where('module_id', $request->integer('module_id'));
        }
        if ($request->filled('type_controle')) {
            $query->where('type_controle', $request->query('type_controle'));
        }
        if ($request->filled('groupe_id')) {
            $query->whereHas('user', function ($q) use ($request) {
                $q->where('groupe_id', $request->integer('groupe_id'));
            });
        }

        // ── Filtres via relation module ────────────────────────
        if ($request->filled('filiere_id')) {
            $query->forFiliere($request->integer('filiere_id'));
        }
        if ($request->filled('annee')) {
            $query->forAnnee($request->integer('annee'));
        }

        // ── Recherche libre ───────────────────────────────────
        if ($search = $request->query('search')) {
            $query->where(function ($q) use ($search) {
                $q->whereHas('user', function ($u) use ($search) {
                    $u->where('nom', 'like', "%{$search}%")
                      ->orWhere('prenom', 'like', "%{$search}%")
                      ->orWhere('cin', 'like', "%{$search}%");
                })
                ->orWhereHas('module', function ($m) use ($search) {
                    $m->where('nom', 'like', "%{$search}%");
                });
            });
        }

        $perPage = min(max((int) $request->query('per_page', 15), 1), 100);
        $result = $query->orderByDesc('id')->paginate($perPage);

        return ApiResponse::ok($result, 'Liste chargée.', [
            'filters' => [
                'user_id'       => $request->query('user_id'),
                'module_id'     => $request->query('module_id'),
                'type_controle' => $request->query('type_controle'),
                'filiere_id'    => $request->query('filiere_id'),
                'groupe_id'     => $request->query('groupe_id'),
                'annee'         => $request->query('annee'),
                'search'        => $request->query('search'),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $authUser = $request->user();

        $typeControle = $request->input('type_controle');
        $isEfm = $typeControle === 'EFM' || $typeControle === 'EFM_Regional';
        $maxNote = $isEfm ? 40 : 20;

        $data = $request->validate([
            'user_id'       => ['required', 'integer', 'exists:users,id'],
            'module_id'     => ['required', 'integer', 'exists:modules,id'],
            'note'          => ['required', 'numeric', 'min:0', 'max:' . $maxNote],
            'type_controle' => ['required', 'in:' . implode(',', Note::TYPES)],
            'coefficient'   => ['sometimes', 'numeric', 'min:0'],
            'remarque'      => ['nullable', 'string', 'max:500'],
            'formateur_id'  => ['required', 'integer', 'exists:users,id'],
        ]);

        // Security check for trainers
        if ($authUser->role === 'formateur') {
            // Force formateur_id to be the authenticated user's ID
            $data['formateur_id'] = $authUser->id;

            $student = \App\Models\User::find($data['user_id']);
            
            // Check if trainer is assigned to this module AND this group in formateur_groupe_module
            $isAssigned = \Illuminate\Support\Facades\DB::table('formateur_groupe_module')
                ->where('formateur_id', $authUser->id)
                ->where('module_id', $data['module_id'])
                ->where('groupe_id', $student->groupe_id)
                ->exists();

            if (!$isAssigned) {
                return ApiResponse::error(
                    "Vous n'avez pas la permission de noter cet étudiant pour ce module (non assigné par l'administration).",
                    null,
                    403,
                    'FORBIDDEN'
                );
            }
        }

        $note = Note::query()->create($data);

        return ApiResponse::ok(
            $note->load(['user', 'module.filiere', 'formateur']),
            'Note créée.',
            ['changed' => array_keys($data)],
            201
        );
    }

    public function show(Note $note)
    {
        if (request()->user()->role === 'etudiant' && $note->user_id !== request()->user()->id) {
            return ApiResponse::error("Vous n'avez pas la permission de voir cette note.", null, 403, 'FORBIDDEN');
        }

        return ApiResponse::ok(
            $note->load(['user', 'module.filiere', 'formateur']),
            'Détails chargés.'
        );
    }

    public function update(Request $request, Note $note)
    {
        $authUser = $request->user();

        $typeControle = $request->input('type_controle', $note->type_controle);
        $isEfm = $typeControle === 'EFM' || $typeControle === 'EFM_Regional';
        $maxNote = $isEfm ? 40 : 20;

        $data = $request->validate([
            'user_id'       => ['sometimes', 'required', 'integer', 'exists:users,id'],
            'module_id'     => ['sometimes', 'required', 'integer', 'exists:modules,id'],
            'note'          => ['sometimes', 'required', 'numeric', 'min:0', 'max:' . $maxNote],
            'type_controle' => ['sometimes', 'required', 'in:' . implode(',', Note::TYPES)],
            'coefficient'   => ['sometimes', 'numeric', 'min:0'],
            'remarque'      => ['nullable', 'string', 'max:500'],
            'formateur_id'  => ['sometimes', 'required', 'integer', 'exists:users,id'],
        ]);

        if ($authUser->role === 'formateur') {
            // A trainer can only update their own notes
            if ($note->formateur_id !== $authUser->id) {
                return ApiResponse::error("Vous ne pouvez modifier que vos propres notes.", null, 403, 'FORBIDDEN');
            }

            // If updating student or module, re-verify assignment
            $studentId = $data['user_id'] ?? $note->user_id;
            $moduleId = $data['module_id'] ?? $note->module_id;
            $student = \App\Models\User::find($studentId);

            $isAssigned = \Illuminate\Support\Facades\DB::table('formateur_groupe_module')
                ->where('formateur_id', $authUser->id)
                ->where('module_id', $moduleId)
                ->where('groupe_id', $student->groupe_id)
                ->exists();

            if (!$isAssigned) {
                return ApiResponse::error(
                    "Assignation invalide pour ce module/groupe.",
                    null,
                    403,
                    'FORBIDDEN'
                );
            }
            
            $data['formateur_id'] = $authUser->id;
        }

        $note->fill($data)->save();

        return ApiResponse::ok(
            $note->fresh()->load(['user', 'module.filiere', 'formateur']),
            'Note mise à jour.',
            ['changed' => array_keys($data)]
        );
    }

    public function destroy(Note $note)
    {
        $id = $note->id;
        $note->delete();

        return ApiResponse::ok(['id' => $id], 'Note supprimée.', [
            'changed' => ['deleted'],
        ]);
    }
}

