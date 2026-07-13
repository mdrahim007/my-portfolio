import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useScrollReveal } from '../hooks/useScrollReveal';

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────────────────────────────
   Content renderer
───────────────────────────────────────────────────────────────── */
const LifecycleContent = ({ tab, data }) => {
    const map = {
        'OVERVIEW': data.overview,
        'THE CHALLENGE': data.challenge,
        'OUR SOLUTION': data.solution,
        'THE IMPACT': data.impact,
        'INITIATION': data.initiation,
        'PLANNING': data.planning,
        'EXECUTION': data.execution,
        'CLOSURE': data.closure,
    };
    const isResult = tab === 'THE IMPACT' || tab === 'CLOSURE';
    return (
        <p className={`ftab-text${isResult ? ' ftab-text--highlight' : ''}`}>
            {map[tab] ?? null}
        </p>
    );
};

/* ─────────────────────────────────────────────────────────────────
   Project Card
───────────────────────────────────────────────────────────────── */
const ProjectCard = ({ title, subtitle, defaultTab, isReversed, imageSrc, liveUrl, playStoreUrl, useIframe, useScrollableImage, data }) => {
    const [activeTab, setActiveTab] = useState(defaultTab);
    const [animKey, setAnimKey] = useState(0);
    const cardRef = useRef(null);

    const tabs = data.overview
        ? ['OVERVIEW', 'THE CHALLENGE', 'OUR SOLUTION', 'THE IMPACT']
        : ['INITIATION', 'PLANNING', 'EXECUTION', 'CLOSURE'];

    const handleTab = (tab) => {
        if (tab === activeTab) return;
        setActiveTab(tab);
        setAnimKey(k => k + 1);
    };

    return (
        <article
            ref={cardRef}
            className="interactive-element glass-card proj-card"
            style={{ cursor: 'none' }}
        >
            <div className="proj-inner">

                {/* ── Image Panel ── */}
                <div className="proj-img-wrap" style={{ order: isReversed ? 2 : 1 }}>
                    {useScrollableImage ? (
                        <div 
                            className="hide-scroll"
                            data-lenis-prevent="true"
                            onWheel={(e) => e.stopPropagation()}
                            onTouchMove={(e) => e.stopPropagation()}
                            style={{ 
                                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', 
                                overflowY: 'auto', overflowX: 'hidden',
                                scrollbarWidth: 'none',
                                msOverflowStyle: 'none',
                                pointerEvents: 'auto'
                            }} 
                        >
                            <img
                                src={imageSrc}
                                alt={title}
                                style={{ width: '100%', height: 'auto', display: 'block' }}
                                loading="lazy"
                            />
                        </div>
                    ) : useIframe && liveUrl ? (
                        <div className="proj-img-el" style={{ overflow: 'hidden', position: 'relative' }}>
                            <iframe
                                src={liveUrl}
                                title={title}
                                style={{ 
                                    width: 'calc(220% + 44px)', 
                                    height: '220%', 
                                    transform: 'scale(0.454545)', 
                                    transformOrigin: '0 0', 
                                    border: 'none', 
                                    pointerEvents: 'auto', 
                                    backgroundColor: '#fff',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0
                                }}
                            />
                        </div>
                    ) : (
                        <img
                            className="proj-img-el"
                            src={imageSrc}
                            alt={title}
                        />
                    )}
                    {/* Dark hover-reveal overlay */}
                    <div className="proj-img-overlay" />
                    {/* Subtle bottom vignette only */}
                    <div className="proj-img-vignette" />
                </div>

                {/* ── Content Panel ── */}
                <div className="proj-content-wrap" style={{ order: isReversed ? 1 : 2 }}>

                    {/* Badge */}
                    <span className="proj-badge">Featured Project</span>

                    {/* Title */}
                    <h3 className="proj-title" style={{ whiteSpace: 'pre-line' }}>{title}</h3>

                    {/* ════════════════════════════════════════
                        Folder-Tab System
                        ════════════════════════════════════════ */}
                    <div className="ftab-root">

                        {/* Tab strip — one bar, separator lines between labels */}
                        <div className="ftab-strip" role="tablist">
                            {tabs.map((tab, idx) => {
                                const isActive = tab === activeTab;
                                const isLast = idx === tabs.length - 1;
                                return (
                                    <React.Fragment key={tab}>
                                        <button
                                            role="tab"
                                            aria-selected={isActive}
                                            className={`interactive-element ftab-btn${isActive ? ' ftab-btn--active' : ''}`}
                                            onClick={() => handleTab(tab)}
                                            style={{ cursor: 'none' }}
                                        >
                                            {tab}
                                        </button>
                                        {/* Separator — hidden if before/after active tab */}
                                        {!isLast && (
                                            <span
                                                className="ftab-sep"
                                                aria-hidden="true"
                                                data-active-left={isActive ? 'true' : undefined}
                                                data-active-right={tabs[idx + 1] === activeTab ? 'true' : undefined}
                                            />
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </div>

                        {/* Content panel — no top border where it meets active tab */}
                        <div className="ftab-panel" key={animKey} role="tabpanel">
                            <LifecycleContent tab={activeTab} data={data} />
                        </div>

                    </div>

                    {/* Links row */}
                    <div className="proj-links-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginTop: 'auto' }}>
                        {/* Visit Live Portal link */}
                        {liveUrl && (
                            <a
                                href={liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="interactive-element proj-live-link"
                                style={{ cursor: 'none', marginTop: 0 }}
                            >
                                <span className="proj-live-link__text">Visit Live Portal</span>
                                <span className="proj-live-link__arrow">→</span>
                            </a>
                        )}

                        {/* Mobile Play Store Icon */}
                        {playStoreUrl && (
                            <a
                                href={playStoreUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="interactive-element proj-play-icon-mobile"
                                style={{ cursor: 'none', display: 'none', color: '#bea98e', opacity: 0.9, marginTop: 0 }}
                                title="Get it on Google Play"
                            >
                                <svg viewBox="0 0 512 512" fill="currentColor" width="16" height="16" style={{ display: 'block' }}>
                                    <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z"/>
                                </svg>
                            </a>
                        )}
                    </div>

                    {/* Play Store Badge */}
                    {playStoreUrl && (
                        <a
                            href={playStoreUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="interactive-element proj-play-badge-desktop"
                            style={{ 
                                cursor: 'none',
                                position: 'absolute',
                                bottom: '0.3rem',
                                right: '3rem',
                                zIndex: 10
                            }}
                        >
                            <img 
                                alt="Get it on Google Play" 
                                src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png" 
                                style={{ height: '48px', width: 'auto' }}
                            />
                        </a>
                    )}
                </div>

            </div>
        </article>
    );
};

/* ─────────────────────────────────────────────────────────────────
   Section
───────────────────────────────────────────────────────────────── */
export const ProjectShowcases = () => {
    const containerRef = useRef(null);
    useScrollReveal(containerRef);

    useEffect(() => {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (!prefersReducedMotion && containerRef.current) {
            const cards = containerRef.current.querySelectorAll('article');
            cards.forEach(card => {
                gsap.fromTo(card,
                    { opacity: 0, y: 60 },
                    {
                        opacity: 1, y: 0, duration: 1.1, ease: 'power3.out',
                        scrollTrigger: { trigger: card, start: 'top 82%', toggleActions: 'play none none none' }
                    }
                );
                const img = card.querySelector('.proj-img-el');
                if (img) {
                    gsap.fromTo(img,
                        { y: -25 },
                        {
                            y: 25, ease: 'none',
                            scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: 1.5 }
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
            style={{ position: 'relative', zIndex: 10 }}
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
                        marginBottom: '1.25rem',
                        color: 'var(--text-primary)',
                        letterSpacing: '-0.03em',
                        lineHeight: 1.05,
                    }}
                >
                    Project <span style={{ color: 'var(--accent)', fontStyle: 'italic', fontWeight: 400 }}>Showcases.</span>
                </h2>

                <p
                    className="animate-heading"
                    style={{
                        color: 'rgba(255,255,255,0.65)',
                        fontSize: 'clamp(1rem, 1.5vw, 1.15rem)',
                        maxWidth: '100%',
                        marginBottom: '3rem',
                        lineHeight: 1.6
                    }}
                >
                    A look at the national-scale digital transformations and e-Governance platforms I have coordinated, supported, and scaled.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '5rem' }}>

                    {/* ── Project 1 ── */}
                    <ProjectCard
                        title="myGov System Implementation & Support"
                        defaultTab="OVERVIEW"
                        isReversed={false}
                        imageSrc="/myGov-homepage.webp"
                        useIframe={true}
                        liveUrl="https://www.mygov.bd"
                        data={{
                            overview: "The myGov platform, developed by a2i, transforms manual government services into accessible digital formats. As the ITSM partner, my team manages the complete journey of bringing these offline services online so citizens can access them seamlessly from home.",
                            challenge: "The main hurdle is taking complex, offline government procedures and accurately digitizing them. We must collect legacy data, map out a clear implementation plan, and ensure the new digital workflow operates perfectly for both the public and government offices.",
                            solution: "I lead the end-to-end digitization process. My team gathers requirements from government offices, digitizes services, and conducts rigorous validation. Before the final launch, we also train government officials on exactly how to process the new applications.",
                            impact: "We deliver digitized services that citizens can easily use from anywhere. Post-launch, we provide continuous support to users and trained officials. We also collect and analyze feedback, reporting insights to a2i to ensure the platform delivers 100% satisfaction.",
                        }}
                    />

                    {/* ── Project 2 ── */}
                    <ProjectCard
                        title={"National Portal Onboarding &\nSupport"}
                        defaultTab="OVERVIEW"
                        isReversed={true}
                        imageSrc="/national-portal-long.webp"
                        useScrollableImage={true}
                        liveUrl="https://dhaka.gov.bd"
                        data={{
                            overview: "The National Portal Framework by a2i provides a unified web platform for all government offices to share public information. I managed the QA and Support teams responsible for onboarding new government agencies and maintaining the entire portal ecosystem.",
                            challenge: "The primary goal was bringing unconnected government offices onto a standardized framework. This required gathering accurate agency data, deploying cloned site structures, validating new development features, and ensuring officials could manage their content.",
                            solution: "I mentored the teams executing this entire pipeline. We collected office data, set up domains, cloned the portal structure, and thoroughly tested functionality. We then conducted training sessions so officials could easily update portal information themselves.",
                            impact: "We successfully expanded the national portal network, giving citizens reliable access to vital government information. Post-launch, my teams provided dedicated 24/7 technical support to resolve complex issues and ensure all portals remained fully operational.",
                        }}
                    />

                    {/* ── Project 3 ── */}
                    <ProjectCard
                        title="MyWallet: Intelligent & Sovereign Financial Assistant"
                        defaultTab="OVERVIEW"
                        isReversed={false}
                        imageSrc="/MyWallet-Finance-App.webp"
                        liveUrl="https://mywallet.mdrahim.com"
                        playStoreUrl="https://play.google.com/store/apps/details?id=com.mdrahim.mywallet"
                        useIframe={true}
                        data={{
                            overview: "MyWallet is an advanced, local-first Android platform that manages your entire financial life using on-device AI, serverless cloud synchronization, and offline-first NoSQL architecture.",
                            challenge: "Traditional financial apps rely heavily on backend servers, which compromises user privacy, increases latency, and requires constant internet access to function properly.",
                            solution: "I engineered a fully offline-first solution utilizing ObjectBox for high-speed local data storage and a custom on-device Natural Language Model (NLM) for executing intents. It also leverages Google ML Kit for smart receipt scanning.",
                            impact: "Users experience a secure, completely private financial suite with advanced biometric protection, automatic serverless Google Drive sync, and conversational AI—all operating seamlessly without third-party servers.",
                        }}
                    />

                </div>
            </div>

            {/* ══════════════════════════════════════════════════════════
                  STYLES
              ══════════════════════════════════════════════════════════ */}
            <style dangerouslySetInnerHTML={{
                __html: `

                /* ─────────────────────────────
                   Card shell
                ───────────────────────────── */
                .proj-card {
                    border-radius: 20px;
                    overflow: hidden;
                    border: 1px solid rgba(255,255,255,0.07);
                    box-shadow:
                        0 4px 24px rgba(0,0,0,0.35),
                        0 1px 2px rgba(0,0,0,0.5),
                        inset 0 1px 0 rgba(255,255,255,0.06);
                    transition: box-shadow 0.4s ease, transform 0.4s ease;
                    will-change: transform;
                }
                .proj-card:hover {
                    box-shadow:
                        0 12px 48px rgba(0,0,0,0.45),
                        0 2px 4px rgba(0,0,0,0.6),
                        inset 0 1px 0 rgba(255,255,255,0.08);
                }
                /* Kill the glass-card gradient overlay on these large cards */
                .proj-card.glass-card::before {
                    display: none;
                }
                /* Also prevent excessive hover brightening from glass-card */
                .proj-card.glass-card:hover {
                    background: rgba(255,255,255,0.018);
                }

                .proj-inner {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    min-height: 440px;
                    height: 480px;
                }

                /* ─────────────────────────────
                   Image side
                ───────────────────────────── */
                .proj-img-wrap {
                    position: relative;
                    overflow: hidden;
                    border-right: 1px solid rgba(255,255,255,0.06);
                    box-shadow: inset 0 0 30px rgba(0,0,0,0.2);
                }
                /* Mirror the border for reversed cards (image on right) */
                .proj-img-wrap[style*="order: 2"] {
                    border-right: none;
                    border-left: 1px solid rgba(255,255,255,0.06);
                }
                .proj-img-el {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    object-position: center top;
                    display: block;
                    transition: transform 500ms ease-out;
                }
                /* Subtle bottom vignette only — doesn't darken main photo area */
                .proj-img-vignette {
                    position: absolute; inset: 0;
                    background: linear-gradient(to bottom, transparent 65%, rgba(11,11,17,0.45) 100%);
                    pointer-events: none;
                    z-index: 2;
                }
                
                /* Dark overlay that fades away on hover */
                .proj-img-overlay {
                    position: absolute; 
                    inset: 0;
                    background-color: rgba(6, 6, 9, 0.35); /* 35% dark tint */
                    pointer-events: none;
                    transition: opacity 500ms ease-out;
                    z-index: 1;
                }
                .proj-card:hover .proj-img-overlay {
                    opacity: 0;
                }
                
                /* subtle noise/grain texture */
                .proj-img-grain {
                    position: absolute; inset: 0;
                    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
                    opacity: 0.35;
                    pointer-events: none;
                    mix-blend-mode: overlay;
                }

                /* ─────────────────────────────
                   Content side — uses site glass-card bg
                ───────────────────────────── */
                .proj-content-wrap {
                    background: rgba(255,255,255,0.018);
                    backdrop-filter: blur(24px) saturate(180%);
                    -webkit-backdrop-filter: blur(24px) saturate(180%);
                    padding: 2.5rem 3rem 1.5rem 3rem;
                    display: flex;
                    flex-direction: column;
                    justify-content: flex-start;
                    position: relative;
                }

                /* Badge */
                .proj-badge {
                    display: inline-block;
                    font-size: 0.62rem;
                    font-weight: 600;
                    letter-spacing: 0.15em;
                    text-transform: uppercase;
                    color: #bea98e;
                    margin-bottom: 0.9rem;
                    opacity: 0.8;
                }

                /* Title */
                .proj-title {
                    font-size: clamp(1.3rem, 2.2vw, 1.9rem);
                    color: #f0ece6;
                    font-weight: 700;
                    line-height: 1.25;
                    letter-spacing: -0.02em;
                    margin: 0 0 2rem 0;
                }

                /* ─────────────────────────────────────────────
                   FOLDER-TAB SYSTEM
                   Key behaviour:
                     • Tab strip: one bar, separator lines only
                     • Active tab bg = panel bg → no seam
                     • Inactive tabs: have border-bottom → closed
                     • Active tab: no border-bottom → opens into panel
                ───────────────────────────────────────────── */

                /* Tab root wrapper */
                .ftab-root {
                    display: flex;
                    flex-direction: column;
                    position: relative;
                    z-index: 2;  /* sits above TiltEffect shine (z-index:1) */
                }

                /* ── The unified tab strip ── */
                .ftab-strip {
                    display: flex;
                    align-items: stretch;
                    border: 1px solid rgba(190,169,142,0.2);
                    border-bottom: none;          /* no global bottom — each tab controls its own */
                    border-radius: 10px 10px 0 0;
                    overflow: hidden;             /* clips tab backgrounds to rounded corners */
                    position: relative;
                    z-index: 2;
                    background: rgba(255,255,255,0.02);
                }

                /* ── Tab buttons ── */
                .ftab-btn {
                    flex: 1;
                    padding: 0.78rem 0.4rem;
                    background: transparent;
                    border: none;
                    border-bottom: 1px solid rgba(190,169,142,0.2); /* closed shelf line */
                    color: rgba(148,142,162,0.6);
                    font-size: clamp(0.58rem, 1.1vw, 0.68rem);
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.12em;
                    white-space: nowrap;
                    transition: color 0.2s ease, background 0.2s ease;
                    position: relative;
                }
                .ftab-btn:hover:not(.ftab-btn--active) {
                    color: rgba(225,215,200,0.9);
                    background: rgba(190,169,142,0.06);
                }
                .hide-scroll::-webkit-scrollbar {
                    display: none;
                }

                /* ACTIVE TAB — the key magic */
                .ftab-btn--active {
                    background: rgba(190,169,142,0.07);  /* exact same as .ftab-panel */
                    color: #e2d8cc;
                    border-bottom: none;                  /* removes shelf → connects to panel */
                    font-weight: 700;
                }
                /* Top accent line on active tab */
                .ftab-btn--active::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0; right: 0;
                    height: 2px;
                    background: linear-gradient(90deg, rgba(190,169,142,0.6), rgba(190,169,142,0.9), rgba(190,169,142,0.6));
                    border-radius: 2px 2px 0 0;
                }

                /* ── Separator lines between tabs ── */
                .ftab-sep {
                    width: 1px;
                    align-self: stretch;
                    background: rgba(255,255,255,0.07);
                    flex-shrink: 0;
                    /* Fade the separator that touches the active tab */
                }
                /* separator to the RIGHT of an active tab — fade out */
                .ftab-btn--active + .ftab-sep {
                    background: rgba(190,169,142,0.15);
                }
                /* separator to the LEFT of an active tab — modern :has support */
                .ftab-sep:has(+ .ftab-btn--active) {
                    background: rgba(190,169,142,0.15);
                }

                /* ── Content panel — opens from active tab ── */
                .ftab-panel {
                    background: rgba(190,169,142,0.07);  /* SAME as active tab */
                    border: 1px solid rgba(190,169,142,0.2);
                    border-top: none;                     /* no top border — seamless with strip */
                    border-radius: 0 0 10px 10px;
                    padding: 1.5rem 1.6rem 1.6rem;
                    height: 200px;
                    position: relative;
                    z-index: 1;
                    animation: ftabReveal 0.3s ease forwards;
                }
                @keyframes ftabReveal {
                    from { opacity: 0; transform: translateY(4px); }
                    to   { opacity: 1; transform: translateY(0); }
                }

                /* ── Panel text ── */
                .ftab-text {
                    color: rgba(250,250,250,0.6);
                    line-height: 1.82;
                    margin: 0;
                    font-size: clamp(0.83rem, 1.8vw, 0.93rem);
                    font-weight: 350;
                }
                .ftab-text--highlight {
                    color: #e8e0d4;
                    font-weight: 400;
                }

                /* ── Visit Live Portal Link ── */
                .proj-live-link {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    margin-top: 1.5rem;
                    font-size: 0.75rem;
                    font-weight: 600;
                    letter-spacing: 0.12em;
                    text-transform: uppercase;
                    color: var(--accent);
                    text-decoration: none;
                    opacity: 0.8;
                    transition: opacity 0.3s ease, color 0.3s ease;
                    align-self: flex-start;
                }
                .proj-live-link:hover {
                    opacity: 1;
                    color: #e8e0d4;
                }
                .proj-live-link__arrow {
                    font-size: 1rem;
                    line-height: 1;
                    transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                }
                .proj-live-link:hover .proj-live-link__arrow {
                    transform: translateX(4px);
                    color: var(--accent);
                    text-shadow: 0 0 12px rgba(190,169,142,0.6);
                }

                /* ═══════════════════════════
                   Tablet  ≤ 900px
                ═══════════════════════════ */
                @media (max-width: 900px) {
                    #work { padding: 4rem 5% !important; }
                    #work > div > div { gap: 3rem !important; }
                    #work h2 { font-size: clamp(1.6rem, 6vw, 2.2rem) !important; }
                    .proj-inner {
                        grid-template-columns: 1fr !important;
                        min-height: unset;
                        height: auto;
                    }
                    /* Always show image first on mobile */
                    .proj-img-wrap { order: 1 !important; min-height: 220px !important; max-height: 280px; }
                    .proj-content-wrap { order: 2 !important; }
                    .proj-content-wrap {
                        padding: 1.75rem 1.5rem 1.75rem !important;
                    }
                    .proj-title {
                        font-size: clamp(1.15rem, 5vw, 1.5rem) !important;
                        margin-bottom: 1.4rem !important;
                    }
                    .ftab-btn {
                        font-size: clamp(0.52rem, 1.8vw, 0.64rem) !important;
                        padding: 0.65rem 0.2rem !important;
                        letter-spacing: 0.09em !important;
                    }
                    .ftab-panel {
                        padding: 1.1rem 1.2rem !important;
                        height: auto;
                        min-height: 140px;
                    }
                    .ftab-text {
                        font-size: clamp(0.82rem, 2.8vw, 0.94rem) !important;
                        line-height: 1.72 !important;
                    }
                    .proj-play-badge-desktop { display: none !important; }
                    .proj-play-icon-mobile { display: inline-flex !important; align-items: center; justify-content: center; }
                }

                /* ═══════════════════════════
                   Mobile  ≤ 480px
                ═══════════════════════════ */
                @media (max-width: 480px) {
                    .proj-card { border-radius: 14px; }
                    .proj-img-wrap { min-height: 190px !important; max-height: 230px; }
                    .proj-content-wrap { padding: 1.3rem 1.1rem 1.4rem !important; }
                    .proj-badge { display: none; }
                    .proj-title { font-size: clamp(1rem, 5.5vw, 1.2rem) !important; margin-bottom: 1.1rem !important; }
                    .ftab-strip { border-radius: 8px 8px 0 0; }
                    .ftab-btn {
                        font-size: clamp(0.47rem, 2.2vw, 0.58rem) !important;
                        padding: 0.58rem 0.1rem !important;
                        letter-spacing: 0.07em !important;
                    }
                    .ftab-panel { border-radius: 0 0 8px 8px; padding: 0.9rem 1rem !important; height: auto; min-height: 140px; }
                    .ftab-text { font-size: clamp(0.8rem, 3.5vw, 0.9rem) !important; line-height: 1.65 !important; }
                }
            `}} />
        </section>
    );
};
