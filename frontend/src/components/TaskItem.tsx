import React from 'react';
import { Task } from '../types/task';

interface TaskItemProps {
  task: Task;
  onStatusChange: (taskId: number) => void;
  onClick: (task: Task) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onStatusChange, onClick }) => (
  <li onClick={() => onClick(task)}>
    <input
      type="checkbox"
      checked={task.isCompleted}
      onChange={() => onStatusChange(task.id)}
      onClick={(e) => e.stopPropagation()}
    />
    {task.title}
    {task.isFavorite && ' ⭐'}
  </li>
);

export default TaskItem;