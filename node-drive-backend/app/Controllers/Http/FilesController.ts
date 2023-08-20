import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Drive from '@ioc:Adonis/Core/Drive';
import Application from "@ioc:Adonis/Core/Application";

export default class FilesController {
    async getFoldersAndFilesFrom({ request, response }: HttpContextContract) {
        let path = request.input("path", null);

        if(path == null) {
            response.status(400);
            return response.send({
                response: {
                    files: null
                },
                status: 400
            });
        }

        type newFileType = {
            name: string;
            extension: string | null;
            location: string;
            isFile: boolean;
        }

        let filesAndFolders = await Drive.list(path).map((file) => {
            let loc = file.location.split("/");

            let name  = loc[loc.length - 1];
            let ext = name.split('.');
            let extension: string | null = ext[ext.length - 1];

            if(extension == name) {
                extension = null;
            }

            let newFile: newFileType = { location: file.location, isFile: file.isFile, name: name, extension: extension };

            return newFile;
        }).toArray();

        response.status(200);
        return response.send({
            response: {
                files: filesAndFolders
            },
            status: 200
        });
    }


    async downloadFile({ request, response }: HttpContextContract) {
        let filePath = request.input("path", null);

        if(filePath == null) {
            response.status(400);
            return response.send({
                response: null,
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
            response: null,
            status: 400
        });
    }

    async deleteFile({ request, response }: HttpContextContract) {
        let fileName = request.input("fileName", null);

        if(fileName == null) {
            response.status(400);
            return response.send({
                response: null,
                status: 400
            });
        }

        
    }
}
