import { useRegion } from "../../store/regionState";
import "./Price.css";

interface PriceProps {
    amount: number;
    currencyCode?: string;
    className?: string;
    showFrom?: boolean;
}

export const Price = ({
    amount,
    currencyCode,
    className = "",
    showFrom = false,
}: PriceProps) => {
    const { region } = useRegion();

    const currency = currencyCode || region?.currency_code || "usd";

    const formattedPrice = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency.toUpperCase(),
    }).format(amount / 100);

    return (
        <span className={`price ${className}`}>
            {showFrom && <span className="price-from">From </span>}
            {formattedPrice}
        </span>
    );
};
