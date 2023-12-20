import { useContext } from "react";
import { PublicFileInterationContext } from "../../../contexts/PublicFileInteractionContext";
import { FileType } from "../../../types/File";
import { TfiInfo } from "react-icons/tfi";

type props = {
    x: number;
    y: number;
    activeFile: FileType | null;
}

const PublicFileContextMenu = ({ x, y, activeFile }: props) => {
    const publicFileCtx = useContext(PublicFileInterationContext)!;

    return (
        <div className={`fileContextMenu`} style={{ top: `${x}px`, left: `${y}px` }}>
            <ul>
                { (activeFile != null) &&
                    <li onClick={() => { publicFileCtx.setEvent("details"); }}
                        className="contextMenu-item group"
                    >
                        <TfiInfo className="contextMenu-item--img" />
                        Detalhes
                    </li>
                }
            </ul>
        </div>
    );
}

export default PublicFileContextMenu;