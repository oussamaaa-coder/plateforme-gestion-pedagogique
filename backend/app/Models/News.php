<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class News extends Model
{
    protected $table = 'news';

    protected $fillable = [
        'titre',
        'contenu',
        'image',
        'resume',
        'auteur_id',
        'statut',
        'vues',
        'date_publication',
    ];

    protected $casts = [
        'date_publication' => 'date',
    ];

    protected $appends = ['image_url'];

    // ✅ ACCESSOR - Génère l'URL COMPLÈTE de l'image
    public function getImageUrlAttribute(): ?string
    {
        if (!$this->image) {
            return null;
        }
        // Retourne l'URL complète accessible via /storage/news/...
        return Storage::disk('public')->url($this->image);
    }

    public function auteur(): BelongsTo
    {
        return $this->belongsTo(User::class, 'auteur_id');
    }
}

