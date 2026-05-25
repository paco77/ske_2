<?php

use App\Http\Controllers\Admin\BrandController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\ContactController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\SliderController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;

// ─── Public Routes ───────────────────────────────────────────────
Route::get('/', [HomeController::class , 'index'])->name('home');
Route::get('/productos/{subcategory}', [HomeController::class , 'products'])->name('products');

// ─── Admin Routes (Auth Required) ────────────────────────────────
Route::middleware(['auth', 'verified'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', [DashboardController::class , 'index'])->name('dashboard');

    // Sliders
    Route::get('/sliders', [SliderController::class , 'index'])->name('sliders.index');
    Route::post('/sliders', [SliderController::class , 'store'])->name('sliders.store');
    Route::post('/sliders/{slider}', [SliderController::class , 'update'])->name('sliders.update');
    Route::delete('/sliders/{slider}', [SliderController::class , 'destroy'])->name('sliders.destroy');

    // Brands
    Route::get('/marcas', [BrandController::class , 'index'])->name('brands.index');
    Route::post('/marcas', [BrandController::class , 'store'])->name('brands.store');
    Route::post('/marcas/{brand}', [BrandController::class , 'update'])->name('brands.update');
    Route::delete('/marcas/{brand}', [BrandController::class , 'destroy'])->name('brands.destroy');

    // Categories & Subcategories
    Route::get('/categorias', [CategoryController::class , 'index'])->name('categories.index');
    Route::post('/categorias', [CategoryController::class , 'store'])->name('categories.store');
    Route::post('/categorias/{category}', [CategoryController::class , 'update'])->name('categories.update');
    Route::delete('/categorias/{category}', [CategoryController::class , 'destroy'])->name('categories.destroy');
    Route::post('/categorias/{category}/subcategorias', [CategoryController::class , 'storeSubcategory'])->name('subcategories.store');
    Route::post('/subcategorias/{subcategory}', [CategoryController::class , 'updateSubcategory'])->name('subcategories.update');
    Route::delete('/subcategorias/{subcategory}', [CategoryController::class , 'destroySubcategory'])->name('subcategories.destroy');

    // Products
    Route::get('/productos', [ProductController::class , 'index'])->name('products.index');
    Route::post('/productos', [ProductController::class , 'store'])->name('products.store');
    Route::post('/productos/{product}', [ProductController::class , 'update'])->name('products.update');
    Route::delete('/productos/{product}', [ProductController::class , 'destroy'])->name('products.destroy');

    // Contact
    Route::get('/contacto', [ContactController::class , 'index'])->name('contact.index');
    Route::post('/contacto', [ContactController::class , 'update'])->name('contact.update');

    // Mission & Vision
    Route::get('/mision-vision', [\App\Http\Controllers\Admin\AboutController::class , 'index'])->name('about.index');
    Route::post('/mision-vision', [\App\Http\Controllers\Admin\AboutController::class , 'update'])->name('about.update');

    // Users
    Route::get('/usuarios', [UserController::class , 'index'])->name('users.index');
    Route::post('/usuarios', [UserController::class , 'store'])->name('users.store');
    Route::delete('/usuarios/{user}', [UserController::class , 'destroy'])->name('users.destroy');
});

// ─── Profile Routes ──────────────────────────────────────────────
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class , 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class , 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class , 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
