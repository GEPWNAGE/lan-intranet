import { ReactNode, Ref, UIEventHandler, useRef } from 'react';
import usePrevious from '../../../helpers/usePrevious';
import { useScrollBottom } from '../../../helpers/useScrollBottom';

import useShoutbox from './useShoutbox';
import { Message } from './useShoutbox';

// Duration in which messages from the same user should be merged
const MERGE_DURATION = 10 * 60 * 1000;

function shouldMerge(prevMsg: Message, msg: Message): boolean {
    return (
        prevMsg.username === msg.username &&
        msg.time.getTime() - prevMsg.time.getTime() <= MERGE_DURATION
    );
}

export interface ShoutboxProps {
    renderContainer(props: {
        ref: Ref<any>;
        onScroll: UIEventHandler<HTMLElement>;
        children: ReactNode;
    }): JSX.Element;
    renderMessage(props: {
        key: number;
        message: Message;
        merged: boolean;
    }): JSX.Element;
}

export default function Shoutbox({
    renderContainer,
    renderMessage,
}: ShoutboxProps) {
    const [messages] = useShoutbox();
    const prevMessageCount = usePrevious(messages.length);

    const containerRef = useRef(null);
    const onContainerScroll = useScrollBottom(
        containerRef,
        prevMessageCount !== 0,
    );

    return renderContainer({
        ref: containerRef,
        onScroll: onContainerScroll,
        children: messages.map((message, index) =>
            renderMessage({
                key: message.id,
                message,
                merged: index > 0 && shouldMerge(messages[index - 1], message),
            }),
        ),
    });
}
