import {
    createContext,
    createElement,
    ReactNode,
    useContext,
    useMemo,
} from 'react';
import io from 'socket.io-client';

export const SocketContext = createContext<SocketIOClient.Socket | null>(null);

export interface SocketProviderProps {
    url: string;
    children: ReactNode;
}

export function SocketProvider({ url, ...otherProps }: SocketProviderProps) {
    const socket = useMemo<SocketIOClient.Socket | null>(() => io(url), [url]);

    return createElement(SocketContext.Provider, {
        value: socket,
        ...otherProps,
    });
}

export default function useSocket<T>() {
    return useContext(SocketContext);
}
