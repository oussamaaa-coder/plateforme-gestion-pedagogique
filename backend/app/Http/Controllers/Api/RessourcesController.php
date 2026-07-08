<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Ressource;
use App\Support\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class RessourcesController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $query = Ressource::query()
            ->with(['module.filiere', 'groupe', 'formateur']);

        // ── Security: Students can only see THEIR group ────────
        if ($user && $user->role === 'etudiant') {
            $query->byGroupe($user->groupe_id);
            // Ignore any groupe_id in request to prevent discovery
            $request->offsetUnset('groupe_id');
        }

        // ── Filtres directs ────────────────────────────────────
        if ($request->filled('module_id')) {
            $query->byModule($request->integer('module_id'));
        }
        if ($request->filled('groupe_id')) {
            $query->byGroupe($request->integer('groupe_id'));
        }
        if ($request->filled('type')) {
            $query->byType($request->query('type'));
        }
        if ($request->filled('formateur_id')) {
            $query->byFormateur($request->integer('formateur_id'));
        }

        // ── Filtres via relation module > filière ────────────────
        if ($request->filled('filiere_id')) {
            $query->whereHas('module', fn($q) => $q->where('filiere_id', $request->integer('filiere_id')));
        }

        // ── Recherche libre ────────────────────────────────────
        if ($search = $request->query('search')) {
            $query->searchTitle($search);
        }

        $perPage = min(max((int) $request->query('per_page', 15), 1), 100);
        $result = $query->latest('created_at')->paginate($perPage);

        return ApiResponse::ok($result, 'Liste chargée.', [
            'filters' => [
                'search' => $search ?? null,
                'module_id' => $request->query('module_id'),
                'groupe_id' => $request->query('groupe_id'),
                'filiere_id' => $request->query('filiere_id'),
                'type' => $request->query('type'),
                'formateur_id' => $request->query('formateur_id'),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'titre' => ['required', 'string', 'max:150'],
            'type' => ['required', 'in:TP,TD,Cours'],
            'fichier' => ['required', 'file', 'mimes:pdf,doc,docx,ppt,pptx,zip', 'max:10240'],
            'module_id' => ['required', 'integer', 'exists:modules,id'],
            'groupe_id' => ['required', 'integer', 'exists:groupes,id'],
            'formateur_id' => ['nullable', 'integer', 'exists:users,id'],
        ]);

        if ($request->hasFile('fichier')) {
            $data['fichier'] = $request->file('fichier')->store('resources', 'public');
        }

        $ressource = Ressource::query()->create($data);

        return ApiResponse::ok($ressource->load(['module', 'groupe', 'formateur']), 'Ressource créée.', [
            'changed' => array_keys($data),
        ], 201);
    }

    public function show(Ressource $ressource)
    {
        return ApiResponse::ok($ressource->load(['module', 'groupe', 'formateur']), 'Détails chargés.');
    }

    public function update(Request $request, Ressource $ressource)
    {
        $data = $request->validate([
            'titre' => ['sometimes', 'required', 'string', 'max:150'],
            'type' => ['sometimes', 'required', 'in:TP,TD,Cours'],
            'fichier' => ['sometimes', 'required', 'file', 'mimes:pdf,doc,docx,ppt,pptx,zip', 'max:10240'],
            'module_id' => ['sometimes', 'required', 'integer', 'exists:modules,id'],
            'groupe_id' => ['sometimes', 'required', 'integer', 'exists:groupes,id'],
            'formateur_id' => ['nullable', 'integer', 'exists:users,id'],
        ]);

        if ($request->hasFile('fichier')) {
            if ($ressource->fichier) {
                Storage::disk('public')->delete($ressource->fichier);
            }
            $data['fichier'] = $request->file('fichier')->store('resources', 'public');
        }

        $ressource->fill($data)->save();

        return ApiResponse::ok($ressource->fresh()->load(['module', 'groupe', 'formateur']), 'Ressource mise à jour.', [
            'changed' => array_keys($data),
        ]);
    }

    public function destroy(Ressource $ressource)
    {
        $id = $ressource->id;
        if ($ressource->fichier) {
            Storage::disk('public')->delete($ressource->fichier);
        }
        $ressource->delete();

        return ApiResponse::ok(['id' => $id], 'Ressource supprimée.', [
            'changed' => ['deleted'],
        ]);
    }
}

