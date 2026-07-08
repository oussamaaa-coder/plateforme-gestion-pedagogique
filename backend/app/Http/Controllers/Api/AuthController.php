<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\UserSetting;
use App\Support\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $data = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
            'expected_role' => ['required', 'string', 'in:admin,formateur,etudiant'],
            'device_name' => ['nullable', 'string', 'max:100'],
        ]);

        /** @var User|null $user */
        $user = User::query()->where('email', $data['email'])->first();
        if (!$user || !Hash::check($data['password'], $user->password)) {
            return ApiResponse::error('Email ou mot de passe incorrect.', null, 401, 'INVALID_CREDENTIALS');
        }

        if ($user->role !== $data['expected_role']) {
            return ApiResponse::error('Accès non autorisé pour ce type de compte.', null, 403, 'INVALID_ROLE');
        }

        $tokenName = $data['device_name'] ?? 'api';
        $token = $user->createToken($tokenName)->plainTextToken;

        UserSetting::query()->firstOrCreate(['user_id' => $user->id]);

        return ApiResponse::ok([
            'token' => $token,
            'user' => $user->fresh()->load('groupe.filiere'),
        ], 'Connexion réussie.');
    }

    public function me(Request $request)
    {
        $user = $request->user()->load('groupe.filiere');
        $settings = UserSetting::query()->firstOrCreate(['user_id' => $user->id]);

        return ApiResponse::ok([
            'user' => $user,
            'settings' => $settings,
        ], 'Profil chargé.');
    }

    public function logout(Request $request)
    {
        $user = $request->user();
        $token = $user?->currentAccessToken();

        if ($token) {
            $token->delete();
        }

        return ApiResponse::ok(null, 'Déconnexion réussie.');
    }
}

