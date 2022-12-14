import dotenv from 'dotenv';

dotenv.config();

export const config = {
    db : process.env.DB_NAME,
    db_username :process.env.DB_USERNAME,
    db_password : process.env.DB_PASSWORD,
    db_port : Number(process.env.DB_PORT),
    port : Number(process.env.PORT),
    jwt_secret : String(process.env.JWT_SECRET)
}