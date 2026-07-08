<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasColumn('absences', 'etudiant_id')) {
            try {
                Schema::table('absences', function (Blueprint $table) {
                    $table->dropForeign(['etudiant_id']);
                });
            } catch (\Exception $e) {
                // Ignore — FK may not exist.
            }

            Schema::table('absences', function (Blueprint $table) {
                $table->renameColumn('etudiant_id', 'user_id');
            });

            Schema::table('absences', function (Blueprint $table) {
                $table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete();
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('absences', 'user_id')) {
            // Check if the FK actually exists before trying to drop it.
            $database = DB::getDatabaseName();
            $fkExists = DB::select("
                SELECT COUNT(*) as cnt
                FROM information_schema.TABLE_CONSTRAINTS
                WHERE CONSTRAINT_SCHEMA = ?
                  AND TABLE_NAME = 'absences'
                  AND CONSTRAINT_NAME = 'absences_user_id_foreign'
                  AND CONSTRAINT_TYPE = 'FOREIGN KEY'
            ", [$database]);

            if ($fkExists[0]->cnt > 0) {
                Schema::table('absences', function (Blueprint $table) {
                    $table->dropForeign(['user_id']);
                });
            }

            Schema::table('absences', function (Blueprint $table) {
                $table->renameColumn('user_id', 'etudiant_id');
            });

            Schema::table('absences', function (Blueprint $table) {
                $table->foreign('etudiant_id')->references('id')->on('users')->cascadeOnDelete();
            });
        }
    }
};
