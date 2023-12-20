import { ReactNode } from "react";

import { BsFiles, BsHddFill, BsHddStackFill, BsShareFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import { Progress } from "flowbite-react";
import Navbar from "../../Molecules/Navbar/Index";

type props = {
    children: ReactNode;
}

const PublicLayout = ({ children }: props) => {
    return (
        <>
            <Navbar />


            <div className="mainPublicLayout-container">
                <div className="publicLayout-sidebar">
                    
                </div>

                <main>
                    { children }
                </main>
            </div>
        </>
    );
}

export default PublicLayout;