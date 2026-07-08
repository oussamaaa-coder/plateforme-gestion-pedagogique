<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasColumn('modules', 'formateur_id')) {
            try {
                Schema::table('modules', function (Blueprint $table) {
                    $table->dropForeign(['formateur_id']);
                });
            } catch (\Exception $e) {
                // FK may not exist — ignore.
            }

            Schema::table('modules', function (Blueprint $table) {
                $table->dropColumn('formateur_id');
            });
        }
    }

    public function down(): void
    {
        if (!Schema::hasColumn('modules', 'formateur_id')) {
            Schema::table('modules', function (Blueprint $table) {
                $table->foreignId('formateur_id')->nullable()->after('filiere_id')->constrained('users')->nullOnDelete();
            });
        }
    }
};
