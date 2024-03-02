import * as React from 'react';
import { animated } from 'react-spring';

import useSlider from '../../../helpers/useSlider';
import Panel, { PanelProps } from '../Panel';
import './SlidesPanel.scss';
import PaintSlide from './PaintSlide';
import { SocketProvider } from '../../../helpers/useSocket';

import gepwnageLogo from '../../../logos/gepwnage-logo.png';
import { useState } from 'react';
import RuneScapeSlide from './RuneScapeSlide';
import DynmapSlide from './DynmapSlide';

export type SlidesPanelProps = PanelProps;

interface Logo {
    logo: string;
    color: string;
}

const logos: Logo[] = [
    { logo: gepwnageLogo, color: '#013370' }
];

export default function SlidesPanel({ ...otherProps }: SlidesPanelProps) {
    let elements = logos.map(item => ({
        element: <img className="SlidesPanel__logo" alt="a logo" src={item.logo} />,
        color: item.color
    }));

    elements.push({
        element: <PaintSlide size={768}/>,
        color: '#013370'
    });

    elements.push({
        element: <DynmapSlide world={1709386676343}/>,
        color: '#000000'
    });

    elements.push({
        element: <RuneScapeSlide world={1}/>,
        color: '#013370'
    });

    const [slides, _] = useState(elements);
    const trans = useSlider(slides, 20000, 5000);

    return (
        <SocketProvider url="/paint">
            <Panel className="SlidesPanel">
                {trans((props, item, _, key) => 
                    item && <animated.div
                                key={key}
                                className="SlidesPanel__slide"
                                style={{ ...props, backgroundColor: item.color }}
                            >
                        {item.element}
                    </animated.div>
                )}
            </Panel>
        </SocketProvider>
    );
}
