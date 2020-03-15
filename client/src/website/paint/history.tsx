import * as React from 'react';
import * as ReactDOM from 'react-dom';

import PaintHistory from './PaintHistory';

const container = document.querySelector('#mount-paint-history');
ReactDOM.render(
    <div>
        <PaintHistory size={896} />
    </div>,
    container
);
