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
        
        SitemapGenerator::create(config('app.url'))
            ->hasCrawled(function (\Spatie\Sitemap\Tags\Url $url) {
                // Obtenemos la ruta (ejemplo: '/admin' de 'http://misitio.com/admin')
                $path = parse_url($url->url, PHP_URL_PATH) ?? '/';
                
                // Lista de rutas a ignorar
                $excludedPaths = [
                    '/login',
                    '/register',
                    '/password',
                    '/reset',
                    '/logout',
                    '/admin',
                    '/api',
                    '/dashboard',
                    '/profile',
                    '/sanctum',
                ];
                
                // Si la ruta empieza con alguno de los strings excluidos, la ignoramos
                foreach ($excludedPaths as $excluded) {
                    if (str_starts_with($path, $excluded)) {
                        return null; // Retornar null excluye la URL del sitemap
                    }
                }

                return $url;
            })
            ->writeToFile(public_path('sitemap.xml'));
            
        $this->info('Sitemap generated successfully.');
    }
}
