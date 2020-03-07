import 'bootstrap';

import './index.scss';

// Make sure that logos are available in the manifest (this is hacky)
import '../logos/gepwnage-logo.png';

if (document.querySelector('#mount-shoutbox')) {
    import('./shoutbox/index');
}
if (document.querySelector('#mount-paint')) {
    import('./paint/index');
}
if (document.querySelector('#mount-paint-history')) {
    import('./paint/history');
}
