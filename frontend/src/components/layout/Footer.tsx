import { Link } from "react-router-dom";
import "./Footer.css";

export const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-brand">
                    <Link to="/" className="footer-logo">
                        <span className="logo-text">Medusa</span>
                        <span className="logo-badge">Store</span>
                    </Link>
                    <p className="footer-tagline">
                        A modern e-commerce experience powered by Medusa.js
                    </p>
                </div>

                <div className="footer-links">
                    <div className="footer-column">
                        <h4>Shop</h4>
                        <Link to="/products">All Products</Link>
                    </div>

                    <div className="footer-column">
                        <h4>Support</h4>
                        <a href="https://docs.medusajs.com" target="_blank" rel="noopener noreferrer">
                            Documentation
                        </a>
                        <a href="https://github.com/medusajs/medusa" target="_blank" rel="noopener noreferrer">
                            GitHub
                        </a>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <p>© {new Date().getFullYear()} Medusa Store. Built with ❤️ and React.</p>
            </div>
        </footer>
    );
};
