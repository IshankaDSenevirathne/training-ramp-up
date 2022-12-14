import { takeEvery } from "redux-saga/effects";
import { 
    logInUser, 
    logOutUser, 
    checkUser, 
    signUpUser, 
    createStudent, 
    updateStudent, 
    deleteStudent, 
    getStudents 
} from "../slices";

import {
    handleGetUserStatus, 
    handleLogInUser, 
    handleLogOutUser, 
    handleSignUpUser, 
} from './userSaga'

import {
    handleUpdateStudent, 
    handleGetStudents,
    handleAddStudent,
    handleDeleteStudent, 
} from './studentSaga'

export default function* rootSaga(){
    
    yield takeEvery(checkUser,handleGetUserStatus);
    yield takeEvery(logOutUser,handleLogOutUser);
    yield takeEvery(logInUser,handleLogInUser);
    yield takeEvery(signUpUser,handleSignUpUser);

    yield takeEvery(getStudents,handleGetStudents);
    yield takeEvery(createStudent,handleAddStudent);
    yield takeEvery(updateStudent,handleUpdateStudent);
    yield takeEvery(deleteStudent,handleDeleteStudent);
}