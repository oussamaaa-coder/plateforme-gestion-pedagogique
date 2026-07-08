<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Filiere extends Model
{
    protected $fillable = [
        'nom',
        'description',
        'duree',
    ];

    public function groupes(): HasMany
    {
        return $this->hasMany(Groupe::class);
    }

    public function modules(): HasMany
    {
        return $this->hasMany(Module::class);
    }
}

