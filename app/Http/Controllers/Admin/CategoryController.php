<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Subcategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use App\Models\SeoSetting;

use App\Services\ImageService;

class CategoryController extends Controller
{
    protected $imageService;

    public function __construct(ImageService $imageService)
    {
        $this->imageService = $imageService;
    }

    public function index()
    {
        return Inertia::render('Admin/Categories/Index', [
            'categories' => Category::with('subcategories')->orderBy('order')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'seo_keywords' => 'nullable|string',
            'image' => 'required|image|max:10240',
            'order' => 'integer',
            'is_active' => 'boolean',
        ]);

        if ($request->hasFile('image')) {
            $data['image'] = $this->imageService->store($request->file('image'), 'categories', 600, 600);
        }

        Category::create($data);

        $this->updateSeoKeywords($request->input('seo_keywords'));

        return redirect()->back()->with('success', 'Categoría creada.');
    }

    public function update(Request $request, Category $category)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'seo_keywords' => 'nullable|string',
            'image' => 'nullable|image|max:10240',
            'order' => 'integer',
            'is_active' => 'boolean',
        ]);

        if ($request->hasFile('image')) {
            if ($category->image) {
                Storage::disk('public')->delete($category->image);
            }
            $data['image'] = $this->imageService->store($request->file('image'), 'categories', 600, 600);
        }
        else
            $data['image'] = $category->image;

        $category->update($data);

        $this->updateSeoKeywords($request->input('seo_keywords'));

        return redirect()->back()->with('success', 'Categoría actualizada.');
    }

    public function destroy(Category $category)
    {
        if ($category->image) {
            Storage::disk('public')->delete($category->image);
        }
        $category->delete();

        return redirect()->back()->with('success', 'Categoría eliminada.');
    }

    // Subcategory management
    public function storeSubcategory(Request $request, Category $category)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'seo_keywords' => 'nullable|string',
            'image' => 'nullable|image|max:10240',
            'order' => 'integer',
            'is_active' => 'boolean',
        ]);

        if ($request->hasFile('image')) {
            $data['image'] = $this->imageService->store($request->file('image'), 'subcategories', 600, 600);
        }

        $category->subcategories()->create($data);

        $this->updateSeoKeywords($request->input('seo_keywords'));

        return redirect()->back()->with('success', 'Subcategoría creada.');
    }

    public function updateSubcategory(Request $request, Subcategory $subcategory)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'seo_keywords' => 'nullable|string',
            'image' => 'nullable|image|max:10240',
            'order' => 'integer',
            'is_active' => 'boolean',
        ]);

        if ($request->hasFile('image')) {
            if ($subcategory->image) {
                Storage::disk('public')->delete($subcategory->image);
            }
            $data['image'] = $this->imageService->store($request->file('image'), 'subcategories', 600, 600);
        }

        $subcategory->update($data);

        $this->updateSeoKeywords($request->input('seo_keywords'));

        return redirect()->back()->with('success', 'Subcategoría actualizada.');
    }

    public function destroySubcategory(Subcategory $subcategory)
    {
        if ($subcategory->image) {
            Storage::disk('public')->delete($subcategory->image);
        }
        $subcategory->delete();

        return redirect()->back()->with('success', 'Subcategoría eliminada.');
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
