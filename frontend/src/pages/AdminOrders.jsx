import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminShell } from '../components/AdminShell';
import axios from 'axios';
const API = '/api';
const STATUS_LABELS = {
    pending: { label: 'Pendiente', color: '#856404', bg: '#fff3cd' },
    paid: { label: 'Pagado', color: '#0a3622', bg: '#d1e7dd' },
    cancelled: { label: 'Cancelado', color: '#842029', bg: '#f8d7da' },
    failed: { label: 'Fallido', color: '#842029', bg: '#f8d7da' },
};
function AdminOrders() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const token = localStorage.getItem('token');
    useEffect(() => {
        if (!token) { navigate('/admin'); return; }
        loadOrders();
    }, [statusFilter]);
    const loadOrders = () => {
        setLoading(true);
        const params = new URLSearchParams();
        if (statusFilter) params.append('status', statusFilter);
        if (search) params.append('search', search);
        axios.get(`${API}/admin/orders?${params}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => setOrders(res.data))
            .catch(err => {
                if (err.response?.status === 401) navigate('/admin');
            })
            .finally(() => setLoading(false));
    };
    const handleSearch = (e) => {
        e.preventDefault();
        loadOrders();
    };
    const badge = (status) => {
        const s = STATUS_LABELS[status] || STATUS_LABELS.pending;
        return (
            <span style={{
                background: s.bg,
                color: s.color,
                padding: '.2rem .7rem',
                borderRadius: '999px',
                fontSize: '.78rem',
                fontWeight: 600,
            }}>
                {s.label}
            </span>
        );
    };
    return (
        <AdminShell title="Pedidos">
            <div className="d-flex flex-wrap gap-3 align-items-center mb-4">
                {}
                <form onSubmit={handleSearch} className="d-flex gap-2" style={{ flex: 1, minWidth: '240px' }}>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Buscar por nombre o email..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={{ borderRadius: '999px' }}
                    />
                    <button type="submit" className="btn btn-dark" style={{ borderRadius: '999px' }}>🔍</button>
                </form>
                {}
                <select
                    className="form-select"
                    style={{ maxWidth: '180px', borderRadius: '999px' }}
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                >
                    <option value="">Todos los estados</option>
                    <option value="pending">Pendiente</option>
                    <option value="paid">Pagado</option>
                    <option value="cancelled">Cancelado</option>
                    <option value="failed">Fallido</option>
                </select>
            </div>
            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-dark" />
                </div>
            ) : (
                <>
                    <div className="card border-0 shadow-sm">
                        <div className="table-responsive">
                            <table className="table mb-0 align-middle">
                                <thead style={{ background: '#f8f5ef' }}>
                                    <tr>
                                        <th>#</th>
                                        <th>Comprador</th>
                                        <th>Cursos</th>
                                        <th>Total</th>
                                        <th>Estado</th>
                                        <th>Fecha</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.length === 0 && (
                                        <tr>
                                            <td colSpan={7} className="text-center text-muted py-4">
                                                No hay pedidos.
                                            </td>
                                        </tr>
                                    )}
                                    {orders.map(order => (
                                        <tr key={order.id}>
                                            <td><span className="text-muted">#{order.id}</span></td>
                                            <td>
                                                <div className="fw-semibold">{order.buyer_name}</div>
                                                <small className="text-muted">{order.buyer_email}</small>
                                            </td>
                                            <td>
                                                {order.courses?.map(c => (
                                                    <div key={c.id} className="small text-muted">
                                                        • {c.title}
                                                    </div>
                                                ))}
                                            </td>
                                            <td className="fw-bold" style={{ color: '#c9a24d' }}>
                                                {parseFloat(order.total).toFixed(2)} €
                                            </td>
                                            <td>{badge(order.status)}</td>
                                            <td>
                                                <small className="text-muted">
                                                    {new Date(order.created_at).toLocaleDateString('es-ES')}
                                                </small>
                                            </td>
                                            <td>
                                                <button
                                                    className="btn btn-sm btn-outline-dark"
                                                    style={{ borderRadius: '999px' }}
                                                    onClick={() => setSelectedOrder(order)}
                                                >
                                                    Ver
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <p className="text-muted small mt-2">{orders.length} pedido{orders.length !== 1 ? 's' : ''}</p>
                </>
            )}
            {/* Modal detalle pedido */}
            {selectedOrder && (
                <div className="modal d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,.5)' }}
                    onClick={e => e.target === e.currentTarget && setSelectedOrder(null)}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '16px' }}>
                            <div className="modal-header border-0 pb-0">
                                <h5 className="modal-title fw-bold">Pedido #{selectedOrder.id}</h5>
                                <button className="btn-close" onClick={() => setSelectedOrder(null)} />
                            </div>
                            <div className="modal-body">
                                <p className="mb-1"><strong>Comprador:</strong> {selectedOrder.buyer_name}</p>
                                <p className="mb-1"><strong>Email:</strong> {selectedOrder.buyer_email}</p>
                                {selectedOrder.buyer_phone && (
                                    <p className="mb-1"><strong>Teléfono:</strong> {selectedOrder.buyer_phone}</p>
                                )}
                                <p className="mb-1"><strong>Estado:</strong> {badge(selectedOrder.status)}</p>
                                <p className="mb-3">
                                    <strong>Fecha:</strong>{' '}
                                    {new Date(selectedOrder.created_at).toLocaleString('es-ES')}
                                </p>
                                <h6 className="fw-bold mb-2">Cursos comprados</h6>
                                {selectedOrder.courses?.map(c => (
                                    <div key={c.id} className="d-flex justify-content-between mb-1 small">
                                        <span>{c.title}</span>
                                        <span className="fw-semibold">{parseFloat(c.price).toFixed(2)} €</span>
                                    </div>
                                ))}
                                <hr />
                                <div className="d-flex justify-content-between fw-bold">
                                    <span>Total</span>
                                    <span style={{ color: '#c9a24d' }}>
                                        {parseFloat(selectedOrder.total).toFixed(2)} €
                                    </span>
                                </div>
                            </div>
                            <div className="modal-footer border-0 pt-0">
                                <button className="btn btn-dark" style={{ borderRadius: '999px' }}
                                    onClick={() => setSelectedOrder(null)}>
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminShell>
    );
}
export default AdminOrders;
