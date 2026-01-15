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

export const cartUpdatingAtom = atom<string[]>({
    key: "cartUpdating",
    default: [],
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
    const [updatingItems, setUpdatingItems] = useRecoilState(cartUpdatingAtom);
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
                const { cart: existingCart } = await sdk.store.cart.retrieve(cartId, {
                    fields: "+items.variant,+items.variant.options,+items.variant.product.images,+items.product.images",
                });
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

        // For adding, we don't have a line item ID yet, so we can't be granular
        // We could just rely on the count increasing or something, but usually adding is global loading
        // or we could use a dummy ID like "adding" if we wanted.
        // For now, let's just leave it silent or use a global loading indicator if needed elsewhere.
        // But the previous code used isUpdating global.
        // Let's use a special key for adding to disable checkout or something if we check it.
        // But re-reading the user complaint: it is about flickering when changing quantity.
        // So for add item, we can proceed.
        try {
            const { cart: updatedCart } = await sdk.store.cart.createLineItem(
                cart.id,
                {
                    variant_id: variantId,
                    quantity,
                },
                {},
                {
                    fields: "+items.variant,+items.variant.options,+items.variant.product.images,+items.product.images",
                }
            );
            setCart(updatedCart);
        } catch (error) {
            console.error("Failed to add item to cart:", error);
            throw error;
        }
    };

    const removeItem = async (lineItemId: string) => {
        if (!cart) return;

        setUpdatingItems((prev) => [...prev, lineItemId]);
        try {
            await sdk.store.cart.deleteLineItem(cart.id, lineItemId);
            const { cart: updatedCart } = await sdk.store.cart.retrieve(cart.id, {
                fields: "+items.variant,+items.variant.options,+items.variant.product.images,+items.product.images",
            });
            setCart(updatedCart);
        } catch (error) {
            console.error("Failed to remove item from cart:", error);
            throw error;
        } finally {
            setUpdatingItems((prev) => prev.filter((id) => id !== lineItemId));
        }
    };

    const updateItemQuantity = async (lineItemId: string, quantity: number) => {
        if (!cart) return;

        setUpdatingItems((prev) => [...prev, lineItemId]);
        try {
            const { cart: updatedCart } = await sdk.store.cart.updateLineItem(
                cart.id,
                lineItemId,
                { quantity },
                {},
                {
                    fields: "+items.variant,+items.variant.options,+items.variant.product.images,+items.product.images",
                }
            );
            setCart(updatedCart);
        } catch (error) {
            console.error("Failed to update item quantity:", error);
            throw error;
        } finally {
            setUpdatingItems((prev) => prev.filter((id) => id !== lineItemId));
        }
    };

    const refreshCart = async (regionId: string) => {
        localStorage.removeItem("cart_id");
        setCart(null);
        setIsLoading(true);
        await fetchCart(regionId);
    };

    const isItemUpdating = (itemId: string) => updatingItems.includes(itemId);

    return {
        cart,
        isLoading,
        itemCount,
        fetchCart,
        addItem,
        removeItem,
        updateItemQuantity,
        refreshCart,
        isItemUpdating,
    };
};

// Simple hook to just read cart (for components that don't need actions)
export const useCart = () => {
    const cart = useRecoilValue(cartAtom);
    const isLoading = useRecoilValue(cartLoadingAtom);
    const updatingItems = useRecoilValue(cartUpdatingAtom);
    const itemCount = useRecoilValue(cartItemCountSelector);

    return {
        cart,
        isLoading,
        itemCount,
        isItemUpdating: (itemId: string) => updatingItems.includes(itemId)
    };
};
