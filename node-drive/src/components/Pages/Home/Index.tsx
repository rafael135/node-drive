import React, { useState, useEffect, useRef, useMemo, useContext, createContext, useLayoutEffect } from "react";
import { FileType } from "../../../types/File";
import AxiosInstance from "../../../helpers/AxiosInstance";

import { BsPlus, BsArrow90DegLeft, BsDownload, BsArrowBarDown, BsTrashFill } from "react-icons/bs";
import { RxTriangleDown, RxTriangleUp } from "react-icons/rx";
import { Dropdown, FileInput, Label, Modal } from "flowbite-react";
import UploadLabel from "../../Molecules/UploadLabel/Index";
import FilesContainer from "./FilesContainer";
import FileUploadToast from "./FileUploadToast";
import UploadStatusToast from "../../Molecules/UploadStatusToast/Index";
import { sleep } from "../../../helpers/PathOps";
import { deleteFile, downloadCompactedFiles, downloadFile, getUserFiles } from "../../../api/Files";
import { UserContextType } from "../../../contexts/UserContext";
import { UsedSpaceContext } from "../../../contexts/UsedSpaceContext";
import DownloadBtn from "../../Atoms/DownloadButton/Index";
import PathLabel from "../../Atoms/PathLabel/Index";
import { useSearchParams } from "react-router-dom";
import Button from "../../Atoms/Button/Index";
import ConfirmationModal from "../../Organisms/ConfirmationModal/Index";
import { convertFileSizeToBytes } from "../../../helpers/File";

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

type PathLabelType = {
    name: string;
    path: string;
};

const getPathLabels = (path: string): PathLabelType[] => {
    let labels: PathLabelType[] = [];

    let cpyPath = path.split('/');
    //console.log(cpyPath);

    let homePath = "";

    labels.push({ name: "Home", path: homePath });

    if (cpyPath.length == 0) {
        return labels;
    }
    //console.log(homePath);

    cpyPath.forEach((p, idx) => {
        if (idx == 0) {

        } else {
            labels.push({ name: p, path: `${labels[idx - 1].path}/${p}` });
        }
    });
    //console.log(labels);

    return labels;
}

type props = {
    userCtx: UserContextType;
};

