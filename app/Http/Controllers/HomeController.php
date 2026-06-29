<?php

namespace App\Http\Controllers;

use App\Models\Brand;
use App\Models\Category;
use App\Models\ContactInfo;
use App\Models\Product;
use App\Models\Slider;
use App\Models\Subcategory;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        return Inertia::render('Home', [
            'sliders' => Slider::where('is_active', true)->orderBy('order')->get(),
            'brands' => Brand::where('is_active', true)->orderBy('order')->get(),
            'categories' => Category::where('is_active', true)
            ->with(['subcategories' => fn($q) => $q->where('is_active', true)->orderBy('order')])
            ->orderBy('order')
            ->get(),
            'about' => \App\Models\AboutInfo::first(),
            'contact' => ContactInfo::first(),
        ]);
    }

    public function allProducts()
    {
        $products = Product::where('is_active', true)->with('brand')->get();

        $pseudoSubcategory = [
            'name' => 'Todos los productos',
            'category' => ['name' => 'Catálogo']
        ];

        return Inertia::render('Products', [
            'subcategory' => $pseudoSubcategory,
            'products' => $products,
            'contact' => ContactInfo::first(),
        ]);
    }

    public function products(Subcategory $subcategory)
    {
        $subcategory->load(['category', 'products' => fn($q) => $q->where('is_active', true)->with('brand')]);

        return Inertia::render('Products', [
            'subcategory' => $subcategory,
            'products' => $subcategory->products,
            'contact' => ContactInfo::first(),
        ]);
    }

    public function brandProducts(Brand $brand)
    {
        $brand->load(['products' => fn($q) => $q->where('is_active', true)->with('brand')]);

        // Mock a subcategory-like structure to reuse the Products view without changes
        $pseudoSubcategory = [
            'name' => $brand->name,
            'category' => ['name' => 'Marcas']
        ];

        return Inertia::render('Products', [
            'subcategory' => $pseudoSubcategory,
            'products' => $brand->products,
            'contact' => ContactInfo::first(),
        ]);
    }

    public function categoryProducts(Category $category)
    {
        $category->load(['products' => fn($q) => $q->where('products.is_active', true)->with('brand')]);

        $pseudoSubcategory = [
            'name' => 'Todos los productos',
            'category' => ['name' => $category->name]
        ];

        return Inertia::render('Products', [
            'subcategory' => $pseudoSubcategory,
            'products' => $category->products,
            'contact' => ContactInfo::first(),
        ]);
    }

    public function showProduct(Product $product)
    {
        abort_if(!$product->is_active, 404);
        
        $product->load(['category', 'subcategory', 'brand']);

        return Inertia::render('ProductView', [
            'product' => $product,
            'contact' => ContactInfo::first(),
        ]);
    }
}
