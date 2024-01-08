import { UseQueryResult } from "@tanstack/react-query";
import styled from "styled-components";


const StyledSearchFilesToolbar = styled.div({
    display: "flex",
    flexWrap: "wrap",
    gap: "0.5rem",
    width: "100%",
    height: "auto",
    padding: "0.6rem",
    borderStyle: "solid",
    borderTopWidth: "1px",
    borderTopColor: "rgb(75 85 99 / 0.2)",
    borderBottomWidth: "1px",
    borderBottomColor: "rgb(75 85 99 / 0.2)",
    backgroundColor: "rgb(249 250 251)"
});

const StyledToolbarText = styled.h2({
    fontSize: "20px",
    color: "rgb(30 41 59)"
});


type props = {
    qteFiles: number;
    searchTxt: string;
};

const SearchFilesToolbar = ({ qteFiles, searchTxt }: props) => {


    return (
        <StyledSearchFilesToolbar>
            <StyledToolbarText>
                <strong>{qteFiles}</strong> resultados encontrados para "{searchTxt}"
            </StyledToolbarText>
        </StyledSearchFilesToolbar>
    );
}

export default SearchFilesToolbar;