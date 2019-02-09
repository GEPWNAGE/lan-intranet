import * as React from 'react';
import { useRef } from 'react';

import { useScrollBottom } from '../../helpers/useScrollBottom';
import Panel, { PanelProps } from '../Panel';
import { ShoutboxMessage } from './ShoutboxMessage';
import useShoutbox from './useShoutbox';

export type ShoutboxPanelProps = PanelProps;

export default function ShoutboxPanel({ ...panelProps }: ShoutboxPanelProps) {
    const panelRef = useRef(null);
    const [messages] = useShoutbox();
    const onPanelScroll = useScrollBottom(panelRef);

    return (
        <Panel {...panelProps} ref={panelRef} onScroll={onPanelScroll}>
            {messages.map((message) => (
                <ShoutboxMessage key={message.id} message={message} />
            ))}
        </Panel>
    );
}