const CurrentFolder = ({ userCtx }: props) => {
    const usedSpaceCtx = useContext(UsedSpaceContext)!;
    const [searchParams] = useSearchParams();

    let fileToFocus: string[] | string | null = searchParams.get("file");
    let fileNameToFocus: string | null = null;
    let filePathToFocus: string | null = null;

    if (fileToFocus != null) {
        fileToFocus = decodeURI(fileToFocus);
        fileToFocus = fileToFocus.split("\\");

        if (fileToFocus.length == 1) {
            fileNameToFocus = fileToFocus.join();
        } else {
            fileNameToFocus = fileToFocus.pop()!;
            filePathToFocus = fileToFocus.join("/");
        }
        //console.log(fileNameToFocus);
    }

    //console.log(userFilesPath);
    let fileUploadInput = useRef<HTMLInputElement | null>(null);

    let selectFilterInput = useRef(null);

    const [path, setPath] = useState<string>(`${(filePathToFocus != null) ? `/${filePathToFocus}` : ""}`);
    const [pathLabels, setPathLabels] = useState<PathLabelType[]>(getPathLabels(path));

    const [files, setFiles] = useState<FileType[]>([]);
    const [filesLoading, setFilesLoading] = useState<boolean>(true);

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

    const [confirmModalAction, setConfirmModalAction] = useState<"delete" | null>(null);
    const [confirmModalMsg, setConfirmModalMsg] = useState<string>("");
    const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
    const [onYesAction, setOnYesAction] = useState<(() => void) | (() => Promise<void>) | null>(null);




    let _folderPath: FolderPath = {
        path: path,
        setFolderPath: setPath
    }

    type FileResponse = {

        files: FileType[];
        occupiedSpace: number;
        status: number;
    }

    type UploadResponse = {
        success: boolean;
        status: number;
    }

    const getFiles = async () => {
        //setFiles([]);

        //let res = await getUserFiles(userCtx.user!.id, path);

        setFilesLoading(true);

        let res = await getUserFiles(userCtx.user!.id, path);

        setFiles(res.files);
        usedSpaceCtx.setUsedSize(res.occupiedSpace);

        setFilesLoading(false);
    }

    const handleAddFile = () => {
        setShowAddModal(!showAddModal);
    }

    const handleDownloadSelectedFilesBtn = async () => {
        let selectedFiles = files.filter((f) => {
            if (f.selected == true) {
                return true;
            }

            return false;
        });

        if (selectedFiles.length == 0) {
            return;
        }

        for (let i = 0; i < selectedFiles.length; i++) {
            await downloadFile(_folderPath, selectedFiles[i]);
        }

        setFiles(files.map((f) => {
            f.selected = false;
            return f;
        }));
    }


    const handleCompactAndDownloadFilesBtn = async () => {
        let selectedFiles = files.filter((f) => {
            if (f.selected == true) {
                return true;
            }
            return false;
        });

        if (selectedFiles.length == 0) {
            return;
        }

        let selectedFilesPath: string[] = [];

        for (let i = 0; i < selectedFiles.length; i++) {
            let path: string | string[] = selectedFiles[i].location.split('/');

            for (let j = 0; j < 3; j++) {
                path.shift();
            }

            path = path.join('');

            selectedFilesPath.push(path);
        }

        await downloadCompactedFiles(_folderPath, selectedFilesPath);

        setFiles(files.map((f) => {
            f.selected = false;
            return f;
        }));
    }


    const handleBackFolder = () => {
        if (path == "") {
            return;
        }

        //console.log(path);
        let splited = path.split('/');
        //console.log(splited);

        //if (splited[0] == "") {
        //    splited.shift();
        //}

        splited.pop();

        //console.log(splited);
        setPath(splited.join('/'));
    }

    const uploadFile = async (file: File) => {
        let name = file.name;

        const fileReader = new FileReader();

        fileReader.readAsArrayBuffer(file);

        fileReader.addEventListener("load", async (e) => {
            let req = await AxiosInstance.post("/user/files/upload", {
                path: (path == "") ? "/" : path,
                file: e.target!.result,
                fileName: name
            }, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            let res: UploadResponse = req.data;

            if (res.success == true) {


                setShowAddModal(false);

                setToastMsg("Upload feito com sucesso!");
                //setShowToast(true);
            }
        });
    }

    const handleFileUpload = async () => {
        if (fileUploadInput != null) {
            let input = fileUploadInput.current as HTMLInputElement;

            if (input.files == null) {
                return;
            }

            //console.log(input.files);

            //setFilesToUpload(Array.from(input.files));

            setFilesToUploadCompleted(0);
            setQteFilesToUpload(input.files.length);

            //setShowUploadStatus(true);



            for (let i = 0; i < input.files.length; i++) {
                let file = input.files.item(i)!;

                //console.log(file);
                //await sleep(300);
                await uploadFile(file);
                //console.log(i);
                setFilesToUploadCompleted(filesToUploadCompleted + 1);

            }

            setShowAddModal(false);

            await sleep(900);

            getFiles();
        }
    }

    const handleCloseConfirmModal = () => {
        setShowConfirmModal(false);
        setConfirmModalAction(null);
        setConfirmModalMsg("");
        setOnYesAction(null);
    }

    const deleteFiles = async () => {
        let selectedFiles = files.filter((f) => {
            if (f.selected == true) {
                return true;
            }
            return false;
        });

        if (selectedFiles.length == 0) {
            return;
        }
        
        /*
        let selectedFilesPath: string[] = [];

        for (let i = 0; i < selectedFiles.length; i++) {
            let path: string | string[] = selectedFiles[i].location.split('/');

            for (let j = 0; j < 3; j++) {
                path.shift();
            }

            path = path.join('');

            selectedFilesPath.push(path);
        }
        */

        let filesSuccess: boolean[] = [];

        let deletePromise = new Promise<void>((resolve) => {
            let i = 0;

            selectedFiles.forEach(async (f) => {
                i++;

                filesSuccess.push(await deleteFile(f.location));
                await sleep(150);

                if(i == selectedFiles.length) {
                    resolve();
                }
            });
        });

        await deletePromise;
        //console.log(filesSuccess);
        handleCloseConfirmModal();

        getFiles();
    }

    const handleDeleteFiles = () => {
        setConfirmModalMsg("Deletar todos os arquivos selecionados?");
        setConfirmModalAction("delete");
    }

    const filterFiles = (opt: "name" | "type" | "size") => {
        //console.log(files);

        if (opt == "name") {
            setFiles([...files.sort((a, b) => {
                if (a.name.localeCompare(b.name) == 0) {
                    return 0;
                }
                return (a.name.localeCompare(b.name) == 1) ? 1 : -1;
            })]);
            //console.log(files);
        } else if (opt == "type") {
            setFiles([...files.sort((a, b) => {
                if (a.isFile == true && b.isFile == false) {
                    return 1;
                } else if (a.isFile == false && b.isFile == true) {
                    return -1;
                } else {
                    return 0;
                }
            })]);
        } else if (opt == "size") {
            setFiles([...files.sort((a, b) => {
                let sizeA = convertFileSizeToBytes(a.size);
                let sizeB = convertFileSizeToBytes(b.size);

                if (sizeA > sizeB) {
                    return 1;
                } else if (sizeA < sizeB) {
                    return -1;
                } else {
                    return 0;
                }
            })]);
        }
    }

    const handleFilter = () => {
        let selectInput = (selectFilterInput.current!) as HTMLSelectElement;

        let opt = selectInput.selectedIndex;

        switch (opt) {
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

    useLayoutEffect(() => {
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

        let isChecked = files.find((f) => {
            if (f.selected == true) {
                return true;
            }
        });

        if (isChecked != undefined) {
            setIsFileChecked(true);
        } else {
            setIsFileChecked(false);
        }
    }, [files]);

    useEffect(() => {
        setPathLabels(getPathLabels(path));
        //console.log(pathLabels);
    }, [path]);

    useEffect(() => {
        if(showConfirmModal == false) {
            setConfirmModalAction(null);
        }

        switch(confirmModalAction) {
            case "delete":
                setOnYesAction(() => deleteFiles);
                setShowConfirmModal(true);
                break;
        }

    }, [showConfirmModal, confirmModalAction]);


    return (
        <>
            {(showToast == true) &&
                <FileUploadToast msgType={toastMsgType} msg={toastMsg} setShowToast={setShowToast} />
            }

            {(showUploadStatus == true) &&
                <UploadStatusToast setShowStatus={setShowUploadStatus} filesCompleted={filesToUploadCompleted} qteFiles={qteFilesToUpload} />
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

            {(showConfirmModal == true) &&
                <ConfirmationModal msg={confirmModalMsg} show={showConfirmModal} setShow={setShowConfirmModal} onYes={onYesAction!} />
            }

            <div className="folderToolBar" key={"toolbar"}>
                <div key={"pathLabels"} className="w-full py-0.5 px-2 flex flex-row gap-1 border-solid border-b border-b-gray-200">
                    {pathLabels.map((p, idx) => {
                        return (
                            <>
                                <PathLabel
                                    key={p.name}
                                    name={p.name}
                                    path={p.path}
                                    setValue={setPath}
                                />

                                {(idx + 1 < pathLabels.length) &&
                                    <span key={p.name + idx} className="text-slate-800">
                                        /
                                    </span>
                                }
                            </>
                        );
                    })}
                </div>

                <div key={"toolbarOpts"} className="flex-1 flex flex-row gap-2 items-center">
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
                        disabled={(filesLoading == true || files.length == 0) ? true : false}
                        ref={selectFilterInput}
                        onChange={handleFilter}
                        title="Filtrar por Tipo"
                        defaultValue={0}
                    >
                        <option value={0} disabled={true}>Ordenar por</option>
                        <option value={1}>Nome</option>
                        <option value={2}>Tipo</option>
                        <option value={3}>Tamanho</option>
                    </select>

                    <div className="h-full w-[1px] bg-gray-400/70">

                    </div>


                    {(isFileChecked == true) &&
                        <>
                            {/*
                        <button
                            className="btn-action group"
                            title="Download"
                            onClick={handleDownloadSelectedFilesBtn}
                        >
                            <BsDownload className={`w-5 h-5 fill-gray-100 group-hover:scale-105`} />
                            Download
                        </button>
                        
                        */}

                            <Dropdown label="" renderTrigger={() => <button className="btn-action btn-download group">
                                Opções de Download
                                <RxTriangleDown className={`w-5 h-5 fill-gray-100 group-hover:scale-105`} />
                            </button>}>
                                <Dropdown.Item icon={BsDownload} onClick={handleDownloadSelectedFilesBtn}>
                                    Download
                                </Dropdown.Item>

                                <Dropdown.Item icon={BsDownload} onClick={handleCompactAndDownloadFilesBtn}>
                                    Compactar & Download
                                </Dropdown.Item>
                            </Dropdown>




                        {/*
                        <button
                            className="btn-action group"
                            title="Compactar e realizar Download"
                            onClick={handleCompactAndDownloadFilesBtn}
                        >
                            <BsDownload className={`w-5 h-5 fill-gray-100 group-hover:scale-105`} />
                            Compactar e realizar Download
                        </button>

                        */}


                            <Button title="Deletar" type="error" onClick={handleDeleteFiles} className="!pt-[0.35rem] !pb-[0.35rem]">
                                <BsTrashFill className="w-5 h-5 fill-gray-100 group-hover:scale-105" />
                            </Button>
                        </>
                    }
                </div>
            </div>

            <FilesContainer
                key={"filesContainer"}
                files={files}
                isFilesLoading={filesLoading}
                setFiles={setFiles}
                pathInfo={_folderPath}
                setShowAddModal={setShowAddModal}
                activeFile={selectedFile}
                setActiveFile={setSelectedFile}
                setToastMsgType={setToastMsgType}
                setToastMsg={setToastMsg}
                setShowToast={setShowToast}
                getFiles={getFiles}
                fileNameToFocus={fileNameToFocus}
            />
        </>
    );
}

export default CurrentFolder;