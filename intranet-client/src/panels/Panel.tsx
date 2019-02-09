import * as React from 'react';

import './Panel.scss';

export interface PanelProps extends React.HTMLAttributes<HTMLDivElement> {
    children?: React.ReactNode;
    flex?: string;
}

function Panel(
    { children, flex, ...otherProps }: PanelProps,
    ref: React.Ref<HTMLDivElement>,
) {
    return (
        <div ref={ref} className="Panel" style={{ flex }} {...otherProps}>
            <div className="Panel__inner">{children}</div>
        </div>
    );
}

export default React.forwardRef(Panel);
