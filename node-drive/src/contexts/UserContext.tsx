import { ReactNode, createContext, useEffect, useMemo, useState } from "react";
import { AuthError, User } from "../types/Auth"
import AxiosInstance from "../helpers/AxiosInstance";

const USER_STORAGE_KEY = "UserContextAuth";
export const TOKEN_STORAGE_KEY = "TokenContextAuth";

export type UserContextType = {
    user: User | null;
    token: string | null;
    setToken: (token: string | null) => void;
    setUser: (user: User | null) => void;
}


export const UserAuthContext = createContext<UserContextType | null>(null);

export const UserAuthProvider = ({children}: {children: ReactNode}) => {

    // States:
    const [userState, setUserState] = useState<User | null>(
        JSON.parse(localStorage.getItem(USER_STORAGE_KEY) ?? "{}")
    );

    const [tokenState, setTokenState] = useState<string | null>(
        localStorage.getItem(TOKEN_STORAGE_KEY)
    );


    // Effects:
    useEffect(() => {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userState));
    },
        [userState]
    );

    useEffect(() => {
        if(tokenState != null) {
            AxiosInstance.defaults.headers.common["Authorization"] = `Bearer ${tokenState}`;
            localStorage.setItem(TOKEN_STORAGE_KEY, tokenState);
        } else {
            delete AxiosInstance.defaults.headers.common["Authorization"];
            localStorage.removeItem(TOKEN_STORAGE_KEY);
        }
    },
        [tokenState]
    );


    const _setToken = (token: string | null) => {
        setTokenState(token);
    }

    const _setUser = (user: User | null) => {
        setUserState(user);
    }
    
    const contextValue = useMemo(
        () => ({
            user: userState,
            token: tokenState,
            setToken: _setToken,
            setUser: _setUser,
        }),
    [tokenState, userState]);

    return (
        <UserAuthContext.Provider value={contextValue}>
            { children }
        </UserAuthContext.Provider>
    );
}

export type AuthResponseType = {
    response: {
        user: User | null;
        token: string | null;
        errors?: AuthError[]
    },
    status: number;
}


type checkTokenResponse = {
    response: {
        user: User | null;
    },
    status: number;
}

export const checkToken = async (token: string) => {
    let req = await AxiosInstance.post("http://127.0.0.1:3333/api/user/checkToken", {
        headers: {
            "Authorization": `Bearer ${token}`
        },
        
    });

    let res: checkTokenResponse = req.data;

    if(res.status == 200) {
        return true;
    }

    return false;
}