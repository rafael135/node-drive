import { useEffect, useState } from "react";
import { getPublicFileInfo } from "../../api/Files";
import { BsFileArrowDownFill, BsFilePdfFill } from "react-icons/bs";
import { PublicFileInfo } from "../../types/File";
import Layout from "./Layout";
import { TfiZip } from "react-icons/tfi";

type props = {
    userId: number;
    fileUrl: string;
};

const PublicFile = ({ userId, fileUrl }: props) => {
    const [fileInfo, setFileInfo] = useState<PublicFileInfo | null>(null);

    useEffect(() => {
        let res = getPublicFileInfo(userId, fileUrl);

        res.then((r) => {
            if(r != null) {
                setFileInfo(r);
            }
        });
    }, []);

    return (
        <Layout fileInfo={fileInfo} userId={userId}>
            <div className="publicDownload-container">
                <div className={``}>
                    {(fileInfo?.extension == "zip") &&
                        <TfiZip className="fill-slate-200 w-48 h-48" />
                    }

                    {(fileInfo?.extension == "pdf") &&
                        <BsFilePdfFill className="fill-slate-200 w-48 h-48" />
                    }
                </div>
            </div>
        </Layout>
    );
}

export default PublicFile;