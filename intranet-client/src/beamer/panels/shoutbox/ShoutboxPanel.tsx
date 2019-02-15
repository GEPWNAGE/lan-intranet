import * as React from 'react';

import Panel, { PanelProps } from '../Panel';
import PanelGroup from '../PanelGroup';
import Shoutbox from './Shoutbox';
import { ShoutboxMessage } from './ShoutboxMessage';

export type ShoutboxPanelProps = PanelProps;

export default function ShoutboxPanel(panelGroupProps: ShoutboxPanelProps) {
    return (
        <PanelGroup direction="column" {...panelGroupProps}>
            <Shoutbox
                renderContainer={({ ref, onScroll, children }) => (
                    <Panel ref={ref} onScroll={onScroll}>
                        {children}
                    </Panel>
                )}
                renderMessage={({ key, message, merged }) => (
                    <ShoutboxMessage
                        key={key}
                        message={message}
                        merged={merged}
                    />
                )}
            />
            <Panel
                flex="0 0 auto"
                style={{ justifyContent: 'center', alignItems: 'center' }}
            >
                <span className="text-secondary">More info:</span>{' '}
                <strong>http://gepwnage.lan</strong>
            </Panel>
        </PanelGroup>
    );
}
