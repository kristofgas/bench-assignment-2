import { useState } from 'react';
import { Task, UpdateTaskDetails } from "types/task";


export const useTaskSelection = () => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleTaskEdit = (task: Task) => {
    setEditingTask(task);
  };


const handleShareClick = (setShowShareDropdown: React.Dispatch<React.SetStateAction<boolean>>) => {
  setShowShareDropdown(prev => !prev);
};

const handleUserSelect = (userId: number, setSelectedUsers: React.Dispatch<React.SetStateAction<number[]>>) => {
  setSelectedUsers(prev => 
    prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
  );
};

const handleShareSubmit = (
  shareTaskList: any,
  selectedUsers: number[],
  setShowShareDropdown: React.Dispatch<React.SetStateAction<boolean>>,
  setSelectedUsers: React.Dispatch<React.SetStateAction<number[]>>
) => {
  shareTaskList.mutate(selectedUsers, {
    onError: (error: Error) => {
      alert(`Failed to share task list: ${error.message}`);
    },
    onSuccess: () => {
      setShowShareDropdown(false);
      setSelectedUsers([]);
    },
  });
};

const handleTaskUpdate = (
  updateTaskDetails: any,
  updatedTask: UpdateTaskDetails,
  setEditingTask: React.Dispatch<React.SetStateAction<Task | null>>,
  setSelectedTask: React.Dispatch<React.SetStateAction<Task | null>>
) => {
  updateTaskDetails.mutate(updatedTask, {
    onSuccess: () => {
      setEditingTask(null);
      setSelectedTask(prev => prev && prev.id === updatedTask.id ? { ...prev, ...updatedTask } : prev);
    },
  });
};

const handleTaskSelect = (task: Task, setSelectedTask: React.Dispatch<React.SetStateAction<Task | null>>) => {
  setSelectedTask(prev => (prev && prev.id === task.id ? null : task));
};
  

  return { selectedTask, setSelectedTask, editingTask, handleTaskSelect, handleTaskEdit, setEditingTask, handleTaskUpdate, handleShareSubmit, handleShareClick, handleUserSelect };
};