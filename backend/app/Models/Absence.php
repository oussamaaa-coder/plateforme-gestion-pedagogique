<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Absence extends Model
{
    protected $fillable = [
        'user_id',
        'module_id',
        'date',
        'nombre_heures',
        'justifie',
        'emploi_temps_id',
    ];

    protected $casts = [
        'date' => 'date',
        'justifie' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function module(): BelongsTo
    {
        return $this->belongsTo(Module::class);
    }

    public function emploiTemps(): BelongsTo
    {
        return $this->belongsTo(EmploiTemps::class, 'emploi_temps_id');
    }
}

