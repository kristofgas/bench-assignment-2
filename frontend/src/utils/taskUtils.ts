export const priorityOptions = ['Low', 'Medium', 'High', 'Critical'] as const;
export type Priority = typeof priorityOptions[number];

export const colorOptions = [
  { value: '#FF0000', label: 'Red' },
  { value: '#00FF00', label: 'Green' },
  { value: '#0000FF', label: 'Blue' },
  { value: '#FFFF00', label: 'Yellow' },
] as const;
export type Color = typeof colorOptions[number]['value'];

export const getRankValue = (priority: Priority): number => {
  return priorityOptions.indexOf(priority);
};

export const getPriorityFromRank = (rank: number): Priority => {
  return priorityOptions[rank] || 'Low';
};