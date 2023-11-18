export type User = {
    id: number;
    name: string;
    email: number;
    avatar?: string;
    storageTypeId: number;
    files_path: string;
    public_files_path: string;

    maxStorage: number;
}

export type AuthError = {
    field: "name" | "email" | "password" | "confirmPassword";
    msg: string;
}