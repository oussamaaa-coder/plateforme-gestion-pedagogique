<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\EmploiTemps;
use App\Models\Ressource;
use App\Models\Groupe;
use App\Models\Absence;
use App\Support\ApiResponse;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class FormateurDashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        if ($user->role !== 'formateur' && $user->role !== 'admin') {
            return ApiResponse::error('Accès refusé.', null, 403);
        }

        $today = $this->getFrenchDayName(Carbon::now());

        // 1. Emploi du temps du jour pour ce formateur
        $todaySchedule = EmploiTemps::where('formateur_id', $user->id)
            ->where('jour', $today)
            ->with(['module', 'groupe'])
            ->orderBy('heure_debut')
            ->get();

        // 2. Nombre de groupes sous sa responsabilité
        $myGroupsCount = DB::table('formateur_groupe_module')
            ->where('formateur_id', $user->id)
            ->distinct('groupe_id')
            ->count();
            
        $totalStudentsInMyGroups = DB::table('formateur_groupe_module')
            ->where('formateur_id', $user->id)
            ->join('users', 'formateur_groupe_module.groupe_id', '=', 'users.groupe_id')
            ->where('users.role', 'etudiant')
            ->distinct('users.id')
            ->count();

        // 3. Ressources partagées par lui (avec détails récents)
        $myResCount = Ressource::where('formateur_id', $user->id)->count();
        $recentResources = Ressource::where('formateur_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        return ApiResponse::ok([
            'today_schedule' => $todaySchedule,
            'recent_resources' => $recentResources,
            'stats' => [
                'my_groups_count' => $myGroupsCount,
                'total_students' => $totalStudentsInMyGroups,
                'my_resources_count' => $myResCount,
            ],
            'today_name' => $today
        ]);

    }

    private function getFrenchDayName(Carbon $date)
    {
        $days = [
            'Monday' => 'Lundi',
            'Tuesday' => 'Mardi',
            'Wednesday' => 'Mercredi',
            'Thursday' => 'Jeudi',
            'Friday' => 'Vendredi',
            'Saturday' => 'Samedi',
            'Sunday' => 'Dimanche',
        ];

        return $days[$date->format('l')] ?? 'Lundi';
    }
}
