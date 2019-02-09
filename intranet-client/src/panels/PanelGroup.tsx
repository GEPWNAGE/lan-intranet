import * as React from 'react';
import cx from 'classnames';

import './PanelGroup.scss';

export interface PanelGroupProps {
    children: React.ReactNode;
    direction: 'row' | 'column';
    flex?: string;
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
