import { useRef, useState } from "react";
import { Label } from "flowbite-react";
import { createNewFolder } from "../../../../api/Files";
import { FolderPath } from "../Index";
import Modal from "../../../Molecules/Modal/Index";
import TextInput from "../../../Atoms/TextInput/Index";
import Button from "../../../Atoms/Button/Index";

type props = {
    getFiles: () => Promise<void>;
    pathInfo: FolderPath;
    setToastMsgType: React.Dispatch<React.SetStateAction<"error" | "info" | "warning" | "success">>;
    setToastMsg: React.Dispatch<React.SetStateAction<string>>;
    setShowToast: React.Dispatch<React.SetStateAction<boolean>>;
    showNewFolderModal: boolean;
    setShowNewFolderModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const NewFolderModal = ({ getFiles, pathInfo, setToastMsgType, setToastMsg, setShowToast, showNewFolderModal, setShowNewFolderModal }: props) => {

    const [newFolderName, setNewFolderName] = useState<string>("");

    const newFolderFormRef = useRef(null);



    const handleNewFolder = async () => {
        if(newFolderName == "") {
            return;
        }

        let result = await createNewFolder(pathInfo.path, newFolderName);

        if(result == true) {
            setToastMsgType("success");
            setToastMsg(`Pasta ${newFolderName} criada com sucesso!`);
            setShowToast(true);

            setShowNewFolderModal(false);
            setNewFolderName("");

            getFiles();
        } else {
            await getFiles();

            setToastMsgType("error");
            setToastMsg(`Não foi possível criar a pasta "${newFolderName}"!`);
            setShowToast(true);

            setShowNewFolderModal(false);
            setNewFolderName("");
        }
    }

    return (
        <Modal show={showNewFolderModal == true} className="newFolderModal" dismissible={true} closeFn={() => { setShowNewFolderModal(false); }}>
            <div className="newFolderModal-body">
                <form ref={newFolderFormRef} onSubmit={(e) => { e.preventDefault(); handleNewFolder(); }}>
                    <Label 
                        htmlFor="folderName"
                        value="Nome da pasta:"
                    />
                    <TextInput
                        type="text"
                        id="folderName"
                        name="folderName"
                        placeholder=""
                        value={ newFolderName }
                        setValue={setNewFolderName}
                        className="flex flex-1"
                        inputRef={newFolderFormRef}
                    />
                    <Button
                        onClick={handleNewFolder}
                        className="!px-3 !py-2"
                    >
                        Criar
                    </Button>
                </form>
            </div>
        </Modal>
    );
}

export default NewFolderModal;