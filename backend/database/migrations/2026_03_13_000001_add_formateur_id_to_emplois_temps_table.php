<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('emplois_temps', function (Blueprint $table) {
            $table->foreignId('formateur_id')->nullable()->after('module_id')->constrained('users')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('emplois_temps', function (Blueprint $table) {
            $table->dropForeign(['formateur_id']);
            $table->dropColumn('formateur_id');
        });
    }
};
