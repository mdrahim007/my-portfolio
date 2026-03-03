import React, { useRef, useEffect, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useScrollReveal } from '../hooks/useScrollReveal';

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
    {
        id: 1,
        quote: "Abdur completely overhauled our tier-1 response protocols. The new AI deflection strategy he implemented saved us 40 hours a week in manual triage. He's a visionary leader when it comes to scalable support.",
        author: "Sarah Jenkins",
        role: "VP of Product",
        company: "myGov Digital Services",
        type: "Stakeholder Feedback"
    },
    {
        id: 2,
        quote: "Before Abdur joined, our support team was siloed and burning out. He introduced a culture of empathy and continuous learning that cut our attrition rate in half. The best Support Manager I've ever worked under.",
        author: "Michael Chang",
        role: "Senior Support Specialist",
        company: "myGov ITSM Project",
        type: "Peer Feedback"
    },
    {
        id: 3,
        quote: "I was extremely frustrated with a billing issue that dragged on for days. Abdur personally took over my ticket, resolved it within an hour, and even sent a follow-up a week later to ensure everything was still perfect. Incredible service.",
        author: "Alex Rivera",
        role: "Enterprise Client",
        company: "National Portal Framework",
        type: "Customer Feedback"
    },
    {
        id: 4,
        quote: "Data-driven and deeply empathetic. Abdur knows exactly how to balance strict KPIs like AHT with authentic, human-centric customer conversations.",
        author: "Elena Rostova",
        role: "Customer Success Director",
        company: "Government Technology Division",
        type: "Stakeholder Feedback"
    }
];

