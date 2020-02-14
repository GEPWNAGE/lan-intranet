import * as React from 'react';

import Shoutbox from '../../beamer/panels/shoutbox/Shoutbox';
import WebsiteShoutboxForm from './WebsiteShoutboxForm';
import WebsiteShoutboxMessage from './WebsiteShoutboxMessage';

export default function WebsiteShoutbox() {
    return (
        <div className="card flex-grow-1" style={{ maxHeight: 600 }}>
            <Shoutbox
                renderContainer={({ ref, onScroll, children }) => (
                    <div
                        className="card-body overflow-auto pt-2"
                        style={{ flexBasis: 300 }}
                        ref={ref}
                        onScroll={onScroll}
                    >
                        {children}
                    </div>
                )}
                renderMessage={(props) => <WebsiteShoutboxMessage {...props} />}
            />
            <WebsiteShoutboxForm />
        </div>
    );
}
