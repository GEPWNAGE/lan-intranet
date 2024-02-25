import * as React from 'react';
import { createRoot } from 'react-dom/client';

import PaintHistory from './PaintHistory';

const container = document.querySelector('#mount-paint-history');
createRoot(container!).render(
    <div>
        <PaintHistory size={896} />
    </div>
);
