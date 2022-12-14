import jwt from 'jsonwebtoken';
import { config } from "./config";

export function verifyJWT(token :string){
    try{
        const decoded: any = jwt.verify(token,config.jwt_secret);
        return {payload:decoded, expired: false};
    }catch(error){
        return { payload: null, expired: true};
    }
}