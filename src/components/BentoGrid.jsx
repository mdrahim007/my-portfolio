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
                    gsap.to(csatRef.current, { innerHTML: 99, duration: 2, ease: 'power2.out', snap: { innerHTML: 1 } });
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
                            fontSize: 'clamp(1rem, 1.4vw, 1.15rem)',
                            lineHeight: 1.85,
                            marginBottom: 0,
                            maxWidth: '100%',
                            // textAlign: 'justify',
                        }}>
                            As a Project Coordinator and Support Manager, I believe successful IT implementation relies on clear communication, practical problem solving, and reliable daily support. My approach focuses on taking complex systems and making them easy for government agencies to adopt and use. Managing the myGov ITSM project has reinforced my core belief: <span className="text-highlight">strong team coordination, proactive risk management, and accurate reporting are the true drivers of project success.</span>
                        </p>
                    </article>

                    {/* Card 2: Square - Metrics */}
                    <article ref={addToRefs} className="interactive-element glass-card" style={{
                        gridColumn: 'span 4',
                        borderRadius: '24px',
                        padding: '3rem',
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
                                <div className="impact-number" style={{ fontSize: '3.5rem', fontWeight: 700, lineHeight: 1, fontFamily: 'var(--font-heading)', color: '#FAFAFA' }}>+<span ref={npsRef}>0</span></div>
                                <div style={{ color: '#a1a1aa', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '0.5rem' }}>Years IT Experience</div>
                            </div>
                            <div>
                                <div className="impact-number" style={{ fontSize: '3.5rem', fontWeight: 700, lineHeight: 1, fontFamily: 'var(--font-heading)', color: '#FAFAFA' }}><span ref={ahtRef}>0</span></div>
                                <div style={{ color: '#a1a1aa', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '0.5rem' }}>National Gov Projects</div>
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
                        <span className="eyebrow" style={{ marginBottom: '2.5rem' }}>Tools & Platforms</span>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', justifyContent: 'flex-start' }}>
                            {[
                                { name: 'myGov ITSM System', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg> },
                                { name: 'National Portal Framework', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg> },
                                { name: 'Jira / Confluence', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg> },
                                { name: 'MS Excel (Advanced)', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><path d="M8 13h2"></path><path d="M8 17h2"></path><path d="M14 13h2"></path><path d="M14 17h2"></path></svg> },
                                { name: 'Wordpress', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a6 6 0 0 0-6 6v1a6 6 0 0 0 6 6h1a6 6 0 0 0 6-6V8a6 6 0 0 0-6-6H9"></path><path d="M16.5 10.5 12 16l-4.5-5.5"></path></svg> }
                            ].map(tool => (
                                <div key={tool.name} className="glass-inner focus-card" style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', padding: '1.2rem 1.5rem', opacity: 0.9 }}>
                                    <div style={{ color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {tool.icon}
                                    </div>
                                    <span className="tool-name" style={{ fontSize: '1rem', fontWeight: 600, color: '#FAFAFA' }}>{tool.name}</span>
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
                        <span className="eyebrow" style={{ marginBottom: '2.5rem' }}>Core Focus Areas</span>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', justifyContent: 'flex-start' }}>
                            <div className="glass-inner focus-card" style={{ padding: '1.5rem' }}>
                                <h4 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#FAFAFA' }}>Implementation &amp; Onboarding</h4>
                                <p style={{ color: '#a1a1aa', fontSize: '0.95rem', lineHeight: 1.5, margin: 0 }}>Managing the practical setup of IT systems for government agencies, including system configuration and live user training.</p>
                            </div>
                            <div className="glass-inner focus-card" style={{ padding: '1.5rem' }}>
                                <h4 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#FAFAFA' }}>Stakeholder Reporting</h4>
                                <p style={{ color: '#a1a1aa', fontSize: '0.95rem', lineHeight: 1.5, margin: 0 }}>Building clear reporting systems to provide executives and government clients with accurate updates on project health and team performance.</p>
                            </div>
                            <div className="glass-inner focus-card" style={{ padding: '1.5rem' }}>
                                <h4 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#FAFAFA' }}>SLA &amp; Operations Management</h4>
                                <p style={{ color: '#a1a1aa', fontSize: '0.95rem', lineHeight: 1.5, margin: 0 }}>Handling daily support tasks and solving problems early to ensure our call center and support teams strictly meet client service agreements.</p>
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
