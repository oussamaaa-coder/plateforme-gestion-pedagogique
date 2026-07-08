<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Salle extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom',
        'capacite',
        'type',
    ];

    /**
     * Schedule sessions held in this room (matched by room name string).
     */
    public function emploiTemps(): HasMany
    {
        return $this->hasMany(EmploiTemps::class, 'salle', 'nom');
    }
}
