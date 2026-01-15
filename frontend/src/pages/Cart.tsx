import { Link } from "react-router-dom";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Loading } from "../components/ui/Loading";
import { CartItem } from "../components/cart/CartItem";
import { CartSummary } from "../components/cart/CartSummary";
import { useCart } from "../store/cartState";
import "./Cart.css";

export const Cart = () => {
    const { cart, isLoading, itemCount } = useCart();

    if (isLoading) {
        return (
            <div className="cart-loading">
                <Loading size="lg" text="Loading your cart..." />
            </div>
        );
    }

    if (!cart || itemCount === 0) {
        return (
            <div className="cart-empty">
                <div className="empty-icon">
                    <ShoppingBag size={48} />
                </div>
                <h2>Your cart is empty</h2>
                <p>Looks like you haven't added anything to your cart yet.</p>
                <Link to="/products">
                    <Button size="lg">
                        Start Shopping <ArrowRight size={20} />
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="cart-page">
            <h1>Shopping Cart</h1>

            <div className="cart-layout">
                <div className="cart-items">
                    {cart.items?.slice()
                        .sort((a, b) => {
                            const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
                            const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
                            return dateA - dateB;
                        })
                        .map((item) => (
                            <CartItem key={item.id} item={item} />
                        ))}
                </div>

                <aside className="cart-sidebar">
                    <CartSummary />
                </aside>
            </div>
        </div>
    );
};
