import React, { createContext, useContext, useEffect, useState } from 'react';
import { HubConnection, HubConnectionBuilder, LogLevel, HubConnectionState } from '@microsoft/signalr';
import { useAuth } from '../services/auth/useAuth';

interface SignalRContextType {
  connection: HubConnection | null;
  connectionState: HubConnectionState;
}

const SignalRContext = createContext<SignalRContextType>({ connection: null, connectionState: HubConnectionState.Disconnected });

export const useSignalRConnection = () => useContext(SignalRContext);

export const SignalRProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const { token } = useAuth();
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [connectionState, setConnectionState] = useState<HubConnectionState>(HubConnectionState.Disconnected);

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

      newConnection.start()
        .then(() => {
          console.log('SignalR connection established');
          setConnectionState(newConnection.state);
        })
        .catch((err) => {
          console.error('Error establishing SignalR connection:', err);
        });

      return () => {
        if (newConnection) {
          newConnection.stop();
        }
      };
    }
  }, [token]);

  return (
    <SignalRContext.Provider value={{ connection, connectionState }}>
      {children}
    </SignalRContext.Provider>
  );
};