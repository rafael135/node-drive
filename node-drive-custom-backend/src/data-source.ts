import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { User } from "./entity/User";

dotenv.config();

export const AppDataSource = new DataSource({
    type: "mariadb",
    host: process.env.DB_HOST as string,
    port: parseInt(process.env.DB_PORT as string),
    username: process.env.DB_DATABASE as string,
    password: process.env.DB_PASSWORD as string,
    database: process.env.DB_DATABASE as string,
    synchronize: true,
    logging: true,
    entities: [User],
    subscribers: [],
    migrations: [],
})