import * as React from 'react';

import Panel, { PanelProps } from '../Panel';
import useTime from './useTime';
import './TimePanel.scss';

export default function TimePanel() {
    const [time] = useTime();

    return (
        <Panel flex="0 0 230px" style={{ justifyContent: 'center' }}>
            <div className="Time">
                <div className="Time__time">
                    {/* nl-NL to ensure 24 hour time formatting */}
                    {time.toLocaleString('nl-NL', {
                        hour: '2-digit',
                        minute: '2-digit',
                    })}
                </div>
                <div className="Time__date">
                    {time.toLocaleString('en-US', {
                        weekday: 'long',
                    })}
                </div>
            </div>
        </Panel>
    );
}
