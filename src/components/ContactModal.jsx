import React, { useState, useRef, useEffect } from 'react';
import emailjs from '@emailjs/browser';

// ─── EmailJS Configuration ──────────────────────────────────────────────────
const EMAILJS_SERVICE_ID = 'service_89glkdn';
const EMAILJS_TEMPLATE_ID = 'template_y5387u4';
const EMAILJS_PUBLIC_KEY = 'i4oHur5yLcVD28eyI';
// ────────────────────────────────────────────────────────────────────────────

const INITIAL_FORM = {
    from_name: '',
    from_email: '',
    subject: '',
    message: '',
};

/* ── Success Overlay ─────────────────────────────────────────────────────── */
const SuccessOverlay = ({ onReset }) => (
    <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        gap: '1.5rem',
        padding: '3rem 2rem',
        flex: 1,
        minHeight: '360px',
    }}>
        <div style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            background: 'rgba(74, 222, 128, 0.1)',
            border: '1px solid rgba(74, 222, 128, 0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 32px rgba(74, 222, 128, 0.2)',
            animation: 'successPulse 2s ease infinite',
        }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
                stroke="#4ade80" strokeWidth="2.5"
                strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
            </svg>
        </div>

        <div>
            <h3 style={{
                fontSize: '1.5rem',
                color: '#FAFAFA',
                fontFamily: 'var(--font-heading)',
                letterSpacing: '-0.02em',
                marginBottom: '0.75rem',
            }}>
                Message Received.
            </h3>
            <p style={{
                color: 'rgba(250,250,250,0.55)',
                fontSize: '0.95rem',
                lineHeight: 1.75,
                maxWidth: '38ch',
            }}>
                Thank you for reaching out. Your message has been securely transmitted.
                I personally review every inquiry and will respond to you within{' '}
                <span style={{ color: '#bea98e', fontWeight: 600 }}>1–2 business days.</span>
            </p>
        </div>

        <button
            onClick={onReset}
            className="interactive-element"
            style={{
                background: 'transparent',
                border: '1px solid rgba(190,169,142,0.3)',
                color: '#bea98e',
                padding: '0.75rem 2rem',
                borderRadius: '100px',
                fontSize: '0.78rem',
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontFamily: 'var(--font-body)',
            }}
            onMouseOver={e => {
                e.currentTarget.style.background = 'rgba(190,169,142,0.1)';
                e.currentTarget.style.borderColor = 'rgba(190,169,142,0.6)';
            }}
            onMouseOut={e => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.borderColor = 'rgba(190,169,142,0.3)';
            }}
        >
            Send Another Message
        </button>
    </div>
);

/* ── Field Wrapper with Floating Label ───────────────────────────────────── */
const FloatField = ({ id, label, error, focused, hasValue, children }) => (
    <div className="form-field-wrapper" style={{ position: 'relative' }}>
        <label
            htmlFor={id}
            style={{
                position: 'absolute',
                top: (focused || hasValue) ? '-1.2rem' : '0.5rem',
                left: 0,
                fontSize: (focused || hasValue) ? '0.72rem' : '1rem',
                color: error ? '#ef4444' : (focused || hasValue) ? 'var(--accent)' : 'rgba(250,250,250,0.4)',
                textTransform: (focused || hasValue) ? 'uppercase' : 'none',
                letterSpacing: (focused || hasValue) ? '0.1em' : 'normal',
                pointerEvents: 'none',
                transition: 'all 0.3s cubic-bezier(0.25,0.46,0.45,0.94)',
                fontFamily: (focused || hasValue) ? 'var(--font-body)' : 'var(--font-heading)',
                zIndex: 1,
            }}
        >
            {label}
        </label>
        {children}
        {error && (
            <span style={{
                color: '#ef4444',
                fontSize: '0.75rem',
                position: 'absolute',
                bottom: '-1.4rem',
                left: 0,
                fontFamily: 'var(--font-body)',
            }}>
                {error}
            </span>
        )}
    </div>
);

