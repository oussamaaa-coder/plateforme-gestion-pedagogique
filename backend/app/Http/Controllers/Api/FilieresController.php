<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Filiere;
use App\Support\ApiResponse;
use Illuminate\Http\Request;

class FilieresController extends Controller
{
    public function index(Request $request)
    {
        $query = Filiere::query();

        if ($search = $request->query('search')) {
            $query->where(function($q) use ($search) {
                $q->where('nom', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $perPage = min(max((int) $request->query('per_page', 15), 1), 100);
        $result = $query->orderBy('nom')->paginate($perPage);

        return ApiResponse::ok($result, 'Liste chargée.', [
            'filters' => ['search' => $search ?? null],
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'nom' => ['required', 'string', 'max:100'],
            'description' => ['nullable', 'string'],
            'duree' => ['nullable', 'string', 'max:50'],
        ]);

        $filiere = Filiere::query()->create($data);

        return ApiResponse::ok($filiere, 'Filière créée.', [
            'changed' => array_keys($data),
        ], 201);
    }

    public function show(Filiere $filiere)
    {
        return ApiResponse::ok($filiere, 'Détails chargés.');
    }

    public function update(Request $request, Filiere $filiere)
    {
        $data = $request->validate([
            'nom' => ['sometimes', 'required', 'string', 'max:100'],
            'description' => ['sometimes', 'nullable', 'string'],
            'duree' => ['sometimes', 'nullable', 'string', 'max:50'],
        ]);

        $filiere->fill($data)->save();

        return ApiResponse::ok($filiere->fresh(), 'Filière mise à jour.', [
            'changed' => array_keys($data),
        ]);
    }

    public function destroy(Filiere $filiere)
    {
        $id = $filiere->id;
        $filiere->delete();

        return ApiResponse::ok(['id' => $id], 'Filière supprimée.', [
            'changed' => ['deleted'],
        ]);
    }
}

