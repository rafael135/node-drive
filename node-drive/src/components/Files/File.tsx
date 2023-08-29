import { useState } from "react";
import { FileType } from "../../types/File";
import { BsFileEarmarkFill, BsDownload, BsFolderFill, BsFilePdfFill, BsFiletypeDocx, BsFileImageFill, BsFileTextFill, BsFileCodeFill, BsViewList } from "react-icons/bs";
import { Modal } from "flowbite-react";
import AxiosInstance from "../../helpers/AxiosInstance";
import { getFileData } from "../../api/Files";

type props = {
    info: FileType;
    folderPath: {
        path: string;
        setFolderPath: (newPath: string) => void;
    }
}

const File = ({info, folderPath}: props) => {
    const [activeFile, setActiveFile] = useState<string | null>(null);

    const [showActions, setShowActions] = useState<boolean>(false);
    const [showFileData, setShowFileData] = useState<boolean>(false);
    const [fileData, setFileData] = useState<string | null>(null);



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

    const handleVisualize = async () => {
        setShowActions(false);
        setShowFileData(true);

        let splitedPath = folderPath.path.split('/');

        console.log(splitedPath);

        let path = "";
        
        // Caso o caminho para o armazenamento não seja a pasta principal, pega as proximas pastas
        if(splitedPath[3] == "files") {
            path = `${splitedPath.filter((item, idx) => {
                return idx > 3;
            }).join('/')}/`;
        }

        let data = await getFileData(`${path}${activeFile!}`);

        if(data != false) {
            setFileData(data);
        } else {
            setFileData("Não há nenhum texto para ser exibido")
        }
    }

    return (
        <>

            { /* Modal para exibir ações para interagir com o arquivo */ }
            {(info.isFile == true) &&
                <Modal dismissible={true} show={showActions === true} onClose={() => { setShowActions(false); setActiveFile(null); }} className="selectedFileModal" >
                    <Modal.Body className="selectedFileModal-body">
                        <span className="text-slate-800"><strong>Nome:</strong> {info.name}</span>
                        <span className="text-slate-800"><strong>Extensão:</strong> {(info.extension != null) ? `.${info.extension}` : "N/t"}</span>
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


            { /* Modal para exibir conteúdo do arquivo */ }
            {(info.isFile == true && showFileData == true) &&
                <Modal show={showFileData === true} className="selectedFileViewModal" dismissible={true} onClose={ () => { setFileData(null); setShowFileData(false); } }>
                    <Modal.Header className="selectedFileViewModal-header">
                        Visualizando <span className="font-thin">{info.name}</span>
                    </Modal.Header>
    
                    <Modal.Body className="selectedFileViewModal-body">
                        {(fileData != null) &&
                            (fileData.split('\n').includes('\n') ? fileData.split('\n').map((d) => {
                                return <p>d</p>
                            }) : fileData)
                        }
        
                        {(fileData == null) &&
                            "Carregando..."
                        }
                    </Modal.Body>
                </Modal>
            }
            

            <div 
                className="file-card"
                onClick={() => { handleFile(info.name) }}
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

                
                <span className="fileName">{info.name}</span>
            </div>
        </>
    );
}

export default File;