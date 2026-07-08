<?php

use App\Http\Controllers\Api\AbsencesController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ChannelController;
use App\Http\Controllers\Api\EmploisTempsController;
use App\Http\Controllers\Api\FilieresController;
use App\Http\Controllers\Api\GroupesController;
use App\Http\Controllers\Api\MessageController;
use App\Http\Controllers\Api\ModulesController;
use App\Http\Controllers\Api\NewsController;
use App\Http\Controllers\Api\NotificationsController;
use App\Http\Controllers\Api\PartenairesController;
use App\Http\Controllers\Api\RessourcesController;
use App\Http\Controllers\Api\RoleUsersController;
use App\Http\Controllers\Api\TrainersController;
use App\Http\Controllers\Api\AdministratorsController;
use App\Http\Controllers\Api\SiteSettingsController;
use App\Http\Controllers\Api\UserSettingsController;
use App\Http\Controllers\Api\NotesController;
use App\Http\Controllers\Api\SallesController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\StudentDashboardController;
use App\Http\Controllers\Api\FormateurDashboardController;
use Illuminate\Support\Facades\Route;

Route::middleware('throttle:5,1')->post('/auth/login', [AuthController::class, 'login']);
Route::get('/site-settings', [SiteSettingsController::class, 'show']);
Route::get('/news/public', [NewsController::class, 'public']);
Route::get('/news/public/{news}', [NewsController::class, 'publicShow']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);

    Route::get('/dashboard/stats', [DashboardController::class, 'index']);
    Route::get('/student/dashboard', [StudentDashboardController::class, 'index']);
    Route::get('/formateur/dashboard', [FormateurDashboardController::class, 'index']);

    Route::get('/user-settings', [UserSettingsController::class, 'show']);
    Route::put('/user-settings', [UserSettingsController::class, 'update']);
    Route::get('/my-groups', [GroupesController::class, 'myGroups']);

    // Notifications (user)
    Route::get('/notifications', [NotificationsController::class, 'index']);
    Route::get('/notifications/unread-count', [NotificationsController::class, 'unreadCount']);
    Route::post('/notifications/mark-all-read', [NotificationsController::class, 'markAllRead']);
    Route::post('/notifications/{notification}/mark-read', [NotificationsController::class, 'markRead']);

    // Chat Module
    Route::get('/groups/{id}/channels', [ChannelController::class, 'getGroupChannels']);
    Route::get('/channels/{id}/messages', [MessageController::class, 'index']);
    Route::post('/messages', [MessageController::class, 'store']);

    Route::get('/schedule', [EmploisTempsController::class, 'index']);
    Route::get('/schedule/{emploiTemps}', [EmploisTempsController::class, 'show']);

    // Admin-only configuration & CRUD
    Route::middleware('role:admin')->group(function () {
        Route::put('/site-settings', [SiteSettingsController::class, 'update']);

        // Users by role
        Route::apiResource('students', RoleUsersController::class)->parameters(['students' => 'user']);
        Route::apiResource('trainers', TrainersController::class)->parameters(['trainers' => 'user']);
        Route::get('/trainers/{user}/assignments', [TrainersController::class, 'getAssignments']);
        Route::post('/trainers/{user}/assignments', [TrainersController::class, 'syncAssignments']);
        Route::get('/assignments', [TrainersController::class, 'allAssignments']);
        Route::apiResource('administrators', AdministratorsController::class)->parameters(['administrators' => 'user']);

        Route::apiResource('filieres', FilieresController::class);
        Route::apiResource('groupes', GroupesController::class);
        Route::apiResource('modules', ModulesController::class);
        Route::get('/salles/{salle}/occupancy', [SallesController::class, 'occupancy']);
        Route::apiResource('salles', SallesController::class);
        
        Route::apiResource('schedule', EmploisTempsController::class)->except(['index', 'show'])->parameters(['schedule' => 'emploiTemps']);
        Route::post('/schedule/generate', [EmploisTempsController::class, 'generate']);

        Route::apiResource('partners', PartenairesController::class)->parameters(['partners' => 'partenaire']);
        Route::post('/news/ai-generate', [NewsController::class, 'aiGenerate']);
        Route::apiResource('news', NewsController::class);

        Route::post('/notifications', [NotificationsController::class, 'store']);
        Route::post('/notifications/broadcast', [NotificationsController::class, 'broadcast']);
        Route::get('/notifications/all', [NotificationsController::class, 'all']);
        Route::delete('/notifications/{notification}', [NotificationsController::class, 'destroy']);
    });

    // Resources (All roles can see, but only formateur/admin can manage)
    Route::middleware('role:formateur,admin,etudiant')->group(function () {
        Route::get('/resources', [RessourcesController::class, 'index']);
        Route::get('/resources/{ressource}', [RessourcesController::class, 'show']);
        
        // Notes & Absences (scoping is handled in controllers)
        Route::get('/notes', [NotesController::class, 'index']);
        Route::get('/notes/{note}', [NotesController::class, 'show']);
        Route::get('/absences', [AbsencesController::class, 'index']);
        Route::get('/absences/{absence}', [AbsencesController::class, 'show']);
    });

    // Formateur (et admin) pour notes/absences/ressources (management)/emplois
    Route::middleware('role:formateur,admin')->group(function () {
        Route::get('/formateur/groupes', [TrainersController::class, 'myGroupes']);
        Route::get('/formateur/groupes/{groupe}/students', [TrainersController::class, 'groupStudents']);
        Route::get('/formateur/groupes/{groupe}/modules', [TrainersController::class, 'myModulesForGroup']);
        Route::post('/formateur/send-message', [TrainersController::class, 'sendMessageToStudent']);
        
        Route::apiResource('notes', NotesController::class)->except(['index', 'show']);
        Route::apiResource('absences', AbsencesController::class)->except(['index', 'show']);
        Route::apiResource('resources', RessourcesController::class)->except(['index', 'show'])->parameters(['resources' => 'ressource']);
    });
});
