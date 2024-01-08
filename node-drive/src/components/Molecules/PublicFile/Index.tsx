import styled from "styled-components"
import { PublicFileInfo, PublicFileType } from "../../../types/File";
import { BsFileCodeFill, BsFileEarmarkFill, BsFileImageFill, BsFilePdfFill, BsFileTextFill, BsFileZipFill, BsFiletypeDocx } from "react-icons/bs";
import { FcVideoFile } from "react-icons/fc";

const PublicFileContainer = styled.div({
    position: "relative",
    width: "10rem",
    height: "10rem",
    display: "flex",
    padding: "0.5rem",
    flexDirection: "column",
    justifyContent: "center",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "rgb(209 213 219)",
    cursor: "pointer",
});

const PublicFileImg = styled.div({
    flex: "1 1 0%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
});

const PublicFileTitle = styled.span({
    padding: "0.375rem",
    textAlign: "center",
    fontSize: "16px",
    fontWeight: "500",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    overflow: "hidden",
    color: "rgb(30 41 59)"
});

type props = {
    publicFile: PublicFileType;
    setSelectedFile: React.Dispatch<React.SetStateAction<PublicFileType | null>>;
};

const PublicFile = ({ publicFile, setSelectedFile }: props) => {


    const handlePublicFileModal = () => {
        setSelectedFile(publicFile);
    }

    return (
        <PublicFileContainer
            className="hover:bg-black/5"
            onClick={handlePublicFileModal}
        >
            
                {(publicFile.extension == null) &&
                    <BsFileEarmarkFill className="flex-1 w-full mx-auto max-w-32 h-auto" />
                }

                {(publicFile.extension == "pdf") &&
                    <BsFilePdfFill className="flex-1 w-full mx-auto max-w-32 h-auto fill-red-500" />
                }

                {(publicFile.extension == "docx" || publicFile.extension == "doc") &&
                    <BsFiletypeDocx className="flex-1 w-full mx-auto max-w-32 h-auto fill-blue-500" />
                }

                {((publicFile.fileType.includes("image"))) &&
                    <BsFileImageFill className="flex-1 w-full mx-auto max-w-32 h-auto fill-blue-200" />
                }

                {(publicFile.extension == "txt") &&
                    <BsFileTextFill className="flex-1 w-full mx-auto max-w-32 h-auto fill-slate-400" />
                }

                {((publicFile.extension == "c" || publicFile.extension == "cpp" || publicFile.extension == "h" || publicFile.extension == "cs" || publicFile.extension == "php" || publicFile.extension == "ts" || publicFile.extension == "js")) &&
                    <BsFileCodeFill className="flex-1 w-full mx-auto max-w-32 h-auto fill-zinc-400" />
                }

                {((publicFile.extension == "rar" || publicFile.extension == "zip" || publicFile.extension == "7z")) &&
                    <BsFileZipFill className="flex-1 w-full mx-auto max-w-32 h-auto fill-blue-300" />
                }

                {(publicFile.fileType.includes("video")) &&
                    <FcVideoFile className="flex-1 w-full mx-auto max-w-32 h-auto fill-blue-200" />
                }
            

            <PublicFileTitle title={publicFile.name}>
                {publicFile.name}
            </PublicFileTitle>


        </PublicFileContainer>
    );
}

export default PublicFile;