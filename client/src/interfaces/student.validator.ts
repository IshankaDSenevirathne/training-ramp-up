import { z } from "zod";

export enum Gender{
        Female="Female",
        Male="Male",
        Other="Other"
    }
//validate user signup data
export const studentDataValidator = z.object({
        id:z.number().positive().optional(),
        name:z.string().min(1),
        gender:z.nativeEnum(Gender),
        address:z.string().min(1),
        mobileNo:z.number().int().positive().gt(99999999).lte(999999999),
        dob:z.date(),
        inEdit:z.boolean().optional(),
        age:z.number().int().nonnegative().lte(120)
});

export type StudentDataType =z.infer<typeof studentDataValidator>;