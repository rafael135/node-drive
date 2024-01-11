

export const fileToBase64 = (file: Blob) => new Promise<string | ArrayBuffer | null>((resolve, reject) => {
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
});



export const convertFileSizeToBytes = (sizeTxt: string) => {
    let sizeMed = sizeTxt.split(' ')[1]!; // Pega a medida do arquivo. Ex: Bytes, Kb, Mb, Gb
    let sizeNum = parseFloat(sizeTxt.split(' ')[0]!); // Número da medida

    switch(sizeMed) {
        case "Kb":
            return sizeNum * 1000;
            break;
        
        case "Mb":
            return sizeNum * 1000000;
            break;

        case "Gb":
            return sizeNum * 1000000000;
            break;

        default: // Caso seja Bytes
            return sizeNum;
    }
}