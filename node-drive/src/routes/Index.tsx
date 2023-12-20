import { useContext } from "react";
import Layout from "../components/Templates/DefaultLayout/Index";
import { UserAuthContext } from "../contexts/UserContext";
import CurrentFolder from "../components/Pages/Home/Index";


const Index = () => {
    const userCtx = useContext(UserAuthContext)!;

    return (
        <Layout activeTab="files">
            <CurrentFolder userCtx={userCtx} />
        </Layout>
    );
}

export default Index;