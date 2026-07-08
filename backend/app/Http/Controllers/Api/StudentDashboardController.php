<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\EmploiTemps;
use App\Models\Ressource;
use App\Models\Absence;
use App\Models\Note;
use App\Support\ApiResponse;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\Cache;

class StudentDashboardController extends Controller
{
    /**
     * Optimized Dashboard Index
     * Consolidates all necessary student data into one response with caching.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        if ($user->role !== 'etudiant') {
            return ApiResponse::error('Accès refusé.', null, 403);
        }

        $cacheKey = "student_dashboard_{$user->id}";
        
        // Caching for 2 minutes to reduce DB load on frequent refreshes
        return Cache::remember($cacheKey, 120, function() use ($user) {
            $today = $this->getFrenchDayName(Carbon::now());
            
            // 1. Full Schedule for current group (for daily focus & sidebar)
            $schedule = EmploiTemps::where('groupe_id', $user->groupe_id)
                ->with(['module:id,nom,code', 'formateur:id,prenom,nom', 'groupe:id,nom'])
                ->get();

            // 2. Recent Resources (limit to 6 for dashboard)
            $resources = Ressource::where('groupe_id', $user->groupe_id)
                ->with(['module:id,nom', 'formateur:id,prenom,nom'])
                ->orderBy('created_at', 'desc')
                ->limit(6)
                ->get();

            // 3. All Absences (needed for rate calculation)
            $absences = Absence::where('user_id', $user->id)
                ->orderBy('date', 'desc')
                ->get();
                
            // 4. All Notes (needed for average)
            $notes = Note::where('user_id', $user->id)
                ->with(['module:id,nom,code'])
                ->get();

            // Stats Calculation (Server-side for better performance)
            $totalAbsences = $absences->count();
            $avgNote = $notes->count() > 0 ? round($notes->avg('note'), 2) : 0;
            $presenceRate = max(0, 100 - ($totalAbsences * 2.5)); // Arbitrary but consistent logic

            return ApiResponse::ok([
                'schedule' => $schedule,
                'resources' => $resources,
                'absences' => $absences,
                'notes' => $notes,
                'stats' => [
                    'average_note' => $avgNote,
                    'total_absences' => $totalAbsences,
                    'presence_rate' => $presenceRate,
                    'total_resources' => $resources->count(),
                ],
                'today_name' => $today
            ]);
        });
    }

    private function getFrenchDayName(Carbon $date)
    {
        $days = [
            'Monday' => 'Lundi', 'Tuesday' => 'Mardi', 'Wednesday' => 'Mercredi',
            'Thursday' => 'Jeudi', 'Friday' => 'Vendredi', 'Saturday' => 'Samedi',
            'Sunday' => 'Dimanche',
        ];
        return $days[$date->format('l')] ?? 'Lundi';
    }
}
