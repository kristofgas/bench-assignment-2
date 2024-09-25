import React from 'react';
import { TaskList } from '../types/task';
import { UserDto } from '../services/backend/types';

interface TaskListHeaderProps {
  taskList: TaskList;
  associatedUsers?: UserDto[];
}

const TaskListHeader: React.FC<TaskListHeaderProps> = ({ taskList, associatedUsers }) => {
  return (
    <div>
      <h2>{taskList.name}</h2>
      <p>{taskList.description}</p>
      {taskList.createdBy && <p>Created by: {taskList.createdBy}</p>}
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