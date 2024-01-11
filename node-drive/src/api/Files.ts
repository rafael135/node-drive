//import { useQueryClient } from "@tanstack/react-query";
import AxiosInstance from "../helpers/AxiosInstance"
import { FileDataType, FileType, PublicFileInfo, PublicFileType, SearchedFileType, downloadCompressedFilesResponse, getPublicFileInfoResponse } from "../types/File";
import { FolderPath } from "../components/Pages/Home/Index";
//import { getRealPath } from "../helpers/PathOps";
import fileDownload from "js-file-download";
//import { UsedSpaceContextType } from "../contexts/UsedSpaceContext";

type getUserFilesResponse = {

    files: FileType[];
    occupiedSpace: number;
    status: number;
}

export const getUserFiles = async (userId: number, path: string) => {
    let req = await AxiosInstance.get("/user/files", { params: { userId: userId, path: path } });

    let response = req.data as getUserFilesResponse;

    if (response.status != 200) {
        return {
            files: [],
            occupiedSpace: 0
        };
    }

    let files = response.files;

    files = files.filter((f) => {
        if (f.name != "ignore" && f.name != "downloadZip.zip") {
            return true;
        }

        return false;
    });

    files = files.map((file) => {
        file.selected = false;
        return file;
    });

    return {
        files: files,
        occupiedSpace: response.occupiedSpace
    };
}

type getUserPublicFilesResponse = {
    files: PublicFileType[];
    sharedFiles: number;
    status: number;
}

type getUserPublicFilesReturn = {
    files: PublicFileType[];
    sharedFiles: number;
};

export const getUserPublicFiles = async (userId: number): Promise<getUserPublicFilesReturn> => {
    let req = await AxiosInstance.get(`/user/files/public/${userId}`);

    let res: getUserPublicFilesResponse = req.data;

    if(res.status >= 400 && res.status <= 410) {
        return {
            files: [],
            sharedFiles: 0
        };
    }

    return {
        files: res.files,
        sharedFiles: res.sharedFiles
    };
}

export const downloadFile = async (pathInfo: FolderPath, activeFile: FileType) => {
    if (activeFile != null) {
        let path = pathInfo.path;
        path = encodeURI(path);
        let fileName = encodeURI(activeFile.name);

        AxiosInstance.get(`/user/files/download`, {
            params: {
                filePath: `${path}/${fileName}`
            },
            responseType: "blob",
            headers: {
                Accept: `${activeFile.fileType}`
            }
        })
            .then((res) => {

                fileDownload(res.data, activeFile.name, (activeFile.fileType == "other") ? undefined : activeFile.fileType);

                /*
                const href = window.URL.createObjectURL(res.data);
    
                const anchorElement = document.createElement("a");
                anchorElement.href = href;
                anchorElement.download = `${activeFile.name}${(activeFile.extension == null) ? ".txt" : ""}`;
    
                document.body.appendChild(anchorElement);
                anchorElement.click();
    
                document.body.removeChild(anchorElement);
                window.URL.revokeObjectURL(href);
                */
            })
            .catch((err) => {
                console.log(err);
            });
    }
}

