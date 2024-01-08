import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Hash from '@ioc:Adonis/Core/Hash';
import JWT from "jsonwebtoken";
import Drive from '@ioc:Adonis/Core/Drive';
import User from 'App/Models/User';
import StorageType from 'App/Models/StorageType';
import PublicFile from 'App/Models/PublicFile';

type decodedToken = {
    id: number;
    email: string;
    iat: number;
    exp: number;
}

type InputErrorType = {
    target: string;
    msg: string;
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
        
        let errors: InputErrorType[] = [];

        if(newName == null) {
            errors.push({ target: "newName", msg: "Nome não preenchido!" });

            response.status(400);
            return response.send({
                errors: errors,
                status: 400
            });
        }

        let decoded = UserController.getUserDecodedToken(token);

        if(decoded == null) {
            errors.push({ target: "form", msg: "Erro desconhecido!" })

            response.status(401);
            return response.send({
                errors: errors,
                status: 401
            });
        }

        let usr = await User.find(decoded.id);

        if(usr != null) {
            usr.name = newName;
            await usr.save();

            response.status(200);
            return response.send({
                errors: null,
                status: 200
            });
        }

        errors.push({ target: "form", msg: "Erro desconhecido!" });

        response.status(404);
        return response.send({
            errors: errors,
            status:404
        });
    }   

    async changeEmail({ request, response }: HttpContextContract) {
        let token = request.header("Authorization")!.split(' ')[1];

        let password: string | null = request.input("password", null);
        let newEmail: string | null = request.input("newEmail", null);

        let errors: InputErrorType[] = [];

        if(newEmail == null || password == null) {
            errors.push({ target: "newEmail", msg: "E-mail inválido!" });
            errors.push({ target: "password", msg: "Senha inválida!" });

            response.status(400);
            return response.send({
                errors: errors,
                status: 400
            });
        }

        if(newEmail.length == 0 || password.length == 0) {
            errors.push({ target: "newEmail", msg: "E-mail não preenchido!" });
            errors.push({ target: "password", msg: "Senha não preenchida!" });

            response.status(400);
            return response.send({
                errors: errors,
                status: 400
            });
        }

        let decoded = UserController.getUserDecodedToken(token);

        if(decoded == null) {
            errors.push({ target: "newEmail", msg: "E-mail e/ou senha inválida!" });
            errors.push({ target: "password", msg: "E-mail e/ou senha inválida!" });

            response.status(401);
            return response.send({
                errors: errors,
                status: 401
            });
        }

        let usr = await User.find(decoded.id);

        if(usr == null) {
            errors.push({ target: "newEmail", msg: "E-mail e/ou senha inválida!" });
            errors.push({ target: "password", msg: "E-mail e/ou senha inválida!" });

            response.status(401);
            return response.send({
                errors: errors,
                status: 401
            });
        }

        let passwordValid = await Hash.verify(usr.password, password);

        if(passwordValid == false) {
            errors.push({ target: "password", msg: "E-mail e/ou senha inválida!" });

            response.status(401);
            return response.send({
                errors: errors,
                status: 401
            });
        }

        usr.email = newEmail;
        await usr.save();

        response.status(200);
        return response.send({
            errors: null,
            status: 200
        });
    }

    async changeStoragePlan({ request, response }: HttpContextContract) {
        let selectedPlanId: number | null = request.input("selected", null);
        let token: string | null = request.header("Authorization")!.split(' ')[1];

        if(selectedPlanId == null || token == null) {
            response.status(400);
            return response.send({
                success: false,
                status: 400
            });
        }

        let decoded = UserController.getUserDecodedToken(token);

        if(decoded == null) {
            response.status(401);
            return response.send({
                success: false,
                status: 401
            });
        }

        let user = await User.find(decoded.id);

        if(user != null) {
            let storagePlan = await StorageType.find(selectedPlanId);

            if(storagePlan != null) {
                user.storage_type_id = storagePlan.id;
                user.save();

                response.status(200);
                return response.send({
                    success: true,
                    status: 200
                });
            } else {
                response.status(400);
                return response.send({
                    success: false,
                    status: 400
                });
            }
        }

        response.status(401);
        return response.send({
            success: false,
            status: 401
        });


    }

    async getMaxSharedFilesQte({ request, response }: HttpContextContract) {
        let token: string = request.header("Authorization")!.split(' ')[1];

        let decodedToken = UserController.getUserDecodedToken(token);

        if(decodedToken == null) {
            response.status(401);
            return response.send({
                maxQte: null,
                status: 401
            });
        }

        let usr = await User.find(decodedToken.id);

        if(usr == null) {
            response.status(406);
            return response.send({
                maxQte: null,
                status: 406
            });
        }

        let maxQte = (await StorageType.find(usr.storage_type_id))!.maxSharedFiles;

        response.status(200);
        return response.send({
            maxQte: maxQte,
            status: 200
        });
    }
}
