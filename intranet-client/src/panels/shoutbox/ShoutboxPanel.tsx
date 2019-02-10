import * as React from 'react';
import { useRef } from 'react';

import usePrevious from '../../helpers/usePrevious';
import { useScrollBottom } from '../../helpers/useScrollBottom';
import Panel, { PanelProps } from '../Panel';
import PanelGroup from '../PanelGroup';
import { Shoutbox } from './Shoutbox';
import useShoutbox from './useShoutbox';

export type ShoutboxPanelProps = PanelProps;

export default function ShoutboxPanel(panelGroupProps: ShoutboxPanelProps) {
    const [messages] = useShoutbox();
    const prevMessageCount = usePrevious(messages.length);

    const panelRef = useRef(null);
    const onPanelScroll = useScrollBottom(panelRef, prevMessageCount !== 0);

    return (
        <PanelGroup direction="column" {...panelGroupProps}>
            <Panel ref={panelRef} onScroll={onPanelScroll}>
                <Shoutbox messages={messages} />
            </Panel>
            <Panel
                flex="0 0 100px"
                style={{ justifyContent: 'center', alignItems: 'center' }}
            >
                gepwnage.lan/shoutbox
            </Panel>
        </PanelGroup>
    );
}
