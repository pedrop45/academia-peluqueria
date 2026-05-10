<?php
namespace Database\Seeders;
use App\Models\Course;
use Illuminate\Database\Seeder;
class CourseSeeder extends Seeder
{
    public function run(): void
    {
        $courses = [
            [
                'title' => 'Peluquería Nivel 1 - Servicios Auxiliares',
                'description' => 'Certificado de profesionalidad IMPQ0108. Aprende las técnicas básicas de lavado, acondicionamiento, cambios de color y peinados sencillos. Incluye módulo de prácticas profesionales.',
                'modality' => 'presencial',
                'price' => 450.00,
                'duration' => '330 horas',
                'image' => '/assets/img/pelando 1.jfif',
                'active' => true,
            ],
            [
                'title' => 'Peluquería Nivel 2 - Técnicas Avanzadas',
                'description' => 'Certificado de profesionalidad IMPQ0208. Corte, coloración, peinados elaborados, recogidos y tratamientos capilares. Formación completa para trabajar en salón.',
                'modality' => 'presencial',
                'price' => 650.00,
                'duration' => '590 horas',
                'image' => '/assets/img/pelando 2.jfif',
                'active' => true,
            ],
            [
                'title' => 'Barbería Profesional',
                'description' => 'Curso especializado en técnicas de barbería: corte a tijera y máquina, degradados, diseño de barba, afeitado clásico a navaja y tendencias actuales.',
                'modality' => 'presencial',
                'price' => 380.00,
                'duration' => '200 horas',
                'image' => '/assets/img/PELADO 10.jfif',
                'active' => true,
            ],
            [
                'title' => 'Docencia de la Formación Profesional para el Empleo (SSCE0110)',
                'description' => 'Programa oficial que te habilita para programar, impartir, tutorizar y evaluar acciones formativas de formación profesional para el empleo.',
                'modality' => 'presencial',
                'price' => 500.00,
                'duration' => '360 horas',
                'image' => '/assets/img/aula.jpeg',
                'active' => true,
            ],
            [
                'title' => 'Técnicas de Maquillaje',
                'description' => 'Curso online de iniciación al maquillaje profesional. Aprende técnicas de base, contorno, ojos, labios y maquillaje para eventos especiales.',
                'modality' => 'online',
                'price' => 120.00,
                'duration' => '20 horas',
                'image' => '/assets/img/maquillaje.jpg',
                'active' => true,
            ],
            [
                'title' => 'Asesoría Integral de Imagen Personal',
                'description' => 'Formación completa en asesoramiento de imagen: colorimetría, visajismo, estilismo y personal shopping aplicado a la imagen personal.',
                'modality' => 'online',
                'price' => 95.00,
                'duration' => '20 horas',
                'image' => '/assets/img/diseño.jfif',
                'active' => true,
            ],
            [
                'title' => 'Cuidados Estéticos de Manos y Pies',
                'description' => 'Manicura, pedicura, tratamientos de uñas, esmaltado semipermanente y nail art. Formación práctica para profesionales.',
                'modality' => 'online',
                'price' => 85.00,
                'duration' => '30 horas',
                'image' => '/assets/img/uñas.jpg',
                'active' => true,
            ],
            [
                'title' => 'Tratamientos Capilares Estéticos',
                'description' => 'Diagnóstico capilar, tratamientos de hidratación, nutrición, keratina y botox capilar. Técnicas para recuperar y mantener el cabello sano.',
                'modality' => 'online',
                'price' => 110.00,
                'duration' => '25 horas',
                'image' => '/assets/img/tinte.jfif',
                'active' => true,
            ],
            [
                'title' => 'Marketing Digital para Imagen Personal',
                'description' => 'Redes sociales, branding personal, fotografía para portfolio, campañas publicitarias y e-commerce aplicado al sector de la imagen personal.',
                'modality' => 'online',
                'price' => 150.00,
                'duration' => '80 horas',
                'image' => '/assets/img/teleformacion.jpg',
                'active' => true,
            ],
        ];
        foreach ($courses as $data) {
            Course::create($data);
        }
    }
}
