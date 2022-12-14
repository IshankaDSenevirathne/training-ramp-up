import axios, { AxiosResponse } from "axios";
import { call,put } from "redux-saga/effects";
import { setUser,unsetUser } from '../slices';
import Cookies from 'universal-cookie';
import { LogInDataInputType, SignUpDataInputType } from "../../interfaces";

const cookies = new Cookies();

function refreshAccessToken(){
    const res = axios.post('http://localhost:8000/auth/refresh',{},{withCredentials:true});
    return res;
}

function signoutUser(sessionId:string){
    const res = axios.delete(`http://localhost:8000/auth/logout/${sessionId}`,{
        withCredentials: true,
      });
    return res;
}

export function* handleLogOutUser({payload}:{payload:{sessionId:string}}){
    try{
        let data: AxiosResponse = yield call(signoutUser,payload.sessionId);
        if(data.status === 200){
            yield put(unsetUser());
        }
    }catch(err){
        try{
            let result: AxiosResponse = yield call(refreshAccessToken)
            if(result.status===200){
                yield call(signoutUser,payload.sessionId);
                yield put(unsetUser());
            }else{
                alert("Failed to log out!")
            }
        }catch(err) {
            alert("Failed to log out!");
        }
    }
}


function signinUser(data:any){
    const res = axios.post("http://localhost:8000/auth/login",data,{
        withCredentials: true,
    });
    return res;
}
    
export function* handleLogInUser({payload}:{payload:LogInDataInputType}){
    try{
        const result: AxiosResponse = yield call(signinUser,payload);
        if(result.status === 200){
            const userData = cookies.get('userData');
            yield put(setUser(userData));
        }else{
            alert("Log in failed, invalid Credentials!");
        }
    }catch(err){
        alert("Log in failed, invalid Credentials!");
    }
}


function signupUser(data: any){
    const res = axios.post("http://localhost:8000/auth/signup",data,{
        withCredentials: true,
      });
    return res;
}

export function* handleSignUpUser({payload}:{payload:SignUpDataInputType}){
    try{
        const result: AxiosResponse = yield call(signupUser,payload);
        if(result.status === 200){
            const userData = cookies.get('userData');
            yield put(setUser(userData));
        }else{
            alert("Sign up failed, please provide valid information and try again!");
        }
    }catch(err){
       alert("Sign up failed, please provide valid information and try again!");
    }
}


function signinStatus(){
    const res = axios.get("http://localhost:8000/auth/status",{
        withCredentials:true
    });

    return res;
}

export function* handleGetUserStatus(){
    try{
        let result: AxiosResponse = yield call(signinStatus);
        if(result.status===200){
            const userdata = cookies.get('userData');
            yield put(setUser(userdata));
        }
    }catch(err){
        try{
            let result: AxiosResponse = yield call(refreshAccessToken)
            if(result.status===200){
                const userdata = cookies.get('userData');
                yield put(setUser(userdata));
            }else{
                console.log("User is not authenticated!");
            }
        }catch(err){
            console.log("User is not authenticated!");
        }
    }
}



