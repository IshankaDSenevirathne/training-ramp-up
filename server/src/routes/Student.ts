import express,{Router} from "express";
import * as studentController from "../controllers/student.controller";
// import passport from 'passport';

//guards
import { UserAuthGuard, AdminAuthGuard, ValidateInputsGuard } from "../middleware";
import { studentDataValidator } from "../interfaces";

export const studentRouter:Router=express.Router();

//Get all student data
studentRouter.get("/",UserAuthGuard,studentController.getAll)

//Add Student
studentRouter.post("/",UserAuthGuard,AdminAuthGuard,ValidateInputsGuard(studentDataValidator),studentController.addOne)

//Update/Edit Student
studentRouter.put("/:id",UserAuthGuard,AdminAuthGuard,ValidateInputsGuard(studentDataValidator),studentController.updateOne)

//Delete Student
studentRouter.delete("/:id",UserAuthGuard,AdminAuthGuard,studentController.deleteOne)
