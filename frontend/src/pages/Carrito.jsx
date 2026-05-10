import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const BASE = 'http://localhost:8000';

const resolveImageUrl = (img) => {
    if (!img) return null;
    if (img.startsWith('http')) return img;
    if (img.startsWith('/')) return `${BASE}${img}`;
    return `${BASE}/${img}`;
};

function Carrito() {
    const { cart, removeFromCart, clearCart, cartTotal } = useCart();
    const navigate = useNavigate();
    const API = 'http://localhost:8000/api';
    return (
        <div className="container py-5" style={{ minHeight: '60vh' }}>
            <h1 className="fw-bold mb-1" style={{ color: '#3b2e12' }}>
                🛒 Tu carrito
            </h1>
            <p className="text-muted mb-4">
                {cart.length === 0
                    ? 'No tienes cursos en el carrito.'
                    : `${cart.length} curso${cart.length > 1 ? 's' : ''} seleccionado${cart.length > 1 ? 's' : ''}`}
            </p>
            {cart.length === 0 ? (
                <div className="text-center py-5">
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎓</div>
                    <h4 className="text-muted mb-3">Tu carrito está vacío</h4>
                    <Link to="/cursos" className="btn btn-dark px-4">
                        Ver cursos disponibles
                    </Link>
                </div>
            ) : (
                <div className="row g-4">
                    {}
                    <div className="col-lg-8">
                        <div className="card border-0 shadow-sm">
                            <div className="card-body p-0">
                                {cart.map((course, idx) => (
                                    <div
                                        key={course.id}
                                        className="d-flex align-items-center gap-3 p-3"
                                        style={{
                                            borderBottom: idx < cart.length - 1
                                                ? '1px solid rgba(0,0,0,.07)'
                                                : 'none',
                                        }}
                                    >
                                        {}
                                        <div style={{
                                            width: '72px',
                                            height: '72px',
                                            borderRadius: '10px',
                                            overflow: 'hidden',
                                            flexShrink: 0,
                                            background: '#f0ece2',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '1.8rem',
                                        }}>
                                            {course.image
                                                ? <img src={resolveImageUrl(course.image)} alt={course.title}
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                : '📚'}
                                        </div>
                                        {}
                                        <div className="flex-grow-1">
                                            <h6 className="mb-0 fw-bold" style={{ color: '#2d2d2d' }}>
                                                {course.title}
                                            </h6>
                                            <small className="text-muted">
                                                {course.modality === 'presencial' ? '📍 Presencial' : '💻 Online'}
                                                {course.duration ? ` · ⏱ ${course.duration}` : ''}
                                            </small>
                                        </div>
                                        {/* Precio */}
                                        <div className="text-end" style={{ minWidth: '90px' }}>
                                            <span className="fw-bold" style={{ color: '#c9a24d', fontSize: '1.1rem' }}>
                                                {parseFloat(course.price || 0).toFixed(2)} €
                                            </span>
                                        </div>
                                        {}
                                        <button
                                            className="btn btn-sm"
                                            onClick={() => removeFromCart(course.id)}
                                            title="Eliminar del carrito"
                                            style={{
                                                background: 'transparent',
                                                border: '1px solid rgba(220,53,69,.3)',
                                                color: '#dc3545',
                                                borderRadius: '8px',
                                            }}
                                            onMouseEnter={e => {
                                                e.currentTarget.style.background = '#dc3545';
                                                e.currentTarget.style.color = '#fff';
                                            }}
                                            onMouseLeave={e => {
                                                e.currentTarget.style.background = 'transparent';
                                                e.currentTarget.style.color = '#dc3545';
                                            }}
                                        >
                                            🗑
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <button
                            className="btn btn-sm btn-outline-secondary mt-3"
                            onClick={clearCart}
                        >
                            Vaciar carrito
                        </button>
                    </div>
                    {}
                    <div className="col-lg-4">
                        <div className="card border-0 shadow-sm p-4"
                            style={{ background: '#faf7f2', position: 'sticky', top: '100px' }}>
                            <h5 className="fw-bold mb-3" style={{ color: '#3b2e12' }}>Resumen</h5>
                            {cart.map(c => (
                                <div key={c.id} className="d-flex justify-content-between mb-1" style={{ fontSize: '.9rem' }}>
                                    <span className="text-muted text-truncate me-2" style={{ maxWidth: '160px' }}>
                                        {c.title}
                                    </span>
                                    <span>{parseFloat(c.price || 0).toFixed(2)} €</span>
                                </div>
                            ))}
                            <hr />
                            <div className="d-flex justify-content-between fw-bold mb-4">
                                <span>Total</span>
                                <span style={{ color: '#c9a24d', fontSize: '1.2rem' }}>
                                    {cartTotal.toFixed(2)} €
                                </span>
                            </div>
                            <button
                                className="btn w-100 fw-semibold"
                                onClick={() => navigate('/checkout')}
                                style={{
                                    background: 'linear-gradient(135deg,#c9a24d,#e0b85c)',
                                    color: '#111',
                                    borderRadius: '999px',
                                    padding: '.65rem',
                                }}
                            >
                                Finalizar compra →
                            </button>
                            <Link to="/cursos" className="btn btn-outline-dark w-100 mt-2" style={{ borderRadius: '999px' }}>
                                Seguir explorando
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
export default Carrito;
