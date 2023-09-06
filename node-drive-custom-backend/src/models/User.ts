import { DataTypes, Model } from "sequelize";
import sequelizeMySql from "../instances/Mysql";
import bcrypt from "bcrypt";


export interface UserInstance extends Model {
    id: number;
    name: string;
    email: string;
    password: string;
    dataStorageId: number;
    created_at: Date;
    updated_at: Date;
}


export const User = sequelizeMySql.define<UserInstance>("User", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        set(value: string) {
            this.setDataValue("password", bcrypt.hashSync(value, 10));
        }
    },
    dataStorageId: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    }
}, {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
});