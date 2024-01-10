import { AuthResponseType, UserContextType, resetToken } from "../contexts/UserContext";
import AxiosInstance from "../helpers/AxiosInstance";
import { AuthError, User } from "../types/Auth";


type checkTokenResponse = {
    response: {
        user: User | null;
    },
    status: number;
}

export const checkToken = async (token: string) => {
    let req = await AxiosInstance.post("/user/checkToken", {
        headers: {
            "Authorization": `Bearer ${token}`
        },

    }).then((response) => {
        let res: checkTokenResponse = response.data;

        if (res.status == 200) {
            return true;
        } else {
            return false;
        }
    }).catch((error) => {
        console.log(error);

        resetToken();
        return false;
    });

    return req;
}

type registerReturnType = {
    success: boolean;
    user: User | null;
    token: string | null;
    errors: AuthError[] | null;
};

export const register = async (name: string, email: string, password: string, confirmPassword: string): Promise<registerReturnType> => {

    let req = await AxiosInstance.post("/user/register", {
        name: name,
        email: email,
        password: password,
        confirmPassword: confirmPassword
    });

    let res: AuthResponseType = req.data;

    if (res.status == 406) {
        return {
            success: false,
            user: null,
            token: null,
            errors: res.response.errors!
        };
    }
    if (res.response.token == null || res.response.user == null) {
        return {
            success: false,
            user: null,
            token: null,
            errors: null
        };
    }

    let usr = { ...res.response.user, maxStorage: res.response.maxSpace };

    return {
        success: true,
        user: usr,
        token: res.response.token,
        errors: null
    };
}


type loginReturnType = {
    success: boolean;
    user: User | null;
    token: string | null;
    errors: AuthError[] | null;
};

export const login = async (email: string, password: string): Promise<loginReturnType> => {
    let req = await AxiosInstance.post("/user/login", {
        email: email,
        password: password
    });

    let res: AuthResponseType = req.data;

    if (res.status == 406) {
        return {
            success: false,
            user: null,
            token: null,
            errors: res.response.errors!
        };
    }

    if (res.response.token == null || res.response.user == null) {
        return {
            success: false,
            user: null,
            token: null,
            errors: null
        };
    }


    let usr = { ...res.response.user, maxStorage: res.response.maxSpace };

    return {
        success: true,
        user: usr,
        token: res.response.token,
        errors: null
    };


}