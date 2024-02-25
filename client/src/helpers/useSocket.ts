import {
    createContext,
    createElement,
    ReactNode,
    useContext,
    useMemo,
} from 'react';
import io, { Socket } from 'socket.io-client';

export const SocketContext = createContext<Socket | null>(null);

export interface SocketProviderProps {
    url: string;
    children: ReactNode;
}

export function SocketProvider({ url, ...otherProps }: SocketProviderProps) {
    const socket = useMemo<Socket | null>(() => io(url), [url]);

    return createElement(SocketContext.Provider, {
        value: socket,
        ...otherProps,
    });
}

export default function useSocket<T>() {
    return useContext(SocketContext);
}
