import { BsFileText, BsFolderPlus, BsShareFill, BsTicketDetailedFill, BsTrashFill, BsUpload, BsWrenchAdjustableCircleFill } from "react-icons/bs";
import { FileType } from "../../../types/File";

type props = {
    x: number;
    y: number;
    selectFn: (fnNumber: number, fileIdx?: number) => void;
    onClose: () => void;
    activeFile: FileType | null;
    fileIndex: number;
}

const ContextMenu = ({ x, y, selectFn, onClose, activeFile, fileIndex }: props) => {
    return (
        <div className={`fileContextMenu`} style={{ top: `${x}px`, left: `${y}px` }}>
            <ul>
                { (activeFile != null) &&
                    <li onClick={() => { selectFn(2); }}
                        className="contextMenu-item group"
                    >
                        <BsTicketDetailedFill className="contextMenu-item--img" />
                        Detalhes
                    </li>
                }

                <li 
                    onClick={() => { selectFn(1); }}
                    className="contextMenu-item group"
                >
                    <BsUpload className="contextMenu-item--img" />
                    Adicionar arquivo
                </li>

                { (activeFile == null) &&
                    <li
                        onClick={() => { selectFn(3); }}
                        className="contextMenu-item group"
                    >
                        <BsFolderPlus className="contextMenu-item--img" />
                        Nova Pasta
                    </li>
                }

                {(activeFile?.isFile == true) &&
                    <li
                        onClick={() => { selectFn(5, fileIndex); }}
                        className="contextMenu-item group"
                    >
                        <BsFileText className="contextMenu-item--img" />
                        Renomear
                    </li>
                }

                {(activeFile?.isFile == false) &&
                    <li
                        onClick={() => { selectFn(6, fileIndex) }}
                        className="contextMenu-item group"
                    >
                        <BsTrashFill className="contextMenu-item--img" />
                        Deletar pasta
                    </li>
                }

                {/*
                { (activeFile?.isFile == false) &&
                    <>
                        <li
                            onClick={() => { selectFn(9); }}
                            className="contextMenu-item group"
                        >
                            <BsWrenchAdjustableCircleFill className="contextMenu-item--img" />
                            Propriedades
                        </li>
                    </>
                }
                */}
            </ul>
        </div>
    )
}

export default ContextMenu;