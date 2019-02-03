import * as React from 'react';

import useShoutbox from './useShoutbox';

interface ShoutboxPanelProps {
    inputEnabled?: boolean;
}

export default function ShoutboxPanel({
    inputEnabled = false,
}: ShoutboxPanelProps) {
    const [messages] = useShoutbox();

    return (
        <div>
            {messages.map((msg) => (
                <div key={msg.id}>
                    <strong>{msg.username}</strong>
                    <p>{msg.body}</p>
                    <time>{msg.time.toLocaleString()}</time>
                </div>
            ))}
        </div>
    );
}
