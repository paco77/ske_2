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
            'image' => 'nullable|image|max:2048',
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
        else
            $about->image = $about->image;

        $about->save();

        return redirect()->back()->with('success', 'Información de Misión y Visión actualizada.');
    }
}
