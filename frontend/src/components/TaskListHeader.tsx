import React from 'react';
import { TaskList } from '../types/task';
import { UserDto, TaskSummaryDto } from '../services/backend/types';

interface TaskListHeaderProps {
  taskList: TaskList;
  associatedUsers?: UserDto[];
  taskSummary?: TaskSummaryDto;
}

const TaskListHeader: React.FC<TaskListHeaderProps> = ({ taskList, associatedUsers, taskSummary }) => {
  return (
    <div>
      <h2>{taskList.name}</h2>
      <p>{taskList.description}</p>
      {taskList.createdBy && <p>Created by: {taskList.createdBy}</p>}
      {taskSummary && (
        <div>
          <p>Total Tasks: {taskSummary.totalTasks}</p>
          <p>Completed Tasks: {taskSummary.completedTasks}</p>
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