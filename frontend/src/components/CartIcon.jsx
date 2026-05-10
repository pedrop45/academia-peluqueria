import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
function CartIcon() {
    const { cartCount } = useCart();
    return (
        <Link
            to="/carrito"
            title="Ver carrito"
            style={{
                position: 'relative',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'rgba(255,255,255,0.85)',
                fontSize: '1.4rem',
                textDecoration: 'none',
                transition: 'color .2s',
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#c9a24d'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.85)'}
        >
            🛒
            {cartCount > 0 && (
                <span style={{
                    position: 'absolute',
                    top: '-6px',
                    right: '-10px',
                    background: 'linear-gradient(135deg,#c9a24d,#e0b85c)',
                    color: '#111',
                    borderRadius: '50%',
                    width: '18px',
                    height: '18px',
                    fontSize: '.68rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    lineHeight: 1,
                }}>
                    {cartCount > 9 ? '9+' : cartCount}
                </span>
            )}
        </Link>
    );
}
export default CartIcon;
