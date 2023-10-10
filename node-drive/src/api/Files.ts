//import { useQueryClient } from "@tanstack/react-query";
import AxiosInstance from "../helpers/AxiosInstance"
import { FileType } from "../types/File";
import { FolderPath } from "../components/CurrentFolder/CurrentFolder";
import { getRealPath } from "../helpers/PathOps";



export const downloadFile = async (pathInfo: FolderPath, activeFile: FileType) => {
    if(activeFile != null) {
        let path = getRealPath(pathInfo);
        path = encodeURI(path);
        let fileName = encodeURI(activeFile.name);

        AxiosInstance.get(`/user/files/download/${path}${fileName}`, {
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
        .catch((err) => {
            
        });
    }
}

type DeleteFileResponse = {
    success: boolean;
    status: number;
}

export const deleteFile = async (filePath: string) => {
    let req = await AxiosInstance.delete("/user/files", {
        data: {
            filePath: filePath
        }
    });

    let res: DeleteFileResponse = req.data;


    if(res.status == 200) {
        return true;
    }

    return false;
}


type FileDataResponse = {
    data: string | null;
    status: number;
}

export const getFileData = async (filePath: string) => {
    //const queryClient = useQueryClient();

    let req = await AxiosInstance.get(`/user/files/view?filePath=${filePath}`);
    let res: FileDataResponse = req.data;

    if(res.status == 400 || res.data == null) {
        return false;
    }

    return res.data;
}


type NewFolderResponse = {
    status: number;
}

export const createNewFolder = async (path: string, folderName: string) => {
    let req = await AxiosInstance.post("/user/files/new/folder", {
        path: path,
        folderName: folderName
    });

    let res: NewFolderResponse = req.data;

    if(res.status >= 400 && res.status <= 404) {
        return false;
    }

    return true;
}

type makeFilePublicResponse = {
    status: number;
}

export const makeFilePublic = async (path: FolderPath, fileName: string) => {
    let req = await AxiosInstance.put("/user/files/make/public", {
        filePath: `${getRealPath(path)}${fileName}`
    });

    let res: makeFilePublicResponse = req.data;

    if(res.status >= 400 && res.status <= 404) {
        return false;
    }

    return true;
}


type renameFileResponse = {
    success: boolean;
    status: number;
}

export const renameFile = async (path: FolderPath, fileName: string, { newName, isFile }: { newName: string; isFile: boolean }) => {
    let req = await AxiosInstance.put("/user/files/rename", {
        filePath: `${getRealPath(path)}/${fileName}`,
        newName: newName,
        isFile: isFile
    });

    let res: renameFileResponse = req.data;

    if(res.status == 200) {
        return true;
    }

    return false;
}