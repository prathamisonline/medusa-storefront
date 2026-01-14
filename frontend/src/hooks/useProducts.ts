import { useState, useEffect, useCallback } from "react";
import { HttpTypes } from "@medusajs/types";
import { sdk } from "../lib/sdk";

type UseProductsOptions = {
    limit?: number;
    initialOffset?: number;
};

type UseProductsReturn = {
    products: HttpTypes.StoreProduct[];
    isLoading: boolean;
    error: Error | null;
    hasMore: boolean;
    loadMore: () => void;
    totalCount: number;
};

export const useProducts = (
    options: UseProductsOptions = {}
): UseProductsReturn => {
    const { limit = 12, initialOffset = 0 } = options;

    const [products, setProducts] = useState<HttpTypes.StoreProduct[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [offset, setOffset] = useState(initialOffset);
    const [totalCount, setTotalCount] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    const fetchProducts = useCallback(
        async (currentOffset: number, reset = false) => {
            setIsLoading(true);
            setError(null);

            try {
                const { products: fetchedProducts, count } =
                    await sdk.store.product.list({
                        limit,
                        offset: currentOffset,
                    });

                setProducts((prev) => {
                    if (reset || currentOffset === 0) {
                        return fetchedProducts;
                    }
                    return [...prev, ...fetchedProducts];
                });

                setTotalCount(count || 0);
                setHasMore((count || 0) > currentOffset + fetchedProducts.length);
            } catch (err) {
                setError(err instanceof Error ? err : new Error("Failed to fetch products"));
            } finally {
                setIsLoading(false);
            }
        },
        [limit]
    );

    useEffect(() => {
        fetchProducts(initialOffset, true);
    }, [fetchProducts, initialOffset]);

    const loadMore = useCallback(() => {
        if (isLoading || !hasMore) return;
        const newOffset = offset + limit;
        setOffset(newOffset);
        fetchProducts(newOffset);
    }, [isLoading, hasMore, offset, limit, fetchProducts]);

    return {
        products,
        isLoading,
        error,
        hasMore,
        loadMore,
        totalCount,
    };
};
