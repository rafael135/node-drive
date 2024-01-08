import { useEffect, useRef, useState } from "react";
import { PublicFileType } from "../../../../types/File";
import Modal from "../../../Molecules/Modal/Index";
import ModalHeader from "../../../Molecules/Modal/ModalHeader";
import styled from "styled-components";
import { Tooltip } from "flowbite-react";
import { makeFilePublic } from "../../../../api/Files";
import { FolderPath } from "../../Home/Index";
import { UseQueryResult } from "@tanstack/react-query";
import { confirmModalAction } from "../Index";

const ModalBody = styled.div({
    padding: "1.5rem",
    flex: "1"
});

type props = {
    setConfirmModalAction: React.Dispatch<React.SetStateAction<confirmModalAction>>;
    publicFilesQuery: UseQueryResult;
    files: PublicFileType[];
    setFiles: React.Dispatch<React.SetStateAction<PublicFileType[]>>;
    selectedFile: PublicFileType | null;
    setSelectedFile: React.Dispatch<React.SetStateAction<PublicFileType | null>>;
};

const PublicFileDetailsModal = ({ setConfirmModalAction, publicFilesQuery, files, setFiles, selectedFile, setSelectedFile }: props) => {

    console.log(selectedFile!.location);

    const pathInfo: FolderPath = { path: "", setFolderPath: (v) => { } }

    const [show, setShow] = useState<boolean>(selectedFile != null);

    const pbLinkInputRef = useRef<HTMLInputElement | null>(null);
    const [pbLinkTooltipContent, setPbLinkTooltipContent] = useState<"Clique para copiar" | "Link copiado!">("Clique para copiar");

    const handleCopyUrl = (e: React.MouseEvent) => {
        //pbLinkInputRef.current!.select();
        //pbLinkInputRef.current!.setSelectionRange(0, 9999);

        navigator.clipboard.writeText(pbLinkInputRef.current!.value);

        setPbLinkTooltipContent("Link copiado!");

        setTimeout(() => {
            setPbLinkTooltipContent("Clique para copiar");
        }, 1500);
    }

    const handleClose = () => {
        setSelectedFile(null);
        setShow(false);
    }

    return (
        <Modal show={show} closeFn={handleClose} dismissible={true}>
            <ModalHeader closeFn={handleClose}>
                <p className="text-slate-800">Informações de: <strong>{selectedFile?.name}</strong></p>
            </ModalHeader>

            <ModalBody>
                <div className="customPbLinkTooltip flex flex-row gap-1">

                    <Tooltip
                        placement="top"
                        style="light"
                        content={pbLinkTooltipContent}
                        className="w-auto"
                    /*hidden={(fileDownloadLink == "") ? true : false}*/
                    >

                        <input
                            className="w-full"
                            type="text"
                            value={selectedFile!.shareLink}
                            readOnly={true}
                            /*disabled={(activeFile!.isPublic == false)}*/
                            ref={pbLinkInputRef}
                            onClick={handleCopyUrl}
                        />
                    </Tooltip>

                    <button
                        className={`text-white px-4 py-2 rounded-md bg-red-500 hover:bg-red-600`}
                        onClick={() => { setConfirmModalAction("changeFileVisibility"); setShow(false); }}

                    >
                        Privar
                    </button>
                </div>
            </ModalBody>
        </Modal>
    );
}

export default PublicFileDetailsModal;