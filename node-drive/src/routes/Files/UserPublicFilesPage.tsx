import { useContext } from "react"
import UserPublicFiles from "../../components/Pages/UserPublicFiles/Index"
import Layout from "../../components/Templates/DefaultLayout/Index"
import { UserAuthContext } from "../../contexts/UserContext"


const UserPublicFilesPage = () => {
    const userCtx = useContext(UserAuthContext)!

    return(
        <Layout activeTab="sharedFiles">
            <UserPublicFiles userCtx={userCtx} />
        </Layout>
    );
}

export default UserPublicFilesPage;