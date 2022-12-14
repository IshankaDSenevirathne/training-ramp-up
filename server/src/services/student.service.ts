import { Student } from "../models/Student";
import AppDataSource from "../util/db"
import { StudentDataType } from "../interfaces";

const calcAge =(date:Date)=>{
    let today = new Date();
    let age = today.getFullYear() - date.getFullYear();
    return age;
}

export const studentRepository = AppDataSource.getRepository(Student);


export async function addStudent(data:StudentDataType){
    try{
        const dob = new Date(data.dob)
        const age = calcAge(dob);
        const student = new Student()
        student.name=data.name;
        student.gender = data.gender;
        student.address= data.address;
        student.dob = dob;
        student.mobileNo= data.mobileNo;
        student.age  = age;
        const newStudent = await studentRepository.save(student);
        if(!newStudent){
            return {error:"Failed to add student!"};
        }
        return {message:"Student added successfully!",data:newStudent};
    }catch(error){
        return {error:"Failed to create student entity!"}
    }
}


export async function deleteStudent(id:number){
    try{
        const studentToRemove = await studentRepository.findOneBy({id});
        if(!studentToRemove){
            return {error:"Student doesn't exist!"};
        }
        await studentRepository.remove(studentToRemove);
        return {message:"Student removed successfully!"}
    }catch(error){
        return {error:"Failed to delete student!"}
    }
}


export async function getStudents(){
    try{
        const allStudents = await studentRepository.find();
        return {students:allStudents}
    }catch(error){
        return {error:"Couldn't retrieve student data!"}
    }
}


export async function updateStudent(id:number,data:StudentDataType){
   try{

      const studentToUpdate = await studentRepository.findOneBy({id});
      if(!studentToUpdate){
         return {error:"Student not found!"};
      }
      const dob =new Date(data.dob)
      const age = calcAge(dob);
      const updatedStudent = await studentRepository.save({...studentToUpdate,...data,age,dob});
      if(!updatedStudent){
         return {error:"Failed to update student!"}
      }
      return {message:"Successfully updated the student!",data:updatedStudent};
   }catch(error){
      return {error:"Failed to update student!"}
   }
}