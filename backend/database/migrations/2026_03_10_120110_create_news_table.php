<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('news', function (Blueprint $table) {
            $table->id();
            $table->string('titre', 150);
            $table->text('contenu');
            $table->string('image')->nullable();
            $table->foreignId('admin_id')->constrained('users')->cascadeOnDelete();
            $table->date('date_publication')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('news');
    }
};

