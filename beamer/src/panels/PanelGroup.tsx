import * as React from 'react';
import cx from 'classnames';

import './PanelGroup.scss';

export interface PanelGroupProps {
    children: React.ReactNode;
    direction: 'row' | 'column';
    width?: any;
    height?: any;
}

export default function PanelGroup({
    children,
    direction,
    width,
    height,
}: PanelGroupProps) {
    return (
        <div
            className={cx('PanelGroup', `PanelGroup--${direction}`)}
            style={{ width, height }}
        >
            {children}
        </div>
    );
}
