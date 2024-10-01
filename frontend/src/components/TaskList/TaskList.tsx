import React, { useState, useEffect } from 'react';
import { useSignalR } from '../../hooks/useSignalR';

import { useTaskListOperations } from '../../hooks/useTaskListOperations';
import { useTaskSelection } from '../../hooks/useTaskSelection';
import { TaskFilters } from '../FilterTasks/FilterTasks';
import TaskListHeader from './TaskListHeader';
import TaskForm from '../Task/TaskForm';
import TaskListShare from './TaskListShare';
import TaskListTasks from './TaskListTasks';
import TaskListDetails from './TaskListDetails';
import SelectedTaskDetails from 'components/Task/SelectedTaskDetails';
import { useQueryClient } from '@tanstack/react-query';
import { HubConnectionState } from '@microsoft/signalr';

interface TaskListProps {
  listId: number;
  filters: TaskFilters;
}

const TaskList: React.FC<TaskListProps> = ({ listId, filters }) => {

  const queryClient = useQueryClient();
  const { joinTaskList, leaveTaskList, setupTaskListListeners, removeTaskListListeners } = useSignalR();
  
  const [showNewTaskForm, setShowNewTaskForm] = useState(false);
  const [showShareDropdown, setShowShareDropdown] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);

  const {
    selectedTask,
    setSelectedTask,
    editingTask,
    setEditingTask,
    handleTaskSelect: handleTaskSelectHook,
    handleTaskEdit,
    handleShareClick,
    handleShareSubmit,
    handleTaskUpdate,
    handleUserSelect,
  } = useTaskSelection();


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
  }, [listId, setSelectedTask]);

  const { connection, connectionState } = useSignalR();

  useEffect(() => {
    joinTaskList(listId);
    setupTaskListListeners(listId, queryClient);

    return () => {
      leaveTaskList(listId);
      removeTaskListListeners();
    };
  }, [listId, joinTaskList, leaveTaskList, setupTaskListListeners, removeTaskListListeners, queryClient]);

  if (isTaskListLoading || isTasksLoading || isAssociatedUsersLoading || isNonAssociatedUsersLoading) return <div>Loading...</div>;
  if (taskListError || tasksError || associatedUsersError || nonAssociatedUsersError) return <div>Error: {(taskListError || tasksError || associatedUsersError || nonAssociatedUsersError)?.toString()}</div>;

  return (
    <div>
      <TaskListHeader
        taskList={taskList}
        associatedUsers={associatedUsers}
        taskSummary={taskSummary}
        onClearCompletedTasks={() => clearCompletedTasks.mutate()}
      />
      <button onClick={() => setShowNewTaskForm(true)}>Add New Task</button>
      <button onClick={() => handleShareClick(setShowShareDropdown)}>Share Task List</button>
      {showShareDropdown && (
        <TaskListShare
          nonAssociatedUsers={nonAssociatedUsers}
          onShare={() => handleShareSubmit(shareTaskList, selectedUsers, setShowShareDropdown, setSelectedUsers)}
          isSharing={isSharing}
          onUserSelect={(userId) => handleUserSelect(userId, setSelectedUsers)}
          selectedUsers={selectedUsers}
        />
      )}
      <TaskListTasks
  tasks={tasks}
  onStatusChange={(taskId) => updateTaskStatus.mutate(taskId)}
  onEdit={handleTaskEdit}
  onSelect={(task) => handleTaskSelectHook(task, setSelectedTask)}
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
        onUpdate={(updatedTask) => handleTaskUpdate(updateTaskDetails, updatedTask, setEditingTask, setSelectedTask)}
      />
      {selectedTask && !editingTask && (
        <SelectedTaskDetails
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
        />
      )}
    </div>
  );
};

export default TaskList;