import React, { useState, memo } from 'react';
import { Task } from '../../types/task';
import TaskItem from 'components/Task/TaskItem';
import { useFilters } from '../../providers/FiltersProvider';
import { useTasksData } from '../../hooks/useTasksData';
import { TaskListContentSkeleton } from 'components/Skeletons/TaskListContentSkeleton';

interface TaskListTasksProps {
  listId: number;
  onEdit: (task: Task) => void;
  onSelect: (task: Task) => void;
}

const TaskListTasks = memo<TaskListTasksProps>(({ listId, onEdit, onSelect }) => {
  const { filters } = useFilters();
  const { tasks, isTasksLoading, updateTaskStatus } = useTasksData(listId, filters);
  const [showCompleted, setShowCompleted] = useState(false);
  const [expandedTaskId, setExpandedTaskId] = useState<number | null>(null);

  const handleTaskExpand = (taskId: number) => {
    setExpandedTaskId(expandedTaskId === taskId ? null : taskId);
  };

  if (isTasksLoading) return <TaskListContentSkeleton />;

  const activeTasks = tasks.filter(task => !task.isCompleted);
  const completedTasks = tasks.filter(task => task.isCompleted);

  return (
    <div className="h-full overflow-y-auto bg-gray-50 rounded-b-lg">
      <div className="px-6 py-4">
        {activeTasks.map(task => (
          <TaskItem
            key={task.id}
            task={task}
            onStatusChange={() => updateTaskStatus.mutate(task.id)}
            onEdit={() => onEdit(task)}
            onSelect={() => onSelect(task)}
            isExpanded={expandedTaskId === task.id}
            onExpand={() => handleTaskExpand(task.id)}
          />
        ))}
      </div>
      {completedTasks.length > 0 && (
        <div className="border-t border-gray-200 px-6 py-4">
          <button
            onClick={() => setShowCompleted(!showCompleted)}
            className="text-gray-500 hover:text-gray-700 text-sm font-medium mb-4"
          >
            {showCompleted ? 'Hide completed tasks' : `Show completed tasks (${completedTasks.length})`}
          </button>
          {showCompleted && (
            <div className="space-y-2">
              {completedTasks.map(task => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onStatusChange={() => updateTaskStatus.mutate(task.id)}
                  onEdit={() => onEdit(task)}
                  onSelect={() => onSelect(task)}
                  isExpanded={expandedTaskId === task.id}
                  onExpand={() => handleTaskExpand(task.id)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
});

export default TaskListTasks;