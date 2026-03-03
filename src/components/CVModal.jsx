import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

export const CVModal = ({ open, onClose }) => {
    const overlayRef = useRef(null);
    const [isDark, setIsDark] = useState(true); // resume defaults to dark mode
    // Stable key that increments only when modal opens — forces fresh iframe
    // load each open without re-rendering on every render cycle (no flashing)
    const [iframeKey, setIframeKey] = useState(0);

    // Lock body scroll while open, force iframe reload, and hide custom cursor
    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
            document.body.classList.add('hide-custom-cursor');
            setIframeKey(Date.now()); // Unique cache-buster on every open
        } else {
            document.body.style.overflow = '';
            document.body.classList.remove('hide-custom-cursor');
        }
        return () => {
            document.body.style.overflow = '';
            document.body.classList.remove('hide-custom-cursor');
        };
    }, [open]);

    // Close on Escape
    useEffect(() => {
        const onKey = (e) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [onClose]);


    if (!open) return null;

    return createPortal(
        <div
            ref={overlayRef}
            onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 99998,
                background: 'rgba(4,4,12,0.85)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                animation: 'cvFadeIn 0.35s cubic-bezier(0.4,0,0.2,1) forwards',
            }}
        >
            <style>{`
                @keyframes cvFadeIn {
                    from { opacity: 0; }
                    to   { opacity: 1; }
                }
                @keyframes cvSlideUp {
                    from { opacity: 0; transform: translateY(40px) scale(0.98); }
                    to   { opacity: 1; transform: translateY(0)     scale(1); }
                }
            `}</style>

            {/* Modal window */}
            <div style={{
                position: 'relative',
                width: '100%',
                maxWidth: '900px',
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                animation: 'cvSlideUp 0.4s cubic-bezier(0.34,1.15,0.64,1) forwards',
            }}>
                {/* Top bar */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.9rem 1.5rem',
                    background: 'rgba(8,8,16,0.95)',
                    borderBottom: '1px solid rgba(190,169,142,0.15)',
                    flexShrink: 0,
                    gap: '1rem',
                }}>
                    {/* Left: title */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{
                            width: '6px', height: '6px', borderRadius: '50%',
                            background: '#D4AF80',
                            boxShadow: '0 0 8px rgba(212,175,128,0.7)',
                            flexShrink: 0,
                        }} />
                        <span style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: '0.72rem',
                            fontWeight: 500,
                            letterSpacing: '0.18em',
                            textTransform: 'uppercase',
                            color: 'rgba(190,169,142,0.8)',
                        }}>
                            Curriculum Vitae — Md. Abdur Rahim
                        </span>
                    </div>

                    {/* Right: Print + Close */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        {/* Print button */}
                        <button
                            className="cv-print-btn"
                            onClick={() => {
                                const frame = document.getElementById('cv-frame');
                                if (frame) frame.contentWindow.print();
                            }}
                            title="Print / Save as PDF"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.45rem',
                                padding: '0.45rem 1rem',
                                borderRadius: '100px',
                                border: '1px solid rgba(190,169,142,0.3)',
                                background: 'rgba(190,169,142,0.07)',
                                color: '#bea98e',
                                fontSize: '0.72rem',
                                fontFamily: 'var(--font-body)',
                                letterSpacing: '0.12em',
                                textTransform: 'uppercase',
                                cursor: 'pointer',
                                transition: 'all 0.25s ease',
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
                            <span className="hide-on-mobile">Print / PDF</span>
                        </button>

                        {/* Theme toggle */}
                        <button
                            onClick={() => {
                                // Use direct value (not functional updater) so React Strict Mode
                                // cannot double-invoke and cancel the toggle out
                                const next = !isDark;
                                setIsDark(next);
                                try {
                                    const frame = document.getElementById('cv-frame');
                                    if (frame?.contentWindow?.toggleTheme) {
                                        frame.contentWindow.toggleTheme();
                                    }
                                } catch (e) { /* cross-frame safety */ }
                            }}
                            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                            style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                border: '1px solid rgba(190,169,142,0.2)',
                                background: 'rgba(190,169,142,0.06)',
                                color: isDark ? '#fbbf24' : 'rgba(250,250,250,0.6)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.85rem',
                                transition: 'all 0.25s ease',
                                flexShrink: 0,
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.background = 'rgba(190,169,142,0.14)';
                                e.currentTarget.style.borderColor = 'rgba(190,169,142,0.5)';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.background = 'rgba(190,169,142,0.06)';
                                e.currentTarget.style.borderColor = 'rgba(190,169,142,0.2)';
                            }}
                        >
                            {isDark ? (
                                /* Sun — currently dark, click to go light */
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
                                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                                    <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
                                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                                </svg>
                            ) : (
                                /* Moon — currently light, click to go dark */
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                                </svg>
                            )}
                        </button>

                        {/* Close button */}
                        <button
                            onClick={onClose}
                            title="Close"
                            style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                border: '1px solid rgba(190,169,142,0.2)',
                                background: 'rgba(190,169,142,0.06)',
                                color: 'rgba(250,250,250,0.6)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1rem',
                                transition: 'all 0.25s ease',
                                flexShrink: 0,
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.background = 'rgba(190,169,142,0.14)';
                                e.currentTarget.style.color = '#bea98e';
                                e.currentTarget.style.borderColor = 'rgba(190,169,142,0.5)';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.background = 'rgba(190,169,142,0.06)';
                                e.currentTarget.style.color = 'rgba(250,250,250,0.6)';
                                e.currentTarget.style.borderColor = 'rgba(190,169,142,0.2)';
                            }}
                        >
                            ✕
                        </button>
                    </div>
                </div>

                {/* iframe — key changes on each open to load latest file, src is stable */}
                <iframe
                    id="cv-frame"
                    key={iframeKey}
                    src={`/cv/resume.html?v=${iframeKey}`}
                    title="Md. Abdur Rahim — Curriculum Vitae"
                    style={{
                        flex: 1,
                        width: '100%',
                        border: 'none',
                        background: 'transparent',
                    }}
                />
            </div>
        </div>,
        document.body
    );
};
