import { ReactNode } from "react";
import Navbar from "./Navbar/Navbar";
import { BsFiles, BsHddFill, BsHddStackFill, BsShareFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import { Progress } from "flowbite-react";

type props = {
    children: ReactNode;
    activeTab: string | null;
}

const Layout = ({ children, activeTab }: props) => {
    return (
        <>
            <Navbar />


            <div className="mainLayout-container">
                <div className="layout-sidebar">
                    <div className="link-container">
                        <Link className={`layout-sidebar--item ${(activeTab == "files") ? "active" : ""}`} to={"/"}>
                            <BsFiles className="fill-gray-500" />
                            <p className="flex-1">Meus arquivos</p>
                        </Link>
                        <Link className={`layout-sidebar--item ${(activeTab == "sharedFiles") ? "active" : ""}`} to={"/files/shared"}>
                            <BsShareFill className="fill-gray-500" />
                            <p className="flex-1">Arquivos compartilhados</p>
                        </Link>
                    </div>
                    

                    <Link className={`layout-sidebar--item storageType mt-auto ${(activeTab == "storageTypes") ? "active" : ""}`} to={"/user/config"}>
                        <div className="flex flex-row gap-2">
                            <BsHddStackFill className="fill-gray-500" />
                            <p className="flex-1">Espaço total usado</p>
                        </div>

                        
                            <Progress progress={20} className="flex flex-1 text-blue-500" />
                        
                    </Link>
                </div>

                <main>
                    { children }
                </main>
            </div>
        </>
    );
}

export default Layout;