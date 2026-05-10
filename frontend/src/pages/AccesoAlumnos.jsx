import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
const API = '/api';
function AccesoAlumnos() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const redirect = searchParams.get('redirect') || '';
    const [tab, setTab] = useState('login'); 
    const [form, setForm] = useState({
        name: '', email: '', password: '', password_confirmation: '',
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState('');
    // Si ya hay token, mostrar panel de alumno
    const [student, setStudent] = useState(null);
    useEffect(() => {
        const token = localStorage.getItem('student_token');
        if (token) {
            axios.get(`${API}/students/me`, {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then(res => setStudent(res.data))
                .catch(() => {
                    localStorage.removeItem('student_token');
                    localStorage.removeItem('student_user');
                });
        }
    }, []);
    const handleLogout = async () => {
        const token = localStorage.getItem('student_token');
        try {
            await axios.post(`${API}/students/logout`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
        } catch {  }
        localStorage.removeItem('student_token');
        localStorage.removeItem('student_user');
        setStudent(null);
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: '' }));
    };
    const validateLogin = () => {
        const e = {};
        if (!form.email) e.email = 'El email es obligatorio.';
        if (!form.password) e.password = 'La contraseña es obligatoria.';
        return e;
    };
    const validateRegister = () => {
        const e = {};
        if (!form.name.trim()) e.name = 'El nombre es obligatorio.';
        if (!form.email) e.email = 'El email es obligatorio.';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Email no válido.';
        if (!form.password || form.password.length < 8) e.password = 'Mínimo 8 caracteres.';
        if (form.password !== form.password_confirmation) e.password_confirmation = 'Las contraseñas no coinciden.';
        return e;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError('');
        const errs = tab === 'login' ? validateLogin() : validateRegister();
        if (Object.keys(errs).length) { setErrors(errs); return; }
        setLoading(true);
        try {
            const endpoint = tab === 'login' ? '/students/login' : '/students/register';
            const payload = tab === 'login'
                ? { email: form.email, password: form.password }
                : { name: form.name, email: form.email, password: form.password, password_confirmation: form.password_confirmation };
            const { data } = await axios.post(`${API}${endpoint}`, payload);
            localStorage.setItem('student_token', data.token);
            localStorage.setItem('student_user', JSON.stringify(data.user));
            setStudent(data.user);
            if (redirect === 'checkout') navigate('/checkout');
            else if (redirect === 'mis-cursos') navigate('/mis-cursos');
        } catch (err) {
            const msg = err.response?.data?.message
                || Object.values(err.response?.data?.errors || {}).flat()[0]
                || 'Error al iniciar sesión. Verifica tus datos.';
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

    if (student) {
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
                            }}>🎓</div>
                            <h2 className="fw-bold" style={{ color: '#3b2e12' }}>
                                Hola, {student.name.split(' ')[0]} 👋
                            </h2>
                            <p className="text-muted">{student.email}</p>
                        </div>
                        <div className="d-grid gap-2">
                            <Link to="/mis-cursos" className="btn btn-dark py-2" style={{ borderRadius: '999px' }}>
                                📚 Mis cursos
                            </Link>
                            <Link to="/cursos" className="btn btn-outline-dark py-2" style={{ borderRadius: '999px' }}>
                                🛒 Ver cursos disponibles
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="btn btn-outline-danger py-2"
                                style={{ borderRadius: '999px' }}
                            >
                                Cerrar sesión
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-5">
                    {}
                    <div className="text-center mb-4">
                        <div style={{
                            width: '80px', height: '80px',
                            background: 'linear-gradient(135deg,#c9a24d,#e0b85c)',
                            borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '2rem', margin: '0 auto 1rem',
                        }}>🔑</div>
                        <h1 className="fw-bold" style={{ color: '#3b2e12' }}>Área de Alumnos</h1>
                        <p className="text-muted">Accede para gestionar tus cursos.</p>
                    </div>
                    {}
                    <div className="d-flex mb-4" style={{
                        background: '#f5f0e8',
                        borderRadius: '999px',
                        padding: '4px',
                    }}>
                        {['login', 'register'].map(t => (
                            <button
                                key={t}
                                onClick={() => { setTab(t); setErrors({}); setServerError(''); }}
                                className="btn flex-grow-1 fw-semibold"
                                style={{
                                    borderRadius: '999px',
                                    background: tab === t ? 'linear-gradient(135deg,#c9a24d,#e0b85c)' : 'transparent',
                                    color: tab === t ? '#111' : '#777',
                                    border: 'none',
                                    transition: 'all .2s',
                                    fontSize: '.9rem',
                                }}
                            >
                                {t === 'login' ? 'Iniciar sesión' : 'Registrarme'}
                            </button>
                        ))}
                    </div>
                    {}
                    {serverError && (
                        <div className="alert alert-danger rounded-3 mb-3">{serverError}</div>
                    )}
                    <form onSubmit={handleSubmit} noValidate>
                        {tab === 'register' && (
                            <div className="mb-3">
                                <label className="form-label fw-semibold">Nombre completo</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    className="form-control"
                                    style={inputStyle('name')}
                                    placeholder="María García"
                                />
                                {errors.name && <div className="text-danger small mt-1">{errors.name}</div>}
                            </div>
                        )}
                        <div className="mb-3">
                            <label className="form-label fw-semibold">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                className="form-control"
                                style={inputStyle('email')}
                                placeholder="maria@ejemplo.com"
                            />
                            {errors.email && <div className="text-danger small mt-1">{errors.email}</div>}
                        </div>
                        <div className="mb-3">
                            <label className="form-label fw-semibold">Contraseña</label>
                            <input
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                className="form-control"
                                style={inputStyle('password')}
                                placeholder={tab === 'register' ? 'Mínimo 8 caracteres' : '••••••••'}
                            />
                            {errors.password && <div className="text-danger small mt-1">{errors.password}</div>}
                        </div>
                        {tab === 'register' && (
                            <div className="mb-3">
                                <label className="form-label fw-semibold">Confirmar contraseña</label>
                                <input
                                    type="password"
                                    name="password_confirmation"
                                    value={form.password_confirmation}
                                    onChange={handleChange}
                                    className="form-control"
                                    style={inputStyle('password_confirmation')}
                                    placeholder="Repite la contraseña"
                                />
                                {errors.password_confirmation && (
                                    <div className="text-danger small mt-1">{errors.password_confirmation}</div>
                                )}
                            </div>
                        )}
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn w-100 fw-bold py-3 mt-2"
                            style={{
                                background: loading ? '#ccc' : 'linear-gradient(135deg,#c9a24d,#e0b85c)',
                                color: '#111',
                                borderRadius: '999px',
                            }}
                        >
                            {loading
                                ? <><span className="spinner-border spinner-border-sm me-2" />Procesando...</>
                                : tab === 'login' ? 'Entrar' : 'Crear cuenta'}
                        </button>
                        {tab === 'login' && (
                            <div className="text-center mt-3">
                                <Link to="/forgot-password" style={{ color: '#777', textDecoration: 'none', fontSize: '.9rem' }}>
                                    ¿Has olvidado tu contraseña?
                                </Link>
                            </div>
                        )}
                    </form>
                    <div className="text-center mt-4">
                        <small className="text-muted">
                            ¿Tienes alguna duda?{' '}
                            <Link to="/contacto" style={{ color: '#c9a24d' }}>Contáctanos</Link>
                        </small>
                        <br/>
                        <small className="text-muted mt-2 d-block">
                            ¿Eres administrador?{' '}
                            <Link to="/admin" style={{ color: '#c9a24d' }}>Acceso Admin</Link>
                        </small>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default AccesoAlumnos;
