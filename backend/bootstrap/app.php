<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Validation\ValidationException;
use App\Support\ApiResponse;
use App\Http\Middleware\EnsureRole;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php', // <--- AJOUTE CETTE LIGNE
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->statefulApi();

        $middleware->alias([
            'role' => EnsureRole::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->render(function (ValidationException $e, $request) {
            if (!$request->is('api/*')) {
                return null;
            }

            return ApiResponse::error(
                message: 'Validation échouée.',
                errors: $e->errors(),
                status: 422,
                errorCode: 'VALIDATION_ERROR'
            );
        });

        $exceptions->render(function (AuthorizationException $e, $request) {
            if (!$request->is('api/*')) {
                return null;
            }

            return ApiResponse::error(
                message: $e->getMessage() ?: 'Accès refusé: permissions insuffisantes.',
                errors: null,
                status: 403,
                errorCode: 'FORBIDDEN'
            );
        });

        $exceptions->render(function (ModelNotFoundException $e, $request) {
            if (!$request->is('api/*')) {
                return null;
            }

            return ApiResponse::error(
                message: 'Ressource introuvable.',
                errors: null,
                status: 404,
                errorCode: 'NOT_FOUND'
            );
        });

        $exceptions->render(function (\Throwable $e, $request) {
            if (!$request->is('api/*')) {
                return null;
            }

            return ApiResponse::error(
                message: 'Erreur interne du serveur.',
                errors: app()->hasDebugModeEnabled() ? ['exception' => get_class($e), 'message' => $e->getMessage()] : null,
                status: 500,
                errorCode: 'SERVER_ERROR'
            );
        });
    })->create();
