import {Response,Request} from "express";
import {addStudent,updateStudent,deleteStudent,getStudents} from "../services";

export async function getAll(req: Request,res: Response){
    const result:any= await getStudents();
    if(result.error){
        res.status(400);
        res.json({message:"Request Failed",error:result.error});
        return;
    }
    res.status(200);
    res.json({message:"Successfully retrieved data!",students:result.students});
    return;
}

export async function addOne( req: Request , res: Response ){
    const result = await addStudent(req.body);
    if(result.error){
        res.status(400);
        res.json({message:"Request Failed",error:result.error});
        return;
    }
   res.status(200);
   res.json({message:"Student has been added successfully!",student:result.data});
   return;
}

export async function updateOne(req: Request , res: Response){
    const id:number = parseInt(req.params.id);
    const data = req.body;
    const result = await updateStudent(id,data);
    if(result.error){
        res.status(400);
        res.json({message:"Request Failed",error:result.error})
        return;
    }
    res.status(200);
    res.json({message:"Successfully updated the student",updatedStudent:result.data});
    return;
}

export async function deleteOne(req: Request, res: Response){
    const id:number = parseInt(req.params.id);
    const result = await deleteStudent(id);
    if(result.error){
        res.status(400);
        res.json({message:"Request Failed",error:result.error})
        return;
    }
    res.status(200);
    res.json({message:"Successfully deleted the student",id});
    return;
}