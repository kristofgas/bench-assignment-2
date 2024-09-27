import React, { useCallback, useState } from 'react';
import { useTaskOperations } from '../../hooks/useTaskOperations';
import TaskList from '../TaskList/TaskList';
import FilterTasks, { TaskFilters } from '../FilterTasks/FilterTasks';

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
      onSuccess: () => {
        setNewList({ name: '', description: '' });
      }
    });
  }, [createTaskList, newList]);

  const handleListSelect = (listId: number) => {
    setSelectedListId(listId);
  };

  if (isTaskListsLoading) return <div>Loading...</div>;
  if (taskListsError) return <div>Error: {taskListsError.toString()}</div>;

  return (
    <div>
      <h1>Task Lists</h1>
      <FilterTasks onFilterChange={setFilters} />
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={newList.name}
          onChange={(e) => setNewList({...newList, name: e.target.value})}
          placeholder="New list name"
          required
        />
        <textarea
          value={newList.description}
          onChange={(e) => setNewList({...newList, description: e.target.value})}
          placeholder="New list description"
          required
        />
        <button type="submit">Create New List</button>
      </form>
      <ul>
        {taskLists?.map(list => (
          <li key={list.id} onClick={() => handleListSelect(list.id)}>
            {list.name}
          </li>
        ))}
      </ul>
      {selectedListId && <TaskList listId={selectedListId} filters={filters} />}
    </div>
  );
};

export default TaskLists;