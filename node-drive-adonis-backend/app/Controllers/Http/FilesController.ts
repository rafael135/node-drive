import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Drive from '@ioc:Adonis/Core/Drive';
import Application from "@ioc:Adonis/Core/Application";
import fs from "node:fs/promises";

import Hash from '@ioc:Adonis/Core/Hash';

import JWT from "jsonwebtoken";
import PublicFile from 'App/Models/PublicFile';
import User from 'App/Models/User';
import mime from "mime";
//import { fileTypeFromFile, FileTypeResult } from 'file-type';

type decodedToken = {
    id: number;
    email: string;
    iat: number;
    exp: number;
}

type newFileType = {
    name: string;
    extension: string | null;
    fileType: string;
    size: string;
    location: string;
    isFile: boolean;
    isPublic: boolean;
    shareLink?: string;
}

type PublicFileInfo = {
    name: string;
    extension: string | null;
    size: string;
    filePath: string;
    created_at: string;
    updated_at: string;
}

export default class FilesController {

    private convertBytesToMb(bytes: number) {
        let fileSize: string;

        if(bytes > 1000000) {
            fileSize = `${(bytes / 1000000).toFixed(2)} Mb`;
        } else if(bytes > 1000) {
            fileSize = `${(bytes / 1000).toFixed(2)} Kb`;
        } else {
            fileSize = `${bytes} Bytes`;
        }

        return fileSize;
    }

