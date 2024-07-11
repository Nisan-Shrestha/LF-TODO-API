import { UUID } from "node:crypto";

export interface IUser {
  id: UUID;
  name: string;
  email: string;
  password: string;
  permissions: string[];
}
