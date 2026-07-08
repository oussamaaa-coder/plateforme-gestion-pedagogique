<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('role', 30)->default('etudiant')->after('id');

            $table->string('nom', 100)->nullable()->after('role');
            $table->string('prenom', 100)->nullable()->after('nom');

            $table->date('date_naissance')->nullable()->after('password');
            $table->string('cne', 20)->nullable()->unique()->after('date_naissance');

            $table->foreignId('filiere_id')->nullable()->after('cne')->constrained('filieres')->nullOnDelete();
            $table->foreignId('groupe_id')->nullable()->after('filiere_id')->constrained('groupes')->nullOnDelete();

            $table->string('annee_scolaire', 20)->nullable()->after('groupe_id');
            $table->string('specialite', 100)->nullable()->after('annee_scolaire');
            $table->string('photo')->nullable()->after('specialite');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['filiere_id']);
            $table->dropForeign(['groupe_id']);

            $table->dropColumn([
                'role',
                'nom',
                'prenom',
                'date_naissance',
                'cne',
                'filiere_id',
                'groupe_id',
                'annee_scolaire',
                'specialite',
                'photo',
            ]);
        });
    }
};

