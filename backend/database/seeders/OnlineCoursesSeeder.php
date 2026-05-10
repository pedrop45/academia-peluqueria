<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
class OnlineCoursesSeeder extends Seeder
{
    public function run()
    {
        $courses = [
            ['title' => 'Especialista en Aromaterapia', 'duration' => '200h'],
            ['title' => 'QUIE003PO Elaboración de Aromas y Esencias', 'duration' => '8h'],
            ['title' => 'IMPE014PO Tratamientos de Balneoterapia', 'duration' => '24h'],
            ['title' => 'Perfumería y Cosmética Natural', 'duration' => '65h'],
            ['title' => 'Curso de Técnico en Peluquería Canina', 'duration' => '120h'],
            ['title' => 'Curso de Alergias y Homeopatía (200h)', 'duration' => '200h'],
            ['title' => 'Especialista en Productos Cosméticos y Dermofarmacia', 'duration' => '300h'],
            ['title' => 'Curso de Fitoterapia', 'duration' => '200h'],
            ['title' => 'IMPE006PO Masaje Balinés', 'duration' => '30h'],
            ['title' => 'Curso Superior en Homeopatía, Fitoterapia y Nutrición', 'duration' => '400h'],
            ['title' => 'Curso en Farmacia Alternativa: Farmacia Homeopática y Fitoterapia', 'duration' => '200h'],
            ['title' => 'Curso de Homeopatía y Fitoterapia', 'duration' => '200h'],
            ['title' => 'Curso de Herbodietética y Fitoterapia', 'duration' => '200h'],
            ['title' => 'Curso Online de Herbodietética y Homeopatía: Práctica', 'duration' => '150h'],
            ['title' => 'Curso Técnico en Naturopatía', 'duration' => '200h'],
            ['title' => 'Curso de Naturopatía', 'duration' => '120h'],
            ['title' => 'AGAU012PO Plantas Aromáticas y Medicinales: Principales Técnicas de Cultivo y Recolección', 'duration' => '60h'],
            ['title' => 'Curso de Herbodietética', 'duration' => '200h'],
            ['title' => 'Curso en Plantas Medicinales', 'duration' => '200h'],
            ['title' => 'Curso en Homeopatía', 'duration' => '200h'],
            ['title' => 'QUIE005PO Tratamiento con Plantas Medicinales', 'duration' => '30h'],
            ['title' => 'SANT034PO Cuidados y Terapias Naturales', 'duration' => '65h'],
            ['title' => 'Curso de Medicina Tradicional China', 'duration' => '150h'],
            ['title' => 'Curso Antiaging', 'duration' => '200h'],
            ['title' => 'Especialista en Sales de Schüssler', 'duration' => '200h'],
            ['title' => 'SANT066PO Homeopatía', 'duration' => '100h'],
            ['title' => 'SANT0191 Homeopatía', 'duration' => '100h'],
            ['title' => 'Experto en Radiestesia, Geobiología y Feng Shui', 'duration' => '240h'],
            ['title' => 'Curso de Flores de Bach', 'duration' => '150h'],
            ['title' => 'Curso de Psicología Holística', 'duration' => '200h'],
            ['title' => 'Curso de Alergias y Homeopatía (180h)', 'duration' => '180h'],
            ['title' => 'Curso de Biodescodificación Emocional', 'duration' => '200h'],
            ['title' => 'Curso en Reflexología Facial', 'duration' => '200h'],
            ['title' => 'Curso en Reflexología de Manos', 'duration' => '200h'],
            ['title' => 'Curso en Reflexología', 'duration' => '200h'],
            ['title' => 'Curso en Meditación Guiada y Terapia de Thetahealing', 'duration' => '200h'],
            ['title' => 'Especialista en Interpretación de Sueños', 'duration' => '200h'],
            ['title' => 'Curso de Especialista en Zen Shiatsu', 'duration' => '200h'],
            ['title' => 'Curso en Masaje Ayurvédico Abhyanga y Bioenergético', 'duration' => '200h'],
            ['title' => 'Curso de Terapeuta Profesional de Reiki', 'duration' => '200h'],
            ['title' => 'Curso Monitor de Reiki', 'duration' => '200h'],
            ['title' => 'Curso en Instructor de Yoga', 'duration' => '200h'],
            ['title' => 'Curso online de introducción al Yoga', 'duration' => '120h'],
            ['title' => 'Curso de Hatha Yoga', 'duration' => '200h'],
            ['title' => 'Curso de Instructor de Meditación', 'duration' => '200h'],
            ['title' => 'Curso de Instructor de Pilates', 'duration' => '200h'],
            ['title' => 'Especialista en Meditación Vipassana', 'duration' => '200h'],
            ['title' => 'Curso Monitor de Yoga', 'duration' => '200h'],
            ['title' => 'Curso de Introducción al Yoga: Conciencia y Creatividad', 'duration' => '200h'],
            ['title' => 'Curso en Técnicas de Relajación y Respiración', 'duration' => '200h'],
            ['title' => 'Curso online de Técnicas de Relajación: Yoga', 'duration' => '60h'],
            ['title' => 'Monitor de Yoga Infantil', 'duration' => '200h'],
            ['title' => 'Técnico Profesional en Mindfulness', 'duration' => '200h']
        ];
        $insertParams = [];
        $now = now();
        foreach ($courses as $c) {
            $slug = Str::slug($c['title']);
            $originalSlug = $slug;
            $counter = 1;
            while (collect($insertParams)->contains('slug', $slug)) {
                $slug = $originalSlug . '-' . $counter;
                $counter++;
            }
            $insertParams[] = [
                'title' => $c['title'],
                'slug' => $slug,
                'category' => 'especialidades',
                'modality' => 'online',
                'duration' => $c['duration'],
                'price' => null, 
                'active' => true,
                'is_purchasable' => false,
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }
        DB::table('courses')->insert($insertParams);
    }
}
