import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useScrollReveal } from '../hooks/useScrollReveal';

gsap.registerPlugin(ScrollTrigger);

const EXPERIENCES = [
    {
        id: 1,
        side: 'right',
        index: '01',
        role: 'Project Coordinator & Support Manager',
        company: 'UY Systems Ltd.',
        period: 'Dec 2023 — Present',
        tag: 'Current',
        summary: 'Leading implementation and support teams for the national myGov ITSM initiative, ensuring smooth daily operations and 99% SLA compliance across government agencies.',
    },
    {
        id: 2,
        side: 'left',
        index: '02',
        role: 'Sr. Executive (Implementation & Support)',
        company: 'Business Automation Ltd.',
        period: 'Mar 2021 — Nov 2023',
        tag: null,
        summary: 'Guided support operations, managed client inquiries, and delivered comprehensive user training for the National Portal Framework.',
    },
    {
        id: 3,
        side: 'right',
        index: '03',
        role: 'Data Entry Operator',
        company: 'Chhinnamukul Bangladesh',
        period: 'Jul 2018 — Nov 2019',
        tag: null,
        summary: 'Managed high-precision data entry and quality control processes for the national Basic Literacy Project.',
    },
];

export const Experience = () => {
    const sectionRef = useRef(null);
    const spineRef = useRef(null);
    const cardRefs = useRef([]);
    const nodeRefs = useRef([]);

    useScrollReveal(sectionRef);

    useEffect(() => {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) return;

        // Spine draws itself downward
        gsap.fromTo(spineRef.current,
            { scaleY: 0, transformOrigin: 'top center' },
            {
                scaleY: 1,
                duration: 2,
                ease: 'power2.inOut',
                scrollTrigger: { trigger: spineRef.current, start: 'top 75%' },
            }
        );

        // Cards slide in from their side
        cardRefs.current.forEach((card, i) => {
            if (!card) return;
            const fromLeft = EXPERIENCES[i]?.side === 'left';
            gsap.fromTo(card,
                { opacity: 0, x: fromLeft ? -50 : 50 },
                {
                    opacity: 1, x: 0,
                    duration: 0.85,
                    ease: 'power3.out',
                    scrollTrigger: { trigger: card, start: 'top 88%' },
                }
            );
        });

        // Nodes pop in
        nodeRefs.current.forEach((node, i) => {
            if (!node) return;
            gsap.fromTo(node,
                { scale: 0, opacity: 0 },
                {
                    scale: 1, opacity: 1,
                    duration: 0.5,
                    ease: 'back.out(1.7)',
                    delay: 0.2,
                    scrollTrigger: { trigger: node, start: 'top 90%' },
                }
            );
        });
    }, []);

    return (
        <section
            id="experience"
            ref={sectionRef}
            className="section-padding"
            style={{ position: 'relative', zIndex: 10 }}
        >
            <div className="global-container">
                {/* ── Header ─────────────────────────── */}
                <div style={{ marginBottom: '0.5rem' }}>
                    <span className="eyebrow-pill animate-eyebrow">03 — Experience</span>
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
                    Professional{' '}
                    <span style={{ color: 'var(--accent)', fontStyle: 'italic', fontWeight: 400 }}>
                        Journey.
                    </span>
                </h2>

                {/* ── Career Summary ─────────────────── */}
                <p className="exp-career-summary">
                    With over four years in the IT industry, I specialize in coordinating large-scale government technology projects from the ground up. I lead implementation teams and manage daily support operations to ensure critical systems run smoothly. My goal is always to make complex technical solutions easy for stakeholders to adopt and rely on every single day.
                </p>

                {/* ── Timeline ───────────────────────── */}
                <div className="exp-track">
                    <div className="exp-spine" ref={spineRef} />

                    {EXPERIENCES.map((exp, i) => (
                        <div key={exp.id} className={`exp-row exp-row--${exp.side}`}>

                            {/* Card */}
                            <div
                                className={`exp-card-col`}
                                ref={el => cardRefs.current[i] = el}
                            >
                                <article className="exp-card glass-card interactive-element">
                                    <div className="exp-card-inner">
                                        {exp.tag && (
                                            <span className="exp-tag">{exp.tag}</span>
                                        )}
                                        <h3 className="exp-role">{exp.role}</h3>
                                        <div className="exp-meta">
                                            <span className="exp-company">{exp.company}</span>
                                            <span className="exp-meta-sep" />
                                            <span className="exp-period">{exp.period}</span>
                                        </div>
                                        <p className="exp-summary">{exp.summary}</p>
                                    </div>
                                    {/* Glow edge — direction-aware */}
                                    <div className={`exp-card-glow exp-card-glow--${exp.side}`} />
                                </article>
                            </div>

                            {/* Central Node */}
                            <div
                                className="exp-node-col"
                                ref={el => nodeRefs.current[i] = el}
                            >
                                <div className="exp-node">
                                    <div className="exp-node-outer">
                                        <div className="exp-node-inner">
                                            <span className="exp-node-num">{exp.index}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Opposite spacer */}
                            <div className="exp-spacer-col" />
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
                /* ── Career Summary ────────────────────────── */
                .exp-career-summary {
                    max-width: 100%;
                    color: rgba(250,250,250,0.5);
                    font-size: clamp(0.95rem, 1.2vw, 1.05rem);
                    line-height: 1.8;
                    margin: 0 0 3.5rem;
                    letter-spacing: 0.01em;
                }

                /* ── Outer container ───────────────────────── */
                .exp-track {
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    align-items: stretch;
                }

                /* ── Central spine ─────────────────────────── */
                .exp-spine {
                    position: absolute;
                    left: 50%;
                    top: 0;
                    bottom: 0;
                    width: 1px;
                    transform: translateX(-50%);
                    background: linear-gradient(
                        to bottom,
                        transparent,
                        rgba(190,169,142,0.5) 10%,
                        rgba(190,169,142,0.25) 80%,
                        transparent
                    );
                    z-index: 0;
                }

                /* ── Row ───────────────────────────────────── */
                .exp-row {
                    display: grid;
                    grid-template-columns: 1fr 64px 1fr;
                    align-items: center;
                    margin-bottom: 2.5rem;
                    position: relative;
                    z-index: 1;
                }

                /* Right-side card */
                .exp-row--right .exp-card-col   { grid-column: 3; grid-row: 1; padding-left: 2.5rem; }
                .exp-row--right .exp-node-col   { grid-column: 2; grid-row: 1; }
                .exp-row--right .exp-spacer-col { grid-column: 1; grid-row: 1; }

                /* Left-side card */
                .exp-row--left .exp-card-col    { grid-column: 1; grid-row: 1; padding-right: 2.5rem; text-align: right; }
                .exp-row--left .exp-node-col    { grid-column: 2; grid-row: 1; }
                .exp-row--left .exp-spacer-col  { grid-column: 3; grid-row: 1; }

                /* ── Node ──────────────────────────────────── */
                .exp-node-col {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }

                .exp-node-outer {
                    width: 48px;
                    height: 48px;
                    border-radius: 50%;
                    border: 1.5px solid rgba(190,169,142,0.35);
                    background: rgba(10,10,10,0.9);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: border-color 0.3s ease, box-shadow 0.3s ease;
                    z-index: 2;
                    position: relative;
                }

                .exp-row:hover .exp-node-outer {
                    border-color: var(--accent);
                    box-shadow: 0 0 24px rgba(190,169,142,0.3);
                }

                .exp-node-inner {
                    width: 28px;
                    height: 28px;
                    border-radius: 50%;
                    background: rgba(190,169,142,0.08);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .exp-node-num {
                    font-size: 0.65rem;
                    font-weight: 700;
                    letter-spacing: 0.05em;
                    color: var(--accent);
                    font-family: var(--font-heading);
                }

                /* ── Card ──────────────────────────────────── */
                .exp-card {
                    border-radius: 16px;
                    padding: 2rem 2.25rem;
                    position: relative;
                    overflow: hidden;
                }

                .exp-card-inner {
                    position: relative;
                    z-index: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 0.6rem;
                }

                /* Direction-aware glow edge */
                .exp-card-glow {
                    position: absolute;
                    top: 0; bottom: 0;
                    width: 3px;
                    background: linear-gradient(to bottom, var(--accent), transparent);
                    opacity: 0.5;
                    transition: opacity 0.3s ease;
                }
                .exp-card-glow--right { left: 0; border-radius: 16px 0 0 16px; }
                .exp-card-glow--left  { right: 0; border-radius: 0 16px 16px 0; }
                .exp-card:hover .exp-card-glow { opacity: 1; }

                /* ── Tag ───────────────────────────────────── */
                .exp-tag {
                    display: inline-flex;
                    align-self: flex-start;
                    font-size: 0.65rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.14em;
                    color: var(--accent);
                    background: rgba(190,169,142,0.08);
                    border: 1px solid rgba(190,169,142,0.2);
                    border-radius: 100px;
                    padding: 0.18rem 0.7rem;
                }

                /* Left-side: align tag to right */
                .exp-row--left .exp-tag { align-self: flex-end; }

                /* ── Role ──────────────────────────────────── */
                .exp-role {
                    font-size: clamp(1rem, 1.6vw, 1.25rem);
                    font-family: var(--font-heading);
                    font-weight: 600;
                    color: var(--text-primary);
                    letter-spacing: -0.02em;
                    line-height: 1.3;
                    margin: 0;
                }

                /* ── Meta row ──────────────────────────────── */
                .exp-meta {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    flex-wrap: wrap;
                }

                .exp-row--left .exp-meta { justify-content: flex-end; }

                .exp-company {
                    color: rgba(190,169,142,0.85);
                    font-weight: 600;
                    font-size: 0.85rem;
                }

                .exp-meta-sep {
                    width: 3px;
                    height: 3px;
                    border-radius: 50%;
                    background: rgba(255,255,255,0.2);
                    flex-shrink: 0;
                }

                .exp-period {
                    color: rgba(255,255,255,0.35);
                    font-size: 0.82rem;
                }

                /* ── Summary ───────────────────────────────── */
                .exp-summary {
                    color: rgba(250,250,250,0.6);
                    font-size: 0.9rem;
                    line-height: 1.7;
                    margin: 0;
                    margin-top: 0.25rem;
                }

                /* ── Mobile ────────────────────────────────── */
                @media (max-width: 768px) {
                    /* Spine hugs the left edge */
                    .exp-spine { left: 20px; }

                    /* All rows collapse to a simple left-node + card flex row */
                    .exp-row,
                    .exp-row--right,
                    .exp-row--left {
                        display: flex;
                        flex-direction: row;
                        align-items: flex-start;
                        gap: 1.25rem;
                        margin-bottom: 2rem;
                    }

                    /* Hide the empty spacer column */
                    .exp-spacer-col { display: none; }

                    /* Node always on the left */
                    .exp-node-col { order: 0; flex-shrink: 0; margin-top: 0.25rem; }
                    .exp-node-outer { width: 40px; height: 40px; }
                    .exp-node-inner { width: 24px; height: 24px; }

                    /* Card always on the right — zero ALL directional padding */
                    .exp-card-col,
                    .exp-row--right .exp-card-col,
                    .exp-row--left .exp-card-col {
                        order: 1;
                        flex: 1;
                        text-align: left;
                        padding: 0 !important;
                    }

                    /* Card inner padding */
                    .exp-card { padding: 1.25rem 1.25rem; }

                    /* Always show glow on left edge on mobile */
                    .exp-card-glow,
                    .exp-card-glow--left,
                    .exp-card-glow--right {
                        left: 0;
                        right: unset;
                        border-radius: 16px 0 0 16px;
                    }

                    /* Left-side cards: reset right-aligned text/tag/meta */
                    .exp-row--left .exp-meta,
                    .exp-row--left .exp-tag { justify-content: flex-start; align-self: flex-start; }
                    .exp-row--left .exp-card-col { text-align: left; }
                }

                /* ── Small mobile tweak ─────────────────────── */
                @media (max-width: 400px) {
                    .exp-career-summary { font-size: 0.9rem; }
                    .exp-role { font-size: 1rem; }
                }
            `}</style>
        </section>
    );
};
