import { studentRepository, getStudents, addStudent, updateStudent, deleteStudent } from "./student.service";
import { Gender } from '../models/Student';



describe("StudentService",()=>{

    //Get All Students Service Tests
    describe("getStudents",()=>{
        const allStudents= [  
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
            }
        ] as any
        //positive test
        test("Getting students success, should return all students",async ()=>{
                studentRepository.find = jest.fn().mockReturnValue(allStudents);
                const res = await getStudents();
                expect(res).toEqual({students:allStudents});
            }
        );
        //negative test
        test("Getting students failed, should return an error message",async ()=>{
                studentRepository.find = jest.fn().mockImplementationOnce(()=>{throw new Error('Not Found!')});
                const res = await getStudents()
                expect(res).toEqual({error:"Couldn't retrieve student data!"});
            }
        );
    });

    //Add Student Service Tests
    describe("addStudent",()=>{
        const student ={
            name:"Sara",
            address:"Colombo",
            gender:Gender.Female,
            mobileNo:714542947,
            age:0,
            dob:"1995-04-17 00:00:00"
        }
        //positive test
        test("Add student success, should return the new student",async ()=>{
                studentRepository.save = jest.fn().mockReturnValue({...student,id:2,age:27});
                const res = await addStudent(student);
                expect(res).toEqual({message:"Student added successfully!",data:{...student,id:2,age:27}});
            }
            );
            //negative test
            test("Add student failed, should return an error message",async ()=>{
                studentRepository.save = jest.fn().mockImplementationOnce(()=>{throw new Error('Failed to create student entity!')});
                const res = await addStudent(student)
                expect(res).toEqual({error:'Failed to create student entity!'});
            }
        );
    });

    //Update Student Service Tests
    describe("updateStudent",()=>{
        const student ={
            id:2,
            name:"Sarah",
            address:"Colombo",
            gender:Gender.Female,
            mobileNo:714542947,
            age:0,
            dob:"1994-04-17 00:00:00"
        }
        //positive test
        test("Update student success, should return the updated student",async ()=>{
                studentRepository.findOneBy = jest.fn().mockReturnValue({...student,dob:new Date("1994-05-17 00:00:00"),name:"sara",age:27});
                studentRepository.save = jest.fn().mockReturnValue({...student,dob:new Date("1994-04-17 00:00:00"),name:"sarah",age:28});
                const res = await updateStudent(2,student);
                expect(res).toEqual({message:"Successfully updated the student!",data:{...student,dob:new Date("1994-04-17 00:00:00"),name:"sarah",age:28}});
            }
            );
            //negative test
            test("Update student failed, should return an error message",async ()=>{
                studentRepository.findOneBy = jest.fn().mockImplementationOnce(()=>{throw new Error('Not Found!')});
                studentRepository.save = jest.fn().mockImplementationOnce(()=>{throw new Error('Failed to create student entity!')});
                const res = await updateStudent(2,student)
                expect(res).toEqual({error:'Failed to update student!'});
            }
        );
    });

    //Delete Student Service Tests
    describe("deleteStudent",()=>{
        const id =2;
        const student ={
            id:2,
            name:"Sarah",
            address:"Colombo",
            gender:Gender.Female,
            mobileNo:714542947,
            age:28,
            dob:new Date("1994-04-17 00:00:00")
        }
        //positive test
        test("Delete success, should return success message",async ()=>{
                studentRepository.findOneBy = jest.fn().mockReturnValue(student);
                studentRepository.remove = jest.fn().mockReturnValue(student);
                const res = await deleteStudent(2);
                expect(res).toEqual({message:"Student removed successfully!"});
            }
        );
        //negative test
        test("Delete failed, should return an error message",async ()=>{
            studentRepository.findOneBy = jest.fn().mockImplementationOnce(()=>undefined);
            studentRepository.remove = jest.fn().mockReturnValue(student);
            const res = await deleteStudent(2)
            expect(res).toEqual({error:"Student doesn't exist!"});
            }
        );
    });
});