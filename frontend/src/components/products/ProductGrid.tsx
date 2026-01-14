import { HttpTypes } from "@medusajs/types";
import { ProductCard } from "./ProductCard";
import { LoadingSkeleton } from "../ui/Loading";
import { Button } from "../ui/Button";
import "./ProductGrid.css";

interface ProductGridProps {
    products: HttpTypes.StoreProduct[];
    isLoading: boolean;
    hasMore?: boolean;
    onLoadMore?: () => void;
}

export const ProductGrid = ({
    products,
    isLoading,
    hasMore,
    onLoadMore,
}: ProductGridProps) => {
    if (isLoading && products.length === 0) {
        return (
            <div className="product-grid">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="skeleton-card">
                        <LoadingSkeleton variant="image" />
                        <div className="skeleton-content">
                            <LoadingSkeleton variant="text" width="80%" />
                            <LoadingSkeleton variant="text" width="40%" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="empty-state">
                <h3>No products found</h3>
                <p>Check back later for new arrivals!</p>
            </div>
        );
    }

    return (
        <div className="product-grid-container">
            <div className="product-grid">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>

            {hasMore && onLoadMore && (
                <div className="load-more-container">
                    <Button
                        variant="secondary"
                        onClick={onLoadMore}
                        isLoading={isLoading}
                    >
                        Load More Products
                    </Button>
                </div>
            )}
        </div>
    );
};
