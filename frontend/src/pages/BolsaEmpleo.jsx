import { Link } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
const API = '/api';
function BolsaEmpleo() {
    const { data: resp, loading, error } = useFetch(`${API}/jobs/candidates`);
    const hasData = !loading && !error && resp?.data?.length > 0;
    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <h1 className="fw-bold mb-2" style={{ color: '#3b2e12' }}>Bolsa de Empleo</h1>
                    <p className="text-muted mb-5">
                        Conectamos a nuestros alumnos titulados con empresas y salones del sector.
                        Si eres empresario/a y buscas profesionales, contacta con nosotros.
                    </p>
                    {loading && (
                        <div className="alert alert-info d-flex align-items-center">
                            <div className="spinner-border spinner-border-sm me-2"></div>Cargando candidatos...
                        </div>
                    )}
                    {hasData ? (
                        <div className="row g-3">
                            {resp.data.map(c => (
                                <div className="col-md-6" key={c.id}>
                                    <div className="card border-0 shadow-sm p-3">
                                        {c.photo && (
                                            <img src={c.photo} alt={c.full_name}
                                                className="rounded-circle mb-2"
                                                style={{ width: 60, height: 60, objectFit: 'cover' }} />
                                        )}
                                        <h5 className="fw-bold mb-1">{c.full_name}</h5>
                                        {c.location && <small className="text-muted d-block mb-1">📍 {c.location}</small>}
                                        {c.skills && <span className="badge bg-dark mb-2">{c.skills.split(',')[0]}</span>}
                                        {c.bio && <p className="text-muted mb-0" style={{ fontSize: '.88rem' }}>{c.bio}</p>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : !loading && (
                        <>
                            {}
                            <div className="card border-0 shadow-sm p-4 mb-4 text-center" style={{ background: '#f9f5ee' }}>
                                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💼</div>
                                <h3 className="fw-bold mb-2" style={{ color: '#3b2e12' }}>Bolsa de empleo activa próximamente</h3>
                                <p className="text-muted mb-0">
                                    Estamos preparando nuestra bolsa de empleo digital para conectar a nuestros titulados
                                    con las mejores empresas del sector de imagen personal.
                                </p>
                            </div>
                            <div className="row g-3 mb-4">
                                <div className="col-md-6">
                                    <div className="card border-0 shadow-sm p-3 h-100">
                                        <h5 className="fw-bold mb-2">👤 Soy alumno/a graduado/a</h5>
                                        <p className="text-muted mb-3" style={{ fontSize: '.9rem' }}>
                                            Inscríbete en nuestra bolsa de empleo para que las empresas colaboradoras puedan encontrarte.
                                        </p>
                                        <Link to="/contacto" className="btn btn-dark btn-sm">Inscribirme</Link>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="card border-0 shadow-sm p-3 h-100">
                                        <h5 className="fw-bold mb-2">🏢 Soy empresa</h5>
                                        <p className="text-muted mb-3" style={{ fontSize: '.9rem' }}>
                                            Publica tu oferta y accede a nuestra base de datos de profesionales titulados y cualificados.
                                        </p>
                                        <Link to="/contacto" className="btn btn-outline-dark btn-sm">Publicar oferta</Link>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
export default BolsaEmpleo;
