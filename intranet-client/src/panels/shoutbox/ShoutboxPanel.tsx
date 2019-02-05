import * as React from 'react';

import Panel from '../Panel';
import useShoutbox from './useShoutbox';

export default function ShoutboxPanel() {
    const [messages] = useShoutbox();

    return (
        <Panel>
            {messages.map((msg) => (
                <div key={msg.id}>
                    <strong>{msg.username}</strong>
                    <p>{msg.body}</p>
                    <time>{msg.time.toLocaleString()}</time>
                </div>
            ))}
        </Panel>
    );
}
