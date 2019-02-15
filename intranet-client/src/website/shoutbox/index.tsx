import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { SocketProvider } from '../../helpers/useSocket';

import WebsiteShoutbox from './WebsiteShoutbox';

const container = document.querySelector('#mount-shoutbox');
ReactDOM.render(
    <SocketProvider url="/shoutbox">
        <WebsiteShoutbox />
    </SocketProvider>,
    container,
);
