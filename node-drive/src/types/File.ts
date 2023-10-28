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
    type: "text" | "code" | "image" | "pdf" | "video" | "file/other";
    url?: string;
    data?: string;
    extension?: string;
}

export type PublicFileInfo = {
    name: string;
    extension: string | null;
    size: string;
    filePath: string;
    created_at: string;
    updated_at: string;
}

export type getPublicFileInfoResponse = {
    fileInfo: PublicFileInfo;
    status: number;
}

