import React, { useState } from 'react';
import { NewTask } from '../types/task';
import { priorityOptions, colorOptions, Priority, Color } from '../utils/taskUtils';

interface TaskFormProps {
  onSubmit: (task: NewTask) => void;
  onCancel: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ onSubmit, onCancel }) => {
  const [newTask, setNewTask] = useState<NewTask>({ title: '', description: '', rank: 'Low', color: '#FF0000' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(newTask);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={newTask.title}
        onChange={(e) => setNewTask({...newTask, title: e.target.value})}
        placeholder="Task title"
        required
      />
      <textarea
        value={newTask.description}
        onChange={(e) => setNewTask({...newTask, description: e.target.value})}
        placeholder="Task description"
        required
      />
      <select
        value={newTask.rank}
        onChange={(e) => setNewTask({...newTask, rank: e.target.value as Priority})}
      >
        {priorityOptions.map((priority) => (
          <option key={priority} value={priority}>{priority}</option>
        ))}
      </select>
      <select
        value={newTask.color}
        onChange={(e) => setNewTask({...newTask, color: e.target.value as Color})}
      >
        {colorOptions.map((color) => (
          <option key={color.value} value={color.value}>{color.label}</option>
        ))}
      </select>
      <button type="submit">Add Task</button>
      <button type="button" onClick={onCancel}>Cancel</button>
    </form>
  );
};

export default TaskForm;