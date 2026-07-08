<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Partenaire;
use App\Support\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PartenairesController extends Controller
{
    public function index(Request $request)
    {
        $query = Partenaire::query();

        if ($search = $request->query('search')) {
            $query->where('nom', 'like', "%{$search}%");
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
            'nom' => ['required', 'string', 'max:150'],
            'logo' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:2048'],
            'description' => ['nullable', 'string'],
            'site_web' => ['nullable', 'string', 'max:255'],
        ]);

        if ($request->hasFile('logo')) {
            $data['logo'] = $request->file('logo')->store('partners', 'public');
        }

        $partenaire = Partenaire::query()->create($data);

        return ApiResponse::ok($partenaire, 'Partenaire créé.', [
            'changed' => array_keys($data),
        ], 201);
    }

    public function show(Partenaire $partenaire)
    {
        return ApiResponse::ok($partenaire, 'Détails chargés.');
    }

    public function update(Request $request, Partenaire $partenaire)
    {
        $data = $request->validate([
            'nom' => ['sometimes', 'required', 'string', 'max:150'],
            'logo' => ['sometimes', 'nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:2048'],
            'description' => ['sometimes', 'nullable', 'string'],
            'site_web' => ['sometimes', 'nullable', 'string', 'max:255'],
        ]);

        if ($request->hasFile('logo')) {
            if ($partenaire->logo) {
                Storage::disk('public')->delete($partenaire->logo);
            }
            $data['logo'] = $request->file('logo')->store('partners', 'public');
        }

        $partenaire->fill($data)->save();

        return ApiResponse::ok($partenaire->fresh(), 'Partenaire mis à jour.', [
            'changed' => array_keys($data),
        ]);
    }

    public function destroy(Partenaire $partenaire)
    {
        $id = $partenaire->id;
        if ($partenaire->logo) {
            Storage::disk('public')->delete($partenaire->logo);
        }
        $partenaire->delete();

        return ApiResponse::ok(['id' => $id], 'Partenaire supprimé.', [
            'changed' => ['deleted'],
        ]);
    }
}

