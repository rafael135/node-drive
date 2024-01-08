import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getStorageTypes } from "../api/StorageType"
import { getPublicFileInfo, getUserFiles, getUserPublicFiles, searchPublicFiles, searchUserFiles } from "../api/Files";
import { changeUserPlan, getUserPublicFilesQte } from "../api/User";


export const useStorageTypes = () => {
    const query = useQuery({
        queryKey: ["storageTypes"],
        queryFn: getStorageTypes,
        staleTime: Infinity
    });

    return query;
}

export const useUserFiles = (userId: number, path: string) => {
    const query = useQuery({
        queryKey: ["userFiles"],
        queryFn: () => getUserFiles(userId, path)
    });

    return query;
}

export const useChangeUserPlan = (selectedPlanId: number) => {
    const query = useQuery({
        queryKey: ["changePlan"],
        enabled: false,
        queryFn: () => changeUserPlan(selectedPlanId)
    });

    return query;
}

export const useUserPublicFiles = (userId: number) => {
    const query = useQuery({
        queryKey: ["userPublicFiles"],
        queryFn: () => getUserPublicFiles(userId),
        refetchOnMount: "always"
    });

    return query;
}

export const usePublicFileInfo = (userId: number, fileUrl: string) => {
    const query = useQuery({
        queryKey: ["PublicFileInfo"],
        queryFn: () => getPublicFileInfo(userId, fileUrl),
        refetchOnMount: "always"
    });

    return query;
}

export const useUserPublicFilesQte = () => {
    const query = useQuery({
        queryKey: ["userPublicFilesQte"],
        queryFn: getUserPublicFilesQte,
        refetchOnMount: "always"
    });

    return query;
}

export const useSearchPublicFiles = (filterOption: string, searchTerm: string, page: number, limit?: number) => {
    const query = useInfiniteQuery({
        queryKey: ["searchedPublicFiles"],
        queryFn: () => searchPublicFiles(filterOption, searchTerm, page, limit),
        initialPageParam: 0,
        getNextPageParam: (lastPage, pages) => lastPage.nextPage,
    });

    return query;
}

export const useSearchUserFiles = (searchTerm: string) => {
    const query = useQuery({
        queryKey: ["searchedUserFiles"],
        queryFn: () => searchUserFiles(searchTerm),
        refetchOnMount: "always"
    });

    return query;
}