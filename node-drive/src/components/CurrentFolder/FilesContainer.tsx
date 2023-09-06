import { useState, useEffect, useRef } from "react";
import { FileType } from "../../types/File";
import File from "../Files/File";
import { FolderPath } from "./CurrentFolder";
import ContextMenu from "./ContextMenu";
import { Button, Label, Modal, TextInput } from "flowbite-react";
import { BsDownload, BsViewList } from "react-icons/bs";
import AxiosInstance from "../../helpers/AxiosInstance";
import { createNewFolder, getFileData } from "../../api/Files";


type props = {
    files: FileType[];
    pathInfo: FolderPath;
    setShowAddModal: React.Dispatch<React.SetStateAction<boolean>>;
    activeFile: FileType | null;
    setActiveFile: React.Dispatch<React.SetStateAction<FileType | null>>;
    //showToast: boolean;
    setToastMsg: React.Dispatch<React.SetStateAction<string>>;
    setShowToast: React.Dispatch<React.SetStateAction<boolean>>;
    getFiles: () => void;
}

const FilesContainer = ({ files, pathInfo, setShowAddModal, activeFile, setActiveFile, setToastMsg, setShowToast, getFiles }: props) => {

    const [showContextMenu, setShowContextMenu] = useState<boolean>(false);
    const [mousePoint, setMousePoint] = useState({ x: 0, y: 0 });

    const [showActions, setShowActions] = useState<boolean>(false);

    const [fileData, setFileData] = useState<string | null>(null);
    const [showFileData, setShowFileData] = useState<boolean>(false);

    const [showNewFolderModal, SetShowNewFolderModal] = useState<boolean>(false);
    const [newFolderName, setNewFolderName] = useState<string>("");
    const newFolderFormRef = useRef(null);


    const openContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        if(activeFile != null) {
            
        }

        setMousePoint({ x: e.pageY, y: e.pageX });
        setShowContextMenu(true);
    }

    const handleDownload = async () => {
        if(activeFile != null) {
            AxiosInstance.post("/user/files/download", {
                path: activeFile.location
            }, {
                responseType: "blob"
            })
            .then((res) => {
                const href = window.URL.createObjectURL(res.data);

                const anchorElement = document.createElement("a");
                anchorElement.href = href;
                anchorElement.download = `${activeFile.name}${(activeFile.extension == null) ? ".txt" : ""}`;

                document.body.appendChild(anchorElement);
                anchorElement.click();

                document.body.removeChild(anchorElement);
                window.URL.revokeObjectURL(href);
            })
            .catch(() => {
                
            });
        }
    }

    const getRealPath = () => {
        let splitedPath = pathInfo.path.split('/');

        //console.log(splitedPath);

        let path = "";
        
        // Caso o caminho para o armazenamento não seja a pasta principal, pega as proximas pastas
        if(splitedPath[3] == "files" && splitedPath.length > 4) {
            path = `${splitedPath.filter((item, idx) => {
                return idx > 3;
            }).join('/')}/`;
        }

        return path;
    }

    const handleVisualize = async () => {
        setShowActions(false);
        setShowFileData(true);

        

        //console.log(path);

        let data = await getFileData(`${getRealPath()}${activeFile!.name}`);

        if(data != false) {
            setFileData(data);
        } else {
            setFileData("Não há nenhum texto para ser exibido")
        }
    }

    const contextMenuSelected = (fnNumber: number) => {
        if(fnNumber == 1) {
            setShowAddModal(true);
        } else if(fnNumber == 2) {
            setShowActions(true);
        } else if(fnNumber == 3) {
            SetShowNewFolderModal(true);
        }
    }

    const handleNewFolder = async () => {
        let result = await createNewFolder(pathInfo.path, newFolderName);

        if(result == true) {
            setToastMsg(`Pasta ${newFolderName} criada com sucesso!`);
            setShowToast(true);

            SetShowNewFolderModal(false);
            setNewFolderName("");

            getFiles();
        } else {

        }
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
                <ContextMenu x={mousePoint.x} y={mousePoint.y} selectFn={contextMenuSelected} activeFile={activeFile} />
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
                    </Modal.Footer>
                </Modal>
            }

            { /* Modal para criar uma nova pasta */ }
            {(showNewFolderModal == true) &&
                <Modal show={showNewFolderModal == true} className="newFolderModal" dismissible={true} onClose={() => { SetShowNewFolderModal(false); }}>
                    <Modal.Body className="newFolderModal-body">
                        <form ref={newFolderFormRef}>
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
            <div className="filesMainContainer" onContextMenu={(e) => { openContextMenu(e); }}>
                <div className="w-full max-h-full h-auto overflow-hidden flex justify-center gap-2 flex-wrap p-2">
                    { (files.length > 0) && 
                        files.map((file, idx) => {
                            return <File
                                key={idx}
                                info={file}
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