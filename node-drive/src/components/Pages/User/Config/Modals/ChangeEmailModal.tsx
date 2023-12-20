import { Spinner } from "flowbite-react"
import { useContext, useRef, useState } from "react";
import { BiSolidError } from "react-icons/bi";
import { FaCheck } from "react-icons/fa";
import { UserAuthContext } from "../../../../../contexts/UserContext";
import { changeEmail } from "../../../../../api/User";
import { checkInputsErrors } from "../../../../../helpers/Input";
import { InputErrorType } from "../../../../../types/Config";
import Modal from "../../../../Molecules/Modal/Index";
import ModalHeader from "../../../../Molecules/Modal/ModalHeader";
import TextInput from "../../../../Atoms/TextInput/Index";
import Button from "../../../../Atoms/Button/Index";

type props = {
    showEmailModal: boolean;
    setShowEmailModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const ChangeEmailModal = ({ showEmailModal, setShowEmailModal }: props) => {
    const userCtx = useContext(UserAuthContext)!;

    const [newEmail, setNewEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const defaultPlaceholders = ["Digite seu novo E-mail", "Confirme sua Senha"];

    const emailRef = useRef<HTMLInputElement | null>(null);
    const passwordRef = useRef<HTMLInputElement | null>(null);


    const [status, setStatus] = useState<"loading" | "success" | "error" | null>(null);

    const handleChangeEmailBtn = async () => {
        if(newEmail == "" || password == "") {
            let errors: InputErrorType[] = [
                { target: "newEmail", msg: "E-mail não preenchido!" },
                { target: "password", msg: "Senha não preenchida!" }
            ];

            checkInputsErrors([emailRef!, passwordRef!], defaultPlaceholders, errors);

            return;
        }

        if(!newEmail.match(/(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@[*[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+]*/)) {
            let errors: InputErrorType[] = [
                { target: "newEmail", msg: "E-mail inválido!" }
            ];

            setNewEmail("");
            checkInputsErrors([emailRef], defaultPlaceholders, errors);

            return;
        }

        setStatus("loading");

        let res = await changeEmail(newEmail, password);

        if(res.msg == "success") {
            setStatus("success");
            userCtx.setUser({ ...userCtx.user!, email: res.data! });

            setTimeout(() => {
                setShowEmailModal(false);
            }, 3000);
            return;
        }

        if(res.msg == "unauthorized" || res.msg == "error") {
            //setNewEmail("");
            setPassword("");

            checkInputsErrors([emailRef!, passwordRef!], defaultPlaceholders, res.errors!);

            setStatus("error");
        }
    }

    return (
        <Modal className="changeEmailModal" show={showEmailModal} dismissible={true} closeFn={() => { setShowEmailModal(false); }}>
            {(status != null) &&
                <div className="bg-white/60 absolute left-0 right-0 top-0 bottom-0 flex flex-col justify-center items-center">
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
                        </>
                    }
                </div>
            }

            <ModalHeader className="changeEmailModal-header" closeFn={() => { setShowEmailModal(false); }}>
                <p className="font-bold text-xl text-slate-800">Mudança de E-mail</p>
            </ModalHeader>

            <div className="changeEmailModal-body">
                <div className="flex flex-row gap-1">
                    <span className="font-bold">E-mail atual:</span>
                    <div>{userCtx.user!.email}</div>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); }}>
                    <TextInput
                        className="my-1 w-full text-slate-800 border-l-0 border-t-0 border-r-0 border-b-2 border-b-gray-600/50 focus:ring-0 focus:ring-offset-0 focus:outline-none"
                        type="email"
                        id="newEmail"
                        name="newEmail"
                        value={newEmail} setValue={setNewEmail}
                        inputRef={emailRef}
                        placeholder="Digite seu novo E-mail"
                    />

                    <TextInput
                        className="mt-1 w-full text-slate-800 border-l-0 border-t-0 border-r-0 border-b-2 border-b-gray-600/50 focus:ring-0 focus:ring-offset-0 focus:outline-none"
                        type="password"
                        id="password"
                        name="password"
                        value={password} setValue={setPassword}
                        inputRef={passwordRef}
                        placeholder="Confirme sua senha"
                    />
                    
                    <div className="flex justify-center">
                        <button
                            className="mt-3 mx-auto px-4 py-1.5 bg-green-500 text-white rounded-md transition-all ease-in-out duration-150 hover:bg-green-600"
                            onClick={handleChangeEmailBtn}
                        >
                            Alterar E-mail
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}

export default ChangeEmailModal;