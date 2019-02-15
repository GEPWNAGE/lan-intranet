import * as React from 'react';

import { SocketProvider } from '../helpers/useSocket';
import ActivityPanel from './panels/activity/ActivityPanel';
import PanelGroup from './panels/PanelGroup';

import ShoutboxPanel from './panels/shoutbox/ShoutboxPanel';
import SlidesPanel from './panels/slides/SlidesPanel';
import TimePanel from './panels/time/TimePanel';

export default function App() {
    return (
        <SocketProvider url="/shoutbox">
            <PanelGroup direction="row" flex="0 0 100%">
                <PanelGroup direction="column" flex="5 1">
                    <SlidesPanel />
                    <PanelGroup direction="row" flex="0 0 180px">
                        <TimePanel />
                        <ActivityPanel />
                    </PanelGroup>
                </PanelGroup>
                <ShoutboxPanel flex="3 1" />
            </PanelGroup>
        </SocketProvider>
    );
}
