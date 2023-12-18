import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Drive from '@ioc:Adonis/Core/Drive';
import Application from "@ioc:Adonis/Core/Application";
import fs from "node:fs/promises";
import fsA from "node:fs";
//import { pipeline } from "node:stream";
//import tar from "tar";
import archiver from "archiver";
import jszip, { file } from "jszip";
import stream from "stream";
import zlib from "node:zlib";

//import Hash from '@ioc:Adonis/Core/Hash';

import JWT from "jsonwebtoken";
import PublicFile from 'App/Models/PublicFile';
import User from 'App/Models/User';
import mime from "mime";
import UserController from './UserController';
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
    type: string;
    url?: string;
    mimeType?: string;
    size: string;
    filePath: string;
    data?: string | undefined;
    created_at: string;
    updated_at: string;
}

type getFileTypeReturn = {
    fileType: string | "other";
    mimeType: string;
    isVideo: boolean;
    isImage: boolean;
    isPdf: boolean;
    isCode: boolean;
};

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


    
    private getFileType(filePath: string): getFileTypeReturn {
        let mimeType = mime.getType(filePath);

        if(mimeType == null) {
            return {
                fileType: "other",
                mimeType: "file/other",
                isVideo: false,
                isImage: false,
                isCode: false,
                isPdf: false
            };
        }

        let type = mimeType;

        //console.log(mimeType);

        let isVideo = false;
        let isImage = false;
        let isPdf = false;
        let isCode = false;

        
        if(mimeType.includes("video") == true) {
            type = "video";
            isVideo = true;
        } else if(mimeType.includes("image") == true) {
            type = "image";
            isImage = true;
        } else if(mimeType.includes("pdf") == true) {
            type = "pdf";
            isPdf = true;
        } else if(mimeType.includes("javascript") == true) {
            isCode = true;
        }

        return {
            fileType: type,
            mimeType: mimeType,
            isVideo: isVideo,
            isImage: isImage,
            isPdf: isPdf,
            isCode: isCode
        };        
    }

    /*
    private getFileData(fileTypeResponse: getFileTypeReturn) {
        if(fileTypeResponse.)
    }
    */

    async getFoldersAndFilesFrom({ request, response }: HttpContextContract) {
        let { userId, path } = request.qs();
        let token = request.header("Authorization")!.split(' ')[1];

        //console.log(userId);
        //console.log(path);
        //console.log(token);

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
       let token = request.header("Authorization")!.split(' ')[1];

        if(filePath == null) {
            response.status(400);
            return response.send({
                success: false,
                status: 400
            });
        }

        filePath = decodeURI(filePath);

        let decoded = UserController.getUserDecodedToken(token);

        if(decoded == null) {
            response.status(401);
            return response.send({
                status: 401
            });
        }

        let path = `user/${decoded!.id}/files/${filePath}`;
        
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

    async downloadFilesCompacted({ request, response }: HttpContextContract) {
        let token = request.header("Authorization")!.split(' ')[1];
        //let { files } = request.qs() as { files: string[] };
        let files: string | null = request.input("files", null);

        if(token == null || files == null) {
            response.status(400);
            return response.send({
                status: 400
            });
        }

        files = decodeURI(files);
        let resFiles = files.split(',');

        let decoded = UserController.getUserDecodedToken(token);

        if(decoded == null) {
            response.status(401);
            return response.send({
                status: 401
            });
        }

        let filesPath: string | string[] = `storage/user/${decoded.id}/files`;


        

        // Converter o novo arquivo zip para um buffer
        //const data = await newZip.generateAsync({ type: "nodebuffer" });

        let zipPath = `${filesPath}/downloadZip.zip`;


        let zip = new jszip().folder(zipPath)!;

        for(let i = 0; i < resFiles.length; i++) {
            zip.file(resFiles[i], fsA.createReadStream(`${filesPath}/${resFiles[i]}`), { base64: true, createFolders: false });
        }

        let zipBuffer = await zip.generateAsync({ type: "nodebuffer" });

        await Drive.use("local").put(`user/${decoded.id}/files/downloadZip.zip`, zipBuffer);

        let zipUrl = await Drive.use("local").getUrl(`user/${decoded.id}/files/downloadZip.zip`);
        
        let finalUrl = `${Application.appRoot}${zipUrl}`;
        //console.log(finalUrl);

        response.status(200);
        
        //response.header("Content-Type", "application/zip");
        //response.header("Content-Disposition", "attachment");
        //response.header("filename", "files.zip");
        try {
            return response.download(finalUrl);
        }catch(err) {
            response.status(404);
            return response.send({
                status: 404
            });
        } finally {

        }
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
        let realFilePath = `${Application.appRoot}/storage/${path}`;

        //let fileInfo = await fs.stat(`${Application.appRoot}/storage/${path}`);
        let resType = this.getFileType(realFilePath);
        let fileType = resType.fileType;

        //let fileType: FileTypeResult | string | undefined = await fileTypeFromFile(`${Application.appRoot}/storage/${path}`);

        let extension: string[] | string = path[path.length - 1].split('.');
        extension = extension[extension.length - 1];

        let data: string | undefined = undefined;

        if(!resType.isVideo && !resType.isImage && !resType.isPdf && !resType.isCode) {
            try {
                //let reader = await Drive.getStream(path);
                data = (await Drive.get(path)).toString();
                fileType = "text";
            } catch(e) {
                console.error(e);
            }
        } else if(resType.isCode) {
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

        if(resType.isImage || resType.isPdf) {
            return response.send({
                type: fileType,
                extension: extension,
                data: data,
                url: `localhost:3333${await Drive.use("local").getSignedUrl(path)}`,
                status: 200
            });
        } else if(resType.isVideo) {
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

        //console.log(`${path}/${folderName}`);

        let drivePath = Drive.use("local").makePath(`${path}/${folderName}`);

        let dirExists = await Drive.use("local").exists(drivePath);

        
        if(dirExists == true) {
            response.status(406);
            return response.send({
                success: false,
                status: 406
            });
        }
        
        
        // Obtenho o caminho ate a pasta
        //let drivePath = await Drive.use("local").getUrl(`${path}`);
        
        // Crio o pasta no diretorio do usuario
        await fs.mkdir(`${drivePath}`);

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

        let filePath = `${Application.appRoot}/storage/${publicFile.filePath}`;

        let stats = await fs.stat(filePath);

        

        let name: string[] | string = publicFile.filePath.split('/');
        name = name[name.length - 1];

        let extension: string[] | string | null = name.split('.');
        extension = extension[extension.length - 1];

        if(extension == name) {
            extension = null;
        }

        let resType = this.getFileType(filePath);

        if(resType == null) {
            response.status(404);
            return response.send({
                status: 404
            });
        }

        let fileType = resType.fileType;

        let path = `user/${userId}/files/${filePath}`;

        let data: string | undefined = undefined;

        if(!resType.isVideo && !resType.isImage && !resType.isPdf && !resType.isCode) {
            try {
                //let reader = await Drive.getStream(path);
                data = (await Drive.get(publicFile.filePath)).toString();
                fileType = "text";
            } catch(e) {
                console.error(e);
            }
        } else if(resType.isCode) {
            try {
                data = (await Drive.get(publicFile.filePath)).toString();
                fileType = "code";
            } catch(e) {
                console.error(e);
            }
        } else if(!resType.isVideo) {
            try {
                data = (await Drive.get(publicFile.filePath)).toString("base64");
            } catch(e) {
                console.error(e);
            }
        } else {
            
        }

        let realPath: string | string[] = publicFile.filePath;
        realPath = realPath.split('/');
        realPath.shift();
        realPath.shift();
        realPath.shift();
        
        type PublicFileResponse = {
            fileInfo: PublicFileInfo | null;
            userInfo: {
                name: string;
                avatar: string;
            } | null;
            status: number;
        };

        let fileInfo: PublicFileInfo = {
            name: name,
            extension: extension,
            type: resType.fileType,
            mimeType: resType.mimeType,
            url: (resType.isVideo) ? `http://localhost:3333/api/user/${userId}/video/${realPath.join('/')}` : undefined,
            size: this.convertBytesToMb(fileStats.size),
            data: data,
            filePath: publicFile.filePath,
            created_at: `${stats.ctime.getHours()}:${(stats.ctime.getMinutes() < 10) ? `0${stats.ctime.getMinutes()}` : `${stats.ctime.getMinutes()}`} ${stats.ctime.getFullYear()}/${stats.ctime.getMonth()}/${stats.ctime.getDay()}`,
            updated_at: `${stats.mtime.getHours()}:${(stats.mtime.getMinutes() < 10) ? `0${stats.mtime.getMinutes()}` : `${stats.mtime.getMinutes()}`} ${stats.mtime.getFullYear()}/${stats.mtime.getMonth()}/${stats.mtime.getDay()}`
        };

        let usr = await User.find(userId);

        if(usr == null) {
            response.status(404);
            return response.send({
                fileInfo: null,
                userInfo: null,
                status: 404
            });
        }

        let userInfo = {
            name: usr!.name,
            avatar: ""
        }

        if(usr.avatar != null) {
            userInfo.avatar = `data:image/${userInfo.avatar.split('.')[1]};base64,${(await Drive.use("local").get(`user/${usr.id}/profile/${usr.avatar}`)).toString("base64")}`;
        }

        let res: PublicFileResponse = {
            fileInfo: fileInfo,
            userInfo: userInfo,
            status: 200
        };

        response.status(200);
        return response.send(res);
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
