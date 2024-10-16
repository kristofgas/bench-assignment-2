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
    <div className="bg-gray-50 rounded-b-lg overflow-hidden">
      <div className="px-6 py-4">
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
                  onStatusChange={() => onStatusChange(task.id)}
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
};

export default TaskListTasks;