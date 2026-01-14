import { Link } from "react-router-dom";
import { ArrowRight, ShoppingBag, Truck, Shield } from "lucide-react";
import { Button } from "../components/ui/Button";
import { ProductGrid } from "../components/products/ProductGrid";
import { useProducts } from "../hooks/useProducts";
import "./Home.css";

export const Home = () => {
    const { products, isLoading } = useProducts({ limit: 4 });

    return (
        <div className="home">
            {/* Hero Section */}
            <section className="hero">
                <div className="hero-content">
                    <span className="hero-badge">New Collection 2026</span>
                    <h1 className="hero-title">
                        Discover Your
                        <span className="gradient-text"> Perfect Style</span>
                    </h1>
                    <p className="hero-subtitle">
                        Explore our curated collection of premium products designed for the
                        modern lifestyle. Quality meets elegance.
                    </p>
                    <div className="hero-actions">
                        <Link to="/products">
                            <Button size="lg">
                                Shop Now <ArrowRight size={20} />
                            </Button>
                        </Link>
                    </div>
                </div>
                <div className="hero-visual">
                    <div className="hero-shape hero-shape-1"></div>
                    <div className="hero-shape hero-shape-2"></div>
                    <div className="hero-shape hero-shape-3"></div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features">
                <div className="feature">
                    <div className="feature-icon">
                        <Truck size={24} />
                    </div>
                    <h3>Free Shipping</h3>
                    <p>On orders over $50</p>
                </div>
                <div className="feature">
                    <div className="feature-icon">
                        <Shield size={24} />
                    </div>
                    <h3>Secure Payment</h3>
                    <p>100% secure checkout</p>
                </div>
                <div className="feature">
                    <div className="feature-icon">
                        <ShoppingBag size={24} />
                    </div>
                    <h3>Easy Returns</h3>
                    <p>30-day return policy</p>
                </div>
            </section>

            {/* Featured Products Section */}
            <section className="featured-products">
                <div className="section-header">
                    <h2>Featured Products</h2>
                    <Link to="/products" className="view-all">
                        View All <ArrowRight size={16} />
                    </Link>
                </div>
                <ProductGrid products={products} isLoading={isLoading} />
            </section>
        </div>
    );
};
