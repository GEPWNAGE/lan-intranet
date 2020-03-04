import * as React from 'react';
import * as ReactDOM from 'react-dom';

import Paint from './Paint';
import { SocketProvider } from '../../helpers/useSocket';

const container = document.querySelector('#mount-paint');
ReactDOM.render(
    <div>
        <SocketProvider url="/paint">
            <Paint size={896} />
        </SocketProvider>
    </div>,
    container
);
