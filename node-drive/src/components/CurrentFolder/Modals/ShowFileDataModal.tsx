import { Modal } from "flowbite-react";
import { FileType } from "../../../types/File";

type props = {
    activeFile: FileType;
    fileData: string | null;
    showFileData: boolean;
    setShowFileData: React.Dispatch<React.SetStateAction<boolean>>;
}

const ShowFileDataModal = ({ activeFile, fileData, showFileData, setShowFileData }: props) => {


    return (
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
    );
}

export default ShowFileDataModal;