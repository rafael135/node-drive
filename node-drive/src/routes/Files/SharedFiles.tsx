import Layout from "../../components/Templates/DefaultLayout/Index"
import { useContext } from "react";
import { UserAuthContext } from "../../contexts/UserContext";
import PublicFilesFolder from "./PublicFilesFolder";


const SharedFiles = () => {
    const userCtx = useContext(UserAuthContext);

    return (
        <Layout activeTab={"sharedFiles"}>
            <PublicFilesFolder publicPath={userCtx!.user!.public_files_path}/>
        </Layout>
    );
}

export default SharedFiles;