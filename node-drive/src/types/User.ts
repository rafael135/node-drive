export type StorageType = {
    id: number;
    title: string;
    storage_size: number;
    max_shared_files: number | null;
    price: number | null;
    created_at?: string;
    updated_at?: string;
};

// id, title, storage_size, price, max_shared_files, created_at, updated_at