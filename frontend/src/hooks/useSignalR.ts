import { HubConnection, HubConnectionBuilder, LogLevel, HubConnectionState } from '@microsoft/signalr';
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../services/auth/useAuth';
import { QueryClient } from '@tanstack/react-query';

export const useSignalR = () => {
  const { token } = useAuth();
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [connectionState, setConnectionState] = useState<HubConnectionState>(HubConnectionState.Disconnected);

  const startConnection = useCallback(async () => {
    if (connection && token) {
      try {
        await connection.start();
        console.log('SignalR connection established');
        setConnectionState(connection.state);
      } catch (err) {
        console.error('Error establishing SignalR connection:', err);
        setTimeout(startConnection, 5000); // Retry after 5 seconds
      }
    }
  }, [connection, token]);

  useEffect(() => {
    if (token) {
      const newConnection = new HubConnectionBuilder()
        .withUrl(`${process.env.NEXT_PUBLIC_API_URL}/taskHub`, {
          accessTokenFactory: () => token
        })
        .withAutomaticReconnect()
        .configureLogging(LogLevel.Information)
        .build();
  
      setConnection(newConnection);
  
      newConnection.onclose((error) => {
        console.error('SignalR connection closed:', error);
        setConnectionState(HubConnectionState.Disconnected);
      });
  
      newConnection.onreconnecting((error) => {
        console.warn('SignalR attempting to reconnect:', error);
        setConnectionState(HubConnectionState.Reconnecting);
      });
  
      newConnection.onreconnected((connectionId) => {
        console.log('SignalR reconnected:', connectionId);
        setConnectionState(HubConnectionState.Connected);
      });
  
      return () => {
        if (newConnection) {
          newConnection.stop();
        }
      };
    }
  }, []);

  useEffect(() => {
    if (connection && token) {
      startConnection();
    }
  }, [connection, token, startConnection]);

  const joinTaskList = useCallback((taskListId: number) => {
    if (connection && connectionState === HubConnectionState.Connected) {
      connection.invoke('JoinTaskList', taskListId).catch(err => console.error('Error joining task list:', err));
    }
  }, [connection, connectionState]);

  const leaveTaskList = useCallback((taskListId: number) => {
    if (connection && connectionState === HubConnectionState.Connected) {
      connection.invoke('LeaveTaskList', taskListId).catch(err => console.error('Error leaving task list:', err));
    }
  }, [connection, connectionState]);

  const setupTaskListListeners = useCallback((taskListId: number, queryClient: QueryClient) => {
    if (connection) {
      const handlers = ['TaskCreated', 'TaskUpdated', 'TaskDeleted', 'TaskListShared'];
      handlers.forEach(handler => {
        connection.on(handler, (sharedTaskListId?: number) => {
          if (handler === 'TaskListShared') {
            queryClient.invalidateQueries({ queryKey: ['taskLists'] });
            
          } else {
            queryClient.invalidateQueries({ queryKey: ['tasks', taskListId] });
          }
        });
      });
    }
  }, [connection]);

  const setupTaskListsListener = useCallback((queryClient: QueryClient) => {
    if (connection) {
      connection.on('TaskListCreated', () => {
        queryClient.invalidateQueries({ queryKey: ['taskLists'] });
      });
    }
  }, [connection]);
  
  const removeTaskListsListener = useCallback(() => {
    if (connection) {
      connection.off('TaskListCreated');
    }
  }, [connection]);

  const removeTaskListListeners = useCallback(() => {
    if (connection) {
      const handlers = ['TaskCreated', 'TaskUpdated', 'TaskDeleted', 'TaskListShared'];
      handlers.forEach(handler => {
        connection.off(handler);
      });
    }
  }, [connection]);

  return {
    connection,
    connectionState,
    joinTaskList,
    leaveTaskList,
    setupTaskListListeners,
    removeTaskListListeners,
    setupTaskListsListener,
    removeTaskListsListener
  };
};