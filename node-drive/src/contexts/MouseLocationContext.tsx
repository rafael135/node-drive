import { ReactNode, createContext, useState } from "react";

type Pos = {
    x: number;
    y: number;
}

export type MouseLocationContextType = {
    mousePos: Pos;
    setMousePos: React.Dispatch<React.SetStateAction<Pos>>;
}

export const MouseLocationContext = createContext<MouseLocationContextType | null>(null);

type props = {
    children: ReactNode;
};

export const MouseLocationContextProvider = ({ children }: props) => {

    const [_mousePos, _setMousePos] = useState<Pos>({ x: 0, y: 0 });

    return (
        <MouseLocationContext.Provider value={{
            mousePos: _mousePos, setMousePos: _setMousePos
        }}>
            { children }
        </MouseLocationContext.Provider>
    );
}