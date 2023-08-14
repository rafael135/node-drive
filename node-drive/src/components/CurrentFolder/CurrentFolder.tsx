import { useState, useEffect } from "react";
import { File } from "../../types/File";
import AxiosInstance from "../../helpers/AxiosInstance";

type props = {
    path: string | "/";
};

const CurrentFolder = ({path}: props) => {

    const [files, setFiles] = useState<File[]>([]);

    type FileResponse = {
        response: {
            files: File[];
        },
        status: number;
    }

    const getFiles = () => {
        AxiosInstance.post("/user/files", { path: path }).then((res) => {
            let response: FileResponse = res.data;

            if(response.status != 200) {
                return;
            }

            let files = response.response.files;

            setFiles(files);
        });
    }

    useEffect(() => {
        getFiles();
    }, []);

    return (
        <div>
            { (files.length > 0) && 
                files.map((file, idx) => {
                    return <div key={idx}>{file.location}</div>
                })
            }
        </div>
    );
}

export default CurrentFolder;