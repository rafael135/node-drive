import { Progress, Toast } from "flowbite-react";
import { useState, useEffect, useContext } from "react";
//import { FileUploadStatusContext } from "../CurrentFolder/CurrentFolder";


type props = {
    qteFiles: number;
    filesCompleted: number;
    setShowStatus: React.Dispatch<React.SetStateAction<boolean>>;
}

const UploadStatusToast = ({ qteFiles, filesCompleted, setShowStatus }: props) => {

    //const fileUploadCtx = useContext(FileUploadStatusContext)!;

    const [completedFiles, setCompletedFiles] = useState<number>(filesCompleted);

    //const [progressPct, setProgressPct] = useState<number>(0.0);

    useEffect(() => {
        
        setCompletedFiles(filesCompleted);
    }, [filesCompleted])

    return (
        <>
            <Toast className="absolute bottom-1.5 left-1.5 cursor-default bg-gray-100 border border-solid border-gray-700/80 shadow-lg" hidden={false}>
                <div className="flex flex-col gap-1">
                    <p className="text-slate-800">Fazendo upload de {(completedFiles + 1 > qteFiles) ? qteFiles : completedFiles} de {qteFiles} arquivos</p>
                    <Progress progress={
                            ((completedFiles + 1) == qteFiles ? 100 : (completedFiles / qteFiles) * 100)
                        }
                        className="flex flex-1 text-blue-500" 
                    />
                </div>
                
                <Toast.Toggle
                    onClick={() => { setShowStatus(false); }}
                    className={`bg-gray-100 w-8 cursor-pointer text-red-600 hover:text-red-700 hover:bg-gray-300/60`}
                />
            </Toast>
        </>
    );
}

export default UploadStatusToast;