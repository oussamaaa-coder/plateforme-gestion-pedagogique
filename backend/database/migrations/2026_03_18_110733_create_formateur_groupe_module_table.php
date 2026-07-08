<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('formateur_groupe_module', function (Blueprint $row) {
            $row->id();
            $row->foreignId('formateur_id')->constrained('users')->onDelete('cascade');
            $row->foreignId('groupe_id')->constrained('groupes')->onDelete('cascade');
            $row->foreignId('module_id')->constrained('modules')->onDelete('cascade');
            $row->timestamps();

            // Unique assignment per (trainer, group, module)
            $row->unique(['formateur_id', 'groupe_id', 'module_id'], 'formateur_assignment_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('formateur_groupe_module');
    }
};
