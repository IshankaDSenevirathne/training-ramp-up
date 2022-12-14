import { call,put } from "redux-saga/effects";
import axios, { AxiosResponse } from "axios";
import * as sliceActions from "../slices";
import { StudentDataType } from "../../interfaces";
import { io } from 'socket.io-client';

const socket = io('http://localhost:8000');

function refreshAccessToken(){
    const res = axios.post('http://localhost:8000/auth/refresh',{},{withCredentials:true});
    return res;
}


function getStudents(){
    const res = axios.get("http://localhost:8000/user/getStudents",{
        withCredentials: true,
      });
    return res;
}
export function* handleGetStudents(){
    try{
        let  result : AxiosResponse = yield call(getStudents);
        if(result.status === 200){
            yield put(sliceActions.initStudents(result.data.students));
        }
    }catch(err){
        let reAuthorize: AxiosResponse = yield call(refreshAccessToken); 
        if(reAuthorize.status === 200){
            try{

                let result: AxiosResponse = yield call(getStudents);
                if(result.status === 200){
                    yield put(sliceActions.initStudents(result.data.students));
                }else{
                    console.log("Unable to fetch student data!");
                }
            }catch(err){
                console.log("Unauthorized!");
            }
        }else {
            console.log("Unauthorized!");
        }
    }
}

function addStudent(data:StudentDataType){
    const res = axios.post("http://localhost:8000/user/addStudent",data,{
        withCredentials: true,
      });
    return res;
}  

export function* handleAddStudent({payload}:{payload:StudentDataType}){
    try{
        let result: AxiosResponse  = yield call(addStudent,payload);
        if(result.status === 200){
            yield put(sliceActions.setNewStudent(result.data.student));
            socket.emit('update occured');
            alert("Student has been successfully added")
        }
    }catch(err){
        let reAuthorize: AxiosResponse = yield call(refreshAccessToken); 
        if(reAuthorize.status === 200){
            try{
                let result: AxiosResponse  = yield call(addStudent,payload);
                if(result.status === 200){
                    yield put(sliceActions.setNewStudent(result.data.student));
                    socket.emit('update occured');
                    alert("Student has been successfully added")
                }
            }catch(err){
                alert("Failed to add student, please provide valid details");
            }
        }else{
            alert("Failed to add student, please provide valid details");
        }
    }
}


function updateStudent(data:StudentDataType){
    const res = axios.put(`http://localhost:8000/user/updateStudent`,data,{
        withCredentials: true,
      });
    return res;
}

export function* handleUpdateStudent({payload}:{payload:StudentDataType}){
    try{
        let result: AxiosResponse  = yield call(updateStudent,payload);
        if(result.status === 200){
            delete result.data.student.inEdit;
            yield put(sliceActions.setUpdatedStudent(result.data.student));
            socket.emit('update occured');
            alert("Student has been successfully updated")
        }
    }catch(err){
        let reAuthorize: AxiosResponse = yield call(refreshAccessToken); 
        if(reAuthorize.status === 200){
            try{
                let result: AxiosResponse = yield call(updateStudent,payload);
                if(result.status===200){
                    delete result.data.student.inEdit;
                    yield put(sliceActions.setUpdatedStudent(result.data.student));
                    socket.emit('update occured');
                    alert("Student has been successfully updated")
                }
            }catch(err){
                alert("Failed to update student, please provide valid details");
            }
        }else{
            alert("Failed to update student, please provide valid details");
        }
    }
}


export function deleteStudent(id:number){
    const res = axios.delete(`http://localhost:8000/user/deleteStudent/${id}`,{
        withCredentials: true,
      });
    return res;
}

export function* handleDeleteStudent({payload}:{payload:{id:number}}){
    try{
        let result: AxiosResponse  = yield call(deleteStudent,payload.id);
        if(result.status === 200){
            yield put(sliceActions.setRemainingStudents(payload.id));
            socket.emit('update occured');
            alert("Student has been successfully deleted")
        }
    }catch(err){
        let reAuthorize: AxiosResponse = yield call(refreshAccessToken); 
        if(reAuthorize.status === 200){
            try{
                let result: AxiosResponse = yield call(deleteStudent,payload.id);
                if(result.status === 200){
                    yield put(sliceActions.setRemainingStudents(result.data.student.id));
                    socket.emit('update occured');
                    alert("Student has been successfully deleted");
                }
            }catch(err){
                alert("Failed to remove student, please try again");
            }
        }else{
            alert("Failed to remove student, please try again");
        }
    }
}