const inputBaseStyle = (focused, error) => ({
    width: '100%',
    background: 'transparent',
    border: 'none',
    borderBottom: `1px solid ${error ? '#ef4444' : focused ? 'var(--accent)' : 'rgba(255,255,255,0.15)'}`,
    padding: '0.5rem 0 0.9rem',
    color: 'var(--text-primary)',
    fontSize: '1rem',
    outline: 'none',
    fontFamily: 'var(--font-body)',
    transition: 'border-color 0.3s ease',
    boxShadow: focused ? '0 1px 0 var(--accent)' : 'none',
});

/* ── Contact Modal Component ─────────────────────────────────────────────── */
export const ContactModal = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState(INITIAL_FORM);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null
    const [errorMsg, setErrorMsg] = useState('');
    const [focusedField, setFocusedField] = useState(null);
    const [isMobileView, setIsMobileView] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobileView(window.innerWidth <= 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Robust scroll locking
    useEffect(() => {
        if (isOpen) {
            const scrollY = window.scrollY;
            document.documentElement.classList.add('lock-scroll');
            document.body.classList.add('lock-scroll');
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.width = '100%';
        } else {
            const scrollY = document.body.style.top;
            document.documentElement.classList.remove('lock-scroll');
            document.body.classList.remove('lock-scroll');
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            if (scrollY) {
                window.scrollTo(0, parseInt(scrollY || '0') * -1);
            }
        }
    }, [isOpen]);

    /* ── Validation ────────────────────────────────────────────────────── */
    const validate = () => {
        const e = {};
        if (!formData.from_name.trim()) e.from_name = 'Full name is required';
        if (!formData.from_email) e.from_email = 'Email address is required';
        else if (!/^\S+@\S+\.\S+$/.test(formData.from_email)) e.from_email = 'Please enter a valid email';
        if (!formData.subject.trim()) e.subject = 'Subject is required';
        if (!formData.message.trim()) e.message = 'Message is required';
        else if (formData.message.trim().length < 20) e.message = 'Please provide at least 20 characters';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    /* ── Submit ────────────────────────────────────────────────────────── */
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setIsSubmitting(true);
        setErrorMsg('');

        try {
            await emailjs.send(
                EMAILJS_SERVICE_ID,
                EMAILJS_TEMPLATE_ID,
                {
                    from_name: formData.from_name,
                    from_email: formData.from_email,
                    visitor_type: 'N/A',
                    subject: formData.subject,
                    message: formData.message,
                    reply_to: formData.from_email,
                    to_email: 'mdrahim.cse@gmail.com',
                },
                EMAILJS_PUBLIC_KEY
            );
            setSubmitStatus('success');
        } catch (err) {
            console.error('EmailJS error:', err);
            setErrorMsg('Something went wrong. Please try emailing me directly at mdrahim.cse@gmail.com');
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
        if (errors[e.target.name]) setErrors(prev => ({ ...prev, [e.target.name]: '' }));
    };

    const handleReset = () => {
        setSubmitStatus(null);
        setFormData(INITIAL_FORM);
        setErrors({});
        setErrorMsg('');
    };

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: isMobileView ? '1rem' : '2rem',
        }}>
            {/* Dark Frosted Glass Overlay Background */}
            <div
                onClick={onClose}
                style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(5, 5, 8, 0.85)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    cursor: 'pointer'
                }}
            />

            {/* Modal Container Matrix */}
            <div className="glass-form glass-card" style={{
                position: 'relative',
                width: '100%',
                maxWidth: '650px',
                padding: isMobileView ? '2.5rem 1.5rem' : '3.5rem',
                borderRadius: '24px',
                display: 'flex',
                flexDirection: 'column',
                maxHeight: '90vh',
                overflowY: 'auto',
                border: '1px solid rgba(190,169,142,0.15)',
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
                backgroundColor: 'rgba(10, 10, 15, 0.95)'
            }}>
                {/* Background glow internal */}
                <div style={{ position: 'absolute', top: '5%', left: '5%', right: '5%', bottom: '5%', background: 'radial-gradient(circle, rgba(190,169,142,0.08) 0%, transparent 60%)', filter: 'blur(30px)', pointerEvents: 'none' }} />

                {/* Close Button X */}
                <button
                    onClick={onClose}
                    className="interactive-element"
                    style={{
                        position: 'absolute',
                        top: '1.5rem',
                        right: '1.5rem',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: 'rgba(250,250,250,0.6)',
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 10,
                        transition: 'all 0.3s ease'
                    }}
                    onMouseOver={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
                    onMouseOut={e => { e.currentTarget.style.color = 'rgba(250,250,250,0.6)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>

                <h3 style={{ fontSize: '1.6rem', color: '#FAFAFA', marginBottom: '0.4rem', letterSpacing: '-0.01em', position: 'relative', zIndex: 2 }}>Let's Connect.</h3>
                <p style={{ color: 'rgba(190,169,142,0.85)', fontSize: '0.9rem', marginBottom: '3rem', fontFamily: 'var(--font-body)', letterSpacing: '0.04em', position: 'relative', zIndex: 2 }}>I'm open to discussing full-time leadership opportunities.</p>

                {/* ─── SUCCESS STATE ─── */}
                {submitStatus === 'success' ? (
                    <SuccessOverlay onReset={handleReset} />
                ) : (
                    <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', flex: 1, position: 'relative', zIndex: 2 }}>

                        {/* Row 1: Full Name */}
                        <FloatField id="modal_from_name" label="Full Name" error={errors.from_name} focused={focusedField === 'from_name'} hasValue={!!formData.from_name}>
                            <input
                                id="modal_from_name"
                                type="text"
                                name="from_name"
                                value={formData.from_name}
                                onChange={handleChange}
                                onFocus={() => setFocusedField('from_name')}
                                onBlur={() => setFocusedField(null)}
                                autoComplete="name"
                                className="interactive-element"
                                style={inputBaseStyle(focusedField === 'from_name', errors.from_name)}
                            />
                        </FloatField>

                        {/* Row 2: Email */}
                        <FloatField id="modal_from_email" label="Your Email Address" error={errors.from_email} focused={focusedField === 'from_email'} hasValue={!!formData.from_email}>
                            <input
                                id="modal_from_email"
                                type="email"
                                name="from_email"
                                value={formData.from_email}
                                onChange={handleChange}
                                onFocus={() => setFocusedField('from_email')}
                                onBlur={() => setFocusedField(null)}
                                autoComplete="email"
                                className="interactive-element"
                                style={inputBaseStyle(focusedField === 'from_email', errors.from_email)}
                            />
                        </FloatField>

                        {/* Row 3: Subject */}
                        <FloatField id="modal_subject" label="Subject / Purpose" error={errors.subject} focused={focusedField === 'subject'} hasValue={!!formData.subject}>
                            <input
                                id="modal_subject"
                                type="text"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                onFocus={() => setFocusedField('subject')}
                                onBlur={() => setFocusedField(null)}
                                className="interactive-element"
                                style={inputBaseStyle(focusedField === 'subject', errors.subject)}
                            />
                        </FloatField>

                        {/* Row 4: Message */}
                        <div className="form-field-wrapper" style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <label htmlFor="modal_message" style={{
                                position: 'absolute',
                                top: (focusedField === 'message' || formData.message) ? '-1.5rem' : '0.5rem',
                                left: 0,
                                fontSize: (focusedField === 'message' || formData.message) ? '0.72rem' : '1rem',
                                color: errors.message ? '#ef4444' : (focusedField === 'message' || formData.message) ? 'var(--accent)' : 'rgba(250,250,250,0.4)',
                                textTransform: (focusedField === 'message' || formData.message) ? 'uppercase' : 'none',
                                letterSpacing: (focusedField === 'message' || formData.message) ? '0.1em' : 'normal',
                                pointerEvents: 'none',
                                transition: 'all 0.3s ease',
                                fontFamily: (focusedField === 'message' || formData.message) ? 'var(--font-body)' : 'var(--font-heading)',
                            }}>
                                Your Message
                            </label>
                            <textarea
                                id="modal_message"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                onFocus={() => setFocusedField('message')}
                                onBlur={() => setFocusedField(null)}
                                rows={4}
                                className="interactive-element"
                                style={{
                                    ...inputBaseStyle(focusedField === 'message', errors.message),
                                    resize: 'none',
                                    paddingTop: '0.8rem',
                                }}
                            />
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                marginTop: '0.4rem',
                                fontSize: '0.75rem',
                            }}>
                                {errors.message ? (
                                    <span style={{ color: '#ef4444', fontFamily: 'var(--font-body)' }}>{errors.message}</span>
                                ) : (
                                    <span style={{ color: 'transparent' }}>Error</span> // spacer
                                )}
                                <span style={{
                                    color: formData.message.length >= 20 ? 'rgba(74,222,128,0.6)' : 'rgba(250,250,250,0.3)',
                                    transition: 'color 0.3s ease',
                                    fontFamily: 'var(--font-body)',
                                    alignSelf: 'flex-end',
                                }}>
                                    {formData.message.length} / 20 min
                                </span>
                            </div>
                        </div>

                        {/* Submit Row */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '0.5rem', gap: '1rem', flexWrap: 'wrap' }}>
                            {/* Error banner */}
                            {submitStatus === 'error' && (
                                <p style={{ color: '#f87171', fontSize: '0.82rem', margin: 0, flex: 1, lineHeight: 1.5 }}>
                                    {errorMsg}
                                </p>
                            )}
                            <div style={{ flex: 1 }} />

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="interactive-element"
                                style={{
                                    alignSelf: 'flex-end',
                                    background: isSubmitting ? 'rgba(255,255,255,0.05)' : '#FAFAFA',
                                    color: isSubmitting ? 'rgba(250,250,250,0.4)' : '#0A0A12',
                                    border: 'none',
                                    padding: '0.8rem 2rem',
                                    borderRadius: '100px',
                                    fontWeight: 700,
                                    fontSize: '0.82rem',
                                    letterSpacing: '0.08em',
                                    textTransform: 'uppercase',
                                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.8rem',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    transition: 'all 0.3s ease',
                                }}
                                onMouseOver={e => {
                                    if (!isSubmitting) {
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                        e.currentTarget.style.boxShadow = '0 10px 20px rgba(250,250,250,0.15)';
                                    }
                                }}
                                onMouseOut={e => {
                                    if (!isSubmitting) {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = 'none';
                                    }
                                }}
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className="spinner" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1s linear infinite' }}>
                                            <line x1="12" y1="2" x2="12" y2="6"></line>
                                            <line x1="12" y1="18" x2="12" y2="22"></line>
                                            <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
                                            <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
                                            <line x1="2" y1="12" x2="6" y2="12"></line>
                                            <line x1="18" y1="12" x2="22" y2="12"></line>
                                            <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
                                            <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
                                        </svg>
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        Send Message
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                )}
            </div>
            {/* ── Keyframe Styles ── */}
            <style>{`
                @keyframes successPulse {
                    0%, 100% { box-shadow: 0 0 20px rgba(74,222,128,0.15); }
                    50%       { box-shadow: 0 0 40px rgba(74,222,128,0.35); }
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to   { transform: rotate(360deg); }
                }
                /* Hide native scrollbar in modal on webkit */
                .glass-form::-webkit-scrollbar {
                    width: 6px;
                }
                .glass-form::-webkit-scrollbar-track {
                    background: transparent;
                }
                .glass-form::-webkit-scrollbar-thumb {
                    background: rgba(255,255,255,0.1);
                    border-radius: 10px;
                }
            `}</style>
        </div>
    );
}
