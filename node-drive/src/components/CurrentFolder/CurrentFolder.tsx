import { useState, useEffect } from "react";
import { FileType } from "../../types/File";
import AxiosInstance from "../../helpers/AxiosInstance";
import File from "../Files/File";

import { BsPlus, BsArrow90DegLeft } from "react-icons/bs";
import { Modal } from "flowbite-react";

type props = {
    userFilesPath: string;
};

const CurrentFolder = ({userFilesPath}: props) => {
    
    const [path, setPath] = useState<string>(userFilesPath);
    const [files, setFiles] = useState<FileType[]>([]);

    const [showAddModal, setShowAddModal] = useState<boolean>(false);

    type FileResponse = {
        response: {
            files: FileType[];
        },
        status: number;
    }

    const getFiles = () => {
        AxiosInstance.post("/user/files", { path: path }).then((res) => {
            let response: FileResponse = res.data;

            if(response.status != 200) {
                return;
            }

            let files = response.response.files;

            setFiles(files);
        });
    }

    const handleAddFile = () => {
        setShowAddModal(!showAddModal);
    }

    const handleBackFolder = () => {
        let splited = path.split('/');

        if( splited[splited.length - 1] == "files") {
            return;
        }

        splited.pop();
        setPath(splited.join('/'));
    }

    useEffect(() => {
        getFiles();
    }, []);

    useEffect(() => {


        getFiles();
    }, [path]);

    let _folderPath = {
        path: path,
        setFolderPath: setPath
    }

    return (
        <>
            {(showAddModal == true) &&
                <Modal show={showAddModal === true} dismissible={true} onClose={() => { setShowAddModal(false); }}>
                    <Modal.Header>
                        
                    </Modal.Header>

                    <Modal.Body>

                    </Modal.Body>

                    <Modal.Footer>

                    </Modal.Footer>
                </Modal>
            }

            <div className="folderToolBar">
                <button
                    className="btn-back group"
                    title="Voltar"
                    onClick={handleBackFolder}
                >
                    <BsArrow90DegLeft className={`w-4 h-4 fill-slate-600 group-active:fill-slate-500`} />
                </button>

                <button 
                    className="btn-action"
                    title="Adicionar arquivo"
                    onClick={handleAddFile}
                >
                    <BsPlus className={`w-8 h-8 fill-gray-100`} />
                    Adicionar
                </button>
            </div>

            <div className="w-full max-h-full h-auto flex justify-center gap-2 flex-wrap p-2">
                { (files.length > 0) && 
                    files.map((file, idx) => {
                        return <File key={idx} info={file} folderPath={_folderPath} />
                    })
                }
            </div>
        </>
    );
}

export default CurrentFolder;