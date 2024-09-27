import React from 'react';
import TaskItem from './TaskItem';
import { Task } from '../types/task';

interface TaskListTasksProps {
  tasks: Task[];
  onStatusChange: (taskId: number) => void;
  onEdit: (task: Task) => void;
  onSelect: (task: Task) => void;
}

const TaskListTasks: React.FC<TaskListTasksProps> = ({ tasks, onStatusChange, onEdit, onSelect }) => {
  return (
    <div>
      {tasks.map(task => (
        <TaskItem
          key={task.id}
          task={task}
          onStatusChange={() => onStatusChange(task.id)}
          onEdit={() => onEdit(task)}
          onSelect={() => onSelect(task)}
        />
      ))}
    </div>
  );
};

export default TaskListTasks;