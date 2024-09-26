import React, { useState } from 'react';
import { useTaskListOperations } from '../hooks/useTaskListOperations';
import { TaskFilters } from './FilterTasks';
import { Task, UpdateTaskDetails } from '../types/task';
import TaskListHeader from './TaskListHeader';
import TaskItem from './TaskItem';
import TaskForm from './TaskListForm';
import TaskDetails from './TaskDetails';
import { UserDto } from '../services/backend/types';
import { Priority, getRankValue } from 'utils/taskUtils';

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
    isTaskSummaryLoading,
    taskSummaryError,
    clearCompletedTasks,
  } = useTaskListOperations(listId, filters);

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
        //setSelectedTask(null);
      },
    });
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
        <div>
          <select multiple value={selectedUsers.map(String)} onChange={(e) => setSelectedUsers(Array.from(e.target.selectedOptions, option => Number(option.value)))}>
            {nonAssociatedUsers?.map((user: UserDto) => (
              <option key={user.userId} value={user.userId}>{user.username}</option>
            ))}
          </select>
          <button onClick={handleShareSubmit} disabled={isSharing}>
            {isSharing ? 'Sharing...' : 'Share'}
          </button>
        </div>
      )}
      {tasks.map(task => (
        <TaskItem
          key={task.id}
          task={task}
          onStatusChange={() => updateTaskStatus.mutate(task.id)}
          onEdit={() => setEditingTask(task)}
          onSelect={() => setSelectedTask(task)}
        />
      ))}
      {showNewTaskForm && (
        <TaskForm
          onSubmit={(newTask) => {
            createTask.mutate(newTask);
            setShowNewTaskForm(false);
          }}
          onCancel={() => setShowNewTaskForm(false)}
        />
      )}
      {editingTask && (
        <TaskDetails
          task={editingTask}
          onClose={() => setEditingTask(null)}
          onUpdate={handleTaskUpdate}
        />
      )}
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