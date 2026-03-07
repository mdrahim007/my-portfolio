import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useScrollReveal } from '../hooks/useScrollReveal';

gsap.registerPlugin(ScrollTrigger);

const LifecycleContent = ({ tab, data }) => {
    switch (tab) {
        case 'Overview':
            return <p className="star-text">{data.overview}</p>;
        case 'The Challenge':
            return <p className="star-text">{data.challenge}</p>;
        case 'Our Solution':
            return <p className="star-text">{data.solution}</p>;
        case 'The Impact':
            return <p className="star-text star-text--result">{data.impact}</p>;

        // Fallbacks for Project 2 which still uses the old labels
        case 'Initiation':
            return <p className="star-text">{data.initiation}</p>;
        case 'Planning':
            return <p className="star-text">{data.planning}</p>;
        case 'Execution':
            return <p className="star-text">{data.execution}</p>;
        case 'Closure':
            return <p className="star-text star-text--result">{data.closure}</p>;

        default:
            return null;
    }
};

const ProjectCard = ({ title, defaultTab, isReversed, imageSrc, data }) => {
    const [activeTab, setActiveTab] = useState(defaultTab);
    const cardRef = useRef(null);

    return (
        <article
            ref={cardRef}
            className="interactive-element glass-card proj-card"
            style={{
                display: 'grid',
                gridTemplateColumns: isReversed ? '1fr 1.2fr' : '1.2fr 1fr',
                gap: '0',
                overflow: 'hidden',
                cursor: 'none'
            }}
            onMouseOver={() => {
                const img = cardRef.current.querySelector('img');
                if (img) img.style.transform = 'scale(1.05)';
            }}
            onMouseOut={() => {
                const img = cardRef.current.querySelector('img');
                if (img) img.style.transform = 'scale(1)';
            }}
        >
            {/* Image Container */}
            <div className="proj-img" style={{ order: isReversed ? 2 : 1, overflow: 'hidden', position: 'relative', minHeight: '400px' }}>
                <img
                    src={imageSrc}
                    alt={title}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 300ms ease-out',
                        filter: 'grayscale(20%)'
                    }}
                />
            </div>

            {/* Content Container */}
            <div className="proj-content" style={{ order: isReversed ? 1 : 2, padding: '4rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <h3 className="proj-title" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', color: 'var(--text-primary)', marginBottom: '2rem', lineHeight: 1.2 }}>
                    {title}
                </h3>

                {/* PM Lifecycle Tabs */}
                <div className="star-tabs" style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem', marginBottom: '1.5rem', overflowX: 'auto', whiteSpace: 'nowrap' }}>
                    {(data.overview ? ['Overview', 'The Challenge', 'Our Solution', 'The Impact'] : ['Initiation', 'Planning', 'Execution', 'Closure']).map(tab => (
                        <button
                            key={tab}
                            className="interactive-element star-tab-btn"
                            onClick={() => setActiveTab(tab)}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: activeTab === tab ? '#bea98e' : '#a1a1aa',
                                fontSize: '0.9rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em',
                                fontWeight: activeTab === tab ? 700 : 400,
                                padding: '0.5rem 0',
                                position: 'relative',
                                transition: 'color 0.1s',
                                cursor: 'none',
                                flexShrink: 0,
                            }}
                        >
                            {tab}
                            {activeTab === tab && (
                                <div style={{
                                    position: 'absolute',
                                    bottom: '-6px',
                                    left: 0,
                                    width: '100%',
                                    height: '2px',
                                    backgroundColor: '#bea98e'
                                }} />
                            )}
                        </button>
                    ))}
                </div>

                {/* Dynamic Content */}
                <div className="star-body">
                    <LifecycleContent tab={activeTab} data={data} />
                </div>
            </div>
        </article>
    );
};

