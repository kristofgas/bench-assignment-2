// src/components/Skeletons/TaskListContentSkeleton.tsx
import React from 'react';

export const TaskListContentSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-8 bg-gray-200 rounded w-1/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      <div className="h-10 bg-gray-200 rounded w-full"></div>
      <div className="space-y-2">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="h-16 bg-gray-200 rounded"></div>
        ))}
      </div>
    </div>
  );
};