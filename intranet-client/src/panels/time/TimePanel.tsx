import * as React from 'react';

import Panel, { PanelProps } from '../Panel';
import useTime from './useTime';

export type TimePanelProps = PanelProps;

export default function TimePanel({ ...panelProps }: TimePanelProps) {
    const [time] = useTime();

    return (
        <Panel {...panelProps}>
            <div className="TimePanel">
                <div className="TimePanel__time">
                    {/* nl-NL to ensure 24 hour time formatting */}
                    {time.toLocaleString('nl-NL', {
                        hour: '2-digit',
                        minute: '2-digit',
                    })}
                </div>
                <div className="TimePanel__date">
                    {time.toLocaleString('en-US', {
                        weekday: 'long',
                    })}
                </div>
            </div>
        </Panel>
    );
}
