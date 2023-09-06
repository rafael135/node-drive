import { BsFolderPlus, BsTicketDetailedFill, BsUpload } from "react-icons/bs";
import { FileType } from "../../types/File";

type props = {
    x: number;
    y: number;
    selectFn: (fnNumber: number) => void;
    activeFile: FileType | null;
}

const ContextMenu = ({ x, y, selectFn, activeFile }: props) => {
    return (
        <div className={`absolute w-48 px-0 py-2 h-auto bg-white border border-solid border-gray-500/70 rounded-[4px]`} style={{ top: `${x}px`, left: `${y}px` }}>
            <ul className="flex flex-col">
                { (activeFile != null) &&
                    <li onClick={() => { selectFn(2); }}
                        className="flex items-center gap-1 px-1 py-1 text-slate-800 cursor-pointer hover:bg-black/20 hover:text-slate-900 active:text-slate-950 group"
                    >
                        <BsTicketDetailedFill className="fill-slate-800 group-hover:text-blue-700" />
                        Detalhes
                    </li>
                }

                <li 
                    onClick={() => { selectFn(1); }}
                    className="flex items-center gap-1 px-1 py-1 text-slate-800 cursor-pointer hover:bg-black/20 hover:text-slate-900 active:text-slate-950 group"
                >
                    <BsUpload className="fill-slate-800 group-hover:text-blue-700" />
                    Adicionar arquivo
                </li>

                { (activeFile == null) &&
                    <li
                        onClick={() => { selectFn(3); }}
                        className="flex items-center gap-1 px-1 py-1 text-slate-800 cursor-pointer hover:bg-black/20 hover:text-slate-900 active:text-slate-950 group"
                    >
                        <BsFolderPlus className="fill-slate-800 group-hover:text-blue-700" />
                        Nova Pasta
                    </li>
                }
            </ul>
        </div>
    )
}

export default ContextMenu;