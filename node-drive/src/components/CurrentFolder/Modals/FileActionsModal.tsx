import { useContext, useEffect, useRef, useState } from "react";
import { Modal, Tooltip } from "flowbite-react";
import { BsDownload, BsFileLockFill, BsTrashFill, BsUnlockFill, BsViewList } from "react-icons/bs";
import { TfiLock, TfiUnlock } from "react-icons/tfi";
import { FileType } from "../../../types/File";
import { getPublicDownloadLink, makeFilePublic } from "../../../api/Files";
import { FolderPath } from "../CurrentFolder";
import { UserAuthContext } from "../../../contexts/UserContext";

type props = {
    showActions: boolean;
    setShowActions: React.Dispatch<React.SetStateAction<boolean>>;
    activeFile: FileType | null;
    setActiveFile: React.Dispatch<React.SetStateAction<FileType | null>>;
    files: FileType[];
    setFiles: React.Dispatch<React.SetStateAction<FileType[]>>;
    pathInfo: FolderPath;
    handleDownload: () => void;
    handleVisualize: () => void;
    handleDelete: () => void;
};

const FileActionsModal = ({ showActions, setShowActions, activeFile, setActiveFile, files, setFiles, pathInfo, handleDownload, handleVisualize, handleDelete }: props) => {
    const userCtx = useContext(UserAuthContext)!;

    const [fileDownloadLink, setFileDownloadLink] = useState<string>("");

    const pbLinkInputRef = useRef<HTMLInputElement | null>(null);
    const [pbLinkTooltipContent, setPbLinkTooltipContent] = useState<"Clique para copiar" | "Link copiado!">("Clique para copiar");

    const btnChangeFileVisibility = async () => {
        let idx = files.indexOf(activeFile!);

        let res = await makeFilePublic(pathInfo, activeFile!.name);

        let filesCopy = files;

        if(res == null) {
            setActiveFile(null);
            return;
        }

        let activeFileCopy = activeFile;

        filesCopy[idx].isPublic = res; // false => Privado | true => Publico
        activeFileCopy!.isPublic = res;

        setFiles([...filesCopy]);
        setActiveFile(activeFileCopy);

        if(res == true) {
            
        } else {
            setFileDownloadLink("");
        }

        handleFileUrl();
    }

    const handleFileUrl = async () => {
        if(activeFile!.isPublic == false) {
            setFileDownloadLink("");
            return;
        }

        let url = getPublicDownloadLink(pathInfo, activeFile!.name, userCtx.user!.id);

        url.then((res) => {
            if(res != null) {
                setFileDownloadLink(res);
            }
        });
    }

    const handleCopyUrl = (e: React.MouseEvent) => {
        if(activeFile!.isPublic == false) {
            return;
        }

        //pbLinkInputRef.current!.select();
        //pbLinkInputRef.current!.setSelectionRange(0, 9999);

        navigator.clipboard.writeText(pbLinkInputRef.current!.value);

        setPbLinkTooltipContent("Link copiado!");

        setTimeout(() => {
            setPbLinkTooltipContent("Clique para copiar");
        }, 1500);
    }

    useEffect(() => {
        if(activeFile != null) {
            handleFileUrl();
        }
    }, [activeFile]);

    return (
        <Modal dismissible={true} show={showActions === true} onClose={() => { setShowActions(false); }} className="selectedFileModal" >
                    <Modal.Body className="selectedFileModal-body">
                        <div className="flex flex-row gap-2 items-center">
                            <label htmlFor="fileName" className="text-slate-800 text-lg"><strong>Nome do arquivo:</strong></label>
                            <input id="fileName" type="text" className="flex-1 text-slate-900" readOnly={true} defaultValue={activeFile!.name} />
                        </div>
                        
                        <div className="flex flex-row gap-2 py-2 border-solid border-t border-b border-t-gray-500/40 border-b-gray-500/40">
                            <span className="flex-1 text-slate-800 text-lg"><strong>Extensão:</strong> {(activeFile!.extension != null) ? `.${activeFile!.extension}` : "N/t"}</span>
                            <span className="flex-1 text-slate-800 text-lg"><strong>Tamanho:</strong> {activeFile!.size}</span>
                        </div>

                        <div className="flex flex-row gap-1 items-center">
                            <strong>Visibilidade:</strong> 
                            {(activeFile!.isPublic == true) ? "Público" : "Privado"}
                            {(activeFile!.isPublic == true) ? <TfiUnlock className="w-5 h-5 text-blue-600" /> : <TfiLock className="w-5 h-5 text-red-600" />}
                        </div>

                        <div className="customPbLinkTooltip flex flex-row gap-1">
                            <Tooltip
                                placement="top"
                                style="light"
                                content={pbLinkTooltipContent}
                                onMouseOver={(e) => { if(activeFile!.isPublic == false) { e.preventDefault(); } }}
                                className="w-auto"
                                hidden={(fileDownloadLink == "") ? true : false}
                            >
                                <input
                                    className="w-full"
                                    type="text"
                                    value={fileDownloadLink}
                                    readOnly={true}
                                    disabled={(activeFile!.isPublic == false)}
                                    ref={pbLinkInputRef}
                                    onClick={handleCopyUrl}
                                    hidden={(fileDownloadLink == "") ? true : false}
                                />
                            </Tooltip>
                            <button
                                className={`text-white px-4 py-2 rounded-md ${(activeFile!.isPublic == true) ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"}`}
                                onClick={btnChangeFileVisibility}
                                
                            >
                                {(activeFile!.isPublic == true) ? "Privar" : "Compartilhar"}
                            </button>
                        </div>
                        
                    </Modal.Body>

                    <Modal.Footer className="selectedFileModal-footer">
                        <button onClick={handleDownload} className="btn-action group">
                            <BsDownload className="fill-white group-hover:scale-105" />
                            Download
                        </button>

                        <button onClick={handleVisualize} className="btn-action group">
                            <BsViewList className="fill-white group-hover:scale-105" />
                            Visualizar
                        </button>

                        <button onClick={handleDelete} className="btn-action group">
                            <BsTrashFill className="fill-white group-hover:scale-105" />
                            Deletar
                        </button>
                    </Modal.Footer>
                </Modal>
    );
}

export default FileActionsModal;