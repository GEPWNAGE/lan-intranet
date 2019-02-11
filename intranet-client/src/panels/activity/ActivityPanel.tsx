import * as React from 'react';
import { animated } from 'react-spring';
import useFetch from '../../helpers/useFetch';

import useSlider from '../../helpers/useSlider';
import Panel from '../Panel';
import './ActivityPanel.scss';

interface Activity {
    title: string;
    details: string;
}

async function handleResponse(res: Response): Promise<Activity[]> {
    const { activities } = await res.json();
    return activities;
}

export default function ActivityPanel() {
    const activities = useFetch<Activity[]>(
        'http://localhost:3030/api/activities',
        [],
        handleResponse,
    );

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
