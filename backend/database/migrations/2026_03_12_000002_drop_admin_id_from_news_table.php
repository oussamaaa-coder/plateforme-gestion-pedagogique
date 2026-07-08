<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasColumn('news', 'admin_id')) {
            Schema::table('news', function (Blueprint $table) {
                try {
                    $table->dropForeign(['admin_id']);
                } catch (\Exception $e) {
                    // FK may not exist — ignore.
                }
                $table->dropColumn('admin_id');
            });
        }
    }

    public function down(): void
    {
        if (!Schema::hasColumn('news', 'admin_id')) {
            Schema::table('news', function (Blueprint $table) {
                // Récréer admin_id en cas de rollback
                $table->foreignId('admin_id')->constrained('users')->cascadeOnDelete();
            });
        }
    }
};
