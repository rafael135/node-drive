import { useMutation } from "@tanstack/react-query"
import { getStorageTypes } from "../api/StorageType"
import { StorageType } from "../types/User"
import { queryClient } from "./QueryClient"
import { searchUserFiles } from "../api/Files"
import { FileType } from "../types/File"


/*
export const useStorageTypes = () => {
    const mutation = useMutation({
        mutationFn: getStorageTypes,

        onSuccess: (rtrn: StorageType[], data, context) => {

            const storageTypes = queryClient.getQueryData(["storageTypes"]) as StorageType[];

            queryClient.setQueryData(["storageTypes"],  [rtrn, ...storageTypes]);
        }
    });

    return mutation;
}
*/


export const useSearchUserFilesMtn = (searchTerm: string) => {
    const mtnKey = ["searchedUserFiles"];

    const mutation = useMutation({
        //mutationKey: [mtnKey],
        mutationFn: () => searchUserFiles(searchTerm),

        onSuccess: (data: FileType[]) => {
            queryClient.setQueryData(mtnKey, data);
        }
    });

    return mutation;
}