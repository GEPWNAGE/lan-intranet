import * as React from 'react';
import * as ReactDOM from 'react-dom';

// TODO: create elements with canvas to show image and paint new pixels
const container = document.querySelector('#mount-paint');
ReactDOM.render(
    <div>
        <img src="/paint/image" alt="orig"/>
    </div>,
    container,
);
