import { NextFunction, Request, Response } from "express";

export function AdminAuthGuard(req: Request, res: Response, next: NextFunction) {
    // @ts-ignore
    if ( req.user.role !== "ADMIN") {
      return res.status(403).send("Unauthorized!");
    }
    return next();
  }
  