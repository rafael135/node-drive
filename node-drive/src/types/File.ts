export type FileType = {
    name: string;
    extension: string | null;
    size: string;
    location: string;
    isFile: boolean;
    isPublic: boolean;
    shareLink?: string;
    selected?: boolean;
}

export type FileDataType = {
    type: "txt" | "png" | "jpg" | "pdf" | "other";
    data: string;
}

export type PublicFileInfo = {
    name: string;
    extension: string | null;
    size: string;
    filePath: string;
}

export type getPublicFileInfoResponse = {
    fileInfo: PublicFileInfo;
    status: number;
}

