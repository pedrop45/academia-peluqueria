<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration 
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('buyer_name');
            $table->string('buyer_email');
            $table->string('buyer_phone')->nullable();
            $table->decimal('total', 10, 2)->default(0);
            $table->enum('status', ['pending', 'paid', 'cancelled', 'failed'])->default('pending');
            $table->string('stripe_session_id')->nullable()->index();
            $table->timestamps();
        });
    }
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
