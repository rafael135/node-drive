import styled from "styled-components";


const StyledPathLabel = styled.span({
    paddingLeft: "0.25rem",
    paddingRight: "0.25rem",
    color: "rgb(30 41 59)",
    fontWeight: "700",
    cursor: "pointer",
    borderRadius: "0.375rem",
    transitionProperty: "all",
    transitionTimingFunction: "ease-in-out",
    transitionDuration: "150ms"
});


type props = {
    name: string;
    path: string;
    setValue: React.Dispatch<React.SetStateAction<string>>;
}

const PathLabel = ({ name, path, setValue }: props) => {


    return (
        <StyledPathLabel
            className="hover:bg-black/10"
            onClick={() => { setValue(path); }}
        >
            { name }
        </StyledPathLabel>
    )
}

export default PathLabel;