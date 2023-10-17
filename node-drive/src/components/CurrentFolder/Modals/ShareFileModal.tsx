import { Modal } from "flowbite-react";
import { FileType } from "../../../types/File";
import { makeFilePublic } from "../../../api/Files";
import { BsFileLockFill, BsLockFill, BsShareFill } from "react-icons/bs";

type props = {
    activeFile: FileType;
    showFileVisibility: boolean;
    setShowFileVisibility: React.Dispatch<React.SetStateAction<boolean>>;
}

const FileVisibilityModal = ({ activeFile, showFileVisibility, setShowFileVisibility }: props) => {


    return (
        <Modal
            dismissible={true}
            show={(showFileVisibility == true) ? true : false}
            onClose={() => { setShowFileVisibility(false); }}
            className="fileVisibilityModal"
        >
            <Modal.Header className="fileVisibilityModal-header">

            </Modal.Header>

            <Modal.Body className="fileVisibilityModal-body">
                <div className="file-visibility">
                    Visibilidade do Arquivo: <span>{(activeFile.isPublic == true)? "Público" : "Privado"}</span> {(activeFile.isPublic) ? <BsShareFill className="inline-block" /> : <BsLockFill className="inline-block" />}
                </div>


            </Modal.Body>
        </Modal>
    );
}

export default FileVisibilityModal;