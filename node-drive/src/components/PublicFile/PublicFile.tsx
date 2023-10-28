import { useContext, useEffect, useState } from "react";
import { getPublicFileInfo } from "../../api/Files";
import { BsFileArrowDownFill, BsFilePdfFill } from "react-icons/bs";
import { PublicFileInfo } from "../../types/File";
import Layout from "./Layout";
import { TfiClose, TfiZip } from "react-icons/tfi";
import { PublicFileInterationContext } from "../../contexts/PublicFileInteractionContext";

type props = {
    userId: number;
    fileUrl: string;
};

const PublicFile = ({ userId, fileUrl }: props) => {
    const [fileInfo, setFileInfo] = useState<PublicFileInfo | null>(null);

    const publicFileContext = useContext(PublicFileInterationContext)!;

    let dateNow = new Date(Date.now());

    

    useEffect(() => {
        let res = getPublicFileInfo(userId, fileUrl);

        res.then((r) => {
            if(r != null) {
                setFileInfo(r);
            }
        });
    }, []);

    return (
        <>
            <Layout fileInfo={fileInfo} userId={userId}>
                <div className={`publicDownload-container ${(publicFileContext.event == "details") ? "justify-around" : ""}`}>
                    <div className={`${(publicFileContext.event == "details") ? "flex-1 flex justify-center items-center" : ""}`}>
                        {(fileInfo?.extension == "zip") &&
                            <TfiZip className="fill-slate-200 w-48 h-48" />
                        }

                        {(fileInfo?.extension == "pdf") &&
                            <BsFilePdfFill className="fill-slate-200 w-48 h-48" />
                        }
                    </div>

                    {(publicFileContext.event == "details") &&
                        <div className="h-[calc(100vh-90px)] w-80 me-3 bg-stone-900 rounded-2xl transition-all ease-in-out duration-150">
                            <div className="flex flex-row gap-1 items-center border-b-2 border-solid border-b-stone-700 text-slate-100 py-5 px-4">
                                <h1 className="inline-flex text-xl">Detalhes</h1>

                                <button
                                    className="ms-auto p-3 flex justify-center items-center rounded-full hover:bg-gray-400/30 active:bg-gray-400/50 group"
                                    onClick={() => { publicFileContext.setEvent(null); }}    
                                >
                                    <TfiClose className="fill-slate-200 w-4 h-4 group-hover:fill-red-600" />
                                </button>
                            </div>

                            <div className="mt-6 px-4 font-semibold">
                                <div className="flex flex-row items-center gap-1 text-slate-100">
                                    <h2 className="inline-flex">Informações gerais</h2>
                                    <span className="flex-1 h-[1px] bg-stone-700"></span>
                                </div>

                                <div className="flex flex-col gap-2 mt-2 text-[14px]">
                                    <div className="flex flex-row text-gray-500">
                                        <div className="flex-1">Tipo</div>
                                        <div className="flex-1 text-slate-100">
                                            {(fileInfo?.extension == "pdf") && "Documento"}
                                        </div>
                                    </div>

                                    <div className="flex flex-row text-gray-500">
                                        <div className="flex-1">Tamanho</div>
                                        <div className="flex-1 text-slate-100">{fileInfo?.size}</div>
                                    </div>

                                    <div className="flex flex-row text-gray-500">
                                        <div className="flex-1">Modificado</div>
                                        <div className="flex-1 text-slate-100">{fileInfo?.updated_at}</div>
                                    </div>

                                    <div className="flex flex-row text-gray-500">
                                        <div className="flex-1">Criado</div>
                                        <div className="flex-1 text-slate-100">{fileInfo?.created_at}</div>
                                    </div>

                                    <div className="flex flex-row text-gray-500">
                                        <div className="flex-1">Aberto por mim</div>
                                        <div className="flex-1 text-slate-100">{`${dateNow.getHours()}:${(dateNow.getMinutes() < 10) ? `0${dateNow.getMinutes()}` : `${dateNow.getMinutes()}`} ${dateNow.getFullYear()}/${dateNow.getMonth()}/${dateNow.getDay()}`}</div>
                                    </div>

                                </div>
                            </div>

                            <div className="mt-6 px-4 font-semibold">
                                <div className="flex flex-row items-center gap-1 text-slate-100">
                                    <h2 className="inline-flex">Compartilhamento</h2>
                                    <span className="flex-1 h-[1px] bg-stone-700"></span>
                                </div>

                                <div className="flex flex-col gap-2 mt-2 text-[14px]">
                                    <div className="flex flex-row text-slate-100">
                                        <div className="flex-1">Qualquer um</div>
                                    </div>
                                </div>

                            </div>

                            <div className="mt-6 px-4 font-semibold">
                                <div className="flex flex-row items-center gap-1 text-slate-100">
                                    <h2 className="inline-flex">Permissão para Download</h2>
                                    <span className="flex-1 h-[1px] bg-stone-700"></span>
                                </div>

                                <div className="flex flex-col gap-2 mt-2 text-[14px]">
                                    <div className="flex flex-row text-slate-100">
                                        <div className="flex-1">Qualquer pessoa com o link</div>
                                    </div>
                                </div>

                            </div>


                        </div>
                    }
                </div>
            </Layout>
        </>
    );
}

export default PublicFile;