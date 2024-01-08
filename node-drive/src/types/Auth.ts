export type User = {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    storage_type_id: number;
    public_files_path: string;

    maxStorage: number;
}

export type AuthError = {
    field: "name" | "email" | "password" | "confirmPassword";
    msg: string;
}