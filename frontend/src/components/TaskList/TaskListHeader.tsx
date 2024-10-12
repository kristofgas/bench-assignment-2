import React, { useState } from 'react';
import { TaskList } from '../../types/task';
import { UserDto, TaskSummaryDto } from '../../services/backend/types';
import TaskListShare from './TaskListShare';
import { FaShare, FaPlus, FaTrash, FaClipboardList } from 'react-icons/fa';

interface TaskListHeaderProps {
  taskList: TaskList;
  associatedUsers?: UserDto[];
  nonAssociatedUsers?: UserDto[];
  taskSummary?: TaskSummaryDto;
  onClearCompletedTasks: () => void;
  onShare: (selectedUsers: number[]) => void;
  isSharing: boolean;
  onAddNewTask: () => void;
}

const TaskListHeader: React.FC<TaskListHeaderProps> = ({
  taskList,
  associatedUsers,
  nonAssociatedUsers,
  taskSummary,
  onClearCompletedTasks,
  onShare,
  isSharing,
  onAddNewTask
}) => {
  const [showShareDropdown, setShowShareDropdown] = useState(false);

  return (
    <div className="bg-white shadow-sm rounded-lg p-6 mb-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">{taskList.name}</h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={onAddNewTask}
            className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600 transition-colors duration-200"
            title="Add New Task"
          >
            <FaPlus />
          </button>
          {taskSummary && (
            <div className="flex items-center bg-gray-100 rounded-full overflow-hidden">
              <div className="flex items-center px-3 py-1">
                <FaClipboardList className="text-gray-600 mr-2" size={16} />
                <span className="text-sm font-medium">
                  {taskSummary.completedTasks} / {taskSummary.totalTasks} completed
                </span>
              </div>
              {taskSummary.completedTasks > 0 && (
                <button
                  onClick={onClearCompletedTasks}
                  className="bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-700 px-3 py-1 transition-colors duration-200 flex items-center"
                  title="Clear Completed Tasks"
                >
                  <FaTrash size={14} className="mr-1" />
                  <span className="text-xs font-medium">Clear</span>
                </button>
              )}
            </div>
          )}
          <button
            onClick={() => setShowShareDropdown(!showShareDropdown)}
            className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors duration-200 flex items-center ml-2"
            title="Share Task List"
          >
            <FaShare className="mr-2" />
            <span>Share</span>
            {associatedUsers && associatedUsers.length > 0 && (
              <div className="flex -space-x-2 ml-2">
                {associatedUsers.slice(0, 3).map(user => (
                  <img
                    key={user.userId}
                    className="inline-block h-6 w-6 rounded-full ring-2 ring-white"
                    src={`https://ui-avatars.com/api/?name=${user.username}&background=random`}
                    alt={user.username}
                    title={user.username}
                  />
                ))}
                {associatedUsers.length > 3 && (
                  <div className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-gray-300 text-xs font-medium">
                    +{associatedUsers.length - 3}
                  </div>
                )}
              </div>
            )}
          </button>
        </div>
      </div>
      {taskList.description && (
        <p className="text-gray-600 mb-4">{taskList.description}</p>
      )}
      {showShareDropdown && (
        <div className="mt-4">
          <TaskListShare
            nonAssociatedUsers={nonAssociatedUsers || []}
            onShare={onShare}
            isSharing={isSharing}
            onClose={() => setShowShareDropdown(false)}
          />
        </div>
      )}
    </div>
  );
};

export default TaskListHeader;