import * as React from 'react';
import { useRef } from 'react';

import usePrevious from '../../helpers/usePrevious';
import { useScrollBottom } from '../../helpers/useScrollBottom';
import Panel, { PanelProps } from '../Panel';
import { ShoutboxMessage } from './ShoutboxMessage';
import useShoutbox, { Message } from './useShoutbox';

export type ShoutboxPanelProps = PanelProps;

// Duration in which messages from the same user should be merged
const MERGE_DURATION = 10 * 60 * 60 * 1000;

function shouldMerge(prevMsg: Message, msg: Message): boolean {
    return (
        prevMsg.username === msg.username &&
        msg.time.getTime() - prevMsg.time.getTime() <= MERGE_DURATION
    );
}

export default function ShoutboxPanel({ ...panelProps }: ShoutboxPanelProps) {
    const panelRef = useRef(null);
    const [messages] = useShoutbox();
    const prevMessageCount = usePrevious(messages.length);
    const onPanelScroll = useScrollBottom(panelRef, prevMessageCount !== 0);

    return (
        <Panel {...panelProps} ref={panelRef} onScroll={onPanelScroll}>
            {messages.map((msg, index) => (
                <ShoutboxMessage
                    key={msg.id}
                    message={msg}
                    merged={index > 0 && shouldMerge(messages[index - 1], msg)}
                />
            ))}
        </Panel>
    );
}
