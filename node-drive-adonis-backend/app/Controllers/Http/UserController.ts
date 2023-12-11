import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Hash from '@ioc:Adonis/Core/Hash';
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

    public static getUserDecodedToken(token: string): decodedToken | null {
        let decodedUser = JWT.decode(token) as decodedToken | null;

        return decodedUser;
    }

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

        let decoded = UserController.getUserDecodedToken(token);

        if(decoded == null) {
            response.status(401);
            return response.send({
                status: 401
            });
        }

        let usr = await User.find(decoded.id);

        if(usr != null) {
            usr.name = newName;
            await usr.save();

            response.status(200);
            return response.send({
                status: 200
            });
        }

        response.status(404);
        return response.send({
            status:404
        });
    }   

    async changeEmail({ request, response }: HttpContextContract) {
        let token = request.header("Authorization")!.split(' ')[1];

        let password: string | null = request.input("password", null);
        let newEmail: string | null = request.input("newEmail", null);

        if(newEmail == null || password == null) {
            response.status(400);
            return response.send({
                status: 400
            });
        }

        let decoded = UserController.getUserDecodedToken(token);

        if(decoded == null) {
            response.status(401);
            return response.send({
                status: 401
            });
        }

        let usr = await User.find(decoded.id);

        if(usr == null) {
            response.status(401);
            return response.send({
                status: 401
            });
        }

        let passwordValid = await Hash.verify(usr.password, password);

        if(passwordValid == false) {
            response.status(401);
            return response.send({
                status: 401
            });
        }

        usr.email = newEmail;
        await usr.save();

        response.status(200);
        return response.send({
            status: 200
        });
    }
}
