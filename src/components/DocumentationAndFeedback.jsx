import React, { useRef, useEffect, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useScrollReveal } from '../hooks/useScrollReveal';

gsap.registerPlugin(ScrollTrigger);

/* ── Gallery card data (Confidential Frameworks) ──────────────────── */
const galleryCards = [
    {
        id: 1,
        title: 'Stakeholder Alignment Framework',
        category: 'Communication Strategy',
        image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1600&auto=format&fit=crop', // Group of people meeting around a table
        alt: 'Blurred Project Framework',
        modalContent: {
            purpose: "In national-scale projects, miscommunication is the biggest risk. This framework maps out exactly who needs to know what, and when.",
            components: [
                "Audience Matrix: Identifying technical teams, domain experts, and stakeholders.",
                "Communication Cadence: Structuring daily stand-ups, weekly reviews, and executive briefings.",
                "Feedback Loops: A standardized process for capturing requirement changes without derailing timelines."
            ],
            impact: "Bridges the gap between developers and clients, ensuring everyone moves in the exact same direction."
        }
    },
    {
        id: 2,
        title: 'SLA Escalation & Risk Matrix',
        category: 'Risk Management',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1600&auto=format&fit=crop', // Data dashboard with red/alert tones
        alt: 'Blurred Risk Matrix',
        modalContent: {
            purpose: "When dealing with digital public services, downtime is not an option. This document is my blueprint for proactive risk mitigation and rapid issue resolution.",
            components: [
                "Tiered Support Workflows: Clear guidelines on ticket movement from L1 to core development.",
                "Trigger Points: Automated alerts for tickets approaching SLA breaches.",
                "Action Plans: Pre-defined technical responses for critical system outages."
            ],
            impact: "Empowers cross-functional teams to act swiftly, consistently maintaining 99% SLA compliance on enterprise portals."
        }
    },
    {
        id: 3,
        title: 'Executive Delivery Dashboard',
        category: 'Data & Reporting',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1600&auto=format&fit=crop',
        alt: 'Blurred Executive Dashboard',
        modalContent: {
            purpose: "Leadership needs to see the health of the project at a glance. This dashboard translates complex sprint data into clear business insights.",
            components: [
                "Milestone Tracking: Visualizing planned vs. actual delivery dates.",
                "Resource Allocation: Monitoring team bandwidth and identifying bottlenecks early.",
                "Quality Metrics: Tracking bug-fix rates and successful deployment percentages."
            ],
            impact: "Provides transparent, data-driven progress reports that build trust with executives and project sponsors."
        }
    },
];

const testimonials = [
    {
        id: 1,
        quote: "Data-driven and deeply strategic. Md. Abdur Rahim knows exactly how to balance strict project timelines with the flexibility required to navigate complex, large-scale government technology deployments.",
        author: "Md. Moniruzzaman",
        role: "Project Director & CTO",
        type: "EXECUTIVE FEEDBACK"
    },
    {
        id: 2,
        quote: "Md. Abdur Rahim has a rare ability to translate complex government requirements into clear, actionable technical sprints. His coordination on the myGov ITSM project ensured that both our technical teams and government stakeholders were always aligned.",
        author: "Project Sponsor",
        role: "E-Governance Initiatives",
        type: "STAKEHOLDER ALIGNMENT"
    },
    {
        id: 3,
        quote: "Leading a cross-functional team of over 25 members is no easy task, but Md. Abdur Rahim managed our support and implementation units seamlessly. His focus on process optimization is the reason we consistently maintained our 99% SLA target.",
        author: "Operations Head",
        role: "IT Service Management (ITSM)",
        type: "TEAM LEADERSHIP"
    },
    {
        id: 4,
        quote: "Whether it was handling the National Portal onboarding or managing critical system upgrades, Md. Abdur Rahim's proactive risk management caught problems long before they impacted the live environment. He brings genuine stability to chaotic deployments.",
        author: "Senior Solutions Architect",
        role: "Digital Transformation Division",
        type: "RISK MANAGEMENT"
    },
];

