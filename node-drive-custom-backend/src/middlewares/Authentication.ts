import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import JWT from "jsonwebtoken";

dotenv.config();

const Authentication = (req: Request, res: Response, next: NextFunction) => {
    let token = req.headers.authorization?.split(' ')[1];

    if(token == null) {
        res.status(401);
        return res.send({
            status: 401
        });
    }

    let isValid = false;

    try {
        let decoded = JWT.verify(token, process.env.APP_TOKEN as string);
        isValid = true;
    } catch(e) {
        console.error(e);
    }

    if(isValid == true) {
        return next();
    }

    res.status(401);
    return res.send({
        status: 401
    });
}



export default Authentication;