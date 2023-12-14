

export const fileToBase64 = (file: Blob) => new Promise<string | ArrayBuffer | null>((resolve, reject) => {
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
});