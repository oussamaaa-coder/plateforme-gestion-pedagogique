<?php

namespace App\Http\Controllers\Api;

class TrainersController extends RoleUsersController
{
    protected function role(): string
    {
        return 'formateur';
    }

    public function index(\Illuminate\Http\Request $request)
    {
        $query = \App\Models\User::query()->with('groupesAssignes')->where('role', 'formateur');

        if ($search = $request->query('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('nom', 'like', "%{$search}%")
                    ->orWhere('prenom', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhereRaw("CONCAT(prenom, ' ', nom) like ?", ["%{$search}%"])
                    ->orWhereRaw("CONCAT(nom, ' ', prenom) like ?", ["%{$search}%"]);
            });
        }

        $perPage = min(max((int) $request->query('per_page', 100), 1), 500);
        $result = $query->orderBy('nom')->orderBy('prenom')->paginate($perPage);

        return \App\Support\ApiResponse::ok($result, 'Liste des formateurs chargée.');
    }

    /**
     * Groupes assignés au formateur connecté
     */
    public function myGroupes(\Illuminate\Http\Request $request)
    {
        $user = $request->user();
        if ($user->role !== 'formateur' && $user->role !== 'admin') {
            return \App\Support\ApiResponse::error('Non autorisé.', null, 403);
        }

        $query = $user->groupesAssignes()
            ->with('filiere')
            ->withCount('students');

        if ($search = $request->query('search')) {
            $query->where('nom', 'like', "%{$search}%");
        }

        return \App\Support\ApiResponse::ok($query->get(), 'Mes groupes chargés.');
    }

    /**
     * Étudiants d'un groupe spécifique
     */
    public function groupStudents(\Illuminate\Http\Request $request, \App\Models\Groupe $groupe)
    {
        $query = \App\Models\User::query()
            ->with('filiere')
            ->where('role', 'etudiant')
            ->where('groupe_id', $groupe->id);

        if ($search = $request->query('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('nom', 'like', "%{$search}%")
                    ->orWhere('prenom', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('cin', 'like', "%{$search}%");
            });
        }

        $students = $query->orderBy('numero_liste')
            ->orderBy('nom')
            ->get();

        return \App\Support\ApiResponse::ok($students, 'Liste des étudiants chargée.');
    }


    /**
     * Modules assignés au formateur pour un groupe spécifique
     */
    public function myModulesForGroup(\Illuminate\Http\Request $request, \App\Models\Groupe $groupe)
    {
        $user = $request->user();
        $modules = \App\Models\Module::query()
            ->whereIn('id', function($q) use ($user, $groupe) {
                $q->select('module_id')
                  ->from('formateur_groupe_module')
                  ->where('formateur_id', $user->id)
                  ->where('groupe_id', $groupe->id);
            })
            ->with('filiere')
            ->get();

        return \App\Support\ApiResponse::ok($modules, 'Mes modules pour ce groupe chargés.');
    }

    /**
     * Liste des assignations (groupe + module) pour un formateur
     */
    public function getAssignments(\App\Models\User $user)
    {
        $assignments = \DB::table('formateur_groupe_module')
            ->where('formateur_id', $user->id)
            ->get();
        
        return \App\Support\ApiResponse::ok($assignments, 'Assignations chargées.');
    }

    /**
     * Synchroniser les assignations (groupe + module) pour un formateur
     */
    public function syncAssignments(\Illuminate\Http\Request $request, \App\Models\User $user)
    {
        $request->validate([
            'assignments' => ['required', 'array'],
            'assignments.*.groupe_id' => ['required', 'exists:groupes,id'],
            'assignments.*.module_id' => ['required', 'exists:modules,id'],
        ]);

        $conflicts = [];

        foreach ($request->assignments as $item) {
            // Check if this (groupe, module) is already assigned to a DIFFERENT formateur
            $existing = \DB::table('formateur_groupe_module')
                ->where('groupe_id', $item['groupe_id'])
                ->where('module_id', $item['module_id'])
                ->where('formateur_id', '!=', $user->id)
                ->first();

            if ($existing) {
                $otherTrainer = \App\Models\User::find($existing->formateur_id);
                $groupe = \App\Models\Groupe::find($item['groupe_id']);
                $module = \App\Models\Module::find($item['module_id']);

                $conflicts[] = sprintf(
                    'Le module "%s" pour le groupe "%s" est déjà assigné à %s %s.',
                    $module?->nom ?? "ID:{$item['module_id']}",
                    $groupe?->nom ?? "ID:{$item['groupe_id']}",
                    $otherTrainer?->prenom ?? '',
                    $otherTrainer?->nom ?? "ID:{$existing->formateur_id}"
                );
            }
        }

        if (!empty($conflicts)) {
            return \App\Support\ApiResponse::error(
                'Conflits détectés : ' . implode(' | ', $conflicts),
                ['conflicts' => $conflicts],
                422
            );
        }

        \DB::transaction(function() use ($request, $user) {
            \DB::table('formateur_groupe_module')->where('formateur_id', $user->id)->delete();
            
            foreach ($request->assignments as $item) {
                \DB::table('formateur_groupe_module')->insert([
                    'formateur_id' => $user->id,
                    'groupe_id'    => $item['groupe_id'],
                    'module_id'    => $item['module_id'],
                    'created_at'   => now(),
                    'updated_at'   => now(),
                ]);
            }
        });

        return \App\Support\ApiResponse::ok(null, 'Assignations synchronisées.');
    }


    /**
     * Liste filtrable de TOUTES les assignations
     */
    public function allAssignments(\Illuminate\Http\Request $request)
    {
        $query = \DB::table('formateur_groupe_module');
        if ($request->has('groupe_id')) $query->where('groupe_id', $request->groupe_id);
        if ($request->has('formateur_id')) $query->where('formateur_id', $request->formateur_id);
        
        return \App\Support\ApiResponse::ok($query->get(), 'Assignations chargées.');
    }

    /**
     * Envoyer un message direct à un étudiant (via notification)
     */
    public function sendMessageToStudent(\Illuminate\Http\Request $request)
    {
        $request->validate([
            'student_id' => 'required|exists:users,id',
            'message' => 'required|string|min:3',
        ]);

        $sender = auth()->user();
        $student = \App\Models\User::find($request->student_id);

        // Créer une notification pour l'étudiant
        $notification = \App\Models\Notification::create([
            'user_id' => $student->id,
            'type' => 'message_direct',
            'data' => [
                'title' => "Message de {$sender->prenom} {$sender->nom}",
                'message' => $request->message,
                'sender_id' => $sender->id,
                'sender_name' => "{$sender->prenom} {$sender->nom}",
                'sent_at' => now()->toIso8601String()
            ],
            'read_at' => null
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Message envoyé avec succès.',
            'data' => $notification
        ]);
    }
}

