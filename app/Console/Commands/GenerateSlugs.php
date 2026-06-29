<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class GenerateSlugs extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'seo:generate-slugs';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate missing slugs for products and categories';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Generating missing slugs...');

        $products = \App\Models\Product::whereNull('slug')->get();
        foreach ($products as $p) {
            $p->slug = \Illuminate\Support\Str::slug($p->name) . '-' . $p->id;
            $p->save();
        }
        $this->info("Generated slugs for {$products->count()} products.");

        $categories = \App\Models\Category::whereNull('slug')->get();
        foreach ($categories as $c) {
            $c->slug = \Illuminate\Support\Str::slug($c->name) . '-' . $c->id;
            $c->save();
        }
        $this->info("Generated slugs for {$categories->count()} categories.");

        $this->info('Done.');
    }
}
