import React from 'react';
import TaskDetails from '../Task/TaskDetails';
import { Task, UpdateTaskDetails } from '../../types/task';

interface TaskListDetailsProps {
  editingTask: Task | null;
  onClose: () => void;
  onUpdate: (updatedTask: UpdateTaskDetails) => void;
}

const TaskListDetails: React.FC<TaskListDetailsProps> = ({ editingTask, onClose, onUpdate }) => {
  return (
    <div>
      {editingTask && (
        <TaskDetails
          task={editingTask}
          onClose={onClose}
          onUpdate={onUpdate}
        />
      )}
    </div>
  );
};

export default TaskListDetails;