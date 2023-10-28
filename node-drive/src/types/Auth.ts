export type User = {
    id: number;
    name: number;
    email: number;
    storageTypeId: number;
    files_path: string;
    public_files_path: string;

    maxStorage: number;
}

export type AuthError = {
    field: "name" | "email" | "password" | "confirmPassword";
    msg: string;
}