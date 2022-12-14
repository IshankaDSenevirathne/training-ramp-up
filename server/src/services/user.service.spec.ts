import {userRepository, sessionRepository, signupUser, signinUser, signoutUser} from "./user.service";
import * as argon from 'argon2';
import { Role } from '../models/User';

jest.mock('argon2', () => {
    return {
      __esModule: true,    //    <----- this __esModule: true is important
      ...jest.requireActual('argon2')
    };
});

describe("UserService",()=>{

    //Sign In User Service Tests
    describe("signinUser",()=>{
        const logInData={
            email:"fake_email@fake.com",
            password:"fake_password"
        }
        const user ={
            email:"fake_email@fake.com",
            password:"fake_password",
            id:1,
            name:"fake_name",
            role:Role.guest
        }
        const session = {
            valid:true,
            name:"fake_name",
            email:"fake_email",
            id:"fake_id"
        }
        const userData = {
            sessionId:session.id,
            email:session.email,
            name:session.name,
            role:Role.guest
        }
        //positive test
        test("Log in user success, should return user with tokens",async ()=>{
                userRepository.findOneBy = jest.fn().mockReturnValue(user);
                sessionRepository.save = jest.fn().mockReturnValue(session);
                const spyHash = jest.spyOn(argon,'verify').mockResolvedValue(true);
                const res = await signinUser(logInData);
                expect(res.message).toEqual("Login Successfull!");
                expect(res.userData).toEqual(userData);
                expect(res.refreshToken).toBeDefined();
                expect(res.accessToken).toBeDefined();
                spyHash.mockRestore();
            }   
        );
        //negative test
        test("Log in failed, should return an error message",async ()=>{
                userRepository.findOneBy = jest.fn().mockImplementationOnce(()=>undefined);
                const res = await signinUser(logInData);
                expect(res).toEqual({error:"User not found!"});
            }
        );
    });

    //Sign Up User Service Tests
    describe("signupUser",()=>{

        const signUpData={
            name:"fake_name",
            email:"fake_email@fake.com",
            password:"fake_password"
        }
        const user ={
            email:"fake_email@fake.com",
            password:"fake_hash_password",
            id:1,
            name:"fake_name",
            role:Role.guest
        }
        const session = {
            valid:true,
            name:"fake_name",
            email:"fake_email",
            id:"fake_id"
        }
        const userData = {
            sessionId:session.id,
            email:session.email,
            name:session.name,
            role:Role.guest
        }
        //positive test
        test("Sign up user success, should return user with tokens",async ()=>{
                userRepository.save = jest.fn().mockReturnValue(user);
                sessionRepository.save = jest.fn().mockReturnValue(session);
                const spyHash = jest.spyOn(argon,'hash').mockResolvedValue("fake_hash_password");
                const res = await signupUser(signUpData);
                expect(res.message).toEqual("Sign Up Successfull!");
                expect(res.userData).toEqual(userData);
                expect(res.refreshToken).toBeDefined();
                expect(res.accessToken).toBeDefined();
                spyHash.mockRestore();
            }   
        );
        //negative test
        test("Sign up failed, should return an error message",async ()=>{
                userRepository.save = jest.fn().mockImplementationOnce(()=>undefined);
                const res = await signupUser(signUpData);
                expect(res).toEqual({error:"Failed to create user entity!"});
            }
        );
    });

    //Sign Out User Service Tests
    describe("signoutUser",()=>{

        const sessionId = "fake_id";

        const session = {
            valid:true,
            name:"fake_name",
            email:"fake_email",
            id:"fake_id"
        }
        //positive test
        test("Sign out user success, should return success message after deleting the session",async ()=>{
                sessionRepository.findOneBy = jest.fn().mockReturnValue(session);
                sessionRepository.remove = jest.fn().mockReturnValue(session);
                const res = await signoutUser(sessionId);
                expect(res.message).toEqual("Successfully logged out!");
            }   
        );
        //negative test
        test("Sign out failed, should return an error message",async ()=>{
                sessionRepository.findOneBy = jest.fn().mockImplementationOnce(()=>{throw new Error('Not Found!')});
                const res = await signoutUser(sessionId);
                expect(res.error).toEqual("Failed to log out!");
            }
        );
    });
});