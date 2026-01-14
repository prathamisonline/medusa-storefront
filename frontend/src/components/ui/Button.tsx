import type { ButtonHTMLAttributes, ReactNode } from "react";
import "./Button.css";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "ghost";
    size?: "sm" | "md" | "lg";
    isLoading?: boolean;
    children: ReactNode;
}

export const Button = ({
    variant = "primary",
    size = "md",
    isLoading = false,
    children,
    disabled,
    className = "",
    ...props
}: ButtonProps) => {
    return (
        <button
            className={`btn btn-${variant} btn-${size} ${className}`}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <span className="btn-spinner" />
            ) : (
                children
            )}
        </button>
    );
};
