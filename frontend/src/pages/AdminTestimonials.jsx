import { useEffect, useState, useCallback, useMemo } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useDropzone } from 'react-dropzone';
import Cropper from 'react-easy-crop';
import { AdminShell, API } from '../components/AdminShell';

const BACKEND = '';
const BASE = '';

const EMPTY = { student_name: '', course: '', rating: 5, content: '', is_published: true };

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

function resolveImageUrl(img) {
    if (!img) return null;
    if (img.startsWith('http')) return img;
    if (img.startsWith('/')) return `${BASE}${img}`;
    return `${BASE}/${img}`;
}

/* ─── Video Dropzone Component ─── */
function VideoDropzone({ videoFile, existingUrl, onDrop, onRemove }) {
    const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
        onDrop: files => files[0] && onDrop(files[0]),
        accept: { 'video/*': [] },
        maxSize: 104857600, // 100MB
        multiple: false
    });

    return (
        <div className="mb-3">
            <label className="form-label fw-semibold">Video (Archivo Local)</label>
            {videoFile ? (
                <div className="p-3 border rounded text-center bg-light">
                    <p className="mb-2 fw-semibold text-success">🎥 {videoFile.name}</p>
                    <button type="button" className="btn btn-sm btn-outline-danger" onClick={onRemove}>
                        Quitar archivo
                    </button>
                </div>
            ) : existingUrl ? (
                <div className="p-3 border rounded text-center bg-light">
                    <p className="mb-2 fw-semibold text-primary">🎥 Video actual subido</p>
                    <video src={`${BACKEND}${existingUrl}`} className="w-100 rounded mb-2" style={{ maxHeight: '150px' }} controls />
                    <br />
                    <button type="button" className="btn btn-sm btn-outline-danger" onClick={onRemove}>
                        Eliminar video actual
                    </button>
                </div>
            ) : (
                <div {...getRootProps()} className={`p-4 border border-2 border-dashed rounded text-center ${isDragActive ? 'border-primary bg-primary bg-opacity-10' : isDragReject ? 'border-danger bg-danger bg-opacity-10' : 'border-secondary'}`} style={{ cursor: 'pointer', transition: 'all 0.2s' }}>
                    <input {...getInputProps()} />
                    <div className="fs-1 mb-2 text-secondary">📥</div>
                    {isDragActive ? (
                        <p className="text-primary fw-semibold mb-0">¡Suelta el video aquí!</p>
                    ) : (
                        <p className="text-secondary mb-0">Arrastra y suelta un video aquí, o haz clic para seleccionar</p>
                    )}
                    <small className="text-muted mt-2 d-block">(Formatos soportados: MP4, WebM, MOV, AVI, MKV. Max 100MB)</small>
                </div>
            )}
        </div>
    );
}

