import { motion } from "framer-motion";
import { ReactNode, useEffect, useLayoutEffect, useRef, useState } from "react";


type props = {
    children: ReactNode;
    show: boolean;
    closeFn: () => void;
    className?: string;
    dismissible?: boolean;
    initialX?: number;
    initialY?: number;
};

const Modal = ({ children, show, closeFn, dismissible, className }: props) => {
    const bgRef = useRef<HTMLDivElement | null>(null);

    const handleOutsideClick = (e: React.MouseEvent) => {
        //console.log(e.target);

        if (e.target == bgRef.current!) {
            closeFn();
        }
    }

    useEffect(() => {
        if (show == false) {
            closeFn();
        }
    }, [show]);

    return (
        <div
            className="absolute z-20 w-screen h-screen bottom-0 top-0 left-0 right-0 bg-gray-900/50 flex justify-center items-center"
            ref={bgRef}
            onClick={(dismissible == true) ? handleOutsideClick : () => { }}
        >
            <motion.div
                className={`flex flex-col relative overflow-auto rounded-lg bg-white shadow max-h-[640px] max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl w-full ${className ?? ""}`}
                transition={{ duration: 0.2 }}
                initial={{ scale: 0.1, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
            >
                {children}
            </motion.div>
        </div>
    );
}

export default Modal;