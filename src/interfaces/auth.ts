import { Request as ExpressRequest } from "express";
import { IUser } from "./User";

export interface Request extends ExpressRequest {
  user?: IUser;
}
