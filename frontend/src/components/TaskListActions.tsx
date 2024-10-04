import React, { useState } from 'react';
import TaskListShare from './TaskListShare';
import TaskForm from './TaskForm';
import {  NewTask } from '../types/task';
import { UserDto } from 'services/backend/types';

interface TaskListActionsProps {
  nonAssociatedUsers: UserDto[];
  isSharing: boolean;
  createTask: any;
  shareTaskList: any;
  setShowNewTaskForm: (show: boolean) => void;
  showNewTaskForm: boolean;
  showShareDropdown: boolean;
  setShowShareDropdown: (show: boolean) => void;
}

const TaskListActions: React.FC<TaskListActionsProps> = ({
  nonAssociatedUsers,
  isSharing,
  createTask,
  shareTaskList,
  setShowNewTaskForm,
  showNewTaskForm,
  showShareDropdown,
  setShowShareDropdown,
}) => {
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);

  const handleShareClick = () => {
    setShowShareDropdown(!showShareDropdown);
  };

  const handleShareSubmit = () => {
    shareTaskList.mutate(selectedUsers, {
      onError: (error: any) => {
        alert(`Failed to share task list: ${error.message}`);
      },
      onSuccess: () => {
        setShowShareDropdown(false);
        setSelectedUsers([]);
      },
    });
  };

  return (
    <div>
      <button onClick={() => setShowNewTaskForm(true)}>Add New Task</button>
      <button onClick={handleShareClick}>Share Task List</button>
      {showShareDropdown && (
        <TaskListShare
          nonAssociatedUsers={nonAssociatedUsers}
          onShare={handleShareSubmit}
          isSharing={isSharing}
        />
      )}
      {showNewTaskForm && (
        <TaskForm
          onSubmit={(newTask: NewTask) => {
            createTask.mutate(newTask);
            setShowNewTaskForm(false);
          }}
          onCancel={() => setShowNewTaskForm(false)}
        />
      )}
    </div>
  );
};

export default TaskListActions;