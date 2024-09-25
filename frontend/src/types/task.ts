import { Priority, Color } from '../utils/taskUtils';

export interface Task {
  id: number;
  title: string;
  description: string;
  rank: number;
  color: Color;
  isCompleted: boolean;
  isFavorite: boolean;
  taskListId: number;
  createdBy?: string | null;
  lastModified?: string | null;
  lastModifiedBy?: string | null;
}

export interface NewTask {
  title: string;
  description: string;
  rank: Priority;
  color: Color;
}

export type UpdateTaskDetails = Partial<Task>;

export interface TaskList {
  id: number;
  name: string;
  description: string;
  createdBy?: string | null;
}

export interface NewTaskList {
  name: string;
  description: string;
}