import * as React from 'react';
import cx from 'classnames';

import { Message } from './useShoutbox';
import './ShoutboxMessage.scss';

interface ShoutboxMessageProps {
    message: Message;
    merged: boolean;
}

export function ShoutboxMessage({ message, merged }: ShoutboxMessageProps) {
    return (
        <article
            className={cx('ShoutboxMessage', {
                'ShoutboxMessage--merged': merged,
            })}
        >
            <header className="ShoutboxMessage__header">
                <span className="ShoutboxMessage__username">
                    {message.username}
                </span>
                <time className="ShoutboxMessage__time">
                    {message.time.toLocaleString('nl-NL', {
                        hour: '2-digit',
                        minute: '2-digit',
                    })}
                </time>
            </header>
            <p className="ShoutboxMessage__body">{message.body}</p>
        </article>
    );
}
