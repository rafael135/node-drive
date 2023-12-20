type props = {
    name: string;
    path: string;
    setValue: React.Dispatch<React.SetStateAction<string>>;
}

const PathLabel = ({ name, path, setValue }: props) => {


    return (
        <span
            className="px-1 text-slate-800 font-bold cursor-pointer rounded-md transition-all ease-in-out duration-150 hover:bg-black/10"
            onClick={() => { setValue(path); }}>
            { name }
        </span>
    )
}

export default PathLabel;