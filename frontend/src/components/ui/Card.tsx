import type { ReactNode } from "react";
import "./Card.css";

interface CardProps {
    children: ReactNode;
    className?: string;
    onClick?: () => void;
    hoverable?: boolean;
}

export const Card = ({
    children,
    className = "",
    onClick,
    hoverable = false,
}: CardProps) => {
    return (
        <div
            className={`card ${hoverable ? "card-hoverable" : ""} ${className}`}
            onClick={onClick}
            role={onClick ? "button" : undefined}
            tabIndex={onClick ? 0 : undefined}
        >
            {children}
        </div>
    );
};

interface CardImageProps {
    src: string;
    alt: string;
    aspectRatio?: "square" | "landscape" | "portrait";
}

export const CardImage = ({
    src,
    alt,
    aspectRatio = "square",
}: CardImageProps) => {
    return (
        <div className={`card-image card-image-${aspectRatio}`}>
            <img src={src} alt={alt} loading="lazy" />
        </div>
    );
};

interface CardContentProps {
    children: ReactNode;
    className?: string;
}

export const CardContent = ({ children, className = "" }: CardContentProps) => {
    return <div className={`card-content ${className}`}>{children}</div>;
};
