<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Groupe extends Model
{
    protected $fillable = [
        'nom',
        'filiere_id',
        'annee',
    ];

    public function filiere(): BelongsTo
    {
        return $this->belongsTo(Filiere::class);
    }

    public function emploisTemps(): HasMany
    {
        return $this->hasMany(EmploiTemps::class);
    }

    public function students(): HasMany
    {
        return $this->hasMany(User::class, 'groupe_id');
    }

    /**
     * The "booted" method of the model.
     * Automatically create a "Général" channel when a group is created.
     */
    protected static function booted()
    {
        static::created(function ($groupe) {
            // Create General channel
            $groupe->channels()->create([
                'name' => 'Général',
            ]);

            // If the group belongs to a filiere, create channels for all its modules
            if ($groupe->filiere) {
                foreach ($groupe->filiere->modules as $module) {
                    $groupe->channels()->create([
                        'name' => $module->nom,
                        'module_id' => $module->id,
                    ]);
                }
            }
        });
    }

    public function channels(): HasMany
    {
        return $this->hasMany(Channel::class, 'groupe_id');
    }
}

