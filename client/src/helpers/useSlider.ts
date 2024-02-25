import { useEffect, useState } from 'react';
import { useTransition } from 'react-spring';

import { useInterval } from './useInterval';

export default function useSlider<T>(
    items: T[],
    delay: number,
    delayOffset: number = 0,
) {
    const [index, setIndex] = useState<number | null>(null);
    const activeItem = index === null ? null : items[index];

    useInterval(
        () => {
            setIndex((index) => {
                if (index !== null && items.length > 0) {
                    return (index + 1) % items.length;
                } else {
                    return index;
                }
            });
        },
        delay,
        delayOffset,
    );

    // Update the active index when the items change
    useEffect(() => {
        setIndex((index) => {
            if (items.length === 0) {
                return null;
            } else if (
                (index === null && items.length > 0) ||
                (index !== null && items.length <= index)
            ) {
                return 0;
            } else {
                return index;
            }
        });
    }, [items]);

    return useTransition(activeItem, {
        initial: { opacity: 1, transform: 'translate3d(0%,0,0)' },
        from: { opacity: 0, transform: 'translate3d(100%,0,0)' },
        enter: { opacity: 1, transform: 'translate3d(0%,0,0)' },
        leave: { opacity: 0, transform: 'translate3d(-50%,0,0)' },
    } as any);
}
