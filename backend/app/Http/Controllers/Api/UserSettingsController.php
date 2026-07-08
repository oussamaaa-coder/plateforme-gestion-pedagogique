<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\UserSetting;
use App\Support\ApiResponse;
use Illuminate\Http\Request;

class UserSettingsController extends Controller
{
    public function show(Request $request)
    {
        $settings = UserSetting::query()->firstOrCreate(['user_id' => $request->user()->id]);
        return ApiResponse::ok($settings, 'Paramètres chargés.');
    }

    public function update(Request $request)
    {
        $settings = UserSetting::query()->firstOrCreate(['user_id' => $request->user()->id]);

        $data = $request->validate([
            'theme' => ['sometimes', 'required', 'in:light,dark'],
            'locale' => ['sometimes', 'required', 'string', 'max:10'],
            'notify_email' => ['sometimes', 'required', 'boolean'],
            'notify_push' => ['sometimes', 'required', 'boolean'],
            'notify_alerts' => ['sometimes', 'required', 'boolean'],
            'privacy' => ['sometimes', 'nullable', 'array'],
            'security' => ['sometimes', 'nullable', 'array'],
        ]);

        $settings->fill($data)->save();

        return ApiResponse::ok($settings->fresh(), 'Paramètres mis à jour.', [
            'changed' => array_keys($data),
        ]);
    }
}

