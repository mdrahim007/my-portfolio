import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

/* ── SVG Icons ─────────────────────────────────────────────────────────── */
const IconHome = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
);
const IconExpertise = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
);
const IconWork = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
);
const IconDocs = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
);
const IconReputation = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
);
const IconAbout = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
);
const IconContact = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
    </svg>
);

/* ── Nav data ─────────────────────────────────────────────────────────── */
const NAV_LINKS = [
    { label: 'Home', href: '#home', section: 'home', Icon: IconHome },
    { label: 'Expertise', href: '#expertise', section: 'expertise', Icon: IconExpertise },
    { label: 'Work', href: '#work', section: 'work', Icon: IconWork },
    { label: 'Docs', href: '#documentation', section: 'documentation', Icon: IconDocs },
    { label: 'Reputation', href: '#reputation', section: 'reputation', Icon: IconReputation },
    { label: 'About', href: '#about', section: 'about', Icon: IconAbout },
    { label: 'Contact', href: '#contact', section: 'contact', Icon: IconContact },
];

/* ── NavItem ──────────────────────────────────────────────────────────── */
const NavItem = ({ label, href, Icon, isActive, scrolled, onClick }) => {
    const [hovered, setHovered] = useState(false);
    const showLabel = isActive || hovered;

    return (
        <a
            href={href}
            className="interactive-element nav-item"
            aria-current={isActive ? 'page' : undefined}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={onClick}
            style={{
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: showLabel ? '7px' : '0px',
                padding: '0.45rem 0.7rem',
                borderRadius: '100px',
                border: isActive
                    ? '1px solid rgba(190,169,142,0.35)'
                    : hovered
                        ? '1px solid rgba(255,255,255,0.1)'
                        : '1px solid transparent',
                background: isActive
                    ? 'rgba(190,169,142,0.13)'
                    : hovered
                        ? 'rgba(255,255,255,0.05)'
                        : 'transparent',
                color: isActive
                    ? '#bea98e'
                    : scrolled
                        ? 'rgba(250,250,250,0.7)'
                        : 'rgba(250,250,250,0.5)',
                boxShadow: isActive
                    ? '0 0 16px rgba(190,169,142,0.12) inset'
                    : 'none',
                transition: [
                    'background 0.3s ease',
                    'border-color 0.3s ease',
                    'color 0.3s ease',
                    'gap 0.35s cubic-bezier(0.34,1.2,0.64,1)',
                    'box-shadow 0.3s ease',
                ].join(', '),
                whiteSpace: 'nowrap',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Icon — always visible */}
            <span style={{
                display: 'flex',
                alignItems: 'center',
                flexShrink: 0,
            }}>
                <Icon />
            </span>

            {/* Label — expands/collapses smoothly via max-width */}
            <span style={{
                display: 'inline-block',
                maxWidth: showLabel ? '120px' : '0px',
                opacity: showLabel ? 1 : 0,
                overflow: 'hidden',
                fontSize: '0.72rem',
                fontWeight: isActive ? 700 : 500,
                fontFamily: 'var(--font-body)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                lineHeight: 1,
                /* Stagger the reveal slightly after the gap animates */
                transition: showLabel
                    ? 'max-width 0.4s cubic-bezier(0.34,1.2,0.64,1), opacity 0.25s ease 0.07s'
                    : 'max-width 0.35s cubic-bezier(0.4,0,0.2,1), opacity 0.15s ease',
            }}>
                {label}
            </span>
        </a>
    );
};

/* ── Navbar ───────────────────────────────────────────────────────────── */
const Navbar = () => {
    const navRef = useRef(null);
    const lastScrollY = useRef(0);
    const ticking = useRef(false);
    const isVisible = useRef(true);
    const isNavigating = useRef(false);
    const navTimer = useRef(null);

    const [activeSection, setActiveSection] = useState('home');
    const [scrolled, setScrolled] = useState(false);

    /* ── Smart hide / show ───────────────────────────────────────────── */
    useEffect(() => {
        const nav = navRef.current;
        if (!nav) return;
        gsap.set(nav, { y: 0, opacity: 1 });

        const onScroll = () => {
            if (ticking.current) return;
            ticking.current = true;
            requestAnimationFrame(() => {
                const currentY = window.scrollY;
                const delta = currentY - lastScrollY.current;
                setScrolled(currentY > 60);

                if (!isNavigating.current) {
                    if (currentY > 60) {
                        if (delta > 4 && isVisible.current) {
                            gsap.to(nav, { y: -100, opacity: 0, duration: 0.38, ease: 'power2.in' });
                            isVisible.current = false;
                        } else if (delta < -4 && !isVisible.current) {
                            gsap.to(nav, { y: 0, opacity: 1, duration: 0.42, ease: 'power2.out' });
                            isVisible.current = true;
                        }
                    } else if (!isVisible.current) {
                        gsap.to(nav, { y: 0, opacity: 1, duration: 0.35, ease: 'power2.out' });
                        isVisible.current = true;
                    }
                }

                lastScrollY.current = currentY;
                ticking.current = false;
            });
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', onScroll);
            if (navTimer.current) clearTimeout(navTimer.current);
        };
    }, []);

    /* ── Active section detection ────────────────────────────────────── */
    useEffect(() => {
        const ids = ['home', 'expertise', 'work', 'documentation', 'reputation', 'about', 'contact'];
        const io = new IntersectionObserver(
            entries => entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id); }),
            { rootMargin: '-35% 0px -55% 0px', threshold: 0 }
        );
        const els = [];
        ids.forEach(id => {
            const el = document.getElementById(id);
            if (el) { io.observe(el); els.push(el); }
        });
        return () => { els.forEach(el => io.unobserve(el)); io.disconnect(); };
    }, []);

    /* ── Nav-click handler: freeze hide-logic during programmatic scroll ── */
    const handleNavClick = () => {
        // Ensure navbar is visible when user clicks a link
        if (!isVisible.current) {
            gsap.to(navRef.current, { y: 0, opacity: 1, duration: 0.3, ease: 'power2.out' });
            isVisible.current = true;
        }
        isNavigating.current = true;
        if (navTimer.current) clearTimeout(navTimer.current);
        // Release the lock after the smooth-scroll animation finishes (~900ms)
        navTimer.current = setTimeout(() => { isNavigating.current = false; }, 900);
    };

    /* ── Glass pill style ────────────────────────────────────────────── */
    const glassStyle = scrolled ? {
        background: 'rgba(8,8,14,0.88)',
        backdropFilter: 'blur(40px) saturate(200%)',
        WebkitBackdropFilter: 'blur(40px) saturate(200%)',
        boxShadow: '0 1px 0 rgba(255,255,255,0.05) inset, 0 8px 32px rgba(0,0,0,0.5)',
        border: '1px solid rgba(255,255,255,0.08)',
    } : {
        background: 'rgba(8,8,14,0.25)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: 'none',
        border: '1px solid rgba(255,255,255,0.04)',
    };

    return (
        <>
            <nav
                ref={navRef}
                style={{
                    position: 'fixed',
                    top: '0.75rem', // Decreased floating margin
                    left: 0,
                    width: '100%',
                    zIndex: 1000,
                    willChange: 'transform, opacity',
                    pointerEvents: 'none', // Let clicks pass through empty space
                    display: 'flex',
                    justifyContent: 'center',
                }}
                aria-label="Main navigation"
            >
                {/* ── Floating pill (Shared Desktop & Mobile) ── */}
                <div style={{
                    pointerEvents: 'auto', // Re-enable clicks
                    maxWidth: '100vw',
                }}>
                    <div className="nav-pill-container" style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '2px',
                        borderRadius: '100px',
                        padding: '6px',
                        transition: 'background 0.5s ease, box-shadow 0.5s ease, border-color 0.5s ease',
                        /* On very small devices, allow subtle horizontal scrolling if required */
                        overflowX: 'auto',
                        /* Hide scrollbar */
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                        ...glassStyle,
                    }}>
                        {NAV_LINKS.map(({ label, href, section, Icon }) => (
                            <NavItem
                                key={section}
                                label={label}
                                href={href}
                                Icon={Icon}
                                isActive={activeSection === section}
                                scrolled={scrolled}
                                onClick={handleNavClick}
                            />
                        ))}
                    </div>
                </div>

                {/* ── Premium "Hire Me" / Available Badge ── */}
                <div className="hire-me-btn" style={{
                    position: 'absolute',
                    right: 'max(1.5rem, calc((100vw - 1200px) / 2))',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    pointerEvents: 'auto',
                }}>
                    <a href="#contact" className="interactive-element" style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '0.6rem 1.2rem',
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '100px',
                        color: 'rgba(250,250,250,0.85)',
                        textDecoration: 'none',
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        transition: 'all 0.4s cubic-bezier(0.34, 1.2, 0.64, 1)',
                        backdropFilter: 'blur(12px)',
                        WebkitBackdropFilter: 'blur(12px)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                        onMouseOver={e => {
                            e.currentTarget.style.background = 'rgba(190, 169, 142, 0.1)';
                            e.currentTarget.style.borderColor = 'rgba(190, 169, 142, 0.3)';
                            e.currentTarget.style.color = '#bea98e';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                        }}
                        onMouseOut={e => {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                            e.currentTarget.style.color = 'rgba(250,250,250,0.85)';
                            e.currentTarget.style.transform = 'translateY(0)';
                        }}
                    >
                        <span style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            background: '#25D366',
                            boxShadow: '0 0 8px #25D366',
                            animation: 'pulseGreen 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                        }}></span>
                        Hire Me
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '-2px' }}>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                            <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                    </a>
                </div>
            </nav>

            {/* ── Styles ───────────────────────────────────────────── */}
            <style>{`
                /* Hide scrollbar for nav contianer if it overflows on very tiny devices */
                .nav-pill-container::-webkit-scrollbar {
                    display: none;
                }

                @media (max-width: 860px) {
                    .hire-me-btn { display: none !important; }
                }

                @keyframes pulseGreen {
                    0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.7); }
                    70% { transform: scale(1.1); box-shadow: 0 0 0 6px rgba(37, 211, 102, 0); }
                    100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(37, 211, 102, 0); }
                }

                /* Prevent layout shift from label reveal affecting outer pill width */
                .nav-item { will-change: background, border-color, color; }
            `}</style>
        </>
    );
};

export default Navbar;
