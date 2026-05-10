import { useFetch } from '../hooks/useFetch';
const API = 'http://localhost:8000/api';
function CentrosColaboradores() {
    const { data, loading, error } = useFetch(`${API}/partners`);
    const centers = data || [];
    return (
        <div className="container py-5">
            <div className="text-center mb-5">
                <h1 className="fw-bold" style={{ color: '#3b2e12' }}>Centros Colaboradores</h1>
                <p className="text-muted">Empresas de confianza que acogen a nuestros alumnos en prácticas y ofrecen empleo a nuestros titulados.</p>
            </div>
            {loading && (
                <div className="alert alert-info d-flex align-items-center">
                    <div className="spinner-border spinner-border-sm me-2"></div>Cargando colaboradores...
                </div>
            )}
            <div className="row g-4 mb-5">
                {centers.map(c => (
                    <div className="col-sm-6 col-lg-3" key={c.id}>
                        <div className="card h-100 border-0 shadow-sm text-center p-4">
                            {c.logo
                                ? <img src={c.logo} alt={c.name} className="mb-2 mx-auto d-block"
                                    style={{ height: 60, objectFit: 'contain' }} />
                                : <div style={{ fontSize: '2.5rem', marginBottom: '.5rem' }}>🤝</div>
                            }
                            <h5 className="fw-bold mb-1" style={{ color: '#3b2e12' }}>{c.name}</h5>
                            {(c.location || c.city) && (
                                <small className="text-muted d-block mb-1">📍 {c.location || c.city}</small>
                            )}
                            {(c.description || c.type) && (
                                <p className="text-muted mb-1" style={{ fontSize: '.82rem' }}>
                                    {c.description || c.type}
                                </p>
                            )}
                            {c.website && (
                                <a href={c.website} target="_blank" rel="noreferrer"
                                    className="btn btn-outline-dark btn-sm mt-1" style={{ fontSize: '.78rem' }}>
                                    Ver web
                                </a>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            <div className="card border-0 shadow-sm p-4 text-center" style={{ background: '#f9f5ee' }}>
                <h4 className="fw-bold mb-2" style={{ color: '#3b2e12' }}>¿Tu empresa quiere colaborar?</h4>
                <p className="text-muted mb-3">
                    Si tienes un salón, barbería o centro de estética y quieres recibir alumnos en prácticas
                    o incorporar a nuestros titulados, ¡contacta con nosotros!
                </p>
                <a href="/contacto" className="btn btn-dark px-4">Convertirme en colaborador</a>
            </div>
        </div>
    );
}
export default CentrosColaboradores;
