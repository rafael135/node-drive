import { useState, useEffect, useRef } from "react";
import { FileType } from "../../types/File";
import File from "../Files/File";
import { FolderPath } from "./CurrentFolder";
import ContextMenu from "./ContextMenu";
import { deleteFile, downloadFile, getFileData, makeFilePublic, renameFile } from "../../api/Files";
import { getRealPath } from "../../helpers/PathOps";

import ShareFileModal from "./Modals/ShareFileModal";
import FileActionsModal from "./Modals/FileActionsModal";
import ShowFileDataModal from "./Modals/ShowFileDataModal";
import NewFolderModal from "./Modals/NewFolderModal";


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

    const [showNewFolderModal, setShowNewFolderModal] = useState<boolean>(false);

    const [renamingFileIdx, setRenamingFilesIdx] = useState<number | null>(null);
    const [fileDefaultName, setFileDefaultName] = useState<string>("");
    const [isRenaming, setIsRenaming] = useState<boolean>(false);


    //const [showMakePublicModal, setShowMakePublicModal] = useState<boolean>(false);

    const filesMainContainerRef = useRef<HTMLDivElement | null>(null);

    const [showFileVisibility, setShowFileVisibility] = useState<boolean>(false);
    const [selectedFile, setSelectedFile] = useState<FileType | null>(null);
    


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

        let data = await getFileData(`${getRealPath(pathInfo)}${activeFile!.name}`);

        if(data != false) {
            setFileData(data);
        } else {
            setFileData("Não há nenhum texto para ser exibido")
        }
    }

    const handleMakePublicFile = async () => {
        let res = await makeFilePublic(pathInfo, activeFile!.name);

        if(res == true) {
            getFiles();
        }

        setActiveFile(null);
    }

    const contextMenuSelected = (fnNumber: number, fileIdx?: number) => {
        if(fnNumber == 1) {
            setShowAddModal(true);
        } else if(fnNumber == 2) {
            setShowActions(true);
        } else if(fnNumber == 3) {
            setShowNewFolderModal(true);
        } else if(fnNumber == 4) {
            setSelectedFile(activeFile);
            setShowFileVisibility(true);
            //handleMakePublicFile();
        } else if(fnNumber == 5) {
            //console.log(files[fileIdx!].name!);
            setRenamingFilesIdx(fileIdx!);
            setFileDefaultName(files[fileIdx!].name);
        } else if(fnNumber == 9) {
            
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

            {(showFileVisibility == true && selectedFile != null) &&
                <ShareFileModal activeFile={selectedFile} showFileVisibility={showFileVisibility} setShowFileVisibility={setShowFileVisibility} />
            }

            { /* Modal para exibir ações para interagir com o arquivo */ }
            {(activeFile != null) &&
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
                    handleDelete={handleDelete}
                />
            }

            { /* Modal para criar uma nova pasta */ }
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


            { /* Modal para exibir conteúdo do arquivo */ }
            {(activeFile?.isFile == true && showFileData == true) &&
                <ShowFileDataModal
                    activeFile={activeFile}
                    fileData={fileData}
                    showFileData={showFileData}
                    setShowFileData={setShowFileData}
                />
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