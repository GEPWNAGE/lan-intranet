import * as React from 'react';

import './Panel.scss';

export interface PanelProps {
    children?: React.ReactNode;
    flex?: string;
}

export default function Panel({ children, flex }: PanelProps) {
    return (
        <div className="Panel" style={{ flex }}>
            <div className="Panel__inner">{children}</div>
        </div>
    );
}
