import { useState, useEffect, useRef } from "react";
import { FileType } from "../../types/File";
import File from "../Files/File";
import { FolderPath } from "./CurrentFolder";
import ContextMenu from "./ContextMenu";
import { Button, Label, Modal, TextInput } from "flowbite-react";
import { BsDownload, BsTrashFill, BsViewList } from "react-icons/bs";
import { createNewFolder, deleteFile, downloadFile, getFileData, makeFilePublic, renameFile } from "../../api/Files";
import { getRealPath, sleep } from "../../helpers/PathOps";


type props = {
    files: FileType[];
    setFiles: React.Dispatch<React.SetStateAction<FileType[]>>;
    pathInfo: FolderPath;
    setShowAddModal: React.Dispatch<React.SetStateAction<boolean>>;
    activeFile: FileType | null;
    setActiveFile: React.Dispatch<React.SetStateAction<FileType | null>>;
    //showToast: boolean;
    setToastMsgType: React.Dispatch<React.SetStateAction<"error" | "info" | "warning" | "success">>;
    setToastMsg: React.Dispatch<React.SetStateAction<string>>;
    setShowToast: React.Dispatch<React.SetStateAction<boolean>>;
    getFiles: () => Promise<void>;
}

const FilesContainer = ({ files, setFiles, pathInfo, setShowAddModal, activeFile, setActiveFile, setToastMsgType, setToastMsg, setShowToast, getFiles }: props) => {

    const [showContextMenu, setShowContextMenu] = useState<boolean>(false);
    const [mousePoint, setMousePoint] = useState({ x: 0, y: 0 });

    const [showActions, setShowActions] = useState<boolean>(false);

    const [fileData, setFileData] = useState<string | null>(null);
    const [showFileData, setShowFileData] = useState<boolean>(false);

    const [showNewFolderModal, SetShowNewFolderModal] = useState<boolean>(false);
    const [newFolderName, setNewFolderName] = useState<string>("");
    const newFolderFormRef = useRef(null);

    const [renamingFileIdx, setRenamingFilesIdx] = useState<number | null>(null);
    const [fileDefaultName, setFileDefaultName] = useState<string>("");
    const [isRenaming, setIsRenaming] = useState<boolean>(false);


    const [showMakePublicModal, setShowMakePublicModal] = useState<boolean>(false);

    const filesMainContainerRef = useRef<HTMLDivElement | null>(null);


    const openContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        if(activeFile != null) {
            
        }

        setMousePoint({ x: e.pageY, y: e.pageX });
        setShowContextMenu(true);
    }

    

    const handleVisualize = async () => {
        if(renamingFileIdx != null) {
            return;
        }

        setShowActions(false);
        setShowFileData(true);

        //console.log(path);

        let data = await getFileData(`${getRealPath(pathInfo)}${activeFile!.name}`);

        if(data != false) {
            setFileData(data);
        } else {
            setFileData("Não há nenhum texto para ser exibido")
        }
    }

    const handleMakePublicFile = async () => {
        await makeFilePublic(pathInfo, activeFile!.name);
        setActiveFile(null);
    }

    const contextMenuSelected = (fnNumber: number, fileIdx?: number) => {
        if(fnNumber == 1) {
            setShowAddModal(true);
        } else if(fnNumber == 2) {
            setShowActions(true);
        } else if(fnNumber == 3) {
            SetShowNewFolderModal(true);
        } else if(fnNumber == 4) {
            handleMakePublicFile();
        } else if(fnNumber == 5) {
            //console.log(files[fileIdx!].name!);
            setRenamingFilesIdx(fileIdx!);
            setFileDefaultName(files[fileIdx!].name);
        } else if(fnNumber == 9) {
            
        }
    }

    const handleNewFolder = async () => {
        let result = await createNewFolder(pathInfo.path, newFolderName);

        if(result == true) {
            setToastMsgType("success");
            setToastMsg(`Pasta ${newFolderName} criada com sucesso!`);
            setShowToast(true);

            SetShowNewFolderModal(false);
            setNewFolderName("");

            getFiles();
        } else {
            await getFiles();

            setToastMsgType("error");
            setToastMsg(`Não foi possível criar a pasta "${newFolderName}"!`);
            setShowToast(true);

            SetShowNewFolderModal(false);
            setNewFolderName("");
        }
    }

    const handleDownload = () => {
        if(activeFile != null) {
            downloadFile(pathInfo, activeFile);
        }
    }

    const handleDelete = async () => {
        if(activeFile == null) {
            return;
        }

        let res = await deleteFile(activeFile.location);

        if(res == true) {
            setToastMsgType("success");
            setToastMsg(`Arquivo "${activeFile.name}" deletado com sucesso!`);
        } else {
            setToastMsgType("error");
            setToastMsg(`Não foi possível deletar "${activeFile.name}"!`);
        }

        setShowActions(false);
        getFiles();
        setShowToast(true);
    }

    const handleFileCheckBtn = (idx: number, currentValue: boolean) => {
        let filesCopy = files;

        filesCopy[idx].selected = !currentValue;

        setFiles([...filesCopy]);
    }

    // Função para salvar alterações do novo nome do arquivo
    const doneRenamingFile = async (newTxt: string) => {
        let file = files[renamingFileIdx!];

        let res = await renameFile(pathInfo, fileDefaultName, {
            newName: newTxt,
            isFile: file.isFile
        });

        if(res == true) {
            setToastMsgType("success");
            setToastMsg("Arquivo renomeado!");
            setShowToast(true);
        } else {
            setToastMsgType("error");
            setToastMsg("Não foi possível renomear o arquivo!");
            setShowToast(true);
        }

        await getFiles();

        setFileDefaultName("");
        setRenamingFilesIdx(null);
        setIsRenaming(false);
    }


    useEffect(() => {
        const handleClick = () => { setShowContextMenu(false); };
        window.addEventListener("click", handleClick);

        if(showContextMenu == false && showActions == false && showFileData == false) {
            setActiveFile(null);
            setFileData(null);
        }

        return () => { window.removeEventListener("click", handleClick); };
    }, [showContextMenu]);

    

    return (
        <>
            { (showContextMenu == true) && 
                <ContextMenu x={mousePoint.x} y={mousePoint.y} selectFn={contextMenuSelected} fileIndex={files.findIndex((f) => { if(f == activeFile) { return true; } return false; })} activeFile={activeFile} />
            }

            {(showMakePublicModal == true) &&
                <Modal dismissible={true} show={showMakePublicModal == true} onClose={() => { setShowMakePublicModal(false); }} className="makeFilePublicModal">
                    <Modal.Body className="makeFilePublicModal-body">
                        
                    </Modal.Body>
                </Modal>
            }

            { /* Modal para exibir ações para interagir com o arquivo */ }
            {(activeFile != null) &&
                <Modal dismissible={true} show={showActions === true} onClose={() => { setShowActions(false); }} className="selectedFileModal" >
                    <Modal.Body className="selectedFileModal-body">
                        <span className="text-slate-800"><strong>Nome:</strong> {activeFile.name}</span>
                        <span className="text-slate-800"><strong>Extensão:</strong> {(activeFile.extension != null) ? `.${activeFile.extension}` : "N/t"}</span>
                        <span className="text-slate-800"><strong>Tamanho:</strong> {activeFile.size}</span>
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
            }

            { /* Modal para criar uma nova pasta */ }
            {(showNewFolderModal == true) &&
                <Modal show={showNewFolderModal == true} className="newFolderModal" dismissible={true} onClose={() => { SetShowNewFolderModal(false); }}>
                    <Modal.Body className="newFolderModal-body">
                        <form ref={newFolderFormRef} onSubmit={(e) => { e.preventDefault(); handleNewFolder(); }}>
                            <Label 
                                htmlFor="folderName"
                                value="Nome da pasta:"
                            />
                            <TextInput
                                id="folderName"
                                type="text"
                                value={ newFolderName }
                                onChange={(e) => { setNewFolderName(e.target.value) }}
                                className="flex flex-1"
                            />
                            <Button
                                onClick={handleNewFolder}
                            >
                                Criar
                            </Button>
                        </form>
                    </Modal.Body>
                </Modal>
            }


            { /* Modal para exibir conteúdo do arquivo */ }
            {(activeFile?.isFile == true && showFileData == true) &&
                <Modal show={showFileData === true} className="selectedFileViewModal" dismissible={true} onClose={ () => { setShowFileData(false); } }>
                    <Modal.Header className="selectedFileViewModal-header">
                        Visualizando <span className="font-thin">{activeFile.name}</span>
                    </Modal.Header>
    
                    <Modal.Body className="selectedFileViewModal-body">
                        {/*(fileData != null && activeFile.extension == "pdf") &&
                            
                        */}

                        {(fileData != null) &&
                            (fileData.split('\n').includes('\n') ? fileData.split('\n').map((d) => {
                                return <p>{d}</p>
                            }) : fileData)
                        }
        
                        {(fileData == null) &&
                            "Carregando..."
                        }
                    </Modal.Body>
                </Modal>
            }
            <div className="filesMainContainer" ref={filesMainContainerRef} onContextMenu={(e) => { openContextMenu(e); }}>
                <div className="w-full max-h-full h-auto overflow-hidden flex justify-center gap-2 flex-wrap p-2">
                    { (files.length > 0) && 
                        files.map((file, idx) => {

                            return <File
                                key={idx}
                                info={file}
                                isRenaming={isRenaming}
                                renamingFileIdx={renamingFileIdx}
                                setRenamingFilesIdx={setRenamingFilesIdx}
                                doneRenamingFile={doneRenamingFile}
                                fileIndex={idx}
                                setFileChecked={handleFileCheckBtn}
                                folderPath={pathInfo}
                                infoToShow={setActiveFile}
                                activeFile={activeFile}
                                setShowActions={setShowActions}
                                showActions={showActions}
                            />
                        })
                    }
                </div>
            </div>
            
        </>
    );
}

export default FilesContainer;