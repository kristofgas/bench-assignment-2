import React, { useCallback, useState, Suspense } from 'react';
import { useTaskOperations } from '../../hooks/useTaskOperations';
import TaskList from '../TaskList/TaskList';
import FilterTasks, { TaskFilters } from '../FilterTasks/FilterTasks';
import { TaskListSkeleton } from 'components/Skeletons/TaskListSkeleton';


const TaskLists: React.FC = () => {
  const [newList, setNewList] = useState({ name: '', description: '' });
  const [selectedListId, setSelectedListId] = useState<number | null>(null);
  const [filters, setFilters] = useState<TaskFilters>({
    isCompleted: null,
    isFavorite: null,
    sortBy: undefined,
    sortDescending: false,
  });
  const { taskLists, isTaskListsLoading, taskListsError, createTaskList } = useTaskOperations();

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    createTaskList.mutate(newList, {
      onSuccess: (newTaskList) => {
        setNewList({ name: '', description: '' });
        setSelectedListId(newTaskList.id);
      }
    });
  }, [createTaskList, newList]);

  const handleListSelect = (listId: number) => {
    setSelectedListId(listId === selectedListId ? null : listId);
  };

  if (taskListsError) return <div className="text-red-500">Error: {taskListsError.toString()}</div>;

  return (
    <div className="flex h-screen">
      <div className="w-1/4 bg-gray-100 p-4 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-4">Task Lists</h1>
        <form onSubmit={handleSubmit} className="mb-4">
          <input
            type="text"
            value={newList.name}
            onChange={(e) => setNewList({...newList, name: e.target.value})}
            placeholder="New list name"
            required
            className="w-full p-2 mb-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            value={newList.description}
            onChange={(e) => setNewList({...newList, description: e.target.value})}
            placeholder="New list description"
            className="w-full p-2 mb-2 border border-gray-300 rounded"
          />
          <button type="submit" className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Create New List
          </button>
        </form>
        <Suspense fallback={<TaskListSkeleton />}>
          {isTaskListsLoading ? (
            <TaskListSkeleton />
          ) : (
            <ul className="space-y-2">
              {taskLists?.map(list => (
                <li 
                  key={`${list.id}-${list.name}`} 
                  onClick={() => handleListSelect(list.id)}
                  className={`p-2 rounded cursor-pointer hover:bg-gray-200 ${selectedListId === list.id ? 'bg-gray-200' : ''}`}
                >
                  {list.name}
                </li>
              ))}
            </ul>
          )}
        </Suspense>
      </div>
      <div className="w-3/4 p-4 overflow-y-auto">
        <FilterTasks onFilterChange={setFilters} />
        {selectedListId && <TaskList listId={selectedListId} filters={filters} />}
      </div>
    </div>
  );
};

export default TaskLists;