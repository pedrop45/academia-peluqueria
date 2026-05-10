<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use App\Models\BlogPost;
use Illuminate\Support\Carbon;
class BlogPostSeeder extends Seeder
{
    public function run(): void
    {
        $posts = [
            [
                'title' => 'Las tendencias en barbería para 2025',
                'excerpt' => 'El fade, el drop fade y los diseños geométricos dominan la barbería este año. Descubre cómo incorporarlos a tu salón.',
                'content' => '<p>El mundo de la barbería no para de evolucionar. En 2025, los cortes más demandados combinan precisión técnica con creatividad artística.</p><p><strong>Tendencias destacadas:</strong></p><ul><li>High fade y drop fade con degradado suave</li><li>Diseños y líneas geométricas en la sien</li><li>Barba de 3 días trabajada con tijera</li><li>Peinados años 50 revisitados (pompadour, slick back)</li></ul><p>En C.E.P. Montserrat González enseñamos todas estas técnicas en nuestro curso de Barbería Profesional. ¿Te apuntas?</p>',
                'cover_image' => null,
                'is_published' => true,
                'published_at' => Carbon::parse('2025-02-10'),
            ],
            [
                'title' => 'Cómo conseguir el certificado de profesionalidad en peluquería',
                'excerpt' => 'Te explicamos paso a paso el proceso para obtener un certificado de profesionalidad oficial y las ventajas laborales que conlleva.',
                'content' => '<p>El certificado de profesionalidad es la titulación oficial que acredita tu competencia para ejercer en el sector. Está regulado por el SEPE y tiene validez en todo el territorio nacional y en la UE.</p><h3>¿Qué certificados ofrecemos?</h3><ul><li>IMPQ0108 – Peluquería</li><li>IMPQ0208 – Estética</li><li>SSCE0110 – Docencia de la formación profesional</li></ul><p>Para obtenerlo es necesario completar los módulos formativos y las prácticas en empresa. En nuestra academia te acompañamos en todo el proceso.</p>',
                'cover_image' => null,
                'is_published' => true,
                'published_at' => Carbon::parse('2025-01-22'),
            ],
            [
                'title' => 'Arraigo para formación: cómo obtener el permiso de residencia',
                'excerpt' => 'La formación con certificado de profesionalidad abre la puerta al arraigo en España. Te contamos todo lo que necesitas saber.',
                'content' => '<p>El arraigo para la formación es una autorización de residencia temporal que permite a personas extranjeras en situación irregular obtener un permiso de residencia si se comprometen a realizar una formación oficial.</p><p>Requisitos principales:</p><ul><li>Estar en situación irregular en España</li><li>Acreditar la permanencia continuada de al menos 2 años</li><li>No tener antecedentes penales en España ni en el país de origen</li><li>Matricularse en una formación oficial mínima de 1 año</li></ul><p>Nuestros certificados de profesionalidad cumplen los requisitos. Contacta con nosotros para más información.</p>',
                'cover_image' => null,
                'is_published' => true,
                'published_at' => Carbon::parse('2025-01-05'),
            ],
            [
                'title' => 'Entrevista con Montserrat González: 35 años formando profesionales',
                'excerpt' => 'La directora de C.E.P. Montserrat González nos habla de la evolución del sector y los retos del futuro.',
                'content' => '<p>Montserrat González lleva más de 35 años al frente de su academia en Adra y Almería. En esta entrevista nos cuenta qué ha cambiado en el sector y cuáles son las claves para triunfar como profesional de la imagen personal.</p><p><em>¿Qué es lo que más ha cambiado en estos 35 años?</em></p><p>"Todo y nada. La técnica ha avanzado muchísimo, los productos son mejores, y la moda cambia constantemente. Pero lo fundamental sigue siendo lo mismo: atender bien al cliente, escucharle y hacer que salga contento."</p><p><em>¿Qué consejo le darías a alguien que empieza?</em></p><p>"Que no tenga prisa. La peluquería y la barbería son artes que se aprenden con tiempo y práctica. Y que vengan a formarse bien desde el principio."</p>',
                'cover_image' => null,
                'is_published' => true,
                'published_at' => Carbon::parse('2024-12-15'),
            ],
            [
                'title' => 'Novedades en coloración: técnicas para 2025',
                'excerpt' => 'Balayage, babylights, técnica airtouch... te presentamos las coloraciones más solicitadas y cómo dominarlas.',
                'content' => '<p>La coloración es uno de los servicios más rentables en peluquería. En 2025, los clientes siguen apostando por colores naturales y técnicas que aportan dimensión y movimiento sin un mantenimiento excesivo.</p><p>Las más populares:</p><ul><li><strong>Balayage</strong>: mechas pintadas a mano con efecto degradado</li><li><strong>Babylights</strong>: mechas muy finas que imitan el color del sol</li><li><strong>Airtouch</strong>: técnica con secador que crea transiciones perfectas</li><li><strong>Glossing</strong>: baño de brillo para sellar el color</li></ul>',
                'cover_image' => null,
                'is_published' => false, 
                'published_at' => null,
            ],
        ];
        foreach ($posts as $data) {
            BlogPost::create($data);
        }
    }
}
