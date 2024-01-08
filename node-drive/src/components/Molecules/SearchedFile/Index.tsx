import { motion } from "framer-motion";
import { FileType } from "../../../types/File";
import { BsFileCodeFill, BsFileEarmarkFill, BsFileImageFill, BsFilePdfFill, BsFileTextFill, BsFileZipFill, BsFiletypeDocx, BsFolderFill } from "react-icons/bs";
import { FcVideoFile } from "react-icons/fc";
import { useNavigate } from "react-router-dom";

type props = {
    key: number;
    file: FileType;
};

const SearchedFile = ({ key, file }: props) => {

    const navigate = useNavigate();

    const handleFileLocation = () => {
        navigate(`/?file=${encodeURI(file.location)}`);
    }

    return (
        <motion.div
            key={key}
            className="file-card"
            transition={{ type: "spring", duration: 0.5 }}
            initial={{ opacity: 1, y: 800 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 800, transitionEnd: { display: "none" } }}
            title="Abrir local do arquivo"
        >

            <div
                className="file-interact"
                onClick={handleFileLocation}
                
            >
                {(file.isFile == false) &&
                    <BsFolderFill className="flex-1 p-1 w-auto fill-yellow-300" />
                }

                {(file.isFile == true && file.extension == null) &&
                    <BsFileEarmarkFill className="flex-1 p-1 w-auto" />
                }

                {(file.isFile == true && file.extension == "pdf") &&
                    <BsFilePdfFill className="flex-1 p-1 w-auto fill-red-500" />
                }

                {(file.isFile == true && file.extension == "docx" || file.extension == "doc") &&
                    <BsFiletypeDocx className="flex-1 p-1 w-auto fill-blue-500" />
                }

                {(file.isFile == true && (file.extension == "jpeg" || file.extension == "jpg" || file.extension == "png")) &&
                    <BsFileImageFill className="flex-1 p-1 w-auto fill-blue-200" />
                }

                {(file.isFile == true && file.extension == "txt") &&
                    <BsFileTextFill className="flex-1 p-1 w-auto fill-slate-400" />
                }

                {(file.isFile == true && (file.extension == "c" || file.extension == "cpp" || file.extension == "h" || file.extension == "cs" || file.extension == "php" || file.extension == "ts" || file.extension == "js")) &&
                    <BsFileCodeFill className="flex-1 p-1 w-auto fill-zinc-400" />
                }

                {(file.isFile == true && (file.extension == "rar" || file.extension == "zip" || file.extension == "7z")) &&
                    <BsFileZipFill className="flex-1 p-1 w-auto fill-blue-300" />
                }

                {(file.isFile == true && file.fileType.includes("video")) &&
                    <FcVideoFile className="flex-1 p-1 w-auto fill-blue-200" />
                }


                <span
                    className="fileName"
                    suppressContentEditableWarning={true}
                >
                    {file.name}
                </span>
            </div>
        </motion.div>
    )
}

export default SearchedFile;