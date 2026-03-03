import { useEffect, useState, useCallback } from 'react';

const SECTIONS = [
    { id: 'home', label: '01' },
    { id: 'expertise', label: '02' },
    { id: 'work', label: '03' },
    { id: 'documentation', label: '04' },
    { id: 'reputation', label: '05' },
    { id: 'about', label: '06' },
    { id: 'contact', label: '07' },
];

export const ScrollProgressSidebar = () => {
    const [activeSection, setActiveSection] = useState(0);
    const [scrollPct, setScrollPct] = useState(0);
    const [visible, setVisible] = useState(false);

    const update = useCallback(() => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        setScrollPct(docHeight > 0 ? scrollTop / docHeight : 0);
        setVisible(scrollTop > 180);

        // Determine active section by matching section elements
        const sections = SECTIONS.map(s => document.getElementById(s.id)).filter(Boolean);
        let current = 0;
        sections.forEach((el, i) => {
            if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.45) {
                current = i;
            }
        });
        setActiveSection(current);
    }, []);

    useEffect(() => {
        window.addEventListener('scroll', update, { passive: true });
        update();
        return () => window.removeEventListener('scroll', update);
    }, [update]);

    const scrollToSection = (id) => {
        const el = document.getElementById(id);
        if (!el) return;
        if (window.__lenis) {
            window.__lenis.scrollTo(el, { duration: 1.4, offset: -80 });
        } else {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <div style={{
            position: 'fixed',
            right: '1.8rem',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 9000,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0',
            opacity: visible ? 1 : 0,
            transition: 'opacity 0.5s ease',
            pointerEvents: visible ? 'auto' : 'none',
        }}>
            {SECTIONS.map((section, i) => {
                const isActive = i === activeSection;
                const isPast = i < activeSection;

                return (
                    <div key={section.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        {/* Connector line above each dot (except first) */}
                        {i > 0 && (
                            <div style={{
                                width: '1px',
                                height: '24px',
                                background: isPast
                                    ? 'linear-gradient(to bottom, #D4AF80, rgba(190,169,142,0.35))'
                                    : 'rgba(255,255,255,0.1)',
                                transition: 'background 0.4s ease',
                            }} />
                        )}

                        {/* Dot + label */}
                        <button
                            onClick={() => scrollToSection(section.id)}
                            aria-label={`Scroll to section ${section.label}`}
                            title={section.label}
                            style={{
                                position: 'relative',
                                width: isActive ? '8px' : '6px',
                                height: isActive ? '8px' : '6px',
                                borderRadius: '50%',
                                border: 'none',
                                padding: 0,
                                cursor: 'none',
                                background: isActive
                                    ? '#D4AF80'
                                    : isPast
                                        ? 'rgba(190,169,142,0.5)'
                                        : 'rgba(255,255,255,0.18)',
                                boxShadow: isActive ? '0 0 10px rgba(212,175,128,0.6)' : 'none',
                                transition: 'all 0.35s ease',
                                flexShrink: 0,
                            }}
                        />
                    </div>
                );
            })}
        </div>
    );
};
