import * as React from 'react';
import classNames from 'classnames';

import './Panel.scss';

export interface PanelProps extends React.HTMLAttributes<HTMLDivElement> {
    children?: React.ReactNode;
    flex?: string;
}

function Panel(
    { children, flex, className, style, ...otherProps }: PanelProps,
    ref: React.Ref<HTMLDivElement>,
) {
    return (
        <div
            ref={ref}
            className={classNames('Panel', className)}
            style={{ flex, ...style }}
            {...otherProps}
        >
            <div className="Panel__inner">{children}</div>
        </div>
    );
}

export default React.forwardRef(Panel);
