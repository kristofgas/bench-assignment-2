import React, { useState, useEffect, Suspense } from 'react';
import { useTaskListOperations } from '../../hooks/useTaskListOperations';
import { useTaskSelection } from '../../hooks/useTaskSelection';
import { TaskFilters } from '../FilterTasks/FilterTasks';
import TaskListHeader from './TaskListHeader';
import TaskForm from '../Task/TaskForm';
import TaskListTasks from './TaskListTasks';
import TaskListDetails from './TaskListDetails';
import SelectedTaskDetails from 'components/Task/SelectedTaskDetails';
import { TaskListContentSkeleton } from 'components/Skeletons/TaskListContentSkeleton';

interface TaskListProps {
  listId: number;
  filters: TaskFilters;
}

const TaskList: React.FC<TaskListProps> = ({ listId, filters }) => {
  const [showNewTaskForm, setShowNewTaskForm] = useState(false);
  const {
    selectedTask,
    setSelectedTask,
    editingTask,
    setEditingTask,
    handleTaskSelect: handleTaskSelectHook,
    handleTaskEdit,
    handleTaskUpdate,
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

  if (taskListError || tasksError || associatedUsersError || nonAssociatedUsersError) {
    return <div className="text-red-500">Error: {(taskListError || tasksError || associatedUsersError || nonAssociatedUsersError)?.toString()}</div>;
  }

  return (
    <div className="animate-fadeIn">
      <Suspense fallback={<TaskListContentSkeleton />}>
        {isTaskListLoading || isTasksLoading || isAssociatedUsersLoading || isNonAssociatedUsersLoading ? (
          <TaskListContentSkeleton />
        ) : (
          <>
            <TaskListHeader
              taskList={taskList}
              associatedUsers={associatedUsers}
              nonAssociatedUsers={nonAssociatedUsers}
              taskSummary={taskSummary}
              onClearCompletedTasks={() => clearCompletedTasks.mutate()}
              onShare={(selectedUsers) => shareTaskList.mutate(selectedUsers)}
              isSharing={isSharing}
              onAddNewTask={() => setShowNewTaskForm(true)}
            />
            <TaskListTasks
              activeTasks={tasks.filter(task => !task.isCompleted)}
              completedTasks={tasks.filter(task => task.isCompleted)}
              onStatusChange={(taskId) => updateTaskStatus.mutate(taskId)}
              onEdit={handleTaskEdit}
              onSelect={(task) => handleTaskSelectHook(task, setSelectedTask)}
            />
          </>
        )}
      </Suspense>
      {showNewTaskForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="relative p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <button
              onClick={() => setShowNewTaskForm(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            <TaskForm
              onSubmit={(newTask) => {
                createTask.mutate(newTask);
                setShowNewTaskForm(false);
              }}
              onCancel={() => setShowNewTaskForm(false)}
            />
          </div>
        </div>
      )}
      <TaskListDetails
        editingTask={editingTask}
        onClose={() => setEditingTask(null)}
        onUpdate={(updatedTask) => handleTaskUpdate(updateTaskDetails, updatedTask, setEditingTask, setSelectedTask)}
      />
    </div>




  );
};
export default TaskList;