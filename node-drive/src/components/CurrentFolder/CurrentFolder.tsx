import React, { useState, useEffect, useRef, useMemo, useContext, createContext } from "react";
import { FileType } from "../../types/File";
import AxiosInstance from "../../helpers/AxiosInstance";

import { BsPlus, BsArrow90DegLeft, BsDownload } from "react-icons/bs";
import { FileInput, Label, Modal } from "flowbite-react";
import UploadLabel from "./UploadLabel";
import FilesContainer from "./FilesContainer";
import FileUploadToast from "./FileUploadToast";
import UploadStatus from "../FileUpload/UploadStatus";
import { sleep } from "../../helpers/PathOps";
import { downloadFile } from "../../api/Files";
import { UserContextType } from "../../contexts/UserContext";

type props = {
    userFilesPath: string;
    userCtx: UserContextType;
};

/*
export type FileUploadStatusContextType = {
    qteFilesToUpload: number;
    qteFilesUploadCompleted: number;
}

export const FileUploadStatusContext = createContext<FileUploadStatusContextType | null>(null);
*/

export type FolderPath = {
    path: string;
    setFolderPath: React.Dispatch<React.SetStateAction<string>>;
};

const CurrentFolder = ({userFilesPath, userCtx}: props) => {

    //console.log(userFilesPath);
    let fileUploadInput = useRef<HTMLInputElement | null>(null);

    let selectFilterInput = useRef(null);
    
    const [path, setPath] = useState<string>(userFilesPath);
    const [files, setFiles] = useState<FileType[]>([]);

    const [showAddModal, setShowAddModal] = useState<boolean>(false);
    const [selectedFile, setSelectedFile] = useState<FileType | null>(null);

    const [showToast, setShowToast] = useState<boolean>(false);
    const [toastMsg, setToastMsg] = useState<string>("");
    const [toastMsgType, setToastMsgType] = useState<"error" | "info" | "warning" | "success">("error");

    const [filesToUpload, setFilesToUpload] = useState<File[]>([]);
    const [filesToUploadCompleted, setFilesToUploadCompleted] = useState<number>(0);
    const [qteFilesToUpload, setQteFilesToUpload] = useState<number>(0);

    const [showUploadStatus, setShowUploadStatus] = useState<boolean>(false);

    const [isFileChecked, setIsFileChecked] = useState<boolean>(false);

    
    let _folderPath: FolderPath = {
        path: path.toString(),
        setFolderPath: setPath
    }

    type FileResponse = {
        
        files: FileType[];
        status: number;
    }
    
    type UploadResponse = {
        success: boolean;
        status: number;
    }

    const getFiles = async () => {
        //setFiles([]);

        AxiosInstance.get("/user/files", { params: { userId: userCtx.user!.id, path: path } }).then((res) => {
            let response: FileResponse = res.data;

            if(response.status != 200) {
                return;
            }

            let files = response.files;

            files = files.filter((f) => {
                if(f.name != "ignore") {
                    return true;
                }

                return false;
            });

            setFiles(files.map((file) => {
                file.selected = false;
                return file;
            }));

            //console.log(files);
        }).catch((err) => {

        });
    }

    const handleAddFile = () => {
        setShowAddModal(!showAddModal);
    }

    const handleDownloadSelectedFilesBtn = async () => {
        let selectedFiles = files.filter((f) => {
            if(f.selected == true) {
                return true;
            }

            return false;
        });

        if(selectedFiles.length == 0) {
            return;
        }

        for(let i = 0; i < selectedFiles.length; i++) {
            await downloadFile(_folderPath, selectedFiles[i]);
        }
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

                setToastMsg("Upload feito com sucesso!");
                //setShowToast(true);
            }
        });
    }

    const handleFileUpload = async () => {
        if(fileUploadInput != null) {
            let input = fileUploadInput.current as HTMLInputElement;

            if(input.files == null) {
                return;
            }

            //console.log(input.files);

            //setFilesToUpload(Array.from(input.files));

            setFilesToUploadCompleted(0);
            setQteFilesToUpload(input.files.length);

            //setShowUploadStatus(true);

            
            
            for(let i = 0; i < input.files.length; i++) {
                let file = input.files.item(i)!;

                console.log(file);
                await sleep(300);
                await uploadFile(file);
                console.log(i);
                setFilesToUploadCompleted(filesToUploadCompleted + 1);
                
            }

            getFiles();
        }
    }
    
    const filterFiles = (opt: "name" | "type" | "size") => {
        console.log(files);

        if(opt == "name") {
            setFiles(files.sort((a, b) => {
                if(a.name.localeCompare(b.name) == 0) {
                    return 0;
                }
                return (a.name.localeCompare(b.name) == 1) ? 1 : -1;
            }));
            console.log(files);
        } else if(opt == "type") {
            setFiles(files.sort((a, b) => {
                if(a.isFile == true && b.isFile == false) {
                    return 1;
                } else if(a.isFile == false && b.isFile == true) {
                    return -1;
                } else {
                    return 0;
                }
            }));
        } else if(opt == "size") {
            setFiles(files.sort((a, b) => {
                let sizeAMed = a.size.split(' ')[1];
                let sizeBMed = b.size.split(' ')[1];

                let sizeA = parseFloat(a.size.split(' ')[0]);
                let sizeB = parseFloat(a.size.split(' ')[0]);

                if(sizeAMed == "Bytes") {

                } else if(sizeAMed == "Kb") {
                    sizeA = sizeA * 1000;
                } else {
                    sizeA = sizeA * 1000000;
                }

                if(sizeBMed == "Bytes") {

                } else if(sizeBMed == "Kb") {
                    sizeB = sizeB * 1000;
                } else {
                    sizeB = sizeB * 1000000;
                }

                if(sizeA > sizeB) {
                    return 1;
                } else if(sizeA < sizeB) {
                    return -1;
                } else {
                    return 0;
                }
            }));
        }

        setFiles([...files.reverse().reverse()]);
    }

    const handleFilter = () => {
        let selectInput = (selectFilterInput.current!) as HTMLSelectElement;

        let opt = selectInput.selectedIndex;

        switch(opt) {
            case 1:
                filterFiles("name");
                break;

            case 2:
                filterFiles("type");
                break;

            case 3:
                filterFiles("size");
                break;

            default:
                getFiles();
                break;
        }
    }

    useEffect(() => {
        getFiles();
    }, []);

    useEffect(() => {
        getFiles();
    }, [path]);

    /*
    useEffect(() => {
        console.log("Completed: ", filesToUploadCompleted);
        console.log("Qte: ", qteFilesToUpload);

        setShowUploadStatus(!showUploadStatus)
        sleep(100);
        setShowUploadStatus(!showUploadStatus)
    }, [filesToUploadCompleted]);
    */

    useEffect(() => {

        let isCkecked = files.find((f) => {
            if(f.selected == true) {
                return true;
            }
        });

        if(isCkecked != undefined) {
            setIsFileChecked(true);
        } else {
            setIsFileChecked(false);
        }
    }, [files])

    

    return (
        <>
            { (showToast == true) &&
                <FileUploadToast msgType={toastMsgType} msg={toastMsg} setShowToast={setShowToast} />
            }

            { (showUploadStatus == true) &&
                <UploadStatus setShowStatus={setShowUploadStatus} filesCompleted={filesToUploadCompleted} qteFiles={qteFilesToUpload} />
            }

            {(showAddModal == true) &&
                <Modal show={showAddModal === true} dismissible={true} onClose={() => { setShowAddModal(false); }}>
                    <Modal.Header>
                        Upload de arquivo
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
                    className="btn-action group"
                    title="Adicionar arquivo"
                    onClick={handleAddFile}
                >
                    <BsPlus className={`w-8 h-8 fill-gray-100 group-hover:scale-105`} />
                    Adicionar
                </button>

                <select
                    className="select-filter"
                    ref={selectFilterInput}
                    onChange={handleFilter}
                    title="Filtrar por Tipo"
                >
                    <option defaultChecked={true} value={0}>Ordenar por</option>
                    <option value={1}>Nome</option>
                    <option value={2}>Tipo</option>
                    <option value={3}>Tamanho</option>
                </select>

                <div className="h-full w-[1px] bg-gray-400/70">

                </div>

                {(isFileChecked == true) && 
                    <>
                        <button
                            className="btn-action group"
                            title="Download"
                            onClick={handleDownloadSelectedFilesBtn}
                        >
                            <BsDownload className={`w-5 h-5 fill-gray-100 group-hover:scale-105`} />
                            Download
                        </button>
                    </>
                }
            </div>

            <FilesContainer 
                files={files}
                setFiles={setFiles}
                pathInfo={_folderPath}
                setShowAddModal={setShowAddModal}
                activeFile={selectedFile}
                setActiveFile={setSelectedFile}
                setToastMsgType={setToastMsgType}
                setToastMsg={setToastMsg}
                setShowToast={setShowToast}
                getFiles={getFiles}
            />
        </>
    );
}

export default CurrentFolder;