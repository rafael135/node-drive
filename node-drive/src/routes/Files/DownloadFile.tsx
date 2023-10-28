import { useNavigate, useParams } from "react-router-dom";
import PublicFile from "../../components/PublicFile/PublicFile";
import { PublicFileContextProvider } from "../../contexts/PublicFileInteractionContext";

const DownloadFile = () => {
    const navigate = useNavigate();
    const params = useParams();

    let userId = params.userId;
    let fileUrl = params.fileUrl;

    if(userId == undefined || fileUrl == undefined) {
        navigate("/");
    }

    

    return (
        <PublicFileContextProvider>
            <PublicFile userId={Number.parseInt(userId!)} fileUrl={fileUrl!} />
        </PublicFileContextProvider>
    );
}

export default DownloadFile;