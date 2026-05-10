import { useFetch } from '../hooks/useFetch';
const API = 'http://localhost:8000/api';
const BACKEND = 'http://localhost:8000';
function StarRating({ n = 5 }) {
    return <span style={{ color: '#c9a24d' }}>{'★'.repeat(n)}{'☆'.repeat(5 - n)}</span>;
}
function TestimonialVideo({ url }) {
    const isLocal = url.startsWith('/storage/');


    let embedUrl = null;
    if (!isLocal) {
        try {
            if (url.includes('youtube.com/watch?v=')) {
                const videoId = new URL(url).searchParams.get('v');
                if (videoId) embedUrl = `https://www.youtube.com/embed/${videoId}`;
            } else if (url.includes('youtu.be/')) {
                const videoId = url.split('youtu.be/')[1].split('?')[0];
                if (videoId) embedUrl = `https://www.youtube.com/embed/${videoId}`;
            } else if (url.includes('vimeo.com/')) {
                const videoId = url.split('vimeo.com/')[1].split('/')[0];
                if (videoId) embedUrl = `https://player.vimeo.com/video/${videoId}`;
            } else if (url.includes('youtube.com/embed/') || url.includes('player.vimeo.com/')) {
                embedUrl = url;
            }
        } catch (e) {

        }
    }
    if (embedUrl) {
        return (
            <div className="mb-3 rounded overflow-hidden" style={{ background: '#000', position: 'relative', paddingTop: '56.25%' }}>
                <iframe
                    src={embedUrl}
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title="Testimonio en vídeo"
                />
            </div>
        );
    }
    const videoSrc = isLocal ? `${BACKEND}${url}` : url;
    return (
        <div className="mb-3 rounded overflow-hidden" style={{ background: '#000' }}>
            <video
                controls
                preload="metadata"
                className="w-100 rounded"
                style={{ maxHeight: 260, objectFit: 'contain' }}
            >
                <source src={videoSrc} />
                Tu navegador no soporta la reproducción de vídeo.
            </video>
        </div>
    );
}
function Testimonios() {
    const { data, loading, error } = useFetch(`${API}/testimonials`);
    const fallback = [
        { id: 1, name: 'Laura M.', text: 'El mejor curso de peluquería que he hecho. Montserrat es una profesora increíble, muy cercana y con muchísima experiencia.', rating: 5, course: 'Peluquería Nivel 2' },
        { id: 2, name: 'Alejandro P.', text: 'Gracias a la academia conseguí trabajo en menos de un mes. La formación de barbería es muy completa y práctica desde el primer día.', rating: 5, course: 'Barbería Profesional' },
        { id: 3, name: 'Sofía R.', text: 'Lo recomiendo 100%. El certificado de profesionalidad SSCE0110 me permitió impartir clases en otras academias.', rating: 5, course: 'Certificado SSCE0110' },
        { id: 4, name: 'Marta G.', text: 'Hice el curso de maquillaje online y quedé muy satisfecha. Los materiales son excelentes y el seguimiento por parte del equipo, insuperable.', rating: 4, course: 'Técnicas de Maquillaje' },
        { id: 5, name: 'Carlos T.', text: 'La academia tiene un ambiente muy profesional. Las instalaciones son modernas y los profesores están muy cualificados.', rating: 5, course: 'Peluquería Nivel 1' },
        { id: 6, name: 'Ana L.', text: 'Vine de fuera de Almería para hacer el curso y mereció la pena cada kilómetro. Formación de calidad a un precio muy accesible.', rating: 5, course: 'Barbería Profesional' },
    ];
    const testimonials = (!loading && !error && data?.length > 0) ? data : fallback;
    return (
        <div className="container py-5">
            <div className="text-center mb-5">
                <h1 className="fw-bold" style={{ color: '#3b2e12' }}>Testimonios</h1>
                <p className="text-muted">Lo que dicen nuestros alumnos sobre su experiencia.</p>
            </div>
            {loading && (
                <div className="alert alert-info d-flex align-items-center">
                    <div className="spinner-border spinner-border-sm me-2"></div>Cargando testimonios...
                </div>
            )}
            <div className="row g-4">
                {testimonials.map(t => (
                    <div className="col-md-6 col-lg-4" key={t.id}>
                        <div className="card h-100 border-0 shadow-sm p-4">
                            {}
                            {t.video_url && <TestimonialVideo url={t.video_url} />}
                            <div className="mb-2"><StarRating n={t.rating} /></div>
                            <p className="card-text text-muted mb-3" style={{ fontStyle: 'italic', fontSize: '.92rem' }}>
                                "{t.text || t.content}"
                            </p>
                            <div className="mt-auto">
                                <div className="fw-bold">{t.name || t.student_name}</div>
                                {t.course && <small className="text-muted">{t.course}</small>}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
export default Testimonios;
