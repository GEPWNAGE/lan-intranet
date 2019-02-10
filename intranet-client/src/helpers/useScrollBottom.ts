import { RefObject, useEffect, useRef } from 'react';

export function useScrollBottom(
    container: RefObject<HTMLElement>,
    smooth: boolean,
) {
    // Helper function to get the scroll distance from the bottom
    const scrollBottom = (el: HTMLElement) =>
        el.scrollHeight - el.scrollTop - el.clientHeight;

    const isScrolledToBottom = useRef(true);
    const prevScrollTop = useRef(0);

    useEffect(() => {
        if (container.current && isScrolledToBottom.current) {
            const el = container.current;

            el.scrollTo({
                left: el.scrollLeft,
                top: el.scrollTop + Math.max(scrollBottom(el), 1000),
                behavior: smooth ? 'smooth' : 'auto',
            });
        }
    });

    function onContainerScroll(e: any) {
        if (container.current) {
            // If distance from bottom is zero...
            if (scrollBottom(container.current) === 0) {
                // ... the view is scrolled to the bottom
                isScrolledToBottom.current = true;
            }
            // otherwise, if user is scrolling back up...
            else if (prevScrollTop.current > container.current.scrollTop) {
                // ... the view is not scrolled to the bottom
                isScrolledToBottom.current = false;
            }
            // otherwise keep current value. This way the flag will be kept when
            // using animated scroll to scroll to the bottom.

            prevScrollTop.current = container.current.scrollTop;
        }
    }

    return onContainerScroll;
}
