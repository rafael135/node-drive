import { Request, Response } from '@adonisjs/core/build/standalone';
import Hash from '@ioc:Adonis/Core/Hash';
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import User from 'App/Models/User';
import Env from '@ioc:Adonis/Core/Env';
import JWT from "jsonwebtoken";
import Drive from '@ioc:Adonis/Core/Drive';

export default class AuthController {
    async register({ request, response }: { request: Request, response: Response }) {
        let name: string | null = request.input("name", null);
        let email: string | null = request.input("email", null);
        let password: string | null = request.input("password", null);
        let confirmPassword: string | null = request.input("confirmPassword", null);

        type errorType = {
            field: "name" | "email" | "password" | "confirmPassword";
            msg: string;
        }

        let errors: errorType[] = [];

        if(name == "" || name == null) {
            errors.push({
                field: "name",
                msg: "Nome não preenchido!"
            });
        }

        if(email == "" || email == null) {
            errors.push({
                field: "email",
                msg: "E-mail não preenchido!"
            });
        } else if (!email.match(/(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@[*[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+]*/)) {
            errors.push({
                field: "email",
                msg: "E-mail não válido!"
            });
        }

        if(password == "" || password == null) {
            errors.push({
                field: "password",
                msg: "Senao não preenchida!"
            });
        } else if (password.length < 8) {
            errors.push({
                field: "password",
                msg: "Senha deve ter no minimo 8 caracteres!"
            });
        }

        if(errors.find((err) => err.field == "password") == undefined) {
            if(confirmPassword == "" || confirmPassword == null) {
                errors.push({
                    field: "confirmPassword",
                    msg: "Repita a senha!"
                });
            } else if (confirmPassword != password) {
                errors.push({
                    field: "confirmPassword",
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
                storage_type_id: null,
                files_path: null
            });

            let token = JWT.sign({ id: newUser.id, email: newUser.email }, Env.get("APP_KEY"), { algorithm: "HS256", expiresIn: "5 days" });

            let userFilesPath = `/user/${newUser.id}/files`;
            newUser.files_path = userFilesPath;
            await newUser.save();

            await Drive.put(`${userFilesPath}/ignore`, `${newUser.id}`);

            response.status(201);
            response.safeHeader("Authorization", token);
            return response.send({
                response: {
                    user: newUser,
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

    async login({ request, response }: { request: Request, response: Response }) {
        let email: string | null = request.input("email", null);
        let password: string | null = request.input("password", null);

        type errorType = {
            field: "email" | "password" | "all";
            msg: string;
        }

        let errors: errorType[] = [];

        if(email == null || email == "") {
            errors.push({
                field: "email",
                msg: "E-mail não preenchido!"
            });
        } else if(!email.match(/(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@[*[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+]*/)) {
            errors.push({
                field: "email",
                msg: "E-mail não válido!"
            });
        }

        if(password == "" || password == null) {
            errors.push({
                field: "password",
                msg: "Senha não preenchida!"
            });
        }

        if(errors.length == 0) {
            let usr = await User.findBy("email", email);

            if(usr == null) {
                errors.push({
                    field: "all",
                    msg: "E-mail e/ou Senha incorreto!"
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

                response.status(200);
                return response.send({
                    response: {
                        user: usr,
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


    async checkToken({ request, response }: { request: Request, response: Response }) {
        response.status(200);

        return response.send({
            status: 200
        });
    }
}
