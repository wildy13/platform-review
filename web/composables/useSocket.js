import { io } from 'socket.io-client';

export const useSocket = () => {
  const { data } = useAuth();
  const config = useRuntimeConfig();
  const socket = io(`${config.public.apiUrl}`)

  return { socket };
};