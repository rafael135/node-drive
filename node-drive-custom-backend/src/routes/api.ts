import { Router, Request, Response } from "express";

import * as AuthController from "../controllers/AuthCotroller";
import * as FileController from "../controllers/FileController";
import Authentication from "../middlewares/Authentication";

const router = Router();

router.get("/ping", (req: Request, res: Response) => {
    res.json({
        pong: true
    });
});

router.post("/user/login", AuthController.login);
router.post("/user/register", AuthController.register);
router.get("/user/checkToken", AuthController.checkToken);

router.get("/user/files", Authentication, FileController.getFilesAndPaths);



export default router;