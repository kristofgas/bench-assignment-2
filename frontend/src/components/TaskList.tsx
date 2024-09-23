import React, { useState } from 'react';
import { useTaskListOperations } from '../hooks/useTaskListOperations';
import { TaskFilters } from './FilterTasks';
import { Task } from '../types/task';
import TaskListHeader from './TaskListHeader';
import TaskItem from './TaskItem';
import TaskForm from './TaskListForm';
import TaskDetails from './TaskDetails';
import { UserDto } from '../services/backend/types';

interface TaskListProps {
  listId: number;
  filters: TaskFilters;
}

const TaskList: React.FC<TaskListProps> = ({ listId, filters }) => {
  const [showNewTaskForm, setShowNewTaskForm] = useState(false);
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

  return (
    <div>
      <TaskListHeader taskList={taskList} associatedUsers={associatedUsers} />
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
      {selectedTask && (
        <TaskDetails
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdate={(updatedTask) => updateTaskDetails.mutate(updatedTask)}
        />
      )}
    </div>
  );
};

export default TaskList;