import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useScrollReveal } from '../hooks/useScrollReveal';

gsap.registerPlugin(ScrollTrigger);

// ─── LinkedIn Post Embed Data ─────────────────────────────────────────────────
// To update these posts:
//   1. Go to any of your LinkedIn posts → click "..." → "Embed this post"
//   2. Copy the src URL from the iframe code block
//   3. Replace the src values below with your real post embed URLs
//
// Current values are placeholder structure to demonstrate the layout.
// Replace with real embed URLs once you have them from LinkedIn's embed feature.
const LINKEDIN_POSTS = [
    {
        id: 'post-1',
        src: 'https://www.linkedin.com/embed/feed/update/urn:li:share:7317490000000000001',
        title: 'LinkedIn Post 1',
        label: 'Featured Insight',
    },
    {
        id: 'post-2',
        src: 'https://www.linkedin.com/embed/feed/update/urn:li:share:7317490000000000002',
        title: 'LinkedIn Post 2',
        label: 'Project Highlight',
    },
    {
        id: 'post-3',
        src: 'https://www.linkedin.com/embed/feed/update/urn:li:share:7437601024959279104?collapsed=1',
        title: 'LinkedIn Post 3',
        label: 'Professional Update',
    },
];

const LINKEDIN_PROFILE_URL = 'https://www.linkedin.com/in/abrahim007/';

// ─── LinkedIn "in" brand icon ─────────────────────────────────────────────────
const LinkedInIcon = ({ size = 20, color = 'currentColor' }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill={color}
        aria-hidden="true"
    >
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
);

// ─── Post Embed Wrapper ───────────────────────────────────────────────────────
const PostEmbed = ({ post, index }) => {
    const [isMobile, setIsMobile] = useState(
        () => typeof window !== 'undefined' && window.innerWidth <= 900
    );

    useEffect(() => {
        const mq = window.matchMedia('(max-width: 900px)');
        const handler = (e) => setIsMobile(e.matches);
        mq.addEventListener('change', handler);
        return () => mq.removeEventListener('change', handler);
    }, []);

    return (
        <div
            className="animate-stagger linkedin-post-card"
            style={{
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                borderRadius: '16px',
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(10,10,12,0.7)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                transition: 'border-color 0.4s ease, transform 0.3s ease, box-shadow 0.4s ease',
                position: 'relative',
                boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(190,169,142,0.3)';
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow =
                    '0 20px 48px rgba(0,0,0,0.5), 0 0 0 1px rgba(190,169,142,0.08) inset';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.3)';
            }}
        >
            {/* ── Top Header Bar ── */}
            <div
                style={{
                    padding: '0.7rem 1rem',
                    borderBottom: '1px solid rgba(255,255,255,0.07)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    background: 'rgba(8,8,10,0.9)',
                    flexShrink: 0,
                }}
            >
                {/* Pulsing live dot */}
                <span style={{
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    background: '#0A66C2',
                    boxShadow: '0 0 6px rgba(10,102,194,0.7)',
                    flexShrink: 0,
                    animation: 'li-pulse 2.5s ease-in-out infinite',
                }} />
                <LinkedInIcon size={13} color="#0A66C2" />
                <span
                    style={{
                        fontSize: '0.6rem',
                        fontWeight: 600,
                        letterSpacing: '0.14em',
                        textTransform: 'uppercase',
                        color: 'rgba(250,250,250,0.45)',
                        fontFamily: 'var(--font-body)',
                    }}
                >
                    {post.label}
                </span>
                <span
                    style={{
                        marginLeft: 'auto',
                        fontSize: '0.6rem',
                        color: 'rgba(250,250,250,0.2)',
                        fontFamily: 'var(--font-body)',
                        letterSpacing: '0.04em',
                    }}
                >
                    linkedin.com
                </span>
            </div>

            {/* ── iframe (natural colors, white LinkedIn bg) ── */}
            <div
                style={{
                    flex: 1,
                    minHeight: isMobile ? '420px' : '480px',
                    overflow: 'hidden',
                    position: 'relative',
                    /* Subtle rounded clip so white doesn't bleed to card corners */
                    borderRadius: '0',
                }}
            >
                <iframe
                    src={post.src}
                    title={post.title}
                    loading="lazy"
                    allowFullScreen
                    style={{
                        width: '100%',
                        height: '100%',
                        border: 'none',
                        display: 'block',
                        position: 'absolute',
                        inset: 0,
                    }}
                />
            </div>

            {/* ── Bottom Footer Strip ── */}
            <div
                style={{
                    padding: '0.6rem 1rem',
                    borderTop: '1px solid rgba(255,255,255,0.07)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'rgba(8,8,10,0.9)',
                    flexShrink: 0,
                }}
            >
                <span style={{
                    fontSize: '0.58rem',
                    color: 'rgba(250,250,250,0.2)',
                    fontFamily: 'var(--font-body)',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                }}
                >
                    Embedded via LinkedIn
                </span>
                <a
                    href={LINKEDIN_PROFILE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                        fontSize: '0.58rem',
                        color: '#5B9BD5',
                        fontFamily: 'var(--font-body)',
                        letterSpacing: '0.08em',
                        textDecoration: 'none',
                        textTransform: 'uppercase',
                        fontWeight: 600,
                        opacity: 0.8,
                        transition: 'opacity 0.2s ease',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.opacity = '1'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.8'; }}
                >
                    View on LinkedIn ↗
                </a>
            </div>
        </div>
    );
};

