import * as React from 'react';

import { SocketProvider } from './helpers/useSocket';
import PanelGroup from './panels/PanelGroup';
import ShoutboxPanel from './panels/shoutbox/ShoutboxPanel';
import TimePanel from './panels/time/TimePanel';

export default function App() {
    return (
        <SocketProvider url="http://localhost:3030/shoutbox">
            <PanelGroup direction="row" height="100%">
                <ShoutboxPanel />
                <TimePanel />
            </PanelGroup>
        </SocketProvider>
    );
}
