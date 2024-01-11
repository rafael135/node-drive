import styled from "styled-components";
import Button from "../../Atoms/Button/Index";
import Select from "../../Atoms/Select/Index";
import { IoReload } from "react-icons/io5";
import { UseQueryResult } from "@tanstack/react-query";


const StyledUserPublicFilesToolbar = styled.div({
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

const StyledToolbarTitle = styled.p({
    marginLeft: "auto",
    marginRight: "0.5rem",
    display: "flex",
    gap: "4px",
    alignItems: "center"
});

type props = {
    sharedFiles: number | null;
    maxSharedFiles: number | null;
    reloadFiles: () => void;
    publicFilesQuery: UseQueryResult;
    maxSharedFilesQuery: UseQueryResult;
    setFilter: (filterId: number) => void;
};

const UserPublicFilesToolbar = ({ sharedFiles, maxSharedFiles, reloadFiles, publicFilesQuery, maxSharedFilesQuery, setFilter }: props) => {


    const handleFilterChange = (e: React.ChangeEvent) => {
        let filterOpt = (e.target as HTMLSelectElement).selectedIndex;

        switch(filterOpt) {
            case 0:

                break;

            default:
                setFilter(filterOpt);
                break;
        }
    }

    return (
        <StyledUserPublicFilesToolbar>
            <Button
                onClick={reloadFiles}
                className="p-2"
                title="Recarregar"
                disabled={(publicFilesQuery.isFetching == true || maxSharedFilesQuery.isFetching == true) ? true : false}
            >
                <IoReload className="fill-white" />
            </Button>

            <Select
                name="filesFilter"
                defaultValue={"0"} 
                onChange={handleFilterChange}
                disabled={(sharedFiles == 0 || sharedFiles == -1) ? true : false}
            >
                <option value="0" key={0} disabled={true}>Ordenar por</option>
                <option value="1" key={1}>Nome</option>
                <option value="2" key={2}>Tamanho</option>
            </Select>

            <StyledToolbarTitle>
                Arquivos compartilhados: <span className={`${(sharedFiles == null || maxSharedFiles == -1) ? "min-w-10 bg-slate-500/70 rounded-md text-transparent animate-fast-pulse" : ""}`}>{sharedFiles} / {(maxSharedFiles == null) ? "∞" : maxSharedFiles}</span>
            </StyledToolbarTitle>
        </StyledUserPublicFilesToolbar>
    );
}

export default UserPublicFilesToolbar;