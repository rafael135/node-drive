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