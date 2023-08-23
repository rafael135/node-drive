import { useState } from "react";
import { FileType } from "../../types/File";
import { BsFileEarmarkFill, BsDownload, BsFolderFill } from "react-icons/bs";
import { Modal } from "flowbite-react";
import AxiosInstance from "../../helpers/AxiosInstance";

type props = {
    info: FileType;
    folderPath: {
        path: string;
        setFolderPath: (newPath: string) => void;
    }
}

const File = ({info, folderPath}: props) => {
    const [show, setShow] = useState<boolean>(false);

    const handleOpenFolder = () => {
        if(info.isFile == false) {
            folderPath.setFolderPath(`${folderPath.path}/${info.name}`);
        }
    }

    const handleFile = () => {
        if(info.isFile == true) {
            setShow(!show);
        }
    }

    const handleDownload = async () => {
        if(info.isFile == true) {
            AxiosInstance.post("/user/files/download", {
                path: info.location
            }, {
                responseType: "blob"
            })
            .then((res) => {
                const href = window.URL.createObjectURL(res.data);

                const anchorElement = document.createElement("a");

                anchorElement.href = href;
                
                anchorElement.download = `${info.name}${(info.extension == null) ? ".txt" : ""}`;

                document.body.appendChild(anchorElement);
                anchorElement.click();

                document.body.removeChild(anchorElement);
                window.URL.revokeObjectURL(href);
            })
            .catch(() => {
                
            });
        }
    }

    return (
        <>
            {(info.isFile == true) &&
                <Modal dismissible={true} show={show === true} onClose={() => { setShow(false); }} >
                    <Modal.Body className="flex flex-col gap-2">
                        <span className="text-slate-800"><strong>Nome:</strong> {info.name}</span>
                        <span className="text-slate-800"><strong>Extensão:</strong> {(info.extension != null) ? info.extension : "N/t"}</span>
                    </Modal.Body>

                    <Modal.Footer>
                        <button onClick={handleDownload} className="px-4 py-1 flex gap-1.5 items-center text-lg text-white bg-blue-500 transition-all ease-in-out duration-150 rounded-lg group hover:bg-blue-600">
                            <BsDownload className="fill-white group-hover:scale-105" />
                            Download
                        </button>
                    </Modal.Footer>
                </Modal>
            }
            

            <div 
                className="w-32 h-32 max-w-[8rem] flex flex-col border border-solid border-gray-300 cursor-pointer transition-all ease-in-out duration-100 hover:bg-gray-400/50"
                onClick={handleFile}
                onDoubleClick={handleOpenFolder}
            >
                {(info.isFile == false) &&
                    <BsFolderFill className="flex-1 p-1 w-auto fill-yellow-300" />
                }
                {(info.isFile) == true &&
                    <BsFileEarmarkFill className="flex-1 p-1 w-auto" />
                }
                <span className="text-slate-800 font-medium py-1.5 text-center">{info.name}</span>
            </div>
        </>
    );
}

export default File;