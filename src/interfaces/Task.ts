export interface ITask {
  id: string;
  detail: string;
  status: TaskStatus;
}

export enum TaskStatus {
  pending,
  done,
}
