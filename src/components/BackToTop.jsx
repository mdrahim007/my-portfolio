import { useEffect, useState, useCallback } from 'react';

const RADIUS = 22;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export const BackToTop = () => {
    const [visible, setVisible] = useState(false);
    const [progress, setProgress] = useState(0);
    const [hovered, setHovered] = useState(false);

    const handleScroll = useCallback(() => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const pct = docHeight > 0 ? scrollTop / docHeight : 0;

        setProgress(pct);
        setVisible(scrollTop > 220);
    }, []);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    const scrollToTop = () => {
        // Use Lenis if available, otherwise native
        if (window.__lenis) {
            window.__lenis.scrollTo(0, { duration: 1.6, easing: (t) => 1 - Math.pow(1 - t, 4) });
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const strokeOffset = CIRCUMFERENCE - progress * CIRCUMFERENCE;

    return (
        <button
            onClick={scrollToTop}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            aria-label="Back to top"
            style={{
                position: 'fixed',
                bottom: '2.2rem',
                right: '2.2rem',
                zIndex: 9999,
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                border: 'none',
                background: 'transparent',
                padding: 0,
                cursor: 'none',
                // Fade + slide in/out
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0) scale(1)' : 'translateY(12px) scale(0.85)',
                transition: 'opacity 0.4s ease, transform 0.4s ease',
                pointerEvents: visible ? 'auto' : 'none',
            }}
        >
            {/* SVG: progress ring + glass circle */}
            <svg
                width="56" height="56"
                viewBox="0 0 56 56"
                style={{ display: 'block', overflow: 'visible' }}
            >
                {/* Blurred glass background disc */}
                <defs>
                    <filter id="btt-blur">
                        <feGaussianBlur stdDeviation="0" />
                    </filter>
                    <clipPath id="btt-clip">
                        <circle cx="28" cy="28" r="22" />
                    </clipPath>
                </defs>

                {/* Glass disc background */}
                <circle
                    cx="28" cy="28" r="22"
                    fill="rgba(15,15,20,0.55)"
                    stroke="rgba(190,169,142,0.18)"
                    strokeWidth="1"
                    style={{
                        backdropFilter: 'blur(16px)',
                        transition: 'fill 0.3s ease',
                        ...(hovered && { fill: 'rgba(190,169,142,0.12)' })
                    }}
                />

                {/* Track ring (dim) */}
                <circle
                    cx="28" cy="28" r={RADIUS}
                    fill="none"
                    stroke="rgba(190,169,142,0.12)"
                    strokeWidth="2.5"
                />

                {/* Progress arc */}
                <circle
                    cx="28" cy="28" r={RADIUS}
                    fill="none"
                    stroke="#D4AF80"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeDasharray={CIRCUMFERENCE}
                    strokeDashoffset={strokeOffset}
                    transform="rotate(-90 28 28)"
                    style={{ transition: 'stroke-dashoffset 0.15s linear' }}
                />

                {/* Up chevron arrow */}
                <path
                    d="M22 31 L28 24 L34 31"
                    fill="none"
                    stroke={hovered ? '#D4AF80' : 'rgba(250,250,250,0.85)'}
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ transition: 'stroke 0.25s ease' }}
                />
            </svg>
        </button>
    );
};
