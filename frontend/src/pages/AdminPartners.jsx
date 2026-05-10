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

const EMPTY = { name: '', description: '', website: '', email: '', phone: '', location: '', is_visible: true };

function AdminPartners() {
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

    const fetchPartners = () => {
        setLoading(true);
        axios.get(`${API}/admin/partners`, { headers })
            .then(r => setItems(r.data))
            .catch(() => setItems([]))
            .finally(() => setLoading(false));
    };

    useEffect(fetchPartners, []);

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
            fd.append('name', form.name);
            fd.append('description', form.description || '');
            fd.append('website', form.website || '');
            fd.append('email', form.email || '');
            fd.append('phone', form.phone || '');
            fd.append('location', form.location || '');
            fd.append('is_visible', form.is_visible ? '1' : '0');

            if (croppedBlob) {
                fd.append('logo', new File([croppedBlob], 'logo.jpg', { type: 'image/jpeg' }));
            } else if (imageFile) {
                fd.append('logo', imageFile);
            }

            if (editId) {
                fd.append('_method', 'PUT');
                await axios.post(`${API}/admin/partners/${editId}`, fd, { 
                    headers: { ...headers, 'Content-Type': 'multipart/form-data' } 
                });
                setMsg({ type: 'success', text: '✅ Colaborador actualizado.' });
            } else {
                await axios.post(`${API}/admin/partners`, fd, { 
                    headers: { ...headers, 'Content-Type': 'multipart/form-data' } 
                });
                setMsg({ type: 'success', text: '✅ Colaborador añadido.' });
            }
            
            setForm(EMPTY); 
            setEditId(null); 
            resetImageStates();
            fetchPartners();
            window.scrollTo(0, 0);
        } catch (err) {
            const errMsg = err.response?.data?.errors;
            setMsg({ type: 'danger', text: errMsg ? Object.values(errMsg).flat().join(' ') : 'Error al guardar.' });
        } finally { setSaving(false); }
    };

    const handleEdit = item => {
        setEditId(item.id);
        setForm({ 
            name: item.name, 
            description: item.description || '', 
            website: item.website || '', 
            email: item.email || '', 
            phone: item.phone || '', 
            location: item.location || '', 
            is_visible: item.is_visible 
        });
        resetImageStates();
        window.scrollTo(0, 0);
    };

    const handleDelete = async (id, name) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: `¿Eliminar a "${name}"?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });
        if (!result.isConfirmed) return;
        try {
            await axios.delete(`${API}/admin/partners/${id}`, { headers });
            setMsg({ type: 'success', text: `🗑️ "${name}" eliminado.` });
            fetchPartners();
        } catch { setMsg({ type: 'danger', text: 'Error al eliminar.' }); }
    };

    const cancelEdit = () => {
        setEditId(null);
        setForm(EMPTY);
        resetImageStates();
    };

    return (
        <AdminShell title="Centros Colaboradores" msg={msg}>
            {/* Form Card */}
            <div className="card shadow-sm border-0 mb-4">
                <div className="card-header bg-dark text-white fw-semibold">
                    {editId ? `Editando colaborador #${editId}` : 'Nuevo colaborador'}
                    {editId && (
                        <button className="btn btn-sm btn-outline-light ms-3" onClick={cancelEdit}>✕ Cancelar</button>
                    )}
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="row g-3">
                            <div className="col-md-5">
                                <label className="form-label fw-semibold">Nombre empresa *</label>
                                <input className="form-control" name="name" value={form.name} onChange={handleChange} required />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label fw-semibold">Ubicación</label>
                                <input className="form-control" name="location" value={form.location} onChange={handleChange} placeholder="Almería" />
                            </div>
                            <div className="col-md-3">
                                <label className="form-label fw-semibold">Teléfono</label>
                                <input className="form-control" name="phone" value={form.phone} onChange={handleChange} />
                            </div>
                            <div className="col-md-5">
                                <label className="form-label fw-semibold">Web</label>
                                <input className="form-control" name="website" value={form.website} onChange={handleChange} placeholder="https://..." />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label fw-semibold">Email</label>
                                <input type="email" className="form-control" name="email" value={form.email} onChange={handleChange} />
                            </div>
                            
                            <div className="col-md-8">
                                <label className="form-label fw-semibold">Logo (Imagen)</label>
                                <input
                                    key={fileInputKey}
                                    type="file"
                                    className="form-control"
                                    accept="image/*"
                                    onChange={(e) => onPickImage(e.target.files?.[0] || null)}
                                />
                                <div className="form-text">Mínimo 300x300 recomendados. Puedes recortarla antes de subir.</div>
                                {croppedPreviewUrl && (
                                    <div className="mt-2">
                                        <div className="small text-muted mb-1">Vista previa (recortada)</div>
                                        <img
                                            src={croppedPreviewUrl}
                                            alt="Preview"
                                            style={{ width: 140, height: 140, objectFit: 'contain', borderRadius: 8, border: '1px solid #ddd', padding: '10px', background: '#fff' }}
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
                                <label className="form-label fw-semibold">Descripción</label>
                                <textarea className="form-control" name="description" rows="2" value={form.description} onChange={handleChange} />
                            </div>
                            <div className="col-12">
                                <div className="form-check">
                                    <input className="form-check-input" type="checkbox" id="is_visible_p"
                                        name="is_visible" checked={form.is_visible} onChange={handleChange} />
                                    <label className="form-check-label fw-semibold" htmlFor="is_visible_p">Visible públicamente</label>
                                </div>
                            </div>
                        </div>
                        <button type="submit" className="btn btn-dark mt-3 fw-semibold" disabled={saving}>
                            {saving ? <><span className="spinner-border spinner-border-sm me-2"></span>Guardando...</> : (editId ? '💾 Actualizar' : '+ Añadir colaborador')}
                        </button>
                    </form>
                </div>
            </div>

            {/* List */}
            <h5 className="fw-bold mb-3">Colaboradores ({items.length})</h5>
            {loading ? <div className="alert alert-info"><span className="spinner-border spinner-border-sm me-2"></span>Cargando...</div>
                : items.length === 0 ? <div className="alert alert-warning">No hay colaboradores.</div>
                    : (
                        <div className="table-responsive">
                            <table className="table table-hover align-middle">
                                <thead className="table-dark">
                                    <tr><th>ID</th><th>Logo</th><th>Nombre</th><th>Ubicación</th><th>Web</th><th>Visible</th><th>Acciones</th></tr>
                                </thead>
                                <tbody>
                                    {items.map(p => (
                                        <tr key={p.id}>
                                            <td>{p.id}</td>
                                            <td style={{ width: 100 }}>
                                                {p.logo ? (
                                                    <div style={{ width: 60, height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', borderRadius: '50%', border: '1px solid #ddd', overflow: 'hidden', padding: '5px' }}>
                                                        <img
                                                            src={resolveImageUrl(p.logo)}
                                                            alt=""
                                                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                                        />
                                                    </div>
                                                ) : '—'}
                                            </td>
                                            <td className="fw-semibold">{p.name}</td>
                                            <td>{p.location || '—'}</td>
                                            <td>{p.website ? <a href={p.website} target="_blank" rel="noreferrer" style={{ fontSize: '.82rem' }}>Ver web</a> : '—'}</td>
                                            <td><span className={`badge ${p.is_visible ? 'bg-success' : 'bg-secondary'}`}>{p.is_visible ? 'Sí' : 'No'}</span></td>
                                            <td className="d-flex gap-2">
                                                <button className="btn btn-sm btn-outline-secondary" onClick={() => handleEdit(p)}>✏️ Editar</button>
                                                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(p.id, p.name)}>🗑️ Eliminar</button>
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
                            <div className="fw-bold">Recortar imagen (Logo)</div>
                            <button className="btn btn-sm btn-outline-dark" onClick={() => setCropOpen(false)}>Cerrar</button>
                        </div>
                        <div style={{ position: 'relative', width: '100%', height: 420, background: '#111' }}>
                            <Cropper
                                image={imagePreviewUrl}
                                crop={crop}
                                zoom={zoom}
                                aspect={1} // 1:1 for logos
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

export default AdminPartners;
