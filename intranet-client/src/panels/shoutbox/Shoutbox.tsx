import * as React from 'react';

import { ShoutboxMessage } from './ShoutboxMessage';
import { Message } from './useShoutbox';

// Duration in which messages from the same user should be merged
const MERGE_DURATION = 10 * 60 * 60 * 1000;

function shouldMerge(prevMsg: Message, msg: Message): boolean {
    return (
        prevMsg.username === msg.username &&
        msg.time.getTime() - prevMsg.time.getTime() <= MERGE_DURATION
    );
}

export interface ShoutboxProps {
    messages: Message[];
}

export function Shoutbox({ messages }: ShoutboxProps) {
    return (
        <>
            {messages.map((msg, index) => (
                <ShoutboxMessage
                    key={msg.id}
                    message={msg}
                    merged={index > 0 && shouldMerge(messages[index - 1], msg)}
                />
            ))}
        </>
    );
}
