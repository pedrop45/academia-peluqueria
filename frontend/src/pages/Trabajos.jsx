import { useEffect, useMemo, useState } from "react";
import axios from "axios";
function Trabajos() {
    const API = "";
    const sections = useMemo(
        () => [
            { key: "all", label: "Todos" },
            { key: "peluqueria", label: "Peluquería" },
            { key: "barberia", label: "Barbería" },
            { key: "uñas", label: "Uñas" },
            { key: "maquillaje", label: "Maquillaje" },
        ],
        []
    );

    const [activeSection, setActiveSection] = useState("all");
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState("");
    // Modal
    const [modalOpen, setModalOpen] = useState(false);
    const [selected, setSelected] = useState(null);
    const resolveImage = (img) => {
        if (!img) return "/assets/img/foto%20de%20grupo.jpeg";
        if (img.startsWith("http")) return img;
        if (img.startsWith("/storage/")) return `${API}${img}`;
        if (img.startsWith("/")) return img;
        return `${API}/${img}`;
    };
    const fetchGallery = async (sectionKey) => {
        setLoading(true);
        setErrorMsg("");
        try {
            const params = {};
            if (sectionKey && sectionKey !== "all") params.section = sectionKey;
            const res = await axios.get(`${API}/api/gallery`, { params });
            const data = Array.isArray(res.data) ? res.data : [];
            setItems(data);
        } catch (err) {
            setErrorMsg("No se pudo cargar la galería desde el servidor. Mostrando ejemplos.");
            setItems([]);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchGallery(activeSection);
    }, [activeSection]);
    const filtered = activeSection === "all"
        ? items
        : items.filter((x) => (x.section || "").toLowerCase() === activeSection);
    const openModal = (item) => {
        setSelected(item);
        setModalOpen(true);
        document.body.style.overflow = "hidden";
    };
    const closeModal = () => {
        setModalOpen(false);
        setSelected(null);
        document.body.style.overflow = "";
    };
    return (
        <div className="container py-5">
            {}
            <div className="row align-items-center g-4 mb-4">
                <div className="col-lg-7">
                    <h1 className="fw-bold mb-2" style={{ color: "#3b2e12" }}>
                        Nuestros Trabajos
                    </h1>
                    <p className="lead text-muted mb-0">
                        Galería de trabajos realizados por nuestro alumnado y profesionales. Inspiración, técnica y práctica real.
                    </p>
                    {loading && <div className="alert alert-info mt-3 mb-0">Cargando galería...</div>}
                    {!loading && errorMsg && <div className="alert alert-warning mt-3 mb-0">{errorMsg}</div>}
                </div>
                <div className="col-lg-5">
                    <div className="card border-0 shadow-sm overflow-hidden">
                        <img
                            src="/assets/img/grupo.jpeg"
                            alt="Galería"
                            className="img-fluid"
                            style={{ objectFit: "cover", maxHeight: 260, width: "100%" }}
                        />
                    </div>
                </div>
            </div>
            {}
            <div className="d-flex flex-wrap gap-2 mb-4">
                {sections.map((s) => (
                    <button
                        key={s.key}
                        className={`btn btn-sm ${activeSection === s.key ? "btn-dark" : "btn-outline-dark"}`}
                        onClick={() => setActiveSection(s.key)}
                    >
                        {s.label}
                    </button>
                ))}
            </div>
            {}
            <div className="row g-4">
                {filtered.map((item, idx) => (
                    <div className="col-6 col-md-4 col-lg-3" key={idx}>
                        <div
                            className="card border-0 shadow-sm h-100"
                            role="button"
                            onClick={() => openModal(item)}
                            title="Ver"
                        >
                            <div className="ratio ratio-1x1 bg-light">
                                <img
                                    src={resolveImage(item.image)}
                                    alt={item.title || "Trabajo"}
                                    className="w-100 h-100"
                                    style={{ objectFit: "cover" }}
                                />
                            </div>
                            <div className="card-body">
                                <div className="d-flex justify-content-between align-items-start gap-2">
                                    <div>
                                        <div className="fw-bold" style={{ color: "#3b2e12" }}>
                                            {item.title || "Trabajo"}
                                        </div>
                                        <div className="text-muted small">
                                            {(item.section || "otros").toString()}
                                        </div>
                                    </div>
                                    {item.featured && (
                                        <span className="badge text-bg-warning">Destacado</span>
                                    )}
                                </div>
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
                            ¿Quieres ver más o pedir información?
                        </div>
                        <div className="text-muted">
                            Contacta con nosotros y te contamos cursos, horarios y próximas plazas.
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
            {}
            {modalOpen && selected && (
                <div
                    className="position-fixed top-0 start-0 w-100 h-100"
                    style={{ background: "rgba(0,0,0,0.7)", zIndex: 1050 }}
                    onClick={closeModal}
                >
                    <div
                        className="position-absolute top-50 start-50 translate-middle"
                        style={{ width: "min(92vw, 980px)" }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="card border-0 shadow">
                            <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
                                <div>
                                    <div className="fw-bold" style={{ color: "#3b2e12" }}>
                                        {selected.title || "Trabajo"}
                                    </div>
                                    <div className="text-muted small">{selected.section || "otros"}</div>
                                </div>
                                <button className="btn btn-sm btn-outline-dark" onClick={closeModal}>
                                    Cerrar
                                </button>
                            </div>
                            <div className="p-0">
                                <img
                                    src={resolveImage(selected.image)}
                                    alt={selected.title || "Trabajo"}
                                    className="img-fluid"
                                    style={{ width: "100%", maxHeight: "70vh", objectFit: "contain", background: "#000" }}
                                />
                            </div>
                            {selected.description && (
                                <div className="p-3">
                                    <div className="text-muted">{selected.description}</div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
export default Trabajos;
