import "reflect-metadata"
import { DataSource } from "typeorm"
import { Student, User, Session } from "../models"
import { config } from "./config";

const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port:config.db_port,
    username: config.db_username,
    password:config.db_password,
    database:config.db,
    entities: [Student,User,Session],
    synchronize: true,
    logging: false,
})

export default AppDataSource;