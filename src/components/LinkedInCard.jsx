import React, { useState, useEffect, useRef } from 'react';

const LINKEDIN_URL = 'https://www.linkedin.com/in/abrahim007/';

/* ── Animated LinkedIn Icon ── */
const LinkedInIcon = ({ size = 22, color = '#0A66C2' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} aria-hidden="true">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0
        5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966
        0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75
        1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4
        0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
);

/* ── Floating particle dots ── */
const FloatingParticles = () => {
    const particles = Array.from({ length: 6 }, (_, i) => ({
        id: i,
        size: 2 + Math.random() * 3,
        x: 10 + Math.random() * 80,
        y: 10 + Math.random() * 80,
        duration: 4 + Math.random() * 6,
        delay: Math.random() * 3,
        opacity: 0.15 + Math.random() * 0.25,
    }));

    return (
        <>
            <style>{`
                @keyframes linkedin-float {
                    0%, 100% { transform: translateY(0px) scale(1); opacity: var(--p-opacity); }
                    50% { transform: translateY(-12px) scale(1.3); opacity: calc(var(--p-opacity) * 1.5); }
                }
            `}</style>
            {particles.map(p => (
                <div
                    key={p.id}
                    style={{
                        position: 'absolute',
                        width: p.size,
                        height: p.size,
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(190,169,142,0.6), rgba(190,169,142,0.1))',
                        left: `${p.x}%`,
                        top: `${p.y}%`,
                        '--p-opacity': p.opacity,
                        animation: `linkedin-float ${p.duration}s ease-in-out ${p.delay}s infinite`,
                        pointerEvents: 'none',
                        zIndex: 0,
                    }}
                />
            ))}
        </>
    );
};

/* ── Animated border glow ── */
const AnimatedBorderGlow = () => (
    <>
        <style>{`
            @keyframes linkedin-border-glow {
                0%   { background-position: 0% 50%; }
                50%  { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
            }
        `}</style>
        <div style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '24px',
            padding: '1px',
            background: 'linear-gradient(135deg, rgba(190,169,142,0.4), rgba(10,102,194,0.3), rgba(190,169,142,0.15), rgba(10,102,194,0.4))',
            backgroundSize: '300% 300%',
            animation: 'linkedin-border-glow 8s ease infinite',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
            pointerEvents: 'none',
            zIndex: 1,
        }} />
    </>
);

/* ── Pulsing avatar ring ── */
const AvatarRing = () => (
    <>
        <style>{`
            @keyframes linkedin-pulse-ring {
                0%   { transform: scale(1);   opacity: 0.5; }
                50%  { transform: scale(1.15); opacity: 0.15; }
                100% { transform: scale(1);   opacity: 0.5; }
            }
        `}</style>
        <div style={{
            position: 'absolute',
            inset: '-6px',
            borderRadius: '50%',
            border: '1.5px solid rgba(190,169,142,0.35)',
            animation: 'linkedin-pulse-ring 3s ease-in-out infinite',
            pointerEvents: 'none',
        }} />
    </>
);

