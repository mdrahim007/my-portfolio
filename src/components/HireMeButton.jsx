import React, { useState, useRef, useEffect } from 'react';

export const HireMeButton = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const timeoutRef = useRef(null);

    // Track scroll to optionally apply different glass styles
    useEffect(() => {
        const onScroll = () => {
            setScrolled(window.scrollY > 60);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const handleMouseEnter = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        setIsExpanded(true);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setIsExpanded(false);
        }, 1500); // 1.5 seconds delay before hiding
    };

    const glassStyle = {
        background: 'rgba(10,10,18,0.85)',
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        boxShadow: scrolled ? '0 4px 20px rgba(0,0,0,0.5)' : '0 10px 30px rgba(190, 169, 142, 0.15)',
        border: '1px solid rgba(190,169,142,0.3)',
        borderRight: 'none', // flat against the right edge
    };

    return (
        <a
            href="#contact"
            className="interactive-element hire-me-fixed-btn"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{
                position: 'fixed',
                right: 0,
                // Middle right edge placement
                top: '50%',
                zIndex: 1100,
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '0.7rem 1.2rem 0.7rem 1.2rem',
                background: glassStyle.background,
                border: glassStyle.border,
                borderRight: glassStyle.borderRight,
                borderRadius: '100px 0 0 100px',
                color: 'rgba(250,250,250,0.95)',
                textDecoration: 'none',
                fontSize: '0.8rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                backdropFilter: glassStyle.backdropFilter,
                WebkitBackdropFilter: glassStyle.WebkitBackdropFilter,
                boxShadow: glassStyle.boxShadow,
                // The magic translation:
                // Collapsed: translates X so only ~44px is visible on the left.
                // Expanded: translateX(0) to show full button.
                transform: `translateY(-50%) translateX(${isExpanded ? '0' : 'calc(100% - 44px)'})`,
                transition: 'transform 0.5s cubic-bezier(0.34, 1.5, 0.64, 1), background 0.3s ease, border-color 0.3s ease',
                cursor: 'pointer'
            }}
        >
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '16px',
                height: '16px',
                flexShrink: 0
            }}>
                <span className="pulse-dot" style={{
                    display: 'block',
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: '#25D366',
                    boxShadow: '0 0 12px #25D366',
                }}></span>
            </div>

            <span style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                whiteSpace: 'nowrap',
                opacity: isExpanded ? 1 : 0,
                transition: 'opacity 0.3s ease',
                transitionDelay: isExpanded ? '0.15s' : '0s'
            }}>
                Hire Me
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
            </span>

            <style>{`
                @keyframes pulseGreenDotPremium {
                    0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.7); }
                    70% { transform: scale(1.3); box-shadow: 0 0 0 8px rgba(37, 211, 102, 0); }
                    100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(37, 211, 102, 0); }
                }
                .pulse-dot {
                    animation: pulseGreenDotPremium 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
                .hire-me-fixed-btn:hover {
                    background: rgba(190, 169, 142, 0.15) !important;
                    border-color: rgba(190, 169, 142, 0.5) !important;
                }
                
                /* Mobile Responsiveness */
                @media (max-width: 768px) {
                    .hire-me-fixed-btn {
                        padding: 0.55rem 0.9rem 0.55rem 0.9rem !important;
                        font-size: 0.7rem !important;
                        gap: 8px !important;
                    }
                    .hire-me-fixed-btn span {
                       gap: 6px !important;
                    }
                    .hire-me-fixed-btn svg {
                        width: 14px !important;
                        height: 14px !important;
                    }
                    .hire-me-fixed-btn .pulse-container {
                        width: 12px !important;
                        height: 12px !important;
                    }
                    .hire-me-fixed-btn .pulse-dot {
                        width: 8px !important;
                        height: 8px !important;
                    }
                }
            `}</style>
        </a>
    );
};
