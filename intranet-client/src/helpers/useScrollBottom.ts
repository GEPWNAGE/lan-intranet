import { RefObject, useEffect, useRef } from 'react';

export function useScrollBottom(container: RefObject<HTMLElement>) {
    // Helper function to get the scroll distance from the bottom
    const scrollBottom = (el: HTMLElement) =>
        el.scrollHeight - el.scrollTop - el.clientHeight;

    const isScrolledToBottom = useRef(true);

    useEffect(() => {
        if (container.current && isScrolledToBottom.current) {
            container.current.scrollTop += scrollBottom(container.current);
        }
    });

    function onContainerScroll() {
        if (container.current) {
            isScrolledToBottom.current = scrollBottom(container.current) === 0;
        }
    }

    return onContainerScroll;
}
