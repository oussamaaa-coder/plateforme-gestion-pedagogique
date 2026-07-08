<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Note extends Model
{
    // ── Constantes — Types de contrôle ──────────────────────────
    const TYPE_CC           = 'CC';
    const TYPE_EFM          = 'EFM';
    const TYPE_EFM_REGIONAL = 'EFM_Regional';
    const TYPE_EFF          = 'EFF';

    const TYPES = [
        self::TYPE_CC,
        self::TYPE_EFM,
        self::TYPE_EFM_REGIONAL,
        self::TYPE_EFF,
    ];

    protected $fillable = [
        'user_id',
        'module_id',
        'note',
        'type_controle',
        'coefficient',
        'remarque',
        'formateur_id',
    ];

    protected $casts = [
        'note'        => 'decimal:2',
        'coefficient' => 'decimal:2',
    ];

    // ── Relations ──────────────────────────────────────────────

    /** L'étudiant qui a cette note */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /** Alias pour la rétrocompatibilité */
    public function etudiant(): BelongsTo
    {
        return $this->user();
    }

    public function module(): BelongsTo
    {
        return $this->belongsTo(Module::class);
    }

    public function formateur(): BelongsTo
    {
        return $this->belongsTo(User::class, 'formateur_id');
    }

    // ── Scopes ─────────────────────────────────────────────────

    public function scopeTypeControle($query, $type)
    {
        return $query->where('type_controle', $type);
    }

    public function scopeForFiliere($query, $filiereId)
    {
        return $query->whereHas('module', fn($q) => $q->where('filiere_id', $filiereId));
    }

    public function scopeForAnnee($query, $annee)
    {
        return $query->whereHas('module', fn($q) => $q->where('annee', $annee));
    }
}

