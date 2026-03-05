import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useScrollReveal } from '../hooks/useScrollReveal';

gsap.registerPlugin(ScrollTrigger);

const LifecycleContent = ({ tab, data }) => {
    switch (tab) {
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
                    {['Initiation', 'Planning', 'Execution', 'Closure'].map(tab => (
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
                    <span className="eyebrow-pill animate-eyebrow">03 — Work</span>
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
                        title="myGov ITSM Ecosystem Lifecycle"
                        defaultTab="Initiation"
                        isReversed={false}
                        imageSrc="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                        data={{
                            initiation: "The a2i myGov project necessitated a robust, scalable ITSM infrastructure. I gathered high-level requirements from key stakeholders to define project scope and critical success constraints.",
                            planning: "As Project Manager, I architected the delivery roadmap, translating complex organizational needs into actionable Agile sprints and mitigating resource bottlenecks before deployment.",
                            execution: "I orchestrated cross-functional development and support teams throughout the rollout, enforcing strict Service Level Agreements (SLAs) and generating executive progress dashboards.",
                            closure: "Successfully launched the streamlined ecosystem on schedule, handing over a fully documented operational framework that permanently elevated national portal support standards."
                        }}
                    />

                    {/* Project 2 (Asymmetrical Reverse) */}
                    <ProjectCard
                        title="National Portal Delivery Coordination"
                        defaultTab="Closure"
                        isReversed={true}
                        imageSrc="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                        data={{
                            initiation: "Critical government websites faced imminent launch deadlines complicated by sudden scope creep, disjointed team communication, and undefined QA benchmarks.",
                            planning: "I immediately centralized project documentation, established stringent QA validation criteria against the Business Requirement Document (BRD), and aligned support metrics with development sprint goals.",
                            execution: "Coordinating multi-disciplinary teams, I implemented a rigorous multi-stage QA process, tracking issue resolution velocity and continuously optimizing resource bandwidth during peak delivery phases.",
                            closure: "Achieved seamless, on-time launch cycles with drastically reduced post-deployment friction through meticulous timeline management and strict requirement validation."
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
