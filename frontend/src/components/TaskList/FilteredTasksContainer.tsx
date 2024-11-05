// New component: FilteredTasksContainer.tsx
/*
import React, { memo } from 'react';
import { Task } from '../../types/task';
import TaskListTasks from './TaskListTasks';
import { TaskFilters } from 'types/filters';


interface FilteredTasksContainerProps {
  tasks: Task[];
  filters: TaskFilters;
  onStatusChange: (taskId: number) => void;
  onEdit: (task: Task) => void;
  onSelect: (task: Task) => void;
}

const FilteredTasksContainer = memo(({ 
  tasks,
  filters,
  onStatusChange,
  onEdit,
  onSelect
}: FilteredTasksContainerProps) => {
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

FilteredTasksContainer.displayName = 'FilteredTasksContainer';
export default FilteredTasksContainer;
*/