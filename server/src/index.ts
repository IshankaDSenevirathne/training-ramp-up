import express,{Express} from 'express';
import cors from "cors";
import cookieParser from 'cookie-parser';
import "reflect-metadata";
import  AppDataSource  from './util/db';
import {studentRouter,userRouter} from "./routes";
import { LocalAuthGuard } from './middleware/local.auth.guard';
import { config } from "./util/config";

const app:Express = express();


app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(LocalAuthGuard);
app.use(
    cors({
      credentials: true,
      origin: "http://localhost:3000",
    })
  );
  
app.use('/student',studentRouter);
app.use('/user',userRouter);


AppDataSource.initialize()
    .then(() => {
        console.log("✔ [server]:Successfully connected to postgres!")
    })
    .catch((error) => console.log(error))


app.listen(config.port,()=>{
    console.log((`⚡️ [server]:Server is running at https://localhost:${config.port}`))
});

