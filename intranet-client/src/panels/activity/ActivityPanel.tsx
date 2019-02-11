import * as React from 'react';
import { animated } from 'react-spring';

import useSlider from '../../helpers/useSlider';
import Panel from '../Panel';
import './ActivityPanel.scss';

interface Activity {
    title: string;
    details: string;
}

export default function ActivityPanel() {
    const activities: Activity[] = [
        {
            title: 'Tournament: Keep Talking and Nobody Explodes',
            details: 'Downstairs lounge at 16:00',
        },
        {
            title: 'Dinner: Fries & Snacks',
            details: 'Courtyard at 19:00',
        },
    ];

    const trans = useSlider(activities, 10000);

    return (
        <Panel className="ActivityPanel">
            {trans.map(
                ({ item, props, key }) =>
                    item && (
                        <animated.div
                            key={key}
                            className="Activity"
                            style={props}
                        >
                            <h1 className="Activity__title">{item.title}</h1>
                            <span className="Activity__details">
                                {item.details}
                            </span>
                        </animated.div>
                    ),
            )}
        </Panel>
    );
}
