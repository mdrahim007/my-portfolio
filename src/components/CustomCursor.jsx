import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export const CustomCursor = () => {
    const cursorRef = useRef(null);

    useEffect(() => {
        // Accessibility check: only enable custom cursor if motion is fine
        // and we are not on a touch device
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

        if (prefersReducedMotion || isTouchDevice) return;

        const cursor = cursorRef.current;
        if (!cursor) return;

        // Force hide default cursor everywhere
        document.body.style.cursor = 'none';

        // Track cursor position smoothly with GSAP
        // We use quickSetter for high performance tracking
        const xTo = gsap.quickSetter(cursor, 'x', 'px');
        const yTo = gsap.quickSetter(cursor, 'y', 'px');

        const moveCursor = (e) => {
            xTo(e.clientX);
            yTo(e.clientY);
        };

        window.addEventListener('mousemove', moveCursor);

        // Hover Effect Logic
        const handleMouseOver = (e) => {
            // Check if hovering over an interactive element (a, button, input, textarea, or explicitly marked)
            const target = e.target;
            const isInteractive =
                target.tagName.toLowerCase() === 'a' ||
                target.tagName.toLowerCase() === 'button' ||
                target.tagName.toLowerCase() === 'input' ||
                target.tagName.toLowerCase() === 'textarea' ||
                target.closest('a') ||
                target.closest('button') ||
                target.classList.contains('interactive-element');

            if (isInteractive) {
                gsap.to(cursor, {
                    scale: 3,
                    backgroundColor: 'var(--text-primary)', // White
                    mixBlendMode: 'difference', // Creates the "reverse color" effect against light backgrounds
                    duration: 0.3,
                    ease: 'power2.out'
                });
            }
        };

        const handleMouseOut = (e) => {
            const target = e.target;
            const isInteractive =
                target.tagName.toLowerCase() === 'a' ||
                target.tagName.toLowerCase() === 'button' ||
                target.tagName.toLowerCase() === 'input' ||
                target.tagName.toLowerCase() === 'textarea' ||
                target.closest('a') ||
                target.closest('button') ||
                target.classList.contains('interactive-element');

            if (isInteractive) {
                gsap.to(cursor, {
                    scale: 1,
                    backgroundColor: 'rgba(255, 255, 255, 1)',
                    mixBlendMode: 'normal',
                    duration: 0.3,
                    ease: 'power2.out'
                });
            }
        };

        window.addEventListener('mouseover', handleMouseOver);
        window.addEventListener('mouseout', handleMouseOut);

        // Click effect
        const handleMouseDown = () => {
            gsap.to(cursor, { scale: 0.7, duration: 0.1 });
        };
        const handleMouseUp = () => {
            gsap.to(cursor, { scale: 1, duration: 0.2, ease: 'back.out(2)' });
        };

        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            window.removeEventListener('mouseover', handleMouseOver);
            window.removeEventListener('mouseout', handleMouseOut);
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = 'auto'; // Restore default pointer on unmount
        };
    }, []);

    // Only render on desktop (we handle touch device skipping in useEffect)
    return (
        <div
            className="custom-cursor"
            ref={cursorRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '12px',
                height: '12px',
                marginLeft: '-6px', // Center correctly
                marginTop: '-6px',
                backgroundColor: 'rgba(255, 255, 255, 1)',
                borderRadius: '50%',
                mixBlendMode: 'difference',
                pointerEvents: 'none',
                zIndex: 999999,
                transform: 'translate(-100px, -100px)', // Start offscreen
            }}
        />
    );
};
