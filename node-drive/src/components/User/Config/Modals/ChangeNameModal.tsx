import { Modal, Spinner } from "flowbite-react"
import { useContext, useState } from "react";
import { UserAuthContext } from "../../../../contexts/UserContext";
import { BiSolidError } from "react-icons/bi";
import { StatusType } from "../../../../types/Config";
import { FaCheck } from "react-icons/fa";
import { changeName } from "../../../../api/User";

type props = {
    showNameModal: boolean;
    setShowNameModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const ChangeNameModal = ({ showNameModal, setShowNameModal }: props) => {
    const userCtx = useContext(UserAuthContext)!;

    const [status, setStatus] = useState<StatusType>(null);
    const [newName, setNewName] = useState<string>("");

    const handleChangeNameBtn = async () => {
        if(newName == "") {
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
            setStatus("error");
        }
    }

    return (
        <Modal className="changeNameModal" show={showNameModal} dismissible={true} onClose={() => { setShowNameModal(false); }}>
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
                                onClick={() => { setShowNameModal(false); }}
                            >
                                Fechar
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

            <Modal.Header className="changeNameModal-header">

            </Modal.Header>

            <Modal.Body className="changeNameModal-body">
                <div className="flex flex-row gap-1">
                    <span className="font-bold">Nome atual:</span>
                    <div>{userCtx.user!.name}</div>
                </div>

                <input
                    className="my-1 w-full text-slate-800 border-l-0 border-t-0 border-r-0 border-b-2 border-b-gray-600/50 focus:ring-0 focus:ring-offset-0 focus:outline-none"
                    type="email"
                    value={newName} onChange={(e) => { setNewName(e.target!.value); }}
                    placeholder="Digite seu novo nome"
                />
                
                <div className="flex justify-center">
                    <button
                        className="mt-3 mx-auto px-4 py-1.5 bg-green-500 text-white rounded-md transition-all ease-in-out duration-150 hover:bg-green-600"
                        onClick={handleChangeNameBtn}
                    >
                        Alterar Nome
                    </button>
                </div>
            </Modal.Body>
        </Modal>
    );
}

export default ChangeNameModal;