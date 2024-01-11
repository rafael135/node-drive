import { useNavigate } from "react-router-dom";
import Button from "../components/Atoms/Button/Index";
import { FaChevronLeft } from "react-icons/fa";


const ErrorPage = () => {
    const navigate = useNavigate();

    
    return (
        <div className="h-screen w-full flex flex-col gap-2 justify-center items-center">
            <div className="border-solid border border-gray-600/30 h-auto">
                <div className="w-[40vw] bg-gray-800/15 border-b border-solid border-b-gray-600/30 flex justify-center items-center py-3">
                    <span className="text-4xl text-slate-900 font-bold">ERRO 404</span>
                </div>

                <div className="py-2 flex justify-center bg-slate-50">
                    <span className="text-xl font-semibold">Página não encontrada!</span>
                </div>
            </div>

            <Button
                className="!rounded-4xl !text-xl flex !py-1.5 !px-4"
                onClick={() => { navigate("/"); }}
            >
                <FaChevronLeft className="w-5 h-auto" />
                Página Inicial
            </Button>
        </div>
    );
}

export default ErrorPage;