export const downloadCompactedFiles = async (pathInfo: FolderPath, files: string[]) => {
    let path = pathInfo.path;
    path = encodeURI(path);

    //let filesEncoded = files.join(',');

    AxiosInstance.get(`/user/files/multiple/download`, {
        responseType: "blob",
        headers: {
            Accept: "application/zip"
        },
        params: {
            files: encodeURI(files.join(','))
        }
    }).then((res) => {
        fileDownload(res.data, "arquivos.zip", "application/zip");
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


    if (res.success == true) {
        return true;
    }

    return false;
}

interface FileDataTypeResponse extends FileDataType {
    status: number;
}

export const getFileData = async (filePath: string): Promise<FileDataType | null> => {
    //const queryClient = useQueryClient();

    //while(filePath.includes("/")) {
    //    filePath = filePath.replace('/', '%_');
    //}

    let req = await AxiosInstance.get(`/user/files/view`, {
        params: {
            filePath: filePath
        }
    });
    let res: FileDataTypeResponse = req.data;

    if (res.status == 400) {
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

    if (res.status >= 400 && res.status <= 404) {
        return false;
    }

    return true;
}

type makeFilePublicResponse = {
    isPublic?: boolean;
    status: number;
}

export const makeFilePublic = async (filePath: FolderPath, fileName: string) => {
    let req = await AxiosInstance.put("/user/files/public", {
        filePath: `${filePath.path}/${fileName}`
    });

    let res: makeFilePublicResponse = req.data;

    if (res.status >= 400 && res.status <= 404) {
        return null;
    }

    if (res.status == 201) {
        return true;
    } else {
        return false;
    }
}


type renameFileResponse = {
    success: boolean;
    status: number;
}

export const renameFile = async (filePath: FolderPath, fileName: string, { newName, isFile }: { newName: string; isFile: boolean }) => {
    let req = await AxiosInstance.put("/user/files/rename", {
        filePath: `${filePath.path}/${fileName}`,
        newName: newName,
        isFile: isFile
    });

    let res: renameFileResponse = req.data;

    if (res.status == 200) {
        return true;
    }

    return false;
}

type getPublicDownloadLinkResponse = {
    url: string | null;
    status: number;
}

export const getPublicDownloadLink = async (filePath: FolderPath, fileName: string, userId: number) => {
    let req = await AxiosInstance.get("/user/files/public/url", {
        params: {
            filePath: `${filePath.path}/${fileName}`,
            userId: userId
        }
    });

    let res: getPublicDownloadLinkResponse = req.data;

    if (res.status >= 400 && res.status <= 404) {
        return null;
    }

    if (res.status == 204) {
        return null;
    }

    if (res.status == 200) {
        return res.url;
    }
}

type PublicFileInfoResponse = {
    
};

export const getPublicFileInfo = async (userId: number, fileUrl: string) => {
    let req = await AxiosInstance.get("/user/files/public/info", {
        params: {
            userId: userId,
            fileUrl: fileUrl
        }
    });

    let res: getPublicFileInfoResponse = req.data;

    if (res.status == 200) {
        return res;
    }

    return false;
}

export const downloadPublicFile = async (userId: number, fileInfo: PublicFileInfo) => {
    let req = AxiosInstance.get(`/user/${userId}/files/public/download`, {
        params: {
            filePath: fileInfo.filePath
        },
        responseType: "blob",
        headers: {
            Accept: `${fileInfo.mimeType ?? ""}`
        }
    });

    req.then((res) => {
        
        fileDownload(res.data, fileInfo.name, fileInfo.mimeType!);

        /*
        const href = window.URL.createObjectURL(res.data);

        const anchorElement = document.createElement("a");
        anchorElement.href = href;
        anchorElement.download = `${fileInfo.name}${(fileInfo.extension == null) ? ".txt" : ""}`;

        document.body.appendChild(anchorElement);
        anchorElement.click();

        document.body.removeChild(anchorElement);
        window.URL.revokeObjectURL(href);
        */
    }, (res) => {

    });
}



type SearchPublicFilesResponse = {
    files: SearchedFileType[];
    qtePages: number;
    status: number;
};

type SearchPublicFilesReturn = {
    files: SearchedFileType[];
    qtePages: number;
    nextPage: number;
}

export const searchPublicFiles = async (filterOption: string, searchTerm: string, page: number, limit?: number): Promise<SearchPublicFilesReturn> => {
    let req = await AxiosInstance.get("/files/search", {
        params: {
            filter: filterOption,
            searchT: searchTerm,
            page: page ?? 0,
            limit: limit ?? 10
        }
    });

    let res: SearchPublicFilesResponse = req.data;

    if((res.status >= 400 && res.status <= 410) || res.status == 204) {
        return {
            files: [],
            qtePages: 0,
            nextPage: 0
        };
    }

    return {
        files: res.files!,
        qtePages: res.qtePages,
        nextPage: page + 1
    };
}

type searchUserFilesResponse = {
    files: FileType[];
    status: number;
}

export const searchUserFiles = async (searchTerm: string): Promise<FileType[]> => {
    let req = await AxiosInstance.get("/user/files/search", {
        params: {
            searchTerm: searchTerm
        }
    });

    let res: searchUserFilesResponse = req.data;

    if(res.status >= 400 && res.status <= 410) {
        return [];
    }

    return res.files;
}