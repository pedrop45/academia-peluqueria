import { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { AdminShell, API } from '../components/AdminShell';

const BACKEND = '';
const EMPTY = { title: '', section: '', featured: false, active: true };

function AdminGallery() {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [msg, setMsg] = useState(null);

    const [form, setForm] = useState(EMPTY);
    const [imageFile, setImageFile] = useState(null);
    const [existingImage, setExistingImage] = useState(null);
    const [editId, setEditId] = useState(null);
    const [saving, setSaving] = useState(false);

    const sections = ['peluqueria', 'barberia', 'uñas', 'maquillaje'];

    const fetchItems = () => {
        setLoading(true);
        axios.get(`${API}/admin/gallery`, { headers })
            .then(r => setItems(r.data))
            .catch(() => setItems([]))
            .finally(() => setLoading(false));
    };
    useEffect(fetchItems, []);

    const handleChange = e => {
        const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setForm({ ...form, [e.target.name]: val });
    };

    const handleFileChange = e => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    const resetForm = () => {
        setForm(EMPTY);
        setEditId(null);
        setImageFile(null);
        setExistingImage(null);
        document.getElementById('imageFile').value = '';
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setSaving(true); setMsg(null);

        const fd = new FormData();
        fd.append('title', form.title);
        fd.append('section', form.section);
        fd.append('featured', form.featured ? '1' : '0');
        fd.append('active', form.active ? '1' : '0');

        if (imageFile) {
            fd.append('image', imageFile);
        } else if (!editId) {
            setSaving(false);
            setMsg({ type: 'danger', text: 'Debes seleccionar una imagen para subir.' });
            return;
        }

        try {
            const config = {
                headers: { ...headers, 'Content-Type': 'multipart/form-data' },
            };

            if (editId) {
                await axios.post(`${API}/admin/gallery/${editId}`, fd, config);
                setMsg({ type: 'success', text: '✅ Imagen actualizada.' });
            } else {
                await axios.post(`${API}/admin/gallery`, fd, config);
                setMsg({ type: 'success', text: '✅ Imagen añadida a la galería.' });
            }
            resetForm();
            fetchItems();
        } catch (err) {
            const e = err.response?.data?.errors;
            setMsg({ type: 'danger', text: e ? Object.values(e).flat().join(' ') : 'Error al guardar.' });
        } finally { setSaving(false); }
    };

    const handleEdit = item => {
        setEditId(item.id);
        setForm({
            title: item.title,
            section: item.section || '',
            featured: item.featured,
            active: item.active,
        });
        setImageFile(null);
        setExistingImage(item.image);
        document.getElementById('imageFile').value = '';
        window.scrollTo(0, 0);
    };

    const handleDelete = async (id, title) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: `¿Eliminar la imagen "${title}"?`,
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
            await axios.delete(`${API}/admin/gallery/${id}`, { headers });
            setMsg({ type: 'success', text: `🗑️ Imagen "${title}" eliminada.` });
            fetchItems();
        } catch { setMsg({ type: 'danger', text: 'Error al eliminar.' }); }
    };

    const handleToggle = async (id, current) => {
        try {
            await axios.patch(`${API}/admin/gallery/${id}/toggle`, {}, { headers });
            setMsg({ type: 'success', text: current ? '👁️ Ocultado.' : '✅ Publicado.' });
            fetchItems();
        } catch { setMsg({ type: 'danger', text: 'Error al cambiar estado.' }); }
    };

    const resolveImg = img => {
        if (!img) return '';
        if (img.startsWith('http')) return img;
        if (img.startsWith('/assets/')) return img;
        return `${BACKEND}${img}`;
    };

    return (
        <AdminShell title="Nuestros Trabajos" msg={msg}>
            {}
            <div className="card shadow-sm border-0 mb-4">
                <div className="card-header bg-dark text-white fw-semibold">
                    {editId ? `Editando imagen #${editId}` : 'Añadir nueva imagen'}
                    {editId && (
                        <button className="btn btn-sm btn-outline-light ms-3"
                            onClick={resetForm}>
                            ✕ Cancelar
                        </button>
                    )}
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="row g-3">
                            <div className="col-md-6">
                                <label className="form-label fw-semibold">Título *</label>
                                <input className="form-control" name="title" value={form.title} onChange={handleChange} placeholder="Ej: Corte Degradado" required />
                            </div>
                            <div className="col-md-3">
                                <label className="form-label fw-semibold">Sección</label>
                                <select className="form-select" name="section" value={form.section} onChange={handleChange}>
                                    <option value="">Selecciona sección (opcional)</option>
                                    {sections.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                                </select>
                            </div>
                            <div className="col-md-3 d-flex flex-column justify-content-end gap-2">
                                <div className="form-check">
                                    <input className="form-check-input" type="checkbox" id="featured"
                                        name="featured" checked={form.featured} onChange={handleChange} />
                                    <label className="form-check-label fw-semibold" htmlFor="featured">¿Destacado?</label>
                                </div>
                                <div className="form-check">
                                    <input className="form-check-input" type="checkbox" id="active"
                                        name="active" checked={form.active} onChange={handleChange} />
                                    <label className="form-check-label fw-semibold" htmlFor="active">Visible</label>
                                </div>
                            </div>

                            <div className="col-12 mt-3">
                                <label className="form-label fw-semibold">Imagen {editId ? '' : '*'}</label>
                                <input type="file" className="form-control" id="imageFile" accept="image/*" onChange={handleFileChange} />

                                {/* Image Preview */}
                                {(imageFile || existingImage) && (
                                    <div className="mt-2 text-center rounded overflow-hidden shadow-sm" style={{ maxWidth: '300px', background: '#f5f5f5' }}>
                                        <img 
                                            src={imageFile ? URL.createObjectURL(imageFile) : resolveImg(existingImage)} 
                                            alt="Preview" 
                                            className="img-fluid"
                                            style={{ maxHeight: '200px', objectFit: 'contain' }} 
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        <button type="submit" className="btn btn-dark mt-4 fw-semibold" disabled={saving}>
                            {saving
                                ? <><span className="spinner-border spinner-border-sm me-2"></span>Guardando...</>
                                : (editId ? '💾 Actualizar' : '+ Añadir a Galería')}
                        </button>
                    </form>
                </div>
            </div>

            {}
            <h5 className="fw-bold mb-3">Galería ({items.length})</h5>
            {loading ? <div className="alert alert-info"><span className="spinner-border spinner-border-sm me-2"></span>Cargando...</div>
                : items.length === 0 ? <div className="alert alert-warning">No hay imágenes en la galería.</div>
                    : (
                        <div className="table-responsive">
                            <table className="table table-hover align-middle">
                                <thead className="table-dark">
                                    <tr><th>ID</th><th>Miniatura</th><th>Título</th><th>Sección</th><th>Destacado</th><th>Visible</th><th>Acciones</th></tr>
                                </thead>
                                <tbody>
                                    {items.map(t => (
                                        <tr key={t.id}>
                                            <td>{t.id}</td>
                                            <td>
                                                <img src={resolveImg(t.image)} alt={t.title} style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 4 }} />
                                            </td>
                                            <td className="fw-semibold">{t.title}</td>
                                            <td>{t.section ? t.section.charAt(0).toUpperCase() + t.section.slice(1) : '—'}</td>
                                            <td>
                                                {t.featured ? <span className="badge bg-warning text-dark">⭐️ Destacado</span> : '—'}
                                            </td>
                                            <td>
                                                <button className={`badge border-0 ${t.active ? 'bg-success' : 'bg-secondary'}`}
                                                    onClick={() => handleToggle(t.id, t.active)}>
                                                    {t.active ? 'Sí' : 'No'}
                                                </button>
                                            </td>
                                            <td>
                                                <div className="d-flex gap-2">
                                                    <button className="btn btn-sm btn-outline-secondary" onClick={() => handleEdit(t)}>✏️ Editar</button>
                                                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(t.id, t.title)}>🗑️ Eliminar</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
        </AdminShell>
    );
}

export default AdminGallery;
