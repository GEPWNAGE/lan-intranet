import * as React from 'react';
import * as ReactDOM from 'react-dom';

import PaintCanvas from './PaintCanvas';

// TODO: create elements with canvas to show image and paint new pixels
const container = document.querySelector('#mount-paint');
ReactDOM.render(
    <div>
        <PaintCanvas size={896} />
    </div>,
    container,
);