export const LinkedInCard = () => {
    const [isMobile, setIsMobile] = useState(
        () => typeof window !== 'undefined' && window.innerWidth <= 768
    );
    const [isHovered, setIsHovered] = useState(false);
    const cardRef = useRef(null);

    useEffect(() => {
        const mq = window.matchMedia('(max-width: 768px)');
        const handler = (e) => setIsMobile(e.matches);
        mq.addEventListener('change', handler);
        return () => mq.removeEventListener('change', handler);
    }, []);

    return (
        <div
            ref={cardRef}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                position: 'relative',
                margin: isMobile ? '4rem 0 6rem' : '5rem 0 3rem',
                borderRadius: '24px',
                overflow: 'hidden',
                background: 'rgba(10, 10, 14, 0.65)',
                backdropFilter: 'blur(40px) saturate(200%)',
                WebkitBackdropFilter: 'blur(40px) saturate(200%)',
                boxShadow: isHovered
                    ? '0 20px 60px rgba(0,0,0,0.5), 0 0 80px rgba(190,169,142,0.06), inset 0 1px 0 rgba(255,255,255,0.06)'
                    : '0 12px 48px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)',
                transition: 'box-shadow 0.5s cubic-bezier(0.25,0.46,0.45,0.94), transform 0.4s cubic-bezier(0.25,0.46,0.45,0.94)',
            }}
        >
            {/* Animated gradient border */}
            <AnimatedBorderGlow />

            {/* Floating particles */}
            <FloatingParticles />

            {/* Top shimmer line */}
            <div style={{
                position: 'absolute',
                top: 0, left: '8%', right: '8%', height: '1px',
                background: 'linear-gradient(90deg, transparent, rgba(190,169,142,0.5), rgba(10,102,194,0.3), transparent)',
                pointerEvents: 'none',
                zIndex: 2,
            }} />

            {/* Ambient glow — top right */}
            <div style={{
                position: 'absolute',
                top: '-30%', right: '-5%',
                width: '40%', height: '160%',
                background: 'radial-gradient(ellipse, rgba(190,169,142,0.05) 0%, transparent 60%)',
                pointerEvents: 'none',
                zIndex: 0,
            }} />

            {/* Ambient glow — bottom left */}
            <div style={{
                position: 'absolute',
                bottom: '-30%', left: '-5%',
                width: '35%', height: '140%',
                background: 'radial-gradient(ellipse, rgba(10,102,194,0.04) 0%, transparent 60%)',
                pointerEvents: 'none',
                zIndex: 0,
            }} />

            {/* ── Card body ── */}
            <div style={{
                position: 'relative',
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                alignItems: 'center',
                gap: isMobile ? '2rem' : '0',
                padding: isMobile ? '2.5rem 1.75rem' : '2.5rem 3rem',
                zIndex: 2,
            }}>

                {/* ── Left: Avatar + Identity ── */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.4rem',
                    flex: isMobile ? 'none' : '0 0 auto',
                    width: isMobile ? '100%' : 'auto',
                }}>
                    {/* Glowing avatar */}
                    <div style={{ position: 'relative', flexShrink: 0 }}>
                        <AvatarRing />
                        <div style={{
                            width: '62px',
                            height: '62px',
                            borderRadius: '50%',
                            background: 'linear-gradient(145deg, rgba(190,169,142,0.18) 0%, rgba(10,102,194,0.12) 50%, rgba(190,169,142,0.06) 100%)',
                            border: '1.5px solid rgba(190,169,142,0.3)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 0 30px rgba(190,169,142,0.1), 0 0 15px rgba(10,102,194,0.08), inset 0 1px 0 rgba(255,255,255,0.08)',
                            transition: 'box-shadow 0.4s ease',
                        }}>
                            <LinkedInIcon size={26} />
                        </div>
                    </div>

                    {/* Name & title */}
                    <div>
                        <div style={{
                            fontSize: '0.6rem',
                            fontFamily: 'var(--font-body)',
                            fontWeight: 600,
                            letterSpacing: '0.2em',
                            textTransform: 'uppercase',
                            color: 'var(--accent)',
                            marginBottom: '0.35rem',
                            opacity: 0.85,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                        }}>
                            {/* <span style={{
                                width: '16px',
                                height: '1px',
                                background: 'linear-gradient(90deg, rgba(190,169,142,0.6), transparent)',
                                display: 'inline-block',
                            }} /> */}
                            LinkedIn
                        </div>
                        <h3 style={{
                            fontSize: isMobile ? '1.1rem' : '1.2rem',
                            color: 'var(--text-primary)',
                            letterSpacing: '-0.02em',
                            marginBottom: '0.25rem',
                            lineHeight: 1.25,
                            fontFamily: 'var(--font-heading)',
                            fontWeight: 600,
                            textTransform: 'uppercase'
                        }}>
                            Md. Abdur Rahim
                        </h3>
                        <p style={{
                            fontSize: '0.78rem',
                            color: 'rgba(250,250,250,0.4)',
                            fontFamily: 'var(--font-body)',
                            lineHeight: 1.5,
                            margin: 0,
                            fontStyle: 'italic',
                        }}>
                            Project Coordinator &amp; Support Lead
                        </p>
                    </div>
                </div>

                {/* ── Center: Divider + Tagline ── */}
                {!isMobile && (
                    <div style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '0 2.5rem',
                    }}>
                        {/* Vertical divider with gradient */}
                        <div style={{
                            width: '1px',
                            height: '52px',
                            background: 'linear-gradient(180deg, transparent 0%, rgba(190,169,142,0.25) 50%, transparent 100%)',
                            marginRight: '2.5rem',
                            flexShrink: 0,
                        }} />
                        <p style={{
                            fontSize: '0.88rem',
                            color: 'rgba(250,250,250,0.3)',
                            fontFamily: 'var(--font-heading)',
                            fontStyle: 'italic',
                            lineHeight: 1.65,
                            margin: 0,
                            maxWidth: '28ch',
                            letterSpacing: '0.01em',
                        }}>
                            Open to new opportunities — let's build something great together.
                        </p>
                    </div>
                )}

                {/* ── CTA Button ── */}
                <div style={{ flexShrink: 0, width: isMobile ? '100%' : 'auto' }}>
                    <a
                        href={LINKEDIN_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="interactive-element"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.6rem',
                            padding: '0.85rem 1.8rem',
                            borderRadius: '100px',
                            border: '1px solid rgba(190,169,142,0.3)',
                            background: 'linear-gradient(135deg, rgba(190,169,142,0.08) 0%, rgba(10,102,194,0.06) 100%)',
                            color: 'var(--accent)',
                            fontSize: '0.68rem',
                            fontWeight: 600,
                            fontFamily: 'var(--font-body)',
                            letterSpacing: '0.14em',
                            textTransform: 'uppercase',
                            textDecoration: 'none',
                            transition: 'all 0.4s cubic-bezier(0.25,0.46,0.45,0.94)',
                            whiteSpace: 'nowrap',
                            width: isMobile ? '100%' : 'auto',
                            justifyContent: isMobile ? 'center' : 'flex-start',
                            position: 'relative',
                            overflow: 'hidden',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(190,169,142,0.18) 0%, rgba(10,102,194,0.12) 100%)';
                            e.currentTarget.style.borderColor = 'rgba(190,169,142,0.55)';
                            e.currentTarget.style.boxShadow = '0 0 30px rgba(190,169,142,0.15), 0 0 60px rgba(10,102,194,0.06)';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.color = '#d5c4a8';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(190,169,142,0.08) 0%, rgba(10,102,194,0.06) 100%)';
                            e.currentTarget.style.borderColor = 'rgba(190,169,142,0.3)';
                            e.currentTarget.style.boxShadow = 'none';
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.color = 'var(--accent)';
                        }}
                    >
                        <LinkedInIcon size={13} color="#0A66C2" />
                        Connect on LinkedIn
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="2.5"
                            strokeLinecap="round" strokeLinejoin="round"
                            style={{ transition: 'transform 0.3s ease' }}
                        >
                            <line x1="7" y1="17" x2="17" y2="7" />
                            <polyline points="7 7 17 7 17 17" />
                        </svg>
                    </a>
                </div>
            </div>
        </div>
    );
};
