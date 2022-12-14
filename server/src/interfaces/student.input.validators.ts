import { z } from "zod";

enum Gender{
        Female="Female",
        Male="Male",
        Other="Other"
    }
//validate user signup data
export const studentDataValidator = z.object({
        name:z.string().min(1),
        gender:z.nativeEnum(Gender),
        address:z.string().min(1),
        mobileNo:z.number().int().positive().gt(99999999).lte(999999999),
        dob:z.union([z.date(),z.string()]),
        age:z.number().int().nonnegative().lte(120)
});

export type StudentDataType =z.infer<typeof studentDataValidator>;