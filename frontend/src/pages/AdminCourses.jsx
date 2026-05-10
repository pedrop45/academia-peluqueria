import { useEffect, useMemo, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import Cropper from 'react-easy-crop';
const API = 'http://127.0.0.1:8000/api';
const BASE = 'http://127.0.0.1:8000';
const createImage = (url) =>
    new Promise((resolve, reject) => {
        const image = new Image();
        image.addEventListener('load', () => resolve(image));
        image.addEventListener('error', (error) => reject(error));
        image.setAttribute('crossOrigin', 'anonymous'); 
        image.src = url;
    });
async function getCroppedBlob(imageSrc, cropPixels) {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = cropPixels.width;
    canvas.height = cropPixels.height;
    ctx.drawImage(
        image,
        cropPixels.x,
        cropPixels.y,
        cropPixels.width,
        cropPixels.height,
        0,
        0,
        cropPixels.width,
        cropPixels.height
    );
    return new Promise((resolve) => {
        canvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.9);
    });
}
function AdminCourses() {
    const token = localStorage.getItem('token');
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [msg, setMsg] = useState(null);
    const [saving, setSaving] = useState(false);

    const [imageFile, setImageFile] = useState(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
    const [cropOpen, setCropOpen] = useState(false);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [croppedBlob, setCroppedBlob] = useState(null);
    const [croppedPreviewUrl, setCroppedPreviewUrl] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [fileInputKey, setFileInputKey] = useState(Date.now());
    const [form, setForm] = useState({
        title: '',
        modality: 'presencial',
        category: 'barberia_peluqueria',
        level: '',
        price: '',
        duration: '',
        description: '',
        active: true,
        is_purchasable: true,
    });
    // Si no hay token, mostrar alerta
    if (!token) {
        return (
            <div className="container py-5">
                <div className="alert alert-warning">
                    🔒 No has iniciado sesión.{' '}
                    <Link to="/admin" className="alert-link">Ir al login</Link>
                </div>
            </div>
        );
    }
    const headers = { Authorization: `Bearer ${token}` };
    const fetchCourses = () => {
        setLoading(true);
        axios.get(`${API}/courses`)
            .then(res => setCourses(Array.isArray(res.data) ? res.data : []))
            .catch(() => setCourses([]))
            .finally(() => setLoading(false));
    };
    useEffect(() => { fetchCourses(); }, []);
    // limpiar URLs blob al desmontar
    useEffect(() => {
        return () => {
            if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
            if (croppedPreviewUrl) URL.revokeObjectURL(croppedPreviewUrl);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newVal = type === 'checkbox' ? checked : value;
        setForm(prev => {
            const updated = { ...prev, [name]: newVal };
            if (name === 'category' && newVal !== 'certificados') updated.level = '';
            return updated;
        });
    };
    const onCropComplete = useCallback((_, croppedPixels) => {
        setCroppedAreaPixels(croppedPixels);
    }, []);
    const onPickImage = (file) => {
        // reset recorte anterior
        if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
        if (croppedPreviewUrl) URL.revokeObjectURL(croppedPreviewUrl);
        setCroppedBlob(null);
        setCroppedPreviewUrl(null);
        setImageFile(file || null);
        if (file) {
            const url = URL.createObjectURL(file);
            setImagePreviewUrl(url);
            setCrop({ x: 0, y: 0 });
            setZoom(1);
            setCropOpen(true);
        } else {
            setImagePreviewUrl(null);
        }
    };
    const applyCrop = async () => {
        if (!imagePreviewUrl || !croppedAreaPixels) {
            setCropOpen(false);
            return;
        }
        const blob = await getCroppedBlob(imagePreviewUrl, croppedAreaPixels);
        setCroppedBlob(blob);
        const preview = URL.createObjectURL(blob);
        setCroppedPreviewUrl(preview);
        setCropOpen(false);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMsg(null);
        if (!form.title.trim()) {
            setMsg({ type: 'danger', text: 'El título es obligatorio.' });
            setSaving(false);
            return;
        }
        if (form.category === 'certificados' && !form.level) {
            setMsg({ type: 'danger', text: 'Selecciona el nivel (1, 2 o 3) para certificados.' });
            setSaving(false);
            return;
        }
        try {
            const fd = new FormData();
            fd.append('title', form.title);
            fd.append('description', form.description || '');
            fd.append('modality', form.modality);
            fd.append('category', form.category);
            if (form.category === 'certificados') fd.append('level', String(form.level));
            if (form.price !== '') fd.append('price', String(form.price));
            if (form.duration) fd.append('duration', form.duration);
            fd.append('active', form.active ? '1' : '0');
            fd.append('is_purchasable', form.is_purchasable ? '1' : '0');

            if (croppedBlob) {
                fd.append('image', new File([croppedBlob], 'cover.jpg', { type: 'image/jpeg' }));
            } else if (imageFile) {
                fd.append('image', imageFile);
            }
            if (editingId) {
                fd.append('_method', 'PUT');
                await axios.post(`${API}/admin/courses/${editingId}`, fd, {
                    headers: { ...headers, 'Content-Type': 'multipart/form-data' }
                });
                setMsg({ type: 'success', text: '✅ Curso actualizado correctamente.' });
            } else {
                await axios.post(`${API}/admin/courses`, fd, {
                    headers: { ...headers, 'Content-Type': 'multipart/form-data' }
                });
                setMsg({ type: 'success', text: '✅ Curso creado correctamente.' });
            }

            setForm({
                title: '',
                modality: 'presencial',
                category: 'barberia_peluqueria',
                level: '',
                price: '',
                duration: '',
                description: '',
                active: true,
                is_purchasable: true,
            });
            setEditingId(null);
            // reset imagen
            setFileInputKey(Date.now());
            setImageFile(null);
            if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
            if (croppedPreviewUrl) URL.revokeObjectURL(croppedPreviewUrl);
            setImagePreviewUrl(null);
            setCroppedBlob(null);
            setCroppedPreviewUrl(null);
            fetchCourses();
        } catch (err) {
            if (err.response?.status === 401) {
                setMsg({ type: 'danger', text: '🔒 Sesión expirada. Vuelve a iniciar sesión.' });
                localStorage.removeItem('token');
            } else if (err.response?.data?.errors) {
                const msgs = Object.values(err.response.data.errors).flat().join(' ');
                setMsg({ type: 'danger', text: msgs });
            } else {
                setMsg({ type: 'danger', text: 'Error al crear el curso.' });
            }
        } finally {
            setSaving(false);
        }
    };
    const handleEdit = (course) => {
        setEditingId(course.id);
        setForm({
            title: course.title || '',
            modality: course.modality || 'presencial',
            category: course.category || 'barberia_peluqueria',
            level: course.level || '',
            price: course.price || '',
            duration: course.duration || '',
            description: course.description || '',
            active: course.active !== 0 && course.active !== false,
            is_purchasable: course.is_purchasable !== 0 && course.is_purchasable !== false,
        });
        setImageFile(null);
        if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
        if (croppedPreviewUrl) URL.revokeObjectURL(croppedPreviewUrl);
        setImagePreviewUrl(null);
        setCroppedBlob(null);
        setCroppedPreviewUrl(null);
        setFileInputKey(Date.now());
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    const cancelEdit = () => {
        setEditingId(null);
        setForm({
            title: '',
            modality: 'presencial',
            category: 'barberia_peluqueria',
            level: '',
            price: '',
            duration: '',
            description: '',
            active: true,
            is_purchasable: true,
        });
        setImageFile(null);
        if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
        if (croppedPreviewUrl) URL.revokeObjectURL(croppedPreviewUrl);
        setImagePreviewUrl(null);
        setCroppedBlob(null);
        setCroppedPreviewUrl(null);
        setFileInputKey(Date.now());
    };
    const handleDelete = async (id, title) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: `¿Eliminar el curso "${title}"?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });
        if (!result.isConfirmed) return;
        setMsg(null);
        try {
            await axios.delete(`${API}/admin/courses/${id}`, { headers });
            setMsg({ type: 'success', text: `🗑️ Curso "${title}" eliminado.` });
            fetchCourses();
        } catch {
            setMsg({ type: 'danger', text: 'Error al eliminar el curso.' });
        }
    };
    const handleLogout = async () => {
        try { await axios.post(`${API}/logout`, {}, { headers }); } catch (_) { }
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/admin';
    };
    const prettyCategory = (cat) => {
        const map = {
            barberia_peluqueria: 'Barbería y Peluquería',
            certificados: 'Certificados',
            especialidades: 'Especialidades',
        };
        return map[cat] || cat || '—';
    };
    const resolveImageUrl = (img) => {
        if (!img) return null;
        if (img.startsWith('http')) return img;
        if (img.startsWith('/')) return `${BASE}${img}`;
        return `${BASE}/${img}`;
    };
    return (
        <div className="container py-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="fw-bold" style={{ color: '#3b2e12' }}>Gestión de Cursos</h1>
                <button className="btn btn-outline-dark btn-sm" onClick={handleLogout}>
                    Cerrar sesión
                </button>
            </div>
            {msg && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}
            {}
            <div className="card shadow-sm border-0 mb-4">
                <div className="card-header bg-dark text-white fw-semibold">
                    {editingId ? 'Editar curso' : 'Crear nuevo curso'}
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="row g-3">
                            <div className="col-md-6">
                                <label className="form-label fw-semibold">Título *</label>
                                <input type="text" className="form-control" name="title" value={form.title} onChange={handleChange} required />
                            </div>
                            <div className="col-md-3">
                                <label className="form-label fw-semibold">Modalidad *</label>
                                <select className="form-select" name="modality" value={form.modality} onChange={handleChange}>
                                    <option value="presencial">Presencial</option>
                                    <option value="online">Online</option>
                                </select>
                            </div>
                            <div className="col-md-3">
                                <label className="form-label fw-semibold">Precio (€)</label>
                                <input type="number" step="0.01" className="form-control" name="price" value={form.price} onChange={handleChange} placeholder="0.00" />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label fw-semibold">Tipo de curso *</label>
                                <select className="form-select" name="category" value={form.category} onChange={handleChange} required>
                                    <option value="barberia_peluqueria">Barbería y Peluquería</option>
                                    <option value="certificados">Certificados de profesionalidad</option>
                                    <option value="especialidades">Especialidades</option>
                                </select>
                            </div>
                            {form.category === 'certificados' && (
                                <div className="col-md-4">
                                    <label className="form-label fw-semibold">Nivel (solo certificados) *</label>
                                    <select className="form-select" name="level" value={form.level} onChange={handleChange} required>
                                        <option value="">Selecciona nivel</option>
                                        <option value="1">Nivel 1</option>
                                        <option value="2">Nivel 2</option>
                                        <option value="3">Nivel 3</option>
                                    </select>
                                </div>
                            )}
                            <div className="col-md-4">
                                <label className="form-label fw-semibold">Duración</label>
                                <input type="text" className="form-control" name="duration" value={form.duration} onChange={handleChange} placeholder="Ej: 200 horas" />
                            </div>
                            <div className="col-md-12 d-flex gap-4 align-items-end mt-3">
                                <div className="form-check form-switch">
                                    <input className="form-check-input" type="checkbox" name="active" id="active" checked={form.active} onChange={handleChange} />
                                    <label className="form-check-label fw-semibold" htmlFor="active">Curso visible (Activo)</label>
                                </div>
                                <div className="form-check form-switch">
                                    <input className="form-check-input" type="checkbox" name="is_purchasable" id="is_purchasable" checked={form.is_purchasable} onChange={handleChange} />
                                    <label className="form-check-label fw-semibold" htmlFor="is_purchasable">Se puede comprar online</label>
                                </div>
                            </div>
                            {}
                            <div className="col-md-6">
                                <label className="form-label fw-semibold">Imagen portada (opcional)</label>
                                <input
                                    key={fileInputKey}
                                    type="file"
                                    className="form-control"
                                    accept="image/*"
                                    onChange={(e) => onPickImage(e.target.files?.[0] || null)}
                                />
                                <div className="form-text">JPG/PNG/WebP (máx 4MB). Puedes recortarla antes de subir.</div>
                                {croppedPreviewUrl && (
                                    <div className="mt-2">
                                        <div className="small text-muted mb-1">Vista previa (recortada)</div>
                                        <img
                                            src={croppedPreviewUrl}
                                            alt="Preview"
                                            style={{ width: 160, height: 100, objectFit: 'cover', borderRadius: 8, border: '1px solid #ddd' }}
                                        />
                                        <div className="mt-2">
                                            <button type="button" className="btn btn-sm btn-outline-dark" onClick={() => setCropOpen(true)}>
                                                Volver a recortar
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="col-md-6">
                                <label className="form-label fw-semibold">Descripción</label>
                                <textarea className="form-control" name="description" rows="2" value={form.description} onChange={handleChange} />
                            </div>
                        </div>
                        <div className="d-flex gap-2 mt-3">
                            <button type="submit" className="btn btn-dark fw-semibold" disabled={saving}>
                                {saving ? (<><span className="spinner-border spinner-border-sm me-2"></span>Guardando...</>) : (editingId ? '💾 Guardar cambios' : '+ Crear curso')}
                            </button>
                            {editingId && (
                                <button type="button" className="btn btn-outline-secondary fw-semibold" onClick={cancelEdit} disabled={saving}>
                                    Cancelar
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
            {}
            <h4 className="fw-bold mb-3">Cursos existentes ({courses.length})</h4>
            {loading ? (
                <div className="alert alert-info">
                    <span className="spinner-border spinner-border-sm me-2"></span>Cargando...
                </div>
            ) : courses.length === 0 ? (
                <div className="alert alert-warning">No hay cursos.</div>
            ) : (
                <div className="table-responsive">
                    <table className="table table-hover align-middle">
                        <thead className="table-dark">
                            <tr>
                                <th>ID</th>
                                <th>Portada</th>
                                <th>Título</th>
                                <th>Tipo</th>
                                <th>Nivel</th>
                                <th>Modalidad</th>
                                <th>Duración</th>
                                <th>Precio</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {courses.map(c => (
                                <tr key={c.id}>
                                    <td>{c.id}</td>
                                    <td style={{ width: 120 }}>
                                        {c.image ? (
                                            <img
                                                src={resolveImageUrl(c.image)}
                                                alt=""
                                                style={{ width: 110, height: 65, objectFit: 'cover', borderRadius: 8 }}
                                            />
                                        ) : '—'}
                                    </td>
                                    <td className="fw-semibold">{c.title}</td>
                                    <td><span className="badge bg-secondary">{prettyCategory(c.category)}</span></td>
                                    <td>{c.category === 'certificados' && c.level ? <span className="badge bg-warning text-dark">{`Nivel ${c.level}`}</span> : '—'}</td>
                                    <td><span className={`badge ${c.modality === 'presencial' ? 'bg-dark' : 'bg-success'}`}>{c.modality}</span></td>
                                    <td>{c.duration || '—'}</td>
                                    <td>{c.price !== null && c.price !== undefined && c.price !== '' ? `${Number(c.price).toFixed(2)} €` : '—'}</td>
                                    <td>
                                        <button className="btn btn-sm btn-outline-primary me-2 mb-1" onClick={() => handleEdit(c)}>
                                            ✏️ Editar
                                        </button>
                                        <button className="btn btn-sm btn-outline-danger mb-1" onClick={() => handleDelete(c.id, c.title)}>
                                            🗑️ Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            {/* MODAL RECORTE */}
            {cropOpen && imagePreviewUrl && (
                <div
                    className="position-fixed top-0 start-0 w-100 h-100"
                    style={{ background: 'rgba(0,0,0,0.7)', zIndex: 1050 }}
                    onClick={() => setCropOpen(false)}
                >
                    <div
                        className="position-absolute top-50 start-50 translate-middle bg-white rounded shadow"
                        style={{ width: 'min(92vw, 900px)' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-3 border-bottom d-flex justify-content-between align-items-center">
                            <div className="fw-bold">Recortar imagen (portada)</div>
                            <button className="btn btn-sm btn-outline-dark" onClick={() => setCropOpen(false)}>Cerrar</button>
                        </div>
                        <div style={{ position: 'relative', width: '100%', height: 420, background: '#111' }}>
                            <Cropper
                                image={imagePreviewUrl}
                                crop={crop}
                                zoom={zoom}
                                aspect={16 / 9}           
                                onCropChange={setCrop}
                                onZoomChange={setZoom}
                                onCropComplete={onCropComplete}
                            />
                        </div>
                        <div className="p-3 d-flex align-items-center justify-content-between gap-3">
                            <div className="d-flex align-items-center gap-2" style={{ minWidth: 220 }}>
                                <span className="small text-muted">Zoom</span>
                                <input
                                    type="range"
                                    min="1"
                                    max="3"
                                    step="0.01"
                                    value={zoom}
                                    onChange={(e) => setZoom(Number(e.target.value))}
                                    style={{ width: 160 }}
                                />
                            </div>
                            <div className="d-flex gap-2">
                                <button className="btn btn-outline-dark" onClick={() => setCropOpen(false)}>
                                    Cancelar
                                </button>
                                <button className="btn btn-dark" onClick={applyCrop}>
                                    Usar recorte
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
export default AdminCourses;