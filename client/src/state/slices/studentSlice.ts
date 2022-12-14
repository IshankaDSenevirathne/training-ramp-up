import { PayloadAction, createSlice ,current} from "@reduxjs/toolkit";
import { StudentDataType } from "../../interfaces";

export const studentSlice = createSlice({
  name: 'student',
  initialState: [] as Array<StudentDataType>,
  reducers: {
    //set actions
    initStudents:(state,{payload}:PayloadAction<Array<StudentDataType>>)=>payload,
    setNewStudent:(state,{payload}:PayloadAction<StudentDataType>)=>[...state,payload],
    setUpdatedStudent:(state,{payload}:PayloadAction<StudentDataType>)=>{
      let currentStudents = current(state).filter((student)=>student.id!==payload.id);
      return [...currentStudents,payload];
    },
    setRemainingStudents:(state,{payload:removedId}:PayloadAction<number>)=>{
      let currentStudents = current(state).filter((student)=>student.id!==removedId);
      return currentStudents;
    },
    //call actions
    getStudents(){},
    createStudent(state,action){},
    deleteStudent(state,action){},
    updateStudent(state,action){},
    }
});

// Action creators are generated for each case reducer function
export const { 
  deleteStudent,
  updateStudent,
  createStudent,
  initStudents,
  getStudents,
  setNewStudent,
  setUpdatedStudent,
  setRemainingStudents
 } = studentSlice.actions;

export const studentReducer =  studentSlice.reducer;