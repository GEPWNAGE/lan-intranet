import * as React from 'react';

import './Panel.scss';

export interface PanelProps {
    children: React.ReactNode;
}

export default function Panel({ children }: PanelProps) {
    return (
        <div className="Panel">
            <div className="Panel__inner">{children}</div>
        </div>
    );
}