// ─── Main Component ──────────────────────────────────────────────────────────
export const LinkedInInsights = () => {
    const sectionRef = useRef(null);
    const postsRef = useRef(null);
    const ctaRef = useRef(null);

    const [isMobile, setIsMobile] = useState(
        () => typeof window !== 'undefined' && window.innerWidth <= 900
    );

    useEffect(() => {
        const mq = window.matchMedia('(max-width: 900px)');
        const handler = (e) => setIsMobile(e.matches);
        mq.addEventListener('change', handler);
        return () => mq.removeEventListener('change', handler);
    }, []);

    // Scroll-triggered reveals for eyebrow, heading, stagger items
    useScrollReveal(sectionRef);

    // GSAP scroll animations for the posts grid
    useEffect(() => {
        const prefersReducedMotion = window.matchMedia(
            '(prefers-reduced-motion: reduce)'
        ).matches;
        if (prefersReducedMotion) return;

        const ctx = gsap.context(() => {
            // Profile card entrance
            const profileCard = sectionRef.current?.querySelector('.li-profile-card');
            if (profileCard) {
                gsap.fromTo(
                    profileCard,
                    { y: 40, opacity: 0, scale: 0.97 },
                    {
                        y: 0,
                        opacity: 1,
                        scale: 1,
                        duration: 0.9,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: profileCard,
                            start: 'top 85%',
                            toggleActions: 'play none none none',
                        },
                    }
                );
            }

            // Posts grid stagger
            if (postsRef.current) {
                gsap.fromTo(
                    postsRef.current.querySelectorAll('.linkedin-post-card'),
                    { y: 60, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 0.85,
                        stagger: 0.18,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: postsRef.current,
                            start: 'top 80%',
                            toggleActions: 'play none none none',
                        },
                    }
                );
            }

            // CTA banner
            if (ctaRef.current) {
                gsap.fromTo(
                    ctaRef.current,
                    { y: 30, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 0.8,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: ctaRef.current,
                            start: 'top 88%',
                            toggleActions: 'play none none none',
                        },
                    }
                );
            }
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            id="insights"
            ref={sectionRef}
            className="section-padding"
            style={{
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Ambient glow backdrop */}
            <div
                style={{
                    position: 'absolute',
                    top: '10%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '70%',
                    height: '50%',
                    background:
                        'radial-gradient(ellipse, rgba(10, 102, 194, 0.06) 0%, transparent 70%)',
                    filter: 'blur(80px)',
                    pointerEvents: 'none',
                    zIndex: 0,
                }}
            />

            <div className="global-container" style={{ position: 'relative', zIndex: 1 }}>

                {/* ── Section Header ── */}
                <div style={{ marginBottom: isMobile ? '2rem' : '3rem' }}>
                    <span className="eyebrow-pill animate-eyebrow">07 — Insights</span>

                    <h2
                        className="animate-heading"
                        style={{
                            fontSize: 'clamp(2rem, 4.2vw, 3.8rem)',
                            marginTop: 0,
                            marginBottom: '1rem',
                            color: 'var(--text-primary)',
                            letterSpacing: '-0.03em',
                            lineHeight: 1.08,
                        }}
                    >
                        LinkedIn{' '}
                        <span
                            style={{
                                color: 'var(--accent)',
                                fontStyle: 'italic',
                                fontWeight: 400,
                            }}
                        >
                            Insights.
                        </span>
                    </h2>

                    <p
                        className="animate-heading"
                        style={{
                            color: 'rgba(250,250,250,0.55)',
                            fontSize: isMobile ? '0.95rem' : '1.05rem',
                            lineHeight: 1.75,
                            maxWidth: '56ch',
                            marginBottom: 0,
                        }}
                    >
                        Thoughts on project management, IT service delivery, and digital
                        transformation — straight from my professional network.
                    </p>
                </div>

                {/* ── Profile Card ── */}
                <div
                    className="li-profile-card glass-card"
                    style={{
                        padding: isMobile ? '1.5rem' : '1.75rem 2rem',
                        marginBottom: isMobile ? '2rem' : '3rem',
                        display: 'flex',
                        flexDirection: isMobile ? 'column' : 'row',
                        alignItems: isMobile ? 'flex-start' : 'center',
                        gap: '1.5rem',
                        border: '1px solid rgba(255,255,255,0.08)',
                        position: 'relative',
                        overflow: 'hidden',
                    }}
                >
                    {/* Corner accent */}
                    <div
                        style={{
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            width: '25%',
                            height: '100%',
                            background:
                                'radial-gradient(ellipse at top right, rgba(10,102,194,0.08) 0%, transparent 70%)',
                            pointerEvents: 'none',
                        }}
                    />

                    {/* Avatar placeholder — LinkedIn blue circle */}
                    <div
                        style={{
                            width: isMobile ? '52px' : '64px',
                            height: isMobile ? '52px' : '64px',
                            borderRadius: '50%',
                            background:
                                'linear-gradient(135deg, rgba(10,102,194,0.35) 0%, rgba(10,102,194,0.12) 100%)',
                            border: '1.5px solid rgba(10,102,194,0.35)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            boxShadow: '0 0 24px rgba(10,102,194,0.18)',
                        }}
                    >
                        <LinkedInIcon size={28} color="#0A66C2" />
                    </div>

                    {/* Profile info */}
                    <div style={{ flex: 1 }}>
                        <h3
                            style={{
                                fontSize: isMobile ? '1.05rem' : '1.2rem',
                                color: 'var(--text-primary)',
                                letterSpacing: '-0.01em',
                                marginBottom: '0.3rem',
                            }}
                        >
                            Md. Abdur Rahim
                        </h3>
                        <p
                            style={{
                                fontSize: '0.85rem',
                                color: 'rgba(250,250,250,0.5)',
                                fontFamily: 'var(--font-body)',
                                lineHeight: 1.6,
                                marginBottom: '0.65rem',
                            }}
                        >
                            Project Coordinator &amp; IT Service Delivery Specialist
                        </p>
                        <div
                            style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: '0.5rem',
                            }}
                        >
                            {['Project Management', 'ITSM', 'Digital Transformation'].map(
                                (tag) => (
                                    <span
                                        key={tag}
                                        style={{
                                            fontSize: '0.62rem',
                                            fontFamily: 'var(--font-body)',
                                            fontWeight: 500,
                                            letterSpacing: '0.1em',
                                            textTransform: 'uppercase',
                                            color: 'rgba(190,169,142,0.75)',
                                            padding: '0.25rem 0.65rem',
                                            borderRadius: '100px',
                                            border: '1px solid rgba(190,169,142,0.18)',
                                            background: 'rgba(190,169,142,0.06)',
                                        }}
                                    >
                                        {tag}
                                    </span>
                                )
                            )}
                        </div>
                    </div>

                    {/* View Profile CTA */}
                    <a
                        href={LINKEDIN_PROFILE_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="interactive-element"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.55rem',
                            padding: isMobile ? '0.65rem 1.2rem' : '0.75rem 1.5rem',
                            borderRadius: '100px',
                            border: '1px solid rgba(10,102,194,0.4)',
                            background: 'rgba(10,102,194,0.1)',
                            color: '#5B9BD5',
                            fontSize: '0.72rem',
                            fontWeight: 600,
                            fontFamily: 'var(--font-body)',
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase',
                            textDecoration: 'none',
                            transition: 'all 0.3s ease',
                            whiteSpace: 'nowrap',
                            flexShrink: 0,
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(10,102,194,0.22)';
                            e.currentTarget.style.borderColor = 'rgba(10,102,194,0.7)';
                            e.currentTarget.style.boxShadow = '0 0 20px rgba(10,102,194,0.2)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(10,102,194,0.1)';
                            e.currentTarget.style.borderColor = 'rgba(10,102,194,0.4)';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                    >
                        <LinkedInIcon size={14} color="#5B9BD5" />
                        View Full Profile
                    </a>
                </div>

                {/* ── Post Embeds Grid ── */}
                <div
                    ref={postsRef}
                    style={{
                        display: 'grid',
                        gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
                        gap: isMobile ? '1.5rem' : '1.25rem',
                        marginBottom: isMobile ? '2.5rem' : '3.5rem',
                    }}
                >
                    {LINKEDIN_POSTS.map((post, index) => (
                        <PostEmbed key={post.id} post={post} index={index} />
                    ))}
                </div>

                {/* ── CTA Banner ── */}
                <div
                    ref={ctaRef}
                    style={{
                        display: 'flex',
                        flexDirection: isMobile ? 'column' : 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '1.5rem',
                        padding: isMobile ? '1.75rem 1.5rem' : '1.75rem 2.5rem',
                        borderRadius: '20px',
                        background:
                            'linear-gradient(135deg, rgba(10,102,194,0.07) 0%, rgba(255,255,255,0.012) 100%)',
                        border: '1px solid rgba(10,102,194,0.18)',
                        position: 'relative',
                        overflow: 'hidden',
                    }}
                >
                    {/* Left edge glow */}
                    <div
                        style={{
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            bottom: 0,
                            width: '3px',
                            background:
                                'linear-gradient(180deg, transparent, rgba(10,102,194,0.6), transparent)',
                            borderRadius: '0 0 0 20px',
                        }}
                    />

                    <div style={{ textAlign: isMobile ? 'center' : 'left' }}>
                        <p
                            style={{
                                fontSize: isMobile ? '1.05rem' : '1.15rem',
                                color: 'var(--text-primary)',
                                fontFamily: 'var(--font-heading)',
                                letterSpacing: '-0.01em',
                                marginBottom: '0.25rem',
                                lineHeight: 1.4,
                            }}
                        >
                            Let's connect on{' '}
                            <span style={{ color: '#5B9BD5', fontStyle: 'italic' }}>
                                LinkedIn.
                            </span>
                        </p>
                        <p
                            style={{
                                fontSize: '0.85rem',
                                color: 'rgba(250,250,250,0.45)',
                                fontFamily: 'var(--font-body)',
                                lineHeight: 1.6,
                            }}
                        >
                            Follow for project management insights, IT leadership content, and
                            professional updates.
                        </p>
                    </div>

                    <a
                        href={LINKEDIN_PROFILE_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="interactive-element"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.6rem',
                            padding: '0.85rem 2rem',
                            borderRadius: '100px',
                            border: '1px solid rgba(10,102,194,0.45)',
                            background: 'rgba(10,102,194,0.14)',
                            color: '#5B9BD5',
                            fontSize: '0.78rem',
                            fontWeight: 600,
                            fontFamily: 'var(--font-body)',
                            letterSpacing: '0.12em',
                            textTransform: 'uppercase',
                            textDecoration: 'none',
                            transition: 'all 0.3s ease',
                            whiteSpace: 'nowrap',
                            flexShrink: 0,
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(10,102,194,0.28)';
                            e.currentTarget.style.borderColor = 'rgba(10,102,194,0.75)';
                            e.currentTarget.style.boxShadow = '0 0 28px rgba(10,102,194,0.25)';
                            e.currentTarget.style.transform = 'translateY(-1px)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(10,102,194,0.14)';
                            e.currentTarget.style.borderColor = 'rgba(10,102,194,0.45)';
                            e.currentTarget.style.boxShadow = 'none';
                            e.currentTarget.style.transform = 'translateY(0)';
                        }}
                    >
                        <LinkedInIcon size={16} color="#5B9BD5" />
                        Connect with Me
                        <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <line x1="7" y1="17" x2="17" y2="7" />
                            <polyline points="7 7 17 7 17 17" />
                        </svg>
                    </a>
                </div>
            </div>

            {/* ── Mobile responsive styles ── */}
            <style>{`
                @keyframes li-pulse {
                    0%, 100% { opacity: 1; box-shadow: 0 0 6px rgba(10,102,194,0.7); }
                    50%       { opacity: 0.5; box-shadow: 0 0 12px rgba(10,102,194,0.3); }
                }
                #insights .linkedin-post-card {
                    min-height: 320px;
                }
                @media (max-width: 900px) {
                    #insights.section-padding {
                        padding: 4rem 5% !important;
                    }
                }
                @media (max-width: 480px) {
                    #insights.section-padding {
                        padding: 3rem 5% !important;
                    }
                }
            `}</style>
        </section>
    );
};
