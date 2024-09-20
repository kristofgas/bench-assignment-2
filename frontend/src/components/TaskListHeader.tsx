import React from 'react';

interface TaskListHeaderProps {
  name: string;
}

const TaskListHeader: React.FC<TaskListHeaderProps> = ({ name }) => (
  <h2>{name}</h2>
);

export default TaskListHeader;