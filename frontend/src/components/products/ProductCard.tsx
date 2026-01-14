import { Link } from "react-router-dom";
import { HttpTypes } from "@medusajs/types";
import { Card, CardImage, CardContent } from "../ui/Card";
import { Price } from "../ui/Price";
import "./ProductCard.css";

interface ProductCardProps {
    product: HttpTypes.StoreProduct;
}

export const ProductCard = ({ product }: ProductCardProps) => {
    const thumbnail = product.thumbnail || "/placeholder-product.png";

    // Get the lowest price from variants
    const getLowestPrice = () => {
        if (!product.variants || product.variants.length === 0) {
            return null;
        }

        const prices = product.variants
            .flatMap((variant) => variant.calculated_price?.calculated_amount || 0)
            .filter((price) => price > 0);

        if (prices.length === 0) return null;

        return Math.min(...prices);
    };

    const lowestPrice = getLowestPrice();

    return (
        <Link to={`/products/${product.id}`} className="product-card-link">
            <Card hoverable>
                <CardImage src={thumbnail} alt={product.title || "Product"} />
                <CardContent>
                    <h3 className="product-title">{product.title}</h3>
                    {product.subtitle && (
                        <p className="product-subtitle">{product.subtitle}</p>
                    )}
                    {lowestPrice !== null && (
                        <Price amount={lowestPrice} showFrom={!!(product.variants && product.variants.length > 1)} />
                    )}
                </CardContent>
            </Card>
        </Link>
    );
};