function AdminTestimonials() {
    const token = localStorage.getItem('token');
    const headers = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token]);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [msg, setMsg] = useState(null);
    const [form, setForm] = useState(EMPTY);
    const [videoFile, setVideoFile] = useState(null);
    const [removeVideo, setRemoveVideo] = useState(false);
    const [editId, setEditId] = useState(null);
    const [saving, setSaving] = useState(false);

    // Image Upload & Crop States (for photo)
    const [fileInputKey, setFileInputKey] = useState(Date.now());
    const [imageFile, setImageFile] = useState(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
    const [cropOpen, setCropOpen] = useState(false);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [croppedBlob, setCroppedBlob] = useState(null);
    const [croppedPreviewUrl, setCroppedPreviewUrl] = useState(null);

    const fetchItems = useCallback(() => {
        setLoading(true);
        axios.get(`${API}/admin/testimonials`, { headers })
            .then(r => setItems(r.data))
            .catch(() => setItems([]))
            .finally(() => setLoading(false));
    }, [headers]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => { fetchItems(); }, [fetchItems]);

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

    const handleVideoDrop = file => {
        setVideoFile(file);
        setRemoveVideo(false);
    };

    const handleVideoRemove = () => {
        setVideoFile(null);
        setRemoveVideo(true);
    };

    // --- Image Crop Functions ---
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
    // ----------------------------

    const handleSubmit = async e => {
        e.preventDefault();
        setSaving(true); setMsg(null);

        const formData = new FormData();
        formData.append('student_name', form.student_name);
        formData.append('course', form.course || '');
        formData.append('rating', form.rating || 5);
        formData.append('content', form.content);
        formData.append('is_published', form.is_published ? '1' : '0');

        if (videoFile) {
            formData.append('video', videoFile);
        }

        if (croppedBlob) {
            formData.append('photo', new File([croppedBlob], 'photo.jpg', { type: 'image/jpeg' }));
        } else if (imageFile) {
            formData.append('photo', imageFile);
        }

        try {
            if (editId) {
                if (removeVideo) formData.append('remove_video', '1');
                formData.append('_method', 'PUT'); // Laravel requirement for form-data PUT
                await axios.post(`${API}/admin/testimonials/${editId}`, formData, { headers: { ...headers, 'Content-Type': 'multipart/form-data' } });
                setMsg({ type: 'success', text: '✅ Testimonio actualizado.' });
            } else {
                await axios.post(`${API}/admin/testimonials`, formData, { headers: { ...headers, 'Content-Type': 'multipart/form-data' } });
                setMsg({ type: 'success', text: '✅ Testimonio añadido.' });
            }
            handleCancel();
            fetchItems();
        } catch (err) {
            const e = err.response?.data?.errors;
            setMsg({ type: 'danger', text: e ? Object.values(e).flat().join(' ') : 'Error al guardar.' });
        } finally { setSaving(false); }
    };

    const handleEdit = item => {
        setEditId(item.id);
        setForm({
            student_name: item.student_name,
            course: item.course || '',
            rating: item.rating || 5,
            content: item.content,
            existing_url: item.video_url, // for internal use
            is_published: item.is_published
        });
        setVideoFile(null);
        setRemoveVideo(false);
        resetImageStates();
        window.scrollTo(0, 0);
    };

    const handleCancel = () => {
        setEditId(null);
        setForm(EMPTY);
        setVideoFile(null);
        setRemoveVideo(false);
        resetImageStates();
    };

    const handleDelete = async (id, name) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: `¿Eliminar testimonio de "${name}"?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });
        if (!result.isConfirmed) return;
        try {
            await axios.delete(`${API}/admin/testimonials/${id}`, { headers });
            setMsg({ type: 'success', text: `🗑️ Testimonio de "${name}" eliminado.` });
            fetchItems();
        } catch { setMsg({ type: 'danger', text: 'Error al eliminar.' }); }
    };

    const handleToggle = async (id) => {
        try {
            await axios.patch(`${API}/admin/testimonials/${id}/toggle`, {}, { headers });
            fetchItems();
        } catch { setMsg({ type: 'danger', text: 'Error al cambiar estado.' }); }
    };

    return (
        <AdminShell title="Testimonios" msg={msg}>
            <div className="card shadow-sm border-0 mb-4">
                <div className="card-header bg-dark text-white fw-semibold d-flex justify-content-between align-items-center">
                    <span>{editId ? `Editando testimonio #${editId}` : 'Nuevo Testimonio'}</span>
                    {editId && (
                        <button className="btn btn-sm btn-outline-light" onClick={handleCancel}>✕ Cancelar</button>
                    )}
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="row g-3">
                            <div className="col-md-6">
                                <label className="form-label fw-semibold">Nombre Alumno *</label>
                                <input className="form-control" name="student_name" value={form.student_name} onChange={handleChange} required />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label fw-semibold">Curso Asociado</label>
                                <input className="form-control" name="course" value={form.course} onChange={handleChange} placeholder="Ej: Barbería Avanzada" />
                            </div>
                            <div className="col-md-2">
                                <label className="form-label fw-semibold">Valoración *</label>
                                <select className="form-select" name="rating" value={form.rating} onChange={handleChange} required>
                                    {[1, 2, 3, 4, 5].map(v => <option key={v} value={v}>{v} Estrellas</option>)}
                                </select>
                            </div>
                            <div className="col-12">
                                <label className="form-label fw-semibold">Testimonio (Texto) *</label>
                                <textarea className="form-control" name="content" rows="4" value={form.content} onChange={handleChange} required></textarea>
                            </div>

                            <div className="col-12">
                                <label className="form-label fw-semibold">Foto Alumno</label>
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
                                            style={{ width: 140, height: 140, objectFit: 'cover', borderRadius: '50%', border: '2px solid #ddd' }}
                                        />
                                        <div className="mt-2">
                                            <button type="button" className="btn btn-sm btn-outline-dark" onClick={() => setCropOpen(true)}>
                                                Volver a recortar
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="col-12 mt-4">
                                <VideoDropzone
                                    videoFile={videoFile}
                                    existingUrl={form.existing_url}
                                    onDrop={handleVideoDrop}
                                    onRemove={handleVideoRemove}
                                />
                            </div>

                            <div className="col-12 mt-3">
                                <div className="form-check form-switch fs-5">
                                    <input className="form-check-input" type="checkbox" role="switch" id="is_published_toggle" name="is_published" checked={form.is_published} onChange={handleChange} />
                                    <label className="form-check-label ms-2 mt-1 fs-6 fw-semibold" htmlFor="is_published_toggle">Publicar en la web</label>
                                </div>
                            </div>
                        </div>

                        <button type="submit" className="btn btn-dark mt-4 fw-semibold px-4 py-2" disabled={saving}>
                            {saving ? <><span className="spinner-border spinner-border-sm me-2"></span>Guardando...</> : (editId ? '💾 Actualizar Testimonio' : '+ Añadir Testimonio')}
                        </button>
                    </form>
                </div>
            </div>

            <h5 className="fw-bold mb-3">Lista de Testimonios ({items.length})</h5>
            {loading ? <div className="alert alert-info border-0 shadow-sm"><span className="spinner-border spinner-border-sm me-2"></span>Cargando testimonios...</div>
                : items.length === 0 ? <div className="alert alert-warning border-0 shadow-sm">No hay testimonios registrados.</div>
                    : (
                        <div className="table-responsive shadow-sm rounded-3">
                            <table className="table table-hover align-middle mb-0 bg-white">
                                <thead className="table-dark">
                                    <tr>
                                        <th>ID</th>
                                        <th>Alumno</th>
                                        <th>Curso</th>
                                        <th>Rating</th>
                                        <th>Multimedia</th>
                                        <th>Estado</th>
                                        <th className="text-end" style={{ minWidth: '150px' }}>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map(t => (
                                        <tr key={t.id}>
                                            <td className="text-muted fw-bold">#{t.id}</td>
                                            <td className="fw-semibold">
                                                <div className="d-flex align-items-center gap-2">
                                                    {t.photo ? <img src={resolveImageUrl(t.photo)} alt={t.student_name} className="rounded-circle object-fit-cover" style={{ width: '32px', height: '32px' }} /> : <div className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px', fontSize: '14px' }}>{t.student_name.charAt(0)}</div>}
                                                    {t.student_name}
                                                </div>
                                            </td>
                                            <td>{t.course || <span className="text-muted">—</span>}</td>
                                            <td>
                                                <div className="text-warning">{'★'.repeat(t.rating || 5)}{'☆'.repeat(5 - (t.rating || 5))}</div>
                                            </td>
                                            <td>
                                                <div className="d-flex flex-column gap-1">
                                                    {t.video_url && t.video_url.startsWith('/storage/') && <span className="badge bg-primary bg-opacity-10 text-primary border border-primary-subtle d-inline-block text-truncate" style={{ maxWidth: '120px' }} title="Video Local">🎞️ Video Local</span>}
                                                    {t.video_url && !t.video_url.startsWith('/storage/') && <span className="badge bg-info bg-opacity-10 text-info border border-info-subtle d-inline-block text-truncate" style={{ maxWidth: '120px' }} title="Link Externo">🔗 Link Video</span>}
                                                    {!t.video_url && <span className="text-muted" style={{ fontSize: '13px' }}>Solo texto</span>}
                                                </div>
                                            </td>
                                            <td>
                                                <button onClick={() => handleToggle(t.id)} className={`btn btn-sm ${t.is_published ? 'btn-success text-white' : 'btn-secondary text-white'} border-0 px-3 rounded-pill`} style={{ fontSize: '12px', fontWeight: '500' }}>
                                                    {t.is_published ? '✅ Visible' : '❌ Oculto'}
                                                </button>
                                            </td>
                                            <td className="text-end d-flex gap-2 justify-content-end">
                                                <button className="btn btn-sm btn-outline-dark" onClick={() => handleEdit(t)}>✏️ Editar</button>
                                                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(t.id, t.student_name)}>🗑️</button>
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
                            <div className="fw-bold">Recortar foto (Alumno)</div>
                            <button className="btn btn-sm btn-outline-dark" onClick={() => setCropOpen(false)}>Cerrar</button>
                        </div>
                        <div style={{ position: 'relative', width: '100%', height: 420, background: '#111' }}>
                            <Cropper
                                image={imagePreviewUrl}
                                crop={crop}
                                zoom={zoom}
                                aspect={1} // 1:1 for student photos (avatar)
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

export default AdminTestimonials;
