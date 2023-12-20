import { Toast } from "flowbite-react";
import { BsCheck, BsExclamation, BsExclamationDiamondFill, BsSignIntersectionFill } from "react-icons/bs";


type props = {
    msg: string;
    msgType: "error" | "info" | "warning" | "success";
    setShowToast: React.Dispatch<React.SetStateAction<boolean>>;
}

const FileUploadToast = ({ msg, msgType, setShowToast }: props) => {

    setTimeout(() => {
        setShowToast(false);
    }, 2500);

    return (
        <Toast className={`absolute bottom-1.5 right-1.5 cursor-default bg-gray-100 border border-solid border-gray-700/80 shadow-lg`} duration={200} hidden={false}>
            <div className={`w-full max-w-full flex flex-row gap-1 items-center justify-around` + 
                (msgType == "error" ? "text-red-600 hover:text-red-700" : "") +
                (msgType == "info" ? "text-slate-700 hover:text-slate-800" : "") +
                (msgType == "warning" ? "text-yellow-500 hover:text-yellow-600" : "") +
                (msgType == "success" ? "text-green-600 hover:text-green-700" : "")
            }>
                { (msgType == "error") &&
                    <BsExclamation className={`fill-red-600 w-6 h-auto`} />
                }
                { (msgType == "warning") &&
                    <BsExclamationDiamondFill className={`fill-yellow-500 w-6 h-auto`} />
                }
                { (msgType == "info") &&
                    <BsSignIntersectionFill  className={`fill-blue-600 w-6 h-auto`} />
                }
                { (msgType == "success") &&
                    <BsCheck className={`fill-green-500 w-6 h-auto`} />
                }
                
                <p className="flex-1 truncate">
                    {msg}
                </p>

                <Toast.Toggle onClick={() => { setShowToast(false); }} 
                    className={ `bg-gray-100 w-8 cursor-pointer text-red-600 hover:text-red-700 hover:bg-gray-300/60`} 
                />
            </div>
        </Toast>
    );
}

export default FileUploadToast;