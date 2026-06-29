<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\SeoSetting;
use Inertia\Inertia;

class SeoController extends Controller
{
    public function edit()
    {
        $setting = SeoSetting::firstOrCreate(['id' => 1], [
            'keywords' => '',
            'description' => ''
        ]);

        return Inertia::render('Admin/Seo/Edit', [
            'setting' => $setting
        ]);
    }

    public function update(Request $request)
    {
        $setting = SeoSetting::first();

        $data = $request->validate([
            'keywords' => 'nullable|string',
            'description' => 'nullable|string',
        ]);

        $setting->update($data);

        return redirect()->back()->with('success', 'Configuración SEO actualizada correctamente.');
    }
}