    async getFoldersAndFilesFrom({ request, response }: HttpContextContract) {
        let { userId, path } = request.qs();
        let token = request.header("Authorization")!.split(' ')[1];

        //console.log(path);

        if(path == null || userId == null) {
            response.status(400);
            return response.send({
                files: null,
                status: 400
            });
        }

        let decoded = JWT.decode(token) as decodedToken;

        if(decoded.id != userId || userId == null) {
            response.status(403);
            return response.send({
                files: null,
                status: 403
            });
        }

        let totalFilesSize = 0.0;

        let publicFiles = await PublicFile.query().select("file_path").where("user_id", "=", decoded.id);
        
        //let path = `user/${decoded.id}/files`;

        // Percorro todos os arquivos do diretorio do usuario
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

            let fileSize: string = this.convertBytesToMb(fileInfo.size);

            totalFilesSize += fileInfo.size;

            let fileType = mime.getType(`${Application.appRoot}/storage/${file.location}`);

            if(fileType == null) {
                fileType = "other";
            }

            //console.log(file.location);

            let newFile: newFileType = {
                location: file.location,
                isFile: file.isFile,
                name: name,
                extension: extension,
                fileType: fileType,
                size: fileSize,
                isPublic: false
            };

            //console.log(newFile);

            return newFile;
        }).toArray();

        // Mapeio cada arquivo e pasta para marcar os que são públicos
        filesAndFolders.map((file) => {
            if(file.isFile == true) {
                publicFiles.forEach((pbFile) => {
                    if(pbFile.filePath == file.location) {
                        file.isPublic = true;
                    }
                });
            }

            return file;
        })

        response.status(200);
        return response.send({
            files: filesAndFolders,
            occupiedSpace: totalFilesSize,
            status: 200
        });
    }


    async downloadFile({ request, response, params }: HttpContextContract) {
       let filePath: string | null = params.filePath;
       let token = request.header("Authorization")!.split(' ');

        if(filePath == null) {
            response.status(400);
            return response.send({
                success: false,
                status: 400
            });
        }

        filePath = decodeURI(filePath);

        let decoded = JWT.decode(token[1]) as decodedToken;

        let path = `user/${decoded.id}/files/${filePath}`;
        
        let fileExists = await Drive.exists(path);

        if(fileExists == true) {
            let file = await Drive.getUrl(path);
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

        let decoded = JWT.decode(token[1]) as decodedToken;

        let path = `user/${decoded.id}/files/${filePath}`;

        //let fileInfo = await fs.stat(`${Application.appRoot}/storage/${path}`);
        let fileType: string | null = mime.getType(`${Application.appRoot}/storage/${path}`);

        //let fileType: FileTypeResult | string | undefined = await fileTypeFromFile(`${Application.appRoot}/storage/${path}`);

        let extension: string[] | string = path[path.length - 1].split('.');
        extension = extension[extension.length - 1];

        if(fileType == undefined) {
            fileType = "file/other";
        }

        //console.log(fileType);

        let isVideo = false;
        let isImage = false;
        let isPdf = false;
        let isCode = false;

        if(fileType != null) {
            if(fileType.includes("video") == true) {
                fileType = "video";
                isVideo = true;
            } else if(fileType.includes("image") == true) {
                fileType = "image";
                isImage = true;
            } else if(fileType.includes("pdf") == true) {
                fileType = "pdf";
                isPdf = true;
            } else if(fileType.includes("javascript") == true) {
                isCode = true;
            }

        }

        let data: string | undefined = undefined;

        if(isVideo == false && isImage == false && isPdf == false && isCode == false) {
            try {
                //let reader = await Drive.getStream(path);
                data = (await Drive.get(path)).toString();
                fileType = "text";
            } catch(e) {
                console.error(e);
            }
        } else if(isCode == true) {
            try {
                data = (await Drive.get(path)).toString();
                fileType = "code";
            } catch(e) {
                console.error(e);
            }
        } else {
            try {
                data = (await Drive.get(path)).toString("base64");
            } catch(e) {
                console.error(e);
            }
        }
        
        response.status(200);

        if(isImage == true || isPdf == true) {
            return response.send({
                type: fileType,
                extension: extension,
                data: data,
                url: `localhost:3333${await Drive.use("local").getSignedUrl(path)}`,
                status: 200
            });
        } else if(isVideo == true) {
            return response.send({
                type: fileType,
                mimeType: mime.getType(`${Application.appRoot}/storage/${path}`)!,
                extension: extension,
                url: `http://localhost:3333/api/user/${decoded.id}/video/${filePath}`,
                status: 200

            });
        }

        return response.send({
            type: fileType,
            data: data,
            status: 200
        });


    }

    async deleteFile({ request, response }: HttpContextContract) {
        let filePath: string | null = request.input("filePath", null);
        let token = request.header("Authorization")!.split(" ");

        if(filePath == null) {
            response.status(400);
            return response.send({
                success: false,
                status: 400
            });
        }

        let decoded = JWT.decode(token[1]) as decodedToken;

        let pathSplit = filePath.split('/');

        if(pathSplit[1] != decoded.id.toString()) {
            response.status(401);
            return response.send({
                success: false,
                status: 401
            });
        }

        

        try {
            await Drive.use("local").delete(`${filePath}`);
        } catch(err) {

        }

        response.status(200);
        return response.send({
            success: true,
            status: 200
        });
        


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


    // Metodo para renomear arquivo ou pasta
    async renameFileOrFolder({ request, response }: HttpContextContract) {
        let filePath: string | null = request.input("filePath", null);
        let newName: string | null = request.input("newName", null);
        let isFile: boolean | null = request.input("isFile", null);
        let token = request.header("Authorization")!.split(' ');
        
        //console.log(newName);

        if(filePath == null || newName == null || isFile == null) {
            response.status(400);
            return response.send({
                success: false,
                status: 400
            });
        }

        

        let decoded = JWT.decode(token[1]) as decodedToken;
        
        let path = `user/${decoded.id}/files${filePath}`;
        //let newPath = `user/${decoded.id}/files/${path.split('/')
        //    .filter((item, idx) => idx < (path.length - 1))
        //.join("/")}`;

        //console.log(path);
        //console.log(await Drive.use("local").exists(path))

        

        
        let newPath: string | string[] = path.split('/');
        newPath.pop();

        newPath = newPath.join('/');

        newPath = `${newPath}/${newName}`;
        //console.log(newPath);

        //response.status(200);
        //return response.send({
        //    success: true,
        //    status: 200
        //});

        if(await Drive.use("local").exists(path) == true) {
            await fs.rename(`${Drive.application.appRoot}/storage/${path}`, `${Drive.application.appRoot}/storage/${newPath}`)
        } else {
            response.status(401);
            return response.send({
                success: false,
                status: 401
            });
        }

        response.status(200);
        return response.send({
            success: true,
            status: 200
        });

    }


    async makeFilePublic({ request, response }: HttpContextContract) {
        let filePath: string | null = request.input("filePath", null);
        let token = request.header("Authorization")!.split(' ')[1];

        if(filePath == null) {
            response.status(400);
            return response.send({
                status: 400
            });
        }

        let decoded = JWT.decode(token) as decodedToken;

        let newPath = `user/${decoded.id}/files/${filePath}`;

        let fileExists = await Drive.use("local").exists(newPath);

        if(fileExists == true) {
            let existentFile = await PublicFile.query()
                .where("user_id", decoded.id)
                .andWhere("file_path", newPath)
            .first();

            if(existentFile != null) {
                await existentFile.delete();

                response.status(200);
                return response.send({
                    isPublic: false,
                    status: 200
                });
            }

            let fileName = newPath[newPath.length - 1];

            let newPublicFile = await PublicFile.create({
                userId: decoded.id,
                fileUrl: Buffer.from(`${fileName}${99999 * Math.random()}`).toString("base64url"),
                filePath: newPath
            });

            if(newPublicFile != null) {
                response.status(201);
                return response.send({
                    isPublic: true,
                    status: 201
                });
            } else {
                response.status(500);
                return response.send({
                    status: 500
                });
            }
        }

        response.status(403);
        return response.send({
            status: 403
        });
    }

    async getPublicFileUrl({ request, response }: HttpContextContract) {
        let { filePath, userId } = request.qs();
        //let token = request.header("Authorization")!.split(' ')[1];

        //console.log(filePath, userId);

        if(filePath == null || userId == null) {
            response.status(400);
            return response.send({
                url: null,
                status: 400
            });
        }

        let existentUser = await User.find(userId);

        if(existentUser == null) {
            response.status(400);
            return response.send({
                url: null,
                status: 400
            });
        }

        let path = `user/${userId}/files${filePath}`;

        

        let existentFIle = await Drive.use("local").exists(path);

        //console.log(path, existentFIle);

        if(existentFIle == false) {
            response.status(400);
            return response.send({
                url: null,
                status: 400
            });
        }

        let publicFile = await PublicFile.findBy("file_path", path);

        //console.log(publicFile);

        if(publicFile == null) {
            response.status(200);
            return response.send({
                url: "",
                status: 200
            });
        }

        let url = `localhost:5173/file/${userId}/${publicFile.fileUrl}`;

        response.status(200);
        return response.send({
            url: url,
            status: 200
        });

        //let decoded = JWT.decode(token) as decodedToken;


    }

    

    async getPublicFileInfo({ request, response }: HttpContextContract) {
        let { userId, fileUrl } = request.qs() as { userId: string | null, fileUrl: string | null };

        if(userId == null || fileUrl == null) {
            response.status(400);
            return response.send({
                status: 400
            });
        }

        let publicFile = await PublicFile.query().where("user_id", "=", userId).andWhere("file_url", "=", fileUrl).first();

        if(publicFile == null) {
            response.status(404);
            return response.send({
                status: 404
            });
        }


        //let filePath = `${Drive.application.appRoot}/${publicFile.filePath}`;

        let fileStats = await Drive.use("local").getStats(publicFile.filePath);

        let stats = await fs.stat(`${Application.appRoot}/storage/${publicFile.filePath}`);

        

        let name: string[] | string = publicFile.filePath.split('/');
        name = name[name.length - 1];

        let extension: string[] | string | null = name.split('.');
        extension = extension[extension.length - 1];

        if(extension == name) {
            extension = null;
        }

        let fileInfo: PublicFileInfo = {
            name: name,
            extension: extension,
            size: this.convertBytesToMb(fileStats.size),
            filePath: publicFile.filePath,
            created_at: `${stats.ctime.getHours()}:${(stats.ctime.getMinutes() < 10) ? `0${stats.ctime.getMinutes()}` : `${stats.ctime.getMinutes()}`} ${stats.ctime.getFullYear()}/${stats.ctime.getMonth()}/${stats.ctime.getDay()}`,
            updated_at: `${stats.mtime.getHours()}:${(stats.mtime.getMinutes() < 10) ? `0${stats.mtime.getMinutes()}` : `${stats.mtime.getMinutes()}`} ${stats.mtime.getFullYear()}/${stats.mtime.getMonth()}/${stats.mtime.getDay()}`
        }

        response.status(200);
        return response.send({
            fileInfo: fileInfo,
            status: 200
        });
    }


    async downloadPublicFile({ request, response, params }: HttpContextContract) {
        let { filePath } = request.qs() as { filePath: string | null };
        let userId: number | null = params.userId;

        if(filePath == null || userId == null) {
            response.status(400);
            return response.send({
                status: 400
            });
        }

        let exists = await PublicFile.query().where("user_id", "=", userId).andWhere("file_path", "=", filePath).first();

        if(exists == null) {
            response.status(403);
            return response.send({
                status: 403
            });
        }

        if((await Drive.use("local").exists(exists.filePath)) == false) {
            response.status(204);
            return response.send({
                status: 204
            });
        }

        let url = await Drive.use("local").getUrl(exists.filePath);

        try{
            await response.download(`${Application.appRoot}/${url}`);
        } catch(e) {
            response.status(500);
            return response.send({
                status: 500
            });
        }

        response.status(200);
        return response.send({
            status: 200
        });
        
    }


}
