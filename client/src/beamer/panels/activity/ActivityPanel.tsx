import * as React from 'react';
import { animated } from 'react-spring';

import useSlider from '../../../helpers/useSlider';
import Panel from '../Panel';
import './ActivityPanel.scss';
import useActivities from './useActivities';

export default function ActivityPanel() {
    const activities = useActivities();
    const trans = useSlider(activities, 10000);

    return (
        <Panel className="ActivityPanel">
            {trans(({ props, item, _, key }) =>
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
