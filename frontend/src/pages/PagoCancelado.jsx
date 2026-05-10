import { Link } from 'react-router-dom';
function PagoCancelado() {
    return (
        <div className="container py-5" style={{ minHeight: '70vh' }}>
            <div className="row justify-content-center">
                <div className="col-md-7 col-lg-5 text-center">
                    <div style={{
                        width: '100px', height: '100px',
                        background: '#f5f5f5',
                        borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '2.5rem',
                        margin: '0 auto 1.5rem',
                        border: '2px solid rgba(201,162,77,.3)',
                    }}>
                        ❌
                    </div>
                    <h1 className="fw-bold mb-2" style={{ color: '#3b2e12' }}>
                        Pago cancelado
                    </h1>
                    <p className="text-muted mb-4">
                        El proceso de pago ha sido cancelado. No se ha realizado ningún cargo.
                        Puedes volver al carrito para intentarlo de nuevo cuando quieras.
                    </p>
                    <div className="card border-0 shadow-sm p-4 mb-4"
                        style={{ background: '#fdf9f2', textAlign: 'left' }}>
                        <h6 className="fw-bold mb-2" style={{ color: '#3b2e12' }}>¿Necesitas ayuda?</h6>
                        <ul className="list-unstyled mb-0" style={{ lineHeight: '2' }}>
                            <li>💳 Asegúrate de tener saldo suficiente</li>
                            <li>📞 Llámanos si tienes problemas con el pago</li>
                            <li>📧 También puedes escribirnos por email</li>
                        </ul>
                    </div>
                    <div className="d-flex gap-2 justify-content-center flex-wrap">
                        <Link to="/carrito"
                            className="btn fw-semibold px-4"
                            style={{
                                background: 'linear-gradient(135deg,#c9a24d,#e0b85c)',
                                color: '#111',
                                borderRadius: '999px',
                            }}>
                            🛒 Volver al carrito
                        </Link>
                        <a href="tel:+34615317466"
                            className="btn btn-outline-dark px-4"
                            style={{ borderRadius: '999px' }}>
                            📞 Llamarnos
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default PagoCancelado;
