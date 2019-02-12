import { useEffect, useReducer } from 'react';

import useSocket from '../../../helpers/useSocket';

export interface Message {
    id: number;
    username: string;
    body: string;
    time: Date;
}

interface ShoutboxState {
    ids: number[];
    messagesById: { [id: number]: Message };
}

type ShoutboxAction = { type: 'RECEIVE_MESSAGES'; messages: Message[] };

const initialState: ShoutboxState = {
    ids: [],
    messagesById: {},
};

function reducer(state: ShoutboxState, action: ShoutboxAction): ShoutboxState {
    switch (action.type) {
        case 'RECEIVE_MESSAGES':
            // Normalize the result
            const newIds = action.messages.map((msg) => msg.id);
            const newMessagesById = action.messages.reduce<{
                [id: number]: Message;
            }>((obj, msg) => {
                obj[msg.id] = msg;
                return obj;
            }, {});

            // Combine with the existing messages
            const ids = [...state.ids, ...newIds];
            const messagesById = { ...state.messagesById, ...newMessagesById };

            // Sort messages by time
            ids.sort(
                (a, b) =>
                    messagesById[a].time.getTime() -
                    messagesById[b].time.getTime(),
            );

            return {
                ids: ids,
                messagesById,
            };
        default:
            return state;
    }
}

function convertApiMessage(msg: any): Message {
    return {
        ...msg,
        time: new Date(msg.time),
    };
}

export default function useShoutbox(): [Message[]] {
    const socket = useSocket();

    const [state, dispatch] = useReducer(reducer, initialState);

    // Initial request to get existing messages
    useEffect(() => {
        fetch('/api/shoutbox')
            .then((res) => res.json())
            .then((json) =>
                dispatch({
                    type: 'RECEIVE_MESSAGES',
                    messages: json.messages.map(convertApiMessage),
                }),
            );
    }, []);

    // Receive new messages via socket
    useEffect(() => {
        function callback(msg: any) {
            dispatch({
                type: 'RECEIVE_MESSAGES',
                messages: [convertApiMessage(msg)],
            });
        }

        if (socket !== null) {
            socket.on('shoutbox message', callback);
            return () => socket.off('shoutbox message', callback);
        }
    }, [socket]);

    return [state.ids.map((id) => state.messagesById[id])];
}
