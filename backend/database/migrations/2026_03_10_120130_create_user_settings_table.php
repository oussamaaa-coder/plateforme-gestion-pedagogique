<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_settings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained('users')->cascadeOnDelete();
            $table->string('theme', 20)->default('light'); // light|dark
            $table->string('locale', 10)->default('fr');
            $table->boolean('notify_email')->default(true);
            $table->boolean('notify_push')->default(false);
            $table->boolean('notify_alerts')->default(true);
            $table->json('privacy')->nullable();
            $table->json('security')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_settings');
    }
};

