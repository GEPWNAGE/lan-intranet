import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { SocketProvider } from '../../helpers/useSocket';

import WebsiteShoutbox from './WebsiteShoutbox';

const container = document.querySelector('#mount-shoutbox');
createRoot(container!).render(
    <SocketProvider url="/shoutbox">
        <WebsiteShoutbox />
    </SocketProvider>
);
