import * as React from 'react';

import { SocketProvider } from './helpers/useSocket';
import PanelGroup from './panels/PanelGroup';

import ShoutboxPanel from './panels/shoutbox/ShoutboxPanel';
import SlidesPanel from './panels/slides/SlidesPanel';
import TimePanel from './panels/time/TimePanel';

export default function App() {
    return (
        <SocketProvider url="http://localhost:3030/shoutbox">
            <PanelGroup direction="row" height="100%">
                <PanelGroup direction="column" width="66.666%">
                    <SlidesPanel />
                    <PanelGroup direction="row" height={170}>
                        <TimePanel />
                    </PanelGroup>
                </PanelGroup>
                <ShoutboxPanel />
            </PanelGroup>
        </SocketProvider>
    );
}
