import React from 'react';
import { Task } from '../../types/task';
import TaskListTasks from './TaskListTasks';
import { TaskFilters } from '../FilterTasks/FilterTasks';

interface TaskListContentProps {
  tasks: Task[];
  filters: TaskFilters;
  onStatusChange: (taskId: number) => void;
  onEdit: (task: Task) => void;
  onSelect: (task: Task) => void;
}

const TaskListContent: React.FC<TaskListContentProps> = React.memo(({ 
  tasks,
  filters,
  onStatusChange,
  onEdit,
  onSelect
}) => {
  const activeTasks = tasks.filter(task => !task.isCompleted);
  const completedTasks = tasks.filter(task => task.isCompleted);

  return (
    <div className="flex-1 overflow-hidden">
      <TaskListTasks
        activeTasks={activeTasks}
        completedTasks={completedTasks}
        onStatusChange={onStatusChange}
        onEdit={onEdit}
        onSelect={onSelect}
      />
    </div>
  );
});

export default TaskListContent;