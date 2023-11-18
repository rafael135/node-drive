import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import JWT from "jsonwebtoken";
import Drive from '@ioc:Adonis/Core/Drive';
import User from 'App/Models/User';

type decodedToken = {
    id: number;
    email: string;
    iat: number;
    exp: number;
}

export default class UserController {

    public static getFilesPath(userId: number): string {
        return `user/${userId}/files`;
    }

    public static getAvatarPath(userId: number): string {
        return `user/${userId}/avatar`;
    }


    async changeAvatar({ request, response }: HttpContextContract) {
        let token = request.header("Authorization")!.split(' ')[1];
        let newAvatar = request.file("newAvatar");

        if(newAvatar == null) {
            response.status(400);
            return response.send({
                status: 400
            });
        }

        let decoded = JWT.decode(token) as decodedToken;

        let path = `user/${decoded.id}/profile`;
        let fileName = `avatar.${newAvatar.extname}`;
        let usr = await User.find(decoded.id);

        if(usr != null) {
            if(usr.avatar != null) {
                await Drive.use("local").adapter.unlink(`storage/${path}/${usr.avatar}`);
            }
            
            usr.avatar = fileName;
            await usr.save();
        }

        

        await newAvatar.move(`${Drive.application.appRoot}/storage/${path}`, { name: fileName });
        
        let base64Image = `data:image/${newAvatar.extname};base64,${(await Drive.use("local").get(`${path}/${fileName}`)).toString("base64")}`;

        response.status(200);
        response.send({
            base64Avatar: base64Image,
            status: 200
        });
    }

    async changeName({ request, response }: HttpContextContract) {
        let token = request.header("Authorization")!.split(' ')[1];
        let newName: string | null = request.input("newName", null);
        

        if(newName == null) {
            response.status(400);
            return response.send({
                status: 400
            });
        }


    }   

    async changeEmail({ request, response }: HttpContextContract) {
        let token = request.header("Authorization")!.split(' ')[1];

        let currentEmail: string | null = request.input("currentEmail", null);
        let newEmail: string | null = request.input("newEmail", null);

        if(currentEmail == null || newEmail == null) {
            response.status(400);
            return response.send({
                status: 400
            });
        }

        let decoded = JWT.decode(token) as decodedToken;
    }
}
