// src/components/Skeletons/TaskListSkeleton.tsx
import React from 'react';

export const TaskListSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse space-y-2">
      {[...Array(5)].map((_, index) => (
        <div key={index} className="h-10 bg-gray-200 rounded"></div>
      ))}
    </div>
  );
};