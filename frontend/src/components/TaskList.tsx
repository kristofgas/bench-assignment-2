import React, { useState, useMemo } from 'react';
import { TaskList as TaskListType, NewTask, Task } from '../types/task';
import { priorityOptions, colorOptions, getRankValue, Color, Priority } from '../utils/taskUtils';
import FilterTasks, { TaskFilters } from './FilterTasks';
import TaskDetails from './TaskDetails';
import { useTaskList } from '../hooks/useTaskList';

interface TaskListProps {
  listId: number;
}

const TaskList: React.FC<TaskListProps> = ({ listId }) => {
  const [newTask, setNewTask] = useState<NewTask>({ title: '', description: '', rank: 'Low', color: '#FF0000' });
  const [showNewTaskForm, setShowNewTaskForm] = useState(false);
  const [filters, setFilters] = useState<TaskFilters>({ isCompleted: null, isFavorite: null, sortDescending: false });
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const {
    taskList,
    isTaskListLoading,
    taskListError,
    tasks,
    isTasksLoading,
    tasksError,
    createTaskMutation,
    updateTaskStatusMutation,
    updateTaskDetailsMutation
  } = useTaskList(listId, filters);

  const sortTasks = useMemo(() => (a: Task, b: Task) => {
    if (filters.sortBy === 'title') {
      return filters.sortDescending ? b.title.localeCompare(a.title) : a.title.localeCompare(b.title);
    } else if (filters.sortBy === 'rank') {
      return filters.sortDescending ? b.rank - a.rank : a.rank - b.rank;
    }
    return 0;
  }, [filters.sortBy, filters.sortDescending]);

  const filteredTasks = useMemo(() => tasks?.sort(sortTasks) || [], [tasks, sortTasks]);

  const handleFilterChange = (newFilters: TaskFilters) => {
    setFilters(newFilters);
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
  };

  if (isTaskListLoading || isTasksLoading) return <div>Loading...</div>;
  if (taskListError || tasksError) return <div>Error loading task list: {(taskListError || tasksError).toString()}</div>;

  return (
    <div>
      <h2>{taskList?.name}</h2>
      <FilterTasks onFilterChange={handleFilterChange} />
      <ul>
        {filteredTasks?.map(task => (
          <li key={task.id} onClick={() => handleTaskClick(task)}>
            <input
              type="checkbox"
              checked={task.isCompleted}
              onChange={() => updateTaskStatusMutation.mutate(task.id)}
              onClick={(e) => e.stopPropagation()}
            />
            {task.title}
            {task.isFavorite && ' ⭐'}
          </li>
        ))}
      </ul>
      {!showNewTaskForm ? (
        <button onClick={() => setShowNewTaskForm(true)}>Add New Task</button>
      ) : (
        <form onSubmit={(e) => {
          e.preventDefault();
          createTaskMutation.mutate(newTask, {
            onSuccess: () => {
              setNewTask({ title: '', description: '', rank: 'Low', color: '#FF0000' });
              setShowNewTaskForm(false);
            }
          });
        }}>
          <input
            type="text"
            value={newTask.title}
            onChange={(e) => setNewTask({...newTask, title: e.target.value})}
            placeholder="Task title"
            required
          />
          <textarea
            value={newTask.description}
            onChange={(e) => setNewTask({...newTask, description: e.target.value})}
            placeholder="Task description"
            required
          />
          <select
            value={newTask.rank}
            onChange={(e) => setNewTask({...newTask, rank: e.target.value as Priority})}
          >
            {priorityOptions.map((priority) => (
              <option key={priority} value={priority}>{priority}</option>
            ))}
          </select>
          <select
            value={newTask.color}
            onChange={(e) => setNewTask({...newTask, color: e.target.value as Color})}
          >
            {colorOptions.map((color) => (
              <option key={color.value} value={color.value}>{color.label}</option>
            ))}
          </select>
          <button type="submit">Add Task</button>
          <button type="button" onClick={() => setShowNewTaskForm(false)}>Cancel</button>
        </form>
      )}
      {selectedTask && (
        <TaskDetails
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdate={(updatedTask) => updateTaskDetailsMutation.mutate(updatedTask)}
        />
      )}
    </div>
  );
};

export default TaskList;