"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const models_1 = require("../models");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const password = process.env.DB_PASSWORD;
const username = process.env.DB_USERNAME;
const port = Number(process.env.DB_PORT);
const database = process.env.DB_NAME;
const AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: "localhost",
    port: port,
    username,
    password,
    database,
    entities: [models_1.Student, models_1.User, models_1.Session],
    synchronize: true,
    logging: false,
});
exports.default = AppDataSource;
