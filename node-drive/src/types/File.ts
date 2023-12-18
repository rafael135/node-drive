export type FileType = {
    name: string;
    extension: string | null;
    fileType: string;
    size: string;
    location: string;
    isFile: boolean;
    isPublic: boolean;
    shareLink?: string;
    selected?: boolean;
    
};

export type FileDataType = {
    type: "text" | "code" | "image" | "pdf" | "video" | "other";
    mimeType?: string;
    url?: string;
    data?: string;
    extension?: string;
};

export type PublicFileInfo = {
    name: string;
    extension: string | null;
    type: string;
    size: string;
    filePath: string;
    url?: string;
    mimeType?: string;
    data?: string;
    created_at: string;
    updated_at: string;
};

export type PublicFileUser = {
    name: string;
    avatar: string;
}

export type getPublicFileInfoResponse = {
    fileInfo: PublicFileInfo;
    userInfo: PublicFileUser;
    status: number;
};

export type downloadCompressedFilesResponse = {
    url: string;
    status: number;
};

