import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Drive from '@ioc:Adonis/Core/Drive';
import Application from "@ioc:Adonis/Core/Application";
import mime from 'mime';

import fs from "node:fs";

export default class VideosController {

    async streamVideo({ request, response, params }: HttpContextContract) {
        const userId: string | null = params.userId;
        const filePath: string | null = params.filePath;

        //const token = request.header("Authorization")!.split[1];

        //console.log(userId);

        if(userId == null || filePath == null) {
            response.status(400);
            return response.send({
                status: 404
            });
        }

        let range = request.header("range");

        const videoPath = `${Application.appRoot}/storage/user/${userId}/files/${filePath}`;

        const chunkSize = 10 ** 6; // 1MB // Tamanho maximo de cada pedaço do video a ser enviado por stream
        const videoSize = fs.statSync(videoPath).size;

        if(range == undefined) {
            range = `0-${videoSize}`;
        }

        let videoType = mime.getType(videoPath);

        if(videoType == null) {
            response.status(404);
            return response.send({
                status: 404
            });
        }

        const start = Number(range.replace(/\D/g, ""));
        const end = Math.min(start + chunkSize, videoSize - 1);
        const contentLength = end - start + 1;

        //const headers = {
        //    "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        //    "Accept-Ranges": "bytes",
        //    "Content-Length": contentLength,
        //    "Content-Type": videoType
        //};

        response.safeHeader("Content-Range", `bytes ${start}-${end}/${videoSize}`);
        response.safeHeader("Accept-Ranges", "bytes");
        response.safeHeader("Content-Length", contentLength);
        response.safeHeader("Content-Type", videoType);

        
        response.status(206);

        const videoStream = fs.createReadStream(videoPath, { start: start, end: end });
        
        return response.stream(videoStream);

        // CÓDIGO PARA TESTES:
        /*
        if(range) {
            const parts = range.replace(/bytes=/, '').split('-');

            const start = parseInt(parts[0], 10);
            const end = (parts[1]) ? parseInt(parts[1], 10) : videoSize - 1;

            const chunkSize = end - start + 1;


            
            response.safeHeader("Content-Range", `bytes ${start}-${end}/${videoSize}`);
            response.safeHeader("Accept-Ranges", "bytes");
            response.safeHeader("Content-Length", chunkSize);
            response.safeHeader("Content-Type", videoType);

            response.status(206);
            //response.flushHeaders(206);

            const file = fs.createReadStream(videoPath);

            try {
                return response.stream(file);
            } catch(e) {
                console.log(e);
            }

        } else {

            response.safeHeader("Content-Length", videoSize);
            response.safeHeader("Content-Type", videoType);
            response.status(200);
            //response.flushHeaders(200);

            const file = fs.createReadStream(videoPath);

            try {
                return response.stream(file);
            } catch(e) {
                console.log(e);
            }
            
        }
        */
    }

}
