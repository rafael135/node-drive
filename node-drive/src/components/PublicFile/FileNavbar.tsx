import { Link } from "react-router-dom";
import { useContext, useRef, useState } from "react";
import { Avatar, Dropdown } from "flowbite-react";
import { UserAuthContext } from "../../contexts/UserContext";

import { PublicFileInfo } from "../../types/File";
import { TfiDownload, TfiInfo } from "react-icons/tfi";
import { BsFillInfoCircleFill, BsFillInfoSquareFill, BsFillPersonFill, BsInfo, BsThreeDotsVertical } from "react-icons/bs";
import { FcViewDetails } from "react-icons/fc";

import { downloadPublicFile } from "../../api/Files";
import { PublicFileInterationContext } from "../../contexts/PublicFileInteractionContext";

type props = {
    fileInfo: PublicFileInfo | null;
    userId: number;
};

const FileNavbar = ({ fileInfo, userId }: props) => {

    const authCtx = useContext(UserAuthContext);
    const publicFileContext = useContext(PublicFileInterationContext)!;

    const handleDetailsMenu = () => {
        if(publicFileContext.event == "details") {
            publicFileContext.setEvent(null);
            return;
        }

        publicFileContext.setEvent("details");
    }

    const handleDownloadBtn = () => {
        downloadPublicFile(userId, fileInfo!);
    }

    return (
        <>
            <header className="headerFileNavbar">
                <Link to={"/"} className="navbar-logo">
                    NodeDrive
                </Link>

                <div className="w-[1px] h-[60%] bg-slate-500/40"></div>

                <div className="mx-auto flex-1 flex flex-row justify-start">
                    <h2 className="text-lg text-slate-200">
                        <strong>Nome:</strong> {fileInfo?.name}
                    </h2>
                </div>

                <button 
                    className="mx-2 p-2 flex justify-center items-center rounded-full transition-all ease-in-out duration-150 hover:bg-gray-600/50"
                    title="Download"
                    disabled={(fileInfo == null) ? true : false}
                    onClick={handleDownloadBtn}
                >
                    <TfiDownload className="fill-slate-200 w-[18px] h-[18px]" />
                </button>

                <Dropdown
                    color="dark"
                    dismissOnClick={true}
                    label={<TfiInfo  />}
                    renderTrigger={() => <button className="me-2 p-2 flex justify-center items-center rounded-full transition-all ease-in-out duration-150 hover:bg-gray-600/50">
                            <BsThreeDotsVertical className="fill-slate-200 w-auto h-5" />
                        </button>}
                    arrowIcon={false}
                    className="bg-stone-900 border border-solid border-stone-700"
                >
                    <Dropdown.Item
                        onClick={handleDetailsMenu}
                        className="flex flex-row gap-2 text-slate-200 hover:bg-stone-500/40 focus:bg-stone-500/40 active:bg-stone-500/60"
                    >
                        <BsFillInfoCircleFill className="fill-slate-200 w-4 h-4" />
                        Detalhes
                    </Dropdown.Item>
                </Dropdown>

                

                <div className="navbar-user">
                    <Dropdown arrowIcon={false} inline label={<Avatar className="navbar-avatar" alt="" img={(authCtx?.user?.avatar != null) ? authCtx!.user!.avatar! : ""} bordered rounded />}>
                        <Dropdown.Header>
                            {(authCtx?.user != null) &&
                                <>
                                    <span className="block text-sm">
                                        { authCtx.user.name }
                                    </span>
                                    <span className="block truncate text-sm font-medium">
                                        { authCtx.user.email }
                                    </span>
                                </>
                            }

                            {(authCtx?.user == null) &&
                                <>
                                    <span>Entre em sua conta!</span>
                                </>
                            }
                            
                        </Dropdown.Header>
                    
                        {(authCtx?.user != null) && 
                            <>
                                <Dropdown.Item href="/user/config">
                                    Configurações
                                </Dropdown.Item>

                                <Dropdown.Item href="/logout">
                                    Sair
                                </Dropdown.Item>
                            </>
                        }

                        {(authCtx?.user == null) &&
                            <Dropdown.Item href="/login">
                                Entrar
                            </Dropdown.Item>
                        }
                    
                    </Dropdown>
                </div>
            </header>
        </>
    );
}

export default FileNavbar;