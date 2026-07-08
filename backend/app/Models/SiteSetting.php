<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SiteSetting extends Model
{
    protected $table = 'site_settings';

    protected $fillable = [
        'supported_locales',
        'default_locale',
        'features',
        'themes',
    ];

    protected $casts = [
        'supported_locales' => 'array',
        'features' => 'array',
        'themes' => 'array',
    ];
}

