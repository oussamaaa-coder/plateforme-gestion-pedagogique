<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('news', function (Blueprint $table) {
            // Ajouter les colonnes manquantes si elles n'existent pas
            if (!Schema::hasColumn('news', 'statut')) {
                $table->enum('statut', ['brouillon', 'publiee', 'archivee'])->default('brouillon')->after('admin_id');
            }
            if (!Schema::hasColumn('news', 'resume')) {
                $table->text('resume')->nullable()->after('contenu');
            }
            if (!Schema::hasColumn('news', 'auteur_id')) {
                $table->foreignId('auteur_id')->default(1)->constrained('users')->cascadeOnDelete();
            }
            if (!Schema::hasColumn('news', 'vues')) {
                $table->integer('vues')->default(0)->after('date_publication');
            }
        });
    }

    public function down(): void
    {
        // Drop FK on auteur_id first (MySQL error 1828 if we try to drop the column directly).
        try {
            Schema::table('news', function (Blueprint $table) {
                $table->dropForeign(['auteur_id']);
            });
        } catch (\Exception $e) {
            // FK may already be gone — safe to ignore.
        }

        $toDrop = array_filter(
            ['statut', 'resume', 'auteur_id', 'vues'],
            fn($col) => Schema::hasColumn('news', $col)
        );

        if (!empty($toDrop)) {
            Schema::table('news', function (Blueprint $table) use ($toDrop) {
                $table->dropColumn(array_values($toDrop));
            });
        }
    }
};
