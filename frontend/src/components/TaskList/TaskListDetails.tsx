import React from 'react';
import TaskDetails from '../Task/TaskDetails';
import { Task, UpdateTaskDetails } from '../../types/task';

interface TaskListDetailsProps {
  editingTask: Task | null;
  onClose: () => void;
  onUpdate: (updatedTask: UpdateTaskDetails) => void;
}

const TaskListDetails: React.FC<TaskListDetailsProps> = ({ editingTask, onClose, onUpdate }) => {
  if (!editingTask) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
      <div className="relative p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
        <TaskDetails
          task={editingTask}
          onClose={onClose}
          onUpdate={onUpdate}
        />
      </div>
    </div>
  );
};
export default TaskListDetails;