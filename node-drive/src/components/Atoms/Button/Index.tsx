import { ReactNode } from "react";

type props = {
    type?: "success" | "error";
    className?: string;
    onClick: () => void;
    children: ReactNode;
};

const Button = ({ type, className, onClick, children }: props) => {

    

    return (
        <button
            className={`btn-default
                ${(type == "success") ? 'btn-success' : ''}
                ${(type == "error") ? 'btn-error' : ''}

                ${className ?? ""}
            `}
            onClick={onClick}
        >
            {children}
        </button>
    );
}

export default Button;