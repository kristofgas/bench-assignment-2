import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { genApiClient } from '../services/backend/genApiClient';
import { TaskList, Task, NewTask, UpdateTaskDetails } from '../types/task';
import { getRankValue } from 'utils/taskUtils';

export const useTaskList = (listId: number) => {
  const queryClient = useQueryClient();

  const { data: taskList, isLoading: isTaskListLoading, error: taskListError } = useQuery<TaskList>({
    queryKey: ['taskList', listId],
    queryFn: async () => {
      const client = await genApiClient();
      const result = await client.tasks_GetTaskList(listId);
      return {
        id: result.id ?? 0,
        name: result.name,
        description: result.description,
      } as TaskList;
    },
  });

  const { data: tasks, isLoading: isTasksLoading, error: tasksError } = useQuery<Task[]>({
    queryKey: ['tasks', listId],
    queryFn: async () => {
      const client = await genApiClient();
      const result = await client.tasks_GetTasksByState(null, null, null, false, listId);
      return result.map(task => ({
        id: task.id ?? 0,
        title: task.title,
        description: task.description,
        rank: task.rank,
        color: task.color,
        isCompleted: task.isCompleted,
        isFavorite: task.isFavorite,
        taskListId: task.taskListId,
      })) as Task[];
    },
  });


  const createTaskMutation = useMutation({
    mutationFn: async (newTask: NewTask) => {
      const client = await genApiClient();
      return client.tasks_CreateTask({
        ...newTask,
        rank: getRankValue(newTask.rank),
        taskListId: listId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['tasks', listId]});
    },
  });

  const updateTaskStatusMutation = useMutation({
    mutationFn: async (taskId: number) => {
      const client = await genApiClient();
      const task = tasks?.find(t => t.id === taskId);
      return client.tasks_UpdateTaskStatus(taskId, { id: taskId, isCompleted: !task?.isCompleted });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['tasks', listId]});
    },
  });

  const updateTaskDetailsMutation = useMutation({
    mutationFn: async (updatedTask: UpdateTaskDetails) => {
      const client = await genApiClient();
      return client.tasks_UpdateTaskDetails(updatedTask.id, updatedTask);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['tasks', listId]});
    },
  });

  return {
    taskList,
    isTaskListLoading,
    taskListError,
    tasks,
    isTasksLoading,
    tasksError,
    createTaskMutation,
    updateTaskStatusMutation,
    updateTaskDetailsMutation,
  };
};