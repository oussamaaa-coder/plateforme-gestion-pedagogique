<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Restructurer la table 'notes' :
     * - Renommer etudiant_id → user_id
     * - Remplacer type (CC/Examen) → type_controle (CC/EFM/EFM_Regional/EFF)
     * - Ajouter coefficient et remarque
     */
    public function up(): void
    {
        // 1. Renommer etudiant_id → user_id (guard the FK drop)
        if (Schema::hasColumn('notes', 'etudiant_id')) {
            try {
                Schema::table('notes', function (Blueprint $table) {
                    $table->dropForeign(['etudiant_id']);
                });
            } catch (\Exception $e) {
                // FK may not exist — ignore.
            }

            Schema::table('notes', function (Blueprint $table) {
                $table->renameColumn('etudiant_id', 'user_id');
            });
        }

        if (Schema::hasColumn('notes', 'user_id')) {
            // Recréer la FK sous le nouveau nom (ignore if already exists)
            try {
                Schema::table('notes', function (Blueprint $table) {
                    $table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete();
                });
            } catch (\Exception $e) {}
        }

        // 2. Migrer les données : Examen → EFM
        DB::table('notes')->where('type', 'Examen')->update(['type' => 'EFM']);

        // 3. Supprimer l'ancien champ 'type' et créer 'type_controle'
        if (Schema::hasColumn('notes', 'type')) {
            Schema::table('notes', function (Blueprint $table) {
                $table->dropColumn('type');
            });
        }

        if (!Schema::hasColumn('notes', 'type_controle')) {
            Schema::table('notes', function (Blueprint $table) {
                $table->enum('type_controle', ['CC', 'EFM', 'EFM_Regional', 'EFF'])
                      ->default('CC')
                      ->after('note');

                // 4. Ajouter coefficient et remarque
                $table->decimal('coefficient', 5, 2)->default(1)->after('type_controle');
                $table->text('remarque')->nullable()->after('coefficient');
            });
        }
    }

    public function down(): void
    {
        $toDrop = array_filter(
            ['type_controle', 'coefficient', 'remarque'],
            fn($col) => Schema::hasColumn('notes', $col)
        );
        if (!empty($toDrop)) {
            Schema::table('notes', function (Blueprint $table) use ($toDrop) {
                $table->dropColumn(array_values($toDrop));
            });
        }

        if (!Schema::hasColumn('notes', 'type')) {
            Schema::table('notes', function (Blueprint $table) {
                $table->enum('type', ['CC', 'Examen'])->default('CC')->after('note');
            });
        }

        // Drop user_id FK only if it actually exists
        if (Schema::hasColumn('notes', 'user_id')) {
            $database = DB::getDatabaseName();
            $fkExists = DB::select("
                SELECT COUNT(*) as cnt FROM information_schema.TABLE_CONSTRAINTS
                WHERE CONSTRAINT_SCHEMA = ? AND TABLE_NAME = 'notes'
                  AND CONSTRAINT_NAME = 'notes_user_id_foreign'
                  AND CONSTRAINT_TYPE = 'FOREIGN KEY'
            ", [$database]);

            if ($fkExists[0]->cnt > 0) {
                Schema::table('notes', function (Blueprint $table) {
                    $table->dropForeign(['user_id']);
                });
            }

            Schema::table('notes', function (Blueprint $table) {
                $table->renameColumn('user_id', 'etudiant_id');
            });

            try {
                Schema::table('notes', function (Blueprint $table) {
                    $table->foreign('etudiant_id')->references('id')->on('users')->cascadeOnDelete();
                });
            } catch (\Exception $e) {}
        }
    }
};
