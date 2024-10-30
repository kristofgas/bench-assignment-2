import React, { useState, useEffect, Suspense } from 'react';
import { useTaskListOperations } from '../../hooks/useTaskListOperations';
import { useTaskSelection } from '../../hooks/useTaskSelection';
import TaskListHeader from './TaskListHeader';
import TaskForm from '../Task/TaskForm';
import TaskListTasks from './TaskListTasks';
import TaskListDetails from './TaskListDetails';
import SelectedTaskDetails from 'components/Task/SelectedTaskDetails';
import { TaskListContentSkeleton } from 'components/Skeletons/TaskListContentSkeleton';
import { FaChevronUp } from 'react-icons/fa';
import { useFilters } from 'providers/FiltersProvider';

interface TaskListProps {
  listId: number;
  onCollapse: () => void;
}

const TaskList: React.FC<TaskListProps> = ({ listId, onCollapse }) => {
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

  // Only keep non-task related operations
  const {
    taskList,
    isTaskListLoading,
    taskListError,
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
    createTask,
    updateTaskDetails,
  } = useTaskListOperations(listId); // Remove filters parameter

  useEffect(() => {
    setSelectedTask(null);
  }, [listId, setSelectedTask]);

  if (taskListError || associatedUsersError || nonAssociatedUsersError) {
    return <div className="text-red-500">Error: {(taskListError || associatedUsersError || nonAssociatedUsersError)?.toString()}</div>;
  }

  return (
    <div className="animate-fadeIn h-full flex flex-col">
      <Suspense fallback={<TaskListContentSkeleton />}>
        {isTaskListLoading || isAssociatedUsersLoading || isNonAssociatedUsersLoading ? (
          <TaskListContentSkeleton />
        ) : (
          <div className="flex flex-col h-full">
            <TaskListHeader
              taskList={taskList}
              associatedUsers={associatedUsers}
              nonAssociatedUsers={nonAssociatedUsers}
              taskSummary={taskSummary}
              onClearCompletedTasks={() => clearCompletedTasks.mutate()}
              onShare={(selectedUsers) => shareTaskList.mutate(selectedUsers)}
              isSharing={isSharing}
              onAddNewTask={() => setShowNewTaskForm(true)}
              onCollapse={onCollapse}
            />
            <div className="flex-1 overflow-hidden">
              <TaskListTasks
                listId={listId}
                onEdit={handleTaskEdit}
                onSelect={(task) => handleTaskSelectHook(task, setSelectedTask)}
              />
            </div>
          </div>
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