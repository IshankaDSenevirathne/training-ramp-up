import { getAll, addOne, updateOne, deleteOne } from "./student.controller";
import * as StudentService from "../services/student.service"
import { Gender } from '../models/Student';

describe("StudentController",()=>{
    //Get All Students Tests
    describe("getAll",()=>{
        const getStudentsSuccess = {
           students:[
                {
                    id:1,
                    name:"Ishanka",
                    address:"Kandy",
                    gender:Gender.Male,
                    mobileNo:714942987,
                    age:27,
                    dob:new Date("1995-03-16 00:00:00")
                },
                {
                    id:2,
                    name:"Sara",
                    address:"Colombo",
                    gender:Gender.Female,
                    mobileNo:714542947,
                    age:27,
                    dob:new Date("1995-04-17 00:00:00")
                },
            ]
        }

        const getStudentsError={
            error:"Couldn't retrieve student data!"
        }
       
        const request={} as any
        const response ={
            status:jest.fn((x)=>x),
            json:jest.fn((x)=>x)
        } as any

        //positive test
        test("Should send a status of 200",async ()=>{
            const spy = jest.spyOn(StudentService,"getStudents").mockResolvedValue(getStudentsSuccess);
            await getAll(request,response);
            expect(response.status).toHaveBeenCalledWith(200);
            expect(response.json).toHaveBeenCalledWith({message:"Successfully retrieved data!",students:getStudentsSuccess.students});
            spy.mockRestore();
        })

        //negative test
        test("Should send a status of 400", async ()=>{
            const spy = jest.spyOn(StudentService,"getStudents").mockResolvedValue(getStudentsError);
            await getAll(request,response);
            expect(response.status).toHaveBeenCalledWith(400);
            expect(response.json).toHaveBeenCalledWith({
                message:"Request Failed",
                error:"Couldn't retrieve student data!",
            });
            spy.mockRestore();
        })
    });

    //Add a Student Tests
    describe("addOne",()=>{
        // getting students success result from service
        const addStudentSuccess = {
           message:"Student added successfully!",
           data:
                {
                    id:1,
                    name:"Ishanka",
                    address:"Kandy",
                    gender:Gender.Male,
                    mobileNo:714942987,
                    age:27,
                    dob:new Date("1995-03-16 00:00:00")
                },
            
        }

        const addStudentError={
            error:"Failed to add student!"
        }
       
        const request={
            body:{
                    name:"Ishanka",
                    address:"Kandy",
                    gender:Gender.Male,
                    mobileNo:714942987,
                    age:0,
                    dob:"1995-03-16 00:00:00"
            }
        } as any
        const response ={
            status:jest.fn((x)=>x),
            json:jest.fn((x)=>x)
        } as any

        //positive test
        test("Student creation success, should send a status of 200",async ()=>{
            const spy = jest.spyOn(StudentService,"addStudent").mockResolvedValue(addStudentSuccess);
            await addOne(request,response);
            expect(response.status).toHaveBeenCalledWith(200);
            expect(response.json).toHaveBeenCalledWith({message:"Student has been added successfully!",student:addStudentSuccess.data});
            spy.mockRestore();
        })

        //negative test
        test("Student creation failed, should send a status of 400", async ()=>{
            const spy = jest.spyOn(StudentService,"addStudent").mockResolvedValue(addStudentError);
            await addOne(request,response);
            expect(response.status).toHaveBeenCalledWith(400);
            expect(response.json).toHaveBeenCalledWith({
                message:"Request Failed",
                error:addStudentError.error,
            });
            spy.mockRestore();
        })
    });

    //Update a Student Tests
    describe("updateOne",()=>{
        const updateStudentSuccess = {
           message:"Successfully updated the student!",
           data:
                {
                    id:1,
                    name:"Ishanka",
                    address:"Kandy",
                    gender:Gender.Male,
                    mobileNo:714942987,
                    age:27,
                    dob:new Date("1995-03-16 00:00:00")
                },
            
        } as any

        const updateStudentError={
            error:"Student not found!"
        }
       
        const request={
            params:{
                id:"1"
            },
            body:{
                name:"Ishanka",
                address:"Kandy",
                gender:Gender.Male,
                mobileNo:714942987,
                age:27,
                dob:"1995-03-16 00:00:00"
            }
        } as any
        const response ={
            status:jest.fn((x)=>x),
            json:jest.fn((x)=>x)
        } as any

        //positive test
        test("Student update success, should send a status of 200",async ()=>{
            const spy = jest.spyOn(StudentService,"updateStudent").mockResolvedValue(updateStudentSuccess);
            await updateOne(request,response);
            expect(response.status).toHaveBeenCalledWith(200);
            expect(response.json).toHaveBeenCalledWith({message:"Successfully updated the student",updatedStudent:updateStudentSuccess.data});
            spy.mockRestore();
        })

        //negative test
        test("Student update failed, should send a status of 400", async ()=>{
            const spy = jest.spyOn(StudentService,"updateStudent").mockResolvedValue(updateStudentError);
            await updateOne(request,response);
            expect(response.status).toHaveBeenCalledWith(400);
            expect(response.json).toHaveBeenCalledWith({
                message:"Request Failed",
                error:updateStudentError.error,
            });
            spy.mockRestore();
        })
    });
    
    //Delete a student Tests
    describe("deleteOne",()=>{
        const deleteStudentSuccess = {
           message:"Student removed successfully!",
        }

        const deleteStudentError={
            error:"Student doesn't exist!"
        }
       
        const request={
            params:{
                id:"1"
            },
        } as any
        const response ={
            status:jest.fn((x)=>x),
            json:jest.fn((x)=>x)
        } as any

        //positive test
        test("Student deletion success, should send a status of 200",async ()=>{
            const spy = jest.spyOn(StudentService,"deleteStudent").mockResolvedValue(deleteStudentSuccess);
            await deleteOne(request,response);
            expect(response.status).toHaveBeenCalledWith(200);
            expect(response.json).toHaveBeenCalledWith({message:"Successfully deleted the student",id:1});
            spy.mockRestore();
        })

        //negative test
        test("Student deletion failed, should send a status of 400", async ()=>{
            const spy = jest.spyOn(StudentService,"deleteStudent").mockResolvedValue(deleteStudentError);
            await deleteOne(request,response);
            expect(response.status).toHaveBeenCalledWith(400);
            expect(response.json).toHaveBeenCalledWith({
                message:"Request Failed",
                error:deleteStudentError.error,
            });
            spy.mockRestore();
        })
    });
});