<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use App\Models\Partner;
class PartnerSeeder extends Seeder
{
    public function run(): void
    {
        $partners = [
            [
                'name' => 'Salón Oh La Lá',
                'description' => 'Salón de peluquería femenina de alto nivel en el centro de Almería. Acogen a nuestros alumnos en prácticas cada año.',
                'website' => null,
                'email' => 'ohlala@ejemplo.com',
                'phone' => '950 111 222',
                'location' => 'Almería',
                'is_visible' => true,
            ],
            [
                'name' => 'Barbería El Gran Gatsby',
                'description' => 'Barbería clásica de referencia en Almería. Especialistas en corte americano y afeitado con navaja.',
                'website' => null,
                'email' => null,
                'phone' => '950 333 444',
                'location' => 'Almería',
                'is_visible' => true,
            ],
            [
                'name' => 'Centro de Estética Belleza Total',
                'description' => 'Centro de estética y peluquería con más de 20 años de experiencia en Adra. Colabora activamente con la academia.',
                'website' => null,
                'email' => 'bellezatotal@ejemplo.com',
                'phone' => '950 555 666',
                'location' => 'Adra',
                'is_visible' => true,
            ],
            [
                'name' => 'Salón Prestige Hair',
                'description' => 'Salón especializado en coloración y tratamientos capilares de alta gama. Partner oficial de la academia.',
                'website' => null,
                'email' => null,
                'phone' => '950 777 888',
                'location' => 'Almería',
                'is_visible' => true,
            ],
            [
                'name' => 'Barbería Clan Barber',
                'description' => 'Barbería moderna con ambiente joven. Buscan continuamente nuevos barberos titulados procedentes de la academia.',
                'website' => null,
                'email' => 'clan@ejemplo.com',
                'phone' => '950 999 000',
                'location' => 'Almería',
                'is_visible' => true,
            ],
        ];
        foreach ($partners as $data) {
            Partner::create($data);
        }
    }
}
