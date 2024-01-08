import styled from "styled-components";
import { UserContextType } from "../../../contexts/UserContext";
import UserPublicFilesToolbar from "./UserPublicFilesToolbar";
import { useUserPublicFiles, useUserPublicFilesQte } from "../../../utils/Queries";
import { useEffect, useLayoutEffect, useState } from "react";
import { PublicFileInfo, PublicFileType } from "../../../types/File";
import { Spinner } from "flowbite-react";
import PublicFile from "../../Molecules/PublicFile/Index";
import PublicFileDetailsModal from "./Modals/PublicFileDetailsModal";
import { sleep } from "../../../helpers/PathOps";
import { makeFilePublic } from "../../../api/Files";
import ConfirmationModal from "../../Organisms/ConfirmationModal/Index";

const PublicFilesSection = styled.section({
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    overflowY: "auto"
});

const PublicFilesTitle = styled.h1({
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "18px",
    fontWeight: "bold",
    borderStyle: "solid",
    borderTopWidth: "1px",
    borderTopColor: "rgb(75 85 99 / 0.2)",
    backgroundColor: "rgb(249 250 251)",
    padding: "0.8rem",
    color: "rgb(30 41 59)"
});

const PublicFilesContainer = styled.div({
    position: "relative",
    flex: "1",
    display: "flex",
    alignContent: "flex-start",
    flexWrap: "wrap",
    gap: "0.75rem",
    padding: "1.5rem"
});

type props = {
    userCtx: UserContextType;
};

export type confirmModalAction = "changeFileVisibility" | null;

const UserPublicFiles = ({ userCtx }: props) => {
    const publicFiles = useUserPublicFiles(userCtx.user!.id);
    const maxSharedFiles = useUserPublicFilesQte();


    const [files, setFiles] = useState<PublicFileType[]>([]);
    const [sharedFiles, setSharedFiles] = useState<number | null>(null);
    const [maxFiles, setMaxFiles] = useState<number | null>(-1);

    const [selectedFile, setSelectedFile] = useState<PublicFileType | null>(null);

    // Modal de confirmassão
    const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
    const [confirmModalAction, setConfirmModalAction] = useState<confirmModalAction>(null);
    const [confirmOnYes, setConfirmOnYes] = useState<(() => void) | (() => Promise<void>) | null>(null);
    //const [confirmOnNo, setConfirmOnNo] = useState<(() => void) | (() => Promise<void>) | null>(null);

    const handleBtnReloadFiles = () => {
        publicFiles.refetch();
        maxSharedFiles.refetch();
    }

    const handleCloseModal = () => {
        setSelectedFile(null);
        setShowConfirmModal(false);
        setConfirmOnYes(null);
        setConfirmModalAction(null);
    }

    const changeFileVisibility = async () => {
        let idx = files.indexOf(selectedFile!);

        let res = await makeFilePublic({ path: "", setFolderPath: (v) => {} }, selectedFile!.location);

        let filesCopy = files;

        if (res == null) {
            setSelectedFile(null);
            return;
        }

        let activeFileCopy = selectedFile!;

        handleCloseModal();
        publicFiles.refetch();
    }

    useEffect(() => {
        if(publicFiles.data != undefined) {
            setFiles(publicFiles.data.files ?? []);
            setSharedFiles(publicFiles.data.sharedFiles);
        }

        if(maxSharedFiles.data != -1) {
            setMaxFiles(maxSharedFiles.data ?? null);
        }

        if(showConfirmModal == false) {
            setConfirmModalAction(null);
        }

        switch(confirmModalAction) {
            case "changeFileVisibility":
                setConfirmOnYes(() => changeFileVisibility);
                setShowConfirmModal(true);
                break;
        }

        //console.log(confirmModalAction);
    }, [publicFiles.data, maxSharedFiles.data, confirmModalAction, showConfirmModal]);

    return (
        <>
            {(selectedFile != null) &&
                <PublicFileDetailsModal setConfirmModalAction={setConfirmModalAction} publicFilesQuery={publicFiles} files={files} setFiles={setFiles} selectedFile={selectedFile} setSelectedFile={setSelectedFile} />
            }

            {(showConfirmModal == true) &&
                <ConfirmationModal msg="Tem certeza de que deseja tornar o arquivo selecionado privado?" show={showConfirmModal} setShow={setShowConfirmModal} onYes={confirmOnYes!} />
            }



            <PublicFilesSection>
                <PublicFilesTitle>
                    Arquivos Compartilhados
                </PublicFilesTitle>

                <UserPublicFilesToolbar publicFilesQuery={publicFiles} maxSharedFilesQuery={maxSharedFiles} reloadFiles={handleBtnReloadFiles} sharedFiles={sharedFiles} maxSharedFiles={maxFiles} />

                <PublicFilesContainer className={`${(files.length == 0) ? "justify-center items-center" : ""}`}>
                    {(publicFiles.isLoading == true) &&
                        <div className="absolute top-0 bottom-0 left-0 right-0 flex justify-center items-center bg-black/10">
                            <Spinner className="w-14 h-auto fill-blue-600" />
                        </div>
                    }

                    {(sharedFiles == 0 && publicFiles.isLoading == false) &&
                        <span className="text-slate-800 text-xl">Você não possui nenhum arquivo público</span>
                    }

                    {(files.length > 0 && publicFiles.isSuccess == true) &&
                        files.map((file, idx) => {
                            return <PublicFile key={idx} publicFile={file} setSelectedFile={setSelectedFile} />
                        })
                    }
                </PublicFilesContainer>
            </PublicFilesSection>
        </>
    );
}

export default UserPublicFiles;