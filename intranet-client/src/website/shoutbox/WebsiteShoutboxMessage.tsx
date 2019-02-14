import * as React from 'react';
import { ShoutboxMessageProps } from '../../beamer/panels/shoutbox/ShoutboxMessage';

export default function WebsiteShoutboxMessage({
    message,
    merged,
}: ShoutboxMessageProps) {
    return (
        <div>
            {!merged && (
                <header className="mt-2">
                    <strong>{message.username}</strong>{' '}
                    <time>
                        {message.time.toLocaleString('nl-NL', {
                            hour: '2-digit',
                            minute: '2-digit',
                        })}
                    </time>
                </header>
            )}
            <p className="mb-0">{message.body}</p>
        </div>
    );
}
