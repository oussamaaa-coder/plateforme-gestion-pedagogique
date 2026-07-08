<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\EmploiTemps;
use App\Models\Salle;
use Illuminate\Http\Request;

class SallesController extends Controller
{
    /**
     * Display a listing of the resource, with occupancy counts.
     */
    public function index(Request $request)
    {
        $query = Salle::query()->withCount('emploiTemps');

        if ($request->has('search')) {
            $search = $request->search;
            $query->where('nom', 'like', "%{$search}%")
                  ->orWhere('type', 'like', "%{$search}%");
        }

        if ($request->has('per_page')) {
            return $query->latest()->paginate($request->per_page);
        }

        return $query->latest()->get();
    }

    /**
     * Return full occupancy detail for a single room:
     * which groups use it, on which day/hours.
     */
    public function occupancy(Salle $salle)
    {
        $sessions = EmploiTemps::where('salle', $salle->nom)
            ->with(['groupe', 'module', 'formateur'])
            ->orderByRaw("FIELD(jour, 'Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi')")
            ->orderBy('heure_debut')
            ->get();

        // Unique groups
        $groupes = $sessions->pluck('groupe')->filter()->unique('id')->values();

        return response()->json([
            'salle'   => $salle,
            'groupes' => $groupes,
            'sessions' => $sessions,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom'      => 'required|string|max:255|unique:salles',
            'capacite' => 'nullable|integer|min:1',
            'type'     => 'nullable|string|in:Cours,Spécialisation',
        ]);

        $salle = Salle::create($validated);

        return response()->json([
            'message' => 'Salle créée avec succès',
            'data'    => $salle,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Salle $salle)
    {
        return response()->json($salle->loadCount('emploiTemps'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Salle $salle)
    {
        $validated = $request->validate([
            'nom'      => 'required|string|max:255|unique:salles,nom,' . $salle->id,
            'capacite' => 'nullable|integer|min:1',
            'type'     => 'nullable|string|in:Cours,Spécialisation',
        ]);

        $salle->update($validated);

        return response()->json([
            'message' => 'Salle mise à jour avec succès',
            'data'    => $salle,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Salle $salle)
    {
        $salle->delete();

        return response()->json([
            'message' => 'Salle supprimée avec succès',
        ]);
    }
}
