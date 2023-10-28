import { Modal } from "flowbite-react";
import { FileDataType, FileType } from "../../../types/File";
import { useEffect } from "react";

type props = {
    activeFile: FileType;
    fileData: FileDataType | null;
    showFileData: boolean;
    setShowFileData: React.Dispatch<React.SetStateAction<boolean>>;
}

const ShowFileDataModal = ({ activeFile, fileData, showFileData, setShowFileData }: props) => {


    /*
    useEffect(() => {
        console.log(fileData);
    }, [fileData]);
    */

    return (
        <Modal show={showFileData === true} className="selectedFileViewDataModal absolute top-0 bottom-0 left-0 right-0 flex justify-center items-center" dismissible={true} onClose={ () => { setShowFileData(false); } }>
            <Modal.Header className="selectedFileViewDataModal-header">
                Visualizando <span className="font-thin">{activeFile.name}</span>
            </Modal.Header>
    
            <Modal.Body className="selectedFileViewDataModal-body">
                

                {(fileData != null && fileData.data != undefined && (fileData.type == "text" || fileData.type == "file/other")) &&
                    (fileData.data.includes('\n') ? fileData.data.split('\n').map((d) => {
                        return <p>{d}</p>
                    }) : fileData.data)
                }

                {(fileData != null && fileData.type == "image") &&
                    <img
                        className=""
                        src={`data:image/${fileData.extension};base64,${fileData.data}`}
                    />
                }

                {(fileData != null && fileData.type == "code") &&
                    <code>
                        {(fileData.data != undefined && fileData.data!.includes('\n')) &&
                            fileData.data.split('\n').map((line, idx) => {
                                return <p key={idx}>{line}</p>
                            })
                        }
                    </code>
                }

                {(fileData != null && fileData.type == "pdf") &&
                    "Não há suporte para a exibição de arquivos PDF"
                }
        
                {(fileData == null) &&
                    "Carregando..."
                }
            </Modal.Body>
        </Modal>
    );
}

export default ShowFileDataModal;