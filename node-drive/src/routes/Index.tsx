import { useContext } from "react";
import CurrentFolder from "../components/CurrentFolder/CurrentFolder";
import Layout from "../components/Layout";
import { UserAuthContext } from "../contexts/UserContext";


const Index = () => {
    const userCtx = useContext(UserAuthContext)!;

    return (
        <Layout activeTab="files">
            <CurrentFolder userFilesPath={userCtx.user!.files_path!} userCtx={userCtx} />
        </Layout>
    );
}

export default Index;