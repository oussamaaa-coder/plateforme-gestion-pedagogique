<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Module extends Model
{
    protected $fillable = [
        'nom',
        'coefficient',
        'annee',
        'filiere_id',
    ];

    protected $casts = [
        'annee' => 'integer',
        'coefficient' => 'decimal:2',
    ];

    // ── Relations ──────────────────────────────────────────────

    public function filiere(): BelongsTo
    {
        return $this->belongsTo(Filiere::class);
    }

    public function notes(): HasMany
    {
        return $this->hasMany(Note::class);
    }

    public function ressources(): HasMany
    {
        return $this->hasMany(Ressource::class);
    }

    // ── Scopes ─────────────────────────────────────────────────

    public function scopeAnnee($query, $annee)
    {
        return $query->where('annee', $annee);
    }

    public function scopeFiliere($query, $filiereId)
    {
        return $query->where('filiere_id', $filiereId);
    }
}


