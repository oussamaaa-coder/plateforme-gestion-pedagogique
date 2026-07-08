<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserSetting extends Model
{
    protected $table = 'user_settings';

    protected $fillable = [
        'user_id',
        'theme',
        'locale',
        'notify_email',
        'notify_push',
        'notify_alerts',
        'privacy',
        'security',
    ];

    protected $casts = [
        'notify_email' => 'boolean',
        'notify_push' => 'boolean',
        'notify_alerts' => 'boolean',
        'privacy' => 'array',
        'security' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}

