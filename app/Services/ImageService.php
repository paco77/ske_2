<?php

namespace App\Services;

use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\UploadedFile;
use Illuminate\Validation\ValidationException;

class ImageService
{
    protected $manager;

    public function __construct()
    {
        // Manager instantiation is delayed to store() to prevent errors on module entry
    }

    public function store(UploadedFile $file, string $path, ?int $width = null, ?int $height = null): string
    {
        try {
            if (!$this->manager) {
                $this->manager = new ImageManager(new Driver());
            }

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
        } catch (\Throwable $e) {
            throw ValidationException::withMessages([
                'image' => 'Error al procesar la imagen: ' . $e->getMessage() . '. Verifica que la extensión GD esté habilitada en tu PHP.'
            ]);
        }
    }
}
