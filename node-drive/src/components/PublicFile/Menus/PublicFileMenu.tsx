import { Avatar } from "flowbite-react";
import { PublicFileInfo, PublicFileUser } from "../../../types/File";
import { TfiClose } from "react-icons/tfi";
import { PublicFileInterationContextType } from "../../../contexts/PublicFileInteractionContext";

//import { useSpring, animated } from "react-spring";
import { useLayoutEffect } from "react";

import { AnimatePresence, motion } from "framer-motion";


type props = {
    userInfo: PublicFileUser;
    fileInfo: PublicFileInfo;
    publicFileContext: PublicFileInterationContextType;
}

const PublicFileMenu = ({ userInfo, fileInfo, publicFileContext }: props) => {

    let dateNow = new Date(Date.now());

    const animation = {
        hidden: { opacity: 0, scale: 0 },
        visible: { opacity: 1, scale: 1 }
    };

    useLayoutEffect(() => {

    }, []);

    return (

        <AnimatePresence mode="sync">
            {(publicFileContext.event == "details") &&
                <motion.div
                    className="h-[calc(100vh-90px)] float-right w-80 me-3 bg-stone-900 rounded-2xl transition-all ease-in-out duration-150"
                    initial={{ x: 500 }}
                    animate={{ x: 0 }}
                    transition={{
                        duration: 0.15,
                        type: "spring"
                    }}
                    exit={{ x: 3000 }}
                //style={springs}
                >
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

                                    {(fileInfo?.type == "image") && "Imagem"}

                                    {(fileInfo?.type == "video") && "Vídeo"}

                                    {(fileInfo?.type == "other") && "Outro"}
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

                    <div className="mt-6 px-4 flex flex-col font-semibold">
                        <div className="flex flex-row items-center gap-1 text-slate-100">
                            <h2 className="inline-flex">Compartilhamento</h2>
                            <span className="flex-1 h-[1px] bg-stone-700"></span>
                        </div>

                        <div className="flex flex-col gap-2 mt-2 text-[14px]">
                            <div className="flex flex-row text-slate-100">
                                <div className="flex-1">Qualquer um</div>
                            </div>
                        </div>

                        <div className="mx-auto mt-2 w-[95%] h-[1px] bg-stone-700"></div>

                        <div className="flex flex-col gap-2 mt-2 text-[14px]">
                            <div className="flex flex-row items-center text-slate-100">
                                <div className="font-bold mr-4">Proprietário:</div>

                                <div className="flex flex-row items-center gap-1">
                                    {(userInfo != null) &&
                                        <>
                                            <Avatar className="navbar-avatar" alt="" img={(userInfo.avatar != null) ? userInfo.avatar : ""} bordered rounded />
                                            <h3 className="ms-1 text-sm text-white font-semibold">{userInfo.name}</h3>
                                        </>
                                    }
                                </div>
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
                </motion.div>
            }
        </AnimatePresence>

    );
}

export default PublicFileMenu;