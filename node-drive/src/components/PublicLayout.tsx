import { ReactNode } from "react";
import Navbar from "./Navbar/Navbar";
import { BsFiles, BsHddFill, BsHddStackFill, BsShareFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import { Progress } from "flowbite-react";

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