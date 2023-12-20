import { ReactNode } from "react"

type props = {
    children: ReactNode;
    className?: string;
}

const ModalFooter = ({ children, className }: props) => {
    return (
        <div className={`flex items-center space-x-2 rounded-b p-6 border-gray-200 border-t ${className ?? ""}`}>
            { children }
        </div>
    );
}

export default ModalFooter;