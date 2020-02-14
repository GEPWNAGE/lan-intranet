import * as React from 'react';
import { animated } from 'react-spring';

import useSlider from '../../../helpers/useSlider';
import Panel, { PanelProps } from '../Panel';
import './SlidesPanel.scss';

import gepwnageLogo from '../../../logos/gepwnage-logo.png';

export type SlidesPanelProps = PanelProps;

interface Logo {
    logo: string;
    color: string;
}

const logos: Logo[] = [
    { logo: gepwnageLogo, color: '#013370' },
];

export default function SlidesPanel({ ...otherProps }: SlidesPanelProps) {
    const trans = useSlider(logos, 10000, 5000);

    return (
        <Panel className="SlidesPanel">
            {trans.map(({ item, props, key }) => (
                item && <animated.div
                    key={key}
                    className="SlidesPanel__slide"
                    style={{ ...props, backgroundColor: item.color }}
                >
                    <img className="SlidesPanel__logo" alt="a logo" src={item.logo} />
                </animated.div>
            ))}
        </Panel>
    );
}
