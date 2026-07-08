<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('site_settings', function (Blueprint $table) {
            $table->id();
            $table->json('supported_locales')->nullable(); // ["fr","en"]
            $table->string('default_locale', 10)->default('fr');
            $table->json('features')->nullable(); // {"discussions":true,"resources":true,...}
            $table->json('themes')->nullable(); // {"allow_custom":false,"primary":"#..."}
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('site_settings');
    }
};

