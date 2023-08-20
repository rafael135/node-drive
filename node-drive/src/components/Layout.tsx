import { ReactNode } from "react";
import Navbar from "./Navbar/Navbar";
import { BsHddFill } from "react-icons/bs";

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
                    <div className={`layout-sidebar--item ${(activeTab == "files") ? "active" : ""}` }>
                        <BsHddFill className="fill-gray-500" />
                        Meus arquivos
                    </div>
                </div>

                <main>
                    { children }
                </main>
            </div>
        </>
    );
}

export default Layout;