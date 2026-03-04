import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useScrollReveal } from '../hooks/useScrollReveal';

gsap.registerPlugin(ScrollTrigger);

const STATS = [
    { value: '5+', label: 'Years Experience' },
    { value: '75+', label: 'Team Members' },
    { value: '98%', label: 'SLA Compliance' },
];

export const About = () => {
    const sectionRef = useRef(null);
    const photoRef = useRef(null);
    const textContainerRef = useRef(null);
    const statsRef = useRef(null);

    /* ── Mobile detection ──────────────────────────────────── */
    const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth <= 900);
    useEffect(() => {
        const mq = window.matchMedia('(max-width: 900px)');
        const handler = (e) => setIsMobile(e.matches);
        mq.addEventListener('change', handler);
        return () => mq.removeEventListener('change', handler);
    }, []);

    // Shared scroll reveals for eyebrow, heading, stagger items
    useScrollReveal(sectionRef);

    useEffect(() => {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) return;

        const ctx = gsap.context(() => {
            // ── Premium Photo Subtle Zoom ──
            if (photoRef.current) {
                gsap.fromTo(
                    photoRef.current,
                    { scale: 1.06 },
                    {
                        scale: 1,
                        ease: 'none',
                        scrollTrigger: {
                            trigger: sectionRef.current,
                            start: 'top bottom',
                            end: 'bottom top',
                            scrub: 1.5,
                        },
                    }
                );
            }

            // ── Text paragraphs stagger ──
            if (textContainerRef.current) {
                const paragraphs = textContainerRef.current.querySelectorAll('.about-text-block');
                gsap.fromTo(
                    paragraphs,
                    { opacity: 0, y: 35 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.9,
                        stagger: 0.15,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: textContainerRef.current,
                            start: 'top 75%',
                            toggleActions: 'play none none none',
                        },
                    }
                );
            }

            // ── Stats counter animation ──
            if (statsRef.current) {
                gsap.fromTo(
                    statsRef.current.querySelectorAll('.about-stat-item'),
                    { opacity: 0, y: 25, scale: 0.95 },
                    {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        duration: 0.7,
                        stagger: 0.12,
                        ease: 'back.out(1.4)',
                        scrollTrigger: {
                            trigger: statsRef.current,
                            start: 'top 80%',
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
            id="about"
            ref={sectionRef}
            className="section-padding"
            style={{
                minHeight: isMobile ? 'auto' : '100vh',
                position: 'relative',
                zIndex: 10,
            }}
        >
            <div className="about-layout global-container" style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : '0.45fr 0.55fr',
                gap: isMobile ? '2.5rem' : '4rem',
                alignItems: isMobile ? 'center' : 'stretch',
            }}>
                {/* ── Left: Premium Photo Frame ── */}
                <div className="about-photo-wrapper" style={{
                    position: 'relative',
                    height: '100%',
                    order: isMobile ? -1 : 0,
                }}>
                    {/* Decorative accent glow behind photo */}
                    <div style={{
                        position: 'absolute',
                        top: isMobile ? '-8%' : '-10%',
                        left: isMobile ? '-5%' : '-8%',
                        width: isMobile ? '60%' : '55%',
                        height: isMobile ? '60%' : '55%',
                        background: 'radial-gradient(ellipse, rgba(190, 169, 142, 0.15) 0%, transparent 70%)',
                        borderRadius: '50%',
                        filter: 'blur(40px)',
                        pointerEvents: 'none',
                        zIndex: 0,
                    }} />

                    {/* Decorative corner accent */}
                    <div style={{
                        position: 'absolute',
                        bottom: isMobile ? '-6px' : '-10px',
                        right: isMobile ? '-6px' : '-10px',
                        width: isMobile ? '50%' : '45%',
                        height: isMobile ? '50%' : '45%',
                        border: '1px solid rgba(190, 169, 142, 0.2)',
                        borderRadius: isMobile ? '16px' : '24px',
                        borderTop: 'none',
                        borderLeft: 'none',
                        pointerEvents: 'none',
                        zIndex: 0,
                    }} />

                    {/* Photo container */}
                    <div style={{
                        position: 'relative',
                        width: '100%',
                        height: '100%',
                        borderRadius: isMobile ? '16px' : '24px',
                        overflow: 'hidden',
                        zIndex: 1,
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        boxShadow: `
                            0 25px 60px rgba(0, 0, 0, 0.5),
                            0 0 0 1px rgba(190, 169, 142, 0.08) inset,
                            0 0 80px rgba(190, 169, 142, 0.04)
                        `,
                    }}>
                        <img
                            ref={photoRef}
                            src="/my_photo2.jpg"
                            alt="Md Abdur Rahim — Professional Photo"
                            style={{
                                display: 'block',
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                objectPosition: 'center top',
                                willChange: isMobile ? 'auto' : 'transform',
                            }}
                        />

                        {/* Subtle gradient overlay for editorial depth */}
                        <div style={{
                            position: 'absolute',
                            inset: 0,
                            background: `linear-gradient(
                                180deg,
                                transparent 50%,
                                rgba(12, 12, 12, 0.35) 100%
                            )`,
                            pointerEvents: 'none',
                        }} />

                        {/* Top-edge light reflection */}
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: '1px',
                            background: 'linear-gradient(90deg, transparent, rgba(190, 169, 142, 0.35), transparent)',
                            pointerEvents: 'none',
                        }} />
                    </div>

                    {/* Floating experience badge */}
                    <div style={{
                        position: 'absolute',
                        bottom: isMobile ? '12px' : '20px',
                        left: isMobile ? '12px' : '20px',
                        zIndex: 2,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: isMobile ? '0.5rem 0.85rem' : '0.6rem 1rem',
                        background: 'rgba(12, 12, 12, 0.65)',
                        backdropFilter: 'blur(16px) saturate(180%)',
                        WebkitBackdropFilter: 'blur(16px) saturate(180%)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '12px',
                    }}>
                        <span style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: '#4ade80',
                            boxShadow: '0 0 8px rgba(74, 222, 128, 0.4)',
                            animation: 'pulse-dot 2s ease-in-out infinite',
                        }} />
                        <span style={{
                            fontSize: '0.72rem',
                            fontWeight: 500,
                            letterSpacing: '0.08em',
                            color: 'rgba(250, 250, 250, 0.85)',
                            fontFamily: 'var(--font-body)',
                        }}>
                            Available for opportunities
                        </span>
                    </div>
                </div>

                {/* ── Right: Editorial Text Content ── */}
                <div ref={textContainerRef} style={{
                    order: isMobile ? 1 : 0,
                }}>
                    <span className="eyebrow-pill animate-eyebrow">06 — About</span>

                    <h2
                        className="animate-heading"
                        style={{
                            fontSize: 'clamp(2.2rem, 4.5vw, 3.5rem)',
                            marginBottom: '0.5rem',
                            color: 'var(--text-primary)',
                            letterSpacing: '-0.03em',
                            lineHeight: 1.1,
                        }}
                    >
                        Bridging Systems <br />&amp; Support
                    </h2>

                    {/* Accent flourish divider */}
                    <div className="about-text-block" style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        marginBottom: isMobile ? '1.5rem' : '2rem',
                    }}>
                        <div style={{
                            width: '32px',
                            height: '2px',
                            background: 'linear-gradient(90deg, var(--accent), transparent)',
                            borderRadius: '2px',
                        }} />
                        <span style={{
                            fontSize: '0.78rem',
                            fontWeight: 500,
                            letterSpacing: '0.15em',
                            textTransform: 'uppercase',
                            color: 'var(--accent)',
                            opacity: 0.9,
                        }}>
                            Professional Summary
                        </span>
                    </div>

                    <p className="about-text-block" style={{
                        fontSize: isMobile ? '0.95rem' : '1.05rem',
                        color: 'rgba(250,250,250,0.65)',
                        marginBottom: '1.25rem',
                        lineHeight: 1.8,
                        maxWidth: '55ch',
                    }}>
                        With over 5 years of experience in the IT Support domain, I currently lead
                        the Support and Implementation team for the myGov ITSM project. My focus is
                        on architecting environments where rapid resolution and strict Service Level
                        Agreements (SLAs) are consistently met.
                    </p>

                    <p className="about-text-block" style={{
                        fontSize: isMobile ? '0.95rem' : '1.05rem',
                        color: 'rgba(250,250,250,0.65)',
                        marginBottom: '1.25rem',
                        lineHeight: 1.8,
                        maxWidth: '55ch',
                    }}>
                        Beyond day-to-day team leadership, I oversee the deployment of ITSM scalable
                        solutions, analyze complex client requirements for system optimization, and
                        execute extensive manual QA testing to verify government website functionality
                        against national requirements.
                    </p>

                    <p className="about-text-block" style={{
                        fontSize: isMobile ? '0.95rem' : '1.05rem',
                        color: 'rgba(250,250,250,0.65)',
                        lineHeight: 1.8,
                        maxWidth: '55ch',
                        marginBottom: isMobile ? '1.5rem' : '2.5rem',
                    }}>
                        When I'm not managing multi-channel support or generating detailed performance
                        reports, you can find me conducting capability-building training sessions on the
                        National Portal Framework.
                    </p>

                    {/* ── Stats Highlights Row ── */}
                    <div ref={statsRef} style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: isMobile ? '0.75rem' : '1rem',
                    }}>
                        {STATS.map((stat, i) => (
                            <div
                                key={i}
                                className="about-stat-item glass-card"
                                style={{
                                    textAlign: 'center',
                                    padding: isMobile ? '1rem 0.5rem' : '1.25rem 1rem',
                                }}
                            >
                                {/* Top edge light */}
                                <div style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: '20%',
                                    right: '20%',
                                    height: '1px',
                                    background: 'linear-gradient(90deg, transparent, rgba(190, 169, 142, 0.3), transparent)',
                                    pointerEvents: 'none',
                                }} />
                                <div style={{
                                    fontFamily: 'var(--font-heading)',
                                    fontSize: isMobile ? '1.5rem' : '2rem',
                                    fontWeight: 700,
                                    color: 'var(--accent)',
                                    lineHeight: 1,
                                    marginBottom: '0.4rem',
                                    letterSpacing: '-0.02em',
                                }}>
                                    {stat.value}
                                </div>
                                <div style={{
                                    fontSize: isMobile ? '0.65rem' : '0.7rem',
                                    fontWeight: 500,
                                    letterSpacing: '0.12em',
                                    textTransform: 'uppercase',
                                    color: 'rgba(250, 250, 250, 0.45)',
                                    fontFamily: 'var(--font-body)',
                                }}>
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Inline styles for keyframe + mobile overrides ── */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes pulse-dot {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.5; transform: scale(0.85); }
                }
                @media (max-width: 900px) {
                    #about.section-padding {
                        padding: 4rem 5% !important;
                    }
                    #about h2 {
                        font-size: clamp(1.8rem, 7vw, 2.4rem) !important;
                    }
                }
                @media (max-width: 480px) {
                    #about.section-padding {
                        padding: 3rem 5% !important;
                    }
                }
            `}} />
        </section>
    );
};
