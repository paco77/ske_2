<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Spatie\Sitemap\SitemapGenerator;

class GenerateSitemap extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'sitemap:generate';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate the sitemap.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Generating sitemap...');
        
        $sitemap = \Spatie\Sitemap\Sitemap::create();
        
        // Add static routes
        $sitemap->add(\Spatie\Sitemap\Tags\Url::create('/')->setPriority(1.0));
        $sitemap->add(\Spatie\Sitemap\Tags\Url::create('/productos')->setPriority(0.9));
        $sitemap->add(\Spatie\Sitemap\Tags\Url::create('/presentacion')->setPriority(0.8));

        // Add Categories
        $categories = \App\Models\Category::where('is_active', true)->get();
        foreach ($categories as $category) {
            $sitemap->add(\Spatie\Sitemap\Tags\Url::create("/categorias/{$category->slug}/productos")
                ->setPriority(0.7)
                ->setChangeFrequency(\Spatie\Sitemap\Tags\Url::CHANGE_FREQUENCY_WEEKLY));
        }

        // Add Products
        $products = \App\Models\Product::where('is_active', true)->get();
        foreach ($products as $product) {
            $sitemap->add(\Spatie\Sitemap\Tags\Url::create("/producto/{$product->slug}")
                ->setPriority(0.8)
                ->setChangeFrequency(\Spatie\Sitemap\Tags\Url::CHANGE_FREQUENCY_DAILY));
        }

        $sitemap->writeToFile(public_path('sitemap.xml'));
            
        $this->info('Sitemap generated successfully.');

        // Ping Google
        $sitemapUrl = url('sitemap.xml');
        $this->info("Pinging Google with sitemap: {$sitemapUrl}");
        try {
            $response = \Illuminate\Support\Facades\Http::get('https://www.google.com/ping', [
                'sitemap' => $sitemapUrl
            ]);
            if ($response->successful()) {
                $this->info('Google pinged successfully.');
            } else {
                $this->error('Failed to ping Google.');
            }
        } catch (\Exception $e) {
            $this->error('Error pinging Google: ' . $e->getMessage());
        }
    }
}
