<?php
use Illuminate\Http\UploadedFile;
use App\Services\ImageService;

// Create a fake image
$file = UploadedFile::fake()->image('test.jpg', 600, 600);

// Try to process it
try {
    $service = new ImageService();
    $path = $service->store($file, 'test_images', 200, 200);
    echo "SUCCESS: " . $path . "\n";
} catch (\Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n" . $e->getTraceAsString() . "\n";
}
