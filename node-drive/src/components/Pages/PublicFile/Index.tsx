import { useContext, useEffect, useState } from "react";
//import { getPublicFileInfo } from "../../../api/Files";
import { BsFileArrowDownFill, BsFilePdfFill } from "react-icons/bs";
import { PublicFileInfo, PublicFileUser } from "../../../types/File";
import Layout from "./Layout";
import { TfiClose, TfiZip } from "react-icons/tfi";
import { PublicFileInterationContext } from "../../../contexts/PublicFileInteractionContext";
//import { Avatar } from "flowbite-react";
import PublicFileMenu from "./Menus/PublicFileMenu";
import { usePublicFileInfo } from "../../../utils/Queries";
import { useNavigate } from "react-router-dom";

type props = {
    userId: number;
    fileUrl: string;
};

const PublicFile = ({ userId, fileUrl }: props) => {
    const navigate = useNavigate();

    const [fileInfo, setFileInfo] = useState<PublicFileInfo | null>(null);
    const [userInfo, setUserInfo] = useState<PublicFileUser | null>(null);

    const publicFileInfo = usePublicFileInfo(userId, fileUrl);

    const publicFileContext = useContext(PublicFileInterationContext)!;

    //const [showData, setShowData] = useState<boolean>(false);

    //let dateNow = new Date(Date.now());

    

    useEffect(() => {
        //let res = getPublicFileInfo(userId, fileUrl);

        //res.then((r) => {
        //    if(r != null) {
        //        setFileInfo(r.fileInfo);
        //        setUserInfo(r.userInfo);
        //    }
        //});

        if(publicFileInfo.data != undefined && publicFileInfo.data != false) {
            setFileInfo(publicFileInfo.data!.fileInfo ?? null);
            setUserInfo(publicFileInfo.data!.userInfo ?? null);
        } else if(publicFileInfo.data == false) {
            return navigate("/");
        }
    }, [publicFileInfo.data]);

    return (
        <>
            <Layout fileInfo={fileInfo} userId={userId}>
                <div className={`publicDownload-container ${(publicFileContext.event == "details") ? "justify-around" : ""}`}>
                    <div className={`${(publicFileContext.event == "details") ? "flex-1 flex justify-center items-center" : ""} transition-transform duration-150`}>
                        {(fileInfo?.extension == "zip") &&
                            <TfiZip className="fill-slate-200 w-48 h-48" />
                        }

                        {(fileInfo?.extension == "pdf") &&
                            <BsFilePdfFill className="fill-slate-200 w-48 h-48" />
                        }

                        {(fileInfo?.type == "image") &&
                            <img
                                src={`data:image/${fileInfo!.extension};base64,${fileInfo!.data}`}
                                className="px-6 max-h-[65vh] transition-all ease-in-out duration-150"
                            />
                        }

                        {(fileInfo?.type == "video") &&
                            <video
                                controls={true}
                                className="max-h-[65vh] w-auto"
                            >
                                <source src={fileInfo.url!} type={fileInfo.mimeType!}></source>
                            </video>
                        }

                        {(fileInfo?.type == "text" || fileInfo?.type == "other") &&
                            `${fileInfo.data}`
                        }
                    </div>

                    
                    <PublicFileMenu fileInfo={fileInfo!} userInfo={userInfo!} publicFileContext={publicFileContext} />
                    
                </div>
            </Layout>
        </>
    );
}

export default PublicFile;