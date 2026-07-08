<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'role',
        'nom',
        'prenom',
        'email',
        'password',
        'date_naissance',
        'cin',
        'filiere_id',
        'groupe_id',
        'numero_liste',
        'annee_scolaire',
        'specialite',
        'photo',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'date_naissance' => 'date',
        ];
    }

    public function filiere(): BelongsTo
    {
        return $this->belongsTo(Filiere::class);
    }

    public function groupe(): BelongsTo
    {
        return $this->belongsTo(Groupe::class);
    }

    /**
     * Groupes assignés au formateur via la table d'assignation directe
     */
    public function groupesAssignes(): BelongsToMany
    {
        return $this->belongsToMany(Groupe::class, 'formateur_groupe_module', 'formateur_id', 'groupe_id')
                    ->distinct();
    }

    /**
     * Modules assignés au formateur via la table d'assignation directe
     */
    public function modulesAssignes(): BelongsToMany
    {
        return $this->belongsToMany(Module::class, 'formateur_groupe_module', 'formateur_id', 'module_id')
                    ->distinct();
    }

    /**
     * Notes de l'étudiant
     */
    public function notes(): HasMany
    {
        return $this->hasMany(Note::class, 'user_id');
    }

    /**
     * Absences de l'étudiant
     */
    public function absences(): HasMany
    {
        return $this->hasMany(Absence::class, 'user_id');
    }

    /**
     * Réordonner les étudiants d'un groupe par NOM dans l'ordre alphabétique
     */
    public static function reorderGroup(int $groupId): void
    {
        $students = self::query()
            ->where('role', 'etudiant')
            ->where('groupe_id', $groupId)
            ->orderBy('nom')
            ->orderBy('id')
            ->get();

        foreach ($students as $index => $student) {
            $expectedNumber = $index + 1;
            if ($student->numero_liste !== $expectedNumber) {
                self::query()->where('id', $student->id)->update(['numero_liste' => $expectedNumber]);
            }
        }
    }

    /**
     * The "booted" method of the model to register model event listeners.
     */
    protected static function booted()
    {
        static::saved(function (User $user) {
            if ($user->role === 'etudiant' && $user->groupe_id) {
                self::reorderGroup($user->groupe_id);

                if ($user->wasChanged('groupe_id')) {
                    $oldGroupId = $user->getOriginal('groupe_id');
                    if ($oldGroupId) {
                        self::reorderGroup($oldGroupId);
                    }
                }
            }
        });

        static::deleted(function (User $user) {
            if ($user->role === 'etudiant' && $user->groupe_id) {
                self::reorderGroup($user->groupe_id);
            }
        });
    }
}
