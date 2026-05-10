import { useState } from "react";
import axios from "axios";
const API = "http://localhost:8000/api";
const REFERRAL_OPTIONS = [
    "Instagram",
    "Facebook",
    "Google",
    "Recomendación de un amigo/a",
    "Antiguo alumno/a",
    "Cartel o publicidad",
    "Otro",
];
function Contacto() {
    const [form, setForm] = useState({
        nombre: "",
        email: "",
        telefono: "",
        conocido_por: "",
        asunto: "",
        mensaje: "",
        privacidad: false,
    });
    const [status, setStatus] = useState({ type: "", msg: "" });
    const [sending, setSending] = useState(false);
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };
    const validate = () => {
        if (!form.nombre.trim()) return "El nombre es obligatorio.";
        if (!form.email.trim()) return "El email es obligatorio.";
        if (!/^\S+@\S+\.\S+$/.test(form.email)) return "El email no parece válido.";
        if (!form.asunto.trim()) return "El asunto es obligatorio.";
        if (!form.mensaje.trim() || form.mensaje.trim().length < 10)
            return "El mensaje debe tener al menos 10 caracteres.";
        if (!form.privacidad) return "Debes aceptar la política de privacidad.";
        return "";
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ type: "", msg: "" });
        const error = validate();
        if (error) {
            setStatus({ type: "danger", msg: error });
            return;
        }
        try {
            setSending(true);
            await axios.post(`${API}/contact`, {
                name: form.nombre,
                email: form.email,
                phone: form.telefono,
                message: `[${form.asunto}] ${form.mensaje}`,
                referral_source: form.conocido_por || null,
            });
            setStatus({
                type: "success",
                msg: "¡Gracias! Hemos recibido tu mensaje. Te responderemos lo antes posible.",
            });
            setForm({
                nombre: "",
                email: "",
                telefono: "",
                conocido_por: "",
                asunto: "",
                mensaje: "",
                privacidad: false,
            });
        } catch (err) {
            setStatus({
                type: "danger",
                msg: "No se pudo enviar el mensaje. Inténtalo de nuevo en unos minutos.",
            });
        } finally {
            setSending(false);
        }
    };
    return (
        <div className="container py-5">
            {}
            <div className="mb-4">
                <h1 className="fw-bold" style={{ color: "#3b2e12" }}>
                    Contacto
                </h1>
                <p className="lead text-muted mb-0">
                    ¿Tienes dudas sobre nuestros cursos o servicios? Escríbenos y te ayudamos.
                </p>
            </div>
            <div className="row g-4">
                {}
                <div className="col-lg-7">
                    <div className="card shadow-sm border-0">
                        <div className="card-body p-4">
                            <h2 className="h5 fw-bold mb-3">Envíanos un mensaje</h2>
                            {status.msg && (
                                <div className={`alert alert-${status.type}`} role="alert">
                                    {status.msg}
                                </div>
                            )}
                            <form onSubmit={handleSubmit} className="row g-3">
                                <div className="col-md-6">
                                    <label className="form-label">Nombre y apellidos</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="nombre"
                                        value={form.nombre}
                                        onChange={handleChange}
                                        placeholder="Ej. María García"
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        name="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        placeholder="ejemplo@email.com"
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">Teléfono (opcional)</label>
                                    <input
                                        type="tel"
                                        className="form-control"
                                        name="telefono"
                                        value={form.telefono}
                                        onChange={handleChange}
                                        placeholder="600 000 000"
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">¿Cómo has conocido la academia?</label>
                                    <select
                                        className="form-select"
                                        name="conocido_por"
                                        value={form.conocido_por}
                                        onChange={handleChange}
                                    >
                                        <option value="">Selecciona una opción</option>
                                        {REFERRAL_OPTIONS.map((opt) => (
                                            <option key={opt} value={opt}>
                                                {opt}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-md-12">
                                    <label className="form-label">Asunto</label>
                                    <select
                                        className="form-select"
                                        name="asunto"
                                        value={form.asunto}
                                        onChange={handleChange}
                                    >
                                        <option value="">Selecciona una opción</option>
                                        <option value="Información de cursos">Información de cursos</option>
                                        <option value="Matrícula / Inscripción">Matrícula / Inscripción</option>
                                        <option value="Servicios de peluquería">Servicios de peluquería</option>
                                        <option value="Colaboraciones / Empresas">Colaboraciones / Empresas</option>
                                        <option value="Otros">Otros</option>
                                    </select>
                                </div>
                                <div className="col-12">
                                    <label className="form-label">Mensaje</label>
                                    <textarea
                                        className="form-control"
                                        rows="5"
                                        name="mensaje"
                                        value={form.mensaje}
                                        onChange={handleChange}
                                        placeholder="Cuéntanos qué necesitas y te responderemos lo antes posible."
                                    />
                                    <div className="form-text">
                                        Tiempo de respuesta habitual: 24–48h laborables.
                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id="privacidad"
                                            name="privacidad"
                                            checked={form.privacidad}
                                            onChange={handleChange}
                                        />
                                        <label className="form-check-label" htmlFor="privacidad">
                                            He leído y acepto la política de privacidad.
                                        </label>
                                    </div>
                                </div>
                                <div className="col-12 d-flex gap-2">
                                    <button
                                        type="submit"
                                        className="btn btn-dark"
                                        disabled={sending}
                                    >
                                        {sending ? "Enviando..." : "Enviar mensaje"}
                                    </button>
                                    <a
                                        className="btn btn-outline-success"
                                        href="https://wa.me/34600000000"
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        WhatsApp
                                    </a>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                {}
                <div className="col-lg-5">
                    <div className="card shadow-sm border-0 mb-4">
                        <div className="card-body p-4">
                            <h2 className="h5 fw-bold mb-3">Información</h2>
                            <div className="mb-3">
                                <div className="fw-semibold">Dirección</div>
                                <div className="text-muted">
                                    Calle Ejemplo 123, 04000 Almería
                                </div>
                            </div>
                            <div className="mb-3">
                                <div className="fw-semibold">Teléfono</div>
                                <div className="text-muted">+34 600 000 000</div>
                            </div>
                            <div className="mb-3">
                                <div className="fw-semibold">Email</div>
                                <div className="text-muted">info@academia.com</div>
                            </div>
                            <div className="mb-3">
                                <div className="fw-semibold">Horario</div>
                                <div className="text-muted">
                                    L–V: 09:00–14:00 / 16:00–20:00 <br />
                                    Sábado: 10:00–13:30
                                </div>
                            </div>
                            <div className="d-flex gap-2">
                                <a className="btn btn-outline-dark btn-sm" href="#" aria-label="Instagram">
                                    Instagram
                                </a>
                                <a className="btn btn-outline-dark btn-sm" href="#" aria-label="Facebook">
                                    Facebook
                                </a>
                                <a className="btn btn-outline-dark btn-sm" href="#" aria-label="TikTok">
                                    TikTok
                                </a>
                            </div>
                        </div>
                    </div>
                    {}
                    <div className="card shadow-sm border-0">
                        <div className="card-body p-0">
                            <iframe
                                title="Mapa"
                                src="https://www.google.com/maps?q=Almer%C3%ADa&output=embed"
                                width="100%"
                                height="320"
                                style={{ border: 0, borderRadius: "0.5rem" }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            />
                        </div>
                    </div>
                    <p className="small text-muted mt-3">
                        * Los datos de contacto son de ejemplo. Sustitúyelos por los reales de la academia.
                    </p>
                </div>
            </div>
        </div>
    );
}
export default Contacto;