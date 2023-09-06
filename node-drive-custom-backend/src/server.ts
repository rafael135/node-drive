import "reflect-metadata";
import express, { Request, Response } from "express";
import path from "path";
import dotenv from "dotenv";
import cors from "cors";
import apiRoutes from "./routes/api";

dotenv.config();


const server = express();

server.use(cors({
    origin: "*"
}));

server.use(express.urlencoded({ extended: true }));


server.use("/api", apiRoutes);


server.use((req: Request, res: Response) => {
    res.status(404);
    return res.json({
        error: "Rota inválida!"
    });
});


server.listen(parseInt(process.env.PORT as string));