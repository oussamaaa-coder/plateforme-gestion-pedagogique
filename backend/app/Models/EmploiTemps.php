<?php

namespace App\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EmploiTemps extends Model
{
    protected $table = 'emplois_temps';

    protected $fillable = [
        'groupe_id',
        'module_id',
        'formateur_id',
        'jour',
        'heure_debut',
        'heure_fin',
        'salle',
    ];

    public function groupe(): BelongsTo
    {
        return $this->belongsTo(Groupe::class);
    }

    public function module(): BelongsTo
    {
        return $this->belongsTo(Module::class);
    }

    public function formateur(): BelongsTo
    {
        return $this->belongsTo(User::class, 'formateur_id');
    }
}

