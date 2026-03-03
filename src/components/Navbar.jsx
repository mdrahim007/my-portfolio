import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const NAV_LINKS = [
    { label: 'Work', href: '#work', section: 'work' },
    { label: 'About', href: '#about', section: 'about' },
    { label: 'Contact', href: '#contact', section: 'contact' },
];

const Navbar = () => {
    const navRef = useRef(null);
    const lastScrollY = useRef(0);
    const ticking = useRef(false);
    const isVisible = useRef(true);
    const [activeSection, setActiveSection] = useState('');
    const [scrolled, setScrolled] = useState(false);

    // ── Smart hide / show + solidify on scroll ─────────────────────────
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

                // Solidify pill once past hero (~80px)
                setScrolled(currentY > 80);

                if (currentY > 60) {
                    if (delta > 4 && isVisible.current) {
                        gsap.to(nav, { y: -90, opacity: 0, duration: 0.4, ease: 'power2.in' });
                        isVisible.current = false;
                    } else if (delta < -4 && !isVisible.current) {
                        gsap.to(nav, { y: 0, opacity: 1, duration: 0.45, ease: 'power2.out' });
                        isVisible.current = true;
                    }
                } else {
                    if (!isVisible.current) {
                        gsap.to(nav, { y: 0, opacity: 1, duration: 0.35, ease: 'power2.out' });
                        isVisible.current = true;
                    }
                }

                lastScrollY.current = currentY;
                ticking.current = false;
            });
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // ── Active section via IntersectionObserver ─────────────────────────
    useEffect(() => {
        const sectionIds = ['work', 'about', 'contact'];
        const observers = [];

        const handleIntersect = (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) setActiveSection(entry.target.id);
            });
        };

        const io = new IntersectionObserver(handleIntersect, {
            rootMargin: '-40% 0px -50% 0px',
            threshold: 0,
        });

        sectionIds.forEach(id => {
            const el = document.getElementById(id);
            if (el) { io.observe(el); observers.push(el); }
        });

        return () => { observers.forEach(el => io.unobserve(el)); io.disconnect(); };
    }, []);

    // ── Dynamic glass pill styles ────────────────────────────────────────
    // At top (hero):   barely-there, integrated with starfield
    // Past hero:       solidifies — stronger bg, border, blur, and shadow
    const pillStyle = scrolled ? {
        background: 'rgba(10, 10, 14, 0.82)',
        backdropFilter: 'blur(32px) saturate(180%)',
        WebkitBackdropFilter: 'blur(32px) saturate(180%)',
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.06) inset',
        padding: '0.35rem 0.5rem',
        borderRadius: '100px',
        transition: 'background 0.5s ease, border-color 0.5s ease, box-shadow 0.5s ease, backdrop-filter 0.5s ease',
    } : {
        // Hero state — soft transparent
        background: 'rgba(10, 10, 14, 0.35)',
        backdropFilter: 'blur(18px) saturate(130%)',
        WebkitBackdropFilter: 'blur(18px) saturate(130%)',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: 'none',
        padding: '0.35rem 0.5rem',
        borderRadius: '100px',
        transition: 'background 0.5s ease, border-color 0.5s ease, box-shadow 0.5s ease, backdrop-filter 0.5s ease',
    };

    return (
        <nav
            ref={navRef}
            style={{
                position: 'fixed',
                top: '1.5rem',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 1000,
                willChange: 'transform, opacity',
            }}
            aria-label="Main navigation"
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', ...pillStyle }}>
                {NAV_LINKS.map(({ label, href, section }) => {
                    const isActive = activeSection === section;
                    return (
                        <a
                            key={href}
                            href={href}
                            className="interactive-element nav-pill-link"
                            style={{
                                textDecoration: 'none',
                                color: isActive ? '#bea98e' : scrolled ? 'rgba(250,250,250,0.88)' : 'rgba(250,250,250,0.7)',
                                fontSize: '0.78rem',
                                fontWeight: 600,
                                letterSpacing: '0.18em',
                                textTransform: 'uppercase',
                                fontFamily: 'var(--font-body)',
                                padding: '0.55rem 1.25rem',
                                borderRadius: '100px',
                                background: isActive ? 'rgba(190,169,142,0.12)' : 'transparent',
                                border: isActive ? '1px solid rgba(190,169,142,0.2)' : '1px solid transparent',
                                transition: 'color 0.3s ease, background 0.3s ease, border-color 0.3s ease',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.45rem',
                            }}
                            onMouseOver={e => {
                                if (!isActive) e.currentTarget.style.color = '#FAFAFA';
                            }}
                            onMouseOut={e => {
                                if (!isActive) e.currentTarget.style.color = scrolled ? 'rgba(250,250,250,0.88)' : 'rgba(250,250,250,0.7)';
                            }}
                        >
                            {isActive && (
                                <span style={{
                                    width: '5px', height: '5px', borderRadius: '50%',
                                    backgroundColor: '#bea98e',
                                    boxShadow: '0 0 8px rgba(190,169,142,0.7)',
                                    display: 'inline-block', flexShrink: 0,
                                }} />
                            )}
                            {label}
                        </a>
                    );
                })}
            </div>
        </nav>
    );
};

export default Navbar;
