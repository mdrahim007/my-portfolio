import React, { useRef, useEffect, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useScrollReveal } from '../hooks/useScrollReveal';

gsap.registerPlugin(ScrollTrigger);

/* ── Gallery card data ─────────────────────────────────────────────── */
const galleryCards = [
    {
        id: 1,
        title: 'a2i National Portal Project Charter',
        category: 'Project Initiation',
        image: 'https://images.unsplash.com/photo-1555529771-447544062c3e?q=80&w=1600&auto=format&fit=crop',
        alt: 'Project Charter Document',
    },
    {
        id: 2,
        title: 'Agile Sprint Delivery Roadmap',
        category: 'Agile Planning',
        image: 'https://images.unsplash.com/photo-1618609378039-b572a138dbaa?q=80&w=1600&auto=format&fit=crop',
        alt: 'Sprint Roadmap Flowchart',
    },
    {
        id: 3,
        title: 'Executive Stakeholder Dashboard',
        category: 'Data Visualization',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1600&auto=format&fit=crop',
        alt: 'Executive Dashboard',
    },
];

const testimonials = [
    {
        id: 1,
        quote: "Abdur Rahim's project management completely transformed our delivery lifecycle. His ability to align cross-functional teams, enforce agile ceremonies, and communicate progress to stakeholders saved us months of friction.",
        author: "Sarah Jenkins",
        role: "VP of Product",
        company: "myGov Digital Services",
        type: "Stakeholder Feedback"
    },
    {
        id: 2,
        quote: "Before Abdur took over coordination, our development sprints were siloed and chaotic. He introduced a structured roadmap and risk mitigation framework that ensured we hit every critical milestone on time.",
        author: "Michael Chang",
        role: "Lead Technical Architect",
        company: "myGov ITSM Project",
        type: "Peer Feedback"
    },
    {
        id: 3,
        quote: "It's rare to find a PM who handles both the technical scope and stakeholder expectations so effortlessly. His flawless reporting and Business Requirement Documents (BRDs) kept the entire joint venture aligned.",
        author: "Alex Rivera",
        role: "Enterprise Client",
        company: "National Portal Framework",
        type: "Customer Feedback"
    },
    {
        id: 4,
        quote: "Data-driven and deeply strategic. Abdur knows exactly how to balance strict project timelines with the flexibility required to navigate complex government technology deployments.",
        author: "Elena Rostova",
        role: "Program Director",
        company: "Government Technology Division",
        type: "Executive Feedback"
    }
];

export const DocumentationAndFeedback = () => {
    const feedbackSectionRef = useRef(null);
    const cardRef = useRef(null);
    const sectionWrapperRef = useRef(null);

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
                            <span className="eyebrow-pill animate-eyebrow" style={{ marginBottom: '0.75rem' }}>04 — Documentation</span>
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
                        <p className="animate-heading" style={{ color: '#a1a1aa', fontSize: '1.05rem', marginTop: '0', maxWidth: '55ch', lineHeight: 1.6 }}>
                            A glimpse into the project reports, operational frameworks, and knowledge bases I use to coordinate cross-functional teams and align project delivery. (Sanitized for public viewing).
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
                                className="doc-grid-card glass-card"
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    padding: '1.25rem',
                                    paddingBottom: '2rem',
                                    borderRadius: '20px',
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
                                            filter: 'blur(8px) grayscale(40%)',
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

                                    {/* Center lock icon */}
                                    <div style={{
                                        position: 'absolute',
                                        inset: 0,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
                                    }} className="doc-card-icon">
                                        <div style={{
                                            width: '64px', height: '64px',
                                            borderRadius: '50%',
                                            background: 'rgba(12,12,12,0.4)',
                                            backdropFilter: 'blur(12px)',
                                            WebkitBackdropFilter: 'blur(12px)',
                                            border: '1px solid rgba(190,169,142,0.2)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 2px 0 rgba(255,255,255,0.05)'
                                        }}>
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(190,169,142,0.85)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
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
                        <span className="eyebrow-pill animate-eyebrow">05 — Reputation</span>
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
                            .doc-grid-card:hover .doc-card-bg-img {
                                opacity: 0.85 !important;
                                filter: blur(4px) grayscale(20%) !important;
                                transform: scale(1.05);
                            }
                            
                            .doc-grid-card:hover .doc-card-icon {
                                transform: scale(1.1) translateY(-4px);
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

        </>
    );
};
