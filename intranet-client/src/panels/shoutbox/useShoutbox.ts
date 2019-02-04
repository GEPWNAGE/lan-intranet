import { useEffect, useReducer } from 'react';

import useSocket from '../../helpers/useSocket';

interface Message {
    id: number;
    username: string;
    body: string;
    time: Date;
}

function reducer(state: Message[], message: Message): Message[] {
    return [...state, message];
}

export default function useShoutbox(): [Message[]] {
    const socket = useSocket();

    const [messages, dispatch] = useReducer(reducer, []);

    useEffect(() => {
        function callback(message: Message) {
            dispatch(message);
        }

        if (socket !== null) {
            socket.on('shoutbox message', callback);
            return () => socket.off('shoutbox message', callback);
        }
    }, [socket]);

    return [messages];
}
