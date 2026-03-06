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
    const teamRef = useRef(null);

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
                    gsap.to(csatRef.current, { innerHTML: 99, duration: 2, ease: 'power2.out', snap: { innerHTML: 1 } });
                    gsap.to(teamRef.current, { innerHTML: 25, duration: 2, ease: 'power2.out', snap: { innerHTML: 1 } });
                    gsap.to(npsRef.current, { innerHTML: 4, duration: 2, ease: 'power2.out', snap: { innerHTML: 1 } });
                    gsap.to(ahtRef.current, { innerHTML: 2, duration: 2, ease: 'power2.out', snap: { innerHTML: 1 } });
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
                        marginBottom: '2.5rem',
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
                        <span className="eyebrow" style={{ marginBottom: '0.75rem' }}>Leadership Philosophy</span>
                        <p style={{
                            color: 'rgba(250,250,250,0.88)',
                            fontSize: 'clamp(1rem, 1.4vw, 1.1rem)',
                            lineHeight: 1.85,
                            marginBottom: 0,
                            maxWidth: '99%',
                            // textAlign: 'justify',
                        }}>
                            As a Project Coordinator and Support Manager for the national myGov ITSM initiative, my leadership philosophy is anchored in driving seamless system implementation and reliable service delivery. I believe that successfully onboarding government agencies requires careful requirement gathering, rigorous stakeholder alignment, and proactive IT support. By bridging the gap between the core technology platform and public sector agencies, I ensure smooth adoption and stable daily operations. For me, transparent communication, multi-layered support, and strict SLA adherence are the true drivers of project success.
                        </p>
                    </article>

                    {/* Card 2: Square - Metrics */}
                    <article ref={addToRefs} className="interactive-element glass-card" style={{
                        gridColumn: 'span 4',
                        borderRadius: '24px',
                        padding: '2.5rem',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-start',
                    }}>
                        <span className="eyebrow">Key Impact Metrics</span>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginTop: '2.5rem' }}>
                            <div>
                                <div className="impact-number" style={{ fontSize: '3.5rem', fontWeight: 700, lineHeight: 1, fontFamily: 'var(--font-heading)', color: '#FAFAFA' }}><span ref={csatRef}>0</span>%</div>
                                <div style={{ color: '#a1a1aa', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '0.5rem' }}>SLA Compliance</div>
                            </div>
                            <div>
                                <div className="impact-number" style={{ fontSize: '3.5rem', fontWeight: 700, lineHeight: 1, fontFamily: 'var(--font-heading)', color: '#FAFAFA' }}>+<span ref={teamRef}>0</span></div>
                                <div style={{ color: '#a1a1aa', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '0.5rem' }}>Team Members Coordinated</div>
                            </div>
                            <div>
                                <div className="impact-number" style={{ fontSize: '3.5rem', fontWeight: 700, lineHeight: 1, fontFamily: 'var(--font-heading)', color: '#FAFAFA' }}>+<span ref={npsRef}>0</span></div>
                                <div style={{ color: '#a1a1aa', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '0.5rem' }}>Years IT Experience</div>
                            </div>
                            <div>
                                <div className="impact-number" style={{ fontSize: '3.5rem', fontWeight: 700, lineHeight: 1, fontFamily: 'var(--font-heading)', color: '#FAFAFA' }}><span ref={ahtRef}>0</span></div>
                                <div style={{ color: '#a1a1aa', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '0.5rem' }}>National Govt. Projects</div>
                            </div>
                        </div>
                    </article>

                    {/* Card 3: Square - Platforms */}
                    <article ref={addToRefs} className="interactive-element glass-card" style={{
                        gridColumn: 'span 4',
                        borderRadius: '24px',
                        padding: '2.5rem',
                        display: 'flex',
                        flexDirection: 'column',
                    }}>
                        <span className="eyebrow" style={{ marginBottom: '2.5rem' }}>Tools & Platforms</span>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', justifyContent: 'flex-start' }}>
                            {[
                                'myGov ITSM Ecosystem',
                                'National Portal Framework',
                                'Jira Service Management',
                                'MS Excel (Advanced)',
                                'Wordpress',
                                'OTRS Support System'
                            ].map(tool => (
                                <div key={tool} className="glass-inner focus-card" style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', padding: '1.2rem 1.5rem', opacity: 0.9 }}>
                                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--accent)', boxShadow: '0 0 10px rgba(190, 169, 142, 0.5)' }}></div>
                                    <span className="tool-name" style={{ fontSize: '1rem', fontWeight: 600, color: '#FAFAFA' }}>{tool}</span>
                                </div>
                            ))}
                        </div>
                    </article>

                    {/* Card 4: Rectangle - Methodologies */}
                    <article ref={addToRefs} className="interactive-element glass-card" style={{
                        gridColumn: 'span 4',
                        borderRadius: '24px',
                        padding: '2.5rem',
                        display: 'flex',
                        flexDirection: 'column',
                    }}>
                        <span className="eyebrow" style={{ marginBottom: '2.5rem' }}>Core Focus Areas</span>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', justifyContent: 'flex-start' }}>
                            <div className="glass-inner focus-card" style={{ padding: '1.5rem' }}>
                                <h4 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#FAFAFA' }}>System Implementation &amp; Onboarding</h4>
                                <p style={{ color: '#a1a1aa', fontSize: '0.95rem', lineHeight: 1.5, margin: 0 }}>Leading ITSM implementations from requirement gathering to system configuration and user training.</p>
                            </div>
                            <div className="glass-inner focus-card" style={{ padding: '1.5rem' }}>
                                <h4 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#FAFAFA' }}>Stakeholder Communication &amp; Reporting</h4>
                                <p style={{ color: '#a1a1aa', fontSize: '0.95rem', lineHeight: 1.5, margin: 0 }}>Aligning technical teams and stakeholders using business analysis and data-driven reporting.</p>
                            </div>
                            <div className="glass-inner focus-card" style={{ padding: '1.5rem' }}>
                                <h4 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#FAFAFA' }}>IT Service Management (ITSM)</h4>
                                <p style={{ color: '#a1a1aa', fontSize: '0.95rem', lineHeight: 1.5, margin: 0 }}>Managing 24/7 support teams and incident protocols to consistently surpass SLAs.</p>
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
                
                /* Premium Design Tweaks */
                #expertise .eyebrow {
                    letter-spacing: 0.1em; /* Increased tracking for readability */
                    display: inline-block;
                }
                
                .focus-card {
                    transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.4s ease, border-color 0.4s ease !important;
                }
                
                .focus-card:hover {
                    transform: scale(1.03) translateY(-4px);
                    background: rgba(255, 255, 255, 0.04);
                    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(190, 169, 142, 0.2) inset;
                    border-color: rgba(190, 169, 142, 0.45) !important;
                }
            `}} />
        </section>
    );
};
