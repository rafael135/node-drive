import { useContext, useState } from "react";
import { Spinner } from "flowbite-react";
//import { changeAvatar } from "../../../../api/User";
import AxiosInstance from "../../../../helpers/AxiosInstance";
import { UserAuthContext } from "../../../../contexts/UserContext";
import { fileToBase64 } from "../../../../helpers/File";
import { FaCheck } from "react-icons/fa";
import { BiSolidError } from "react-icons/bi";
import Modal from "../../../Molecules/Modal/Index";
import ModalHeader from "../../../Molecules/Modal/ModalHeader";


type props = {
    showAvatarModal: boolean;
    setShowAvatarModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const ChangeAvatarModal = ({ showAvatarModal, setShowAvatarModal }: props) => {

    const authCtx = useContext(UserAuthContext)!;


    const [status, setStatus] = useState<"loading" | "success" | "error" | null>(null);
    const [avatarBase64, setAvatarBase64] = useState<string | null>(null);

    const changeAvatar = async (file: File) => {

        setAvatarBase64((await fileToBase64(file))!.toString());

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

            setStatus("success");
        });
    }

    const handleImgSelected = (e: React.ChangeEvent) => {
        let fileInput = e.target as HTMLInputElement;

        if(fileInput.files!.length == 0) {
            return;
        }

        changeAvatar(fileInput.files!.item(0)!);
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
                            <button
                                className="mt-1 px-4 py-1 text-white bg-red-500 rounded-md hover:bg-red-600 active:bg-red-700"
                                onClick={() => { setStatus(null); }}
                            >
                                Ok
                            </button>
                        </>
                    }

                    {(status == "success") &&
                        <>
                            <FaCheck className="w-10 h-10 fill-green-600" />
                            <h4 className="text-green-600 font-semibold text-lg">Sucesso!</h4>
                            <button
                                className="mt-1 px-4 py-1 text-white bg-green-500 rounded-md hover:bg-green-600 active:bg-green-700"
                                onClick={() => { setStatus(null); }}
                            >
                                Ok
                            </button>
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
            </div>
        </Modal>
    );
}

export default ChangeAvatarModal;