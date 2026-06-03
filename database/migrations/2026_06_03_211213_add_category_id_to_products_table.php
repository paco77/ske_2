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
        Schema::table('products', function (Blueprint $table) {
            $table->foreignId('category_id')->nullable()->after('id')->constrained()->onDelete('cascade');
        });

        // Backfill data
        \Illuminate\Support\Facades\DB::statement('
            UPDATE products p 
            INNER JOIN subcategories s ON p.subcategory_id = s.id 
            SET p.category_id = s.category_id
        ');

        Schema::table('products', function (Blueprint $table) {
            // Make category_id required and subcategory_id optional
            $table->unsignedBigInteger('category_id')->nullable(false)->change();
            $table->unsignedBigInteger('subcategory_id')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->unsignedBigInteger('subcategory_id')->nullable(false)->change();
            $table->dropForeign(['category_id']);
            $table->dropColumn('category_id');
        });
    }
};
