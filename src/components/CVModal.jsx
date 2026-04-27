import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { CVReaderView } from './CVReaderView';

export const CVModal = ({ open, onClose }) => {
    const overlayRef = useRef(null);
    const [isDark, setIsDark] = useState(true);
    const [iframeKey, setIframeKey] = useState(0);
    const [viewMode, setViewMode] = useState('document');
    // Hidden iframe for printing from reader mode
    const printFrameRef = useRef(null);

    // Scroll-lock — identical to original
    useEffect(() => {
        if (open) {
            const scrollY = window.scrollY;
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.left = '0';
            document.body.style.right = '0';
            document.body.style.width = '100%';
            document.body.classList.add('hide-custom-cursor');
            setIframeKey(Date.now());
        } else {
            const scrollY = document.body.style.top;
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.left = '';
            document.body.style.right = '';
            document.body.style.width = '';
            window.scrollTo(0, parseInt(scrollY || '0') * -1);
            document.body.classList.remove('hide-custom-cursor');
        }
    }, [open]);

    // Close on Escape
    useEffect(() => {
        const onKey = (e) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [onClose]);

    const isReader = viewMode === 'reader';

    /* ── Print handler — works from both modes ── */
    const handlePrint = () => {
        if (!isReader) {
            // Document mode: print visible iframe directly
            const frame = document.getElementById('cv-frame');
            if (frame) frame.contentWindow.print();
        } else {
            // Reader mode: load resume.html in a hidden iframe (light theme) and print
            let frame = printFrameRef.current;
            if (!frame) {
                frame = document.createElement('iframe');
                frame.style.cssText = 'position:fixed;width:0;height:0;border:none;opacity:0;pointer-events:none;';
                document.body.appendChild(frame);
                printFrameRef.current = frame;
            }
            const ts = Date.now();
            frame.src = `/cv/resume.html?theme=light&v=${ts}`;
            frame.onload = () => {
                try {
                    // Force light theme for print
                    const doc = frame.contentDocument || frame.contentWindow.document;
                    doc.body.classList.remove('dark-mode');
                    setTimeout(() => frame.contentWindow.print(), 200);
                } catch (e) { /* cross-origin safety */ }
            };
        }
    };

    /* ── Theme toggle — syncs both reader and iframe ── */
    const handleThemeToggle = () => {
        const next = !isDark;
        setIsDark(next);
        try {
            const frame = document.getElementById('cv-frame');
            if (frame?.contentWindow?.toggleTheme) {
                frame.contentWindow.toggleTheme(next);
            }
        } catch (e) { /* cross-frame safety */ }
    };

    // Cleanup hidden print iframe on unmount
    useEffect(() => {
        return () => {
            if (printFrameRef.current) {
                printFrameRef.current.remove();
                printFrameRef.current = null;
            }
        };
    }, []);

    if (!open) return null;

    /* ── Shared pill-button style ── */
    const pillBtn = (active) => ({
        display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
        padding: '0.4rem 0.85rem', borderRadius: '100px',
        border: `1px solid ${active ? 'rgba(190,169,142,0.45)' : 'rgba(190,169,142,0.15)'}`,
        background: active ? 'rgba(190,169,142,0.14)' : 'transparent',
        color: active ? '#bea98e' : 'rgba(250,250,250,0.4)',
        fontSize: '0.65rem', fontWeight: 600,
        fontFamily: 'var(--font-body)',
        letterSpacing: '0.12em', textTransform: 'uppercase',
        cursor: 'pointer', transition: 'all 0.25s ease', whiteSpace: 'nowrap',
    });

    const iconBtn = {
        width: '32px', height: '32px', borderRadius: '50%',
        border: '1px solid rgba(190,169,142,0.2)',
        background: 'rgba(190,169,142,0.06)',
        color: 'rgba(250,250,250,0.6)',
        cursor: 'pointer', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        fontSize: '1rem', transition: 'all 0.25s ease', flexShrink: 0,
    };

    const hoverIn = (e) => {
        e.currentTarget.style.background = 'rgba(190,169,142,0.14)';
        e.currentTarget.style.borderColor = 'rgba(190,169,142,0.5)';
    };
    const hoverOut = (e) => {
        e.currentTarget.style.background = 'rgba(190,169,142,0.06)';
        e.currentTarget.style.borderColor = 'rgba(190,169,142,0.2)';
    };

    return createPortal(
        <div
            ref={overlayRef}
            className="modal-overlay-fixed"
            onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
            style={{
                position: 'fixed', inset: 0, zIndex: 99998,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'flex-start',
                animation: 'cvFadeIn 0.35s cubic-bezier(0.4,0,0.2,1) forwards',
                willChange: 'transform',
                transform: 'translateZ(0)', WebkitTransform: 'translateZ(0)',
            }}
        >
            <style>{`
                @keyframes cvFadeIn {
                    from { opacity: 0; }
                    to   { opacity: 1; }
                }
                @keyframes cvSlideUp {
                    from { opacity: 0; transform: translate3d(0, 40px, 0) scale(0.98); }
                    to   { opacity: 1; transform: translate3d(0, 0, 0)     scale(1); }
                }
                @media (max-width: 768px) {
                    .theme-toggle-desktop { display: none !important; }
                    .theme-toggle-mobile { display: flex !important; }
                }
                @media (min-width: 769px) {
                    .theme-toggle-desktop { display: flex !important; }
                    .theme-toggle-mobile { display: none !important; }
                }
            `}</style>

            {/* Modal window */}
            <div style={{
                position: 'relative', width: '100%',
                maxWidth: '900px', height: '100vh',
                display: 'flex', flexDirection: 'column',
                animation: 'cvSlideUp 0.4s cubic-bezier(0.34,1.15,0.64,1) forwards',
            }}>
                {/* ── Top bar ── */}
                <div style={{
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.9rem 1.5rem',
                    background: 'rgba(8,8,16,0.95)',
                    borderBottom: '1px solid rgba(190,169,142,0.15)',
                    flexShrink: 0, gap: '0.75rem', flexWrap: 'wrap',
                }}>
                    {/* Left: title */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
                        <span style={{
                            width: '6px', height: '6px', borderRadius: '50%',
                            background: '#D4AF80',
                            boxShadow: '0 0 8px rgba(212,175,128,0.7)',
                            flexShrink: 0,
                        }} />
                        <span style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: '0.72rem', fontWeight: 500,
                            letterSpacing: '0.18em', textTransform: 'uppercase',
                            color: 'rgba(190,169,142,0.8)',
                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        }}>Curriculum Vitae</span>
                    </div>

                    {/* Right: All Controls */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                        
                        {/* View Mode Toggle */}
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: '0.35rem',
                            background: 'rgba(255,255,255,0.03)',
                            borderRadius: '100px', padding: '0.2rem',
                            border: '1px solid rgba(255,255,255,0.05)',
                        }}>
                            <button onClick={() => setViewMode('document')} style={pillBtn(!isReader)} title="Document View (A4)">
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                    <polyline points="14 2 14 8 20 8" />
                                </svg>
                                <span className="hide-on-mobile">Document</span>
                            </button>
                            <button onClick={() => setViewMode('reader')} style={pillBtn(isReader)} title="Reader View">
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="17" y1="10" x2="3" y2="10" /><line x1="21" y1="6" x2="3" y2="6" />
                                    <line x1="21" y1="14" x2="3" y2="14" /><line x1="17" y1="18" x2="3" y2="18" />
                                </svg>
                                <span className="hide-on-mobile">Reader</span>
                            </button>
                        </div>

                        {/* Divider */}
                        <div style={{ width: '1px', height: '18px', background: 'rgba(190,169,142,0.2)' }} className="hide-on-mobile" />

                        {/* Action Buttons */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                            {/* Print */}
                            <button
                                className="cv-print-btn"
                                onClick={handlePrint}
                                title="Print / Save as PDF"
                                style={{
                                    display: 'inline-flex', alignItems: 'center',
                                    gap: '0.45rem', padding: '0.45rem 1rem',
                                    borderRadius: '100px',
                                    border: '1px solid rgba(190,169,142,0.3)',
                                    background: 'rgba(190,169,142,0.07)',
                                    color: '#bea98e', fontSize: '0.72rem',
                                    fontFamily: 'var(--font-body)',
                                    letterSpacing: '0.12em', textTransform: 'uppercase',
                                    cursor: 'pointer', transition: 'all 0.25s ease',
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.background = 'rgba(190,169,142,0.16)';
                                    e.currentTarget.style.borderColor = 'rgba(190,169,142,0.6)';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.background = 'rgba(190,169,142,0.07)';
                                    e.currentTarget.style.borderColor = 'rgba(190,169,142,0.3)';
                                }}
                            >
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="6 9 6 2 18 2 18 9" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                                    <rect x="6" y="14" width="12" height="8" />
                                </svg>
                                <span className="hide-on-mobile">Print</span>
                            </button>

                            {/* Theme toggle (Desktop - Apple Style Switch) */}
                            <div
                                className="theme-toggle-desktop"
                                onClick={handleThemeToggle}
                                title="Toggle Theme"
                                style={{
                                    background: 'rgba(255,255,255,0.03)',
                                    border: '1px solid rgba(255,255,255,0.06)',
                                    borderRadius: '100px',
                                    cursor: 'pointer', position: 'relative',
                                    width: '56px', height: '28px',
                                    boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.2)',
                                }}
                            >
                                {/* Sliding indicator */}
                                <div style={{
                                    position: 'absolute',
                                    top: '1px', left: isDark ? '29px' : '1px',
                                    width: '24px', height: '24px',
                                    borderRadius: '50%',
                                    background: isDark ? 'rgba(190,169,142,0.15)' : '#bea98e',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)',
                                    boxShadow: isDark ? 'none' : '0 2px 5px rgba(0,0,0,0.3)',
                                }} />
                                {/* Icons container */}
                                <div style={{
                                    position: 'absolute', top: 0, left: 0,
                                    width: '100%', height: '100%',
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                    padding: '0 6px', zIndex: 1, pointerEvents: 'none',
                                }}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={!isDark ? '#1a1828' : 'rgba(250,250,250,0.4)'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'stroke 0.3s' }}>
                                        <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
                                        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                                        <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
                                        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                                    </svg>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={isDark ? '#bea98e' : 'rgba(250,250,250,0.3)'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'stroke 0.3s' }}>
                                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                                    </svg>
                                </div>
                            </div>

                            {/* Theme toggle (Mobile - Original Icon) */}
                            <button
                                className="theme-toggle-mobile"
                                onClick={handleThemeToggle}
                                title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                                style={{ ...iconBtn, color: isDark ? '#fbbf24' : 'rgba(250,250,250,0.6)' }}
                                onMouseOver={hoverIn} onMouseOut={hoverOut}
                            >
                                {isDark ? (
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
                                        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                                        <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
                                        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                                    </svg>
                                ) : (
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                                    </svg>
                                )}
                            </button>

                            {/* Close */}
                            <button onClick={onClose} title="Close" style={iconBtn}
                                onMouseOver={(e) => { hoverIn(e); e.currentTarget.style.color = '#bea98e'; }}
                                onMouseOut={(e) => { hoverOut(e); e.currentTarget.style.color = 'rgba(250,250,250,0.6)'; }}
                            >✕</button>
                        </div>
                    </div>
                </div>

                {/* ── Content area ── */}
                {isReader ? (
                    <CVReaderView isDark={isDark} />
                ) : (
                    <iframe
                        id="cv-frame"
                        key={iframeKey}
                        src={`/cv/resume.html?theme=${isDark ? 'dark' : 'light'}&v=${iframeKey}`}
                        title="Md. Abdur Rahim — Curriculum Vitae"
                        style={{ flex: 1, width: '100%', border: 'none', background: 'transparent' }}
                    />
                )}
            </div>
        </div>,
        document.body
    );
};
