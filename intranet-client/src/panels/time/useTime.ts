import * as React from 'react';

// Taken from https://overreacted.io/making-setinterval-declarative-with-react-hooks/
export function useInterval(callback: () => void, delay: number | null) {
    const savedCallback = React.useRef<typeof callback | null>(null);

    // Remember the latest callback
    React.useEffect(() => {
        savedCallback.current = callback;
    });

    // Set up the interval
    React.useEffect(() => {
        function tick() {
            if (savedCallback.current) {
                savedCallback.current();
            }
        }
        if (delay !== null) {
            const id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
}

export default function useTime(delay = 1000): [Date] {
    const [time, setTime] = React.useState(new Date());

    useInterval(() => {
        setTime(new Date());
    }, delay);

    return [time];
}
