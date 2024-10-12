import React, { useState } from 'react';
import { Task } from '../../types/task';
import TaskItem from 'components/Task/TaskItem';

interface TaskListTasksProps {
  activeTasks: Task[];
  completedTasks: Task[];
  onStatusChange: (taskId: number) => void;
  onEdit: (task: Task) => void;
  onSelect: (task: Task) => void;
}

const TaskListTasks: React.FC<TaskListTasksProps> = ({ activeTasks, completedTasks, onStatusChange, onEdit, onSelect }) => {
  const [showCompleted, setShowCompleted] = useState(false);
  const [expandedTaskId, setExpandedTaskId] = useState<number | null>(null);

  const handleTaskExpand = (taskId: number) => {
    setExpandedTaskId(expandedTaskId === taskId ? null : taskId);
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-2">Active Tasks</h3>
      <div className="mb-6">
        {activeTasks.map(task => (
          <TaskItem
            key={task.id}
            task={task}
            onStatusChange={() => onStatusChange(task.id)}
            onEdit={() => onEdit(task)}
            onSelect={() => onSelect(task)}
            isExpanded={expandedTaskId === task.id}
            onExpand={() => handleTaskExpand(task.id)}
          />
        ))}
      </div>
      {completedTasks.length > 0 && (
        <>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-semibold">Completed Tasks</h3>
            <button
              onClick={() => setShowCompleted(!showCompleted)}
              className="text-blue-500 hover:text-blue-700"
            >
              {showCompleted ? 'Hide' : 'Show'}
            </button>
          </div>
          {showCompleted && (
            <div>
              {completedTasks.map(task => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onStatusChange={() => onStatusChange(task.id)}
                  onEdit={() => onEdit(task)}
                  onSelect={() => onSelect(task)}
                  isExpanded={expandedTaskId === task.id}
                  onExpand={() => handleTaskExpand(task.id)}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TaskListTasks;