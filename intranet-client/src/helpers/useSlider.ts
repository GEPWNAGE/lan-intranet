import { useState } from 'react';
import { useTransition } from 'react-spring';

import { useInterval } from './useInterval';

export default function useSlider<T>(
    items: T[],
    delay: number,
    delayOffset: number = 0,
) {
    const [index, setIndex] = useState(0);

    useInterval(() => {
        setIndex((index) => (index + 1) % items.length);
    }, delay, delayOffset);

    return useTransition(index, (p) => p, {
        initial: { opacity: 1, transform: 'translate3d(0%,0,0)' },
        from: { opacity: 0, transform: 'translate3d(100%,0,0)' },
        enter: { opacity: 1, transform: 'translate3d(0%,0,0)' },
        leave: { opacity: 0, transform: 'translate3d(-50%,0,0)' },
    } as any);
}
