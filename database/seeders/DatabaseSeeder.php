<?php

namespace Database\Seeders;

use App\Models\Brand;
use App\Models\Category;
use App\Models\ContactInfo;
use App\Models\Product;
use App\Models\Slider;
use App\Models\Subcategory;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Admin user
        User::create([
            'name' => 'Admin',
            'email' => 'admin@ske.com',
            'password' => Hash::make('password'),
        ]);

        // Sliders
        Slider::create([
            'title' => 'Componentes Electrónicos',
            'subtitle' => 'Los mejores componentes y suministros para tu proyecto',
            'button_text' => 'Ver Catálogo',
            'button_url' => '#categorias',
            'image' => 'sliders/slider1.jpg',
            'order' => 1,
        ]);
        Slider::create([
            'title' => 'Suministros Industriales',
            'subtitle' => 'Calidad y confianza en cada producto',
            'button_text' => 'Contáctanos',
            'button_url' => '#contacto',
            'image' => 'sliders/slider2.jpg',
            'order' => 2,
        ]);
        Slider::create([
            'title' => 'Las Mejores Marcas',
            'subtitle' => 'Trabajamos con las marcas líderes del mercado',
            'button_text' => 'Ver Marcas',
            'button_url' => '#marcas',
            'image' => 'sliders/slider3.jpg',
            'order' => 3,
        ]);

        // Brands
        $brands = [];
        $brandNames = ['Schneider Electric', 'Siemens', 'ABB', 'Phoenix Contact', 'Omron', 'Legrand', 'Weidmüller', 'Rittal'];
        foreach ($brandNames as $i => $name) {
            $brands[] = Brand::create([
                'name' => $name,
                'logo' => 'brands/' . strtolower(str_replace(' ', '-', $name)) . '.png',
                'order' => $i + 1,
            ]);
        }

        // Categories & Subcategories
        $catData = [
            'Automatización' => ['PLCs', 'Sensores', 'Variadores de Frecuencia', 'HMI'],
            'Protección Eléctrica' => ['Interruptores', 'Fusibles', 'Relevadores', 'Supresores de Pico'],
            'Cableado y Conexiones' => ['Cables', 'Conectores', 'Terminales', 'Canaletas'],
            'Iluminación Industrial' => ['LED Industrial', 'Lámparas de Señalización', 'Balizas'],
            'Control y Mando' => ['Botones y Selectores', 'Contactores', 'Temporizadores', 'Pilotos'],
            'Gabinetes y Envolventes' => ['Gabinetes Metálicos', 'Cajas de PVC', 'Accesorios de Montaje'],
        ];

        foreach ($catData as $catName => $subcats) {
            $cat = Category::create([
                'name' => $catName,
                'image' => 'categories/' . strtolower(str_replace([' ', 'á', 'é', 'í', 'ó', 'ú'], ['-', 'a', 'e', 'i', 'o', 'u'], $catName)) . '.jpg',
                'order' => array_search($catName, array_keys($catData)) + 1,
            ]);

            foreach ($subcats as $j => $subName) {
                $sub = Subcategory::create([
                    'name' => $subName,
                    'category_id' => $cat->id,
                    'image' => 'subcategories/' . strtolower(str_replace([' ', 'á', 'é', 'í', 'ó', 'ú'], ['-', 'a', 'e', 'i', 'o', 'u'], $subName)) . '.jpg',
                    'order' => $j + 1,
                ]);

                // Create 3 sample products per subcategory
                for ($k = 1; $k <= 3; $k++) {
                    Product::create([
                        'name' => $subName . ' - Modelo ' . $k,
                        'description' => 'Producto de alta calidad para ' . strtolower($catName) . '. Especificaciones y detalles técnicos disponibles.',
                        'image' => 'products/producto-placeholder.jpg',
                        'subcategory_id' => $sub->id,
                        'brand_id' => $brands[array_rand($brands)]->id,
                    ]);
                }
            }
        }

        // Contact Info
        ContactInfo::create([
            'whatsapp' => '524443751823',
            'email' => 'ventas@ske-componentes.com',
            'phone' => '+524443751823',
            'address' => 'Av. Industrial #123, Col. Centro, Ciudad de México',
        ]);

        // About Info
        \App\Models\AboutInfo::create([
            'mission' => 'Proveer soluciones integrales en componentes electrónicos y suministros industriales de la más alta calidad, impulsando la eficiencia y el crecimiento de nuestros clientes.',
            'vision' => 'Ser la empresa líder y referente en el mercado industrial, reconocida por nuestra innovación, confiabilidad y compromiso con la excelencia en el servicio.',
        ]);
    }
}
