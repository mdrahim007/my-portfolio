import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useScrollReveal } from '../hooks/useScrollReveal';

gsap.registerPlugin(ScrollTrigger);

const StarContent = ({ tab, data }) => {
    switch (tab) {
        case 'Situation':
            return <p style={{ color: '#c4c4c4', lineHeight: 1.75, marginTop: '1.25rem', fontSize: '1.05rem' }}>{data.situation}</p>;
        case 'Task':
            return <p style={{ color: '#c4c4c4', lineHeight: 1.75, marginTop: '1.25rem', fontSize: '1.05rem' }}>{data.task}</p>;
        case 'Action':
            return <p style={{ color: '#c4c4c4', lineHeight: 1.75, marginTop: '1.25rem', fontSize: '1.05rem' }}>{data.action}</p>;
        case 'Result':
            return <p style={{ color: '#FAFAFA', lineHeight: 1.75, marginTop: '1.25rem', fontWeight: 500, fontSize: '1.05rem' }}>{data.result}</p>;
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
            className="interactive-element"
            style={{
                display: 'grid',
                gridTemplateColumns: isReversed ? '1fr 1.2fr' : '1.2fr 1fr',
                gap: '0', // Flush edges
                backgroundColor: 'var(--bg-surface)',
                borderRadius: '24px',
                overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.05)',
                transition: 'background-color 0.3s ease, border-color 0.3s ease',
                cursor: 'none' // Custom cursor handles it
            }}
            onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#383838'; // Slightly brighten surface
                e.currentTarget.style.borderColor = 'rgba(190, 169, 142, 0.3)';
                const img = cardRef.current.querySelector('img');
                if (img) img.style.transform = 'scale(1.05)';
            }}
            onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--bg-surface)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                const img = cardRef.current.querySelector('img');
                if (img) img.style.transform = 'scale(1)';
            }}
        >
            {/* Image Container - Using flex-order to easily reverse layout on desktop while keeping DOM semantic */}
            <div style={{ order: isReversed ? 2 : 1, overflow: 'hidden', position: 'relative', minHeight: '400px' }}>
                <img
                    src={imageSrc}
                    alt={title}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 300ms ease-out', // Smooth 300ms scale
                        filter: 'grayscale(20%)'
                    }}
                />
            </div>

            {/* Content Container */}
            <div style={{ order: isReversed ? 1 : 2, padding: '4rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <h3 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', color: 'var(--text-primary)', marginBottom: '2rem', lineHeight: 1.2 }}>
                    {title}
                </h3>

                {/* STAR Tabs */}
                <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>
                    {['Situation', 'Task', 'Action', 'Result'].map(tab => (
                        <button
                            key={tab}
                            className="interactive-element"
                            onClick={() => setActiveTab(tab)}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: activeTab === tab ? '#bea98e' : '#a1a1aa', // Gold if active
                                fontSize: '0.9rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em',
                                fontWeight: activeTab === tab ? 700 : 400,
                                padding: '0.5rem 0',
                                position: 'relative',
                                transition: 'color 0.1s', // Instantaneous feel
                                cursor: 'none'
                            }}
                        >
                            {tab}
                            {/* Active Tab Indicator */}
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
                <div style={{ minHeight: '120px' }}>
                    <StarContent tab={activeTab} data={data} />
                </div>
            </div>
        </article>
    );
};

export const ProjectShowcases = () => {
    const containerRef = useRef(null);

    // Shared scroll reveals for eyebrow, heading, rule
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

                // Image parallax — subtle Y shift as card scrolls through viewport
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
            style={{
                padding: '8rem 5%',
                position: 'relative',
                zIndex: 10,
            }}
        >
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                <span className="eyebrow-pill animate-eyebrow">03 — Work</span>
                <h2
                    className="animate-heading"
                    style={{
                        fontSize: 'clamp(2.2rem, 4.5vw, 4rem)',
                        marginBottom: '0.5rem',
                        letterSpacing: '-0.02em',
                    }}
                >
                    Project Showcases
                </h2>
                <hr className="section-rule animate-rule" />

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6rem' }}>

                    {/* Project 1 */}
                    <ProjectCard
                        title="myGov ITSM Ecosystem Implementation"
                        defaultTab="Situation"
                        isReversed={false}
                        imageSrc="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" // Dashboard placeholder
                        data={{
                            situation: "The a2i myGov project required a robust, scalable ITSM infrastructure to handle multi-channel support inquiries from citizens across the national portal.",
                            task: "I was tasked with leading the Support and Implementation team, deploying the ITSM solutions, and analyzing complex client requirements for system optimization.",
                            action: "I coordinated daily operations to enforce strict SLAs, conducted extensive training sessions on the National Portal Framework, and managed all reporting pipelines.",
                            result: "Successfully established a streamlined support ecosystem with reliable Performance Metrics, clear escalation routing, and highly-trained support staff."
                        }}
                    />

                    {/* Project 2 (Asymmetrical Reverse) */}
                    <ProjectCard
                        title="Government Portal QA & Requirement Validation"
                        defaultTab="Result" // Start on result to show variety
                        isReversed={true}
                        imageSrc="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" // Workflow/Data placeholder
                        data={{
                            situation: "Critical government websites were launching with unforeseen bugs and data inconsistencies, risking public trust.",
                            task: "Ensure flawless functionality of the National Portal by executing manual testing procedures and verifying systems against stringent requirements.",
                            action: "I implemented a rigorous multi-stage QA process, accurately entered/updated data with high precision, and continuously checked data pipelines to correct errors.",
                            result: "Achieved seamless launch cycles with drastically reduced post-deployment issues through meticulous system optimization and requirement validation."
                        }}
                    />

                </div>
            </div>

            {/* Mobile Overrides */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @media (max-width: 900px) {
                    #projects article {
                        grid-template-columns: 1fr !important;
                    }
                    #projects article > div:first-child {
                        min-height: 250px;
                    }
                    #projects article > div:last-child {
                        padding: 2rem;
                    }
                }
            `}} />
        </section>
    );
};
