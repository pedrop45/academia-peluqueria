import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
const API = 'http://localhost:8000/api';
function Checkout() {
    const { cart, cartTotal, clearCart } = useCart();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        buyer_name: '',
        buyer_email: '',
        buyer_phone: '',
        acepta_terminos: false,
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState('');
    if (cart.length === 0) {
        return (
            <div className="container py-5 text-center">
                <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🛒</div>
                <h4 className="text-muted mb-3">Tu carrito está vacío</h4>
                <Link to="/cursos" className="btn btn-dark px-4">Ver cursos</Link>
            </div>
        );
    }
    const validate = () => {
        const e = {};
        if (!form.buyer_name.trim()) e.buyer_name = 'El nombre es obligatorio.';
        if (!form.buyer_email.trim()) {
            e.buyer_email = 'El email es obligatorio.';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.buyer_email)) {
            e.buyer_email = 'El email no es válido.';
        }
        if (!form.acepta_terminos) e.acepta_terminos = 'Debes aceptar los términos.';
        return e;
    };
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
        setErrors(prev => ({ ...prev, [name]: '' }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError('');
        const errs = validate();
        if (Object.keys(errs).length) {
            setErrors(errs);
            return;
        }
        setLoading(true);
        try {
            const token = localStorage.getItem('student_token');
            if (!token) {

                localStorage.setItem('checkout_pending', JSON.stringify({ form, items: cart.map(c => ({ id: c.id })) }));
                navigate('/acceso-alumnos?redirect=checkout');
                return;
            }
            const { data } = await axios.post(
                `${API}/payments/checkout`,
                {
                    buyer_name: form.buyer_name,
                    buyer_email: form.buyer_email,
                    buyer_phone: form.buyer_phone || null,
                    items: cart.map(c => ({ id: c.id })),
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            window.location.href = data.checkout_url;
        } catch (err) {
            const msg = err.response?.data?.message || 'Error al procesar el pago. Inténtalo de nuevo.';
            setServerError(msg);
        } finally {
            setLoading(false);
        }
    };
    const inputStyle = (field) => ({
        borderColor: errors[field] ? '#dc3545' : 'rgba(0,0,0,.15)',
        borderRadius: '10px',
        padding: '.65rem 1rem',
    });
    return (
        <div className="container py-5">
            <div className="row justify-content-center g-4">
                { }
                <div className="col-lg-6">
                    <h1 className="fw-bold mb-1" style={{ color: '#3b2e12' }}>Datos del comprador</h1>
                    <p className="text-muted mb-4">Completa tus datos para finalizar la compra.</p>
                    {serverError && (
                        <div className="alert alert-danger rounded-3 mb-3">{serverError}</div>
                    )}
                    <form onSubmit={handleSubmit} noValidate>
                        <div className="mb-3">
                            <label className="form-label fw-semibold">Nombre completo *</label>
                            <input
                                type="text"
                                name="buyer_name"
                                value={form.buyer_name}
                                onChange={handleChange}
                                className="form-control"
                                style={inputStyle('buyer_name')}
                                placeholder="María García López"
                            />
                            {errors.buyer_name && <div className="text-danger small mt-1">{errors.buyer_name}</div>}
                        </div>
                        <div className="mb-3">
                            <label className="form-label fw-semibold">Email *</label>
                            <input
                                type="email"
                                name="buyer_email"
                                value={form.buyer_email}
                                onChange={handleChange}
                                className="form-control"
                                style={inputStyle('buyer_email')}
                                placeholder="maria@ejemplo.com"
                            />
                            {errors.buyer_email && <div className="text-danger small mt-1">{errors.buyer_email}</div>}
                        </div>
                        <div className="mb-3">
                            <label className="form-label fw-semibold">Teléfono <span className="text-muted fw-normal">(opcional)</span></label>
                            <input
                                type="tel"
                                name="buyer_phone"
                                value={form.buyer_phone}
                                onChange={handleChange}
                                className="form-control"
                                style={inputStyle('buyer_phone')}
                                placeholder="+34 600 000 000"
                            />
                        </div>
                        <div className="mb-4">
                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    name="acepta_terminos"
                                    id="terminos"
                                    checked={form.acepta_terminos}
                                    onChange={handleChange}
                                />
                                <label className="form-check-label small" htmlFor="terminos">
                                    Acepto los <span className="text-decoration-underline" style={{ cursor: 'pointer', color: '#c9a24d' }}>términos y condiciones</span> y la política de privacidad.
                                </label>
                            </div>
                            {errors.acepta_terminos && (
                                <div className="text-danger small mt-1">{errors.acepta_terminos}</div>
                            )}
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn w-100 fw-bold py-3"
                            style={{
                                background: loading ? '#ccc' : 'linear-gradient(135deg,#c9a24d,#e0b85c)',
                                color: '#111',
                                borderRadius: '999px',
                                fontSize: '1.05rem',
                                transition: 'all .2s',
                            }}
                        >
                            {loading ? (
                                <><span className="spinner-border spinner-border-sm me-2" />Redirigiendo a Stripe...</>
                            ) : (
                                '🔒 Pagar con Stripe'
                            )}
                        </button>
                        <p className="text-muted text-center small mt-3">
                            Pago 100% seguro a través de Stripe. No almacenamos tus datos de tarjeta.
                        </p>
                    </form>
                </div>
                { }
                <div className="col-lg-4">
                    <div className="card border-0 shadow-sm p-4"
                        style={{ background: '#faf7f2', position: 'sticky', top: '100px' }}>
                        <h5 className="fw-bold mb-3" style={{ color: '#3b2e12' }}>Resumen del pedido</h5>
                        {cart.map(c => (
                            <div key={c.id} className="d-flex justify-content-between mb-2" style={{ fontSize: '.9rem' }}>
                                <span className="text-muted text-truncate me-2" style={{ maxWidth: '155px' }}>
                                    {c.title}
                                </span>
                                <span className="fw-semibold">{parseFloat(c.price || 0).toFixed(2)} €</span>
                            </div>
                        ))}
                        <hr />
                        <div className="d-flex justify-content-between fw-bold">
                            <span>Total</span>
                            <span style={{ color: '#c9a24d', fontSize: '1.2rem' }}>
                                {cartTotal.toFixed(2)} €
                            </span>
                        </div>
                        <Link to="/carrito" className="btn btn-outline-dark w-100 mt-3 btn-sm" style={{ borderRadius: '999px' }}>
                            ← Volver al carrito
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Checkout;
