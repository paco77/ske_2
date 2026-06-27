<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            'storage_url' => asset('storage') . '/',
            'app_logo' => \App\Models\AboutInfo::first()?->logo,
            'global_brands' => \App\Models\Brand::where('is_active', true)->orderBy('order')->get(['id', 'name']),
            'global_categories' => \App\Models\Category::where('is_active', true)->orderBy('order')->get(['id', 'name']),
            'global_products' => \App\Models\Product::with(['brand'])->where('is_active', true)->get(['id', 'name', 'description', 'image', 'images', 'brand_id']),
            'global_contact' => \App\Models\ContactInfo::first(),
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
        ];
    }
}
