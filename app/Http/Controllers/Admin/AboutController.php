<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AboutInfo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

use App\Services\ImageService;

class AboutController extends Controller
{
    protected $imageService;

    public function __construct(ImageService $imageService)
    {
        $this->imageService = $imageService;
    }

    public function index()
    {
        return Inertia::render('Admin/About/Index', [
            'about' => AboutInfo::first(),
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'mission' => 'required|string',
            'vision' => 'required|string',
            'image' => 'nullable|image|max:10240',
            'logo' => 'nullable|image|max:10240',
        ]);

        $about = AboutInfo::first() ?? new AboutInfo();

        $about->mission = $request->mission;
        $about->vision = $request->vision;

        if ($request->hasFile('image')) {
            if ($about->image) {
                Storage::disk('public')->delete($about->image);
            }
            $about->image = $this->imageService->store($request->file('image'), 'about', 800, 600);
        }

        if ($request->hasFile('logo')) {
            if ($about->logo) {
                Storage::disk('public')->delete($about->logo);
            }
            // Use 500x500 max size for logo, or don't resize if we want to keep it transparent/original. We'll use 500x500.
            $about->logo = $this->imageService->store($request->file('logo'), 'about', 500, 500);
        }

        $about->save();

        return redirect()->back()->with('success', 'Información de Misión y Visión actualizada.');
    }
}
