import { useState } from "react";
import { PublicFileType } from "../../../types/File";
import Button from "../../Atoms/Button/Index";
import Modal from "../../Molecules/Modal/Index";
import ModalFooter from "../../Molecules/Modal/ModalFooter";


type props = {
    msg: string;
    show: boolean;
    setShow: React.Dispatch<React.SetStateAction<boolean>>;
    onYes: (() => void) | (() => Promise<void>);
};

const ConfirmationModal = ({ msg, show, setShow, onYes }: props) => {

    return (
        <Modal show={show} closeFn={() => setShow(false)} dismissible={false}>
            <div className="p-4 flex flex-col">
                <p className="">
                    {msg}
                </p>
            </div>

            <ModalFooter className="gap-2">
                <Button className="flex-1 py-1.5" type="success" onClick={onYes}>
                    Sim
                </Button>

                <Button className="flex-1 py-1.5" type="error" onClick={() => setShow(false)}>
                    Não
                </Button>
            </ModalFooter>
        </Modal>
    );
}

export default ConfirmationModal;