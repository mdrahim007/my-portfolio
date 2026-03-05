import React, { useState, useRef, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useScrollReveal } from '../hooks/useScrollReveal';

gsap.registerPlugin(ScrollTrigger);

// ─── EmailJS Configuration ──────────────────────────────────────────────────
// 1. Create a free account at https://www.emailjs.com/
// 2. Add a Gmail service and connect mdrahim.cse@gmail.com
// 3. Create an email template — use these variable names: {{from_name}}, {{from_email}},
//    {{visitor_type}}, {{subject}}, {{message}}, {{reply_to}}
// 4. Replace the three constants below with your actual IDs from the EmailJS dashboard
const EMAILJS_SERVICE_ID = 'service_89glkdn';   // e.g. 'service_abc123'
const EMAILJS_TEMPLATE_ID = 'template_y5387u4';  // e.g. 'template_xyz456'
const EMAILJS_PUBLIC_KEY = 'i4oHur5yLcVD28eyI';   // e.g. 'uABCDEFGHIJKLMNOP'
// ────────────────────────────────────────────────────────────────────────────

const VISITOR_TYPES = [
    { value: '', label: 'Select Visitor Type' },
    { value: 'Recruiter', label: 'Recruiter / HR Professional' },
    { value: 'Business', label: 'Business Partner / Client' },
    { value: 'Government', label: 'Government / Public Sector' },
    { value: 'Developer', label: 'Fellow Developer / Technologist' },
    { value: 'General', label: 'General Visitor' },
    { value: 'Other', label: 'Other' },
];

