import { ProductGrid } from "../components/products/ProductGrid";
import { useProducts } from "../hooks/useProducts";
import "./Products.css";

export const Products = () => {
    const { products, isLoading, hasMore, loadMore, totalCount } = useProducts({
        limit: 12,
    });

    return (
        <div className="products-page">
            <div className="products-header">
                <h1>All Products</h1>
                {totalCount > 0 && (
                    <p className="products-count">{totalCount} products</p>
                )}
            </div>

            <ProductGrid
                products={products}
                isLoading={isLoading}
                hasMore={hasMore}
                onLoadMore={loadMore}
            />
        </div>
    );
};
