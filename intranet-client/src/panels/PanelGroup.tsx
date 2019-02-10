import * as React from 'react';
import cx from 'classnames';

import './PanelGroup.scss';
import { PanelProps } from './Panel';

export interface PanelGroupProps extends PanelProps {
    direction: 'row' | 'column';
}

export default function PanelGroup({
    children,
    direction,
    flex,
}: PanelGroupProps) {
    return (
        <div
            className={cx('PanelGroup', `PanelGroup--${direction}`)}
            style={{ flex }}
        >
            {children}
        </div>
    );
}
