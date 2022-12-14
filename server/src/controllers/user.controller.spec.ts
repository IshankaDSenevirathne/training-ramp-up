import { loginUser, logoutUser, registerUser, loginStatus } from "./user.controller";
import * as UserService from "../services/user.service"
import {Role} from '../models/User';

describe("UserController",()=>{
    //Log In User Tests
    describe("logInUser",()=>{
        // login success result from service
        const loggedInUser = {
            message:"Login Successfull!",
            userData:{
                sessionId:"fake_session_id",
                name:"fake_name",
                email:"fake_email@fake.com",
                role:Role.guest
            },
            refreshToken:"fake_refresh_token",
            accessToken:"fake_access_token",
            error:undefined
        }
        // login failed result from service
        const logInUserError = {
            error:"User not found!",
        }
        const request={
            body:{
                email:'fake_username',
                password:'fake_password'
            }
        } as any
        const response ={
            status:jest.fn((x)=>x),
            send:jest.fn((x)=>x),
            cookie:jest.fn((x)=>x)
        } as any

        //positive test
        test("Should send a status of 200",async ()=>{
            const spy = jest.spyOn(UserService,"signinUser").mockResolvedValue(loggedInUser);
            await loginUser(request,response);
            expect(response.status).toHaveBeenCalledWith(200);
            expect(response.send).toHaveBeenCalledWith({message:"Login Successfull!"});
            expect(response.cookie).toHaveBeenCalledTimes(3);
            spy.mockRestore();
        })

        //negative test
        test("Should send a status of 400", async ()=>{
            const spy = jest.spyOn(UserService,"signinUser").mockResolvedValue(logInUserError);
            await loginUser(request,response);
            expect(response.status).toHaveBeenCalledWith(400);
            expect(response.send).toHaveBeenCalledWith({
                message:"Login Failed!",
                error:"User not found!",
                userData:undefined,
                accessToken:undefined,
                refreshToken:undefined
            });
            spy.mockRestore();
        })
    });

    //Register Up User Tests
    describe("registerUser",()=>{
        // login success result from service
        const registeredUser = {
            message:"Sign Up Successfull!",
            userData:{
                sessionId:"fake_session_id",
                name:"fake_name",
                email:"fake_email@fake.com",
                role:Role.guest
            },
            refreshToken:"fake_refresh_token",
            accessToken:"fake_access_token",
            error:undefined
        }
        // login failed result from service
        const registerUserError = {
            error:"Failed to register user!",
        }

        const request={
            body:{
                email:'fake_username',
                password:'fake_password'
            }
        } as any
        const response ={
            status:jest.fn((x)=>x),
            send:jest.fn((x)=>x),
            cookie:jest.fn((x)=>x)
        } as any

        //positive test
        test("Should send a status of 200",async ()=>{
            const spy = jest.spyOn(UserService,"signupUser").mockResolvedValue(registeredUser);
            await registerUser(request,response);
            expect(response.status).toHaveBeenCalledWith(200);
            expect(response.send).toHaveBeenCalledWith({message:"Sign Up Successfull!"});
            expect(response.cookie).toHaveBeenCalledTimes(3);
            spy.mockRestore();
        })

        //negative test
        test("Should send a status of 400", async ()=>{
            const spy = jest.spyOn(UserService,"signupUser").mockResolvedValue(registerUserError);
            await registerUser(request,response);
            expect(response.status).toHaveBeenCalledWith(400);
            expect(response.send).toHaveBeenCalledWith({
                message:"Signup Failed!",
                error:"Failed to register user!",
                userData:undefined,
                accessToken:undefined,
                refreshToken:undefined
            });
            spy.mockRestore();
        })
    });

    //Log Out Out User Tests
    describe("logoutUser",()=>{
        // logout success result from service
        const loggedOutUser = {
            message:"Successfully logged out!",
            error:undefined
        }
        // logout failed result from service
        const logOutUserError = {
            error:"Session doesn't exist!",
            message:undefined
        }

        const request={
            params:{
                sessionId:'fake_sessionId',
            }
        } as any
        const response ={
            status:jest.fn((x)=>x),
            send:jest.fn((x)=>x),
            cookie:jest.fn((x)=>x)
        } as any

        //positive test
        test("Should send a status of 200",async ()=>{
            const spy = jest.spyOn(UserService,"signoutUser").mockResolvedValue(loggedOutUser);
            await logoutUser(request,response);
            expect(response.status).toHaveBeenCalledWith(200);
            expect(response.send).toHaveBeenCalledWith({message:"Successfully logged out!"});
            expect(response.cookie).toHaveBeenCalledTimes(3);
            spy.mockRestore();
        })

        //negative test
        test("Should send a status of 400", async ()=>{
            const spy = jest.spyOn(UserService,"signoutUser").mockResolvedValue(logOutUserError);
            await logoutUser(request,response);
            expect(response.status).toHaveBeenCalledWith(400);
            expect(response.send).toHaveBeenCalledWith({
                message:"Log out Failed!",
                error:"Session doesn't exist!",
            });
            spy.mockRestore();
        })
    });

    //Check Log In Status Tests
    describe("loginStatus",()=>{
        const loggedIn_request={
            user:{
                sessionId:"fake_session_id",
                name:"fake_name",
                email:"fake_email@fake.com",
                role:Role.guest
            }
        } as any
        const loggedOut_request={
        } as any

        const response ={
            status:jest.fn((x)=>x),
            send:jest.fn((x)=>x),
        } as any

        //positive test
        test("User is logged in, should send a status of 200",async ()=>{
            await loginStatus(loggedIn_request,response);
            expect(response.status).toHaveBeenCalledWith(200);
            expect(response.send).toHaveBeenCalledWith(loggedIn_request.user);
        })

        //negative test
        test("User haven't logged in, should send a status of 400", async ()=>{
            await loginStatus(loggedOut_request,response);
            expect(response.status).toHaveBeenCalledWith(400);
            expect(response.send).toHaveBeenCalledWith({
                message:"Unauthorized",
                error:"User currently not logged in!"
            });
        })
    });
});