import { Toast } from "flowbite-react";
import { BsCheck } from "react-icons/bs";


type props = {
    msg: string;
}

const FileUploadToast = ({ msg }: props) => {

    return (
        <Toast className="absolute bottom-1.5 right-1.5 bg-gray-100 border border-solid border-gray-700/80 shadow-lg" duration={200} hidden={false}>
            <div className="w-full flex flex-row gap-1 text-green-500 items-center justify-around">
                <BsCheck className="fill-green-500 w-6 h-auto" />
                {msg}
                <Toast.Toggle className="bg-gray-100 text-red-600 hover:bg-gray-300/60 hover:text-red-700" />
            </div>
        </Toast>
    );
}

export default FileUploadToast;