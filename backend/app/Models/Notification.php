<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Notification extends Model
{
    protected $fillable = [
        'user_id',
        'message',
        'title',
        'type',
        'is_read',
    ];

    protected $casts = [
        'is_read' => 'boolean',
    ];

    protected $attributes = [
        'type' => 'info',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}

