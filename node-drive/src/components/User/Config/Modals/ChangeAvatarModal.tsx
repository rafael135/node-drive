import { useContext } from "react";
import { Modal } from "flowbite-react";
//import { changeAvatar } from "../../../../api/User";
import AxiosInstance from "../../../../helpers/AxiosInstance";
import { UserAuthContext } from "../../../../contexts/UserContext";


type props = {
    showAvatarModal: boolean;
    setShowAvatarModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const ChangeAvatarModal = ({ showAvatarModal, setShowAvatarModal }: props) => {

    const authCtx = useContext(UserAuthContext)!;

    const changeAvatar = (file: File) => {
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
                return;
            }

            let usr = authCtx.user!;

            usr.avatar = res.base64Avatar;
            console.log(usr);

            authCtx.setUser({ ...usr, avatar: usr.avatar });
            console.log(authCtx.user);
        });
    }

    const handleImgSelected = (e: React.ChangeEvent) => {
        let fileInput = e.target as HTMLInputElement;

        if(fileInput.files?.length == 0) {
            return;
        }

        changeAvatar(fileInput.files!.item(0)!);
    }


    return (
        <Modal
            show={showAvatarModal}
            dismissible={true}
            onClose={() => { setShowAvatarModal(false); }}
            className="changeAvatarModal"
        >
            <Modal.Header className="changeAvatarModal-header"></Modal.Header>

            <Modal.Body className="changeAvatarModal-body">
                <input
                    type="file"
                    multiple={false}
                    hidden={true}
                    id="avatar-input"
                    onChange={handleImgSelected}
                />
                <label className="avatarInput-label" htmlFor="avatar-input">
                    <p>Clique para selecionar uma imagem</p>
                </label>
            </Modal.Body>
        </Modal>
    );
}

export default ChangeAvatarModal;