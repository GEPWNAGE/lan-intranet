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
        element: <iframe style={{width: '100%', height: '100%'}} src="http://minecraft.gepwnage.lan/index.html?worldname=world&mapname=surface&zoom=5&x=79&y=64&z=48&nopanel=true&hidechat=true&nocompass=true&nopanel=true"/>,
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
