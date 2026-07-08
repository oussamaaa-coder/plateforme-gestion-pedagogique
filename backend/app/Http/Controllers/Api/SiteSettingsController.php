<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use App\Support\ApiResponse;
use Illuminate\Http\Request;

class SiteSettingsController extends Controller
{
    public function show()
    {
        $settings = SiteSetting::query()->first();
        if (!$settings) {
            $settings = SiteSetting::query()->create([
                'supported_locales' => ['fr', 'en'],
                'default_locale' => 'fr',
                'features' => [
                    'discussions' => true,
                    'resources' => true,
                    'notifications' => true,
                ],
                'themes' => [
                    'allow_custom' => false,
                ],
            ]);
        }

        return ApiResponse::ok($settings, 'Configuration chargée.');
    }

    public function update(Request $request)
    {
        $settings = SiteSetting::query()->firstOrCreate([]);

        $data = $request->validate([
            'supported_locales' => ['sometimes', 'nullable', 'array'],
            'default_locale' => ['sometimes', 'required', 'string', 'max:10'],
            'features' => ['sometimes', 'nullable', 'array'],
            'themes' => ['sometimes', 'nullable', 'array'],
        ]);

        $settings->fill($data)->save();

        return ApiResponse::ok($settings->fresh(), 'Configuration mise à jour.', [
            'changed' => array_keys($data),
        ]);
    }
}

