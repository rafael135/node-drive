import { ReactNode, useEffect, useContext, useState } from "react";

import { BsFiles, BsHddFill, BsHddStackFill, BsShareFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import { Progress } from "flowbite-react";
import { UsedSpaceContext } from "../../../contexts/UsedSpaceContext";
import { UserAuthContext } from "../../../contexts/UserContext";
import Navbar from "../../Molecules/Navbar/Index";

type props = {
    children: ReactNode;
    activeTab: string | null;
}

const Layout = ({ children, activeTab }: props) => {
    const usedSpaceCtx = useContext(UsedSpaceContext)!;
    const userCtx = useContext(UserAuthContext)!;

    const [usePct, setUsePct] = useState<number>(0.0);

    const GbValue = 1000000000;

    useEffect(() => {
        setUsePct((usedSpaceCtx.usedSize / (userCtx.user!.maxStorage * GbValue)) * 100);
    }, [usedSpaceCtx.usedSize]);

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
                        <Link className={`layout-sidebar--item ${(activeTab == "sharedFiles") ? "active" : ""}`} to={"/shared"}>
                            <BsShareFill className="fill-gray-500" />
                            <p className="flex-1">Arquivos compartilhados</p>
                        </Link>
                    </div>
                    

                    <Link
                        className={`layout-sidebar--item storageType mt-auto ${(activeTab == "storageTypes") ? "active" : ""}`}
                        to={"/user/config"}
                        title={`Espaço usado: ${usePct.toFixed(2)}%`}
                    >
                        <div className="flex flex-row gap-2">
                            <BsHddStackFill className="fill-gray-500" />
                            <p className="flex-1">Espaço total usado</p>
                        </div>
                        
                        <Progress progress={usePct} className="layout-sidebar--spaceBar" />
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