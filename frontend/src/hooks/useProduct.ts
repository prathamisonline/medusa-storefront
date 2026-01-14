import { useState, useEffect } from "react";
import { HttpTypes } from "@medusajs/types";
import { sdk } from "../lib/sdk";

type UseProductReturn = {
    product: HttpTypes.StoreProduct | null;
    isLoading: boolean;
    error: Error | null;
};

export const useProduct = (productId: string | undefined, regionId?: string): UseProductReturn => {
    const [product, setProduct] = useState<HttpTypes.StoreProduct | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (!productId) {
            setIsLoading(false);
            return;
        }

        const fetchProduct = async () => {
            setIsLoading(true);
            setError(null);

            try {
                // Include region_id to get calculated prices
                const { product: fetchedProduct } = await sdk.store.product.retrieve(
                    productId,
                    regionId ? { region_id: regionId } : undefined
                );
                setProduct(fetchedProduct);
            } catch (err) {
                setError(
                    err instanceof Error ? err : new Error("Failed to fetch product")
                );
            } finally {
                setIsLoading(false);
            }
        };

        fetchProduct();
    }, [productId, regionId]);

    return {
        product,
        isLoading,
        error,
    };
};
