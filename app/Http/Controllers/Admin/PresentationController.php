<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PresentationSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use App\Services\ImageService;

class PresentationController extends Controller
{
    protected $imageService;

    public function __construct(ImageService $imageService)
    {
        $this->imageService = $imageService;
    }

    public function show()
    {
        $setting = PresentationSetting::firstOrCreate(['id' => 1], [
            'name' => 'Lic. ',
            'title' => 'Agente de Ventas y Proyectos',
            'email' => '',
            'whatsapp' => '',
            'phone' => '',
            'about_title' => 'Acerca de Nosotros',
            'about_text' => 'En SKE Componentes y Suministros nos dedicamos a proveer soluciones integrales de instrumentación industrial, componentes electrónicos y suministros para la pequeña, mediana y gran empresa, garantizando la calidad y confianza en cada uno de nuestros productos.',
            'contact_title' => 'Información de Contacto',
            'contact_email' => 've2@jinsa.com.mx',
            'contact_phone' => '6188140846',
            'contact_address' => 'Av. Industrial #123, Col. Centro, Durango, Dgo.',
            'brands_images' => [],
            'website_link' => 'https://skecomponent.mx/',
            'website_button_text' => 'Visitar Sitio Oficial',
        ]);

        return Inertia::render('Presentation', [
            'setting' => $setting
        ]);
    }

    public function edit()
    {
        $setting = PresentationSetting::firstOrCreate(['id' => 1], [
            'name' => 'Lic. Lizbeth Sigala',
            'title' => 'Agente de Ventas y Proyectos',
            'email' => 've2@jinsa.com.mx',
            'whatsapp' => '6182779868',
            'phone' => '6188140846',
            'about_title' => 'Acerca de Nosotros',
            'about_text' => 'En SKE Componentes y Suministros nos dedicamos a proveer soluciones integrales de instrumentación industrial, componentes electrónicos y suministros para la pequeña, mediana y gran empresa, garantizando la calidad y confianza en cada uno de nuestros productos.',
            'contact_title' => 'Información de Contacto',
            'contact_email' => 've2@jinsa.com.mx',
            'contact_phone' => '6188140846',
            'contact_address' => 'Av. Industrial #123, Col. Centro, Durango, Dgo.',
            'brands_images' => [],
            'website_link' => 'https://skecomponent.mx/',
            'website_button_text' => 'Visitar Sitio Oficial',
        ]);

        return Inertia::render('Admin/Presentation/Edit', [
            'setting' => $setting
        ]);
    }

    public function update(Request $request)
    {
        $setting = PresentationSetting::first();

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'title' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'whatsapp' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:255',

            'about_title' => 'required|string|max:255',
            'about_text' => 'nullable|string',

            'contact_title' => 'required|string|max:255',
            'contact_email' => 'nullable|email|max:255',
            'contact_phone' => 'nullable|string|max:255',
            'contact_address' => 'nullable|string',

            'website_link' => 'nullable|url|max:255',
            'website_button_text' => 'nullable|string|max:255',

            'profile_image' => 'nullable|image|max:10240',
            'logo' => 'nullable|image|max:10240',
            'cover_image' => 'nullable|image|max:10240',

            'new_brands_images' => 'nullable|array',
            'new_brands_images.*' => 'image|max:10240',
            'kept_brands_images' => 'nullable|array',
            'kept_brands_images.*' => 'string',
        ]);

        // Upload Profile Image
        if ($request->hasFile('profile_image')) {
            if ($setting->profile_image) {
                Storage::disk('public')->delete($setting->profile_image);
            }
            $data['profile_image'] = $this->imageService->store($request->file('profile_image'), 'presentation', 800, 800);
        } else {
            $data['profile_image'] = $setting->profile_image;
        }

        // Upload Logo
        if ($request->hasFile('logo')) {
            if ($setting->logo) {
                Storage::disk('public')->delete($setting->logo);
            }
            $data['logo'] = $this->imageService->store($request->file('logo'), 'presentation', 400, 400);
        } else {
            $data['logo'] = $setting->logo;
        }

        // Upload Cover Image
        if ($request->hasFile('cover_image')) {
            if ($setting->cover_image) {
                Storage::disk('public')->delete($setting->cover_image);
            }
            $data['cover_image'] = $this->imageService->store($request->file('cover_image'), 'presentation', 1200, 800);
        } else {
            $data['cover_image'] = $setting->cover_image;
        }

        // Manage Brands Images
        $existingBrandsImages = $setting->brands_images ?? [];
        $keptBrandsImages = $request->input('kept_brands_images', []);

        // Delete brand images that are no longer kept
        foreach ($existingBrandsImages as $image) {
            if (!in_array($image, $keptBrandsImages)) {
                Storage::disk('public')->delete($image);
            }
        }

        // Store new brand images
        $newBrandPaths = [];
        if ($request->hasFile('new_brands_images')) {
            foreach ($request->file('new_brands_images') as $file) {
                $newBrandPaths[] = $this->imageService->store($file, 'presentation/brands', 400, 400);
            }
        }

        $data['brands_images'] = array_merge($keptBrandsImages, $newBrandPaths);

        $setting->update($data);

        return redirect()->back()->with('success', 'Tarjeta de presentación actualizada correctamente.');
    }
}
