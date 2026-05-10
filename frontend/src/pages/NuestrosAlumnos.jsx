import { Link } from 'react-router-dom';
function NuestrosAlumnos() {
    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-lg-8 text-center">
                    <h1 className="fw-bold mb-3" style={{ color: '#3b2e12' }}>Nuestros Alumnos</h1>
                    <p className="lead text-muted mb-4">
                        Formamos profesionales de élite en peluquería, barbería y estética desde 1987.
                        Nuestros alumnos trabajan en los mejores salones de Andalucía y toda España.
                    </p>
                </div>
            </div>
            {}
            <div className="row g-4 mb-5 text-center">
                {[
                    { num: '+1.500', label: 'Alumnos formados' },
                    { num: '35+', label: 'Años de experiencia' },
                    { num: '2', label: 'Centros (Adra y Almería)' },
                    { num: '98%', label: 'Inserción laboral' },
                ].map(stat => (
                    <div className="col-6 col-md-3" key={stat.label}>
                        <div className="p-4 rounded-3 shadow-sm h-100" style={{ background: '#111', color: '#c9a24d' }}>
                            <div style={{ fontSize: '2rem', fontWeight: 900 }}>{stat.num}</div>
                            <div style={{ color: 'rgba(255,255,255,.7)', fontSize: '.85rem', marginTop: '.25rem' }}>{stat.label}</div>
                        </div>
                    </div>
                ))}
            </div>
            {}
            <div className="row g-4 mb-5">
                <div className="col-md-6">
                    <h2 className="fw-bold mb-3" style={{ color: '#3b2e12' }}>¿Qué ofrecemos a nuestros alumnos?</h2>
                    <ul className="list-unstyled" style={{ lineHeight: '2' }}>
                        {[
                            '✅ Formación práctica desde el primer día',
                            '✅ Certificados de profesionalidad oficiales',
                            '✅ Acceso a la bolsa de empleo del centro',
                            '✅ Prácticas en empresas colaboradoras',
                            '✅ Tutorización personalizada',
                            '✅ Materiales y herramientas incluidos',
                        ].map(item => <li key={item}>{item}</li>)}
                    </ul>
                </div>
                <div className="col-md-6">
                    <h2 className="fw-bold mb-3" style={{ color: '#3b2e12' }}>¿Eres exalumno/a?</h2>
                    <p className="text-muted mb-3">
                        Si ya has finalizado tu formación con nosotros, puedes acceder a nuestra bolsa de empleo
                        para encontrar oportunidades laborales o dar a conocer tu perfil a empresas colaboradoras.
                    </p>
                    <div className="d-flex gap-2 flex-wrap">
                        <Link to="/bolsa-empleo" className="btn btn-dark px-4">Ver bolsa de empleo</Link>
                        <Link to="/contacto" className="btn btn-outline-dark px-4">Contactar</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default NuestrosAlumnos;
