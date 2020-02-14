import { useEffect, useRef } from 'react';

export default function usePrevious<V>(value: V): V | null {
    const ref = useRef<V | null>(null);
    useEffect(() => {
        ref.current = value;
    });
    return ref.current;
}
