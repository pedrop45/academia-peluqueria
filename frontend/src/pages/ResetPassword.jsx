import { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

const API = 'http://localhost:8000/api';

function ResetPassword() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    
    const token = searchParams.get('token');
    const emailFromUrl = searchParams.get('email');

    const [form, setForm] = useState({
        email: emailFromUrl || '',
        password: '',
        password_confirmation: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (form.password.length < 8) {
            setError('La contraseña debe tener al menos 8 caracteres.');
            return;
        }

        if (form.password !== form.password_confirmation) {
            setError('Las contraseñas no coinciden.');
            return;
        }

        setLoading(true);

        try {
            const res = await axios.post(`${API}/password/reset`, {
                token,
                email: form.email,
                password: form.password,
                password_confirmation: form.password_confirmation
            });

            Swal.fire({
                title: '¡Contraseña actualizada!',
                text: res.data.message || 'Tu contraseña ha sido restablecida con éxito.',
                icon: 'success',
                confirmButtonText: 'Ir a Iniciar Sesión',
                confirmButtonColor: '#3b2e12'
            }).then(() => {
                navigate('/acceso');
            });
            
        } catch (err) {
            const msg = err.response?.data?.message 
                || Object.values(err.response?.data?.errors || {}).flat()[0] 
                || 'Error al restablecer la contraseña. El enlace podría haber caducado.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="container py-5 text-center">
                <div className="alert alert-danger d-inline-block">
                    Enlace de recuperación inválido o falta el token de seguridad.
                </div>
            </div>
        );
    }

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
                        }}>🔑</div>
                        <h1 className="fw-bold" style={{ color: '#3b2e12' }}>Nueva Contraseña</h1>
                        <p className="text-muted">Introduce tu nueva contraseña segura.</p>
                    </div>

                    {error && <div className="alert alert-danger rounded-3 mb-3">{error}</div>}

                    <form onSubmit={handleSubmit} noValidate>
                        <div className="mb-3">
                            <label className="form-label fw-semibold">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                className="form-control"
                                style={{ borderRadius: '10px', padding: '.65rem 1rem', borderColor: 'rgba(0,0,0,.15)' }}
                                readOnly={!!emailFromUrl}
                            />
                            {emailFromUrl && <small className="text-muted">El email viene por defecto desde el enlace.</small>}
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-semibold">Nueva Contraseña</label>
                            <input
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                className="form-control"
                                style={{ borderRadius: '10px', padding: '.65rem 1rem', borderColor: 'rgba(0,0,0,.15)' }}
                                placeholder="Mínimo 8 caracteres"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="form-label fw-semibold">Confirmar Nueva Contraseña</label>
                            <input
                                type="password"
                                name="password_confirmation"
                                value={form.password_confirmation}
                                onChange={handleChange}
                                className="form-control"
                                style={{ borderRadius: '10px', padding: '.65rem 1rem', borderColor: 'rgba(0,0,0,.15)' }}
                                placeholder="Repite la contraseña"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !form.password}
                            className="btn w-100 fw-bold py-3 mb-3"
                            style={{
                                background: loading || !form.password ? '#ccc' : 'linear-gradient(135deg,#c9a24d,#e0b85c)',
                                color: '#111',
                                borderRadius: '999px',
                                border: 'none'
                            }}
                        >
                            {loading ? (
                                <><span className="spinner-border spinner-border-sm me-2" />Guardando...</>
                            ) : (
                                'Guardar Nueva Contraseña'
                            )}
                        </button>

                        <div className="text-center">
                            <Link to="/acceso" style={{ color: '#777', textDecoration: 'none', fontSize: '.95rem' }}>
                                Cancelar y volver
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ResetPassword;
