import * as React from 'react';
import { ShoutboxMessageProps } from '../../beamer/panels/shoutbox/ShoutboxMessage';

export default function WebsiteShoutboxMessage({
    message,
    merged,
}: ShoutboxMessageProps) {
    return (
        <div>
            {!merged && (
                <header>
                    <strong>{message.username}</strong>
                    <span>
                        {message.time.toLocaleString('nl-NL', {
                            hour: '2-digit',
                            minute: '2-digit',
                        })}
                    </span>
                </header>
            )}
            <p>{message.body}</p>
        </div>
    );
}
