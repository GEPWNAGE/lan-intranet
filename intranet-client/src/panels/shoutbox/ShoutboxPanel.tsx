import * as React from 'react';

import Panel, { PanelProps } from '../Panel';
import { ShoutboxMessage } from './ShoutboxMessage';
import useShoutbox from './useShoutbox';

export type ShoutboxPanelProps = PanelProps;

export default function ShoutboxPanel({ ...panelProps }: ShoutboxPanelProps) {
    const [messages] = useShoutbox();

    return (
        <Panel {...panelProps}>
            {messages.map((message) => (
                <ShoutboxMessage key={message.id} message={message} />
            ))}
        </Panel>
    );
}
