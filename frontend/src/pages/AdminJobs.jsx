import { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { AdminShell, API } from '../components/AdminShell';
const EMPTY = { full_name: '', bio: '', location: '', skills: '', is_visible: true };
function AdminJobs() {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [msg, setMsg] = useState(null);
    const [form, setForm] = useState(EMPTY);
    const [editId, setEditId] = useState(null);
    const [saving, setSaving] = useState(false);
    const fetch = () => {
        setLoading(true);
        axios.get(`${API}/admin/jobs/candidates`, { headers })
            .then(r => setItems(r.data))
            .catch(() => setItems([]))
            .finally(() => setLoading(false));
    };
    useEffect(fetch, []);
    const handleChange = e => {
        const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setForm({ ...form, [e.target.name]: val });
    };
    const handleSubmit = async e => {
        e.preventDefault();
        setSaving(true); setMsg(null);
        try {
            if (editId) {
                await axios.put(`${API}/admin/jobs/candidates/${editId}`, form, { headers });
                setMsg({ type: 'success', text: '✅ Candidato actualizado.' });
            } else {
                await axios.post(`${API}/admin/jobs/candidates`, form, { headers });
                setMsg({ type: 'success', text: '✅ Candidato añadido.' });
            }
            setForm(EMPTY); setEditId(null); fetch();
        } catch (err) {
            const e = err.response?.data?.errors;
            setMsg({ type: 'danger', text: e ? Object.values(e).flat().join(' ') : 'Error al guardar.' });
        } finally { setSaving(false); }
    };
    const handleEdit = item => {
        setEditId(item.id);
        setForm({ full_name: item.full_name, bio: item.bio || '', location: item.location || '', skills: item.skills || '', is_visible: item.is_visible });
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
            await axios.delete(`${API}/admin/jobs/candidates/${id}`, { headers });
            setMsg({ type: 'success', text: `🗑️ "${name}" eliminado.` });
            fetch();
        } catch { setMsg({ type: 'danger', text: 'Error al eliminar.' }); }
    };
    return (
        <AdminShell title="Bolsa de Empleo — Candidatos" msg={msg}>
            {}
            <div className="card shadow-sm border-0 mb-4">
                <div className="card-header bg-dark text-white fw-semibold">
                    {editId ? `Editando candidato #${editId}` : 'Nuevo candidato'}
                    {editId && (
                        <button className="btn btn-sm btn-outline-light ms-3"
                            onClick={() => { setEditId(null); setForm(EMPTY); }}>✕ Cancelar</button>
                    )}
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="row g-3">
                            <div className="col-md-4">
                                <label className="form-label fw-semibold">Nombre completo *</label>
                                <input className="form-control" name="full_name" value={form.full_name} onChange={handleChange} required />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label fw-semibold">Ubicación</label>
                                <input className="form-control" name="location" value={form.location} onChange={handleChange} placeholder="Almería" />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label fw-semibold">Skills (separadas por coma)</label>
                                <input className="form-control" name="skills" value={form.skills} onChange={handleChange} placeholder="Barbería, Coloración" />
                            </div>
                            <div className="col-12">
                                <label className="form-label fw-semibold">Bio</label>
                                <textarea className="form-control" name="bio" rows="2" value={form.bio} onChange={handleChange} />
                            </div>
                            <div className="col-12">
                                <div className="form-check">
                                    <input className="form-check-input" type="checkbox" id="is_visible_job"
                                        name="is_visible" checked={form.is_visible} onChange={handleChange} />
                                    <label className="form-check-label fw-semibold" htmlFor="is_visible_job">Visible en la bolsa pública</label>
                                </div>
                            </div>
                        </div>
                        <button type="submit" className="btn btn-dark mt-3 fw-semibold" disabled={saving}>
                            {saving ? <><span className="spinner-border spinner-border-sm me-2"></span>Guardando...</> : (editId ? '💾 Actualizar' : '+ Añadir candidato')}
                        </button>
                    </form>
                </div>
            </div>
            {}
            <h5 className="fw-bold mb-3">Candidatos ({items.length})</h5>
            {loading ? <div className="alert alert-info"><span className="spinner-border spinner-border-sm me-2"></span>Cargando...</div>
                : items.length === 0 ? <div className="alert alert-warning">No hay candidatos.</div>
                    : (
                        <div className="table-responsive">
                            <table className="table table-hover align-middle">
                                <thead className="table-dark">
                                    <tr><th>ID</th><th>Nombre</th><th>Ubicación</th><th>Skills</th><th>Visible</th><th>Acciones</th></tr>
                                </thead>
                                <tbody>
                                    {items.map(c => (
                                        <tr key={c.id}>
                                            <td>{c.id}</td>
                                            <td className="fw-semibold">{c.full_name}</td>
                                            <td>{c.location || '—'}</td>
                                            <td style={{ maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.skills || '—'}</td>
                                            <td><span className={`badge ${c.is_visible ? 'bg-success' : 'bg-secondary'}`}>{c.is_visible ? 'Sí' : 'No'}</span></td>
                                            <td className="d-flex gap-2">
                                                <button className="btn btn-sm btn-outline-secondary" onClick={() => handleEdit(c)}>✏️ Editar</button>
                                                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(c.id, c.full_name)}>🗑️ Eliminar</button>
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
export default AdminJobs;
