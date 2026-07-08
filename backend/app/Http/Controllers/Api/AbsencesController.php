<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Absence;
use App\Support\ApiResponse;
use Illuminate\Http\Request;

class AbsencesController extends Controller
{
    public function index(Request $request)
    {
        $query = Absence::query()->with(['user', 'module', 'emploiTemps']);

        if ($request->filled('role')) {
            $roleMapping = [
                'student' => 'etudiant',
                'trainer' => 'formateur',
            ];
            $role = $request->query('role');
            $dbRole = $roleMapping[$role] ?? $role;

            $query->whereHas('user', function ($q) use ($dbRole) {
                $q->where('role', $dbRole);
            });
        }

        if ($request->filled('search')) {
            $search = $request->query('search');
            $query->where(function ($q) use ($search) {
                $q->whereHas('user', function ($q2) use ($search) {
                    $q2->where('nom', 'like', "%{$search}%")
                        ->orWhere('prenom', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                })
                ->orWhereHas('module', function ($q2) use ($search) {
                    $q2->where('nom', 'like', "%{$search}%");
                });
            });
        }

        if ($request->user()->role === 'etudiant') {
            $query->where('user_id', $request->user()->id);
        } elseif ($request->filled('user_id')) {
            $query->where('user_id', $request->integer('user_id'));
        }
        if ($request->filled('module_id')) {
            $query->where('module_id', $request->integer('module_id'));
        }
        if ($request->filled('date_from')) {
            $query->whereDate('date', '>=', $request->query('date_from'));
        }
        if ($request->filled('date_to')) {
            $query->whereDate('date', '<=', $request->query('date_to'));
        }

        $perPage = min(max((int) $request->query('per_page', 15), 1), 100);
        $result = $query->orderByDesc('date')->paginate($perPage);

        return ApiResponse::ok($result, 'Liste chargée.', [
            'filters' => [
                'user_id' => $request->query('user_id'),
                'module_id' => $request->query('module_id'),
                'role' => $request->query('role'),
                'date_from' => $request->query('date_from'),
                'date_to' => $request->query('date_to'),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'user_id' => ['required', 'integer', 'exists:users,id'],
            'module_id' => ['required', 'integer', 'exists:modules,id'],
            'date' => ['required', 'date'],
            'nombre_heures' => ['required', 'numeric', 'min:0'],
            'justifie' => ['sometimes', 'boolean'],
            'emploi_temps_id' => ['nullable', 'integer', 'exists:emplois_temps,id'],
        ]);
        $data['justifie'] = $data['justifie'] ?? false;

        $absence = Absence::query()->create($data);

        return ApiResponse::ok($absence->load(['user', 'module', 'emploiTemps']), 'Absence créée.', [
            'changed' => array_keys($data),
        ], 201);
    }

    public function show(Absence $absence)
    {
        if (request()->user()->role === 'etudiant' && $absence->user_id !== request()->user()->id) {
            return ApiResponse::error("Vous n'avez pas la permission de voir cette absence.", null, 403, 'FORBIDDEN');
        }
        
        return ApiResponse::ok($absence->load(['user', 'module', 'emploiTemps']), 'Détails chargés.');
    }

    public function update(Request $request, Absence $absence)
    {
        $data = $request->validate([
            'user_id' => ['sometimes', 'required', 'integer', 'exists:users,id'],
            'module_id' => ['sometimes', 'required', 'integer', 'exists:modules,id'],
            'date' => ['sometimes', 'required', 'date'],
            'nombre_heures' => ['sometimes', 'required', 'numeric', 'min:0'],
            'justifie' => ['sometimes', 'boolean'],
            'emploi_temps_id' => ['sometimes', 'nullable', 'integer', 'exists:emplois_temps,id'],
        ]);

        $absence->fill($data)->save();

        return ApiResponse::ok($absence->fresh()->load(['user', 'module', 'emploiTemps']), 'Absence mise à jour.', [
            'changed' => array_keys($data),
        ]);
    }

    public function destroy(Absence $absence)
    {
        $id = $absence->id;
        $absence->delete();

        return ApiResponse::ok(['id' => $id], 'Absence supprimée.', [
            'changed' => ['deleted'],
        ]);
    }
}

