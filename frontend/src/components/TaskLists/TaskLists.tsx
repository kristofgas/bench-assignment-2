import React, { useState, useCallback } from 'react';
import { FaPlus, FaChevronDown, FaChevronUp, FaTasks } from 'react-icons/fa';
import FilterTasks from '../FilterTasks/FilterTasks';
import TaskList from '../TaskList/TaskList';
import NewTaskListModal from './NewTaskListModal';
import { useTaskOperations } from '../../hooks/useTaskOperations';
import { TaskFilters } from '../../types/task';

const TaskLists: React.FC = () => {
  const [selectedListId, setSelectedListId] = useState<number | null>(null);
  const [showNewListForm, setShowNewListForm] = useState(false);
  const [filters, setFilters] = useState<TaskFilters>({
    isCompleted: null,
    isFavorite: null,
    sortBy: undefined,
    sortDescending: false,
  });
  const { taskLists, isTaskListsLoading, taskListsError, createTaskList } = useTaskOperations();

  const handleNewListSubmit = useCallback((name: string, description: string) => {
    createTaskList.mutate({ name, description }, {
      onSuccess: (newTaskList) => {
        setSelectedListId(newTaskList.id);
      }
    });
  }, [createTaskList]);

  const handleListSelect = (listId: number) => {
    setSelectedListId(listId === selectedListId ? null : listId);
  };

  if (taskListsError) return <div className="text-red-500">Error: {taskListsError.toString()}</div>;

  return (
    <div className="container mx-auto p-4 relative">
      <div className="fixed top-4 right-4 z-10">
        <FilterTasks onFilterChange={setFilters} />
      </div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Task Lists</h1>
        <button
          onClick={() => setShowNewListForm(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-colors duration-200"
        >
          <FaPlus className="inline-block mr-2" /> New List
        </button>
      </div>
      {isTaskListsLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {taskLists?.map(list => (
            <div
              key={`${list.id}-${list.name}`}
              className={`bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 ease-in-out ${
                selectedListId === list.id ? 'col-span-full row-span-2' : ''
              }`}
            >
              <div
                onClick={() => handleListSelect(list.id)}
                className="p-4 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-lg">{list.name}</h3>
                  {selectedListId === list.id ? <FaChevronUp /> : <FaChevronDown />}
                </div>
                <p className="text-sm text-gray-600 mt-2">{list.description}</p>
                {selectedListId !== list.id && (
                  <div className="mt-4 flex items-center text-gray-500">
                    <FaTasks className="mr-2" />
                    <span>{list.taskCount || 0} tasks</span>
                  </div>
                )}
              </div>
              {selectedListId === list.id && (
                <div className="p-4 border-t border-gray-200 bg-gray-50">
                  <TaskList listId={list.id} filters={filters} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      {showNewListForm && (
        <NewTaskListModal
          onClose={() => setShowNewListForm(false)}
          onSubmit={handleNewListSubmit}
        />
      )}
    </div>
  );
};

export default TaskLists;