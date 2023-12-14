import { Avatar } from "flowbite-react";
import { useContext, useRef, useState } from "react";
import { UserAuthContext } from "../../../contexts/UserContext";
import { RiFileUserFill } from "react-icons/ri";
import { BsPersonFill } from "react-icons/bs";
import ChangeAvatarModal from "./Modals/ChangeAvatarModal";
import ChangeNameModal from "./Modals/ChangeNameModal";
import ChangeEmailModal from "./Modals/ChangeEmailModal";



const Config = () => {
    const userCtx = useContext(UserAuthContext)!;


    const changeAvatarRef = useRef<HTMLDivElement | null>(null);
    const [showAvatarModal, setShowAvatarModal] = useState<boolean>(false);

    const [showNameModal, setShowNameModal] = useState<boolean>(false);
    const [showEmailModal, setShowEmailModal] = useState<boolean>(false);



    const handleAvatarMouseHover = () => {
        changeAvatarRef.current!.classList.add("show");
    }

    const handleAvatarMouseOut = () => {
        changeAvatarRef.current!.classList.remove("show");
    }

    const handleChangeAvatar = () => {
        setShowAvatarModal(true);
    }

    const handleChangeName = () => {
        setShowNameModal(true);
    }

    const handleShowChangeEmailModal = () => {
        setShowEmailModal(true);
    }

    const handleChangeEmail = (newEmail: string, password: string) => {

    }


    return (
        <>
            {(showAvatarModal == true) &&
                <ChangeAvatarModal showAvatarModal={showAvatarModal} setShowAvatarModal={setShowAvatarModal} />
            }

            {(showNameModal == true) &&
                <ChangeNameModal showNameModal={showNameModal} setShowNameModal={setShowNameModal} />
            }

            {(showEmailModal == true) &&
                <ChangeEmailModal showEmailModal={showEmailModal} setShowEmailModal={setShowEmailModal} />
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
                                className="changeAvatar transition-all ease-in-out duration-150"
                                ref={changeAvatarRef}
                                onClick={handleChangeAvatar}
                                title="Mudar Avatar"
                            >
                                <RiFileUserFill className="w-6 h-6 fill-white/80" />
                            </div>

                            {(userCtx.user!.avatar == null) &&
                                <BsPersonFill className="lg:w-16 lg:h-16 mt-4 fill-gray-700" />
                            }

                            {(userCtx.user!.avatar != null) &&
                                <img src={userCtx.user!.avatar} alt={userCtx.user!.name} className="w-20 h-20" />
                            }
                            
                        </div>

                        <div className="flex flex-col gap-0.5 justify-center py-1">
                            <div className="w-full flex flex-row gap-2 items-center">
                                <h2 className="text-2xl font-semibold text-slate-800">{userCtx.user!.name}</h2>
                                <span
                                    className="py-0.5 px-1 text-xs font-normal text-blue-600 underline rounded-md cursor-pointer transition-all ease-in-out duration-150 hover:bg-black/10 active:text-blue-700 active:bg-black/20"
                                    onClick={handleChangeName}
                                >
                                    Mudar Nome
                                </span>
                            </div>

                            <div className="w-full flex flex-row gap-2 items-center">
                                <h4 className="text-lg font-semibold text-gray-600">{userCtx.user!.email}</h4>
                                <span
                                    className="py-0.5 px-1 text-xs font-normal text-blue-600 underline rounded-md cursor-pointer transition-all ease-in-out duration-150 hover:bg-black/10 active:text-blue-700 active:bg-black/20"
                                    onClick={handleShowChangeEmailModal}
                                >
                                    Mudar E-mail
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}


export default Config;