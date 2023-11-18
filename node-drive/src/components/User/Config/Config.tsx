import { Avatar } from "flowbite-react";
import { useContext, useRef, useState } from "react";
import { UserAuthContext } from "../../../contexts/UserContext";
import { BsPersonFill } from "react-icons/bs";
import ChangeAvatarModal from "./Modals/ChangeAvatarModal";



const Config = () => {
    const userCtx = useContext(UserAuthContext)!;


    const changeAvatarRef = useRef<HTMLDivElement | null>(null);
    const [showAvatarModal, setShowAvatarModal] = useState<boolean>(false);



    const handleAvatarMouseHover = () => {
        changeAvatarRef.current!.classList.add("show");
    }

    const handleAvatarMouseOut = () => {
        changeAvatarRef.current!.classList.remove("show");
    }

    const handleChangeAvatar = () => {
        setShowAvatarModal(true);
    }


    return (
        <>
            {(showAvatarModal == true) &&
                <ChangeAvatarModal showAvatarModal={showAvatarModal} setShowAvatarModal={setShowAvatarModal} />
            }

            <div className="p-4">
                <div className="userInfoContainer">
                    <div className="storagePlans">
                        <div className="storagePlan">
                            <span className="plan-title"></span>
                        </div>

                        <div className="storagePlan">
                            <span className="plan-title"></span>
                        </div>

                        <div className="storagePlan">
                            <span className="plan-title"></span>
                        </div>
                    </div>

                    <div className="userInfo">
                        <div
                            className="userAvatar"
                            onMouseOver={handleAvatarMouseHover}
                            onMouseOut={handleAvatarMouseOut}
                        >
                            <div
                                className="changeAvatar"
                                ref={changeAvatarRef}
                                onClick={handleChangeAvatar}
                                title="Mudar Avatar"
                            >

                            </div>

                            {(userCtx.user!.avatar == null) &&
                                <BsPersonFill className="lg:w-16 lg:h-16 mt-4 fill-gray-700" />
                            }

                            {(userCtx.user!.avatar != null) &&
                                <img src={userCtx.user!.avatar} alt={userCtx.user!.name} className="lg:w-16 lg:h-16" />
                            }
                            
                        </div>

                        <div className="flex flex-col justify-center py-1">
                            <h2 className="text-xl font-semibold text-slate-800">{userCtx.user!.name}</h2>
                            <h4 className="text-base font-semibold text-gray-600">{userCtx.user!.email}</h4>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}


export default Config;