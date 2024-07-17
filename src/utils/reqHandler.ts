import { Response, NextFunction } from "express";
import { Request } from "../interfaces/auth";

export function requestHandler(callbacks: Function[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      for (let i = 0; i < callbacks.length; i++) {
        await callbacks[i](req, res, next);
      }
    } catch (e) {
      console.log(e);
      next(e);
    }
  };
}
