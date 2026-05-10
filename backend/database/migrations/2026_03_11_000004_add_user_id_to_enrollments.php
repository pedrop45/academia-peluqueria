<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration 
{
    public function up(): void
    {
        Schema::table('enrollments', function (Blueprint $table) {
            $table->foreignId('user_id')->nullable()->after('id')->constrained()->nullOnDelete();
            $table->foreignId('order_id')->nullable()->after('user_id')->constrained()->nullOnDelete();
        });
    }
    public function down(): void
    {
        Schema::table('enrollments', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropForeign(['order_id']);
            $table->dropColumn(['user_id', 'order_id']);
        });
    }
};
