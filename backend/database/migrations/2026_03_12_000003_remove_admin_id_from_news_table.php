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
                if (Schema::hasColumn('news', 'admin_id')) {
                    $table->dropForeign(['admin_id']);
                    $table->dropColumn('admin_id');
                }
            });
        }
    }

    public function down(): void
    {
        if (! Schema::hasColumn('news', 'admin_id')) {
            Schema::table('news', function (Blueprint $table) {
                $table->foreignId('admin_id')->constrained('users')->cascadeOnDelete();
            });
        }
    }
};