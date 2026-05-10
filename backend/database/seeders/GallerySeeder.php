<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use App\Models\GalleryItem;
class GallerySeeder extends Seeder
{
    public function run()
    {
        $items = [
            ['title' => 'Recogido elegante', 'section' => 'peluqueria', 'image' => '/assets/img/peinado.jpg', 'featured' => true, 'active' => true],
            ['title' => 'Corte y degradado', 'section' => 'barberia', 'image' => '/assets/img/barberia.jpg', 'featured' => false, 'active' => true],
            ['title' => 'Diseño de uñas', 'section' => 'uñas', 'image' => '/assets/img/uñas.jpg', 'featured' => false, 'active' => true],
            ['title' => 'Maquillaje social', 'section' => 'maquillaje', 'image' => '/assets/img/maquillaje.jpg', 'featured' => true, 'active' => true],
            ['title' => 'Color y estilo', 'section' => 'peluqueria', 'image' => '/assets/img/peluqueria.jpg', 'featured' => false, 'active' => true],
            ['title' => 'Detalle profesional', 'section' => 'barberia', 'image' => '/assets/img/barberia 2.jpg', 'featured' => false, 'active' => true],
        ];
        foreach ($items as $item) {
            GalleryItem::create($item);
        }
    }
}
