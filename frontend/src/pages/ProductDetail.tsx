import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Minus, Plus, Check } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Price } from "../components/ui/Price";
import { Loading } from "../components/ui/Loading";
import { useProduct } from "../hooks/useProduct";
import { useCartState } from "../store/cartState";
import { useRegion } from "../store/regionState";
import "./ProductDetail.css";

export const ProductDetail = () => {
    const { id } = useParams<{ id: string }>();
    const { region } = useRegion();
    const { product, isLoading, error } = useProduct(id, region?.id);
    const { addItem } = useCartState();

    const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [isAdded, setIsAdded] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    if (isLoading) {
        return (
            <div className="product-detail-loading">
                <Loading size="lg" text="Loading product..." />
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="product-detail-error">
                <h2>Product not found</h2>
                <p>The product you're looking for doesn't exist.</p>
                <Link to="/products">
                    <Button>
                        <ArrowLeft size={20} /> Back to Products
                    </Button>
                </Link>
            </div>
        );
    }

    const variants = product.variants || [];
    const selectedVariant = variants[selectedVariantIndex];
    const images = product.images || [];
    const mainImage = images[activeImageIndex]?.url || product.thumbnail || "/placeholder-product.png";

    // Get price from variant - check multiple possible locations
    const getVariantPrice = () => {
        if (!selectedVariant) return 0;

        // Try calculated_price first (pricing context)
        if (selectedVariant.calculated_price?.calculated_amount) {
            return selectedVariant.calculated_price.calculated_amount;
        }

        // Fallback to prices array if available
        const pricesArray = (selectedVariant as unknown as { prices?: Array<{ amount: number }> }).prices;
        if (pricesArray && pricesArray.length > 0) {
            return pricesArray[0].amount;
        }

        return 0;
    };

    const price = getVariantPrice();

    const handleAddToCart = async () => {
        if (!selectedVariant) {
            alert("Please select a variant");
            return;
        }

        setIsAdding(true);
        try {
            await addItem(selectedVariant.id, quantity);
            setIsAdded(true);
            setTimeout(() => setIsAdded(false), 2000);
        } catch (error: any) {
            console.error("Failed to add to cart:", error);
            alert("Failed to add to cart: " + (error.message || "Unknown error"));
        } finally {
            setIsAdding(false);
        }
    };

    const updateQuantity = (delta: number) => {
        setQuantity((prev) => Math.max(1, prev + delta));
    };

    return (
        <div className="product-detail">
            <Link to="/products" className="back-link">
                <ArrowLeft size={20} /> Back to Products
            </Link>

            <div className="product-detail-grid">
                {/* Image Gallery */}
                <div className="product-gallery">
                    <div className="main-image">
                        <img src={mainImage} alt={product.title || "Product"} />
                    </div>
                    {images.length > 1 && (
                        <div className="image-thumbnails">
                            {images.slice(0, 4).map((image, index) => (
                                <div
                                    key={image.id || index}
                                    className={`thumbnail ${activeImageIndex === index ? "active" : ""}`}
                                    onClick={() => setActiveImageIndex(index)}
                                >
                                    <img src={image.url} alt={`${product.title} ${index + 1}`} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div className="product-info">
                    <h1 className="product-title">{product.title}</h1>

                    {product.subtitle && (
                        <p className="product-subtitle">{product.subtitle}</p>
                    )}

                    <div className="product-price">
                        <Price amount={price} />
                    </div>

                    {product.description && (
                        <p className="product-description">{product.description}</p>
                    )}

                    {/* Variant Selection */}
                    {variants.length > 1 && (
                        <div className="variant-selector">
                            <label>Select Variant:</label>
                            <div className="variant-options">
                                {variants.map((variant, index) => (
                                    <button
                                        key={variant.id}
                                        className={`variant-option ${selectedVariantIndex === index ? "selected" : ""
                                            }`}
                                        onClick={() => setSelectedVariantIndex(index)}
                                    >
                                        {variant.title}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Quantity Selector */}
                    <div className="quantity-selector">
                        <label>Quantity:</label>
                        <div className="quantity-controls">
                            <button
                                className="quantity-btn"
                                onClick={() => updateQuantity(-1)}
                                disabled={quantity <= 1}
                            >
                                <Minus size={16} />
                            </button>
                            <span className="quantity-value">{quantity}</span>
                            <button
                                className="quantity-btn"
                                onClick={() => updateQuantity(1)}
                            >
                                <Plus size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Add to Cart Button */}
                    <Button
                        size="lg"
                        onClick={handleAddToCart}
                        isLoading={isAdding}
                        className={`add-to-cart-btn ${isAdded ? "added" : ""}`}
                    >
                        {isAdded ? (
                            <>
                                <Check size={20} /> Added to Cart
                            </>
                        ) : (
                            "Add to Cart"
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
};
