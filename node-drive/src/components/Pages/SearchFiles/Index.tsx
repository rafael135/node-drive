import { useSearchParams } from "react-router-dom";
import Layout from "../../Templates/DefaultLayout/Index";
import { useSearchPublicFiles, useSearchUserFiles } from "../../../utils/Queries";
import { useEffect } from "react";
import styled from "styled-components";
import { Spinner } from "flowbite-react";
import SearchedFile from "../../Molecules/SearchedFile/Index";
import SearchFilesToolbar from "./SearchFilesToolbar";

const StyledSearchedFilesContainer = styled.section({
    width: "100%",
    height: "calc(100% - 51.19px)",
    position: "relative",
    padding: "1rem",
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: "0.5rem",
    overflowY: "auto"
});

const SearchFiles = () => {

    const [searchParams] = useSearchParams();

    const searchTerm = searchParams.get("search")!;
    //const filterOption = searchParams.get("filter");
    //const page = searchParams.get("page");
    //const limit = searchParams.get("limit");

    /*
    const searchPublicFiles = useSearchPublicFiles(
        filterOption ?? "",
        searchTerm,
        Number.parseInt(page ?? "0"),
        Number.parseInt(limit ?? "10")
    );
    */

    const searchUserFiles = useSearchUserFiles(searchTerm);
    
    useEffect(() => {
        //console.log(searchPublicFiles.data);
    }, [searchUserFiles.data])

    return (
        <Layout activeTab="">
            {(searchUserFiles.isSuccess == true) &&
                <SearchFilesToolbar qteFiles={searchUserFiles.data.length} searchTxt={searchTerm} />
            }

            <StyledSearchedFilesContainer
                className={`
                
                ${(searchUserFiles.isFetching == true) ? "!h-full" : ""}
                ${(searchUserFiles.isSuccess == true && searchUserFiles.data.length == 0) ? "justify-center items-center" : ""}
                `}
            >
                {(searchUserFiles.isFetching == true) &&
                    <div className="absolute flex justify-center items-center top-0 bottom-0 left-0 right-0 bg-black/10">
                        <Spinner className="w-14 h-auto fill-blue-600" />
                    </div>
                }

                {(searchUserFiles.isSuccess == true && searchUserFiles.data.length == 0) &&
                    <span className="text-slate-800 text-xl">Nenhum resultado encontrado!</span>
                }

                {(searchUserFiles.isSuccess == true) &&
                    searchUserFiles.data.map((file, idx) => {
                        return <SearchedFile key={idx} file={file} />
                    })
                }
            </StyledSearchedFilesContainer>
        </Layout>
    );
}

export default SearchFiles;