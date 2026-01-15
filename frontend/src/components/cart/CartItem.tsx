import { HttpTypes } from "@medusajs/types";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "../ui/Button";
import { Price } from "../ui/Price";
import { useCartState } from "../../store/cartState";
import "./CartItem.css";

interface CartItemProps {
    item: HttpTypes.StoreCartLineItem;
}

export const CartItem = ({ item }: CartItemProps) => {
    const { removeItem, updateItemQuantity, isItemUpdating } = useCartState();
    console.log("CartItem item:", JSON.stringify(item, null, 2));

    const isUpdating = isItemUpdating(item.id);

    const handleRemove = () => {
        removeItem(item.id);
    };

    const handleUpdateQuantity = (newQuantity: number) => {
        if (newQuantity < 1) {
            removeItem(item.id);
        } else {
            updateItemQuantity(item.id, newQuantity);
        }
    };

    const thumbnail = item.thumbnail || "/placeholder-product.png";

    return (
        <div className="cart-item">
            <div className="cart-item-image">
                <img src={thumbnail} alt={item.title || "Product"} />
            </div>

            <div className="cart-item-details">
                <h4 className="cart-item-title">{item.title}</h4>
                {(item.variant_title || item.variant?.title) && (
                    <div className="cart-item-variant-info">
                        {item.variant_title && item.variant_title !== "Default variant" ? (
                            <p className="cart-item-variant">{item.variant_title}</p>
                        ) : item.variant?.title && item.variant.title !== "Default variant" ? (
                            <p className="cart-item-variant">{item.variant.title}</p>
                        ) : item.variant?.options && item.variant.options.length > 0 ? (
                            <p className="cart-item-variant-options">
                                {item.variant.options.map((opt: any) => opt.value).join(" / ")}
                            </p>
                        ) : null}
                    </div>
                )}
                <Price amount={item.unit_price || 0} />
            </div>

            <div className="cart-item-actions">
                <div className="quantity-controls">
                    <button
                        className="quantity-btn"
                        onClick={() => handleUpdateQuantity(item.quantity - 1)}
                        disabled={isUpdating}
                        aria-label="Decrease quantity"
                    >
                        <Minus size={16} />
                    </button>
                    <span className="quantity-value">{item.quantity}</span>
                    <button
                        className="quantity-btn"
                        onClick={() => handleUpdateQuantity(item.quantity + 1)}
                        disabled={isUpdating}
                        aria-label="Increase quantity"
                    >
                        <Plus size={16} />
                    </button>
                </div>

                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRemove}
                    disabled={isUpdating}
                    aria-label="Remove item"
                >
                    <Trash2 size={18} />
                </Button>
            </div>

            <div className="cart-item-total">
                <Price amount={(item.unit_price || 0) * item.quantity} />
            </div>
        </div>
    );
};
