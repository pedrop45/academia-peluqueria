import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
function Teleformacion() {
    const API = "";
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState("");
    const benefits = useMemo(
        () => [
            {
                title: "Aprende a tu ritmo",
                text: "Accede a los contenidos cuando quieras y repite las lecciones tantas veces como necesites.",
            },
            {
                title: "Tutorías y seguimiento",
                text: "Te orientamos con feedback y resolución de dudas para que avances con seguridad.",
            },
            {
                title: "Contenido actualizado",
                text: "Técnicas y tendencias actuales del sector: práctica, herramientas y metodología real.",
            },
        ],
        []
    );
    const howItWorks = useMemo(
        () => [
            {
                title: "1) Te inscribes",
                text: "Elige tu curso online y solicita información. Te confirmamos plazas y calendario.",
            },
            {
                title: "2) Acceso al contenido",
                text: "Recibes tu acceso y el plan de estudio. Material organizado por módulos.",
            },
            {
                title: "3) Practicas y entregas",
                text: "Ejercicios guiados, prácticas y revisiones para consolidar la técnica.",
            },
            {
                title: "4) Certificación",
                text: "Al completar el curso, obtienes tu certificado (según modalidad y requisitos).",
            },
        ],
        []
    );
    useEffect(() => {
        let mounted = true;
        setLoading(true);
        setErrorMsg("");
        axios
            .get(`${API}/api/courses`, { params: { modality: "online" } })
            .then((res) => {
                if (!mounted) return;
                setCourses(Array.isArray(res.data) ? res.data : []);
            })
            .catch(() => {
                if (!mounted) return;
                setErrorMsg("No se pudieron cargar los cursos online. Inténtalo más tarde.");
                setCourses([]);
            })
            .finally(() => {
                if (!mounted) return;
                setLoading(false);
            });
        return () => {
            mounted = false;
        };
    }, []);
    return (
        <div className="container py-5">
            {}
            <div className="row align-items-center g-4 mb-5">
                <div className="col-lg-7">
                    <h1 className="fw-bold mb-2" style={{ color: "#3b2e12" }}>
                        Teleformación
                    </h1>
                    <p className="lead text-muted mb-3">
                        Cursos online para formarte desde cualquier lugar. Aprende técnica, práctica y herramientas
                        actuales con un plan claro y seguimiento.
                    </p>
                    <div className="d-flex flex-wrap gap-2">
                        <Link className="btn btn-dark" to="/contacto">
                            Solicitar información
                        </Link>
                        <Link className="btn btn-outline-dark" to="/cursos">
                            Ver todos los cursos
                        </Link>
                    </div>
                    <div className="d-flex flex-wrap gap-2 mt-3">
                        <span className="badge text-bg-secondary">Acceso flexible</span>
                        <span className="badge text-bg-warning">Material por módulos</span>
                        <span className="badge text-bg-dark">Seguimiento</span>
                    </div>
                </div>
                <div className="col-lg-5">
                    <div className="card border-0 shadow-sm overflow-hidden">
                        <img
                            src="/assets/img/peluqueria.jpg"
                            alt="Teleformación"
                            className="img-fluid"
                            style={{ objectFit: "cover", maxHeight: 280, width: "100%" }}
                        />
                    </div>
                </div>
            </div>
            {}
            <h2 className="h4 fw-bold mb-3" style={{ color: "#3b2e12" }}>
                Ventajas de estudiar online
            </h2>
            <div className="row g-3 mb-5">
                {benefits.map((b, idx) => (
                    <div className="col-md-4" key={idx}>
                        <div className="card border-0 shadow-sm h-100">
                            <div className="card-body">
                                <div className="fw-bold mb-1" style={{ color: "#3b2e12" }}>
                                    {b.title}
                                </div>
                                <div className="text-muted">{b.text}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {}
            <div className="d-flex align-items-end justify-content-between flex-wrap gap-2 mb-2">
                <h2 className="h4 fw-bold mb-0" style={{ color: "#3b2e12" }}>
                    Cursos online disponibles
                </h2>
                <div className="text-muted small">
                    * Los cursos se cargan desde la base de datos (API Laravel).
                </div>
            </div>
            {loading && <div className="alert alert-info">Cargando cursos online...</div>}
            {!loading && errorMsg && <div className="alert alert-danger">{errorMsg}</div>}
            {!loading && !errorMsg && courses.length === 0 && (
                <div className="alert alert-warning">
                    Ahora mismo no hay cursos online publicados. Escríbenos y te avisamos cuando abramos plazas.
                    <div className="mt-2">
                        <Link className="btn btn-sm btn-dark" to="/contacto">
                            Contactar
                        </Link>
                    </div>
                </div>
            )}
            <div className="row g-4">
                {courses.map((c) => {
                    return (
                        <div className="col-md-6 col-lg-4" key={c.id}>
                        <div className="card border-0 shadow-sm h-100">
                            <div className="ratio ratio-16x9 bg-light">
                                <img
                                    src={c.image ? (c.image.startsWith("http") ? c.image : c.image.startsWith("/storage/") ? `${API}${c.image}` : c.image.startsWith("/") ? c.image : `${API}/${c.image}`) : "/assets/img/teleformacion.jpg"}
                                    alt={c.title}
                                    className="w-100 h-100"
                                    style={{ objectFit: "cover" }}
                                />
                            </div>
                            <div className="card-body">
                                <h3 className="h5 fw-bold mb-1" style={{ color: "#3b2e12" }}>
                                    {c.title}
                                </h3>
                                <div className="text-muted small mb-2">
                                    Online · {c.duration || "—"} · {Number(c.price || 0).toFixed(2)} €
                                </div>
                                <p className="mb-0">{c.description || "Curso online con contenido guiado por módulos."}</p>
                            </div>
                            <div className="card-footer bg-white border-0 d-flex flex-column gap-3 pb-3">
                                <div className="d-flex justify-content-between align-items-center">
                                    <span className="fw-bold fs-5" style={{ color: '#c9a24d' }}>
                                        {c.price && parseFloat(c.price) > 0 ? `${Number(c.price).toFixed(2)} €` : "Consultar"}
                                    </span>
                                    <Link className="btn btn-sm btn-outline-dark rounded-pill px-3" to="/contacto">
                                        Info
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
            </div>
            {}
            <h2 className="h4 fw-bold mt-5 mb-3" style={{ color: "#3b2e12" }}>
                ¿Cómo funciona la teleformación?
            </h2>
            <div className="row g-3 mb-5">
                {howItWorks.map((s, idx) => (
                    <div className="col-md-6 col-lg-3" key={idx}>
                        <div className="card border-0 shadow-sm h-100">
                            <div className="card-body">
                                <div className="fw-bold mb-1" style={{ color: "#3b2e12" }}>
                                    {s.title}
                                </div>
                                <div className="text-muted">{s.text}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {}
            <div className="card border-0 shadow-sm">
                <div className="card-body p-4">
                    <h2 className="h5 fw-bold mb-3" style={{ color: "#3b2e12" }}>
                        Preguntas frecuentes
                    </h2>
                    <div className="accordion" id="faq">
                        <div className="accordion-item">
                            <h2 className="accordion-header" id="h1">
                                <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#c1">
                                    ¿Necesito experiencia previa?
                                </button>
                            </h2>
                            <div id="c1" className="accordion-collapse collapse show" data-bs-parent="#faq">
                                <div className="accordion-body">
                                    Depende del curso. Tenemos opciones de iniciación y cursos avanzados. Si tienes dudas, escríbenos.
                                </div>
                            </div>
                        </div>
                        <div className="accordion-item">
                            <h2 className="accordion-header" id="h2">
                                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#c2">
                                    ¿Cómo se resuelven las dudas?
                                </button>
                            </h2>
                            <div id="c2" className="accordion-collapse collapse" data-bs-parent="#faq">
                                <div className="accordion-body">
                                    Puedes contactarnos y, según el curso, contarás con tutorías y seguimiento para ayudarte a avanzar.
                                </div>
                            </div>
                        </div>
                        <div className="accordion-item">
                            <h2 className="accordion-header" id="h3">
                                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#c3">
                                    ¿Obtengo certificado?
                                </button>
                            </h2>
                            <div id="c3" className="accordion-collapse collapse" data-bs-parent="#faq">
                                <div className="accordion-body">
                                    Sí, al completar el curso (según requisitos) recibirás tu certificación correspondiente.
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-4 d-flex gap-2 flex-wrap">
                        <Link className="btn btn-dark" to="/contacto">
                            Contactar
                        </Link>
                        <a className="btn btn-outline-success" href="https://wa.me/34600000000" target="_blank" rel="noreferrer">
                            WhatsApp
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Teleformacion;
