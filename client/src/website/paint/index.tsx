import * as React from 'react';
import { createRoot } from 'react-dom/client';

import Paint from './Paint';
import { SocketProvider } from '../../helpers/useSocket';

const container = document.querySelector('#mount-paint');
createRoot(container!).render(
    <div>
        <SocketProvider url="/paint">
            <Paint size={896} />
        </SocketProvider>
    </div>
);
