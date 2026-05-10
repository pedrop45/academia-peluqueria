import { Outlet, Link, NavLink } from 'react-router-dom';
import { CartProvider } from '../context/CartContext';
import CartIcon from './CartIcon';
const nl = ({ isActive }) =>
    'nav-link px-3 py-2' + (isActive ? ' active fw-semibold' : '');
function Layout() {
    return (
        <CartProvider>
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh' }}>
                {}
                <div style={{
                    background: '#0e0e0e',
                    borderBottom: '1px solid rgba(201,162,77,.25)',
                    padding: '.55rem 0',
                }}>
                    <div className="container-xl d-flex align-items-center justify-content-between">
                        <Link to="/" style={{ textDecoration: 'none' }}>
                            <div>
                                <span style={{
                                    color: '#c9a24d',
                                    fontWeight: 800,
                                    fontSize: '1.05rem',
                                    letterSpacing: '.3px',
                                }}>
                                    C.E.P. Montserrat González
                                </span>
                                <span className="d-block" style={{
                                    color: 'rgba(255,255,255,.5)',
                                    fontSize: '.7rem',
                                    fontWeight: 400,
                                }}>
                                    Academia de Peluquería y Barbería · Adra &amp; Almería
                                </span>
                            </div>
                        </Link>
                        {}
                        <div className="d-flex align-items-center gap-3">
                            {}
                            <CartIcon />
                            <NavLink
                                to="/acceso-alumnos"
                                className="btn btn-sm fw-semibold"
                                style={{
                                    background: 'linear-gradient(135deg,#c9a24d,#e0b85c)',
                                    color: '#111',
                                    borderRadius: '999px',
                                    padding: '.35rem 1rem',
                                    fontSize: '.82rem',
                                }}
                            >
                                🔑 Acceso alumnos
                            </NavLink>
                        </div>
                    </div>
                </div>
                {}
                <nav
                    className="navbar navbar-expand-lg navbar-dark py-0"
                    style={{
                        background: '#1a1a1a',
                        borderBottom: '2px solid rgba(201,162,77,.18)',
                    }}
                >
                    <div className="container-xl">
                        {}
                        <button
                            className="navbar-toggler border-0 my-1"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#mainNav"
                            aria-controls="mainNav"
                            aria-expanded="false"
                            aria-label="Toggle navigation"
                        >
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="mainNav">
                            <ul className="navbar-nav align-items-lg-center" style={{ fontSize: '.93rem', gap: '0' }}>
                                <li className="nav-item">
                                    <NavLink className={nl} to="/" end>Inicio</NavLink>
                                </li>
                                {}
                                <li className="nav-item dropdown">
                                    <button
                                        className="nav-link dropdown-toggle px-3 py-2 btn btn-link text-white-50"
                                        style={{ fontSize: '.93rem', textDecoration: 'none' }}
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                    >
                                        Nuestros&nbsp;cursos
                                    </button>
                                    <ul
                                        className="dropdown-menu"
                                        style={{
                                            background: '#1a1a1a',
                                            border: '1px solid rgba(201,162,77,.35)',
                                            minWidth: '230px',
                                            borderRadius: '8px',
                                            marginTop: '2px',
                                        }}
                                    >
                                        {[
                                            { to: '/cursos', icon: '📚', label: 'Ver todos los cursos' },
                                            { to: '/cursos/barberia-peluqueria', icon: '✂️', label: 'Barbería y Peluquería' },
                                            { to: '/cursos/certificados', icon: '🎓', label: 'Certificados de profesionalidad' },
                                            { to: '/cursos/especialidades', icon: '⭐', label: 'Especialidades' },
                                        ].map(({ to, icon, label }) => (
                                            <li key={to}>
                                                <NavLink
                                                    className="dropdown-item py-2"
                                                    to={to}
                                                    style={{ color: 'rgba(255,255,255,.82)', fontSize: '.82rem' }}
                                                >
                                                    <span style={{ marginRight: '.5rem' }}>{icon}</span>{label}
                                                </NavLink>
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                                <li className="nav-item">
                                    <NavLink className={nl} to="/nuestros-alumnos">Alumnos</NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className={nl} to="/trabajos">Trabajos</NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className={nl} to="/testimonios">Testimonios</NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className={nl} to="/bolsa-empleo">Bolsa&nbsp;empleo</NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className={nl} to="/centros-colaboradores">Colaboradores</NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className={nl} to="/blog">Blog</NavLink>
                                </li>
                                {}
                                <li className="nav-item d-none d-lg-block" aria-hidden="true">
                                    <span style={{ color: 'rgba(201,162,77,.3)', padding: '0 .25rem' }}>│</span>
                                </li>
                                <li className="nav-item">
                                    <NavLink className={nl} to="/contacto" style={{ color: '#c9a24d' }}>Contacto</NavLink>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
                {}
                <main style={{ flex: 1 }}>
                    <Outlet />
                </main>
                {}
                <footer className="py-4 text-center" style={{
                    background: '#0e0e0e',
                    borderTop: '1px solid rgba(201,162,77,.18)',
                }}>
                    <div className="container">
                        <p className="mb-1" style={{ color: '#c9a24d', fontWeight: 700, fontSize: '.9rem' }}>
                            C.E.P. Montserrat González
                        </p>
                        <small style={{ color: 'rgba(255,255,255,.45)', fontSize: '.75rem' }}>
                            Academia de Peluquería y Barbería · Adra &amp; Almería · © 2024 Todos los derechos reservados
                        </small>
                        <div className="mt-2">
                            <Link to="/admin" style={{ color: 'rgba(255,255,255,.3)', fontSize: '.75rem', textDecoration: 'none', transition: 'color .2s' }}
                                onMouseEnter={(e) => e.target.style.color = '#c9a24d'}
                                onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,.3)'}
                            >
                                Acceso Administración
                            </Link>
                        </div>
                    </div>
                </footer>
            </div>
        </CartProvider>
    );
}
export default Layout;
