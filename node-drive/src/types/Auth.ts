export type User = {
    id: number;
    name: number;
    email: number;
    storageTypeId: number;
    files_path: string;
}

export type AuthError = {
    field: "name" | "email" | "password" | "confirmPassword";
    msg: string;
}