export const DocumentationAndFeedback = () => {
    const feedbackSectionRef = useRef(null);
    const cardRef = useRef(null);
    const sectionWrapperRef = useRef(null);

    // Modal State
    const [selectedDoc, setSelectedDoc] = useState(null);

    // Prevent body scroll when modal is open without jumping to top
    useEffect(() => {
        if (selectedDoc) {
            const scrollY = window.scrollY;
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.left = '0';
            document.body.style.right = '0';
            document.body.style.width = '100%';
        } else {
            const scrollY = document.body.style.top;
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.left = '';
            document.body.style.right = '';
            document.body.style.width = '';

            if (scrollY) {
                window.scrollTo(0, parseInt(scrollY || '0') * -1);
            }
        }
    }, [selectedDoc]);

    /* ── Mobile detection ──────────────────────────────────── */
    const [isMobileView, setIsMobileView] = useState(() => typeof window !== 'undefined' && window.innerWidth <= 900);
    useEffect(() => {
        const mq = window.matchMedia('(max-width: 900px)');
        const handler = (e) => setIsMobileView(e.matches);
        mq.addEventListener('change', handler);
        return () => mq.removeEventListener('change', handler);
    }, []);

    useScrollReveal(sectionWrapperRef);
    useScrollReveal(feedbackSectionRef);

    /* ── Documentation Cards GSAP ScrollReveal ──────────────────── */
    const docCardsRef = useRef(null);
    useEffect(() => {
        if (!docCardsRef.current) return;
        const cards = docCardsRef.current.querySelectorAll('.doc-grid-card');
        gsap.set(cards, { opacity: 0, y: 40 });

        ScrollTrigger.batch(cards, {
            onEnter: (batch) =>
                gsap.to(batch, {
                    opacity: 1, y: 0,
                    duration: 0.8,
                    ease: 'power3.out',
                    stagger: 0.15,
                }),
            start: 'top 85%',
            once: true,
        });
        return () => ScrollTrigger.getAll().forEach(t => t.kill());
    }, []);

    /* ── Testimonial carousel state ────────────────────────── */
    const [activeIdx, setActiveIdx] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [progressKey, setProgressKey] = useState(0);
    const total = testimonials.length;

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

    useEffect(() => {
        if (isHovered) return;
        setProgressKey(k => k + 1);
        const timer = setInterval(() => {
            setActiveIdx(prev => (prev + 1) % total);
            setProgressKey(k => k + 1);
        }, 6000);
        return () => clearInterval(timer);
    }, [isHovered, total]);

    /* ── Testimonial swipe gestures (mobile) ────────────────── */
    const tTouchStartX = useRef(0);
    const tTouchDelta = useRef(0);
    const onTestimonialTouchStart = useCallback((e) => {
        tTouchStartX.current = e.touches[0].clientX;
        tTouchDelta.current = 0;
        setIsHovered(true); // pause auto-advance while touching
    }, []);
    const onTestimonialTouchMove = useCallback((e) => {
        tTouchDelta.current = e.touches[0].clientX - tTouchStartX.current;
    }, []);
    const onTestimonialTouchEnd = useCallback(() => {
        setIsHovered(false);
        if (Math.abs(tTouchDelta.current) > 40) {
            if (tTouchDelta.current < 0) goNext();
            else goPrev();
        }
    }, [goNext, goPrev]);

    return (
        <>
            {/* ------------------------------------------------------------------ */}
            {/* DOCUMENTATION SHOWCASE — Now constrained to max-width 1400px        */}
            {/* ------------------------------------------------------------------ */}
            <section
                id="documentation"
                ref={sectionWrapperRef}
                className="section-padding"
                style={{
                    position: 'relative',
                    zIndex: 10,
                }}
            >
                <div className="global-container">

                    {/* Section heading */}
                    <div style={{ marginBottom: '4rem' }}>
                        <div style={{ marginBottom: '0.5rem' }}>
                            <span className="eyebrow-pill animate-eyebrow" style={{ marginBottom: '0.75rem' }}>05 — Documentation</span>
                        </div>
                        <h2 className="animate-heading" style={{
                            fontSize: 'clamp(2rem, 4.2vw, 4rem)',
                            marginTop: 0,
                            marginBottom: '1.5rem',
                            color: 'var(--text-primary)',
                            letterSpacing: '-0.03em',
                            lineHeight: 1.05,
                        }}>
                            Documentation <span style={{ color: 'var(--accent)', fontStyle: 'italic', fontWeight: 400 }}>Showcase.</span>
                        </h2>
                        <p className="animate-heading" style={{ color: '#a1a1aa', fontSize: '1.05rem', marginTop: '0', maxWidth: '65ch', lineHeight: 1.6 }}>
                            A look at the strategic frameworks, risk matrices, and reporting structures I use to align cross-functional teams and ensure seamless project delivery. (Data sanitized for public viewing).
                        </p>
                    </div>

                    {/* Premium Grid Layout */}
                    <div
                        ref={docCardsRef}
                        style={{
                            display: 'grid',
                            gridTemplateColumns: isMobileView ? '1fr' : 'repeat(auto-fit, minmax(320px, 1fr))',
                            gap: '2rem'
                        }}
                    >
                        {galleryCards.map((card, i) => (
                            <article
                                key={card.id}
                                className="doc-grid-card glass-card interactive-element"
                                onClick={() => setSelectedDoc(card)}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    padding: '1.25rem',
                                    paddingBottom: '2rem',
                                    borderRadius: '20px',
                                    cursor: 'pointer',
                                    transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.4s ease'
                                }}
                            >
                                {/* Image Wrapper */}
                                <div style={{
                                    width: '100%',
                                    aspectRatio: '4/3',
                                    backgroundColor: '#1a1a1a',
                                    borderRadius: '12px',
                                    overflow: 'hidden',
                                    border: '1px solid rgba(255,255,255,0.06)',
                                    position: 'relative',
                                    marginBottom: '1.75rem',
                                }}>
                                    <img src={card.image} alt={card.alt}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            filter: 'blur(6px) grayscale(40%)',
                                            opacity: 0.65,
                                            transition: 'all 0.5s ease'
                                        }}
                                        className="doc-card-bg-img"
                                    />
                                    {/* Gradient overlay for premium feel */}
                                    <div style={{
                                        position: 'absolute',
                                        inset: 0,
                                        background: 'linear-gradient(180deg, transparent 40%, rgba(12,12,12,0.8) 100%)',
                                        pointerEvents: 'none'
                                    }} />

                                    {/* Center lock icon (changes to unlock on hover) */}
                                    <div style={{
                                        position: 'absolute',
                                        inset: 0,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
                                    }} className="doc-card-icon-wrap">
                                        <div style={{
                                            width: '64px', height: '64px',
                                            borderRadius: '50%',
                                            background: 'rgba(12,12,12,0.4)',
                                            backdropFilter: 'blur(12px)',
                                            WebkitBackdropFilter: 'blur(12px)',
                                            border: '1px solid rgba(190,169,142,0.3)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 2px 0 rgba(255,255,255,0.05)',
                                            transition: 'all 0.3s ease'
                                        }} className="doc-card-icon">
                                            {/* Lock Icon */}
                                            <svg className="icon-lock" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(190,169,142,0.85)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'opacity 0.2s', position: 'absolute' }}>
                                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                            </svg>
                                            {/* Unlock Icon (hidden by default) */}
                                            <svg className="icon-unlock" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0, transition: 'opacity 0.2s', position: 'absolute' }}>
                                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v1" />
                                            </svg>
                                        </div>
                                    </div>

                                    {/* Number Badge inside image */}
                                    <span style={{
                                        position: 'absolute',
                                        top: '1rem', right: '1rem',
                                        width: '36px', height: '36px', borderRadius: '50%',
                                        background: 'rgba(12,12,12,0.5)',
                                        backdropFilter: 'blur(8px)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '0.8rem', fontWeight: 600, color: 'rgba(250,250,250,0.8)',
                                        fontFamily: 'var(--font-body)',
                                    }}>
                                        {String(i + 1).padStart(2, '0')}
                                    </span>
                                </div>

                                {/* Info text */}
                                <div style={{ padding: '0 0.5rem', display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between' }}>
                                    <div>
                                        <h3 style={{
                                            fontSize: '1.2rem',
                                            color: 'var(--text-primary)',
                                            letterSpacing: '-0.01em',
                                            marginBottom: '0.75rem',
                                            lineHeight: 1.4
                                        }}>
                                            {card.title}
                                        </h3>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent)', opacity: 0.8 }} />
                                        <span className="eyebrow" style={{ marginBottom: 0, fontSize: '0.75rem', opacity: 0.9 }}>{card.category}</span>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* ------------------------------------------------------------------ */}
            {/* TESTIMONIALS                                                       */}
            {/* ------------------------------------------------------------------ */}
            <section id="reputation" ref={feedbackSectionRef} className="section-padding" style={{ position: 'relative', zIndex: 10 }}>
                <div className="global-container">
                    <div style={{ marginBottom: '0.5rem' }}>
                        <span className="eyebrow-pill animate-eyebrow">06 — Reputation</span>
                    </div>
                    <h2 className="animate-heading" style={{
                        fontSize: 'clamp(2rem, 4.2vw, 4rem)',
                        marginTop: 0,
                        marginBottom: '1.5rem',
                        color: 'var(--text-primary)',
                        letterSpacing: '-0.03em',
                        lineHeight: 1.05,
                    }}>
                        Feedback <span style={{ color: 'var(--accent)', fontStyle: 'italic', fontWeight: 400 }}>&amp; Reputation.</span>
                    </h2>

                    {/* ── Featured single-card carousel ─────────────────── */}
                    <div
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        onTouchStart={onTestimonialTouchStart}
                        onTouchMove={onTestimonialTouchMove}
                        onTouchEnd={onTestimonialTouchEnd}
                        style={{ position: 'relative' }}
                    >
                        {/* Glass card */}
                        <div
                            ref={cardRef}
                            className="glass-testimonial glass-card"
                            style={{
                                minHeight: '280px',
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

                            {/* Type badge — top-left */}
                            <span style={{
                                display: 'inline-block',
                                alignSelf: 'flex-start',
                                padding: '0.32rem 0.85rem',
                                background: 'rgba(190,169,142,0.07)',
                                border: '1px solid rgba(190,169,142,0.16)',
                                color: '#bea98e', borderRadius: '100px',
                                fontSize: '0.68rem', textTransform: 'uppercase',
                                letterSpacing: '0.12em', whiteSpace: 'nowrap',
                                position: 'relative', zIndex: 2,
                                marginBottom: '0.75rem',
                            }}>
                                {testimonials[activeIdx].type}
                            </span>

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
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1.25rem' }}>
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
                                    <p style={{ color: '#a1a1aa', fontSize: '0.8rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                                        {testimonials[activeIdx].role}
                                        <span style={{ width: '3px', height: '3px', borderRadius: '50%', background: 'rgba(190,169,142,0.5)', display: 'inline-block', flexShrink: 0 }} />
                                        <span style={{ color: '#bea98e', opacity: 0.8 }}>{testimonials[activeIdx].company}</span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* CSS for progress sweep animation */}
                        <style>{`
                            @keyframes sweepFill {
                                from { transform: scaleX(0); }
                                to   { transform: scaleX(1); }
                            }
                            
                            /* Hover effects for doc cards */
                            .doc-grid-card:hover {
                                transform: translateY(-6px);
                            }
                            .doc-grid-card:hover .doc-card-bg-img {
                                opacity: 0.8 !important;
                                filter: blur(6px) grayscale(20%) !important;
                                transform: scale(1.05);
                            }
                            
                            .doc-grid-card:hover .doc-card-icon-wrap {
                                transform: scale(1.1) translateY(-4px);
                            }
                            .doc-grid-card:hover .doc-card-icon {
                                background: rgba(190,169,142,0.15) !important;
                                border-color: rgba(190,169,142,0.6) !important;
                                box-shadow: 0 0 30px rgba(190,169,142,0.3), inset 0 2px 0 rgba(255,255,255,0.1) !important;
                            }
                            .doc-grid-card:hover .icon-lock { opacity: 0 !important; }
                            .doc-grid-card:hover .icon-unlock { opacity: 1 !important; transform: scale(1.1); }
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

                                {/* Prev button */}
                                <button
                                    onClick={goPrev}
                                    aria-label="Previous testimonial"
                                    className="interactive-element testimonial-nav-btn"
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '0.4rem',
                                        padding: isMobileView ? '0.55rem' : '0.55rem 1.1rem',
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
                                    {!isMobileView && 'Prev'}
                                </button>

                                {/* Next button */}
                                <button
                                    onClick={goNext}
                                    aria-label="Next testimonial"
                                    className="interactive-element testimonial-nav-btn"
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '0.4rem',
                                        padding: isMobileView ? '0.55rem' : '0.55rem 1.1rem',
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
                                    {!isMobileView && 'Next'}
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="9 18 15 12 9 6" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <style dangerouslySetInnerHTML={{
                __html: `
                @media (max-width: 900px) {
                    .glass-testimonial {
                        height: auto !important;
                        min-height: 0 !important;
                        padding: 2rem 1.5rem !important;
                    }
                    .glass-testimonial p {
                        font-size: 0.92rem !important;
                        line-height: 1.7 !important;
                    }
                    .glass-testimonial > span:first-child {
                        font-size: 4rem !important;
                        top: 0.5rem !important;
                        right: 1rem !important;
                    }
                    .glass-testimonial > div:last-child {
                        flex-wrap: wrap !important;
                        gap: 0.75rem !important;
                    }
                    .glass-testimonial > div:last-child > span:last-child {
                        margin-left: 0 !important;
                        font-size: 0.6rem !important;
                    }
                }
                @media (max-width: 600px) {
                    .glass-testimonial {
                        padding: 1.5rem 1.2rem !important;
                    }
                    .glass-testimonial p {
                        font-size: 0.88rem !important;
                        line-height: 1.65 !important;
                    }
                }
                @media (max-width: 480px) {
                    .glass-testimonial {
                        padding: 1.25rem 1rem !important;
                    }
                    .glass-testimonial p {
                        font-size: 0.85rem !important;
                    }
                    .glass-testimonial > span:first-child {
                        font-size: 3rem !important;
                    }
                    .glass-testimonial > div:last-child {
                        flex-direction: column !important;
                        align-items: flex-start !important;
                        gap: 0.6rem !important;
                    }
                    .glass-testimonial > div:last-child > div > p {
                        flex-wrap: wrap !important;
                    }
                }
            `}} />

            {/* ------------------------------------------------------------------ */}
            {/* DOCUMENT MODAL OVERLAY                                             */}
            {/* ------------------------------------------------------------------ */}
            {selectedDoc && (
                <div
                    className="doc-modal-overlay modal-overlay-fixed"
                    onClick={() => setSelectedDoc(null)}
                    style={{
                        position: 'fixed', inset: 0, zIndex: 9999,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        padding: '2rem',
                        animation: 'modalFadeIn 0.3s ease forwards',
                        willChange: 'transform',
                        transform: 'translateZ(0)',
                        WebkitTransform: 'translateZ(0)',
                    }}
                >
                    <div
                        className="doc-modal-content glass-card"
                        onClick={(e) => e.stopPropagation()} // prevent click-through
                        style={{
                            width: '100%', maxWidth: '680px',
                            background: '#0c0c0c',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '24px',
                            padding: isMobileView ? '2.5rem 2rem' : '3.5rem',
                            position: 'relative',
                            boxShadow: '0 24px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(190,169,142,0.05) inset',
                            animation: 'modalSlideUp 0.4s cubic-bezier(0.25, 1, 0.5, 1) forwards'
                        }}
                    >
                        {/* Close button */}
                        <button
                            onClick={() => setSelectedDoc(null)}
                            className="interactive-element"
                            style={{
                                position: 'absolute', top: '1.5rem', right: '1.5rem',
                                width: '40px', height: '40px', borderRadius: '50%',
                                background: 'rgba(255,255,255,0.05)', border: 'none',
                                color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                cursor: 'pointer', transition: 'all 0.2s',
                            }}
                            onMouseOver={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff'; }}
                            onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>

                        {/* Modal Header */}
                        <div style={{ marginBottom: '2.5rem' }}>
                            <span className="eyebrow" style={{ color: 'var(--accent)', marginBottom: '0.75rem', fontSize: '0.8rem' }}>
                                {selectedDoc.category} &nbsp;—&nbsp; RESTRICTED
                            </span>
                            <h3 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', color: '#FAFAFA', lineHeight: 1.2, margin: 0 }}>
                                {selectedDoc.title}
                            </h3>
                        </div>

                        {/* Modal Body */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            {/* Purpose */}
                            <div>
                                <h4 style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>The Purpose</h4>
                                <p style={{ color: 'rgba(250,250,250,0.85)', fontSize: '1.05rem', lineHeight: 1.6, margin: 0 }}>
                                    {selectedDoc.modalContent.purpose}
                                </p>
                            </div>

                            {/* Key Components */}
                            <div>
                                <h4 style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>Key Components</h4>
                                <ul style={{ margin: 0, paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    {selectedDoc.modalContent.components.map((bullet, idx) => {
                                        const [boldPart, rest] = bullet.split(': ');
                                        return (
                                            <li key={idx} style={{ color: 'rgba(250,250,250,0.7)', fontSize: '0.95rem', lineHeight: 1.5 }}>
                                                <strong style={{ color: '#bea98e', fontWeight: 600 }}>{boldPart}</strong>{rest ? `: ${rest}` : ''}
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>

                            {/* Impact */}
                            <div style={{ marginTop: '0.5rem', padding: '1.5rem', background: 'rgba(190,169,142,0.05)', borderRadius: '12px', borderLeft: '3px solid var(--accent)' }}>
                                <h4 style={{ color: 'var(--accent)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>The Impact</h4>
                                <p style={{ color: '#fff', fontSize: '1rem', lineHeight: 1.5, margin: 0, fontWeight: 500 }}>
                                    {selectedDoc.modalContent.impact}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes modalFadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes modalSlideUp {
                    from { opacity: 0; transform: translate3d(0, 20px, 0) scale(0.98); }
                    to { opacity: 1; transform: translate3d(0, 0, 0) scale(1); }
                }

                @media (max-width: 600px) {
                    .doc-modal-overlay {
                        padding: 1rem !important;
                    }
                    .doc-modal-content {
                        padding: 1.5rem !important;
                        max-height: 90vh;
                        overflow-y: auto;
                    }
                    /* Custom scrollbar for the modal */
                    .doc-modal-content::-webkit-scrollbar {
                        width: 6px;
                    }
                    .doc-modal-content::-webkit-scrollbar-track {
                        background: rgba(0,0,0,0.2);
                        border-radius: 4px;
                    }
                    .doc-modal-content::-webkit-scrollbar-thumb {
                        background: rgba(190,169,142,0.3);
                        border-radius: 4px;
                    }
                    .doc-modal-content::-webkit-scrollbar-thumb:hover {
                        background: rgba(190,169,142,0.5);
                    }
                    .doc-modal-content > button {
                        top: 1rem !important;
                        right: 1rem !important;
                        width: 32px !important;
                        height: 32px !important;
                    }
                    .doc-modal-content h3 {
                        font-size: 1.25rem !important;
                        padding-right: 2rem; /* make room for close btn */
                    }
                    .doc-modal-content p {
                        font-size: 0.95rem !important;
                    }
                    .doc-modal-content ul li {
                        font-size: 0.9rem !important;
                    }
                }
            `}} />

        </>
    );
};
