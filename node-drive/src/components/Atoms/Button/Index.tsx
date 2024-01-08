import { ReactNode } from "react";

type props = {
    type?: "success" | "error";
    className?: string;
    title?: string;
    disabled?: boolean;
    onClick: () => void;
    children: ReactNode;
};

const Button = ({ type, title, className, disabled, onClick, children }: props) => {

    
    return (
        <button
            className={`btn-default
                ${(type == "success") ? "btn-success" : ""}
                ${(type == "error") ? "btn-error" : ""}
                ${(disabled == true) ? "btn-disabled" : ""}

                ${className ?? ""}
            `}
            onClick={onClick}

            title={title}
            disabled={(disabled == true) ? true : false}
        >
            {children}
        </button>
    );
}

export default Button;