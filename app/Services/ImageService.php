<?php

namespace App\Services;

use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\UploadedFile;

class ImageService
{
    protected $manager;

    public function __construct()
    {
        $this->manager = new ImageManager(new Driver());
    }

    public function store(UploadedFile $file, string $path, ?int $width = null, ?int $height = null): string
    {
        $image = $this->manager->read($file);

        if ($width || $height) {
            $image->scale(width: $width, height: $height);
        }

        $filename = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME) . '_' . time() . '.webp';
        $fullPath = $path . '/' . $filename;

        if (!Storage::disk('public')->exists($path)) {
            Storage::disk('public')->makeDirectory($path);
        }

        $encoded = $image->toWebp(80);
        
        Storage::disk('public')->put($fullPath, (string) $encoded);

        return $fullPath;
    }
}
