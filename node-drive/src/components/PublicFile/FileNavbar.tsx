import { Link } from "react-router-dom";
import { useContext, useRef, useState } from "react";
import { Avatar, Dropdown } from "flowbite-react";
import { UserAuthContext } from "../../contexts/UserContext";

import { BsFillPersonFill } from "react-icons/bs";
import { PublicFileInfo } from "../../types/File";
import { TfiDownload } from "react-icons/tfi";
import { downloadPublicFile } from "../../api/Files";

type props = {
    fileInfo: PublicFileInfo | null;
    userId: number;
};

const FileNavbar = ({ fileInfo, userId }: props) => {

    const authCtx = useContext(UserAuthContext);



    const handleDownloadBtn = () => {
        downloadPublicFile(userId, fileInfo!);
    }

    return (
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

            <div className="navbar-user">
                <Dropdown arrowIcon={false} inline label={<Avatar className="navbar-avatar" alt="" img="" bordered rounded />}>
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
    );
}

export default FileNavbar;