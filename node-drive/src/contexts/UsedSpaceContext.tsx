import { createContext, ReactNode, useState } from "react";

export type UsedSpaceContextType = {
    usedSize: number;
    setUsedSize: React.Dispatch<React.SetStateAction<number>>;
}

export const UsedSpaceContext = createContext<UsedSpaceContextType | null>(null);

export const UsedSpaceContextProvider = ({ children }: { children: ReactNode }) => {
    const [usedSize, setUsedSize] = useState<number>(0);

    return (
        <UsedSpaceContext.Provider value={{ usedSize: usedSize, setUsedSize: setUsedSize }}>
            { children }
        </UsedSpaceContext.Provider>
    );
}