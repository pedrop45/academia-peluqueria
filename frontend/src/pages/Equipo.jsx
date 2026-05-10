import { useEffect, useMemo, useState } from "react";
import axios from "axios";
function Equipo() {
    const API = "http://127.0.0.1:8000";
    const fallbackTeam = useMemo(
        () => [
            {
                name: "Montserrat González",
                role: "Directora & Formadora principal",
                bio: "Especialista en peluquería y barbería. Coordina el plan formativo y guía al alumnado en prácticas reales.",
                photo: "/assets/img/WhatsApp%20Image%202026-01-27%20at%2009.39.30.jpeg",
            },
            {
                name: "Equipo de Peluquería",
                role: "Formación práctica",
                bio: "Acompañamiento en técnicas de corte, color y peinados. Metodología 100% enfocada a resultados.",
                photo: "/assets/img/grupo.jpeg",
            },
            {
                name: "Área de Estética",
                role: "Maquillaje & cuidado de la piel",
                bio: "Formación orientada a maquillaje social, preparación de la piel y asesoramiento de imagen.",
                photo: "/assets/img/maquillaje.jpg",
            },
            {
                name: "Área de Uñas",
                role: "Manicura & técnicas avanzadas",
                bio: "Técnicas actuales, higiene y seguridad. Enfoque práctico con seguimiento personalizado.",
                photo: "/assets/img/u%C3%B1as.jpg",
            },
        ],
        []
    );
    const [team, setTeam] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState("");
    useEffect(() => {
        let mounted = true;
        axios
            .get(`${API}/api/team`)
            .then((res) => {
                if (!mounted) return;
                const data = Array.isArray(res.data) ? res.data : [];
                setTeam(data);
            })
            .catch(() => {
                if (!mounted) return;
                setErrorMsg("No se pudo cargar el equipo desde el servidor. Mostrando contenido de ejemplo.");
                setTeam([]);
            })
            .finally(() => {
                if (!mounted) return;
                setLoading(false);
            });
        return () => {
            mounted = false;
        };
    }, []);
    const dataToRender = team.length ? team : fallbackTeam;
    const resolvePhoto = (photo) => {
        if (!photo) return "/assets/img/foto%20de%20grupo.jpeg";

        if (photo.startsWith("http")) return photo;
        if (photo.startsWith("/storage/")) return `${API}${photo}`;
        if (photo.startsWith("/")) return photo;

        return `${API}/${photo}`;
    };
    return (
        <div className="container py-5">
            {}
            <div className="row align-items-center g-4 mb-4">
                <div className="col-lg-7">
                    <h1 className="fw-bold mb-2" style={{ color: "#3b2e12" }}>
                        Nuestro Equipo
                    </h1>
                    <p className="lead text-muted mb-3">
                        Profesionales con experiencia que te acompañan desde el primer día: técnica, práctica y
                        asesoramiento para que avances rápido y con seguridad.
                    </p>
                    <div className="d-flex flex-wrap gap-2">
                        <span className="badge text-bg-dark">Formación práctica</span>
                        <span className="badge text-bg-secondary">Seguimiento personalizado</span>
                        <span className="badge text-bg-warning">Certificados</span>
                    </div>
                    {loading && (
                        <div className="alert alert-info mt-3 mb-0">Cargando equipo...</div>
                    )}
                    {!loading && errorMsg && (
                        <div className="alert alert-warning mt-3 mb-0">{errorMsg}</div>
                    )}
                </div>
                <div className="col-lg-5">
                    <div className="card border-0 shadow-sm overflow-hidden">
                        <img
                            src="/assets/img/foto%20de%20grupo.jpeg"
                            alt="Equipo"
                            className="img-fluid"
                            style={{ objectFit: "cover", maxHeight: 260, width: "100%" }}
                        />
                    </div>
                </div>
            </div>
            {}
            <div className="row g-3 mb-4">
                <div className="col-md-4">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-body">
                            <div className="fw-bold" style={{ color: "#3b2e12" }}>
                                Cercanía y apoyo
                            </div>
                            <div className="text-muted">
                                Aprendes con acompañamiento real. Corregimos, guiamos y reforzamos tus puntos fuertes.
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-body">
                            <div className="fw-bold" style={{ color: "#3b2e12" }}>
                                Experiencia profesional
                            </div>
                            <div className="text-muted">
                                Técnicas actuales, herramientas reales y enfoque a lo que se pide en el sector.
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-body">
                            <div className="fw-bold" style={{ color: "#3b2e12" }}>
                                Resultados medibles
                            </div>
                            <div className="text-muted">
                                Objetivos por módulos, práctica constante y feedback para que avances rápido.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {}
            <h2 className="h4 fw-bold mb-3" style={{ color: "#3b2e12" }}>
                Conócenos
            </h2>
            <div className="row g-4">
                {dataToRender.map((m, idx) => (
                    <div className="col-sm-6 col-lg-4" key={idx}>
                        <div className="card border-0 shadow-sm h-100">
                            <div className="ratio ratio-4x3 bg-light">
                                <img
                                    src={resolvePhoto(m.photo)}
                                    alt={m.name}
                                    className="w-100 h-100"
                                    style={{ objectFit: "cover" }}
                                />
                            </div>
                            <div className="card-body">
                                <div className="d-flex align-items-start justify-content-between gap-2">
                                    <h3 className="h5 fw-bold mb-1" style={{ color: "#3b2e12" }}>
                                        {m.name}
                                    </h3>
                                </div>
                                <div className="text-muted mb-2">{m.role}</div>
                                <p className="mb-0">{m.bio}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {}
            <div className="card border-0 shadow-sm mt-5">
                <div className="card-body p-4 d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
                    <div>
                        <div className="fw-bold" style={{ color: "#3b2e12" }}>
                            ¿Quieres información o reservar plaza?
                        </div>
                        <div className="text-muted">
                            Escríbenos y te orientamos según tu nivel y objetivos.
                        </div>
                    </div>
                    <div className="d-flex gap-2">
                        <a className="btn btn-dark" href="/contacto">
                            Contactar
                        </a>
                        <a
                            className="btn btn-outline-success"
                            href="https://wa.me/34600000000"
                            target="_blank"
                            rel="noreferrer"
                        >
                            WhatsApp
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Equipo;