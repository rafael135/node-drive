import { FileDataType, FileType } from "../../../types/File";
import { SetStateAction, useEffect, useRef } from "react";
import AxiosInstance, { baseUrl } from "../../../helpers/AxiosInstance";
import Modal from "../../Modal/Modal";
import ModalHeader from "../../Modal/ModalHeader";

type props = {
    activeFile: FileType;
    fileData: FileDataType | null;
    setFileData: React.Dispatch<SetStateAction<FileDataType | null>>;
    showFileData: boolean;
    setShowFileData: React.Dispatch<React.SetStateAction<boolean>>;
}

const ShowFileDataModal = ({ activeFile, fileData, showFileData, setShowFileData }: props) => {

    const videoRef = useRef<HTMLVideoElement | null>(null);

    /*
    useEffect(() => {
        console.log(fileData);
    }, [fileData]);
    */

    /*
    useEffect(() => {
        if(videoRef != null) {
            videoRef.current?.pause();
            videoRef.current?.load();
        }
    }, [videoRef]);
    */

    return (
        <Modal show={showFileData} className="selectedFileViewDataModal flex justify-center items-center" dismissible={true} closeFn={ () => { setShowFileData(false);  } }>
            <ModalHeader className="selectedFileViewDataModal-header" closeFn={() => { setShowFileData(false); }}>
                <p>Visualizando <span className="font-thin">{activeFile.name}</span></p>
            </ModalHeader>
    
            <div className="selectedFileViewDataModal-body overflow-auto">
                

                {(fileData != null && fileData.data != undefined && (fileData.type == "text" || fileData.type == "other")) &&
                    (fileData.data.includes('\n') ? fileData.data.split('\n').map((d, idx) => {
                        return <p key={idx}>{d}</p>
                    }) : fileData.data)
                }

                {(fileData != null && fileData.type == "image") &&
                    <img
                        className=""
                        src={`data:image/${fileData.extension};base64,${fileData.data}`}
                    />
                }

                {(fileData != null && fileData.type == "code") &&
                    <code>
                        {(fileData.data != undefined && fileData.data!.includes('\n')) &&
                            fileData.data.split('\n').map((line, idx) => {
                                return <p key={idx}>{line}</p>
                            })
                        }
                    </code>
                }

                {(fileData != null && fileData.type == "pdf") &&
                    "Não há suporte para a exibição de arquivos PDF"
                }

                {(fileData != null && fileData.type == "video") &&
                    <video
                        controls={true}
                        className="w-full h-auto"
                    >
                        <source src={fileData.url} type={fileData.mimeType}></source>
                    </video>
                }
        
                {(fileData == null) &&
                    "Carregando..."
                }
            </div>
        </Modal>
    );
}

export default ShowFileDataModal;