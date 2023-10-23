import { useNavigate, useParams } from "react-router-dom";
import PublicFile from "../../components/PublicFile/PublicFile";

const DownloadFile = () => {
    const navigate = useNavigate();
    const params = useParams();

    let userId = params.userId;
    let fileUrl = params.fileUrl;

    if(userId == undefined || fileUrl == undefined) {
        navigate("/");
    }

    

    return (
        <PublicFile userId={Number.parseInt(userId!)} fileUrl={fileUrl!} />
    );
}

export default DownloadFile;