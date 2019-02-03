import * as React from 'react';

import useTime from './useTime';

export default function TimePanel() {
    const [time] = useTime();

    return (
        <time>
            {time.toLocaleString('nl-NL', {
                hour: '2-digit',
                minute: '2-digit',
            })}
        </time>
    );
}