export const ProjectShowcases = () => {
    const containerRef = useRef(null);

    useScrollReveal(containerRef);

    useEffect(() => {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (!prefersReducedMotion && containerRef.current) {
            const cards = containerRef.current.querySelectorAll('article');

            cards.forEach(card => {
                gsap.fromTo(
                    card,
                    { opacity: 0, y: 80 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 1.2,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: card,
                            start: 'top 80%',
                            toggleActions: 'play none none none'
                        }
                    }
                );

                // Image parallax
                const img = card.querySelector('img');
                if (img) {
                    gsap.fromTo(img,
                        { y: -20 },
                        {
                            y: 20,
                            ease: 'none',
                            scrollTrigger: {
                                trigger: card,
                                start: 'top bottom',
                                end: 'bottom top',
                                scrub: 1.5,
                            },
                        }
                    );
                }
            });
        }
    }, []);

    return (
        <section
            ref={containerRef}
            id="work"
            className="section-padding"
            style={{
                position: 'relative',
                zIndex: 10,
            }}
        >
            <div className="global-container">
                <div style={{ marginBottom: '0.5rem' }}>
                    <span className="eyebrow-pill animate-eyebrow">04 — Work</span>
                </div>
                <h2
                    className="animate-heading"
                    style={{
                        fontSize: 'clamp(2rem, 4.2vw, 4rem)',
                        marginTop: 0,
                        marginBottom: '1.5rem',
                        color: 'var(--text-primary)',
                        letterSpacing: '-0.03em',
                        lineHeight: 1.05,
                    }}
                >
                    Project <span style={{ color: 'var(--accent)', fontStyle: 'italic', fontWeight: 400 }}>Showcases.</span>
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6rem' }}>

                    {/* Project 1 */}
                    <ProjectCard
                        title="myGov System Implementation & Support"
                        defaultTab="Overview"
                        isReversed={false}
                        imageSrc="/myGov-homepage.png"
                        data={{
                            overview: "The myGov platform, developed by a2i, transforms manual government services into accessible digital formats. As the ITSM partner, my team manages the complete journey of bringing these offline services online so citizens can access them seamlessly from home.",
                            challenge: "The main hurdle is taking complex, offline government procedures and accurately digitizing them. We must collect legacy data, map out a clear implementation plan, and ensure the new digital workflow operates perfectly for both the public and government offices.",
                            solution: "I lead the end-to-end digitization process. My team gathers requirements from government offices, digitizes services, and conducts rigorous validation. Before the final launch, we also train government officials on exactly how to process the new applications.",
                            impact: "We deliver digitized services that citizens can easily use from anywhere. Post-launch, we provide continuous support to users and trained officials. We also collect and analyze feedback, reporting insights to a2i to ensure the platform delivers 100% satisfaction."
                        }}
                    />

                    {/* Project 2 (Asymmetrical Reverse) */}
                    <ProjectCard
                        title="National Portal Onboarding & Support"
                        defaultTab="Overview"
                        isReversed={true}
                        imageSrc="/national-portal2.png"
                        data={{
                            overview: "The National Portal Framework by a2i provides a unified web platform for all government offices to share public information. I managed the QA and Support teams responsible for onboarding new government agencies and maintaining the entire portal ecosystem.",
                            challenge: "The primary goal was bringing unconnected government offices onto a standardized framework. This required gathering accurate agency data, deploying cloned site structures, validating new development features, and ensuring officials could manage their content.",
                            solution: "I mentored the teams executing this entire pipeline. We collected office data, set up domains, cloned the portal structure, and thoroughly tested functionality. We then conducted training sessions so officials could easily update portal information themselves.",
                            impact: "We successfully expanded the national portal network, giving citizens reliable access to vital government information. Post-launch, my teams provided dedicated 24/7 technical support to resolve complex issues and ensure all portals remained fully operational."
                        }}
                    />

                </div>
            </div>

            {/* Responsive Overrides */}
            <style dangerouslySetInnerHTML={{
                __html: `
                /* ── Star tab paragraph text (base) ── */
                .star-text {
                    color: #c4c4c4;
                    line-height: 1.75;
                    margin-top: 1.25rem;
                    font-size: clamp(0.85rem, 2.5vw, 1.05rem);
                }
                .star-text--result {
                    color: #FAFAFA;
                    font-weight: 500;
                }

                /* ── Tablet (≤ 900px) ── */
                @media (max-width: 900px) {
                    #work {
                        padding: 4rem 5% !important;
                    }
                    #work > div > div {
                        gap: 3rem !important;
                    }
                    #work h2 {
                        font-size: clamp(1.6rem, 6vw, 2.2rem) !important;
                    }
                    /* Stack to single column */
                    .proj-card {
                        grid-template-columns: 1fr !important;
                        border-radius: 16px !important;
                    }
                    /* Always show image first on mobile, regardless of isReversed */
                    .proj-img {
                        order: 1 !important;
                        min-height: 220px !important;
                        max-height: 260px;
                    }
                    .proj-content {
                        order: 2 !important;
                        padding: 1.75rem 1.5rem !important;
                        min-height: unset !important;
                    }
                    .proj-title {
                        font-size: clamp(1.1rem, 5vw, 1.4rem) !important;
                        margin-bottom: 1rem !important;
                    }
                    /* Spread tabs evenly — all 4 words fit on one line */
                    .star-tabs {
                        gap: 0.25rem !important;
                        justify-content: space-between !important;
                        flex-wrap: nowrap !important;
                    }
                    .star-tab-btn {
                        font-size: clamp(0.65rem, 2.2vw, 0.78rem) !important;
                        letter-spacing: 0.06em !important;
                        padding: 0.4rem 0 !important;
                        flex: 1 !important;
                        text-align: center !important;
                    }
                    .star-text {
                        font-size: clamp(0.82rem, 2.8vw, 0.95rem) !important;
                        line-height: 1.65 !important;
                        margin-top: 1rem !important;
                    }
                    .star-body {
                        min-height: 100px;
                    }
                }

                /* ── Mobile (≤ 480px) ── */
                @media (max-width: 480px) {
                    .proj-img {
                        min-height: 180px !important;
                        max-height: 220px;
                    }
                    .proj-content {
                        padding: 1.4rem 1.1rem !important;
                    }
                    .proj-title {
                        font-size: clamp(1rem, 5.5vw, 1.2rem) !important;
                    }
                    .star-tabs {
                        gap: 0.1rem !important;
                        margin-bottom: 0.75rem !important;
                    }
                    .star-tab-btn {
                        font-size: clamp(0.6rem, 2.8vw, 0.72rem) !important;
                        letter-spacing: 0.04em !important;
                    }
                    .star-text {
                        font-size: clamp(0.8rem, 3.5vw, 0.9rem) !important;
                        line-height: 1.6 !important;
                    }
                    .star-body {
                        min-height: 90px;
                    }
                }
            `}} />
        </section>
    );
};
