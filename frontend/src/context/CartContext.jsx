import { createContext, useContext, useState, useEffect } from 'react';
const CartContext = createContext(null);
const STORAGE_KEY = 'academia_cart';
export function CartProvider({ children }) {
    const [cart, setCart] = useState(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    }, [cart]);
    const addToCart = (course) => {
        setCart(prev => {
            if (prev.some(c => c.id === course.id)) return prev; 
            return [...prev, course];
        });
    };
    const removeFromCart = (courseId) => {
        setCart(prev => prev.filter(c => c.id !== courseId));
    };
    const clearCart = () => setCart([]);
    const isInCart = (courseId) => cart.some(c => c.id === courseId);
    const cartTotal = cart.reduce((sum, c) => sum + parseFloat(c.price || 0), 0);
    return (
        <CartContext.Provider value={{
            cart,
            addToCart,
            removeFromCart,
            clearCart,
            isInCart,
            cartTotal,
            cartCount: cart.length,
        }}>
            {children}
        </CartContext.Provider>
    );
}
export function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error('useCart must be used within CartProvider');
    return ctx;
}
