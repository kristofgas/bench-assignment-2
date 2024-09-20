import { useFilteredTasks } from "hooks/useFilteredTasks";
import { useTaskList } from "hooks/useTaskList";
import FilterTasks, { TaskFilters } from "./FilterTasks";
import { Task } from "types/task";
import TaskListHeader from "./TaskListHeader";
import TaskItem from "./TaskItem";
import TaskForm from "./TaskListForm";
import TaskDetails from "./TaskDetails";
import { useState } from "react";
import { useTaskOperations } from "hooks/useTaskOperations";

interface TaskListProps {
  listId: number;
}

const TaskList: React.FC<TaskListProps> = ({ listId }) => {
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
    createTask,
    updateTaskStatus,
    updateTaskDetails
  } = useTaskOperations(listId, filters);

  const filteredTasks = useFilteredTasks(tasks, filters);

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
      <TaskListHeader name={taskList?.name || ''} />
      <FilterTasks onFilterChange={handleFilterChange} />
      <ul>
        {filteredTasks?.map(task => (
          <TaskItem
            key={task.id}
            task={task}
            onStatusChange={() => updateTaskStatus.mutate(task.id)}
            onClick={handleTaskClick}
          />
        ))}
      </ul>
      {!showNewTaskForm ? (
        <button onClick={() => setShowNewTaskForm(true)}>Add New Task</button>
      ) : (
        <TaskForm
          onSubmit={(newTask) => {
            createTask.mutate(newTask, {
              onSuccess: () => {
                setShowNewTaskForm(false);
              }
            });
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