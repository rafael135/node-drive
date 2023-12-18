import { ReactNode, createContext, useState } from "react";

export type ModalContextType = {
    modalOpened: boolean;
    setModalOpened: React.Dispatch<React.SetStateAction<boolean>>;

}

export const ModalContext = createContext<ModalContextType | null>(null);

type props = {
    children: ReactNode;
};

export const ModalContextProvider = ({ children }: props) => {

    const [_modalOpened, _setModalOpened] = useState<boolean>(false);

    return (
        <ModalContext.Provider value={{
            modalOpened: _modalOpened, setModalOpened: _setModalOpened
        }}>
            { children }
        </ModalContext.Provider>
    );
}