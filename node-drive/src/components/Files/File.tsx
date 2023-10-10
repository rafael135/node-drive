import { useEffect, useRef, useState } from "react";
import { FileType } from "../../types/File";
import { BsFileEarmarkFill, BsDownload, BsFolderFill, BsFilePdfFill, BsFiletypeDocx, BsFileImageFill, BsFileTextFill, BsFileCodeFill, BsViewList, BsFileZipFill } from "react-icons/bs";
import { Modal } from "flowbite-react";
import AxiosInstance from "../../helpers/AxiosInstance";
import { getFileData } from "../../api/Files";

type props = {
    info: FileType;
    renamingFileIdx: number | null;
    setRenamingFilesIdx: React.Dispatch<React.SetStateAction<number | null>>;
    renameFile: (idx: number, newTxt: string) => void;
    doneRenamingFile: (idx: number) => void;
    fileIndex: number;
    setFileChecked: (idx: number, currentValue: boolean) => void;
    folderPath: {
        path: string;
        setFolderPath: (newPath: string) => void;
    },
    infoToShow: React.Dispatch<React.SetStateAction<FileType | null>>;
    activeFile: FileType | null;
    setShowActions: React.Dispatch<React.SetStateAction<boolean>>;
    showActions: boolean;
}

const File = ({info, renamingFileIdx, setRenamingFilesIdx, renameFile, doneRenamingFile, fileIndex, setFileChecked, folderPath, infoToShow, setShowActions, showActions}: props) => {
    const [activeFile, setActiveFile] = useState<string | null>(null);
    
    const fileNameRef = useRef<HTMLSpanElement | null>(null);


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

    const handleOpenFile = (e: React.MouseEvent) => {
        if(renamingFileIdx != null) {
            return;
        }
        infoToShow(info);
        handleFile(info.name);
    }

    const handleFileCheck = (e: React.ChangeEvent) => {
        setFileChecked(fileIndex, info.selected!);
    }

    const handleRenamingFile = (e: React.FormEvent) => {
        renameFile(fileIndex, (e.target as HTMLSpanElement).textContent!);
    }

    const handleDoneRenaming = (e: React.KeyboardEvent) => {
        if(e.key == "ArrowDown" || e.key == "ArrowLeft" || e.key == "ArrowRight" || e.key == "ArrowUp" || e.key == "End" || e.key == "Home" || e.key == "PageDown" || e.key == "PageUp") {
            return;
        }

        if(e.key == "Enter") {
            e.preventDefault();
            doneRenamingFile(fileIndex);
            setRenamingFilesIdx(null);
            return;
        }

        renameFile(fileIndex, (e.target as HTMLSpanElement).innerText!);
    }

    useEffect(() => {
        if(renamingFileIdx != null) {
            //const doneRenaming = () => { setRenamingFilesIdx(null); }
            if(renamingFileIdx == fileIndex) {
                fileNameRef.current!.focus();
                fileNameRef.current!.inputMode = "text";
            }
            
        }
    }, [renamingFileIdx]);

    return (
        <>  
            <div 
                className="file-card"
                
            >

                <div
                    className="file-interact"
                    onClick={(e) => { handleOpenFile(e); }}
                    onContextMenu={() => { infoToShow(info); }}
                    onDoubleClick={ (e) => { e.preventDefault(); handleOpenFolder(); }}
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

                    
                    <span
                        className="fileName"
                        ref={fileNameRef}
                        contentEditable={(renamingFileIdx != null) ? true : false}
                        onChange={(e) => { handleRenamingFile(e); }}
                        onKeyDown={(e) => { handleDoneRenaming(e); }}
                        suppressContentEditableWarning={true}
                    >
                        {info.name}
                    </span>
                </div>
                
                

                {(info.isFile == true) &&
                    <input type="checkbox" title="selected" className="file-checkBox" checked={info.selected!} onChange={(e) => { handleFileCheck(e); }} />
                }
            </div>
        </>
    );
}

export default File;