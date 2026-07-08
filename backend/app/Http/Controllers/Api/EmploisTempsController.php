<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\EmploiTemps;
use App\Support\ApiResponse;
use Illuminate\Http\Request;

class EmploisTempsController extends Controller
{
    public function index(Request $request)
    {
        $query = EmploiTemps::query()->with(['groupe.filiere', 'module', 'formateur']);

        if ($request->filled('groupe_id')) {
            $query->where('groupe_id', $request->integer('groupe_id'));
        }

        if ($request->filled('module_id')) {
            $query->where('module_id', $request->integer('module_id'));
        }

        if ($request->filled('formateur_id')) {
            $query->where('formateur_id', $request->integer('formateur_id'));
        }

        if ($request->filled('jour')) {
            $query->where('jour', $request->query('jour'));
        }

        $perPage = min(max((int) $request->query('per_page', 15), 1), 100);
        $result = $query->orderBy('jour')->orderBy('heure_debut')->paginate($perPage);

        return ApiResponse::ok($result, 'Liste chargée.', [
            'filters' => [
                'groupe_id' => $request->query('groupe_id'),
                'module_id' => $request->query('module_id'),
                'formateur_id' => $request->query('formateur_id'),
                'jour' => $request->query('jour'),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'groupe_id' => ['required', 'integer', 'exists:groupes,id'],
            'module_id' => ['required', 'integer', 'exists:modules,id'],
            'formateur_id' => ['sometimes', 'nullable', 'integer', 'exists:users,id'],
            'jour' => ['required', 'string', 'max:50'],
            'heure_debut' => ['required', 'date_format:H:i'],
            'heure_fin' => ['required', 'date_format:H:i', 'after:heure_debut'],
            'salle' => ['nullable', 'string', 'max:50'],
        ]);

        $assignmentError = $this->checkAssignment($data);
        if ($assignmentError) {
            return ApiResponse::error($assignmentError, null, 422);
        }

        $conflict = $this->checkConflicts($data);
        if ($conflict) {
            return ApiResponse::error($conflict, null, 422);
        }

        $emploi = EmploiTemps::query()->create($data);

        return ApiResponse::ok($emploi->load(['groupe.filiere', 'module', 'formateur']), 'Évènement créé.', [
            'changed' => array_keys($data),
        ], 201);
    }

    public function show(EmploiTemps $emploiTemps)
    {
        return ApiResponse::ok($emploiTemps->load(['groupe.filiere', 'module', 'formateur']), 'Détails chargés.');
    }

    public function update(Request $request, EmploiTemps $emploiTemps)
    {
        $data = $request->validate([
            'groupe_id' => ['sometimes', 'required', 'integer', 'exists:groupes,id'],
            'module_id' => ['sometimes', 'required', 'integer', 'exists:modules,id'],
            'formateur_id' => ['sometimes', 'nullable', 'integer', 'exists:users,id'],
            'jour' => ['sometimes', 'required', 'string', 'max:50'],
            'heure_debut' => ['sometimes', 'required', 'date_format:H:i'],
            'heure_fin' => ['sometimes', 'required', 'date_format:H:i', 'after:heure_debut'],
            'salle' => ['sometimes', 'nullable', 'string', 'max:50'],
        ]);

        $assignmentError = $this->checkAssignment($data, $emploiTemps);
        if ($assignmentError) {
            return ApiResponse::error($assignmentError, null, 422);
        }

        $conflict = $this->checkConflicts($data, $emploiTemps->id);
        if ($conflict) {
            return ApiResponse::error($conflict, null, 422);
        }

        $emploiTemps->fill($data)->save();

        return ApiResponse::ok($emploiTemps->fresh()->load(['groupe.filiere', 'module', 'formateur']), 'Évènement mis à jour.', [
            'changed' => array_keys($data),
        ]);
    }

    private function checkConflicts(array $data, $ignoreId = null)
    {
        $jour = $data['jour'] ?? null;
        $debut = $data['heure_debut'] ?? null;
        $fin = $data['heure_fin'] ?? null;
        $groupeId = $data['groupe_id'] ?? null;
        $moduleId = $data['module_id'] ?? null;

        if (!$jour || !$debut || !$fin) return null;

        // 1. Check Group Conflict
        if ($groupeId) {
            $groupConflict = EmploiTemps::query()
                ->where('jour', $jour)
                ->where('groupe_id', $groupeId)
                ->when($ignoreId, fn($q) => $q->where('id', '!=', $ignoreId))
                ->where(function ($query) use ($debut, $fin) {
                    $query->where('heure_debut', '<', $fin)
                          ->where('heure_fin', '>', $debut);
                })
                ->first();

            if ($groupConflict) {
                return "Ce groupe a déjà un cours prévu à cette heure-là ({$groupConflict->heure_debut} - {$groupConflict->heure_fin}).";
            }
        }

        // 2. Check Trainer Conflict
        $formateurId = $data['formateur_id'] ?? null;

        if ($formateurId) {
            $trainerConflict = EmploiTemps::query()
                ->where('jour', $jour)
                ->when($ignoreId, fn($q) => $q->where('id', '!=', $ignoreId))
                ->where('formateur_id', $formateurId)
                ->where(function ($query) use ($debut, $fin) {
                    $query->where('heure_debut', '<', $fin)
                          ->where('heure_fin', '>', $debut);
                })
                ->first();

            if ($trainerConflict) {
                $trainerName = \App\Models\User::find($formateurId)?->prenom . ' ' . \App\Models\User::find($formateurId)?->nom;
                return "Le formateur {$trainerName} est déjà occupé avec un autre groupe à cette heure-là ({$trainerConflict->heure_debut} - {$trainerConflict->heure_fin}).";
            }
        }

        return null;
    }

    private function checkAssignment(array $data, $existingRecord = null)
    {
        $groupeId = $data['groupe_id'] ?? ($existingRecord ? $existingRecord->groupe_id : null);
        $moduleId = $data['module_id'] ?? ($existingRecord ? $existingRecord->module_id : null);
        $formateurId = $data['formateur_id'] ?? ($existingRecord ? $existingRecord->formateur_id : null);

        // Si le formateur n'est pas renseigné (champ nul), on laisse passer
        if (!$formateurId) return null;

        // Si groupe ou module absent, ce qui ne devrait pas arriver avec la validation
        if (!$groupeId || !$moduleId) return null;

        $exists = \Illuminate\Support\Facades\DB::table('formateur_groupe_module')
            ->where('groupe_id', $groupeId)
            ->where('module_id', $moduleId)
            ->where('formateur_id', $formateurId)
            ->exists();
        
        if (!$exists) {
            return "Ce formateur n'est pas officiellement assigné à ce module pour ce groupe.";
        }

        return null;
    }

    public function generate(Request $request)
    {
        $data = $request->validate([
            'groupe_ids'    => ['required', 'array'],
            'groupe_ids.*'  => ['integer', 'exists:groupes,id'],
            'formateur_ids' => ['required', 'array'],
            'formateur_ids.*' => ['integer', 'exists:users,id'],
            'salles'        => ['required', 'array'],
            'clear_existing' => ['boolean'],
        ]);

        if ($request->boolean('clear_existing')) {
            EmploiTemps::whereIn('groupe_id', $data['groupe_ids'])->delete();
        }

        $days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
        $slots = [
            ['debut' => '08:30', 'fin' => '11:00'],
            ['debut' => '11:00', 'fin' => '13:30'],
            ['debut' => '13:30', 'fin' => '16:00'],
            ['debut' => '16:00', 'fin' => '18:30'],
        ];

        // Load all assignments for the selected groups & trainers
        $assignments = \Illuminate\Support\Facades\DB::table('formateur_groupe_module')
            ->whereIn('groupe_id', $data['groupe_ids'])
            ->whereIn('formateur_id', $data['formateur_ids'])
            ->get()
            ->toArray();

        if (empty($assignments)) {
            return ApiResponse::ok(['count' => 0], 'Aucune assignation trouvée pour les formateurs et groupes sélectionnés.');
        }

        // Shuffle assignments so we don't always favour the same teacher/group
        shuffle($assignments);

        $createdCount = 0;

        // Track which (group_id, module_id) pairs are already scheduled
        // A group should only have ONE teacher per module — no duplicates.
        $scheduledGroupModules = [];

        // NEW APPROACH: For each assignment (group+module+teacher), find a free slot+salle
        // This ensures ALL teachers and groups get sessions, not just the first one found.
        foreach ($assignments as $assign) {
            // Skip if this group+module combination was already scheduled by another teacher
            $pairKey = $assign->groupe_id . '_' . $assign->module_id;
            if (in_array($pairKey, $scheduledGroupModules)) {
                continue;
            }

            $scheduled = false;

            // Shuffle days and slots for variety each run
            $shuffledDays = $days;
            shuffle($shuffledDays);

            foreach ($shuffledDays as $day) {
                if ($scheduled) break;

                $shuffledSlots = $slots;
                shuffle($shuffledSlots);

                foreach ($shuffledSlots as $slot) {
                    if ($scheduled) break;

                    // 1. Is the group already busy in this slot?
                    $groupBusy = EmploiTemps::where('jour', $day)
                        ->where('groupe_id', $assign->groupe_id)
                        ->where(function ($q) use ($slot) {
                            $q->where('heure_debut', '<', $slot['fin'])
                              ->where('heure_fin', '>', $slot['debut']);
                        })->exists();

                    if ($groupBusy) continue;

                    // 2. Is the teacher already busy in this slot?
                    $teacherBusy = EmploiTemps::where('jour', $day)
                        ->where('formateur_id', $assign->formateur_id)
                        ->where(function ($q) use ($slot) {
                            $q->where('heure_debut', '<', $slot['fin'])
                              ->where('heure_fin', '>', $slot['debut']);
                        })->exists();

                    if ($teacherBusy) continue;

                    // 3. Find a free salle for this slot
                    $shuffledSalles = $data['salles'];
                    shuffle($shuffledSalles);

                    foreach ($shuffledSalles as $salleName) {
                        $salleBusy = EmploiTemps::where('jour', $day)
                            ->where('salle', $salleName)
                            ->where(function ($q) use ($slot) {
                                $q->where('heure_debut', '<', $slot['fin'])
                                  ->where('heure_fin', '>', $slot['debut']);
                            })->exists();

                        if ($salleBusy) continue;

                        // All free — create the session!
                        EmploiTemps::create([
                            'groupe_id'    => $assign->groupe_id,
                            'module_id'    => $assign->module_id,
                            'formateur_id' => $assign->formateur_id,
                            'jour'         => $day,
                            'heure_debut'  => $slot['debut'],
                            'heure_fin'    => $slot['fin'],
                            'salle'        => $salleName,
                        ]);

                        $createdCount++;
                        $scheduled = true;
                        // Mark this group+module as done — no other teacher should teach it
                        $scheduledGroupModules[] = $pairKey;
                        break; // Found a salle, stop searching salles
                    }
                }
            }
        }

        return ApiResponse::ok(
            ['count' => $createdCount],
            "Emploi du temps généré avec succès. {$createdCount} session(s) planifiée(s) sur " . count($assignments) . " assignation(s)."
        );
    }

    public function destroy(EmploiTemps $emploiTemps)

    {
        $id = $emploiTemps->id;
        $emploiTemps->delete();

        return ApiResponse::ok(['id' => $id], 'Évènement supprimé.', [
            'changed' => ['deleted'],
        ]);
    }
}

