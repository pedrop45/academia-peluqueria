import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useCart } from '../context/CartContext';
const API = 'http://localhost:8000/api';
const BASE = 'http://localhost:8000';
const resolveImageUrl = (img) => {
    if (!img) return null;
    if (img.startsWith('http')) return img;
    if (img.startsWith('/')) return `${BASE}${img}`;
    return `${BASE}/${img}`;
};
function Cursos() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('');
    const [toast, setToast] = useState(''); // mensaje feedback
    const [searchQuery, setSearchQuery] = useState('');
    const { addToCart, isInCart } = useCart();
    const navigate = useNavigate();
    useEffect(() => {
        setLoading(true);
        setError(null);
        const url = filter ? `${API}/courses?modality=${filter}` : `${API}/courses`;
        axios.get(url)
            .then(res => setCourses(res.data))
            .catch(() => setError('Error al cargar los cursos. Asegúrate de que el backend está corriendo.'))
            .finally(() => setLoading(false));
    }, [filter]);
    const handleShowInfo = (course) => {
        Swal.fire({
            title: `<h3 style="color: #3b2e12; font-weight: bold; margin-bottom: 0;">${course.title}</h3>`,
            html: `
                ${course.image ? `<img src="${resolveImageUrl(course.image)}" style="width:100%; max-height:250px; object-fit:cover; border-radius:12px; margin-bottom:20px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);" />` : ''}
                <div style="text-align: left; font-size: 1rem; color: #444; line-height: 1.6;">
                    <div style="background: #fdf8ed; padding: 12px; border-radius: 8px; margin-bottom: 16px; border-left: 4px solid #c9a24d;">
                        <div style="display: flex; gap: 10px; margin-bottom: 8px;">
                            <span class="badge ${course.modality === 'presencial' ? 'bg-dark' : 'bg-success'}">${course.modality === 'presencial' ? '📍 Presencial' : '💻 Online'}</span>
                            ${course.duration ? `<span class="badge bg-secondary">⏱ ${course.duration}</span>` : ''}
                        </div>
                        <span style="font-weight: bold; color: #c9a24d; font-size: 1.1rem;">
                            ${course.price && parseFloat(course.price) > 0 ? `${parseFloat(course.price).toFixed(2)} €` : 'Precio a consultar'}
                        </span>
                    </div>
                    <p style="white-space: pre-wrap;">${course.description || 'No hay descripción disponible para este curso.'}</p>
                </div>
            `,
            confirmButtonText: 'Cerrar',
            confirmButtonColor: '#3b2e12',
            width: '700px',
            showCloseButton: true
        });
    };

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
    const displayedCourses = courses.filter(course =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (course.description && course.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    return (
        <div className="container py-5">
            <h1 className="fw-bold mb-2" style={{ color: '#3b2e12' }}>Nuestros Cursos</h1>
            <p className="text-muted mb-4">Formación profesional en peluquería, barbería y estética.</p>
            {}
            <div className="d-flex flex-column flex-md-row gap-3 mb-4">
                <div className="flex-grow-1 position-relative">
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
                <div className="btn-group" role="group">
                    <button className={`btn ${filter === '' ? 'btn-dark' : 'btn-outline-dark'}`} onClick={() => setFilter('')}>Todos</button>
                    <button className={`btn ${filter === 'presencial' ? 'btn-dark' : 'btn-outline-dark'}`} onClick={() => setFilter('presencial')}>Presencial</button>
                    <button className={`btn ${filter === 'online' ? 'btn-dark' : 'btn-outline-dark'}`} onClick={() => setFilter('online')}>Online</button>
                </div>
            </div>
            {/* Toast de confirmación */}
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
            {/* Estados */}
            {loading && (
                <div className="alert alert-info d-flex align-items-center">
                    <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                    Cargando cursos...
                </div>
            )}
            {error && <div className="alert alert-danger">{error}</div>}
            {!loading && !error && displayedCourses.length === 0 && (
                <div className="alert alert-warning">No hay cursos que coincidan con tu búsqueda.</div>
            )}
            {/* Cards */}
            <div className="row g-4">
                {displayedCourses.map(course => {
                    const inCart = isInCart(course.id);
                    const canBuy = course.is_purchasable;
                    return (
                        <div className="col-md-6 col-lg-4" key={course.id}>
                            <div className="card h-100 shadow-sm border-0" style={{ borderRadius: '14px', overflow: 'hidden' }}>
                                {course.image && (
                                    <img src={resolveImageUrl(course.image)} className="card-img-top" alt={course.title}
                                        style={{ height: '200px', objectFit: 'cover' }} />
                                )}
                                <div className="card-body d-flex flex-column">
                                    <h5 className="card-title fw-bold">{course.title}</h5>
                                    <p className="card-text text-muted flex-grow-1" style={{ fontSize: '.9rem', cursor: 'pointer' }} onClick={() => handleShowInfo(course)}>
                                        {course.description && course.description.length > 120
                                            ? <>{course.description.substring(0, 120)}... <span style={{color: '#c9a24d', fontWeight: 'bold'}}>(Ver más)</span></>
                                            : course.description}
                                    </p>
                                    <div className="d-flex gap-2 mb-2">
                                        <span className={`badge ${course.modality === 'presencial' ? 'bg-dark' : 'bg-success'}`}>
                                            {course.modality === 'presencial' ? '📍 Presencial' : '💻 Online'}
                                        </span>
                                        {course.duration && <span className="badge bg-secondary">⏱ {course.duration}</span>}
                                    </div>
                                </div>
                                <div className="card-footer bg-white border-0 d-flex flex-column gap-3 pb-3">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span className="fw-bold fs-5" style={{ color: '#c9a24d' }}>
                                            {course.price && parseFloat(course.price) > 0 ? `${parseFloat(course.price).toFixed(2)} €` : 'Consultar'}
                                        </span>
                                        <button onClick={() => handleShowInfo(course)} className="btn btn-sm btn-outline-dark rounded-pill px-3">
                                            Info
                                        </button>
                                    </div>
                                    <div className="d-flex gap-2 w-100">
                                        <button
                                            className="btn btn-sm fw-semibold flex-grow-1"
                                            onClick={() => canBuy && handleAddToCart(course)}
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
                                                onClick={() => handleBuyNow(course)}
                                                style={{
                                                    background: 'linear-gradient(135deg,#c9a24d,#e0b85c)',
                                                    color: '#111',
                                                    border: 'none',
                                                    borderRadius: '999px',
                                                    cursor: 'pointer',
                                                }}
                                            >
                                                ⚡ Comprar ahora
                                            </button>
                                        )}
                                        {canBuy && inCart && (
                                            <button
                                                className="btn btn-sm fw-semibold flex-grow-1"
                                                onClick={() => navigate('/carrito')}
                                                style={{
                                                    background: 'linear-gradient(135deg,#c9a24d,#e0b85c)',
                                                    color: '#111',
                                                    border: 'none',
                                                    borderRadius: '999px',
                                                    cursor: 'pointer',
                                                }}
                                            >
                                                Ver carrito →
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
export default Cursos;
