<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Module;
use App\Support\ApiResponse;
use Illuminate\Http\Request;

class ModulesController extends Controller
{
    public function index(Request $request)
    {
        $query = Module::query()->with(['filiere']);

        if ($request->filled('filiere_id')) {
            $query->where('filiere_id', $request->integer('filiere_id'));
        }

        if ($request->filled('annee')) {
            $query->where('annee', $request->integer('annee'));
        }

        if ($search = $request->query('search')) {
            $query->where(function($q) use ($search) {
                $q->where('nom', 'like', "%{$search}%")
                  ->orWhereHas('filiere', function($f) use ($search) {
                      $f->where('nom', 'like', "%{$search}%");
                  });
            });
        }

        $perPage = min(max((int) $request->query('per_page', 15), 1), 100);
        $result = $query->orderBy('nom')->paginate($perPage);

        return ApiResponse::ok($result, 'Liste chargée.', [
            'filters' => [
                'search'     => $search ?? null,
                'filiere_id' => $request->query('filiere_id'),
                'annee'     => $request->query('annee'),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'nom'         => ['required', 'string', 'max:100'],
            'coefficient' => ['required', 'numeric', 'min:0'],
            'annee'       => ['required', 'integer', 'in:1,2'],
            'filiere_id'  => ['required', 'integer', 'exists:filieres,id'],
        ]);

        $module = Module::query()->create($data);

        return ApiResponse::ok($module->load(['filiere']), 'Module créé.', [
            'changed' => array_keys($data),
        ], 201);
    }

    public function show(Module $module)
    {
        return ApiResponse::ok($module->load(['filiere']), 'Détails chargés.');
    }

    public function update(Request $request, Module $module)
    {
        $data = $request->validate([
            'nom'         => ['sometimes', 'required', 'string', 'max:100'],
            'coefficient' => ['sometimes', 'required', 'numeric', 'min:0'],
            'annee'       => ['sometimes', 'required', 'integer', 'in:1,2'],
            'filiere_id'  => ['sometimes', 'required', 'integer', 'exists:filieres,id'],
        ]);

        $module->fill($data)->save();

        return ApiResponse::ok($module->fresh()->load(['filiere']), 'Module mis à jour.', [
            'changed' => array_keys($data),
        ]);
    }

    public function destroy(Module $module)
    {
        $id = $module->id;
        $module->delete();

        return ApiResponse::ok(['id' => $id], 'Module supprimé.', [
            'changed' => ['deleted'],
        ]);
    }
}

