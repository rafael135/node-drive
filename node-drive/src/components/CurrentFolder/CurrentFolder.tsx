import React, { useState, useEffect, useRef } from "react";
import { FileType } from "../../types/File";
import AxiosInstance from "../../helpers/AxiosInstance";

import { BsPlus, BsArrow90DegLeft } from "react-icons/bs";
import { FileInput, Label, Modal } from "flowbite-react";
import UploadLabel from "./UploadLabel";
import FilesContainer from "./FilesContainer";
import FileUploadToast from "./FileUploadToast";

type props = {
    userFilesPath: string;
};

export type FolderPath = {
    path: string,
    setFolderPath: React.Dispatch<React.SetStateAction<string>>
};

const CurrentFolder = ({userFilesPath}: props) => {

    let fileUploadInput = useRef(null);
    
    const [path, setPath] = useState<string>(userFilesPath);
    const [files, setFiles] = useState<FileType[]>([]);

    const [showAddModal, setShowAddModal] = useState<boolean>(false);
    const [selectedFile, setSelectedFile] = useState<FileType | null>(null);

    const [showToast, setShowToast] = useState<boolean>(false);
    const [toastMsg, setToastMsg] = useState<string>("");
    

    type FileResponse = {
        
        files: FileType[];
        status: number;
    }
    
    type UploadResponse = {
        success: boolean;
        status: number;
    }

    const getFiles = () => {
        AxiosInstance.post("/user/files", { path: path }).then((res) => {
            let response: FileResponse = res.data;

            if(response.status != 200) {
                return;
            }

            let files = response.files;

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

    const uploadFile = async (file: File) => {
        let name = file.name;

        const fileReader = new FileReader();

        fileReader.readAsArrayBuffer(file);

        fileReader.addEventListener("load", async (e) => {
            let req = await AxiosInstance.post("/user/files/upload", {
                path: path,
                file: e.target!.result,
                fileName: name
            }, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            let res: UploadResponse = req.data;

            if(res.success == true) {
                

                setShowAddModal(false);
                getFiles();

                setToastMsg("Upload feito com sucesso!");
                setShowToast(true);
                
            }

            
        });

        
    }


    const handleFileUpload = async () => {
        if(fileUploadInput != null) {
            let input = (fileUploadInput.current as unknown) as HTMLInputElement;

            if(input.files!.length > 0 && input.files != null) {
                for(let i = 0; i < input.files!.length; i++) {
                    let file = input.files[i];
                    
                    uploadFile(file);
                }
            }
        }
    }

    useEffect(() => {
        getFiles();
    }, []);

    useEffect(() => {
        getFiles();
    }, [path]);

    let _folderPath: FolderPath = {
        path: path.toString(),
        setFolderPath: setPath
    }

    return (
        <>
            { (showToast == true) &&
                <FileUploadToast msg={toastMsg} />
            }

            {(showAddModal == true) &&
                <Modal show={showAddModal === true} dismissible={true} onClose={() => { setShowAddModal(false); }}>
                    <Modal.Header>
                        
                    </Modal.Header>

                    <Modal.Body>
                        <Label htmlFor="fileUpload">
                            <UploadLabel />
                        </Label>
                        <FileInput ref={fileUploadInput} multiple={true} className="hidden" id="fileUpload" onChange={handleFileUpload} />
                    </Modal.Body>
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

            <FilesContainer 
                files={files}
                pathInfo={_folderPath}
                setShowAddModal={setShowAddModal}
                activeFile={selectedFile}
                setActiveFile={setSelectedFile}
                setToastMsg={setToastMsg}
                setShowToast={setShowToast}
                getFiles={getFiles}
            />
        </>
    );
}

export default CurrentFolder;