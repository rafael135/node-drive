//import { Avatar } from "flowbite-react";
import { useContext, useEffect, useRef, useState } from "react";

import { RiFileUserFill } from "react-icons/ri";
import { BsPersonFill } from "react-icons/bs";
import { UserAuthContext } from "../../../../contexts/UserContext";
import ChangeAvatarModal from "./Modals/ChangeAvatarModal";
import ChangeNameModal from "./Modals/ChangeNameModal";
import ChangeEmailModal from "./Modals/ChangeEmailModal";
import { StorageType } from "../../../../types/User";
import PlanCard from "../../../Molecules/PlanCard/Index";
import { useStorageTypes } from "../../../../utils/Queries";
import styled from "styled-components";

const StoragePlansContainer = styled.section({
    width: "100%",
    height: "auto",
    padding: "0.5rem",
    marginBottom: "0.5rem",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "rgb(243 244 246)",
    borderTopWidth: "0",
    borderBottomWidth: "1px",
    borderLeftWidth: "1px",
    borderRightWidth: "1px",
    borderColor: "rgb(75 85 99 / 0.2)",
    borderBottomLeftRadius: "0.5rem",
    borderBottomRightRadius: "0.5rem"
});

const StoragePlansTitle = styled.h1({
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "28px",
    fontWeight: "bold",
    borderStyle: "solid",
    borderWidth: "1px",
    borderColor: "rgb(75 85 99 / 0.2)",
    borderTopLeftRadius: "0.5rem",
    borderTopRightRadius: "0.5rem",
    backgroundColor: "rgb(249 250 251)",
    padding: "0.8rem",
    color: "rgb(30 41 59)"
});


const Config = () => {
    const userCtx = useContext(UserAuthContext)!;


    const changeAvatarRef = useRef<HTMLDivElement | null>(null);
    const [showAvatarModal, setShowAvatarModal] = useState<boolean>(false);

    const [showNameModal, setShowNameModal] = useState<boolean>(false);
    const [showEmailModal, setShowEmailModal] = useState<boolean>(false);

    /*
    const [confirmModalAction, setConfirmModalAction] = useState<"changeAvatar" | "changeName" | "changeEmail" | null>(null);
    const [confirmModalMsg, setConfirmModalMsg] = useState<string>("");
    const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
    const [onYesAction, setOnYesAction] = useState<(() => void) | null>(null);
    */

    const storageTypes = useStorageTypes();

    


    const handleAvatarMouseHover = () => {
        changeAvatarRef.current!.classList.add("show");
    }

    const handleAvatarMouseOut = () => {
        changeAvatarRef.current!.classList.remove("show");
    }

    const handleShowChangeAvatar = () => {
        setShowAvatarModal(true);
    }

    const handleShowChangeName = () => {
        setShowNameModal(true);
    }

    const handleShowChangeEmailModal = () => {
        setShowEmailModal(true);
    }

    const handleChangeName = (newName: string) => {

    }

    const handleChangeEmail = (newEmail: string, password: string) => {

    }

    const handleChangeAvatar = () => {

    }

    /*
    useEffect(() => {

        if(showConfirmModal == false) {
            setConfirmModalAction(null);
        }

        switch(confirmModalAction) {
            case "changeAvatar":

                break;
            case "changeEmail":

                break;
            case "changeName":

                break;
        }

    }, [showConfirmModal, confirmModalAction]);
    */
    

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
                <StoragePlansTitle>
                    Planos de Armazenamento
                </StoragePlansTitle>
                <StoragePlansContainer>
                    {(storageTypes.isSuccess == true) &&
                        <>
                            {storageTypes.data.map((plan, idx) => {
                                return <PlanCard key={idx} storagePlan={plan} />
                            })}
                        </>
                    }

                    {(storageTypes.isSuccess == false) &&
                        <div className="w-full h-80"></div>
                    }

                    
                    
                </StoragePlansContainer>

                <div className="userInfoContainer">
                    <div className="userInfo">
                        <div
                            className={`userAvatar ${(userCtx.user!.avatar == null) ? "flex justify-center items-center" : ""}`}
                            onMouseOver={handleAvatarMouseHover}
                            onMouseOut={handleAvatarMouseOut}
                        >
                            <div
                                className={`changeAvatar transition-all ease-in-out duration-150`}
                                ref={changeAvatarRef}
                                onClick={handleShowChangeAvatar}
                                title="Mudar Avatar"
                            >
                                <RiFileUserFill className="w-6 h-6 fill-white/80" />
                            </div>

                            {(userCtx.user!.avatar == null) &&
                                <BsPersonFill className="lg:w-16 lg:h-16 mt-8 fill-gray-700" />
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
                                    onClick={handleShowChangeName}
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