import { NextFunction , Request, Response } from 'express';
import { verifyJWT } from '../util/jwt';
import { Session } from '../models';
import AppDataSource from "../util/db";
import jwt from 'jsonwebtoken';
import {config} from '../util/config';

export async function LocalAuthGuard(req: Request, res: Response, next: NextFunction){
    const { accessToken, refreshToken, userData } = req.cookies;
    const sessionRepository = AppDataSource.getRepository(Session)
    //not authorized
    if(!accessToken && !refreshToken){
        if(userData){
            const session = await sessionRepository.findOneBy({id:userData.sessionId});
            if(session){
                await sessionRepository.remove(session);
            }
        }
        res.cookie('userData','',{
            maxAge:0,
        });
        return next();
    }

    //verify access token if its still valid  
    const { payload, expired } = accessToken? verifyJWT( accessToken ):{payload:null,expired:true};
    //For a valid access token
    if(payload){
        console.log("granting access with the existing access token!");
        req.user = payload;
        const {iat,exp,userId,...rest} = payload 
        res.cookie('userData',rest,{
            maxAge:300000,
        })
        return next();
    }
   
    console.log("access token expired proceeding to refresh token!");
    
    //expired but valid access token
    const { payload: refresh } = expired && refreshToken ? verifyJWT(refreshToken): {payload:null};
    if(!refresh){
        console.log("refresh token expired, deleting sessions and navigating to log in page!");
        if(userData){
            const session = await sessionRepository.findOneBy({id:userData.sessionId});
            if(session){
                await sessionRepository.remove(session);
            }
        }
        res.cookie('userData','',{
            maxAge:0,
        });
        res.cookie('refreshToken','',{
            maxAge:0,
        });
        res.cookie('accessToken','',{
            maxAge:0,
        });
        return next();
    }
    
    console.log("refresh token valid proceeding to check session!");

    const session = await sessionRepository.findOneBy({id:refresh.sessionId});
    if(!session || !session.valid){
        console.log("session is not valid, deleting cookies and navigating to log in page!");
        res.cookie('userData','',{
            maxAge:0,
        });
        res.cookie('refreshToken','',{
            maxAge:0,
        });
        res.cookie('accessToken','',{
            maxAge:0,
        });
        return next();
    }
    console.log("session is valid, proceeding to create new access token!");

    const {iat,exp,userId,...rest} = refresh;
    const tokenData  = {userId,...rest};
    const newAccessToken = jwt.sign(tokenData,config.jwt_secret,{expiresIn:'5m'});
    
    res.cookie('userData',rest,{
        maxAge:300000,
    })

    res.cookie("accessToken",newAccessToken,{
        maxAge:300000,
        httpOnly:true,
    });
    console.log("new access token created, granting access with a new access token!");
    req.user = verifyJWT(newAccessToken).payload;
    return next();
}

