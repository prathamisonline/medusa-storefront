import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, Menu, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "../../store/cartState";
import "./Header.css";

export const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { itemCount } = useCart();
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    return (
        <header className="header">
            <div className="header-container">
                <Link to="/" className="header-logo">
                    <span className="logo-text">Medusa</span>
                    <span className="logo-badge">Store</span>
                </Link>

                <nav className={`header-nav ${isMenuOpen ? "open" : ""}`}>
                    <Link
                        to="/"
                        className={`nav-link ${isActive("/") ? "active" : ""}`}
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Home
                    </Link>
                    <Link
                        to="/products"
                        className={`nav-link ${isActive("/products") ? "active" : ""}`}
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Products
                    </Link>
                </nav>

                <div className="header-actions">
                    <Link to="/cart" className="cart-link">
                        <ShoppingCart size={24} />
                        {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
                    </Link>

                    <button
                        className="menu-toggle"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>
        </header>
    );
};
