<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Ajouter le champ 'annee' (1 ou 2) à la table modules
     * pour distinguer les modules de 1ère et 2ème année.
     */
    public function up(): void
    {
        Schema::table('modules', function (Blueprint $table) {
            $table->unsignedTinyInteger('annee')->default(1)->after('coefficient')
                  ->comment('1 = 1ère année, 2 = 2ème année');
        });
    }

    public function down(): void
    {
        Schema::table('modules', function (Blueprint $table) {
            $table->dropColumn('annee');
        });
    }
};
