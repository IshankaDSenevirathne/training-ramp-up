import {Response,Request} from "express";
import { signinUser, signoutUser, signupUser} from "../services";

export async function registerUser( req: Request , res: Response ){
    const result = await signupUser(req.body);
    if(result.error){
        res.status(400);
        res.send({message:"Signup Failed!",error:result.error});
        return;
    }
    res.cookie('accessToken',result.accessToken,{
        maxAge:300000,
        httpOnly:true,
    });
    res.cookie('refreshToken',result.refreshToken,{
        maxAge:3.154e10,
        httpOnly:true,
    });
    res.cookie('userData',result.userData,{
        maxAge:300000,
    });
    res.status(200);
    res.send({message:result.message});
    return;

}

export async function loginUser( req: Request , res: Response ){
    const result = await signinUser(req.body);
    if(result.error){
        res.status(400);
        res.send({message:"Login Failed!",error:result.error});
        return ;
    }
    res.cookie('accessToken',result.accessToken,{
        maxAge:300000,
        httpOnly:true,
    });
    res.cookie('refreshToken',result.refreshToken,{
        maxAge:3.154e10,
        httpOnly:true,
    });
    res.cookie('userData',result.userData,{
        maxAge:300000,
    })
    res.status(200);
    res.send({message:result.message});
    return;
}

export async function logoutUser(req: Request, res: Response){
    let sessionId:string = req.params.sessionId;
    const result = await signoutUser(sessionId);
    if(result.error){
        res.status(400);
        res.send({message:"Log out Failed!",error:result.error});
        return;
    }
    res.cookie("accessToken","",{
        maxAge:0,
        httpOnly:true
    });
    
    res.cookie("refreshToken","",{
        maxAge:0,
        httpOnly:true
    });

    res.cookie("userData","",{
        maxAge:0,
    });
    res.status(200);
    res.send({message:result.message});
    return;
}

export async function loginStatus(req: Request, res: Response){
    if(!req.user){
        res.status(400);
        res.send({message:"Unauthorized",error:"User currently not logged in!"});
        return; 
    }
    res.status(200);
    res.send(req.user);
    return; 
}