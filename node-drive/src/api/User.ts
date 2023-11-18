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