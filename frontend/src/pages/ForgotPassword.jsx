import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API = 'http://localhost:8000/api';

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setLoading(true);

        try {
            const res = await axios.post(`${API}/password/forgot`, { email });
            setMessage(res.data.message || 'Se ha enviado el enlace de recuperación a tu correo.');
        } catch (err) {
            const msg = err.response?.data?.message 
                || Object.values(err.response?.data?.errors || {}).flat()[0] 
                || 'Error al solicitar el cambio de contraseña. Por favor, verifica el email.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-5">
                    <div className="text-center mb-4">
                        <div style={{
                            width: '80px', height: '80px',
                            background: 'linear-gradient(135deg,#c9a24d,#e0b85c)',
                            borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '2rem', margin: '0 auto 1rem',
                        }}>🔒</div>
                        <h1 className="fw-bold" style={{ color: '#3b2e12' }}>Recuperar Contraseña</h1>
                        <p className="text-muted">Introduce tu email y te enviaremos un enlace.</p>
                    </div>

                    {message && <div className="alert alert-success rounded-3 mb-3">{message}</div>}
                    {error && <div className="alert alert-danger rounded-3 mb-3">{error}</div>}

                    <form onSubmit={handleSubmit} noValidate>
                        <div className="mb-4">
                            <label className="form-label fw-semibold">Email registrado</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="form-control"
                                style={{
                                    borderRadius: '10px',
                                    padding: '.65rem 1rem',
                                    borderColor: 'rgba(0,0,0,.15)'
                                }}
                                placeholder="tu@email.com"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !email}
                            className="btn w-100 fw-bold py-3 mb-3"
                            style={{
                                background: loading || !email ? '#ccc' : 'linear-gradient(135deg,#c9a24d,#e0b85c)',
                                color: '#111',
                                borderRadius: '999px',
                                border: 'none'
                            }}
                        >
                            {loading ? (
                                <><span className="spinner-border spinner-border-sm me-2" />Enviando enlace...</>
                            ) : (
                                'Enviar enlace de recuperación'
                            )}
                        </button>

                        <div className="text-center">
                            <Link to="/acceso" style={{ color: '#777', textDecoration: 'none', fontSize: '.95rem' }}>
                                ← Volver a iniciar sesión
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;
