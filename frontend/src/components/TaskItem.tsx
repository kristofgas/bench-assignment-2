import React from 'react';
import { Task } from '../types/task';

interface TaskItemProps {
  task: Task;
  onStatusChange: () => void;
  onEdit: () => void;
  onSelect: () => void;
}

const TaskItem: React.FC<TaskItemProps> = React.memo(({ task, onStatusChange, onEdit, onSelect }) => {
  const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    onStatusChange();
  };

  return (
    <div>
      <input
        type="checkbox"
        checked={task.isCompleted}
        onChange={handleStatusChange}
      />
      <span onClick={onSelect}>{task.title}</span>
      <button onClick={(e) => { e.stopPropagation(); onEdit(); }}>Edit Task</button>
    </div>
  );
});

export default TaskItem;