const INITIAL_FORM = {
    from_name: '',
    from_email: '',
    visitor_type: '',
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
        {/* Animated checkmark */}
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

/* ── Main Contact Component ─────────────────────────────────────────────── */
export const Contact = () => {
    const [formData, setFormData] = useState(INITIAL_FORM);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null
    const [errorMsg, setErrorMsg] = useState('');
    const [focusedField, setFocusedField] = useState(null);

    const sectionRef = useRef(null);
    const formRef = useRef(null);
    const infoRef = useRef(null);

    useScrollReveal(sectionRef);

    /* ── Mobile detection ─────────────────────────────────────────────── */
    const [isMobileView, setIsMobileView] = useState(
        () => typeof window !== 'undefined' && window.innerWidth <= 900
    );
    useEffect(() => {
        const mq = window.matchMedia('(max-width: 900px)');
        const handler = (e) => setIsMobileView(e.matches);
        mq.addEventListener('change', handler);
        return () => mq.removeEventListener('change', handler);
    }, []);

    /* ── GSAP Entry Animations ────────────────────────────────────────── */
    useEffect(() => {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) return;

        const ctx = gsap.context(() => {
            if (infoRef.current) {
                gsap.fromTo(
                    infoRef.current.querySelectorAll('.contact-info-card'),
                    { y: 30, opacity: 0 },
                    {
                        y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power3.out',
                        scrollTrigger: { trigger: infoRef.current, start: 'top 80%', toggleActions: 'play none none none' },
                    }
                );
            }
            if (formRef.current) {
                gsap.fromTo(
                    formRef.current.querySelectorAll('.form-field-wrapper, button[type="submit"]'),
                    { x: 30, opacity: 0 },
                    {
                        x: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out',
                        scrollTrigger: { trigger: formRef.current, start: 'top 80%', toggleActions: 'play none none none' },
                    }
                );
            }
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    /* ── Validation ────────────────────────────────────────────────────── */
    const validate = () => {
        const e = {};
        if (!formData.from_name.trim()) e.from_name = 'Full name is required';
        if (!formData.from_email) e.from_email = 'Email address is required';
        else if (!/^\S+@\S+\.\S+$/.test(formData.from_email)) e.from_email = 'Please enter a valid email';
        if (!formData.visitor_type) e.visitor_type = 'Please select your visitor type';
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
                    visitor_type: formData.visitor_type,
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

    /* ── Render ─────────────────────────────────────────────────────────── */
    return (
        <section
            id="contact"
            ref={sectionRef}
            className="section-padding"
            style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                overflow: 'hidden',
                paddingBottom: '15rem',
            }}
        >
            <div className="global-container" style={{ position: 'relative' }}>

                {/* ── 2-Column Grid ── */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: isMobileView ? '1fr' : '0.5fr 0.5fr',
                    gap: isMobileView ? '3rem' : '4rem',
                    alignItems: 'stretch',
                }}>

                    {/* ── LEFT: Editorial & Contact Info ── */}
                    <div ref={infoRef} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                        <div style={{ marginBottom: '0.5rem' }}>
                            <span className="eyebrow-pill animate-eyebrow">07 — Contact</span>
                        </div>
                        <h2
                            className="animate-heading"
                            style={{
                                fontSize: 'clamp(2rem, 4.2vw, 4rem)',
                                marginTop: 0,
                                marginBottom: '1.5rem',
                                color: 'var(--text-primary)',
                                letterSpacing: '-0.03em',
                                lineHeight: 1.05,
                            }}
                        >
                            Let's Build <span style={{ color: 'var(--accent)', fontStyle: 'italic', fontWeight: 400 }}>Together.</span>
                        </h2>
                        <p className="animate-heading" style={{ color: 'rgba(250,250,250,0.6)', marginBottom: '0.8rem', fontSize: '1.05rem', lineHeight: 1.7, maxWidth: '45ch' }}>
                            I partner with visionary organizations to architect robust digital ecosystems, optimize enterprise workflows, and elevate technical operations. If you are looking for leadership that bridges the gap between complex infrastructure and seamless user experiences, let's explore how my expertise aligns with your objectives.
                        </p>

                        {/* Contact Channel Cards */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem', flex: 1 }}>
                            {/* Email */}
                            <a href="mailto:mdrahim.cse@gmail.com" className="contact-info-card glass-card interactive-element" style={{ textDecoration: 'none', padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1.2rem', position: 'relative', flex: 1 }}>
                                <div className="card-icon" style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(12,12,12,0.4)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(250,250,250,0.7)', transition: 'all 0.4s ease', flexShrink: 0 }}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                                </div>
                                <div>
                                    <span className="eyebrow" style={{ marginBottom: '0.2rem', fontSize: '0.7rem' }}>Direct Email</span>
                                    <h4 style={{ color: '#FAFAFA', fontSize: '1.05rem', fontWeight: 500, letterSpacing: '0.02em', margin: 0 }}>mdrahim.cse@gmail.com</h4>
                                </div>
                            </a>

                            {/* LinkedIn */}
                            <a href="https://www.linkedin.com/in/abrahim007" target="_blank" rel="noopener noreferrer" className="contact-info-card glass-card interactive-element" style={{ textDecoration: 'none', padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1.2rem', position: 'relative', flex: 1 }}>
                                <div className="card-icon" style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(12,12,12,0.4)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(250,250,250,0.7)', transition: 'all 0.4s ease', flexShrink: 0 }}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>
                                </div>
                                <div>
                                    <span className="eyebrow" style={{ marginBottom: '0.2rem', fontSize: '0.7rem' }}>Professional Network</span>
                                    <h4 style={{ color: '#FAFAFA', fontSize: '1.05rem', fontWeight: 500, letterSpacing: '0.02em', margin: 0 }}>Connect on LinkedIn</h4>
                                </div>
                            </a>

                            {/* Phone */}
                            <a href="tel:+8801722108281" className="contact-info-card glass-card interactive-element" style={{ textDecoration: 'none', padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1.2rem', position: 'relative', flex: 1 }}>
                                <div className="card-icon" style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(12,12,12,0.4)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(250,250,250,0.7)', transition: 'all 0.4s ease', flexShrink: 0 }}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                                </div>
                                <div>
                                    <span className="eyebrow" style={{ marginBottom: '0.2rem', fontSize: '0.7rem' }}>Direct Line</span>
                                    <h4 style={{ color: '#FAFAFA', fontSize: '1.05rem', fontWeight: 500, letterSpacing: '0.02em', margin: 0 }}>+880 1722 108 281</h4>
                                </div>
                            </a>
                        </div>
                    </div>

                    {/* ── RIGHT: Glass Form ── */}
                    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', height: '100%', padding: '0 0' }}>
                        {/* Background glow */}
                        <div style={{ position: 'absolute', top: '5%', left: '5%', right: '5%', bottom: '5%', background: 'radial-gradient(circle, rgba(190,169,142,0.12) 0%, transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none' }} />

                        <div className="glass-form glass-card" style={{ padding: isMobileView ? '2rem 1.5rem' : '2.5rem', flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
                            {/* Corner accent */}
                            <div style={{ position: 'absolute', top: 0, right: 0, width: '30%', height: '30%', borderTop: '1px solid rgba(190,169,142,0.3)', borderRight: '1px solid rgba(190,169,142,0.3)', borderTopRightRadius: '24px', pointerEvents: 'none' }} />

                            <h3 style={{ fontSize: '1.4rem', color: '#FAFAFA', marginBottom: '0.4rem', letterSpacing: '-0.01em' }}>Send a Message</h3>
                            <p style={{ color: 'rgba(250,250,250,0.4)', fontSize: '0.82rem', marginBottom: '3rem', fontFamily: 'var(--font-body)', letterSpacing: '0.04em' }}>All inquiries welcome — recruiters, partners, and visitors alike.</p>

                            {/* ─── SUCCESS STATE ─── */}
                            {submitStatus === 'success' ? (
                                <SuccessOverlay onReset={handleReset} />
                            ) : (
                                <form ref={formRef} onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '2.2rem', flex: 1 }}>

                                    {/* Row 1: Full Name + Visitor Type */}
                                    <div style={{ display: 'grid', gridTemplateColumns: isMobileView ? '1fr' : '1fr 1fr', gap: isMobileView ? '2.2rem' : '2rem' }}>
                                        <FloatField id="from_name" label="Full Name" error={errors.from_name} focused={focusedField === 'from_name'} hasValue={!!formData.from_name}>
                                            <input
                                                id="from_name"
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

                                        {/* Visitor Type Dropdown */}
                                        <div className="form-field-wrapper" style={{ position: 'relative' }}>
                                            <label htmlFor="visitor_type" style={{
                                                position: 'absolute',
                                                top: (focusedField === 'visitor_type' || formData.visitor_type) ? '-1.2rem' : '0.5rem',
                                                left: 0,
                                                fontSize: (focusedField === 'visitor_type' || formData.visitor_type) ? '0.72rem' : '1rem',
                                                color: errors.visitor_type ? '#ef4444' : (focusedField === 'visitor_type' || formData.visitor_type) ? 'var(--accent)' : 'rgba(250,250,250,0.4)',
                                                textTransform: (focusedField === 'visitor_type' || formData.visitor_type) ? 'uppercase' : 'none',
                                                letterSpacing: (focusedField === 'visitor_type' || formData.visitor_type) ? '0.1em' : 'normal',
                                                pointerEvents: 'none',
                                                transition: 'all 0.3s ease',
                                                fontFamily: (focusedField === 'visitor_type' || formData.visitor_type) ? 'var(--font-body)' : 'var(--font-heading)',
                                                zIndex: 1,
                                            }}>
                                                Visitor Type
                                            </label>
                                            <select
                                                id="visitor_type"
                                                name="visitor_type"
                                                value={formData.visitor_type}
                                                onChange={handleChange}
                                                onFocus={() => setFocusedField('visitor_type')}
                                                onBlur={() => setFocusedField(null)}
                                                className="interactive-element"
                                                style={{
                                                    ...inputBaseStyle(focusedField === 'visitor_type', errors.visitor_type),
                                                    color: formData.visitor_type === '' ? 'transparent' : 'var(--text-primary)',
                                                    cursor: 'pointer',
                                                    appearance: 'none',
                                                    WebkitAppearance: 'none',
                                                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='rgba(250,250,250,0.4)' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
                                                    backgroundRepeat: 'no-repeat',
                                                    backgroundPosition: 'right 0.25rem center',
                                                    paddingRight: '1.5rem',
                                                }}
                                            >
                                                {VISITOR_TYPES.map(({ value, label }) => (
                                                    <option key={value} value={value} style={{ background: '#1e1e1e', color: '#FAFAFA' }}>{label}</option>
                                                ))}
                                            </select>
                                            {errors.visitor_type && <span style={{ color: '#ef4444', fontSize: '0.75rem', position: 'absolute', bottom: '-1.4rem', left: 0 }}>{errors.visitor_type}</span>}
                                        </div>
                                    </div>

                                    {/* Row 2: Email */}
                                    <FloatField id="from_email" label="Your Email Address" error={errors.from_email} focused={focusedField === 'from_email'} hasValue={!!formData.from_email}>
                                        <input
                                            id="from_email"
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
                                    <FloatField id="subject" label="Subject / Role / Purpose" error={errors.subject} focused={focusedField === 'subject'} hasValue={!!formData.subject}>
                                        <input
                                            id="subject"
                                            type="text"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            onFocus={() => setFocusedField('subject')}
                                            onBlur={() => setFocusedField(null)}
                                            placeholder=""
                                            className="interactive-element"
                                            style={inputBaseStyle(focusedField === 'subject', errors.subject)}
                                        />
                                    </FloatField>

                                    {/* Row 4: Message */}
                                    <div className="form-field-wrapper" style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                        <label htmlFor="message" style={{
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
                                            id="message"
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            onFocus={() => setFocusedField('message')}
                                            onBlur={() => setFocusedField(null)}
                                            rows={4}
                                            className="interactive-element"
                                            style={{
                                                ...inputBaseStyle(focusedField === 'message', errors.message),
                                                flex: 1,
                                                minHeight: '110px',
                                                resize: 'none',
                                            }}
                                        />
                                        {errors.message && <span style={{ color: '#ef4444', fontSize: '0.75rem', position: 'absolute', bottom: '-1.4rem', left: 0 }}>{errors.message}</span>}
                                    </div>

                                    {/* Submit Row */}
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '1.5rem', gap: '1rem', flexWrap: 'wrap' }}>
                                        {/* Error banner */}
                                        {submitStatus === 'error' && (
                                            <p style={{ color: '#f87171', fontSize: '0.82rem', margin: 0, flex: 1, lineHeight: 1.5 }}>
                                                {errorMsg}
                                            </p>
                                        )}
                                        {!submitStatus && <div />}

                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="interactive-element"
                                            style={{
                                                background: isSubmitting ? 'rgba(190,169,142,0.1)' : 'rgba(190,169,142,0.08)',
                                                border: '1px solid rgba(190,169,142,0.3)',
                                                color: '#bea98e',
                                                padding: '0.9rem 2.2rem',
                                                borderRadius: '100px',
                                                fontSize: '0.82rem',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.15em',
                                                fontWeight: 600,
                                                fontFamily: 'var(--font-body)',
                                                transition: 'all 0.3s cubic-bezier(0.25,0.46,0.45,0.94)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.75rem',
                                                marginLeft: 'auto',
                                                cursor: isSubmitting ? 'wait' : 'pointer',
                                                opacity: isSubmitting ? 0.7 : 1,
                                                whiteSpace: 'nowrap',
                                            }}
                                            onMouseOver={(e) => {
                                                if (!isSubmitting) {
                                                    e.currentTarget.style.background = 'var(--accent)';
                                                    e.currentTarget.style.color = '#0c0c0c';
                                                    e.currentTarget.style.boxShadow = '0 0 20px rgba(190,169,142,0.4)';
                                                }
                                            }}
                                            onMouseOut={(e) => {
                                                if (!isSubmitting) {
                                                    e.currentTarget.style.background = 'rgba(190,169,142,0.08)';
                                                    e.currentTarget.style.color = '#bea98e';
                                                    e.currentTarget.style.boxShadow = 'none';
                                                }
                                            }}
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
                                                    Sending…
                                                </>
                                            ) : (
                                                <>
                                                    Send Message
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'transform 0.3s ease' }}><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Footer ── */}
            <footer style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', borderTop: '1px solid rgba(255,255,255,0.04)', backgroundColor: 'rgba(5,5,8,0.95)', zIndex: 20 }}>
                <div className="global-container" style={{ display: 'flex', flexDirection: isMobileView ? 'column' : 'row', justifyContent: 'space-between', alignItems: 'center', gap: isMobileView ? '1.5rem' : '0', paddingTop: '2rem', paddingBottom: '2rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', alignItems: isMobileView ? 'center' : 'flex-start', textAlign: isMobileView ? 'center' : 'left' }}>
                        <span style={{ fontSize: '1rem', fontFamily: 'var(--font-heading)', fontWeight: 400, letterSpacing: '0.04em', color: '#FAFAFA' }}>ABDUR RAHIM</span>
                        <span style={{ fontSize: '0.65rem', color: 'rgba(250,250,250,0.3)', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 500 }}>&copy; {new Date().getFullYear()} All rights reserved.</span>
                    </div>
                    <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'center' }}>
                        <a href="https://www.linkedin.com/in/abrahim007" target="_blank" rel="noreferrer" className="interactive-element" style={{ color: 'rgba(250,250,250,0.5)', transition: 'color 0.3s ease, transform 0.3s ease' }} onMouseOver={e => { e.currentTarget.style.color = '#bea98e'; e.currentTarget.style.transform = 'translateY(-2px)'; }} onMouseOut={e => { e.currentTarget.style.color = 'rgba(250,250,250,0.5)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>
                        </a>
                        <a href="https://github.com" target="_blank" rel="noreferrer" className="interactive-element" style={{ color: 'rgba(250,250,250,0.5)', transition: 'color 0.3s ease, transform 0.3s ease' }} onMouseOver={e => { e.currentTarget.style.color = '#bea98e'; e.currentTarget.style.transform = 'translateY(-2px)'; }} onMouseOut={e => { e.currentTarget.style.color = 'rgba(250,250,250,0.5)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" /></svg>
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noreferrer" className="interactive-element" style={{ color: 'rgba(250,250,250,0.5)', transition: 'color 0.3s ease, transform 0.3s ease' }} onMouseOver={e => { e.currentTarget.style.color = '#bea98e'; e.currentTarget.style.transform = 'translateY(-2px)'; }} onMouseOut={e => { e.currentTarget.style.color = 'rgba(250,250,250,0.5)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" /></svg>
                        </a>
                    </div>
                    <div style={{ alignSelf: 'center' }}>
                        <a href="#home" className="interactive-element" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', color: '#bea98e', textDecoration: 'none', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.6rem 1.2rem', border: '1px solid rgba(190,169,142,0.25)', borderRadius: '100px', transition: 'all 0.3s ease' }}
                            onMouseOver={e => { e.currentTarget.style.background = 'rgba(190,169,142,0.1)'; e.currentTarget.style.borderColor = 'rgba(190,169,142,0.5)'; }}
                            onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(190,169,142,0.25)'; }}
                        >
                            Back to Top
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="19" x2="12" y2="5" /><polyline points="5 12 12 5 19 12" /></svg>
                        </a>
                    </div>
                </div>
            </footer>

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
                /* Style the select options correctly */
                #visitor_type option { background: #1a1a1a; color: #FAFAFA; }

                /* Contact section mobile overrides */
                @media (max-width: 900px) {
                    #contact .glass-form { padding: 1.8rem 1.2rem !important; }
                }
            `}</style>
        </section>
    );
};
