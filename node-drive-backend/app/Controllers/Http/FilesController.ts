import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Drive from '@ioc:Adonis/Core/Drive';

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
            location: string;
            isFile: boolean;
        }

        let filesAndFolders = await Drive.list(path).map((file) => {
            let newFile: newFileType = { location: file.location, isFile: file.isFile };

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
}
