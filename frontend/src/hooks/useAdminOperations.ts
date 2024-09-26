import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApi } from './useApi';
import { UserDto } from '../services/backend/types';

export function useAdminOperations() {
  const { apiCall } = useApi();
  const queryClient = useQueryClient();

  const { data: users, isLoading: isUsersLoading, error: usersError } = useQuery<UserDto[]>({
    queryKey: ['users'],
    queryFn: () => apiCall(client => client.users_GetAllUsers()),
  });

  const deleteUser = useMutation({
    mutationFn: (userId: number) => apiCall(client => client.users_DeleteUser(userId)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  return {
    users,
    isUsersLoading,
    usersError,
    deleteUser,
  };
}