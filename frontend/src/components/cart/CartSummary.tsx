import { useCart } from "../../store/cartState";
import { Price } from "../ui/Price";
import { Button } from "../ui/Button";
import "./CartSummary.css";

export const CartSummary = () => {
    const { cart, itemCount } = useCart();

    if (!cart) return null;

    const subtotal = cart.subtotal || 0;
    const shipping = cart.shipping_total || 0;
    const tax = cart.tax_total || 0;
    const total = cart.total || subtotal;

    return (
        <div className="cart-summary">
            <h3 className="cart-summary-title">Order Summary</h3>

            <div className="cart-summary-rows">
                <div className="summary-row">
                    <span>Subtotal ({itemCount} items)</span>
                    <Price amount={subtotal} />
                </div>

                {shipping > 0 && (
                    <div className="summary-row">
                        <span>Shipping</span>
                        <Price amount={shipping} />
                    </div>
                )}

                {tax > 0 && (
                    <div className="summary-row">
                        <span>Tax</span>
                        <Price amount={tax} />
                    </div>
                )}
            </div>

            <div className="summary-total">
                <span>Total</span>
                <Price amount={total} className="total-price" />
            </div>

            <Button size="lg" className="checkout-btn">
                Proceed to Checkout
            </Button>

            <p className="checkout-note">
                Shipping and taxes calculated at checkout
            </p>
        </div>
    );
};
