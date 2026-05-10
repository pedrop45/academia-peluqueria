import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import Cropper from 'react-easy-crop';
import { AdminShell, API } from '../components/AdminShell';

const BASE = '';

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

const EMPTY = { title: '', excerpt: '', content: '', is_published: false };

function AdminBlog() {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [msg, setMsg] = useState(null);
    const [form, setForm] = useState(EMPTY);
    const [editId, setEditId] = useState(null);
    const [saving, setSaving] = useState(false);

    // Image Upload & Crop States
    const [fileInputKey, setFileInputKey] = useState(Date.now());
    const [imageFile, setImageFile] = useState(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
    const [cropOpen, setCropOpen] = useState(false);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [croppedBlob, setCroppedBlob] = useState(null);
    const [croppedPreviewUrl, setCroppedPreviewUrl] = useState(null);

    const fetchPosts = () => {
        setLoading(true);
        axios.get(`${API}/admin/blog/posts`, { headers })
            .then(r => setItems(r.data))
            .catch(() => setItems([]))
            .finally(() => setLoading(false));
    };

    useEffect(fetchPosts, []);

    useEffect(() => {
        return () => {
            if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
            if (croppedPreviewUrl) URL.revokeObjectURL(croppedPreviewUrl);
        };
    }, []);

    const handleChange = e => {
        const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setForm({ ...form, [e.target.name]: val });
    };

    const resolveImageUrl = (img) => {
        if (!img) return null;
        if (img.startsWith('http')) return img;
        if (img.startsWith('/')) return `${BASE}${img}`;
        return `${BASE}/${img}`;
    };

    const onCropComplete = useCallback((_, croppedPixels) => {
        setCroppedAreaPixels(croppedPixels);
    }, []);

    const onPickImage = (file) => {
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

    const resetImageStates = () => {
        setFileInputKey(Date.now());
        setImageFile(null);
        if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
        if (croppedPreviewUrl) URL.revokeObjectURL(croppedPreviewUrl);
        setImagePreviewUrl(null);
        setCroppedBlob(null);
        setCroppedPreviewUrl(null);
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setSaving(true); setMsg(null);
        try {
            const fd = new FormData();
            fd.append('title', form.title);
            fd.append('excerpt', form.excerpt || '');
            fd.append('content', form.content);
            fd.append('is_published', form.is_published ? '1' : '0');

            if (croppedBlob) {
                fd.append('cover_image', new File([croppedBlob], 'cover_image.jpg', { type: 'image/jpeg' }));
            } else if (imageFile) {
                fd.append('cover_image', imageFile);
            }

            if (editId) {
                fd.append('_method', 'PUT');
                await axios.post(`${API}/admin/blog/posts/${editId}`, fd, { 
                    headers: { ...headers, 'Content-Type': 'multipart/form-data' } 
                });
                setMsg({ type: 'success', text: '✅ Post actualizado.' });
            } else {
                await axios.post(`${API}/admin/blog/posts`, fd, { 
                    headers: { ...headers, 'Content-Type': 'multipart/form-data' } 
                });
                setMsg({ type: 'success', text: '✅ Post creado.' });
            }
            
            setForm(EMPTY); 
            setEditId(null); 
            resetImageStates();
            fetchPosts();
            window.scrollTo(0, 0);
        } catch (err) {
            const errMsg = err.response?.data?.errors;
            setMsg({ type: 'danger', text: errMsg ? Object.values(errMsg).flat().join(' ') : 'Error al guardar.' });
        } finally { setSaving(false); }
    };

    const handleEdit = item => {
        setEditId(item.id);
        setForm({ 
            title: item.title, 
            excerpt: item.excerpt || '', 
            content: item.content, 
            is_published: item.is_published 
        });
        resetImageStates();
        window.scrollTo(0, 0);
    };

    const handleDelete = async (id, title) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: `¿Eliminar el post "${title}"?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });
        if (!result.isConfirmed) return;
        try {
            await axios.delete(`${API}/admin/blog/posts/${id}`, { headers });
            setMsg({ type: 'success', text: `🗑️ Post "${title}" eliminado.` });
            fetchPosts();
        } catch { setMsg({ type: 'danger', text: 'Error al eliminar.' }); }
    };

    const cancelEdit = () => {
        setEditId(null);
        setForm(EMPTY);
        resetImageStates();
    };

    const formatDate = d => d ? new Date(d).toLocaleDateString('es-ES') : '—';

    return (
        <AdminShell title="Gestión del Blog" msg={msg}>
            {/* Form Card */}
            <div className="card shadow-sm border-0 mb-4">
                <div className="card-header bg-dark text-white fw-semibold">
                    {editId ? `Editando post #${editId}` : 'Nuevo post'}
                    {editId && (
                        <button className="btn btn-sm btn-outline-light ms-3" onClick={cancelEdit}>✕ Cancelar</button>
                    )}
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="row g-3">
                            <div className="col-md-8">
                                <label className="form-label fw-semibold">Título *</label>
                                <input className="form-control" name="title" value={form.title} onChange={handleChange} required />
                            </div>
                            <div className="col-md-4 d-flex align-items-end">
                                <div className="form-check">
                                    <input className="form-check-input" type="checkbox" id="is_published_blog"
                                        name="is_published" checked={form.is_published} onChange={handleChange} />
                                    <label className="form-check-label fw-semibold" htmlFor="is_published_blog">Publicar ahora</label>
                                </div>
                            </div>
                            <div className="col-12">
                                <label className="form-label fw-semibold">Extracto (resumen)</label>
                                <input className="form-control" name="excerpt" value={form.excerpt} onChange={handleChange} placeholder="Descripción breve visible en el listado" />
                            </div>
                            
                            <div className="col-md-8">
                                <label className="form-label fw-semibold">Imagen de portada</label>
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

                            <div className="col-12">
                                <label className="form-label fw-semibold">Contenido *</label>
                                <textarea className="form-control" name="content" rows="5" value={form.content} onChange={handleChange} required
                                    placeholder="Puedes escribir HTML o texto plano..." />
                            </div>
                        </div>
                        <button type="submit" className="btn btn-dark mt-3 fw-semibold" disabled={saving}>
                            {saving ? <><span className="spinner-border spinner-border-sm me-2"></span>Guardando...</> : (editId ? '💾 Actualizar' : '+ Crear post')}
                        </button>
                    </form>
                </div>
            </div>

            {/* Posts List */}
            <h5 className="fw-bold mb-3">Posts ({items.length})</h5>
            {loading ? <div className="alert alert-info"><span className="spinner-border spinner-border-sm me-2"></span>Cargando...</div>
                : items.length === 0 ? <div className="alert alert-warning">No hay posts.</div>
                    : (
                        <div className="table-responsive">
                            <table className="table table-hover align-middle">
                                <thead className="table-dark">
                                    <tr><th>ID</th><th>Portada</th><th>Título</th><th>Estado</th><th>Publicado</th><th>Acciones</th></tr>
                                </thead>
                                <tbody>
                                    {items.map(p => (
                                        <tr key={p.id}>
                                            <td>{p.id}</td>
                                            <td style={{ width: 120 }}>
                                                {p.cover_image ? (
                                                    <img
                                                        src={resolveImageUrl(p.cover_image)}
                                                        alt=""
                                                        style={{ width: 100, height: 60, objectFit: 'cover', borderRadius: 8 }}
                                                    />
                                                ) : '—'}
                                            </td>
                                            <td className="fw-semibold" style={{ maxWidth: 220 }}>{p.title}</td>
                                            <td>
                                                <span className={`badge ${p.is_published ? 'bg-success' : 'bg-secondary'}`}>
                                                    {p.is_published ? 'Publicado' : 'Borrador'}
                                                </span>
                                            </td>
                                            <td>{formatDate(p.published_at)}</td>
                                            <td className="d-flex gap-2">
                                                <button className="btn btn-sm btn-outline-secondary" onClick={() => handleEdit(p)}>✏️ Editar</button>
                                                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(p.id, p.title)}>🗑️ Eliminar</button>
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
        </AdminShell>
    );
}

export default AdminBlog;
