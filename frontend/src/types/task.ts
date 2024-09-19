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
}

export interface NewTask {
  title: string;
  description: string;
  rank: Priority;
  color: Color;
}

export interface UpdateTaskDetails {
  id: number;
  title?: string;
  description?: string;
  rank?: number;
  color?: Color;
  isFavorite?: boolean;
}

export interface TaskList {
  id: number;
  name: string;
  description: string;
}

export interface NewTaskList {
  name: string;
  description: string;
}