import { ReactNode } from "react";
import { GrClose } from "react-icons/gr";

type props = {
    children?: ReactNode;
    className?: string;
    title?: string;
    closeFn: () => void;
}

const ModalHeader = ({ children, className, title, closeFn }: props) => {

    return (
        <div className={`w-full p-5 flex items-center justify-between rounded-t border-solid border-b border-b-gray-200 ${className ?? ""}`}>
            <div className="flex-1">
                {(title != undefined) && <p className="font-bold text-xl text-slate-800">{title}</p>}

                {(title == undefined) &&
                    children
                }
            </div>
            

            <span className="ms-auto flex justify-center items-center p-2 rounded-full cursor-pointer hover:bg-gray-600/10" onClick={closeFn}>
                <GrClose
                    className="w-4 h-4 fill-gray-600" 
                />
            </span>
        </div>
    );
}

export default ModalHeader;