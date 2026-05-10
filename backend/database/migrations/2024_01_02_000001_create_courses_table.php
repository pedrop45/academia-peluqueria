<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration 
{
    public function up(): void
    {
        Schema::create('courses', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->enum('modality', ['presencial', 'online'])->default('presencial');
            $table->decimal('price', 8, 2)->nullable();
            $table->string('duration')->nullable();
            $table->string('image')->nullable();
            $table->boolean('active')->default(true);
            $table->timestamps();
        });
    }
    public function down(): void
    {
        Schema::dropIfExists('courses');
    }
};
