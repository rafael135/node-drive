import Hash from '@ioc:Adonis/Core/Hash';
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import User from 'App/Models/User';
import Env from '@ioc:Adonis/Core/Env';
import JWT from "jsonwebtoken";
import Drive from '@ioc:Adonis/Core/Drive';
import StorageType from 'App/Models/StorageType';
import fs from "node:fs/promises";

export default class AuthController {

    async register({ request, response }: HttpContextContract) {
        let name: string | null = request.input("name", null);
        let email: string | null = request.input("email", null);
        let password: string | null = request.input("password", null);
        let confirmPassword: string | null = request.input("confirmPassword", null);

        type errorType = {
            target: "name" | "email" | "password" | "confirmPassword";
            msg: string;
        }

        let errors: errorType[] = [];

        if(name == "" || name == null) {
            errors.push({
                target: "name",
                msg: "Nome não preenchido!"
            });
        }

        if(email == "" || email == null) {
            errors.push({
                target: "email",
                msg: "E-mail não preenchido!"
            });
        } else if (!email.match(/(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@[*[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+]*/)) {
            errors.push({
                target: "email",
                msg: "E-mail inválido!"
            });
        }

        if(password == "" || password == null) {
            errors.push({
                target: "password",
                msg: "Senao não preenchida!"
            });
        } else if (password.length < 8) {
            errors.push({
                target: "password",
                msg: "Senha deve ter no minimo 8 caracteres!"
            });
        }

        if(errors.find((err) => err.target == "password") == undefined) {
            if(confirmPassword == "" || confirmPassword == null) {
                errors.push({
                    target: "confirmPassword",
                    msg: "Repita a senha!"
                });
            } else if (confirmPassword != password) {
                errors.push({
                    target: "confirmPassword",
                    msg: "As senhas devem ser iguais!"
                });
            }
        }

        if(name == null || email == null || password == null || confirmPassword == null) {
            response.status(406);
            return response.send({
                response: {
                    user: null,
                    errors: errors
                },
                status: 406
            })
        }

        if(errors.length == 0) {
            let passwordHash = await Hash.make(password);

            let newUser = await User.create({
                name: name,
                email: email,
                password: passwordHash,
                storage_type_id: 1,
                files_path: null,
                avatar: null
            });

            let token = JWT.sign({ id: newUser.id, email: newUser.email }, Env.get("APP_KEY"), { algorithm: "HS256", expiresIn: "5 days" });

            let userFilesPath = `/user/${newUser.id}/files`;
            let userAvatarPath = `/user/${newUser.id}/profile`;

            //await fs.mkdir(`${Drive.application.appRoot}/publicUser/${newUser.id}`);
            //await Drive.use("publicUser").put(`${Drive.application.appRoot}/publicUser/${newUser.id}`, "")
            

            newUser.files_path = userFilesPath;
            await newUser.save();

            let userStorageType = await StorageType.find(newUser.storage_type_id);

            await Drive.put(`${userFilesPath}/ignore`, `${newUser.id}`);
            await Drive.put(`${userAvatarPath}/ignore`, `${newUser.id}`);

            response.status(201);
            response.safeHeader("Authorization", token);
            return response.send({
                response: {
                    user: newUser,
                    maxSpace: (userStorageType == null) ? 5 : userStorageType.storageSize,
                    token: token
                },
                status: 201
            });
        }


        response.status(406);
        return response.send({
            response: {
                user: null,
                errors: errors
            },
            status: 406
        });

    }

    async login({ request, response }: HttpContextContract) {
        let email: string | null = request.input("email", null);
        let password: string | null = request.input("password", null);

        type errorType = {
            target: "email" | "password" | "all";
            msg: string;
        }

        let errors: errorType[] = [];

        if(email == null || email == "") {
            errors.push({
                target: "email",
                msg: "E-mail não preenchido!"
            });
        } else if(!email.match(/(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@[*[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+]*/)) {
            errors.push({
                target: "email",
                msg: "E-mail inválido!"
            });
        }

        if(password == "" || password == null) {
            errors.push({
                target: "password",
                msg: "Senha não preenchida!"
            });
        }

        if(password != null) {
            if(password.length < 8) {
                errors.push({
                    target: "password",
                    msg: "Senha menor que 8 caracteres!"
                });
            }
        }

        let usr: User | null;

        if(errors.length == 0) {
            usr = await User.findBy("email", email);

            if(usr == null) {
                errors.push({
                    target: "all",
                    msg: "E-mail e/ou Senha incorretos!"
                });

                response.status(406);
                return response.send({
                    response: {
                        user: null,
                        errors: errors
                    },
                    status: 406
                });
            }

            let verifyPassword = await Hash.verify(usr.password, password!);

            if(verifyPassword == true) {
                let token = JWT.sign({ id: usr.id, email: usr.email }, Env.get("APP_KEY"), { algorithm: "HS256", expiresIn: "5 days" });

                let userStorageType = await StorageType.find(usr.storage_type_id);

                if(usr.avatar != null) {
                    let ext = usr.avatar.split('.')[1];
                    let fileName = usr.avatar;

                    let path = `user/${usr.id}/profile/${fileName}`;
                    let base64Img = `data:image/${ext};base64,${(await Drive.use("local").get(path)).toString("base64")}`;

                    usr.avatar = base64Img;
                } 

                


                

                response.status(200);
                return response.send({
                    response: {
                        user: usr,
                        maxSpace: (userStorageType == null) ? 5 : userStorageType.storageSize,
                        token: token
                    },
                    status: 200
                });
            }
        }

        response.status(406)
        return response.send({
            response: {
                user: null,
                errors: errors
            },
            status: 406
        });
    }


    async checkToken({ request, response }: HttpContextContract) {
        response.status(200);

        return response.send({
            status: 200
        });
    }
}
