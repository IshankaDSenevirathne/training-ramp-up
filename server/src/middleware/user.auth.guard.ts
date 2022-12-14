import { NextFunction, Request, Response } from "express";

export function UserAuthGuard(req: Request, res: Response, next: NextFunction) {
    // @ts-ignore
    if (!req.user) {
      return res.status(403).send("Unauthorized!");
    }
    return next();
  }
  