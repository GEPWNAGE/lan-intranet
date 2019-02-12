import * as React from 'react';
import { animated } from 'react-spring';

import useSlider from '../../../helpers/useSlider';
import Panel, { PanelProps } from '../Panel';
import './SlidesPanel.scss';

import prodriveLogo from './data/prodrive-logo.svg';
import letstalkLogo from './data/letstalk-logo.png';
import gepwnageLogo from './data/gepwnage-logo.png';

export type SlidesPanelProps = PanelProps;

interface Logo {
    logo: string;
    color: string;
}

const logos: Logo[] = [
    { logo: gepwnageLogo, color: '#013370' },
    { logo: prodriveLogo, color: '#ffffff' },
    { logo: letstalkLogo, color: '#ffffff' },
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
                    <img className="SlidesPanel__logo" src={item.logo} />
                </animated.div>
            ))}
        </Panel>
    );
}
