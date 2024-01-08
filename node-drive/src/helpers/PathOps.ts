//import { FolderPath } from "../components/CurrentFolder/CurrentFolder";

/*
export const getRealPath = (pathInfo: FolderPath) => {
    let splitedPath = pathInfo.path.split('/');

    //console.log(splitedPath);

    let path = "";
    
    // Caso o caminho para o armazenamento não seja a pasta principal, pega as proximas pastas
    if(splitedPath[3] == "files" && splitedPath.length > 4) {
        path = `${splitedPath.filter((item, idx) => {
            return idx > 3;
        }).join('/')}/`;
    }

    return path;
}
*/

export const sleep = async (ms: number) => {
    return new Promise<void>(resolve => setTimeout(resolve, ms));
}