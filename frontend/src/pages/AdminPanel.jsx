import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
const API = '/api';
const sections = [
    {
        to: '/admin/courses',
        icon: '📚',
        title: 'Cursos',
        desc: 'Añade, edita o elimina cursos del catálogo.',
        color: '#c9a24d',
    },
    {
        to: '/admin/testimonials',
        icon: '💬',
        title: 'Testimonios',
        desc: 'Gestiona las reseñas de alumnos. Publica o despublica.',
        color: '#3b7acc',
    },
    {
        to: '/admin/blog',
        icon: '📝',
        title: 'Blog',
        desc: 'Crea y edita artículos. Gestiona borradores y publicaciones.',
        color: '#2f8c5b',
    },
    {
        to: '/admin/jobs',
        icon: '💼',
        title: 'Bolsa de Empleo',
        desc: 'Administra los candidatos visibles en la bolsa pública.',
        color: '#9c4dd4',
    },
    {
        to: '/admin/partners',
        icon: '🤝',
        title: 'Centros Colaboradores',
        desc: 'Empresas que acogen alumnos en prácticas y ofrecen empleo.',
        color: '#c43d3d',
    },
    {
        to: '/admin/gallery',
        icon: '📸',
        title: 'Nuestros Trabajos',
        desc: 'Gestiona la galería de imágenes de trabajos de alumnos.',
        color: '#d44d8c',
    },
    {
        to: '/admin/orders',
        icon: '🛒',
        title: 'Pedidos',
        desc: 'Ver pedidos, compradores, cursos adquiridos y estado de pago.',
        color: '#2d7d55',
    },
];
function AdminPanel() {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const userRaw = localStorage.getItem('user');
    const user = userRaw ? JSON.parse(userRaw) : null;
    const handleLogout = async () => {
        try {
            await axios.post(`${API}/logout`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
        } catch (_) { }
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/admin');
    };
    return (
        <div className="container py-5">
            {}
            <div className="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2">
                <div>
                    <h1 className="fw-bold mb-0" style={{ color: '#3b2e12' }}>
                        Panel de Administración
                    </h1>
                    {user && (
                        <p className="text-muted mb-0" style={{ fontSize: '.9rem' }}>
                            Bienvenida, <strong>{user.name}</strong>
                        </p>
                    )}
                </div>
                <button className="btn btn-outline-dark" onClick={handleLogout}>
                    🔒 Cerrar sesión
                </button>
            </div>
            <hr className="mb-4" style={{ borderColor: 'rgba(201,162,77,.3)' }} />
            {}
            <div className="row g-4">
                {sections.map(s => (
                    <div className="col-md-6 col-lg-4" key={s.to}>
                        <Link to={s.to} className="text-decoration-none">
                            <div className="card h-100 border-0 shadow-sm p-4 card-hover"
                                style={{ transition: 'transform .15s, box-shadow .15s' }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.transform = 'translateY(-4px)';
                                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,.12)';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.transform = '';
                                    e.currentTarget.style.boxShadow = '';
                                }}
                            >
                                <div style={{
                                    fontSize: '2.4rem',
                                    width: 56, height: 56,
                                    borderRadius: 14,
                                    background: `${s.color}18`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    marginBottom: '1rem',
                                }}>
                                    {s.icon}
                                </div>
                                <h4 className="fw-bold mb-1" style={{ color: '#1a1a1a' }}>{s.title}</h4>
                                <p className="text-muted mb-0" style={{ fontSize: '.88rem' }}>{s.desc}</p>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
            {}
            <div className="mt-5 text-center">
                <small className="text-muted">
                    C.E.P. Montserrat González · Panel de administración ·{' '}
                    <Link to="/" className="text-muted">Ver web pública</Link>
                </small>
            </div>
        </div>
    );
}
export default AdminPanel;
