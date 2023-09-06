import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Drive from '@ioc:Adonis/Core/Drive';
import Application from "@ioc:Adonis/Core/Application";
import fs from "node:fs/promises";

import JWT from "jsonwebtoken";

export default class FilesController {
    async getFoldersAndFilesFrom({ request, response }: HttpContextContract) {
        let path = request.input("path", null);

        if(path == null) {
            response.status(400);
            return response.send({
                files: null,
                status: 400
            });
        }

        type newFileType = {
            name: string;
            extension: string | null;
            size: string;
            location: string;
            isFile: boolean;
        }

        let filesAndFolders = await Drive.list(path).map( async(file) => {
            let loc = file.location.split("/");

            

            let fileInfo = await Drive.getStats(file.location);
            //let fileInfo = await fs.stat(file.location);


            let name  = loc[loc.length - 1];
            let ext = name.split('.');
            let extension: string | null = ext[ext.length - 1];



            if(extension == name) {
                extension = null;
            }

            let fileSize: string;

            if(fileInfo.size > 1000000) {
                fileSize = `${fileInfo.size / 1000000} Mb`;
            } else if(fileInfo.size > 1000) {
                fileSize = `${fileInfo.size / 1000} Kb`;
            } else {
                fileSize = `${fileInfo.size} Bytes`;
            }

            let newFile: newFileType = { location: file.location, isFile: file.isFile, name: name, extension: extension, size: fileSize };

            return newFile;
        }).toArray();

        response.status(200);
        return response.send({
            files: filesAndFolders,
            status: 200
        });
    }


    async downloadFile({ request, response }: HttpContextContract) {
        let filePath = request.input("path", null);

        if(filePath == null) {
            response.status(400);
            return response.send({
                success: false,
                status: 400
            });
        }
        
        let fileExists = await Drive.exists(filePath);

        if(fileExists == true) {
            let file = await Drive.getUrl(filePath);


            let url = (`${Application.appRoot + file}`);

            response.status(200);
            try {
                await response.download(url);
            } catch(err) {
                
            }

            return;
        }

        response.status(400);
        return response.send({
            success: false,
            status: 400
        });
    }

    async viewFile({ request, response }: HttpContextContract) {
        let token = request.header("Authorization")!.split(" ");
        let { filePath } = request.qs();

        //console.log(filePath);

        if(token[1] == null || filePath == null) {
            response.status(400);
            return response.send({
                data: null,
                status: 400
            });
        }

        type decodedToken = {
            id: number;
            email: string;
            iat: number;
            exp: number;
        }

        let decoded = JWT.decode(token[1]) as decodedToken;

        let path = `user/${decoded.id}/files/${filePath}`;

        let data: string | null = null;

        try {
            //let reader = await Drive.getStream(path);
            data = (await Drive.get(path)).toString();
        } catch(e) {
            
        }
        

        response.status(200);
        return response.send({
            data: data,
            status: 200
        });


    }

    async deleteFile({ request, response }: HttpContextContract) {
        let fileName = request.input("fileName", null);

        if(fileName == null) {
            response.status(400);
            return response.send({
                success: false,
                status: 400
            });
        }


    }

    async uploadFile({ request, response }: HttpContextContract) {

        let file = request.file("file");
        let fileName = request.input("fileName", null);
        let path = request.input("path", null) as string;
        let token = request.header("Authorization")!.split(' ');
        

        if(file == null || fileName == null || path == null || token == undefined) {
            response.status(400);
            return response.send({
                success: false,
                status: 400
            });
        }

        type decodedToken = {
            id: number;
            email: string;
            iat: number;
            exp: number;
        }

        let decoded = JWT.decode(token[1]) as decodedToken;
        
        let pathSplit = path.split('/');

        if(pathSplit[2] != decoded.id.toString()) {
            response.status(401);
            return response.send({
                success: false,
                status: 401
            });
        }

        await file.moveToDisk(path, { name: fileName }, "local");

        response.status(200);
        return response.send({
            success: true,
            status: 200
        });
    }


    async newFolder({ request, response }: HttpContextContract) {
        let path: string | null = request.input("path", null);
        let folderName: string | null = request.input("folderName", null);
        let token = request.header("Authorization")!.split(' ');
        
        if(path == null || folderName == null) {
            response.status(400);
            return response.send({
                success: false,
                status: 400
            });
        }

        type decodedToken = {
            id: number;
            email: string;
            iat: number;
            exp: number;
        }

        let decoded = JWT.decode(token[1]) as decodedToken;
        
        let pathSplit = path.split('/');

        if(pathSplit[2] != decoded.id.toString()) {
            response.status(401);
            return response.send({
                success: false,
                status: 401
            });
        }
        
        // Obtenho o caminho ate a pasta
        let drivePath = Drive.use("local").makePath(`${path}`);
        
        // Crio o pasta no diretorio do usuario
        await fs.mkdir(`${drivePath}/${folderName}`);

        response.status(201);
        return response.send({
            success: true,
            status: 201
        });
    }
}
