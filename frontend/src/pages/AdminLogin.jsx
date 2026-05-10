import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
const API = '/api';
function AdminLogin() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            const res = await axios.post(`${API}/login`, form);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            setSuccess(true);
            setTimeout(() => navigate('/admin/panel'), 1000);
        } catch (err) {
            if (err.response && err.response.data && err.response.data.errors) {
                const msgs = Object.values(err.response.data.errors).flat();
                setError(msgs.join(' '));
            } else {
                setError('Error de conexión. Asegúrate de que el backend está corriendo.');
            }
        } finally {
            setLoading(false);
        }
    };
    const existingToken = localStorage.getItem('token');
    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-5">
                    <div className="card shadow border-0">
                        <div className="card-body p-4">
                            <h2 className="fw-bold text-center mb-1" style={{ color: '#3b2e12' }}>Panel Admin</h2>
                            <p className="text-center text-muted mb-4">Acceso restringido a administradores</p>
                            {success && (
                                <div className="alert alert-success">
                                    ✅ Login correcto. Redirigiendo al panel...
                                </div>
                            )}
                            {error && <div className="alert alert-danger">{error}</div>}
                            {existingToken && !success && (
                                <div className="alert alert-info">
                                    Ya tienes una sesión activa.{' '}
                                    <a href="/admin/panel" className="alert-link">Ir al panel</a>
                                    {' · '}
                                    <button className="btn btn-link p-0 alert-link" onClick={() => {
                                        localStorage.removeItem('token');
                                        localStorage.removeItem('user');
                                        window.location.reload();
                                    }}>Cerrar sesión</button>
                                </div>
                            )}
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label fw-semibold">Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        name="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        placeholder="admin@academia.com"
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label fw-semibold">Contraseña</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="password"
                                        name="password"
                                        value={form.password}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="btn btn-dark w-100 fw-semibold"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <><span className="spinner-border spinner-border-sm me-2"></span>Entrando...</>
                                    ) : 'Iniciar sesión'}
                                </button>
                                <div className="text-center mt-3">
                                    <Link to="/forgot-password" style={{ color: '#777', textDecoration: 'none', fontSize: '.9rem' }}>
                                        ¿Has olvidado tu contraseña?
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default AdminLogin;
