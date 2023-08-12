export type User = {
    id: number;
    name: number;
    email: number;
    storageTypeId: number;
}

export type AuthError = {
    field: "name" | "email" | "password" | "confirmPassword";
    msg: string;
}