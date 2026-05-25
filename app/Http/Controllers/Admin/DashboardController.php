<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Models\Slider;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'sliders' => Slider::count(),
                'brands' => Brand::count(),
                'categories' => Category::count(),
                'products' => Product::count(),
            ],
        ]);
    }
}
