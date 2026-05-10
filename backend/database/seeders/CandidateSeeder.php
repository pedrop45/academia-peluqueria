<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use App\Models\Candidate;
class CandidateSeeder extends Seeder
{
    public function run(): void
    {
        $candidates = [
            [
                'full_name' => 'Alejandro Fernández',
                'bio' => 'Barbero titulado con 2 años de experiencia en fade y diseños. Buscando oportunidades en Almería capital.',
                'location' => 'Almería',
                'skills' => 'Barbería, Fade, Diseños, Afeitado clásico',
                'email' => 'alejandro.f@ejemplo.com',
                'phone' => '600 111 222',
                'is_visible' => true,
            ],
            [
                'full_name' => 'Laura García',
                'bio' => 'Peluquera especializada en coloración y mechas. Certificado de profesionalidad IMPQ0108. Disponible para incorporación inmediata.',
                'location' => 'Almería',
                'skills' => 'Coloración, Balayage, Mechas, Corte femenino',
                'email' => 'laura.g@ejemplo.com',
                'phone' => '600 333 444',
                'is_visible' => true,
            ],
            [
                'full_name' => 'Mohamed El Amrani',
                'bio' => 'Barbero con formación en técnicas clásicas y modernas. Experiencia en salones de Madrid y Almería.',
                'location' => 'Adra',
                'skills' => 'Barbería, Arreglo de barba, Diseños geométricos',
                'email' => null,
                'phone' => '600 555 666',
                'is_visible' => true,
            ],
            [
                'full_name' => 'Carmen Ruiz',
                'bio' => 'Recién titulada en peluquería. Con muchas ganas de aprender en un equipo profesional. Disponible a tiempo completo.',
                'location' => 'Almería',
                'skills' => 'Peluquería, Lavados, Secado, Recogidos',
                'email' => 'carmen.r@ejemplo.com',
                'phone' => null,
                'is_visible' => true,
            ],
            [
                'full_name' => 'David Martínez',
                'bio' => 'Peluquero con 5 años de experiencia. Especialista en cabello masculino y cortes clásicos. Portfolio disponible.',
                'location' => 'Granada',
                'skills' => 'Peluquería masculina, Corte clásico, Navaja',
                'portfolio_url' => 'https://instagram.com/davidm_pelux',
                'email' => 'david.m@ejemplo.com',
                'phone' => '600 777 888',
                'is_visible' => true,
            ],
            [
                'full_name' => 'Fátima Benali',
                'bio' => 'Estilista y colorista con formación en Barcelona. Busco trabajo en Almería por motivos personales.',
                'location' => 'Almería',
                'skills' => 'Coloración, Tratamientos, Alisados, Keratina',
                'email' => 'fatima.b@ejemplo.com',
                'phone' => '600 999 000',
                'is_visible' => true,
            ],
        ];
        foreach ($candidates as $data) {
            Candidate::create($data);
        }
    }
}
