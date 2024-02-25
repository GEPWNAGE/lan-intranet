import * as React from 'react';
import { FormEventHandler, useState } from 'react';

export default function WebsiteShoutboxForm() {
    const [message, setMessage] = useState('');

    const onSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        setMessage('');

        await fetch('/api/shoutbox', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ body: message }),
        });
    };

    return (
        <div className="card-footer">
            <form onSubmit={onSubmit}>
                <div className="row">
                    <div className="col-auto flex-grow-1">
                        <input
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            type="text"
                            className="form-control"
                            placeholder="Shout something..."
                            autoFocus
                            maxLength={128}
                        />
                    </div>
                    <div className="col-auto">
                        <button className="btn btn-primary">Shout!</button>
                    </div>
                </div>
            </form>
        </div>
    );
}
