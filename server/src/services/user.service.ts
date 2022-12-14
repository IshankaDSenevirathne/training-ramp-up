import { User, Session } from "../models";
import AppDataSource from "../util/db";
import * as argon from 'argon2';
import jwt from 'jsonwebtoken';
import { config } from "../util/config";
import { SignUpDataInputType, LogInDataInputType } from "../interfaces";

export const userRepository = AppDataSource.getRepository(User);
export const sessionRepository = AppDataSource.getRepository(Session);

export async function signupUser(data:SignUpDataInputType){
    try{
        const hash = await argon.hash(data.password);
        const user = new User()
        user.name=data.name;
        user.email = data.email.toLowerCase();
        user.password = hash;
        
        const newUser = await userRepository.save(user);
        
        if(!newUser){
            return {error:"Failed to create user entity!"};
        }
        const {password,id,...rest} = newUser;
        const newSession = await sessionRepository.save({email:rest.email,name:rest.name,valid:true});
        const tokenData = {userId:id,sessionId:newSession.id,...rest};
        const accessToken =  jwt.sign(tokenData,config.jwt_secret,{expiresIn:'5m'});
        const refreshToken =  jwt.sign(tokenData,config.jwt_secret,{expiresIn:'1y'});
        const userData = {sessionId:newSession.id,email:newSession.email,name:newSession.name,role:newUser.role};
        return {message:"Sign Up Successfull!",userData,refreshToken,accessToken};
    }catch(error){
        return {error}
    }
}

export async function signinUser(data:LogInDataInputType){
    try{
        const user = await userRepository.findOneBy({email:data.email.toLowerCase()});
        
        if(!user){
            return {error:"User not found!"};
        }
        const pwMatches = await argon.verify(user.password,data.password);
        if(!pwMatches){
            return {error:"Incorrect Credentials!"};
        }
        const {password,id,...rest} = user;
        const newSession = await sessionRepository.save({email:rest.email,name:rest.name,valid:true});
        const tokenData = {userId:id,sessionId:newSession.id,...rest};
        const accessToken =  jwt.sign(tokenData,config.jwt_secret,{expiresIn:'5m'});
        const refreshToken =  jwt.sign(tokenData,config.jwt_secret,{expiresIn:'1y'});
        const userData = {sessionId:newSession.id,email:newSession.email,name:newSession.name,role:user.role};
        
        return {message:"Login Successfull!",userData,refreshToken,accessToken};
    }catch(error){
        return {error:"Login failed"}
    }
}

export async function signoutUser(sessionId:string){
    try{
        const session = await sessionRepository.findOneBy({id:sessionId});
        if(!session){
            return {error:"Session doesn't exist!"};
        }
        const invalidSession = await sessionRepository.save({...session,valid:false});
        return {message:"Successfully logged out!"}
    }catch(error){
        return {error:"Failed to log out!"}
    }
}
