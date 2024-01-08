import { FaCheck } from "react-icons/fa";
import { StorageType } from "../../../types/User";
import Button from "../../Atoms/Button/Index";
import { useContext, useEffect } from "react";
import { UserAuthContext } from "../../../contexts/UserContext";
import { motion } from "framer-motion";
import { useChangeUserPlan } from "../../../utils/Queries";
import { Spinner } from "flowbite-react";
//import { changeUserPlan } from "../../../api/User";


type props = {
    storagePlan: StorageType;
}

const PlanCard = ({ storagePlan }: props) => {
    const userCtx = useContext(UserAuthContext)!;

    const isUserPlan = userCtx.user!.storage_type_id == storagePlan.id;

    const changeUserPlan = useChangeUserPlan(storagePlan.id);

    const handlePlanBtn = async () => {
        let res = await changeUserPlan.refetch();

        if(res.data == true) {
            userCtx.setUser({
                ...userCtx.user!,
                storage_type_id: storagePlan.id,
                maxStorage: storagePlan.storage_size
            });
        }
    }

    return (
        <motion.div
            className="w-72 flex flex-col h-auto shadow-lg border-2 border-gray-600/10 rounded-md"
            initial={{ y: -400 }}
            transition={{ type: "spring", duration: 0.5 }}
            animate={{ y: 0 }}
        >

            <div className="w-full h-56 flex flex-col items-center border-b-2 border-b-gray-600/10">
                <span className="w-[90%] mb-2 text-center text-3xl font-bold py-1 border-b border-b-gray-600/20">{storagePlan.title}</span>

                <span className="w-full mb-4 text-center text-xl font-semibold">{storagePlan.storage_size} GB</span>

                {(storagePlan.price != null) &&
                    <>
                        <p>Por</p>
                        <span className=""><strong>R$ {storagePlan.price.toFixed(2)}</strong> ao mês</span>
                    </>
                }

                <Button className="my-auto" onClick={(isUserPlan == true) ? () => {} : handlePlanBtn} disabled={isUserPlan}>
                    {(isUserPlan == true) &&
                        "Plano atual"
                    }

                    {(isUserPlan == false) &&
                        "Selecionar Plano"
                    }

                    {(changeUserPlan.isLoading) &&
                        <Spinner color="info" size="sm" />
                    }
                </Button>
            </div>

            <div className="w-full h-24 flex flex-col justify-center items-center">
                <h2 className="font-semibold text-xl text-center">Inclui:</h2>

                <ul className="w-full flex flex-col items-center">
                    <li className="flex flex-row text-wrap gap-1 items-center justify-center">
                        <FaCheck className="fill-blue-500 h-4 w-auto" />
                        {storagePlan.storage_size} GB de Armazenamento
                    </li>

                    <li className="flex flex-row text-wrap gap-1 items-center justify-center">
                        <FaCheck className="fill-blue-500 h-4 w-auto" />
                        {(storagePlan.max_shared_files == null) &&
                            <p className="text-slate-700 text-sm">Arquivos compartilhaveis ilimitado</p>
                        }

                        {(storagePlan.max_shared_files != null) &&
                            <p className="text-slate-700 text-sm">Máximo de {storagePlan.max_shared_files} arquivos compartilhaveis</p>
                        }
                    </li>
                </ul>
            </div>


        </motion.div>
    );
}

export default PlanCard;