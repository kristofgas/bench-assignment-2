import React from 'react';
import { Task } from '../types/task';

interface TaskItemProps {
  task: Task;
  onStatusChange: () => void;
  onSelect: () => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onStatusChange, onSelect }) => {
  return (
    <div onClick={onSelect}>
      <input
        type="checkbox"
        checked={task.isCompleted}
        onChange={onStatusChange}
      />
      <span>{task.title}</span>
    </div>
  );
};

export default TaskItem;