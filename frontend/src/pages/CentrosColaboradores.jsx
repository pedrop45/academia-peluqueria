import { useState } from 'react';
import { useFetch } from '../hooks/useFetch';
const API = '/api';
const BASE = '';
const resolveImageUrl = (img) => {
    if (!img) return null;
    if (img.startsWith('http')) return img;
    if (img.startsWith('/')) return `${BASE}${img}`;
    return `${BASE}/${img}`;
};

function CentrosColaboradores() {
    const { data, loading, error } = useFetch(`${API}/partners`);
    const centers = data || [];
    const [selectedPartner, setSelectedPartner] = useState(null);

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
            {error && (
                <div className="alert alert-danger">Error al cargar colaboradores.</div>
            )}
            <div className="row g-4 mb-5">
                {centers.map(c => (
                    <div className="col-sm-6 col-lg-3" key={c.id}>
                        <div 
                            className="card h-100 border-0 shadow-sm text-center p-4"
                            style={{ cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }}
                            onMouseOver={e => e.currentTarget.style.transform = 'translateY(-5px)'}
                            onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
                            onClick={() => setSelectedPartner(c)}
                        >
                            {c.logo
                                ? <img src={resolveImageUrl(c.logo)} alt={c.name} className="mb-2 mx-auto d-block"
                                    style={{ height: 60, objectFit: 'contain' }} />
                                : <div style={{ fontSize: '2.5rem', marginBottom: '.5rem' }}>🤝</div>
                            }
                            <h5 className="fw-bold mb-1" style={{ color: '#3b2e12' }}>{c.name}</h5>
                            {(c.location || c.city) && (
                                <small className="text-muted d-block mb-1">📍 {c.location || c.city}</small>
                            )}
                            <button 
                                className="btn btn-outline-dark btn-sm mt-auto mx-auto" 
                                style={{ borderRadius: '999px' }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedPartner(c);
                                }}
                            >
                                + Info
                            </button>
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

            {/* Modal */}
            {selectedPartner && (
                <div className="modal d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.5)', zIndex: 1050 }}
                    onClick={e => e.target === e.currentTarget && setSelectedPartner(null)}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '16px', overflow: 'hidden' }}>
                            <div className="modal-header border-0 pb-0 justify-content-end">
                                <button className="btn-close" onClick={() => setSelectedPartner(null)} />
                            </div>
                            <div className="modal-body text-center pt-0 px-4 pb-4">
                                {selectedPartner.logo ? (
                                    <img src={resolveImageUrl(selectedPartner.logo)} alt={selectedPartner.name} className="mb-3" style={{ height: '90px', objectFit: 'contain' }} />
                                ) : (
                                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🤝</div>
                                )}
                                <h3 className="fw-bold mb-1" style={{ color: '#3b2e12' }}>{selectedPartner.name}</h3>
                                {selectedPartner.location && (
                                    <p className="text-muted mb-3"><span className="fw-semibold">📍 Dirección:</span> {selectedPartner.location}</p>
                                )}
                                
                                {selectedPartner.description && (
                                    <div className="text-start mb-4 p-3 rounded" style={{ background: '#fdf8ed', borderLeft: '4px solid #c9a24d' }}>
                                        <p className="mb-0" style={{ whiteSpace: 'pre-wrap', fontSize: '0.95rem' }}>{selectedPartner.description}</p>
                                    </div>
                                )}

                                <div className="d-flex flex-column gap-2 text-start px-3">
                                    {selectedPartner.email && (
                                        <div><span className="fw-semibold">✉️ Email:</span> <a href={`mailto:${selectedPartner.email}`} className="text-dark">{selectedPartner.email}</a></div>
                                    )}
                                    {selectedPartner.phone && (
                                        <div><span className="fw-semibold">📞 Teléfono:</span> <a href={`tel:${selectedPartner.phone}`} className="text-dark">{selectedPartner.phone}</a></div>
                                    )}
                                    {selectedPartner.website && (
                                        <div className="mt-2 text-center">
                                            <a href={selectedPartner.website} target="_blank" rel="noreferrer" className="btn btn-outline-dark btn-sm w-100" style={{ borderRadius: '999px' }}>
                                                🌐 Visitar página web
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
export default CentrosColaboradores;
