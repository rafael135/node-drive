import { ReactNode } from "react";
import Navbar from "./Navbar/Navbar";
import { BsHddFill, BsShareFill } from "react-icons/bs";
import { Link } from "react-router-dom";

type props = {
    children: ReactNode;
    activeTab: string | null;
}

const Layout = ({ children, activeTab }: props) => {
    return (
        <>
            <Navbar />


            <div className="layout-container">
                <div className="layout-sidebar">
                    <Link className={`layout-sidebar--item ${(activeTab == "files") ? "active" : ""}`} to={"/"}>
                        <BsHddFill className="fill-gray-500" />
                        <p className="flex-1">Meus arquivos</p>
                    </Link>
                    <Link className={`layout-sidebar--item ${(activeTab == "sharedFiles") ? "active" : ""}`} to={"/files/shared"}>
                        <BsShareFill className="fill-gray-500" />
                        <p className="flex-1">Arquivos compartilhados</p>
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