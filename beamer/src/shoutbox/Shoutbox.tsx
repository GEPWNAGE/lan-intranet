import * as React from 'react';

interface ShoutboxProps {
    inputEnabled?: boolean;
}

export default function Shoutbox({ inputEnabled = false }: ShoutboxProps) {
    return (
        <div>
            Hello, world!
        </div>
    )
}
