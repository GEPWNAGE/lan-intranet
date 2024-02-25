import * as React from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';
import './index.scss';

if (document.querySelector('#root')) {
    createRoot(document.getElementById('root')!).render(<App />)
}
