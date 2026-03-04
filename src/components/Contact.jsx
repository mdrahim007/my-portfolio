import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useScrollReveal } from '../hooks/useScrollReveal';

gsap.registerPlugin(ScrollTrigger);

export const Contact = () => {
    const [formData, setFormData] = useState({ name: '', email: '', inquiry: '' });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);
    const [focusedField, setFocusedField] = useState(null);

    const sectionRef = useRef(null);
    const formRef = useRef(null);
    const infoRef = useRef(null);

    useScrollReveal(sectionRef);

    /* ── Mobile detection ──────────────────────────────────── */
    const [isMobileView, setIsMobileView] = useState(() => typeof window !== 'undefined' && window.innerWidth <= 900);
    useEffect(() => {
        const mq = window.matchMedia('(max-width: 900px)');
        const handler = (e) => setIsMobileView(e.matches);
        mq.addEventListener('change', handler);
        return () => mq.removeEventListener('change', handler);
    }, []);

    useEffect(() => {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) return;

        const ctx = gsap.context(() => {
            // Animate info cards
            if (infoRef.current) {
                const cards = infoRef.current.querySelectorAll('.contact-info-card');
                gsap.fromTo(
                    cards,
                    { y: 30, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 0.8,
                        stagger: 0.15,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: infoRef.current,
                            start: 'top 80%',
                            toggleActions: 'play none none none',
                        },
                    }
                );
            }

            // Animate form fields
            if (formRef.current) {
                const fields = formRef.current.querySelectorAll('.form-field-wrapper, button[type="submit"]');
                gsap.fromTo(
                    fields,
                    { x: 30, opacity: 0 },
                    {
                        x: 0,
                        opacity: 1,
                        duration: 0.8,
                        stagger: 0.1,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: formRef.current,
                            start: 'top 80%',
                            toggleActions: 'play none none none',
                        },
                    }
                );
            }
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    const validate = () => {
        let tempErrors = {};
        if (!formData.name.trim()) tempErrors.name = "Name is required";
        if (!formData.email) {
            tempErrors.email = "Professional Email is required";
        } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
            tempErrors.email = "Email format is invalid";
        }
        if (!formData.inquiry.trim()) tempErrors.inquiry = "Inquiry is required";

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            setIsSubmitting(true);
            // Simulate API call
            setTimeout(() => {
                setIsSubmitting(false);
                setSubmitStatus("Transmission successful. I will respond shortly.");
                setFormData({ name: '', email: '', inquiry: '' });
                // Clear success message after 5 seconds
                setTimeout(() => setSubmitStatus(null), 5000);
            }, 1500);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: '' });
        }
    };

    return (
        <section
            id="contact"
            ref={sectionRef}
            className="section-padding"
            style={{
                position: 'relative',
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                paddingTop: isMobileView ? 'var(--section-padding-mobile)' : 'var(--section-padding)',
                // On mobile, the footer is taller because it stacks. Give it exactly enough room, but no extra gap.
                // On desktop, the footer is a single row.
                paddingBottom: isMobileView ? '180px' : '100px',
                overflow: 'hidden'
            }}
        >
            <div className="global-container" style={{ position: 'relative' }}>

                {/* ── Desktop 2-Column Grid / Mobile Stacked ── */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: isMobileView ? '1fr' : '0.5fr 0.5fr',
                    gap: isMobileView ? '3rem' : '4rem',
                    alignItems: 'stretch',
                    paddingBottom: isMobileView ? '8rem' : '10rem',
                }}>

                    {/* ── LEFT COLUMN: Editorial & Value Prop ── */}
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
                                whiteSpace: 'nowrap'
                            }}
                        >
                            Let's Build <span style={{ color: 'var(--accent)', fontStyle: 'italic', fontWeight: 400 }}>Together.</span>
                        </h2>
                        <p className="animate-heading" style={{ color: 'rgba(250,250,250,0.6)', marginBottom: '0.8rem', fontSize: '1.1rem', lineHeight: 1.7, maxWidth: '45ch' }}>
                            Whether you're scaling a national portal, optimizing ITSM workflows, or seeking a visionary support leader—I am ready to architect your next success.
                        </p>

                        {/* Premium Contact Channels Grid */}
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1rem',
                            marginTop: '2rem' // Removed 'auto' and used a fixed smaller gap as requested
                        }}>
                            {/* Email Card */}
                            <a href="mailto:mdrahim.cse@gmail.com" className="contact-info-card glass-card interactive-element" style={{
                                textDecoration: 'none',
                                padding: '1.25rem', // Reduced padding
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1.2rem',
                                position: 'relative',
                            }}>
                                <div className="card-icon" style={{
                                    width: '48px', height: '48px', borderRadius: '50%', // Reduced size
                                    background: 'rgba(12, 12, 12, 0.4)',
                                    border: '1px solid rgba(255,255,255,0.08)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: 'rgba(250, 250, 250, 0.7)',
                                    transition: 'all 0.4s ease'
                                }}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                        <polyline points="22,6 12,13 2,6"></polyline>
                                    </svg>
                                </div>
                                <div>
                                    <span className="eyebrow" style={{ marginBottom: '0.2rem', fontSize: '0.7rem' }}>Direct Email</span>
                                    <h4 style={{ color: '#FAFAFA', fontSize: '1.1rem', fontWeight: 500, letterSpacing: '0.02em', margin: 0 }}>mdrahim.cse@gmail.com</h4>
                                </div>
                            </a>

                            {/* LinkedIn Card */}
                            <a href="https://www.linkedin.com/in/abrahim007" target="_blank" rel="noopener noreferrer" className="contact-info-card glass-card interactive-element" style={{
                                textDecoration: 'none',
                                padding: '1.25rem', // Reduced padding
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1.2rem',
                                position: 'relative',
                            }}>
                                <div className="card-icon" style={{
                                    width: '48px', height: '48px', borderRadius: '50%', // Reduced size
                                    background: 'rgba(12, 12, 12, 0.4)',
                                    border: '1px solid rgba(255,255,255,0.08)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: 'rgba(250, 250, 250, 0.7)',
                                    transition: 'all 0.4s ease'
                                }}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                                        <rect x="2" y="9" width="4" height="12"></rect>
                                        <circle cx="4" cy="4" r="2"></circle>
                                    </svg>
                                </div>
                                <div>
                                    <span className="eyebrow" style={{ marginBottom: '0.2rem', fontSize: '0.7rem' }}>Professional Network</span>
                                    <h4 style={{ color: '#FAFAFA', fontSize: '1.1rem', fontWeight: 500, letterSpacing: '0.02em', margin: 0 }}>Connect on LinkedIn</h4>
                                </div>
                            </a>

                            {/* Phone Card */}
                            <a href="tel:+8801722108281" className="contact-info-card glass-card interactive-element" style={{
                                textDecoration: 'none',
                                padding: '1.25rem', // Reduced padding
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1.2rem',
                                position: 'relative',
                            }}>
                                <div className="card-icon" style={{
                                    width: '48px', height: '48px', borderRadius: '50%', // Reduced size
                                    background: 'rgba(12, 12, 12, 0.4)',
                                    border: '1px solid rgba(255,255,255,0.08)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: 'rgba(250, 250, 250, 0.7)',
                                    transition: 'all 0.4s ease'
                                }}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                                    </svg>
                                </div>
                                <div>
                                    <span className="eyebrow" style={{ marginBottom: '0.2rem', fontSize: '0.7rem' }}>Direct Line</span>
                                    <h4 style={{ color: '#FAFAFA', fontSize: '1.1rem', fontWeight: 500, letterSpacing: '0.02em', margin: 0 }}>+880 1722 108 281</h4>
                                </div>
                            </a>
                        </div>
                    </div>

                    {/* ── RIGHT COLUMN: Glassmorphic Form ── */}
                    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', height: '100%', padding: '10px 0' /* Prevents hover box-shadow top-clipping */ }}>
                        {/* Decorative background glow */}
                        <div style={{
                            position: 'absolute',
                            top: '5%',
                            left: '5%',
                            right: '5%',
                            bottom: '5%',
                            background: 'radial-gradient(circle, rgba(190, 169, 142, 0.12) 0%, transparent 70%)',
                            filter: 'blur(40px)',
                            pointerEvents: 'none',
                        }} />

                        <div className="glass-form glass-card" style={{ padding: isMobileView ? '2rem 1.5rem' : '2.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                            {/* Decorative corner accent */}
                            <div style={{
                                position: 'absolute',
                                top: 0,
                                right: 0,
                                width: '30%',
                                height: '30%',
                                borderTop: '1px solid rgba(190, 169, 142, 0.3)',
                                borderRight: '1px solid rgba(190, 169, 142, 0.3)',
                                borderTopRightRadius: '24px',
                                pointerEvents: 'none',
                            }} />

                            <h3 style={{ fontSize: '1.4rem', color: '#FAFAFA', marginBottom: '1.8rem', letterSpacing: '-0.01em' }}>Initiate Contact</h3>

                            <form ref={formRef} onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem', flex: 1 }}>

                                {/* Name Field */}
                                <div className="form-field-wrapper" style={{ position: 'relative' }}>
                                    <label style={{
                                        position: 'absolute',
                                        top: (focusedField === 'name' || formData.name) ? '-1.2rem' : '0.5rem',
                                        left: 0,
                                        fontSize: (focusedField === 'name' || formData.name) ? '0.75rem' : '1.1rem',
                                        color: (focusedField === 'name' || formData.name) ? 'var(--accent)' : 'rgba(250,250,250,0.4)',
                                        textTransform: (focusedField === 'name' || formData.name) ? 'uppercase' : 'none',
                                        letterSpacing: (focusedField === 'name' || formData.name) ? '0.1em' : 'normal',
                                        pointerEvents: 'none',
                                        transition: 'all 0.3s ease',
                                        fontFamily: (focusedField === 'name' || formData.name) ? 'var(--font-body)' : 'var(--font-heading)',
                                    }}>Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        onFocus={() => setFocusedField('name')}
                                        onBlur={() => setFocusedField(null)}
                                        className="interactive-element"
                                        style={{
                                            width: '100%',
                                            background: 'transparent',
                                            border: 'none',
                                            borderBottom: `1px solid ${errors.name ? '#ef4444' : (focusedField === 'name' ? 'var(--accent)' : 'rgba(255,255,255,0.15)')}`,
                                            padding: '0.5rem 0 1rem',
                                            color: 'var(--text-primary)',
                                            fontSize: '1.1rem',
                                            outline: 'none',
                                            transition: 'border-color 0.3s ease',
                                            boxShadow: focusedField === 'name' ? '0 1px 0 var(--accent)' : 'none',
                                        }}
                                    />
                                    {errors.name && <span style={{ color: '#ef4444', fontSize: '0.8rem', position: 'absolute', bottom: '-1.5rem', left: 0 }}>{errors.name}</span>}
                                </div>

                                {/* Email Field */}
                                <div className="form-field-wrapper" style={{ position: 'relative' }}>
                                    <label style={{
                                        position: 'absolute',
                                        top: (focusedField === 'email' || formData.email) ? '-1.2rem' : '0.5rem',
                                        left: 0,
                                        fontSize: (focusedField === 'email' || formData.email) ? '0.75rem' : '1.1rem',
                                        color: (focusedField === 'email' || formData.email) ? 'var(--accent)' : 'rgba(250,250,250,0.4)',
                                        textTransform: (focusedField === 'email' || formData.email) ? 'uppercase' : 'none',
                                        letterSpacing: (focusedField === 'email' || formData.email) ? '0.1em' : 'normal',
                                        pointerEvents: 'none',
                                        transition: 'all 0.3s ease',
                                        fontFamily: (focusedField === 'email' || formData.email) ? 'var(--font-body)' : 'var(--font-heading)',
                                    }}>Professional Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        onFocus={() => setFocusedField('email')}
                                        onBlur={() => setFocusedField(null)}
                                        className="interactive-element"
                                        style={{
                                            width: '100%',
                                            background: 'transparent',
                                            border: 'none',
                                            borderBottom: `1px solid ${errors.email ? '#ef4444' : (focusedField === 'email' ? 'var(--accent)' : 'rgba(255,255,255,0.15)')}`,
                                            padding: '0.5rem 0 1rem',
                                            color: 'var(--text-primary)',
                                            fontSize: '1.1rem',
                                            outline: 'none',
                                            transition: 'border-color 0.3s ease',
                                            boxShadow: focusedField === 'email' ? '0 1px 0 var(--accent)' : 'none',
                                        }}
                                    />
                                    {errors.email && <span style={{ color: '#ef4444', fontSize: '0.8rem', position: 'absolute', bottom: '-1.5rem', left: 0 }}>{errors.email}</span>}
                                </div>

                                {/* Inquiry Field - Now flexible height */}
                                <div className="form-field-wrapper" style={{ position: 'relative', marginTop: '1rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                    <label style={{
                                        position: 'absolute',
                                        top: (focusedField === 'inquiry' || formData.inquiry) ? '-1.5rem' : '0.5rem',
                                        left: 0,
                                        fontSize: (focusedField === 'inquiry' || formData.inquiry) ? '0.75rem' : '1.1rem',
                                        color: (focusedField === 'inquiry' || formData.inquiry) ? 'var(--accent)' : 'rgba(250,250,250,0.4)',
                                        textTransform: (focusedField === 'inquiry' || formData.inquiry) ? 'uppercase' : 'none',
                                        letterSpacing: (focusedField === 'inquiry' || formData.inquiry) ? '0.1em' : 'normal',
                                        pointerEvents: 'none',
                                        transition: 'all 0.3s ease',
                                        fontFamily: (focusedField === 'inquiry' || formData.inquiry) ? 'var(--font-body)' : 'var(--font-heading)',
                                    }}>Project Details / Inquiry</label>
                                    <textarea
                                        name="inquiry"
                                        value={formData.inquiry}
                                        onChange={handleChange}
                                        onFocus={() => setFocusedField('inquiry')}
                                        onBlur={() => setFocusedField(null)}
                                        className="interactive-element"
                                        rows={4}
                                        style={{
                                            width: '100%',
                                            flex: 1,
                                            minHeight: '120px',
                                            background: 'transparent',
                                            border: 'none',
                                            borderBottom: `1px solid ${errors.inquiry ? '#ef4444' : (focusedField === 'inquiry' ? 'var(--accent)' : 'rgba(255,255,255,0.15)')}`,
                                            padding: '0.5rem 0 1rem',
                                            color: 'var(--text-primary)',
                                            fontSize: '1.1rem',
                                            fontFamily: 'var(--font-body)',
                                            outline: 'none',
                                            resize: 'none',
                                            transition: 'border-color 0.3s ease',
                                            boxShadow: focusedField === 'inquiry' ? '0 1px 0 var(--accent)' : 'none',
                                        }}
                                    />
                                    {errors.inquiry && <span style={{ color: '#ef4444', fontSize: '0.8rem', position: 'absolute', bottom: '-1.5rem', left: 0 }}>{errors.inquiry}</span>}
                                </div>

                                {/* Submit Button Row */}
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    marginTop: 'auto',
                                    paddingTop: '2rem'
                                }}>
                                    {submitStatus ? (
                                        <div style={{ color: '#4ade80', fontSize: '0.9rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                            {submitStatus}
                                        </div>
                                    ) : (
                                        <div /> /* Empty div to push button to right if no status */
                                    )}

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="interactive-element"
                                        style={{
                                            background: isSubmitting ? 'rgba(190, 169, 142, 0.1)' : 'rgba(190, 169, 142, 0.08)',
                                            border: '1px solid rgba(190, 169, 142, 0.3)',
                                            color: '#bea98e',
                                            padding: '1rem 2.5rem',
                                            borderRadius: '100px',
                                            fontSize: '0.85rem',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.15em',
                                            fontWeight: 600,
                                            transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.75rem',
                                            marginLeft: 'auto'
                                        }}
                                        onMouseOver={(e) => {
                                            if (!isSubmitting) {
                                                e.currentTarget.style.background = 'var(--accent)';
                                                e.currentTarget.style.color = '#0c0c0c';
                                                e.currentTarget.style.boxShadow = '0 0 20px rgba(190, 169, 142, 0.4)';
                                                e.currentTarget.querySelector('svg').style.transform = 'translateX(4px)';
                                            }
                                        }}
                                        onMouseOut={(e) => {
                                            if (!isSubmitting) {
                                                e.currentTarget.style.background = 'rgba(190, 169, 142, 0.08)';
                                                e.currentTarget.style.color = '#bea98e';
                                                e.currentTarget.style.boxShadow = 'none';
                                                e.currentTarget.querySelector('svg').style.transform = 'translateX(0)';
                                            }
                                        }}
                                    >
                                        {isSubmitting ? 'Transmitting' : 'Send Message'}
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'transform 0.3s ease' }}>
                                            <line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                                        </svg>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Native Premium Footer ── */}
            <footer style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                borderTop: '1px solid rgba(255,255,255,0.04)',
                backgroundColor: 'rgba(5, 5, 8, 0.95)', // Solid dark premium background instead of glass
                zIndex: 20
            }}>
                <div className="global-container" style={{
                    display: 'flex',
                    flexDirection: isMobileView ? 'column' : 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: isMobileView ? '1.5rem' : '0',
                    paddingTop: '2rem',
                    paddingBottom: '2rem',
                }}>
                    {/* Brand / Copyright */}
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.4rem',
                        alignItems: isMobileView ? 'center' : 'flex-start',
                        textAlign: isMobileView ? 'center' : 'left'
                    }}>
                        <span style={{
                            fontSize: '1rem',
                            fontFamily: 'var(--font-heading)',
                            fontWeight: 400,
                            letterSpacing: '0.04em',
                            color: '#FAFAFA'
                        }}>
                            ABDUR RAHIM
                        </span>
                        <span style={{
                            fontSize: '0.65rem',
                            color: 'rgba(250,250,250,0.3)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.12em',
                            fontWeight: 500
                        }}>
                            &copy; {new Date().getFullYear()} All rights reserved.
                        </span>
                    </div>

                    {/* Social Icons instead of text links */}
                    <div style={{
                        display: 'flex',
                        gap: '1.2rem',
                        alignItems: 'center'
                    }}>
                        {/* LinkedIn */}
                        <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="interactive-element" style={{ color: 'rgba(250,250,250,0.5)', transition: 'color 0.3s ease, transform 0.3s ease' }} onMouseOver={e => { e.currentTarget.style.color = '#bea98e'; e.currentTarget.style.transform = 'translateY(-2px)'; }} onMouseOut={e => { e.currentTarget.style.color = 'rgba(250,250,250,0.5)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                        </a>
                        {/* GitHub */}
                        <a href="https://github.com" target="_blank" rel="noreferrer" className="interactive-element" style={{ color: 'rgba(250,250,250,0.5)', transition: 'color 0.3s ease, transform 0.3s ease' }} onMouseOver={e => { e.currentTarget.style.color = '#bea98e'; e.currentTarget.style.transform = 'translateY(-2px)'; }} onMouseOut={e => { e.currentTarget.style.color = 'rgba(250,250,250,0.5)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                        </a>
                        {/* Twitter / X */}
                        <a href="https://twitter.com" target="_blank" rel="noreferrer" className="interactive-element" style={{ color: 'rgba(250,250,250,0.5)', transition: 'color 0.3s ease, transform 0.3s ease' }} onMouseOver={e => { e.currentTarget.style.color = '#bea98e'; e.currentTarget.style.transform = 'translateY(-2px)'; }} onMouseOut={e => { e.currentTarget.style.color = 'rgba(250,250,250,0.5)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
                        </a>
                    </div>

                    {/* Back to top */}
                    <div style={{ alignSelf: 'center' }}>
                        <a href="#home" className="interactive-element" style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.6rem',
                            color: '#bea98e',
                            textDecoration: 'none',
                            fontSize: '0.7rem',
                            fontWeight: 600,
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase',
                            padding: '0.6rem 1.2rem',
                            border: '1px solid rgba(190,169,142,0.25)',
                            borderRadius: '100px',
                            transition: 'all 0.3s ease'
                        }}
                            onMouseOver={e => {
                                e.currentTarget.style.background = 'rgba(190,169,142,0.1)';
                                e.currentTarget.style.borderColor = 'rgba(190,169,142,0.5)';
                                e.currentTarget.querySelector('svg').style.transform = 'translateY(-2px)';
                            }}
                            onMouseOut={e => {
                                e.currentTarget.style.background = 'transparent';
                                e.currentTarget.style.borderColor = 'rgba(190,169,142,0.25)';
                                e.currentTarget.querySelector('svg').style.transform = 'translateY(0)';
                            }}
                        >
                            Back to Top
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'transform 0.3s ease' }}>
                                <line x1="12" y1="19" x2="12" y2="5"></line>
                                <polyline points="5 12 12 5 19 12"></polyline>
                            </svg>
                        </a>
                    </div>
                </div>
            </footer>
        </section>
    );
};
