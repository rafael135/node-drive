import AxiosInstance from "../helpers/AxiosInstance"
import { StorageType } from "../types/User";

type getStorageTypesResponse = {
    storageTypes: StorageType[];
    status: number;
}

export const getStorageTypes = async (): Promise<StorageType[]> => {
    let req = await AxiosInstance.get("/storageTypes");

    let res = req.data as getStorageTypesResponse;

    if(res.status == 200) {
        res.storageTypes.sort((a, b) => {
            if(a.id > b.id) { return 1 }
            else if(a.id < b.id) { return -1 }
            else { return 0 }
        });

        return res.storageTypes;
    }

    return [];
}