export const DocumentationAndFeedback = () => {
    const sectionWrapperRef = useRef(null);
    const innerPanelRef = useRef(null);
    const galleryWrapperRef = useRef(null);
    const feedbackSectionRef = useRef(null);
    const cardRef = useRef(null);
    const autoTimer = useRef(null);

    const [activeIdx, setActiveIdx] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [progressKey, setProgressKey] = useState(0);
    const total = testimonials.length;

    // Carousel: GSAP fade-slide transition
    const goTo = useCallback((nextIdx) => {
        const card = cardRef.current;
        if (!card) return;
        gsap.to(card, {
            opacity: 0, y: 12, duration: 0.28, ease: 'power2.in',
            onComplete: () => {
                setActiveIdx(nextIdx);
                setProgressKey(k => k + 1);
                gsap.fromTo(card, { opacity: 0, y: -12 }, { opacity: 1, y: 0, duration: 0.38, ease: 'power2.out' });
            }
        });
    }, []);

    const goPrev = useCallback(() => goTo((activeIdx - 1 + total) % total), [activeIdx, goTo, total]);
    const goNext = useCallback(() => goTo((activeIdx + 1) % total), [activeIdx, goTo, total]);

    // Auto-advance every 6 seconds, pause on hover
    useEffect(() => {
        if (isHovered) return;
        setProgressKey(k => k + 1);
        const timer = setInterval(() => {
            setActiveIdx(prev => (prev + 1) % total);
            setProgressKey(k => k + 1);
        }, 6000);
        return () => clearInterval(timer);
    }, [isHovered, total]);

    // Scroll reveals for Feedback section headings + testimonial stagger
    useScrollReveal(feedbackSectionRef);

    useEffect(() => {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        const wrapper = sectionWrapperRef.current;
        const inner = innerPanelRef.current;
        const gallery = galleryWrapperRef.current;

        if (!wrapper || !inner || !gallery) return;

        if (!prefersReducedMotion) {
            // How far the gallery needs to travel horizontally to reveal all 3 panels
            const getScrollAmount = () => -(gallery.scrollWidth - window.innerWidth);

            // Timeline: gallery slides LEFT only.
            // NO exit animation — the Feedback section (zIndex:20, solid bg) scrolls
            // naturally over the pinned Documentation section for a seamless transition.
            const masterTl = gsap.timeline();

            masterTl.to(gallery, {
                x: getScrollAmount,
                ease: 'none',
            });

            const galleryTravel = Math.abs(getScrollAmount());

            // Store on DOM so App.jsx snap helper can calculate snap targets
            wrapper.dataset.galleryTravel = String(galleryTravel);
            wrapper.dataset.totalScroll = String(galleryTravel);

            ScrollTrigger.create({
                trigger: wrapper,
                start: 'top top',
                end: () => `+=${Math.abs(getScrollAmount())}`,
                pin: true,
                pinSpacing: true,
                scrub: 1,
                animation: masterTl,
                invalidateOnRefresh: true,
            });
        } else {
            // Reduced-motion: show gallery at start, no animation
            gsap.set(inner, { yPercent: 0 });
            gsap.set(gallery, { x: 0 });
        }

        return () => {
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, []);

    return (
        <>
            {/*
             * OUTER WRAPPER — this is what ScrollTrigger pins.
             * overflow:hidden clips the sliding inner panel cleanly.
             */}
            <section
                id="documentation"
                ref={sectionWrapperRef}
                style={{
                    position: 'relative',
                    zIndex: 10,
                    height: '100vh',
                    overflow: 'hidden',
                }}
            >
                {/*
                 * INNER PANEL — this slides in from below and exits upward.
                 * It starts at yPercent: 100 (off the bottom) and animates to 0 (fully visible).
                 */}
                <div
                    ref={innerPanelRef}
                    style={{
                        height: '100%',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        willChange: 'transform',
                    }}
                >
                    {/* Section heading */}
                    <div style={{ padding: '8rem 5% 0', marginBottom: '2.5rem' }}>
                        <span className="eyebrow-pill" style={{ marginBottom: '0.75rem' }}>04 — Documentation</span>
                        <h2 style={{
                            fontSize: 'clamp(2.2rem, 4.5vw, 4rem)',
                            letterSpacing: '-0.02em',
                            marginBottom: '0.5rem',
                        }}>
                            Documentation Showcase
                        </h2>
                        <hr className="section-rule" style={{ marginBottom: '1.25rem' }} />
                        <p style={{ color: '#a1a1aa', fontSize: '1.05rem', marginTop: '0', maxWidth: '55ch' }}>
                            A glimpse into the internal frameworks, knowledge bases, and architectural flows I use to scale operations. (Sanitized for public viewing).
                        </p>
                    </div>

                    {/* Horizontally panning gallery row */}
                    <div
                        ref={galleryWrapperRef}
                        data-gallery="true"
                        style={{
                            display: 'flex',
                            gap: '4rem',
                            padding: '0 5%',
                            width: 'max-content',
                            willChange: 'transform',
                        }}
                    >
                        <article style={{ width: '60vw', minWidth: '600px', flexShrink: 0 }}>
                            <div style={{
                                height: '50vh',
                                backgroundColor: 'var(--bg-surface)',
                                borderRadius: '16px',
                                overflow: 'hidden',
                                border: '1px solid rgba(255,255,255,0.1)',
                                position: 'relative'
                            }}>
                                <img
                                    src="https://images.unsplash.com/photo-1555529771-447544062c3e?q=80&w=1600&auto=format&fit=crop"
                                    alt="Knowledge Base Article"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(8px) grayscale(50%)', opacity: 0.7 }}
                                />
                                {/* Lock overlay */}
                                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="rgba(190,169,142,0.7)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                    </svg>
                                </div>
                            </div>
                            <h3 style={{ marginTop: '1.25rem', fontSize: '1.3rem', color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>a2i National Portal Knowledge Base</h3>
                            <span className="eyebrow" style={{ marginTop: '0.4rem' }}>Documentation</span>
                        </article>

                        {/* Card 2 */}
                        <article style={{ width: '60vw', minWidth: '600px', flexShrink: 0 }}>
                            <div style={{
                                height: '50vh',
                                backgroundColor: 'var(--bg-surface)',
                                borderRadius: '16px',
                                overflow: 'hidden',
                                border: '1px solid rgba(255,255,255,0.1)',
                                position: 'relative'
                            }}>
                                <img
                                    src="https://images.unsplash.com/photo-1618609378039-b572a138dbaa?q=80&w=1600&auto=format&fit=crop"
                                    alt="Support Procedure Flowchart"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(8px) grayscale(50%)', opacity: 0.7 }}
                                />
                                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="rgba(190,169,142,0.7)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                    </svg>
                                </div>
                            </div>
                            <h3 style={{ marginTop: '1.25rem', fontSize: '1.3rem', color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>SLA Escalation Routing Flowchart</h3>
                            <span className="eyebrow" style={{ marginTop: '0.4rem' }}>Process Flow</span>
                        </article>

                        {/* Card 3 */}
                        <article style={{ width: '60vw', minWidth: '600px', flexShrink: 0, paddingRight: '5vw' }}>
                            <div style={{
                                height: '50vh',
                                backgroundColor: 'var(--bg-surface)',
                                borderRadius: '16px',
                                overflow: 'hidden',
                                border: '1px solid rgba(255,255,255,0.1)',
                                position: 'relative'
                            }}>
                                <img
                                    src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1600&auto=format&fit=crop"
                                    alt="Performance Dashboard"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(8px) grayscale(50%)', opacity: 0.7 }}
                                />
                                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="rgba(190,169,142,0.7)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                    </svg>
                                </div>
                            </div>
                            <h3 style={{ marginTop: '1.25rem', fontSize: '1.3rem', color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>myGov Performance Metrics Dashboard</h3>
                            <span className="eyebrow" style={{ marginTop: '0.4rem' }}>Data Visualization</span>
                        </article>
                    </div>
                </div>
            </section>

            {/* ------------------------------------------------------------------ */}
            {/* TESTIMONIALS — separate section with a higher z-index and solid     */}
            {/* background so it covers the pinned Documentation panel on scroll-up */}
            {/* ------------------------------------------------------------------ */}
            <section ref={feedbackSectionRef} style={{ position: 'relative', zIndex: 20 }}>
                <div style={{ padding: '8rem 5%', maxWidth: '1000px', margin: '0 auto' }}>
                    <span className="eyebrow-pill animate-eyebrow">05 — Reputation</span>
                    <h2 className="animate-heading" style={{
                        fontSize: 'clamp(2.2rem, 4.5vw, 4rem)',
                        marginBottom: '0.5rem',
                        letterSpacing: '-0.02em',
                    }}>
                        Feedback &amp; Reputation
                    </h2>
                    <hr className="section-rule animate-rule" />

                    {/* ── Featured single-card carousel ─────────────────── */}
                    <div
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        style={{ position: 'relative' }}
                    >
                        {/* Fixed-height glass card */}
                        <div
                            ref={cardRef}
                            className="glass-testimonial"
                            style={{
                                height: '320px',
                                padding: '3rem 3.5rem',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                position: 'relative',
                                cursor: 'default',
                            }}
                        >
                            {/* Decorative oversized quotation mark */}
                            <span style={{
                                position: 'absolute',
                                top: '1.5rem',
                                right: '2.5rem',
                                fontSize: '6rem',
                                color: 'rgba(190,169,142,0.07)',
                                fontFamily: 'var(--font-heading)',
                                lineHeight: 1,
                                pointerEvents: 'none',
                                userSelect: 'none',
                            }}>&ldquo;</span>

                            {/* Quote */}
                            <p style={{
                                color: 'rgba(250,250,250,0.88)',
                                fontSize: 'clamp(1rem, 1.6vw, 1.15rem)',
                                lineHeight: 1.75,
                                fontStyle: 'italic',
                                fontFamily: 'var(--font-heading)',
                                fontWeight: 400,
                                flexGrow: 1,
                                display: 'flex',
                                alignItems: 'center',
                                position: 'relative',
                                zIndex: 2,
                                margin: 0,
                            }}>
                                &ldquo;{testimonials[activeIdx].quote}&rdquo;
                            </p>

                            {/* Author row */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1.75rem' }}>
                                {/* Monogram avatar */}
                                <div style={{
                                    width: '42px', height: '42px', borderRadius: '50%',
                                    background: 'rgba(190,169,142,0.1)',
                                    border: '1px solid rgba(190,169,142,0.22)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '0.95rem', fontWeight: 700, color: '#bea98e',
                                    fontFamily: 'var(--font-heading)', flexShrink: 0,
                                }}>
                                    {testimonials[activeIdx].author.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div>
                                    <h4 style={{ color: '#FAFAFA', fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.15rem' }}>
                                        {testimonials[activeIdx].author}
                                    </h4>
                                    <p style={{ color: '#a1a1aa', fontSize: '0.8rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                        {testimonials[activeIdx].role}
                                        <span style={{ width: '3px', height: '3px', borderRadius: '50%', background: 'rgba(190,169,142,0.5)', display: 'inline-block', flexShrink: 0 }} />
                                        <span style={{ color: '#bea98e', opacity: 0.8 }}>{testimonials[activeIdx].company}</span>
                                    </p>
                                </div>
                                {/* Type badge */}
                                <span style={{
                                    marginLeft: 'auto',
                                    padding: '0.32rem 0.85rem',
                                    background: 'rgba(190,169,142,0.07)',
                                    border: '1px solid rgba(190,169,142,0.16)',
                                    color: '#bea98e', borderRadius: '100px',
                                    fontSize: '0.7rem', textTransform: 'uppercase',
                                    letterSpacing: '0.12em', whiteSpace: 'nowrap',
                                }}>
                                    {testimonials[activeIdx].type}
                                </span>
                            </div>
                        </div>

                        {/* CSS for progress sweep animation */}
                        <style>{`
                            @keyframes sweepFill {
                                from { transform: scaleX(0); }
                                to   { transform: scaleX(1); }
                            }
                        `}</style>

                        {/* ── Premium controls row ──────────────────────── */}
                        <div style={{
                            display: 'flex', alignItems: 'center',
                            justifyContent: 'space-between', marginTop: '1.75rem',
                        }}>
                            {/* Segmented progress track */}
                            <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flex: 1, maxWidth: '260px' }}>
                                {testimonials.map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => goTo(i)}
                                        aria-label={`Go to testimonial ${i + 1}`}
                                        style={{
                                            flex: 1, height: '3px',
                                            background: 'rgba(255,255,255,0.1)',
                                            border: 'none', borderRadius: '100px',
                                            cursor: 'pointer', padding: 0,
                                            position: 'relative', overflow: 'hidden',
                                        }}
                                    >
                                        {i === activeIdx && (
                                            <span
                                                key={progressKey}
                                                style={{
                                                    position: 'absolute', inset: 0,
                                                    background: 'linear-gradient(90deg, #bea98e, #d4c4a8)',
                                                    borderRadius: '100px',
                                                    transformOrigin: 'left center',
                                                    animation: isHovered
                                                        ? 'none'
                                                        : `sweepFill 6s linear forwards`,
                                                    boxShadow: '0 0 8px rgba(190,169,142,0.6)',
                                                }}
                                            />
                                        )}
                                        {i !== activeIdx && (
                                            <span style={{
                                                position: 'absolute', inset: 0,
                                                background: i < activeIdx ? 'rgba(190,169,142,0.35)' : 'transparent',
                                                borderRadius: '100px',
                                            }} />
                                        )}
                                    </button>
                                ))}
                            </div>

                            {/* Counter + glass pill nav buttons */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                {/* Counter */}
                                <span style={{
                                    color: '#a1a1aa', fontSize: '0.75rem',
                                    letterSpacing: '0.08em', fontVariantNumeric: 'tabular-nums',
                                    minWidth: '42px', textAlign: 'center',
                                }}>
                                    {String(activeIdx + 1).padStart(2, '0')}&thinsp;/&thinsp;{String(total).padStart(2, '0')}
                                </span>

                                {/* Prev pill */}
                                <button
                                    onClick={goPrev}
                                    aria-label="Previous testimonial"
                                    className="interactive-element"
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '0.4rem',
                                        padding: '0.55rem 1.1rem',
                                        borderRadius: '100px',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        background: 'rgba(255,255,255,0.03)',
                                        backdropFilter: 'blur(8px)',
                                        color: 'rgba(250,250,250,0.6)',
                                        cursor: 'pointer', fontSize: '0.75rem',
                                        letterSpacing: '0.1em', textTransform: 'uppercase',
                                        fontFamily: 'var(--font-body)', fontWeight: 600,
                                        transition: 'border-color 0.3s, background 0.3s, color 0.3s',
                                    }}
                                    onMouseOver={e => {
                                        e.currentTarget.style.borderColor = 'rgba(190,169,142,0.4)';
                                        e.currentTarget.style.color = '#bea98e';
                                        e.currentTarget.style.background = 'rgba(190,169,142,0.07)';
                                    }}
                                    onMouseOut={e => {
                                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                                        e.currentTarget.style.color = 'rgba(250,250,250,0.6)';
                                        e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                                    }}
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="15 18 9 12 15 6" />
                                    </svg>
                                    Prev
                                </button>

                                {/* Next pill */}
                                <button
                                    onClick={goNext}
                                    aria-label="Next testimonial"
                                    className="interactive-element"
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '0.4rem',
                                        padding: '0.55rem 1.1rem',
                                        borderRadius: '100px',
                                        border: '1px solid rgba(190,169,142,0.25)',
                                        background: 'rgba(190,169,142,0.07)',
                                        backdropFilter: 'blur(8px)',
                                        color: '#bea98e',
                                        cursor: 'pointer', fontSize: '0.75rem',
                                        letterSpacing: '0.1em', textTransform: 'uppercase',
                                        fontFamily: 'var(--font-body)', fontWeight: 600,
                                        boxShadow: '0 0 14px rgba(190,169,142,0.12)',
                                        transition: 'border-color 0.3s, background 0.3s, box-shadow 0.3s',
                                    }}
                                    onMouseOver={e => {
                                        e.currentTarget.style.background = 'rgba(190,169,142,0.14)';
                                        e.currentTarget.style.boxShadow = '0 0 20px rgba(190,169,142,0.22)';
                                        e.currentTarget.style.borderColor = 'rgba(190,169,142,0.45)';
                                    }}
                                    onMouseOut={e => {
                                        e.currentTarget.style.background = 'rgba(190,169,142,0.07)';
                                        e.currentTarget.style.boxShadow = '0 0 14px rgba(190,169,142,0.12)';
                                        e.currentTarget.style.borderColor = 'rgba(190,169,142,0.25)';
                                    }}
                                >
                                    Next
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="9 18 15 12 9 6" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </>
    );
};
