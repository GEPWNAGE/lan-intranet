import * as React from 'react';

// Taken from https://overreacted.io/making-setinterval-declarative-with-react-hooks/
export function useInterval(
    callback: () => void,
    delay: number | null,
    delayOffset: number = 0,
) {
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
            let intervalId: any;
            const timeoutId = setTimeout(() => {
                intervalId = setInterval(tick, delay);
            }, delayOffset);

            return () => {
                clearTimeout(timeoutId);
                intervalId && clearInterval(intervalId);
            }
        }
    }, [delay, delayOffset]);
}
