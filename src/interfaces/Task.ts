import { UUID } from "crypto";

export interface ITask {
  id: UUID;
  userID: UUID;
  detail: string;
  status: TaskStatus;
  createdAt: Date;
  completedAt: Date | null;
}

export enum TaskStatus {
  pending,
  done,
}
