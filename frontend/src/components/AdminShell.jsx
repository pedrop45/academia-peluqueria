import { Link } from 'react-router-dom';
import axios from 'axios';
const API = 'http://localhost:8000/api';
export function AdminShell({ title, msg, children }) {
    const token = localStorage.getItem('token');
    if (!token) {
        return (
            <div className="container py-5">
                <div className="alert alert-warning">
                    🔒 No has iniciado sesión. <Link to="/admin" className="alert-link">Ir al login</Link>
                </div>
            </div>
        );
    }
    const handleLogout = async () => {
        try {
            await axios.post(`${API}/logout`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
        } catch (_) { }
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/admin';
    };
    const navLinks = [
        { to: '/admin/courses', label: '📚 Cursos' },
        { to: '/admin/testimonials', label: '💬 Testimonios' },
        { to: '/admin/blog', label: '📝 Blog' },
        { to: '/admin/jobs', label: '💼 Candidatos' },
        { to: '/admin/partners', label: '🤝 Colaboradores' },
        { to: '/admin/orders', label: '🛒 Pedidos' },
    ];
    return (
        <div className="container-fluid py-4 px-4">
            {}
            <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                <div className="d-flex align-items-center gap-3">
                    <h1 className="fw-bold mb-0 h4" style={{ color: '#3b2e12' }}>{title}</h1>
                </div>
                <button className="btn btn-outline-dark btn-sm" onClick={handleLogout}>
                    Cerrar sesión
                </button>
            </div>
            {}
            <nav className="mb-4 d-flex flex-wrap gap-2">
                {navLinks.map(l => (
                    <Link key={l.to} to={l.to}
                        className="btn btn-sm btn-outline-secondary"
                        style={{ fontSize: '.8rem' }}>
                        {l.label}
                    </Link>
                ))}
            </nav>
            {msg && <div className={`alert alert-${msg.type} alert-dismissible`}>{msg.text}</div>}
            {children}
        </div>
    );
}
export { API };
export default AdminShell;
