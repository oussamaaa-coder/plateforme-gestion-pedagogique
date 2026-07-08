<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Groupe;
use App\Support\ApiResponse;
use Illuminate\Http\Request;

class GroupesController extends Controller
{
    public function index(Request $request)
    {
        $query = Groupe::query()->with('filiere')->withCount('students');

        if ($request->filled('filiere_id')) {
            $query->where('filiere_id', $request->integer('filiere_id'));
        }

        if ($request->filled('annee')) {
            $query->where('annee', $request->query('annee'));
        }

        if ($request->boolean('exclude_saturated')) {
            $currentStudentId = $request->integer('current_student_id');
            if ($currentStudentId) {
                $query->where(function($q) use ($currentStudentId) {
                    $q->has('students', '<', 25)
                      ->orWhereHas('students', function($sq) use ($currentStudentId) {
                          $sq->where('id', $currentStudentId);
                      });
                });
            } else {
                $query->has('students', '<', 25);
            }
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

        return ApiResponse::ok($result);
    }

    /**
     * Get the current user's groups (assigned for trainers, joined for students)
     */
    public function myGroups(Request $request)
    {
        $user = $request->user();
        
        if ($user->role === 'admin') {
            return ApiResponse::ok(Groupe::all());
        }

        if ($user->role === 'formateur') {
            return ApiResponse::ok($user->groupesAssignes);
        }

        if ($user->role === 'etudiant') {
            if ($user->groupe_id) {
                return ApiResponse::ok([$user->groupe]);
            }
            return ApiResponse::ok([]);
        }

        return ApiResponse::ok([]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'nom' => ['required', 'string', 'max:50'],
            'filiere_id' => ['required', 'integer', 'exists:filieres,id'],
            'annee' => ['nullable', 'string', 'max:20'],
        ]);

        $groupe = Groupe::query()->create($data);

        return ApiResponse::ok($groupe->load('filiere'), 'Groupe créé.', [
            'changed' => array_keys($data),
        ], 201);
    }

    public function show(Groupe $groupe)
    {
        return ApiResponse::ok($groupe->load('filiere'), 'Détails chargés.');
    }

    public function update(Request $request, Groupe $groupe)
    {
        $data = $request->validate([
            'nom' => ['sometimes', 'required', 'string', 'max:50'],
            'filiere_id' => ['sometimes', 'required', 'integer', 'exists:filieres,id'],
            'annee' => ['sometimes', 'nullable', 'string', 'max:20'],
        ]);

        $groupe->fill($data)->save();

        return ApiResponse::ok($groupe->fresh()->load('filiere'), 'Groupe mis à jour.', [
            'changed' => array_keys($data),
        ]);
    }

    public function destroy(Groupe $groupe)
    {
        $id = $groupe->id;
        $groupe->delete();

        return ApiResponse::ok(['id' => $id], 'Groupe supprimé.', [
            'changed' => ['deleted'],
        ]);
    }
}

