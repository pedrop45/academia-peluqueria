import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
const API = 'http://localhost:8000/api';
function MisCursos() {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const token = localStorage.getItem('student_token');
    useEffect(() => {
        if (!token) {
            navigate('/acceso-alumnos?redirect=mis-cursos');
            return;
        }
        axios.get(`${API}/my-courses`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => setCourses(res.data))
            .catch(() => setError('No se pudieron cargar tus cursos.'))
            .finally(() => setLoading(false));
    }, []);
    if (loading) {
        return (
            <div className="container py-5 text-center">
                <div className="spinner-border" style={{ color: '#c9a24d' }} />
                <p className="mt-3 text-muted">Cargando tus cursos...</p>
            </div>
        );
    }
    return (
        <div className="container py-5">
            <h1 className="fw-bold mb-1" style={{ color: '#3b2e12' }}>📚 Mis cursos</h1>
            <p className="text-muted mb-4">Cursos que has adquirido.</p>
            {error && <div className="alert alert-danger">{error}</div>}
            {!error && courses.length === 0 && (
                <div className="text-center py-5">
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎓</div>
                    <h4 className="text-muted mb-3">Todavía no tienes cursos adquiridos</h4>
                    <Link to="/cursos" className="btn btn-dark px-4" style={{ borderRadius: '999px' }}>
                        Ver cursos disponibles
                    </Link>
                </div>
            )}
            <div className="row g-4">
                {courses.map(course => (
                    <div className="col-md-6 col-lg-4" key={course.id}>
                        <div className="card h-100 border-0 shadow-sm" style={{ borderRadius: '14px', overflow: 'hidden' }}>
                            {course.image ? (
                                <img
                                    src={course.image}
                                    alt={course.title}
                                    className="card-img-top"
                                    style={{ height: '180px', objectFit: 'cover' }}
                                />
                            ) : (
                                <div style={{
                                    height: '180px',
                                    background: 'linear-gradient(135deg,#f0ece2,#e8e0cc)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '3rem',
                                }}>
                                    📚
                                </div>
                            )}
                            <div className="card-body d-flex flex-column">
                                <div className="d-flex gap-2 mb-2">
                                    <span className={`badge ${course.modality === 'presencial' ? 'bg-dark' : 'bg-success'}`}>
                                        {course.modality === 'presencial' ? '📍 Presencial' : '💻 Online'}
                                    </span>
                                    {}
                                    <span className="badge" style={{ background: 'linear-gradient(135deg,#c9a24d,#e0b85c)', color: '#111' }}>
                                        ✓ Inscrito
                                    </span>
                                </div>
                                <h5 className="card-title fw-bold">{course.title}</h5>
                                <p className="card-text text-muted flex-grow-1" style={{ fontSize: '.88rem' }}>
                                    {course.description
                                        ? course.description.length > 110
                                            ? course.description.substring(0, 110) + '...'
                                            : course.description
                                        : 'Sin descripción disponible.'}
                                </p>
                                {course.duration && (
                                    <small className="text-muted">⏱ {course.duration}</small>
                                )}
                            </div>
                            <div className="card-footer bg-white border-0 pb-3">
                                <a
                                    href="tel:+34615317466"
                                    className="btn btn-sm w-100"
                                    style={{
                                        background: 'linear-gradient(135deg,#c9a24d,#e0b85c)',
                                        color: '#111',
                                        borderRadius: '999px',
                                        fontWeight: 600,
                                    }}
                                >
                                    📞 Información del curso
                                </a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
export default MisCursos;
