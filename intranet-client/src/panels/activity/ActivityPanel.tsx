import * as React from 'react';

import Panel from '../Panel';
import './ActivityPanel.scss';

interface Activity {
    id: number;
    title: string;
    details: string;
}

export default function ActivityPanel() {
    const activity: Activity = {
        id: 1,
        title: 'Tournament: Keep Talking and Nobody Explodes',
        details: 'Soos at 16:00',
    };

    return (
        <Panel style={{ justifyContent: 'center' }}>
            <div className="Activity">
                <h1 className="Activity__title">{activity.title}</h1>
                <span className="Activity__details">{activity.details}</span>
            </div>
        </Panel>
    );
}
