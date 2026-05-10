import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
const API = 'http://localhost:8000/api';
function PagoExito() {
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState('loading'); 
    const { clearCart } = useCart();
    const sessionId = searchParams.get('session_id');
    useEffect(() => {
        if (!sessionId) {
            setStatus('unknown');
            return;
        }
        axios.get(`${API}/payments/success?session_id=${sessionId}`)
            .then(res => {
                setStatus(res.data.status);
                if (res.data.status === 'paid') {
                    clearCart();
                }
            })
            .catch(() => setStatus('unknown'));
    }, [sessionId]);
    if (status === 'loading') {
        return (
            <div className="container py-5 text-center">
                <div className="spinner-border" style={{ color: '#c9a24d' }} role="status">
                    <span className="visually-hidden">Verificando pago...</span>
                </div>
                <p className="mt-3 text-muted">Verificando tu pago...</p>
            </div>
        );
    }
    if (status === 'paid') {
        return (
            <div className="container py-5" style={{ minHeight: '70vh' }}>
                <div className="row justify-content-center">
                    <div className="col-md-7 col-lg-5 text-center">
                        <div style={{
                            width: '100px', height: '100px',
                            background: 'linear-gradient(135deg,#c9a24d,#e0b85c)',
                            borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '2.5rem',
                            margin: '0 auto 1.5rem',
                        }}>
                            ✅
                        </div>
                        <h1 className="fw-bold mb-2" style={{ color: '#3b2e12' }}>
                            ¡Pago completado!
                        </h1>
                        <p className="text-muted mb-4">
                            Tu compra se ha procesado correctamente. Ya estás inscrito en los cursos.
                            Recibirás un email de confirmación en breve.
                        </p>
                        <div className="card border-0 shadow-sm p-4 mb-4"
                            style={{ background: '#f9f5ee', textAlign: 'left' }}>
                            <h6 className="fw-bold mb-2" style={{ color: '#3b2e12' }}>¿Qué sigue?</h6>
                            <ul className="list-unstyled mb-0" style={{ lineHeight: '2' }}>
                                <li>📚 Accede a tus cursos desde "Mis Cursos"</li>
                                <li>📧 Recibirás información de acceso por email</li>
                                <li>📞 Ante cualquier duda, contáctanos</li>
                            </ul>
                        </div>
                        <div className="d-flex gap-2 justify-content-center flex-wrap">
                            <Link to="/mis-cursos"
                                className="btn btn-dark px-4"
                                style={{ borderRadius: '999px' }}>
                                📚 Ver mis cursos
                            </Link>
                            <Link to="/cursos"
                                className="btn btn-outline-dark px-4"
                                style={{ borderRadius: '999px' }}>
                                Explorar más cursos
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-5 text-center">
            <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>⏳</div>
            <h2 className="fw-bold mb-2" style={{ color: '#3b2e12' }}>Pago en proceso</h2>
            <p className="text-muted mb-4">
                Tu pago está siendo verificado. En cuanto se confirme, quedarás inscrito automáticamente.
                Si el problema persiste, contáctanos.
            </p>
            <div className="d-flex gap-2 justify-content-center flex-wrap">
                <Link to="/mis-cursos" className="btn btn-dark px-4" style={{ borderRadius: '999px' }}>
                    Mis cursos
                </Link>
                <a href="tel:+34615317466" className="btn btn-outline-dark px-4" style={{ borderRadius: '999px' }}>
                    📞 Contactar
                </a>
            </div>
        </div>
    );
}
export default PagoExito;
