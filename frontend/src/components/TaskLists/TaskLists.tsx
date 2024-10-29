import React, { useState, useCallback } from 'react';
import { FaPlus, FaListUl } from 'react-icons/fa';
import { TaskFilters } from '../FilterTasks/FilterTasks';
import TaskList from '../TaskList/TaskList';
import NewTaskListModal from './NewTaskListModal';
import { useTaskOperations } from '../../hooks/useTaskOperations';

interface TaskListsProps {
  filters: TaskFilters;
}

const TaskLists: React.FC<TaskListsProps> = ({ filters }) => {
  const [selectedListId, setSelectedListId] = useState<number | null>(null);
  const [showNewListForm, setShowNewListForm] = useState(false);
  const { taskLists, isTaskListsLoading, taskListsError, createTaskList } = useTaskOperations();

  const handleNewListSubmit = useCallback((name: string, description: string) => {
    createTaskList.mutate({ name, description }, {
      onSuccess: (newTaskList) => {
        setSelectedListId(newTaskList.id);
      }
    });
  }, [createTaskList]);

  if (taskListsError) return <div className="text-red-500">Error: {taskListsError.toString()}</div>;

  return (
    <div className="flex h-[calc(100vh-5rem)] mt-16"> {/* Changed from pt-4 to mt-6 and adjusted height */}
      {/* Sidebar */}
      <div className="w-64 md:w-72 shrink-0 bg-white border-r border-gray-200 flex flex-col transition-all duration-200 mx-4">
        <div className="p-4 border-b border-gray-200">
          <button
            onClick={() => setShowNewListForm(true)}
            className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200 flex items-center justify-center"
          >
            <FaPlus className="mr-2" /> New List
          </button>
        </div>
        
        <div className="overflow-y-auto flex-1">
          {isTaskListsLoading ? (
            <div className="p-4 space-y-4">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="h-12 bg-gray-100 rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-2">
              {taskLists?.map(list => (
                <button
                  key={list.id}
                  onClick={() => setSelectedListId(list.id)}
                  className={`w-full text-left p-3 rounded-lg mb-2 transition-colors duration-200 flex items-center ${
                    selectedListId === list.id
                      ? 'bg-blue-50 text-blue-700'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <FaListUl className={`mr-3 ${
                    selectedListId === list.id ? 'text-blue-500' : 'text-gray-400'
                  }`} />
                  <span className="font-medium truncate">{list.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-50 mr-4 rounded-lg overflow-hidden"> {/* Added margin and rounded corners */}
        {selectedListId ? (
          <TaskList
            listId={selectedListId}
            filters={filters}
            onCollapse={() => setSelectedListId(null)}
          />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            <div className="text-center">
              <FaListUl size={48} className="mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-medium mb-2">No Task List Selected</h3>
              <p>Select a task list from the sidebar or create a new one</p>
            </div>
          </div>
        )}
      </div>

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