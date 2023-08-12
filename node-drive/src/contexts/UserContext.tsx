import { ReactNode, createContext, useEffect, useState } from "react";
import { AuthError, User } from "../types/Auth"
import AxiosInstance from "../helpers/AxiosInstance";

const USER_STORAGE_KEY = "UserContextAuth";
const TOKEN_STORAGE_KEY = "TokenContextAuth";

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
            localStorage.setItem(TOKEN_STORAGE_KEY, tokenState);
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
    


    return (
        <UserAuthContext.Provider value={ { user: userState, token: tokenState, setToken: _setToken, setUser: _setUser } }>
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
    let req = await AxiosInstance.post("/user/checkToken", {
        token: token
    });

    let res: checkTokenResponse = req.data;

    if(res.status >= 400 && res.status <= 406) {
        return false;
    } else {
        return true;
    }
}