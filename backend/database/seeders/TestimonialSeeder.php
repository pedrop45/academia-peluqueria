<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use App\Models\Testimonial;
class TestimonialSeeder extends Seeder
{
    public function run(): void
    {
        $testimonials = [
            [
                'student_name' => 'Laura Martínez',
                'course' => 'Peluquería Nivel 2 – Técnicas Avanzadas',
                'rating' => 5,
                'content' => 'El mejor curso de peluquería que he hecho. Montserrat es una profesora increíble, muy cercana y con muchísima experiencia. Aprendí en tres meses lo que no aprendí en años.',
                'is_published' => true,
            ],
            [
                'student_name' => 'Alejandro Peña',
                'course' => 'Barbería Profesional',
                'rating' => 5,
                'content' => 'Gracias a la academia conseguí trabajo en menos de un mes. La formación de barbería es muy completa y práctica desde el primer día. Totalmente recomendable.',
                'is_published' => true,
            ],
            [
                'student_name' => 'Sofía Ramírez',
                'course' => 'Certificado de Profesionalidad SSCE0110',
                'rating' => 5,
                'content' => 'Lo recomiendo 100%. El certificado de profesionalidad me permitió impartir clases en otras academias. El equipo docente es de otro nivel.',
                'is_published' => true,
            ],
            [
                'student_name' => 'Marta García',
                'course' => 'Técnicas de Maquillaje Online',
                'rating' => 4,
                'content' => 'Hice el curso de maquillaje online y quedé muy satisfecha. Los materiales son excelentes y el seguimiento por parte del equipo, insuperable.',
                'is_published' => true,
            ],
            [
                'student_name' => 'Carlos Torres',
                'course' => 'Peluquería Nivel 1 – Servicios Auxiliares',
                'rating' => 5,
                'content' => 'La academia tiene un ambiente muy profesional. Las instalaciones son modernas y los profesores están muy cualificados. Repetiría sin dudarlo.',
                'is_published' => true,
            ],
            [
                'student_name' => 'Ana López',
                'course' => 'Barbería Profesional',
                'rating' => 5,
                'content' => 'Vine de fuera de Almería para hacer el curso y mereció la pena cada kilómetro. Formación de calidad a un precio muy accesible.',
                'is_published' => true,
            ],
            [
                'student_name' => 'Mohamed Aouad',
                'course' => 'Barbería Profesional',
                'rating' => 5,
                'content' => 'Llegué sin saber nada de barbería y ahora tengo mi propio local. La academia me enseñó todo lo que necesitaba, técnica y negocio.',
                'is_published' => true,
            ],
            [
                'student_name' => 'Carmen Vidal',
                'course' => 'Extensiones y Mechas Avanzadas',
                'rating' => 4,
                'content' => 'El curso de extensiones superó mis expectativas. Muy detallado, con mucha práctica y un equipo de profesores que realmente saben del tema.',
                'is_published' => false, 
            ],
        ];
        foreach ($testimonials as $data) {
            Testimonial::create($data);
        }
    }
}
