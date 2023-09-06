import { useState } from "react";
import { FileType } from "../../types/File";
import { BsFileEarmarkFill, BsDownload, BsFolderFill, BsFilePdfFill, BsFiletypeDocx, BsFileImageFill, BsFileTextFill, BsFileCodeFill, BsViewList, BsFileZipFill } from "react-icons/bs";
import { Modal } from "flowbite-react";
import AxiosInstance from "../../helpers/AxiosInstance";
import { getFileData } from "../../api/Files";

type props = {
    info: FileType;
    folderPath: {
        path: string;
        setFolderPath: (newPath: string) => void;
    },
    infoToShow: React.Dispatch<React.SetStateAction<FileType | null>>;
    activeFile: FileType | null;
    setShowActions: React.Dispatch<React.SetStateAction<boolean>>;
    showActions: boolean;
}

const File = ({info, folderPath, infoToShow, setShowActions, showActions}: props) => {
    const [activeFile, setActiveFile] = useState<string | null>(null);
    



    const handleOpenFolder = () => {
        if(info.isFile == false) {
            folderPath.setFolderPath(`${folderPath.path}/${info.name}`);
        }
    }

    const handleFile = (fileName: string) => {
        if(info.isFile == true) {
            setActiveFile(fileName);
            setShowActions(!showActions);
        }
    }

    

    return (
        <>  
            <div 
                className="file-card"
                onClick={() => { infoToShow(info);  handleFile(info.name) }}
                onContextMenu={() => { infoToShow(info); }}
                onDoubleClick={handleOpenFolder}
                
            >
                {(info.isFile == false) &&
                    <BsFolderFill className="flex-1 p-1 w-auto fill-yellow-300" />
                }
                {(info.isFile && info.extension == null) == true &&
                    <BsFileEarmarkFill className="flex-1 p-1 w-auto" />
                }

                {(info.isFile == true && info.extension == "pdf") &&
                    <BsFilePdfFill className="flex-1 p-1 w-auto fill-red-500" />
                }

                {(info.isFile == true && info.extension == "docx") &&
                    <BsFiletypeDocx className="flex-1 p-1 w-auto fill-blue-500" />
                }

                {(info.isFile == true && (info.extension == "jpeg" || info.extension == "jpg" || info.extension == "png")) &&
                    <BsFileImageFill className="flex-1 p-1 w-auto fill-blue-200" />
                }

                {(info.isFile == true && info.extension == "txt") &&
                    <BsFileTextFill className="flex-1 p-1 w-auto fill-slate-400" />
                }

                {(info.isFile == true && (info.extension == "c" || info.extension == "cpp" || info.extension == "h" || info.extension == "cs" || info.extension == "php" || info.extension == "ts" || info.extension == "js")) &&
                    <BsFileCodeFill className="flex-1 p-1 w-auto fill-zinc-400" />
                }

                {(info.isFile == true && (info.extension == "rar" || info.extension == "zip" || info.extension == "7z")) &&
                    <BsFileZipFill className="flex-1 p-1 w-auto fill-blue-300" />
                }

                
                <span className="fileName">{info.name}</span>
            </div>
        </>
    );
}

export default File;