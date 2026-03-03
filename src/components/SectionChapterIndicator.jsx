import { useEffect, useState, useCallback, useRef } from 'react';

const SECTIONS = [
    { id: 'home', label: '01 — Identity' },
    { id: 'expertise', label: '02 — Expertise' },
    { id: 'work', label: '03 — Work' },
    { id: 'documentation', label: '04 — Documentation' },
    { id: 'reputation', label: '05 — Reputation' },
    { id: 'about', label: '06 — About' },
    { id: 'contact', label: '07 — Contact' },
];

export const SectionChapterIndicator = () => {
    const [activeIdx, setActiveIdx] = useState(0);
    const [displayIdx, setDisplayIdx] = useState(0);
    const [fading, setFading] = useState(false);
    const [visible, setVisible] = useState(false);
    const transitionRef = useRef(null);

    const update = useCallback(() => {
        const scrollTop = window.scrollY;
        setVisible(scrollTop > 200);

        const sectionEls = SECTIONS.map(s => document.getElementById(s.id)).filter(Boolean);
        let current = 0;
        sectionEls.forEach((el, i) => {
            if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.5) {
                current = i;
            }
        });
        setActiveIdx(current);
    }, []);

    // Crossfade when activeIdx changes
    useEffect(() => {
        if (activeIdx === displayIdx) return;
        clearTimeout(transitionRef.current);
        setFading(true);
        transitionRef.current = setTimeout(() => {
            setDisplayIdx(activeIdx);
            setFading(false);
        }, 220);
        return () => clearTimeout(transitionRef.current);
    }, [activeIdx, displayIdx]);

    useEffect(() => {
        window.addEventListener('scroll', update, { passive: true });
        update();
        return () => window.removeEventListener('scroll', update);
    }, [update]);

    return (
        <div
            style={{
                position: 'fixed',
                bottom: '2.2rem',
                left: '2.2rem',
                zIndex: 9000,
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(8px)',
                transition: 'opacity 0.5s ease, transform 0.5s ease',
                pointerEvents: 'none',
            }}
        >
            {/* Glassmorphic pill */}
            <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.6rem',
                padding: '0.45rem 1rem 0.45rem 0.75rem',
                borderRadius: '100px',
                background: 'rgba(8,8,16,0.55)',
                border: '1px solid rgba(190,169,142,0.18)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
            }}>
                {/* Gold accent dot */}
                <span style={{
                    width: '5px',
                    height: '5px',
                    borderRadius: '50%',
                    background: '#D4AF80',
                    boxShadow: '0 0 6px rgba(212,175,128,0.7)',
                    flexShrink: 0,
                    transition: 'background 0.3s ease',
                }} />

                {/* Section label — crossfades */}
                <span style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.68rem',
                    fontWeight: 500,
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    color: 'rgba(190,169,142,0.85)',
                    opacity: fading ? 0 : 1,
                    transform: fading ? 'translateY(4px)' : 'translateY(0)',
                    transition: 'opacity 0.2s ease, transform 0.2s ease',
                    whiteSpace: 'nowrap',
                }}>
                    {SECTIONS[displayIdx].label}
                </span>
            </div>
        </div>
    );
};
