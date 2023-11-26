//import { useQueryClient } from "@tanstack/react-query";
import AxiosInstance from "../helpers/AxiosInstance"
import { FileDataType, FileType, PublicFileInfo, getPublicFileInfoResponse } from "../types/File";
import { FolderPath } from "../components/CurrentFolder/CurrentFolder";
import { getRealPath } from "../helpers/PathOps";
import fileDownload from "js-file-download";



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
            console.log(err);
        });
    }
}

export const downloadCompactedFiles = async (pathInfo: FolderPath, files: string[]) => {
    let path = getRealPath(pathInfo);
    path = encodeURI(path);

    //let filesEncoded = files.join(',');

    AxiosInstance.post(`/user/files/multiple/download`, { files: files }, { headers: {
        
    } }).then((res) => {

        //fileDownload(res.data, "files.zip", "application/zip");

        /*
        const href = window.URL.createObjectURL(res.data);

        const anchorElement = document.createElement("a");
        anchorElement.href = href;
        anchorElement.download = `compactedFiles.zip`;

        document.body.appendChild(anchorElement);
        anchorElement.click();

        document.body.removeChild(anchorElement);
        window.URL.revokeObjectURL(href);
        */
    }).catch((err) => {
        console.log(err);
    });
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

interface FileDataTypeResponse extends FileDataType {
    status: number;
}

export const getFileData = async (filePath: string): Promise<FileDataType | null> => {
    //const queryClient = useQueryClient();

    let req = await AxiosInstance.get(`/user/files/view?filePath=${filePath}`);
    let res: FileDataTypeResponse = req.data;

    if(res.status == 400) {
        return null;
    }

    return {
        type: res.type,
        url: res.url,
        data: res.data
    };
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
    isPublic?: boolean;
    status: number;
}

export const makeFilePublic = async (path: FolderPath, fileName: string) => {
    let req = await AxiosInstance.put("/user/files/public", {
        filePath: `${getRealPath(path)}${fileName}`
    });

    let res: makeFilePublicResponse = req.data;

    if(res.status >= 400 && res.status <= 404) {
        return null;
    }

    if(res.status == 201) {
        return true;
    } else {
        return false;
    }
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

type getPublicDownloadLinkResponse = {
    url: string | null;
    status: number;
}

export const getPublicDownloadLink = async (path: FolderPath, fileName: string, userId: number) => {
    let req = await AxiosInstance.get("/user/files/public/url", {
        params: {
            filePath: `${getRealPath(path)}/${fileName}`,
            userId: userId
        }
    });

    let res: getPublicDownloadLinkResponse = req.data;

    if(res.status >= 400 && res.status <= 404) {
        return null;
    }

    if(res.status == 204) {
        return null;
    }

    if(res.status == 200) {
        return res.url;
    }
}

export const getPublicFileInfo = async (userId: number, fileUrl: string) => {
    let req = await AxiosInstance.get("/user/files/public/info", {
        params: {
            userId: userId,
            fileUrl: fileUrl
        }
    });

    let res: getPublicFileInfoResponse = req.data;
    
    if(res.status == 200) {
        return res.fileInfo;
    }

    return null;
}

export const downloadPublicFile = async (userId: number, fileInfo: PublicFileInfo) => {
    let req = AxiosInstance.get(`/user/${userId}/files/public/download`, {
        params: {
            filePath: fileInfo.filePath
        },
        responseType: "blob"
    });

    req.then((res) => {
        const href = window.URL.createObjectURL(res.data);

        const anchorElement = document.createElement("a");
        anchorElement.href = href;
        anchorElement.download = `${fileInfo.name}${(fileInfo.extension == null) ? ".txt" : ""}`;

        document.body.appendChild(anchorElement);
        anchorElement.click();

        document.body.removeChild(anchorElement);
        window.URL.revokeObjectURL(href);
    }, (res) => {

    });
}