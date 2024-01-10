import { useContext, useRef, useState } from "react";
import { Spinner } from "flowbite-react";
//import { changeAvatar } from "../../../../api/User";
import AxiosInstance from "../../../../../helpers/AxiosInstance";
import { UserAuthContext } from "../../../../../contexts/UserContext";
import { fileToBase64 } from "../../../../../helpers/File";
import { FaCheck } from "react-icons/fa";
import { BiSolidError } from "react-icons/bi";
import Modal from "../../../../Molecules/Modal/Index";
import ModalHeader from "../../../../Molecules/Modal/ModalHeader";
import Button from "../../../../Atoms/Button/Index";


type props = {
    showAvatarModal: boolean;
    setShowAvatarModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const ChangeAvatarModal = ({ showAvatarModal, setShowAvatarModal }: props) => {

    const authCtx = useContext(UserAuthContext)!;


    const [status, setStatus] = useState<"loading" | "success" | "error" | null>(null);
    const [avatarBase64, setAvatarBase64] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const [showConfirmBtn, setShowConfirmBtn] = useState<boolean>(false);

    const changeAvatar = async (file: File) => {
        setStatus("loading");

        const fileReader = new FileReader();
        fileReader.readAsArrayBuffer(file);

        type ChangeAvatarResponse = {
            base64Avatar?: string;
            status: number;
        }

        fileReader.addEventListener("load", async (e) => {
            let req = await AxiosInstance.put("/user/change/avatar", {
                newAvatar: e.target!.result
            }, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            let res: ChangeAvatarResponse = req.data;

            if((res.status >= 400 && res.status <= 406) || res.base64Avatar == null) {
                setStatus("error");

                return;
            }

            let usr = authCtx.user!;

            usr.avatar = res.base64Avatar;

            authCtx.setUser({ ...usr, avatar: usr.avatar });

            setShowConfirmBtn(false);
            setStatus("success");
        });
    }

    const handleImgSelected = async () => {
        if(fileInputRef.current!.files!.length == 0) {
            return;
        }

        setAvatarBase64((await fileToBase64(fileInputRef.current!.files!.item(0)!))!.toString());
        setShowConfirmBtn(true);
    }

    const handleBtnChangeAvatar = () => {
        changeAvatar(fileInputRef.current!.files!.item(0)!);
    }


    return (
        <Modal
            show={showAvatarModal}
            dismissible={true}
            closeFn={() => { setShowAvatarModal(false); }}
            className="changeAvatarModal"
        >

            {(status != null) &&
                <div className="bg-white/60 rounded-lg absolute left-0 right-0 top-0 bottom-0 flex flex-col justify-center items-center">
                    {(status == "loading") && 
                        <Spinner color="info" size="xl" />
                    }

                    {(status == "error") &&
                        <>
                            <BiSolidError className="w-10 h-10 fill-red-600" />
                            <h4 className="text-red-600 font-semibold text-lg">Ocorreu um erro!</h4>
                            <Button
                                type="error"
                                className="mt-1 px-4 py-1"
                                onClick={() => { setStatus(null); }}
                            >
                                Ok
                            </Button>
                        </>
                    }

                    {(status == "success") &&
                        <>
                            <FaCheck className="w-10 h-10 fill-green-600" />
                            <h4 className="text-green-600 font-semibold text-lg">Sucesso!</h4>
                            <Button
                                type="success"
                                className="mt-1 px-4 py-1"
                                onClick={() => { setStatus(null); }}
                            >
                                Ok
                            </Button>
                        </>
                    }
                </div>
            }

            <ModalHeader className="changeAvatarModal-header" closeFn={() => { setShowAvatarModal(false); }}>
                <p className="font-bold text-xl text-slate-800">Mudança de Avatar</p>
            </ModalHeader>

            <div className="changeAvatarModal-body">
                <form onSubmit={(e) => { e.preventDefault(); }}>
                    <input
                        type="file"
                        ref={fileInputRef}
                        multiple={false}
                        hidden={true}
                        accept="image/*"
                        id="avatar-input"
                        onChange={handleImgSelected}
                    />
                    <label className="avatarInput-label" htmlFor="avatar-input">
                        {(avatarBase64 == null) &&
                            <p>Clique para selecionar uma imagem</p>
                        }

                        {(avatarBase64 != null) &&
                            <img src={avatarBase64} className="aspect-auto max-h-[256px]" />
                        }
                        
                    </label>
                </form>

                {(showConfirmBtn == true) &&
                    <Button
                        type="success"
                        className="w-full mt-2 px-4 py-1.5"
                        onClick={handleBtnChangeAvatar}
                    >
                        Alterar Avatar
                    </Button>
                }
            </div>
        </Modal>
    );
}

export default ChangeAvatarModal;