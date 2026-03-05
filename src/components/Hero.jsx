import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { CVModal } from './CVModal';

export const Hero = () => {
    const containerRef = useRef(null);
    const headlineRef = useRef(null);
    const subtitleRef = useRef(null);
    const summaryRef = useRef(null);
    const buttonRef = useRef(null);
    const imageRef = useRef(null);
    const imageColRef = useRef(null);
    const [cvOpen, setCvOpen] = useState(false);

    const TITLES = [
        'Project Coordinator @ myGov ITSM',
        'Support Manager @ myGov ITSM',
    ];
    const [displayText, setDisplayText] = useState('');
    const [titleIdx, setTitleIdx] = useState(0);
    const [phase, setPhase] = useState('typing'); // 'typing' | 'pausing' | 'deleting' | 'between'

    useEffect(() => {
        const target = TITLES[titleIdx];
        let timeout;

        if (phase === 'typing') {
            if (displayText.length < target.length) {
                timeout = setTimeout(() => {
                    setDisplayText(target.slice(0, displayText.length + 1));
                }, 55);
            } else {
                // Finished typing — pause before deleting
                timeout = setTimeout(() => setPhase('deleting'), 3000);
            }
        } else if (phase === 'deleting') {
            if (displayText.length > 0) {
                timeout = setTimeout(() => {
                    setDisplayText(prev => prev.slice(0, -1));
                }, 35);
            } else {
                // Finished deleting — brief pause then next title
                timeout = setTimeout(() => {
                    setTitleIdx(prev => (prev + 1) % TITLES.length);
                    setPhase('typing');
                }, 500);
            }
        }

        return () => clearTimeout(timeout);
    }, [displayText, phase, titleIdx]);

    useEffect(() => {
        // Accessibility check wrapper
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        const ctx = gsap.context(() => {
            if (!prefersReducedMotion) {
                if (headlineRef.current) {
                    headlineRef.current.style.opacity = 1; // Make parent visible
                    const lines = headlineRef.current.querySelectorAll('.reveal-text-line');
                    gsap.set(lines, { y: 35, opacity: 0 });

                    const tl = gsap.timeline();

                    // Reveal line by line
                    tl.to(lines, {
                        y: 0,
                        opacity: 1,
                        duration: 1.1,
                        stagger: 0.18,
                        ease: 'power3.out',
                        delay: 0.2,
                    })
                        // Fade in subtitle, summary, and button sequentially
                        .fromTo(
                            [subtitleRef.current, summaryRef.current, buttonRef.current],
                            { opacity: 0, y: 15 },
                            { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: 'power3.out' },
                            '-=0.4'
                        );
                }

                // ── Scroll-exit scrub: hero content drifts upward + fades as you scroll away
                const contentEl = containerRef.current.querySelector('.hero-content-block');
                if (contentEl) {
                    gsap.to(contentEl, {
                        y: -80,
                        opacity: 0,
                        ease: 'power1.in',
                        scrollTrigger: {
                            trigger: containerRef.current,
                            start: 'top top',
                            end: '50% top',
                            scrub: 1.5,
                        },
                    });
                }

                // ── Photo float loop (imageRef only — no scroll scrub here)
                if (imageRef.current) {
                    gsap.to(imageRef.current, {
                        y: '-=12',
                        duration: 3,
                        ease: 'sine.inOut',
                        yoyo: true,
                        repeat: -1
                    });
                }

                // ── Scroll parallax on the outer COLUMN wrapper (separate from float)
                // Using fromTo with absolute values so it never compounds
                if (imageColRef.current) {
                    gsap.fromTo(imageColRef.current,
                        { y: 0 },
                        {
                            y: -35,
                            ease: 'none',
                            scrollTrigger: {
                                trigger: containerRef.current,
                                start: 'top top',
                                end: 'bottom top',
                                scrub: 2,
                            },
                        }
                    );
                }
            } else {
                // Fallback if reduced motion is enabled
                if (headlineRef.current) headlineRef.current.style.opacity = 1;
                if (subtitleRef.current) subtitleRef.current.style.opacity = 1;
                if (summaryRef.current) summaryRef.current.style.opacity = 1;
                if (buttonRef.current) buttonRef.current.style.opacity = 1;
                if (imageRef.current) imageRef.current.style.opacity = 1;
            }
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <>
            <section
                id="home"
                ref={containerRef}
                style={{
                    zIndex: 10,
                    paddingTop: 'var(--section-padding)',
                    paddingBottom: 'var(--section-padding)'
                }}
            >


                {/* Split Screen Layout */}
                <div className="hero-grid global-container">
                    {/* Left Side: Text Content */}
                    <div className="hero-content-block" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {/* Section eyebrow */}
                        <span className="eyebrow-pill" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent)' }}></span>
                            Hello, I’m Md. Abdur Rahim
                        </span>

                        <h1
                            ref={headlineRef}
                            style={{
                                fontSize: 'clamp(2.4rem, 4.5vw, 5rem)',
                                margin: 0,
                                letterSpacing: '-0.03em',
                                lineHeight: 1.05,
                                color: 'var(--text-primary)',
                                opacity: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 1 : 0
                            }}
                        >
                            <div className="reveal-text-line">Leading IT projects</div>
                            <div className="reveal-text-line" style={{ marginTop: '0.1rem' }}>and
                                <span style={{ color: 'var(--accent)', fontStyle: 'italic', fontWeight: 400 }}> reliable support.</span>
                            </div>
                        </h1>

                        <h2
                            ref={subtitleRef}
                            style={{
                                fontSize: 'clamp(1rem, 1.4vw, 1.25rem)',
                                color: '#bea98e',
                                fontWeight: 400,
                                fontFamily: 'var(--font-body)',
                                letterSpacing: '0.08em',
                                lineHeight: 1.5,
                                opacity: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 1 : 0
                            }}
                        >
                            {displayText}
                            <span style={{
                                display: 'inline-block',
                                width: '2px',
                                height: '1em',
                                backgroundColor: '#bea98e',
                                marginLeft: '3px',
                                verticalAlign: 'middle',
                                borderRadius: '1px',
                                animation: 'cursorBlink 0.9s step-end infinite',
                            }} />
                        </h2>
                        <style>{`
                        @keyframes cursorBlink {
                            0%, 100% { opacity: 1; }
                            50% { opacity: 0; }
                        }
                    `}</style>

                        <p
                            ref={summaryRef}
                            style={{
                                fontSize: 'clamp(0.95rem, 1.3vw, 1.1rem)',
                                color: 'rgba(250,250,250,0.55)',
                                lineHeight: 1.7,
                                maxWidth: '55ch',
                                fontWeight: 400,
                                opacity: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 1 : 0
                            }}
                        >
                            As a Project Coordinator and Support Manager, I lead the implementation and support teams for the national myGov ITSM project. We help government agencies adopt this solution while ensuring stable operations and reliable support for all our stakeholders.
                        </p>

                        <div className="hero-cta-row" style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                            <a
                                href="#work"
                                ref={buttonRef}
                                className="interactive-element"
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    background: 'transparent',
                                    border: '1px solid #bea98e',
                                    color: '#bea98e',
                                    padding: '0',
                                    height: '3.5rem',
                                    width: '14rem',
                                    fontSize: '0.8rem',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.2em',
                                    fontWeight: 600,
                                    textDecoration: 'none',
                                    transition: 'all 0.3s ease',
                                    cursor: 'none',
                                    borderRadius: '4px',
                                    boxSizing: 'border-box',
                                    opacity: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 1 : 0
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.background = '#bea98e';
                                    e.currentTarget.style.color = '#0c0c0c';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.background = 'transparent';
                                    e.currentTarget.style.color = '#bea98e';
                                }}
                            >
                                View My Impact
                            </a>

                            {/* View CV — opens full-screen modal */}
                            <button
                                onClick={() => setCvOpen(true)}
                                className="interactive-element"
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem',
                                    background: 'rgba(190,169,142,0.06)',
                                    border: '1px solid rgba(190,169,142,0.25)',
                                    backdropFilter: 'blur(8px)',
                                    color: 'rgba(250,250,250,0.7)',
                                    padding: '0',
                                    height: '3.5rem',
                                    width: '14rem',
                                    fontSize: '0.8rem',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.2em',
                                    fontWeight: 600,
                                    borderRadius: '4px',
                                    transition: 'all 0.3s ease',
                                    cursor: 'none',
                                    boxSizing: 'border-box',
                                    opacity: 1,
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.background = 'rgba(190,169,142,0.14)';
                                    e.currentTarget.style.color = '#bea98e';
                                    e.currentTarget.style.borderColor = 'rgba(190,169,142,0.5)';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.background = 'rgba(190,169,142,0.06)';
                                    e.currentTarget.style.color = 'rgba(250,250,250,0.7)';
                                    e.currentTarget.style.borderColor = 'rgba(190,169,142,0.25)';
                                }}
                            >
                                {/* Eye / view icon */}
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                    <circle cx="12" cy="12" r="3" />
                                </svg>
                                View CV
                            </button>
                        </div>
                    </div>

                    {/* Right Side: Headshot — overflow:hidden clips any parallax drift from going above nav */}
                    <div
                        ref={imageColRef}
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            overflow: 'hidden',
                            paddingTop: '1rem',
                            paddingBottom: '1rem',
                            willChange: 'transform',
                        }}
                    >
                        <div
                            ref={imageRef}
                            style={{
                                position: 'relative',
                                width: '100%',
                                maxWidth: '460px',
                                aspectRatio: '3/4',
                                borderRadius: '20px',
                                overflow: 'hidden',
                                backgroundColor: 'var(--bg-surface)',
                                border: '1px solid rgba(190,169,142,0.25)',
                                boxShadow: '0 0 0 1px rgba(190,169,142,0.12), 0 32px 64px rgba(0,0,0,0.6), 0 0 80px rgba(190,169,142,0.06)'
                            }}
                        >
                            <img
                                src="/my_photo.jpg"
                                alt="Md Abdur Rahim - Support Manager"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Scroll indicator arrow — hidden on mobile via CSS class */}
                <div className="hero-scroll-indicator" style={{
                    position: 'absolute',
                    bottom: '2rem',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.4rem',
                    opacity: 0.4,
                    animation: 'scrollBob 2s ease-in-out infinite'
                }}>
                    <span style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'var(--font-body)', color: 'var(--text-primary)' }}>Scroll</span>
                    <svg width="16" height="24" viewBox="0 0 16 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M8 4 L8 20 M3 15 L8 20 L13 15" />
                    </svg>
                </div>

                {/* Mobile Responsive overrides */}
                <style dangerouslySetInnerHTML={{
                    __html: `
                @keyframes scrollBob {
                    0%, 100% { transform: translateX(-50%) translateY(0); }
                    50% { transform: translateX(-50%) translateY(6px); }
                }
                @media (max-width: 900px) {
                    #home {
                        padding-top: 6.5rem !important;
                        padding-bottom: 3rem !important;
                    }
                    .hero-grid {
                        grid-template-columns: 1fr !important;
                        text-align: center;
                        gap: 1.5rem !important;
                        padding: 0 6% !important;
                    }
                    .hero-grid > div:first-child {
                        align-items: center;
                        order: 2;
                    }
                    .hero-grid .eyebrow-pill {
                        align-self: center;
                    }
                    .hero-grid > div:last-child {
                        order: 1;
                        max-height: 340px;
                        overflow: hidden;
                    }
                    .hero-grid > div:last-child > div {
                        max-width: 260px !important;
                        aspect-ratio: 3/4 !important;
                        margin: 0 auto;
                    }
                    .hero-grid h1 {
                        font-size: clamp(1.8rem, 8vw, 2.4rem) !important;
                    }
                    .hero-grid h2 {
                        font-size: 0.82rem !important;
                    }
                    .hero-grid p {
                        margin: 0 auto;
                        max-width: 100% !important;
                        font-size: 0.88rem !important;
                        line-height: 1.65 !important;
                    }
                    .hero-cta-row {
                        flex-direction: column !important;
                        width: 100%;
                        gap: 0.75rem !important;
                    }
                    .hero-cta-row a,
                    .hero-cta-row button {
                        width: 100% !important;
                        padding: 0.9rem 1.5rem !important;
                        text-align: center;
                        justify-content: center;
                        font-size: 0.72rem !important;
                    }
                    .hero-scroll-indicator {
                        display: none !important;
                    }
                }

                @media (max-width: 480px) {
                    .hero-grid h1 {
                        font-size: 1.7rem !important;
                    }
                    .hero-grid > div:last-child {
                        max-height: 300px;
                    }
                    .hero-grid > div:last-child > div {
                        max-width: 220px !important;
                    }
                }
            `}} />
            </section>
            <CVModal open={cvOpen} onClose={() => setCvOpen(false)} />
        </>
    );
};
