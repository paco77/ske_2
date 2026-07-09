<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Models\Product;
use App\Models\Subcategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use App\Models\SeoSetting;

use App\Services\ImageService;

class ProductController extends Controller
{
    protected $imageService;

    public function __construct(ImageService $imageService)
    {
        $this->imageService = $imageService;
    }

    public function index()
    {
        return Inertia::render('Admin/Products/Index', [
            'products' => Product::with(['category', 'subcategory.category', 'brand'])->latest()->get(),
            'categories' => \App\Models\Category::orderBy('name')->get(),
            'subcategories' => Subcategory::with('category')->orderBy('name')->get(),
            'brands' => Brand::orderBy('name')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'serie' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|image|max:10240',
            'category_id' => 'required|exists:categories,id',
            'subcategory_id' => 'nullable|exists:subcategories,id',
            'brand_id' => 'nullable|exists:brands,id',
            'is_active' => 'boolean',
            'images' => 'nullable|array',
            'images.*' => 'image|max:10240',
            'seo_keywords' => 'nullable|string',
            'technical_sheet' => 'nullable|file|mimes:pdf|max:10240',
        ]);

        if ($request->hasFile('image')) {
            $data['image'] = $this->imageService->store($request->file('image'), 'products', 800, 800);
        }

        if ($request->hasFile('technical_sheet')) {
            $data['technical_sheet'] = $request->file('technical_sheet')->store('products/sheets', 'public');
        }

        $imagePaths = [];
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $file) {
                $imagePaths[] = $this->imageService->store($file, 'products/gallery', 800, 800);
            }
        }
        $data['images'] = $imagePaths;

        Product::create($data);

        $this->updateSeoKeywords($request->input('seo_keywords'));

        return redirect()->back()->with('success', 'Producto creado.');
    }

    public function update(Request $request, Product $product)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'serie' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|image|max:10240',
            'category_id' => 'required|exists:categories,id',
            'subcategory_id' => 'nullable|exists:subcategories,id',
            'brand_id' => 'nullable|exists:brands,id',
            'is_active' => 'boolean',
            'images' => 'nullable|array',
            'images.*' => 'image|max:10240',
            'kept_images' => 'nullable|array',
            'kept_images.*' => 'string',
            'seo_keywords' => 'nullable|string',
            'technical_sheet' => 'nullable|file|mimes:pdf|max:10240',
        ]);

        if ($request->hasFile('image')) {
            if ($product->image) {
                Storage::disk('public')->delete($product->image);
            }
            $data['image'] = $this->imageService->store($request->file('image'), 'products', 800, 800);
        }
        else {
            $data['image'] = $product->image;
        }

        if ($request->hasFile('technical_sheet')) {
            if ($product->technical_sheet) {
                Storage::disk('public')->delete($product->technical_sheet);
            }
            $data['technical_sheet'] = $request->file('technical_sheet')->store('products/sheets', 'public');
        } else {
            $data['technical_sheet'] = $product->technical_sheet;
        }

        $existingImages = $product->images ?? [];
        $keptImages = $request->input('kept_images', []);
        
        foreach ($existingImages as $existingImage) {
            if (!in_array($existingImage, $keptImages)) {
                Storage::disk('public')->delete($existingImage);
            }
        }

        $newImagePaths = [];
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $file) {
                $newImagePaths[] = $this->imageService->store($file, 'products/gallery', 800, 800);
            }
        }

        $data['images'] = array_merge($keptImages, $newImagePaths);

        $product->update($data);

        $this->updateSeoKeywords($request->input('seo_keywords'));

        return redirect()->back()->with('success', 'Producto actualizado.');
    }

    public function destroy(Product $product)
    {
        if ($product->image) {
            Storage::disk('public')->delete($product->image);
        }
        if ($product->technical_sheet) {
            Storage::disk('public')->delete($product->technical_sheet);
        }
        if ($product->images) {
            foreach ((array)$product->images as $image) {
                Storage::disk('public')->delete($image);
            }
        }
        $product->delete();

        return redirect()->back()->with('success', 'Producto eliminado.');
    }

    public function generateSeries()
    {
        $products = Product::all();
        foreach ($products as $product) {
            if (preg_match('/^[^0-9\-]+/', $product->name, $matches)) {
                $serie = trim($matches[0]);
                $product->update(['serie' => $serie]);
            }
        }
        return redirect()->back()->with('success', 'Series generadas correctamente.');
    }

    protected function updateSeoKeywords($keywords)
    {
        if (empty(trim((string)$keywords))) {
            return;
        }

        $seoSetting = SeoSetting::firstOrCreate(['id' => 1], [
            'keywords' => '',
            'description' => ''
        ]);

        $existing = array_map('trim', explode(',', $seoSetting->keywords ?? ''));
        $new = array_map('trim', explode(',', $keywords));
        
        $merged = array_unique(array_filter(array_merge($existing, $new)));

        $seoSetting->update([
            'keywords' => implode(', ', $merged)
        ]);
    }
}
