import 'bootstrap';

import './index.scss';

// Make sure that logos are available in the manifest (this is hacky)
import '../logos/prodrive-logo.svg';
import '../logos/letstalk-logo.png';

if (document.querySelector('#mount-shoutbox')) {
    import('./shoutbox/index');
}
