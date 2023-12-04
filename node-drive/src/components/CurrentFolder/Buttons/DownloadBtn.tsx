import { BsDownload } from "react-icons/bs";


type props = {
    label: string;
    onClick: () => void;
};

const DownloadBtn = ({ label, onClick }: props) => {


    return (
        <button
            className="btn-action group"
            title="Download"
            onClick={onClick}
        >
            <BsDownload className={`w-5 h-5 fill-gray-100 group-hover:scale-105`} />
            {label}
        </button>
    );
}

export default DownloadBtn;