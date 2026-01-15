import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { useSetRecoilState, useRecoilValue } from "recoil";
import { regionsAtom, selectedRegionIdAtom, regionLoadingAtom, selectedRegionSelector } from "../store/regionState";
import { cartAtom, cartLoadingAtom } from "../store/cartState";
import { sdk } from "../lib/sdk";

interface StateInitializerProps {
    children: ReactNode;
}

// Component to initialize Recoil state on app load
export function StateInitializer({ children }: StateInitializerProps) {
    const setRegions = useSetRecoilState(regionsAtom);
    const setSelectedRegionId = useSetRecoilState(selectedRegionIdAtom);
    const setRegionLoading = useSetRecoilState(regionLoadingAtom);
    const setCart = useSetRecoilState(cartAtom);
    const setCartLoading = useSetRecoilState(cartLoadingAtom);
    const region = useRecoilValue(selectedRegionSelector);

    const initialized = useRef(false);

    useEffect(() => {
        if (initialized.current) return;
        initialized.current = true;

        async function init() {
            try {
                // Fetch regions
                const { regions: fetchedRegions } = await sdk.store.region.list();
                setRegions(fetchedRegions);

                const savedRegionId = localStorage.getItem("region_id");
                const savedRegion = fetchedRegions.find((r) => r.id === savedRegionId);

                if (savedRegion) {
                    setSelectedRegionId(savedRegion.id);
                } else if (fetchedRegions.length > 0) {
                    setSelectedRegionId(fetchedRegions[0].id);
                    localStorage.setItem("region_id", fetchedRegions[0].id);
                }
            } catch (error) {
                console.error("Failed to fetch regions:", error);
            } finally {
                setRegionLoading(false);
            }
        }

        init();
    }, [setRegions, setSelectedRegionId, setRegionLoading]);

    // Separate effect for cart
    useEffect(() => {
        if (!region?.id) return;

        async function initCart() {
            const cartId = localStorage.getItem("cart_id");

            try {
                if (!region) return;

                if (!cartId) {
                    const { cart: newCart } = await sdk.store.cart.create({
                        region_id: region.id,
                    });
                    localStorage.setItem("cart_id", newCart.id);
                    setCart(newCart);
                } else {
                    try {
                        const { cart: existingCart } = await sdk.store.cart.retrieve(cartId);
                        setCart(existingCart);
                    } catch {
                        // Cart not found, create new one
                        localStorage.removeItem("cart_id");
                        const { cart: newCart } = await sdk.store.cart.create({
                            region_id: region.id,
                        });
                        localStorage.setItem("cart_id", newCart.id);
                        setCart(newCart);
                    }
                }
            } catch (error) {
                console.error("Failed to initialize cart:", error);
            } finally {
                setCartLoading(false);
            }
        }

        initCart();
    }, [region?.id, setCart, setCartLoading]);

    return <>{children}</>;
}
