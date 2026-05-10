import { Link } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
const API = '/api';
function formatDate(d) {
    if (!d) return '';
    return new Date(d).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' });
}
function Blog() {
    const { data: resp, loading, error } = useFetch(`${API}/blog/posts`);

    const posts = resp?.data || [];
    return (
        <div className="container py-5">
            <div className="row">
                <div className="col-lg-8">
                    <h1 className="fw-bold mb-1" style={{ color: '#3b2e12' }}>Blog</h1>
                    <p className="text-muted mb-4">Noticias, tendencias y consejos del sector de imagen personal.</p>
                    {loading && (
                        <div className="alert alert-info d-flex align-items-center">
                            <div className="spinner-border spinner-border-sm me-2"></div>Cargando artículos...
                        </div>
                    )}
                    {error && <div className="alert alert-warning">No se pudieron cargar los artículos.</div>}
                    <div className="d-flex flex-column gap-4">
                        {posts.map(post => (
                            <article key={post.id} className="card border-0 shadow-sm p-4">
                                <div className="d-flex gap-2 mb-2 align-items-center">
                                    {post.category && (
                                        <span className="badge" style={{ background: '#c9a24d', color: '#111' }}>{post.category}</span>
                                    )}
                                    {post.date && (
                                        <small className="text-muted">{formatDate(post.date)}</small>
                                    )}
                                </div>
                                <h2 className="h5 fw-bold mb-2" style={{ color: '#3b2e12' }}>{post.title}</h2>
                                <p className="text-muted mb-0" style={{ fontSize: '.92rem' }}>{post.excerpt}</p>
                            </article>
                        ))}
                    </div>
                </div>
                {}
                <div className="col-lg-4 mt-5 mt-lg-0">
                    <div className="card border-0 shadow-sm p-4 mb-4" style={{ background: '#f9f5ee' }}>
                        <h5 className="fw-bold mb-3" style={{ color: '#3b2e12' }}>¿Quieres formarte?</h5>
                        <p className="text-muted mb-3" style={{ fontSize: '.9rem' }}>
                            Explora nuestros cursos de peluquería, barbería y estética.
                        </p>
                        <Link to="/cursos" className="btn btn-dark btn-sm w-100">Ver cursos</Link>
                    </div>
                    <div className="card border-0 shadow-sm p-4">
                        <h5 className="fw-bold mb-3" style={{ color: '#3b2e12' }}>Contacto</h5>
                        <p className="text-muted mb-2" style={{ fontSize: '.9rem' }}>📞 <a href="tel:+34615317466" className="text-dark">615 317 466</a></p>
                        <Link to="/contacto" className="btn btn-outline-dark btn-sm w-100">Escribirnos</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Blog;
