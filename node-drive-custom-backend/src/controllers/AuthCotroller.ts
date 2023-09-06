import { Request, Response } from "express";
import { User } from "../models/User";
import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";
import { error } from "console";

type ErrorType = {
    field: "name" | "email" | "password" | "confirmPassword" | "all";
    msg: string;
}

export const register = async (req: Request, res: Response) => {
    let { name, email, password, confirmPassword }: { name:string | null, email:string | null, password:string | null, confirmPassword:string | null } = req.body;

    console.log(req.body);

    let errors: ErrorType[] = [];

    if(name == null || name == "") {
        errors.push({
            field: "name",
            msg: "Nome nao preenchido"
        });
    }

    if(email == null || email == "") {
        errors.push({
            field: "email",
            msg: "E-mail nao preenchido"
        });
    } else if(!email.match(/(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@[*[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+]*/)) {
        errors.push({
            field: "email",
            msg: "Formato de e-mail invalido"
        });
    }


    if(password == null || password == "") {
        errors.push({
            field: "password",
            msg: "Campo nao preenchido"
        });
    } else if(password.length < 8) {
        errors.push({
            field: "password",
            msg: "Senha deve ter no minimo 8 caracteres"
        });
    }

    if(password != confirmPassword) {
        errors.push({
            field: "confirmPassword",
            msg: "Senha diferente"
        });
    }


    if(password == null) {

    } else {
        if(errors.length == 0) {
            let newUser = await User.create({
                name: name,
                email: email,
                password: password,
            });

            let token = JWT.sign({ id: newUser.id, email: newUser.email }, process.env.APP_KEY as string, { algorithm: "PS384" });

            res.status(201);
            return res.send({
                user: newUser.toJSON(),
                token: token,
                status: 201
            });
        }
    }

    res.status(400);
    return res.send({
        errors: errors,
        status: 400
    });
}

export const login = async (req: Request, res: Response) => {
    let { email, password }: { email:string | null, password:string | null } = req.body;

    let errors: ErrorType[] = [];

    if(email == null || email == "") {
        errors.push({
            field: "email",
            msg: "E-mail nao preenchido"
        });
    } else if(!email.match(/(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@[*[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+]*/)) {
        errors.push({
            field: "email",
            msg: "Formato de e-mail invalido"
        });
    }

    if(password == null || password == "") {
        errors.push({
            field: "password",
            msg: "Senha nao preenchida"
        });
    }

    if(errors.length != 0) {
        res.status(400);
        return res.send({
            errors: errors,
            status: 400
        });
    }

    let usr = await User.findOne({
        where: { email: email }
    });

    if(usr == null) {
        errors.push({
            field: "all",
            msg: "E-mail e/ou senha incorreta"
        });

        res.status(401);
        return res.send({
            errors: errors,
            status: 401
        });
    }

    let isValid = await bcrypt.compare(password!, usr.password);

    if(isValid == false) {
        errors.push({
            field: "all",
            msg: "E-mail e/ou senha incorreta"
        });

        res.status(401);
        return res.send({
            errors: errors,
            status: 401
        });
    }

    let token = JWT.sign({ id: usr.id, email: usr.email }, process.env.APP_KEY as string, { algorithm: "PS384" });

    res.status(200);
    return res.send({
        user: usr.toJSON(),
        token: token,
        status: 200
    });
    
}

export const checkToken = async (req: Request, res: Response) => {
    res.status(200);
    return res.send({
        status: 200
    });
}