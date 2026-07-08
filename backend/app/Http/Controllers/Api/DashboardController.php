<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Groupe;
use App\Models\Module;
use App\Models\Filiere;
use App\Models\News;
use App\Models\Absence;
use App\Models\Note;
use App\Support\ApiResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        // Statistics
        $stats = [
            'students_count' => User::where('role', 'etudiant')->count(),
            'trainers_count' => User::where('role', 'formateur')->count(),
            'admins_count' => User::where('role', 'admin')->count(),
            'groupes_count' => Groupe::count(),
            'modules_count' => Module::count(),
            'filieres_count' => Filiere::count(),
        ];

        // Recent Activity
        $recent_news = News::with('auteur')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        $recent_absences = Absence::with(['user', 'user.groupe'])
            ->orderBy('date', 'desc')
            ->limit(5)
            ->get();

        // Optional: Distribution by Filiere
        $filiere_distribution = User::where('role', 'etudiant')
            ->select('filiere_id', \DB::raw('count(*) as total'))
            ->with('filiere')
            ->groupBy('filiere_id')
            ->get();

        return ApiResponse::ok([
            'stats' => $stats,
            'recent_news' => $recent_news,
            'recent_absences' => $recent_absences,
            'filiere_distribution' => $filiere_distribution,
        ], 'Statistiques du dashboard chargées.');
    }
}
