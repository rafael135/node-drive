import { ReactNode } from "react";
import Navbar from "../../Molecules/Navbar/Index";



type props = {
    children: ReactNode;
};

const UserLayout = ({ children }: props) => {


    return (
        <>
            <Navbar />


            <div className="userLayout-container">
                <main>
                    { children }
                </main>
            </div>
        </>
    )
}


export default UserLayout;