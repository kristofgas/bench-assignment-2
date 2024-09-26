import React from 'react';
import { TaskList } from '../types/task';
import { UserDto, TaskSummaryDto } from '../services/backend/types';

interface TaskListHeaderProps {
  taskList: TaskList;
  associatedUsers?: UserDto[];
  taskSummary?: TaskSummaryDto;
  onClearCompletedTasks: () => void;
}

const TaskListHeader: React.FC<TaskListHeaderProps> = ({ taskList, associatedUsers, taskSummary, onClearCompletedTasks }) => {
  return (
    <div>
      <h2>{taskList.name}</h2>
      <p>{taskList.description}</p>
      {taskList.createdBy && <p>Created by: {taskList.createdBy}</p>}
      {taskSummary && (
        <div>
          <p>Tasks: {taskSummary.completedTasks} / {taskSummary.totalTasks} completed</p>
          <button onClick={onClearCompletedTasks} disabled={taskSummary.completedTasks === 0}>
            Clear Completed Tasks
          </button>
        </div>
      )}
      {associatedUsers && associatedUsers.length > 0 && (
        <div>
          <h3>Shared with:</h3>
          <ul>
            {associatedUsers.map(user => (
              <li key={user.userId}>{user.username}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TaskListHeader;