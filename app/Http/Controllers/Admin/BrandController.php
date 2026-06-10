<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

use App\Services\ImageService;

class BrandController extends Controller
{
    protected $imageService;

    public function __construct(ImageService $imageService)
    {
        $this->imageService = $imageService;
    }

    public function index()
    {
        return Inertia::render('Admin/Brands/Index', [
            'brands' => Brand::orderBy('order')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'logo' => 'required|image|max:10240',
            'order' => 'integer',
            'is_active' => 'boolean',
        ]);

        if ($request->hasFile('logo')) {
            $data['logo'] = $this->imageService->store($request->file('logo'), 'brands', 400, 400);
        }

        Brand::create($data);

        return redirect()->back()->with('success', 'Marca creada correctamente.');
    }

    public function update(Request $request, Brand $brand)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'logo' => 'nullable|image|max:10240',
            'order' => 'integer',
            'is_active' => 'boolean',
        ]);

        if ($request->hasFile('logo')) {
            if ($brand->logo) {
                Storage::disk('public')->delete($brand->logo);
            }
            $data['logo'] = $this->imageService->store($request->file('logo'), 'brands', 400, 400);
        }
        else
            $data['logo'] = $brand->logo;

        $brand->update($data);

        return redirect()->back()->with('success', 'Marca actualizada.');
    }

    public function destroy(Brand $brand)
    {
        if ($brand->logo) {
            Storage::disk('public')->delete($brand->logo);
        }
        $brand->delete();

        return redirect()->back()->with('success', 'Marca eliminada.');
    }
}
