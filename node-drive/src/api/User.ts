import AxiosInstance from "../helpers/AxiosInstance"

/*
export const changeAvatar = async (file: File): Promise<string | null> => {
    const fileReader = new FileReader();

    fileReader.readAsArrayBuffer(file);

    type ChangeAvatarResponse = {
        base64Avatar?: string;
        status: number;
    }

    fileReader.addEventListener("load", async (e) => {
        let req = await AxiosInstance.put("/user/change/avatar", {
            newAvatar: e.target!.result
        }, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });

        let res: ChangeAvatarResponse = req.data;

        if((res.status >= 400 && res.status <= 406) || res.base64Avatar == undefined) {
            return null;
        }

        return res.base64Avatar;
    });
    
}*/

type changeEmailResponse = {
    status: number;
};

type changeEmailReturn = {
    msg: "unauthorized" | "error" | "success";
    data: string | null;
}
export const changeEmail = async (newEmail: string, password: string): Promise<changeEmailReturn> => {
    let req = await AxiosInstance.put("/user/change/email", {
        newEmail: newEmail,
        password: password
    });

    let res: changeEmailResponse = req.data;

    if(res.status == 401) {
        return { msg: "unauthorized", data: null };
    }

    if(res.status == 200) {
        return { msg: "success", data: newEmail };
    }

    return { msg: "error", data: null };
}

type changeNameResponse = {
    status: number;
}

type changeNameReturn = {
    msg: "unauthorized" | "error" | "success";
    data: string | null;
}

export const changeName = async (newName: string): Promise<changeNameReturn> => {
    let req = await AxiosInstance.put("/user/change/name", {
        newName: newName
    });

    let res: changeNameResponse = req.data;

    if(res.status == 401) {
        return { msg: "unauthorized", data: null };
    }

    if(res.status == 200) {
        return { msg: "success", data: newName };
    }

    return { msg: "error", data: null};
}