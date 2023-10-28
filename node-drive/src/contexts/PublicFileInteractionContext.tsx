import { createContext, useState } from "react";

export type EventType = "details" | null;

export type PublicFileInterationContextType = {
    event: EventType;
    setEvent: React.Dispatch<React.SetStateAction<EventType>>;
};

export const PublicFileInterationContext = createContext<null | PublicFileInterationContextType>(null);

export const PublicFileContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [event, setEvent] = useState<EventType>(null);

    return (
        <PublicFileInterationContext.Provider value={{ event: event, setEvent: setEvent }}>
            { children }
        </PublicFileInterationContext.Provider>
    );
}