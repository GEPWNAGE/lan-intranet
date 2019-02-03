import * as React from 'react';

import PanelGroup from './panels/PanelGroup';
import ShoutboxPanel from './panels/shoutbox/ShoutboxPanel';
import TimePanel from './panels/time/TimePanel';

export default function App() {
    return (
        <PanelGroup direction="row" height="100%">
            <ShoutboxPanel />
            <TimePanel />
        </PanelGroup>
    );
}
