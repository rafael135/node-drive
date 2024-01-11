import { useState, useEffect, useRef } from "react";
import { FileDataType, FileType } from "../../../types/File";
import File from "../../Molecules/File/Index";
import { FolderPath } from "./Index";
import ContextMenu from "./ContextMenu";
import { deleteFile, downloadFile, getFileData, makeFilePublic, renameFile } from "../../../api/Files";
//import { getRealPath } from "../../helpers/PathOps";

//import ShareFileModal from "./Modals/ShareFileModal";
import FileActionsModal from "./Modals/FileActionsModal";
import ShowFileDataModal from "./Modals/ShowFileDataModal";
import NewFolderModal from "./Modals/NewFolderModal";
import { AnimatePresence } from "framer-motion";
import ConfirmationModal from "../../Organisms/ConfirmationModal/Index";
import { sleep } from "../../../helpers/PathOps";
import { Spinner } from "flowbite-react";


type props = {
    files: FileType[];
    isFilesLoading: boolean;
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
    fileNameToFocus: string | null;
};

const FilesContainer = ({ files, isFilesLoading, setFiles, pathInfo, setShowAddModal, activeFile, setActiveFile, setToastMsgType, setToastMsg, setShowToast, getFiles, fileNameToFocus }: props) => {
    const [showContextMenu, setShowContextMenu] = useState<boolean>(false);
    const [mousePoint, setMousePoint] = useState({ x: 0, y: 0 });

    const [showActions, setShowActions] = useState<boolean>(false);

    const [fileData, setFileData] = useState<FileDataType | null>(null);
    const [showFileData, setShowFileData] = useState<boolean>(false);

    const [showNewFolderModal, setShowNewFolderModal] = useState<boolean>(false);

    const [renamingFileIdx, setRenamingFilesIdx] = useState<number | null>(null);
    const [fileDefaultName, setFileDefaultName] = useState<string>("");
    const [isRenaming, setIsRenaming] = useState<boolean>(false);


    //const [showMakePublicModal, setShowMakePublicModal] = useState<boolean>(false);

    const filesMainContainerRef = useRef<HTMLDivElement | null>(null);

    const [showFileVisibility, setShowFileVisibility] = useState<boolean>(false);
    const [selectedFile, setSelectedFile] = useState<FileType | null>(null);

    const [confirmModalAction, setConfirmModalAction] = useState<"delete" | "deleteFolder" | null>(null);
    const [confirmModalMsg, setConfirmModalMsg] = useState("");
    const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
    const [onYesAction, setOnYesAction] = useState<(() => void) | null>(null);

    const openContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        if (activeFile != null) {
            
        }

        setMousePoint({ x: e.pageY, y: e.pageX });
        setShowContextMenu(true);
    }

    const handleClick = (e: React.MouseEvent) => {
        
    }



    const handleVisualize = async () => {
        if (renamingFileIdx != null) {
            return;
        }

        let data = await getFileData(`${pathInfo.path}/${activeFile!.name}`);

        setFileData(data);

        setShowActions(false);
        setShowFileData(true);
    }

    const deleteFolder = async () => {
        let res = await deleteFile(activeFile!.location);

        if (res == true) {
            setToastMsgType("success");
            setToastMsg(`Pasta "${activeFile!.name}" deletada com sucesso!`);
        } else {
            setToastMsgType("error");
            setToastMsg(`Não foi possível deletar "${activeFile!.name}"!`);
        }

        resetConfirmationModal();
        getFiles();
        setShowToast(true);
    }

    const handleDeleteFolder = async () => {
        setConfirmModalAction("deleteFolder");
        setConfirmModalMsg("Deseja deletar a pasta? Todos os arquivos serão apagados!")
    }

    
    const contextMenuSelected = (fnNumber: number, fileIdx?: number) => {
        if (fnNumber == 1) {
            setShowAddModal(true);
        } else if (fnNumber == 2) {
            setShowActions(true);
        } else if (fnNumber == 3) {
            setShowNewFolderModal(true);
        } else if (fnNumber == 4) {
            setSelectedFile(activeFile);
            setShowFileVisibility(true);
            //handleMakePublicFile();
        } else if (fnNumber == 5) {
            //console.log(files[fileIdx!].name!);
            setRenamingFilesIdx(fileIdx!);
            setFileDefaultName(files[fileIdx!].name);
        } else if (fnNumber == 6) {
            handleDeleteFolder();
        }
    }

    const handleDownload = () => {
        if (activeFile != null) {
            downloadFile(pathInfo, activeFile);
        }
    }

    const resetConfirmationModal = () => {
        setConfirmModalAction(null);
        setShowConfirmModal(false);
    }

    const handleFileDelete = () => {
        setConfirmModalMsg(`Deseja deletar o arquivo "${activeFile!.name}"?`)
        setConfirmModalAction("delete");
    }

    const handleDelete = async () => {
        if (activeFile == null) {
            return;
        }

        let res = await deleteFile(activeFile.location);

        if (res == true) {
            setToastMsgType("success");
            setToastMsg(`Arquivo "${activeFile.name}" deletado com sucesso!`);
        } else {
            setToastMsgType("error");
            setToastMsg(`Não foi possível deletar "${activeFile.name}"!`);
        }

        let updatedFiles = files.filter((f) => {
            if (f.name != activeFile.name && f.location != activeFile.location) {
                return true;
            }

            return false;
        })

        setShowActions(false);
        //getFiles();
        setFiles(updatedFiles);
        setShowToast(true);
        resetConfirmationModal();
    }

    const handleFileCheckBtn = (idx: number, currentValue: boolean) => {
        let filesCopy = files;

        filesCopy[idx].selected = !currentValue;

        setFiles([...filesCopy]);
    }

    const changeFileName = (idx: number, newName: string) => {
        setFiles([...files.map((f, index) => {
            if(index == idx) {
                f.name = newName;
            }

            return f;
        })]);
    }

    // Função para salvar alterações do novo nome do arquivo
    const doneRenamingFile = async () => {
        let file = files[renamingFileIdx!];

        let res = await renameFile(pathInfo, fileDefaultName, {
            newName: file.name,
            isFile: file.isFile
        });

        if (res == true) {
            setToastMsgType("success");
            setToastMsg("Arquivo renomeado!");
            setShowToast(true);
        } else {
            setToastMsgType("error");
            setToastMsg("Não foi possível renomear o arquivo!");
            setShowToast(true);
        }

        setFileDefaultName("");
        setRenamingFilesIdx(null);
        setIsRenaming(false);

        //await sleep(100);
        //await getFiles();

        
    }

    const handleCloseContextMenu = () => {

    }

    useEffect(() => {
        const handleClick = () => { setShowContextMenu(false); };
        window.addEventListener("click", handleClick);

        if (showContextMenu == false && showActions == false && showFileData == false) {
            setActiveFile(null);
            setFileData(null);
        }

        return () => { window.removeEventListener("click", handleClick); };
    }, [showContextMenu]);

    useEffect(() => {
        if(showConfirmModal == false) {
            setConfirmModalAction(null);
        }

        switch(confirmModalAction) {
            case "delete":
                setOnYesAction(() => handleDelete);
                setShowConfirmModal(true);
                break;

            case "deleteFolder":
                setOnYesAction(() => deleteFolder);
                setShowConfirmModal(true);
                break;
        }
    }, [confirmModalAction, showConfirmModal])

    return (
        <>
            {(showContextMenu == true) &&
                <ContextMenu x={mousePoint.x} y={mousePoint.y} selectFn={contextMenuSelected} onClose={handleCloseContextMenu} fileIndex={files.findIndex((f) => { if (f == activeFile) { return true; } return false; })} activeFile={activeFile} />
            }

            {/*(showFileVisibility == true && selectedFile != null) &&
                <ShareFileModal activeFile={selectedFile} showFileVisibility={showFileVisibility} setShowFileVisibility={setShowFileVisibility} />
            */}

            { /* Modal para exibir ações para interagir com o arquivo */}
            {(activeFile != null && showActions == true) &&
                <FileActionsModal
                    showActions={showActions}
                    setShowActions={setShowActions}
                    activeFile={activeFile}
                    setActiveFile={setActiveFile}
                    files={files}
                    setFiles={setFiles}
                    pathInfo={pathInfo}
                    handleDownload={handleDownload}
                    handleVisualize={handleVisualize}
                    handleDelete={handleFileDelete}
                />
            }

            { /* Modal para criar uma nova pasta */}
            {(showNewFolderModal == true) &&
                <NewFolderModal
                    getFiles={getFiles}
                    pathInfo={pathInfo}
                    setToastMsgType={setToastMsgType}
                    setToastMsg={setToastMsg}
                    setShowToast={setShowToast}
                    showNewFolderModal={showNewFolderModal}
                    setShowNewFolderModal={setShowNewFolderModal}
                />
            }


            { /* Modal para exibir conteúdo do arquivo */}
            {(activeFile?.isFile == true && showFileData == true) &&
                <ShowFileDataModal
                    activeFile={activeFile}
                    fileData={fileData}
                    setFileData={setFileData}
                    showFileData={showFileData}
                    setShowFileData={setShowFileData}
                />
            }

            {(showConfirmModal == true) &&
                <ConfirmationModal msg={confirmModalMsg} show={showConfirmModal} setShow={setShowConfirmModal} onYes={onYesAction!} />
            }

            <div className="filesMainContainer" ref={filesMainContainerRef} onClick={handleClick} onContextMenu={(e) => { openContextMenu(e); }}>
                <div className={`relative w-full h-full max-h-full overflow-hidden flex justify-center gap-2 flex-wrap p-6 ${(files.length == 0 && isFilesLoading == false) ? "items-start" : ""}`}>
                    {(files.length > 0 && isFilesLoading == false) &&
                        <AnimatePresence mode="popLayout">
                            {files.map((file, idx) => {

                                return (<File
                                    key={file.name}
                                    info={file}
                                    isRenaming={isRenaming}
                                    renamingFileIdx={renamingFileIdx}
                                    setRenamingFilesIdx={setRenamingFilesIdx}
                                    doneRenamingFile={doneRenamingFile}
                                    changeFileName={changeFileName}
                                    fileIndex={idx}
                                    setFileChecked={handleFileCheckBtn}
                                    folderPath={pathInfo}
                                    infoToShow={setActiveFile}
                                    activeFile={activeFile}
                                    setShowActions={setShowActions}
                                    showActions={showActions}
                                    focus={(fileNameToFocus == file.name) ? true : false}
                                />
                                );

                            })}
                        </AnimatePresence>

                    }

                    {(files.length == 0 && isFilesLoading == false) &&
                        <span className="text-2xl text-slate-800">{(pathInfo.path == "") ? "Você não possui arquivos" : "Pasta vazia"}</span>
                    }

                    {(isFilesLoading == true) &&
                        <div className="absolute top-0 bottom-0 left-0 right-0 bg-black/5 flex justify-center items-center">
                            <Spinner className="w-14 h-auto fill-blue-600" />
                        </div>
                    }
                </div>
            </div>

        </>
    );
}

export default FilesContainer;