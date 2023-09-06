import { resetToken } from "../contexts/UserContext";
import AxiosInstance from "../helpers/AxiosInstance";
import { User } from "../types/Auth";


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

        if(res.status == 200) {
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