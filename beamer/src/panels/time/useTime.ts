import * as React from 'react';

export default function useTime(refreshRate = 1000): [Date] {
    const [time, setTime] = React.useState(new Date());

    React.useEffect(() => {
        const handle = setInterval(() => {
            setTime(new Date());
        }, refreshRate);

        return () => {
            clearInterval(handle);
        };
    }, [refreshRate]);

    return [time];
}
