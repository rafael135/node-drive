import { useNavigate, useParams } from "react-router-dom";

const DownloadFile = () => {
    const navigate = useNavigate();
    const params = useParams();

    if(params.userId == null || params.fileUrl == null) {
        navigate("/");
    }

    return (
        <div>

        </div>
    );
}

export default DownloadFile;