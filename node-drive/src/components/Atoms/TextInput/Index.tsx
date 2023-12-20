
type props = {
    type: "text" | "number" | "email" | "password" | "time" | "tel" | "submit";
    value: string;
    setValue: React.Dispatch<React.SetStateAction<string>>;
    placeholder?: string;
    id: string;
    name: string;
    className?: string;
    onKeyUp?: (e: React.KeyboardEvent) => void;
    inputRef?: React.MutableRefObject<HTMLInputElement | null>;
};

const TextInput = ({ type, value, setValue, placeholder, id, name, className, onKeyUp, inputRef }: props) => {


    return (
        <input
            type={type}
            value={value}
            placeholder={placeholder ?? ""}
            className={`input-default ${className ?? ""}`}
            id={id}
            name={name}
            ref={inputRef}

            onChange={(e) => setValue(e.target.value)}
            onKeyUp={(onKeyUp == undefined) ? () => {} : onKeyUp}

        />
    );
}

export default TextInput;