import { useQueryClient } from "@tanstack/react-query";
import AxiosInstance from "../helpers/AxiosInstance"

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