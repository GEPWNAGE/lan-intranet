import * as React from 'react';
import * as ReactDOM from 'react-dom';

import PaintCanvas from './PaintCanvas';
import { SocketProvider } from '../../helpers/useSocket';

const container = document.querySelector('#mount-paint');
ReactDOM.render(
    <div>
        <SocketProvider url="/paint">
            <PaintCanvas size={896} />
        </SocketProvider>
    </div>,
    container,
);
