import { Request, Response, NextFunction } from "express";
import {AnyZodObject } from "zod";

export const ValidateInputsGuard = (schema:AnyZodObject) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body);
      return next();
    } catch (error) {
      return res.status(400).send(error);
    }
  };
  