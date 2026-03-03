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
                minHeight: '100vh',
                position: 'relative',
                zIndex: 10,
            }}
        >
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                <span className="eyebrow-pill animate-eyebrow">02 — Expertise</span>
                <h2
                    className="animate-heading"
                    style={{
                        fontSize: 'clamp(2.2rem, 4.5vw, 4rem)',
                        marginBottom: '0.5rem',
                        letterSpacing: '-0.02em',
                    }}
                >
                    Core Competencies & Impact
                </h2>
                <hr className="section-rule animate-rule" />

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
                        <p style={{ fontSize: 'clamp(1rem, 1.1vw, 1.15rem)', lineHeight: 1.8, color: 'var(--text-primary)', fontWeight: 300, fontFamily: 'var(--font-heading)' }}>
                            As a Support Manager and ITSM Implementation Head, I believe great support operations are built on two foundations: empowered people and disciplined systems. My approach centers on cultivating teams that resolve issues with genuine ownership — not just compliance — while designing escalation frameworks, SLA structures, and knowledge architectures that scale without losing the human touch. Leading the myGov ITSM implementation reinforced a core lesson: technical rollouts succeed only when the support layer is fully prepared to absorb change. <span style={{ color: '#bea98e', fontStyle: 'italic' }}>Precision, continuous improvement, and empathy at every tier are not ideals — they are operational standards I enforce daily.</span>
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
                                <div style={{ fontSize: '4rem', fontWeight: 700, lineHeight: 1, fontFamily: 'var(--font-heading)', color: '#FAFAFA' }}><span ref={csatRef}>0</span>%</div>
                                <div style={{ color: '#a1a1aa', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '0.5rem' }}>SLA Compliance</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '4rem', fontWeight: 700, lineHeight: 1, fontFamily: 'var(--font-heading)', color: '#FAFAFA' }}>+<span ref={npsRef}>0</span></div>
                                <div style={{ color: '#a1a1aa', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '0.5rem' }}>Team Members Mentored</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '4rem', fontWeight: 700, lineHeight: 1, fontFamily: 'var(--font-heading)', color: '#FAFAFA' }}><span ref={ahtRef}>0</span>%</div>
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
                                    <span style={{ fontSize: '1.1rem', fontWeight: 600, color: '#FAFAFA' }}>{tool}</span>
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
                                <h4 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#FAFAFA' }}>QA & Requirement Validation</h4>
                                <p style={{ color: '#a1a1aa', fontSize: '0.95rem', lineHeight: 1.5 }}>Executing manual testing procedures to verify government website functionality against requirements.</p>
                            </div>
                            <div className="glass-inner" style={{ padding: '1.5rem' }}>
                                <h4 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#FAFAFA' }}>SLA Coordination</h4>
                                <p style={{ color: '#a1a1aa', fontSize: '0.95rem', lineHeight: 1.5 }}>Coordinating daily operations and multi-channel support to ensure Service Level Agreements are met.</p>
                            </div>
                            <div className="glass-inner" style={{ padding: '1.5rem' }}>
                                <h4 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#FAFAFA' }}>Data-Driven Reporting</h4>
                                <p style={{ color: '#a1a1aa', fontSize: '0.95rem', lineHeight: 1.5 }}>Managing all reporting requirements, generating detailed progress reports and performance metrics.</p>
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
                    #expertise > div > div > article {
                        grid-column: span 12 !important;
                    }
                }
            `}} />
        </section>
    );
};
