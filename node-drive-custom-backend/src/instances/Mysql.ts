import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize({
    host: process.env.DB_HOST as string,
    port: parseInt(process.env.DB_PORT as string),
    username: process.env.DB_USER as string,
    password: process.env.DB_PASSWORD as string,
    schema: process.env.DB_DATABASE as string,
    dialect: "mariadb",
});

export default sequelize;