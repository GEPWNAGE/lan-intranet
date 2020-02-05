import * as React from 'react';
import * as ReactDOM from 'react-dom';

import App from './App';
import './index.scss';

if (document.querySelector('#root')) {
    ReactDOM.render(<App />, document.getElementById('root'));
}
