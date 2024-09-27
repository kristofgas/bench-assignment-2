import React, { useState, useEffect } from 'react';
import { useTaskListOperations } from '../hooks/useTaskListOperations';
import { TaskFilters } from './FilterTasks';
import { Task, UpdateTaskDetails } from '../types/task';
import TaskListHeader from './TaskListHeader';
import TaskForm from './TaskForm';
import TaskListShare from './TaskListShare';
import TaskListTasks from './TaskListTasks';
import TaskListDetails from './TaskListDetails';

interface TaskListProps {
  listId: number;
  filters: TaskFilters;
}

const TaskList: React.FC<TaskListProps> = ({ listId, filters }) => {
  const [showNewTaskForm, setShowNewTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showShareDropdown, setShowShareDropdown] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);

  const {
    taskList,
    isTaskListLoading,
    taskListError,
    tasks,
    isTasksLoading,
    tasksError,
    createTask,
    updateTaskStatus,
    updateTaskDetails,
    shareTaskList,
    associatedUsers,
    nonAssociatedUsers,
    isSharing,
    isAssociatedUsersLoading,
    associatedUsersError,
    isNonAssociatedUsersLoading,
    nonAssociatedUsersError,
    taskSummary,
    clearCompletedTasks,
  } = useTaskListOperations(listId, filters);

  useEffect(() => {
    setSelectedTask(null);
  }, [listId]);

  if (isTaskListLoading || isTasksLoading || isAssociatedUsersLoading || isNonAssociatedUsersLoading) return <div>Loading...</div>;
  if (taskListError || tasksError || associatedUsersError || nonAssociatedUsersError) return <div>Error: {(taskListError || tasksError || associatedUsersError || nonAssociatedUsersError)?.toString()}</div>;

  const handleShareClick = () => {
    setShowShareDropdown(!showShareDropdown);
  };

  const handleUserSelect = (userId: number) => {
    setSelectedUsers(prev => 
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  const handleShareSubmit = () => {
    shareTaskList.mutate(selectedUsers, {
      onError: (error) => {
        alert(`Failed to share task list: ${error.message}`);
      },
      onSuccess: () => {
        setShowShareDropdown(false);
        setSelectedUsers([]);
      },
    });
  };

  const handleTaskUpdate = (updatedTask: UpdateTaskDetails) => {
    updateTaskDetails.mutate(updatedTask, {
      onSuccess: () => {
        setEditingTask(null);
        // Update the task in the local state
        setSelectedTask(prev => prev && prev.id === updatedTask.id ? { ...prev, ...updatedTask } : prev);
      },
    });
  };

  const handleTaskSelect = (task: Task) => {
    setSelectedTask(prev => (prev && prev.id === task.id ? null : task));
  };

  return (
    <div>
      <TaskListHeader
        taskList={taskList}
        associatedUsers={associatedUsers}
        taskSummary={taskSummary}
        onClearCompletedTasks={() => clearCompletedTasks.mutate()}
      />
      <button onClick={() => setShowNewTaskForm(true)}>Add New Task</button>
      <button onClick={handleShareClick}>Share Task List</button>
      {showShareDropdown && (
        <TaskListShare
          nonAssociatedUsers={nonAssociatedUsers}
          onShare={handleShareSubmit}
          isSharing={isSharing}
        />
      )}
      <TaskListTasks
        tasks={tasks}
        onStatusChange={(taskId) => updateTaskStatus.mutate(taskId)}
        onEdit={(task) => setEditingTask(task)}
        onSelect={(task) => handleTaskSelect(task)}
      />
      {showNewTaskForm && (
        <TaskForm
          onSubmit={(newTask) => {
            createTask.mutate(newTask);
            setShowNewTaskForm(false);
          }}
          onCancel={() => setShowNewTaskForm(false)}
        />
      )}
      <TaskListDetails
        editingTask={editingTask}
        onClose={() => setEditingTask(null)}
        onUpdate={handleTaskUpdate}
      />
      {selectedTask && !editingTask && (
        <div>
          <h3>Task Details</h3>
          <p>Title: {selectedTask.title}</p>
          <p>Description: {selectedTask.description}</p>
          <p>Priority: {selectedTask.rank}</p>
          <p>Color: {selectedTask.color}</p>
          <p>Favorite: {selectedTask.isFavorite ? 'Yes' : 'No'}</p>
          <p>Created by: {selectedTask.createdBy}</p>
          <p>Last modified: {selectedTask.lastModified}</p>
          <p>Last modified by: {selectedTask.lastModifiedBy}</p>
          <button onClick={() => setSelectedTask(null)}>Close</button>
        </div>
      )}
    </div>
  );
};

export default TaskList;