import { atom, selector, useRecoilState, useRecoilValue } from "recoil";
import { HttpTypes } from "@medusajs/types";
import { sdk } from "../lib/sdk";

// Atoms
export const cartAtom = atom<HttpTypes.StoreCart | null>({
    key: "cart",
    default: null,
});

export const cartLoadingAtom = atom<boolean>({
    key: "cartLoading",
    default: true,
});

export const cartUpdatingAtom = atom<boolean>({
    key: "cartUpdating",
    default: false,
});

// Selector for item count
export const cartItemCountSelector = selector<number>({
    key: "cartItemCount",
    get: ({ get }) => {
        const cart = get(cartAtom);
        return cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;
    },
});

// Custom hook to manage cart
export const useCartState = () => {
    const [cart, setCart] = useRecoilState(cartAtom);
    const [isLoading, setIsLoading] = useRecoilState(cartLoadingAtom);
    const [isUpdating, setIsUpdating] = useRecoilState(cartUpdatingAtom);
    const itemCount = useRecoilValue(cartItemCountSelector);

    const fetchCart = async (regionId: string) => {
        const cartId = localStorage.getItem("cart_id");

        try {
            if (!cartId) {
                const { cart: newCart } = await sdk.store.cart.create({
                    region_id: regionId,
                });
                localStorage.setItem("cart_id", newCart.id);
                setCart(newCart);
            } else {
                const { cart: existingCart } = await sdk.store.cart.retrieve(cartId);
                setCart(existingCart);
            }
        } catch (error) {
            console.error("Failed to fetch/create cart:", error);
            localStorage.removeItem("cart_id");
            try {
                const { cart: newCart } = await sdk.store.cart.create({
                    region_id: regionId,
                });
                localStorage.setItem("cart_id", newCart.id);
                setCart(newCart);
            } catch (createError) {
                console.error("Failed to create cart:", createError);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const addItem = async (variantId: string, quantity: number) => {
        if (!cart) return;

        setIsUpdating(true);
        try {
            const { cart: updatedCart } = await sdk.store.cart.createLineItem(
                cart.id,
                {
                    variant_id: variantId,
                    quantity,
                }
            );
            setCart(updatedCart);
        } catch (error) {
            console.error("Failed to add item to cart:", error);
            throw error;
        } finally {
            setIsUpdating(false);
        }
    };

    const removeItem = async (lineItemId: string) => {
        if (!cart) return;

        setIsUpdating(true);
        try {
            await sdk.store.cart.deleteLineItem(cart.id, lineItemId);
            const { cart: updatedCart } = await sdk.store.cart.retrieve(cart.id);
            setCart(updatedCart);
        } catch (error) {
            console.error("Failed to remove item from cart:", error);
            throw error;
        } finally {
            setIsUpdating(false);
        }
    };

    const updateItemQuantity = async (lineItemId: string, quantity: number) => {
        if (!cart) return;

        setIsUpdating(true);
        try {
            const { cart: updatedCart } = await sdk.store.cart.updateLineItem(
                cart.id,
                lineItemId,
                { quantity }
            );
            setCart(updatedCart);
        } catch (error) {
            console.error("Failed to update item quantity:", error);
            throw error;
        } finally {
            setIsUpdating(false);
        }
    };

    const refreshCart = async (regionId: string) => {
        localStorage.removeItem("cart_id");
        setCart(null);
        setIsLoading(true);
        await fetchCart(regionId);
    };

    return {
        cart,
        isLoading,
        isUpdating,
        itemCount,
        fetchCart,
        addItem,
        removeItem,
        updateItemQuantity,
        refreshCart,
    };
};

// Simple hook to just read cart (for components that don't need actions)
export const useCart = () => {
    const cart = useRecoilValue(cartAtom);
    const isLoading = useRecoilValue(cartLoadingAtom);
    const isUpdating = useRecoilValue(cartUpdatingAtom);
    const itemCount = useRecoilValue(cartItemCountSelector);

    return { cart, isLoading, isUpdating, itemCount };
};
