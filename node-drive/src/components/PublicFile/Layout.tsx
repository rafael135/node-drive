import { ReactNode, useContext } from "react";
import FileNavbar from "./FileNavbar";
import { PublicFileInfo } from "../../types/File";
import { PublicFileContextProvider, PublicFileInterationContext } from "../../contexts/PublicFileInteractionContext";

type props = {
    children: ReactNode;
    fileInfo: PublicFileInfo | null;
    userId: number;
}

const Layout = ({ children, fileInfo, userId }: props) => {
    return (
        <>
            <FileNavbar fileInfo={fileInfo} userId={userId} />


            <div className="mainPublicFileLayout-container">
                <div className="publicFileLayout-sidebar">
                    
                </div>

                <main>
                    { children }
                </main>
            </div>
        </>
    );
}

export default Layout;