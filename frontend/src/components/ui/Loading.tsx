import "./Loading.css";

interface LoadingProps {
    size?: "sm" | "md" | "lg";
    text?: string;
}

export const Loading = ({ size = "md", text }: LoadingProps) => {
    return (
        <div className="loading-container">
            <div className={`loading-spinner loading-${size}`} />
            {text && <p className="loading-text">{text}</p>}
        </div>
    );
};

interface LoadingSkeletonProps {
    variant?: "text" | "image" | "card";
    width?: string;
    height?: string;
}

export const LoadingSkeleton = ({
    variant = "text",
    width,
    height,
}: LoadingSkeletonProps) => {
    const style = {
        width: width,
        height: height,
    };

    return (
        <div
            className={`loading-skeleton loading-skeleton-${variant}`}
            style={style}
        />
    );
};
