import { Spinner } from "flowbite-react"
import { useContext, useRef, useState } from "react";
import { UserAuthContext } from "../../../../../contexts/UserContext";
import { BiSolidError } from "react-icons/bi";
import { StatusType } from "../../../../../types/Config";
import { FaCheck } from "react-icons/fa";
import { changeName } from "../../../../../api/User";
import { checkInputsErrors } from "../../../../../helpers/Input";
import Modal from "../../../../Molecules/Modal/Index";
import ModalHeader from "../../../../Molecules/Modal/ModalHeader";
import Button from "../../../../Atoms/Button/Index";
import TextInput from "../../../../Atoms/TextInput/Index";

type props = {
    showNameModal: boolean;
    setShowNameModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const ChangeNameModal = ({ showNameModal, setShowNameModal }: props) => {
    const userCtx = useContext(UserAuthContext)!;

    const [status, setStatus] = useState<StatusType>(null);
    const [newName, setNewName] = useState<string>("");

    const defaultPlaceholders = ["Digite seu novo nome"];

    const nameRef = useRef<HTMLInputElement | null>(null);

    const handleChangeNameBtn = async () => {
        if(newName == "") {
            let errors = [{ target: "newName", msg: "Nome não preenchido!"}];
            checkInputsErrors([nameRef!], defaultPlaceholders, errors);

            return;
        }


        setStatus("loading");

        let res = await changeName(newName);

        if(res.msg == "success") {
            setStatus("success");
            userCtx.setUser({...userCtx.user!, name: newName});

            setTimeout(() => {
                setShowNameModal(false);
            }, 3000);
            return;
        }

        if(res.msg == "unauthorized" || res.msg == "error") {
            setNewName("");
            checkInputsErrors([nameRef!], defaultPlaceholders, res.errors!);

            setStatus("error");
        }
    }

    return (
        <Modal className="changeNameModal" show={showNameModal} dismissible={true} closeFn={() => { setShowNameModal(false); }}>
            {(status != null) &&
                <div className="bg-white/60 absolute left-0 right-0 top-0 bottom-0 flex flex-col justify-center items-center">
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
                        </>
                    }
                </div>
            }

            <ModalHeader className="changeNameModal-header" closeFn={() => { setShowNameModal(false); }}>
                <p className="font-bold text-xl text-slate-800">Mudança de Nome</p>
            </ModalHeader>

            <div className="changeNameModal-body">
                <div className="flex flex-row gap-1">
                    <span className="font-bold">Nome atual:</span>
                    <div>{userCtx.user!.name}</div>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); }}>
                    <TextInput
                        type="text"
                        id="newName"
                        name="newName"
                        inputRef={nameRef}
                        value={newName} setValue={setNewName}
                        placeholder="Digite seu novo nome"
                    />
                
                
                    <div className="flex justify-center">
                        <Button
                            type="success"
                            className="mt-3 mx-auto px-4 py-1.5"
                            onClick={handleChangeNameBtn}
                        >
                            Alterar Nome
                        </Button>
                    </div>

                </form>
            </div>
        </Modal>
    );
}

export default ChangeNameModal;