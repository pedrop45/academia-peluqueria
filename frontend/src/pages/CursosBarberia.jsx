import { CourseListPage } from '../components/CourseListPage';

function CursosBarberia() {
    return (
        <div>
            {/* Hero Section */}
            <div className="text-white py-5 position-relative" style={{ minHeight: '45vh', display: 'flex', alignItems: 'center' }}>
                <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundImage: 'url(https://images.unsplash.com/photo-1503951914875-452162b0f3f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80)',
                    backgroundSize: 'cover', backgroundPosition: 'center',
                    zIndex: 0
                }}></div>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to right, rgba(14,14,14,0.95), rgba(14,14,14,0.6))', zIndex: 1 }}></div>
                <div className="container position-relative" style={{ zIndex: 2 }}>
                    <div className="row">
                        <div className="col-md-8 col-lg-6">
                            <span className="badge mb-3" style={{ background: '#c9a24d', color: '#111', fontSize: '0.9rem', padding: '0.4rem 1rem', borderRadius: '999px' }}>Barbería y Peluquería</span>
                            <h1 className="fw-bold display-4 mb-3">Conviértete en un Profesional del Cabello</h1>
                            <p className="lead mb-4" style={{ color: 'rgba(255,255,255,0.85)' }}>
                                Fórmate con expertos del sector y domina las técnicas más avanzadas. Cursos diseñados para quienes buscan excelencia en el arte del corte, color y diseño de barbas.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Informational Section */}
            <div className="container py-5 mt-3">
                <div className="row g-5 align-items-center">
                    <div className="col-lg-6">
                        <h2 className="fw-bold mb-4" style={{ color: '#3b2e12' }}>Por qué especializarte con nosotros</h2>
                        <ul className="list-unstyled">
                            <li className="d-flex mb-4">
                                <div className="me-3 mt-1" style={{ fontSize: '1.5rem' }}>✂️</div>
                                <div>
                                    <h5 className="fw-bold mb-1">Técnicas modernas y clásicas</h5>
                                    <p className="text-muted mb-0">Aprende desde el afeitado tradicional a navaja hasta los degradados (fade), diseño de color y texturizados más actuales.</p>
                                </div>
                            </li>
                            <li className="d-flex mb-4">
                                <div className="me-3 mt-1" style={{ fontSize: '1.5rem' }}>👨‍🏫</div>
                                <div>
                                    <h5 className="fw-bold mb-1">Práctica desde el primer día</h5>
                                    <p className="text-muted mb-0">Un enfoque enfocado a la práctica real, perfeccionando tus habilidades sobre maniquíes y clientes reales.</p>
                                </div>
                            </li>
                            <li className="d-flex">
                                <div className="me-3 mt-1" style={{ fontSize: '1.5rem' }}>💼</div>
                                <div>
                                    <h5 className="fw-bold mb-1">Bolsa de empleo exclusiva</h5>
                                    <p className="text-muted mb-0">Te conectamos con las mejores barberías y salones de belleza para que des el salto al mercado laboral nada más terminar tu formación.</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div className="col-lg-6">
                        <div className="position-relative" style={{ padding: '1rem' }}>
                            <div style={{
                                position: 'absolute', top: 0, right: 0, width: '80%', height: '80%',
                                border: '3px solid #c9a24d', borderRadius: '14px', zIndex: 0
                            }}></div>
                            <img src="https://images.unsplash.com/photo-1599351431202-1e0f0137899a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                                alt="Práctica en barbería" 
                                className="img-fluid shadow" 
                                style={{ borderRadius: '14px', position: 'relative', zIndex: 1, objectFit: 'cover' }} 
                            />
                        </div>
                    </div>
                </div>
            </div>

            <hr className="my-0" style={{ opacity: 0.1 }} />

            {/* Courses List */}
            <div style={{ backgroundColor: '#faf2e8' }}>
                <CourseListPage
                    title="Nuestros cursos de la especialidad"
                    subtitle="Selecciona el programa que mejor se adapte a tu nivel y empieza a formarte."
                    modality="presencial"
                    category="barberia_peluqueria" 
                    emptyMsg="Actualmente estamos actualizando nuestros cursos de barbería y peluquería. Vuelve pronto o consúltanos por teléfono."
                />
            </div>
        </div>
    );
}

export default CursosBarberia;
