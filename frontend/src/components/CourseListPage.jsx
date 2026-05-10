import { Link, useNavigate } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import { useCart } from '../context/CartContext';
import { useState } from 'react';

const API = 'http://127.0.0.1:8000/api';
const BASE = 'http://127.0.0.1:8000';

const prettyCategory = (cat) => {
    const map = {
        barberia_peluqueria: 'Barbería y Peluquería',
        certificados: 'Certificados',
        especialidades: 'Especialidades',
    };
    return map[cat] || cat || '';
};

const resolveImageUrl = (img) => {
    if (!img) return null;
    if (img.startsWith('http')) return img;         
    if (img.startsWith('/')) return `${BASE}${img}`; 
    return `${BASE}/${img}`;                         
};

function CourseCard({ course, onAddToCart, onBuyNow, inCart }) {
    const catLabel = prettyCategory(course.category);
    const imgUrl = resolveImageUrl(course.image);
    const canBuy = course.is_purchasable;

    return (
        <div className="col-md-6 col-lg-4">
            <div className="card h-100 shadow-sm border-0" style={{ borderRadius: '14px', overflow: 'hidden' }}>
                {imgUrl && (
                    <img
                        src={imgUrl}
                        className="card-img-top"
                        alt={course.title}
                        style={{ height: '180px', objectFit: 'cover' }}
                    />
                )}

                <div className="card-body d-flex flex-column">
                    <h5 className="card-title fw-bold">{course.title}</h5>

                    <p className="card-text text-muted flex-grow-1" style={{ fontSize: '.88rem' }}>
                        {course.description?.substring(0, 110)}
                        {course.description?.length > 110 ? '...' : ''}
                    </p>

                    {/* Extras */}
                    <div className="d-flex flex-wrap gap-2 mt-1">
                        {course.duration && (
                            <span className="badge bg-secondary">⏱ {course.duration}</span>
                        )}

                        {/* Nivel solo para certificados */}
                        {course.category === 'certificados' && course.level && (
                            <span className="badge bg-warning text-dark">Nivel {course.level}</span>
                        )}

                        {}
                        {catLabel && (
                            <span className="badge bg-dark">{catLabel}</span>
                        )}
                    </div>
                </div>

                <div className="card-footer bg-white border-0 d-flex flex-column gap-3 pb-3">
                    <div className="d-flex justify-content-between align-items-center">
                        <span className="fw-bold fs-5" style={{ color: '#c9a24d' }}>
                            {course.price && parseFloat(course.price) > 0 ? `${Number(course.price).toFixed(2)} €` : 'Consultar'}
                        </span>
                        <Link to="/contacto" className="btn btn-sm btn-outline-dark rounded-pill px-3">
                            Info
                        </Link>
                    </div>

                    <div className="d-flex gap-2 w-100">
                        <button
                            className="btn btn-sm fw-semibold flex-grow-1"
                            onClick={() => canBuy && onAddToCart(course)}
                            disabled={inCart || !canBuy}
                            title={!canBuy ? 'No disponible para compra online' : inCart ? 'Ya está en el carrito' : 'Añadir al carrito'}
                            style={{
                                background: inCart ? '#e8f5e9' : canBuy ? '#fdf8ed' : '#f0ece2',
                                color: inCart ? '#2e7d32' : canBuy ? '#c9a24d' : '#999',
                                border: canBuy ? '1px solid #c9a24d' : '1px dashed #ccc',
                                borderRadius: '999px',
                                transition: 'all .2s',
                                cursor: !canBuy ? 'not-allowed' : 'pointer',
                            }}
                        >
                            {inCart ? '✓ En carrito' : '🛒 Añadir'}
                        </button>

                        {canBuy && !inCart && (
                            <button
                                className="btn btn-sm fw-semibold flex-grow-1"
                                onClick={() => onBuyNow(course)}
                                style={{
                                    background: 'linear-gradient(135deg,#c9a24d,#e0b85c)',
                                    color: '#111',
                                    border: 'none',
                                    borderRadius: '999px',
                                    cursor: 'pointer',
                                }}
                            >
                                ⚡ Comprar
                            </button>
                        )}
                        {canBuy && inCart && (
                            <Link
                                to="/carrito"
                                className="btn btn-sm fw-semibold flex-grow-1 text-center text-decoration-none"
                                style={{
                                    background: 'linear-gradient(135deg,#c9a24d,#e0b85c)',
                                    color: '#111',
                                    border: 'none',
                                    borderRadius: '999px',
                                    display: 'inline-block',
                                    lineHeight: '1.5'
                                }}
                            >
                                Ver carrito →
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export function CourseListPage({ title, subtitle, modality, category, level, emptyMsg }) {
    const params = new URLSearchParams();
    if (modality) params.set('modality', modality);
    if (category) params.set('category', category);
    if (level !== undefined && level !== null && level !== '') params.set('level', String(level));

    const url = `${API}/courses${params.toString() ? `?${params.toString()}` : ''}`;
    const { data, loading, error } = useFetch(url);

    const { addToCart, isInCart } = useCart();
    const navigate = useNavigate();
    const [toast, setToast] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const handleAddToCart = (course) => {
        if (!course.is_purchasable) return;
        addToCart(course);
        setToast(`✅ "${course.title}" añadido al carrito`);
        setTimeout(() => setToast(''), 3000);
    };

    const handleBuyNow = (course) => {
        if (!course.is_purchasable) return;
        if (!isInCart(course.id)) {
            addToCart(course);
        }
        navigate('/carrito');
    };

    const displayedCourses = data?.filter(course =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (course.description && course.description.toLowerCase().includes(searchQuery.toLowerCase()))
    ) || [];

    return (
        <div className="container py-5">
            <h1 className="fw-bold mb-1" style={{ color: '#3b2e12' }}>{title}</h1>
            {subtitle && <p className="text-muted mb-4">{subtitle}</p>}

            {}
            <div className="position-relative mb-4">
                <span className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted">🔍</span>
                <input 
                    type="text" 
                    className="form-control form-control-lg ps-5 shadow-sm border-0 bg-white" 
                    placeholder="Buscar por nombre o descripción..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ borderRadius: '12px' }}
                />
            </div>

            {}
            {toast && (
                <div
                    style={{
                        position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999,
                        background: '#1a1a1a', color: '#fff',
                        padding: '.75rem 1.25rem',
                        borderRadius: '12px',
                        boxShadow: '0 4px 20px rgba(0,0,0,.3)',
                        display: 'flex', alignItems: 'center', gap: '.5rem',
                        borderLeft: '4px solid #c9a24d',
                        fontSize: '.9rem',
                        animation: 'fadeIn .2s ease',
                    }}
                >
                    {toast}
                </div>
            )}

            {loading && (
                <div className="alert alert-info d-flex align-items-center">
                    <div className="spinner-border spinner-border-sm me-2"></div>
                    Cargando cursos...
                </div>
            )}

            {error && <div className="alert alert-danger">{error}</div>}

            {!loading && !error && displayedCourses.length === 0 && data?.length > 0 && (
                <div className="alert alert-warning">
                    No hay cursos que coincidan con tu búsqueda.
                </div>
            )}

            {!loading && !error && (data?.length ?? 0) === 0 && (
                <div className="alert alert-warning">
                    {emptyMsg || 'No hay cursos disponibles en este momento.'}
                </div>
            )}

            <div className="row g-4">
                {displayedCourses.map((c) => (
                    <CourseCard 
                        key={c.id} 
                        course={c} 
                        onAddToCart={handleAddToCart}
                        onBuyNow={handleBuyNow}
                        inCart={isInCart(c.id)}
                    />
                ))}
            </div>

            <div className="text-center mt-5">
                <Link to="/contacto" className="btn btn-dark btn-lg px-4">
                    Solicitar información
                </Link>
            </div>
        </div>
    );
}