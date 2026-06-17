<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('presentation_settings', function (Blueprint $table) {
            $table->id();
            $table->string('profile_image')->nullable();
            $table->string('logo')->nullable();
            $table->string('name')->nullable();
            $table->string('title')->nullable();
            
            // Icon links
            $table->string('email')->nullable();
            $table->string('whatsapp')->nullable();
            $table->string('phone')->nullable();
            
            // About Us
            $table->string('about_title')->nullable();
            $table->text('about_text')->nullable();
            
            // Contact Info
            $table->string('contact_title')->nullable();
            $table->string('contact_email')->nullable();
            $table->string('contact_phone')->nullable();
            $table->text('contact_address')->nullable();
            
            // Brands (json array of paths)
            $table->json('brands_images')->nullable();
            
            // Main site link
            $table->string('website_link')->nullable();
            $table->string('website_button_text')->nullable();
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('presentation_settings');
    }
};
