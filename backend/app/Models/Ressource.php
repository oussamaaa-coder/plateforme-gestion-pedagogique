<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class Ressource extends Model
{
    const TYPE_COURS = 'Cours';
    const TYPE_TD = 'TD';
    const TYPE_TP = 'TP';

    const TYPES = [
        self::TYPE_COURS,
        self::TYPE_TD,
        self::TYPE_TP,
    ];

    protected $fillable = [
        'titre',
        'type',
        'fichier',
        'module_id',
        'groupe_id',
        'formateur_id',
    ];

    protected $appends = [
        'file_url',
        'file_type',
    ];

    // ── Accesseurs ──────────────────────────────────────
    public function getFileUrlAttribute(): ?string
    {
        if (!$this->fichier) return null;
        return asset('storage/' . $this->fichier);
    }

    public function getTypeIconAttribute(): string
    {
        return match($this->type) {
            self::TYPE_COURS => '📘',
            self::TYPE_TD => '📝',
            self::TYPE_TP => '🔧',
            default => '📄',
        };
    }

    public function getFileTypeAttribute(): string
    {
        if (!$this->fichier) return 'unknown';
        $ext = pathinfo($this->fichier, PATHINFO_EXTENSION);
        return strtoupper($ext);
    }

    // ── Relations ──────────────────────────────────────

    public function module(): BelongsTo
    {
        return $this->belongsTo(Module::class);
    }

    public function groupe(): BelongsTo
    {
        return $this->belongsTo(Groupe::class);
    }

    public function formateur(): BelongsTo
    {
        return $this->belongsTo(User::class, 'formateur_id');
    }

    // ── Scopes ─────────────────────────────────────────

    public function scopeByType($query, $type)
    {
        return $query->where('type', $type);
    }

    public function scopeByFormateur($query, $formateurId)
    {
        return $query->where('formateur_id', $formateurId);
    }

    public function scopeByGroupe($query, $groupeId)
    {
        return $query->where('groupe_id', $groupeId);
    }

    public function scopeByModule($query, $moduleId)
    {
        return $query->where('module_id', $moduleId);
    }

    public function scopeSearchTitle($query, $search)
    {
        return $query->where('titre', 'like', "%{$search}%");
    }
}

