import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useScrollReveal } from '../hooks/useScrollReveal';

gsap.registerPlugin(ScrollTrigger);

export const BentoGrid = () => {
    // Refs for cards and numbers
    const sectionRef = useRef(null);
    const cardRefs = useRef([]);
    const csatRef = useRef(null);
    const npsRef = useRef(null);
    const ahtRef = useRef(null);

    // Shared scroll reveals (eyebrow, heading, section-rule)
    useScrollReveal(sectionRef);

    useEffect(() => {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (!prefersReducedMotion) {
            // Card Stagger Animation
            cardRefs.current.forEach((card, index) => {
                gsap.fromTo(
                    card,
                    {
                        clipPath: 'inset(100% 0% 0% 0% round 20px)',
                        opacity: 0,
                    },
                    {
                        clipPath: 'inset(0% 0% 0% 0% round 20px)',
                        opacity: 1,
                        duration: 1.0,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: card,
                            start: 'top 88%',
                            toggleActions: 'play none none none',
                        },
                        delay: index * 0.08,
                    }
                );
            });

            // Number Counter Animation
            ScrollTrigger.create({
                trigger: csatRef.current,
                start: 'top 85%',
                onEnter: () => {
                    gsap.to(csatRef.current, { innerHTML: 98, duration: 2, ease: 'power2.out', snap: { innerHTML: 1 } });
                    gsap.to(npsRef.current, { innerHTML: 75, duration: 2, ease: 'power2.out', snap: { innerHTML: 1 } });
                    gsap.to(ahtRef.current, { innerHTML: 40, duration: 2, ease: 'power2.out', snap: { innerHTML: 1 } });
                },
                once: true
            });
        }
    }, []);

    const addToRefs = (el) => {
        if (el && !cardRefs.current.includes(el)) {
            cardRefs.current.push(el);
        }
    };

    return (
        <section
            id="expertise"
            ref={sectionRef}
            className="section-padding"
            style={{
                position: 'relative',
                zIndex: 10,
            }}
        >
            <div className="global-container">
                <div style={{ marginBottom: '0.5rem' }}>
                    <span className="eyebrow-pill animate-eyebrow">02 — Expertise</span>
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
                    Core Competencies <span style={{ color: 'var(--accent)', fontStyle: 'italic', fontWeight: 400 }}>& Impact.</span>
                </h2>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(12, 1fr)',
                    gap: '1.5rem',
                    autoRows: 'minmax(300px, auto)'
                }}>
                    {/* Card 1: Top Wide - Philosophy */}
                    <article ref={addToRefs} className="interactive-element glass-card" style={{
                        gridColumn: 'span 12',
                        borderRadius: '24px',
                        padding: '3rem 4rem',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-start',
                        gap: '1rem',
                    }}>
                        <span className="eyebrow" style={{ marginBottom: '1.25rem' }}>Leadership Philosophy</span>
                        <p style={{
                            color: 'rgba(250,250,250,0.88)',
                            fontSize: 'clamp(0.85rem, 1.2vw, 0.95rem)',
                            lineHeight: 1.8,
                            marginBottom: 0,
                        }}>
                            Operating as a Project Manager and Coordinator, I believe successful technical rollouts demand a seamless convergence of Agile methodology, rigorous stakeholder alignment, and proactive risk mitigation. My approach breaks down complex initiatives into actionable sprints, bridging cross-functional silos through exhaustive documentation and continuous progress reporting. Steering the myGov ITSM implementation reinforced my core belief: <span className="text-highlight">precision, transparent communication, and dynamic resource allocation are not ideals — they are project standards I enforce daily.</span>
                        </p>
                    </article>

                    {/* Card 2: Square - Metrics */}
                    <article ref={addToRefs} className="interactive-element glass-card" style={{
                        gridColumn: 'span 4',
                        borderRadius: '24px',
                        padding: '3rem',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                    }}>
                        <span className="eyebrow">Key Impact Metrics</span>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginTop: '2.5rem' }}>
                            <div>
                                <div className="impact-number" style={{ fontSize: '4rem', fontWeight: 700, lineHeight: 1, fontFamily: 'var(--font-heading)', color: '#FAFAFA' }}><span ref={csatRef}>0</span>%</div>
                                <div style={{ color: '#a1a1aa', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '0.5rem' }}>SLA Compliance</div>
                            </div>
                            <div>
                                <div className="impact-number" style={{ fontSize: '4rem', fontWeight: 700, lineHeight: 1, fontFamily: 'var(--font-heading)', color: '#FAFAFA' }}>+<span ref={npsRef}>0</span></div>
                                <div style={{ color: '#a1a1aa', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '0.5rem' }}>Team Members Mentored</div>
                            </div>
                            <div>
                                <div className="impact-number" style={{ fontSize: '4rem', fontWeight: 700, lineHeight: 1, fontFamily: 'var(--font-heading)', color: '#FAFAFA' }}><span ref={ahtRef}>0</span>%</div>
                                <div style={{ color: '#a1a1aa', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '0.5rem' }}>Data Precision</div>
                            </div>
                        </div>
                    </article>

                    {/* Card 3: Square - Platforms */}
                    <article ref={addToRefs} className="interactive-element glass-card" style={{
                        gridColumn: 'span 4',
                        borderRadius: '24px',
                        padding: '3rem',
                        display: 'flex',
                        flexDirection: 'column',
                    }}>
                        <span className="eyebrow" style={{ marginBottom: '2rem' }}>Tools & Platforms</span>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', flexGrow: 1, justifyContent: 'center' }}>
                            {['myGov ITSM Ecosystem', 'Zendesk Suite', 'Jira Service Management', 'National Portal Framework'].map(tool => (
                                <div key={tool} className="glass-inner" style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', padding: '1.2rem 1.5rem' }}>
                                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#bea98e', boxShadow: '0 0 10px rgba(190, 169, 142, 0.5)' }}></div>
                                    <span className="tool-name" style={{ fontSize: '1.1rem', fontWeight: 600, color: '#FAFAFA' }}>{tool}</span>
                                </div>
                            ))}
                        </div>
                    </article>

                    {/* Card 4: Rectangle - Methodologies */}
                    <article ref={addToRefs} className="interactive-element glass-card" style={{
                        gridColumn: 'span 4',
                        borderRadius: '24px',
                        padding: '3rem',
                        display: 'flex',
                        flexDirection: 'column',
                    }}>
                        <span className="eyebrow" style={{ marginBottom: '2rem' }}>Methodologies</span>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', flexGrow: 1, justifyContent: 'center' }}>
                            <div className="glass-inner" style={{ padding: '1.5rem' }}>
                                <h4 style={{ color: '#FAFAFA', fontSize: '1rem', letterSpacing: '-0.01em', marginBottom: '0.6rem', lineHeight: 1.3 }}>
                                    Agile &amp; Waterfall <br />Delivery
                                </h4>
                                <p style={{ color: 'rgba(250,250,250,0.5)', fontSize: '0.82rem', lineHeight: 1.6, margin: 0 }}>
                                    Adapting hybrid lifecycle models to execute iterative sprints while preserving fixed critical milestones.
                                </p></div>
                            <div className="glass-inner" style={{ padding: '1.5rem' }}>
                                <h4 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#FAFAFA' }}>Stakeholder Management</h4>
                                <p style={{ color: '#a1a1aa', fontSize: '0.95rem', lineHeight: 1.5 }}>Aligning cross-functional priorities, facilitating communication, and delivering executive progress dashboards.</p>
                            </div>
                            <div className="glass-inner" style={{ padding: '1.5rem' }}>
                                <h4 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#FAFAFA' }}>Risk &amp; Resource Allocation</h4>
                                <p style={{ color: '#a1a1aa', fontSize: '0.95rem', lineHeight: 1.5 }}>Proactively identifying scope creep, managing bottlenecks, and optimizing team bandwidth.</p>
                            </div>
                        </div>
                    </article>

                </div>
            </div>

            {/* Mobile Responsive overrides for this specific grid */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @media (max-width: 1200px) {
                    #expertise > div > div > article {
                        grid-column: span 6 !important;
                    }
                    #expertise > div > div > article:first-child {
                        grid-column: span 12 !important;
                    }
                }
                @media (max-width: 900px) {
                    #expertise {
                        min-height: auto !important;
                    }
                    #expertise > div > div {
                        gap: 1rem !important;
                    }
                    #expertise > div > div > article {
                        grid-column: span 12 !important;
                        padding: 2rem 1.5rem !important;
                        border-radius: 16px !important;
                        min-height: auto !important;
                    }
                    #expertise > div > div > article:first-child p {
                        font-size: 0.92rem !important;
                        line-height: 1.7 !important;
                    }
                    #expertise .eyebrow {
                        font-size: 0.7rem !important;
                    }
                    #expertise h2 {
                        font-size: clamp(1.6rem, 6vw, 2.2rem) !important;
                    }
                    .tool-name {
                        font-size: 0.82rem !important;
                    }
                }
                @media (max-width: 480px) {
                    #expertise > div > div > article {
                        padding: 1.5rem 1.2rem !important;
                    }
                    #expertise > div > div > article .glass-inner {
                        padding: 1rem !important;
                    }
                    #expertise > div > div > article .glass-inner h4 {
                        font-size: 1rem !important;
                    }
                    #expertise > div > div > article .glass-inner p {
                        font-size: 0.85rem !important;
                    }
                    .impact-number {
                        font-size: 2rem !important;
                    }
                    .tool-name {
                        font-size: 0.75rem !important;
                    }
                }
            `}} />
        </section>
    );
};
