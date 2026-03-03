import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useScrollReveal } from '../hooks/useScrollReveal';

gsap.registerPlugin(ScrollTrigger);

export const Contact = () => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);
    const sectionRef = useRef(null);
    const formRef = useRef(null);

    useScrollReveal(sectionRef);

    useEffect(() => {
        if (!formRef.current) return;
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) return;
        const fields = formRef.current.querySelectorAll('input, textarea, button[type="submit"]');
        gsap.fromTo(
            fields,
            { y: 35, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.75,
                stagger: 0.12,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: formRef.current,
                    start: 'top 82%',
                    toggleActions: 'play none none none',
                },
            }
        );
    }, []);

    const validate = () => {
        let tempErrors = {};
        if (!formData.name.trim()) tempErrors.name = "Name is required";
        if (!formData.email) {
            tempErrors.email = "Professional Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            tempErrors.email = "Email is invalid";
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
                setSubmitStatus("Message sent successfully!");
                setFormData({ name: '', email: '', inquiry: '' });
                // Clear success message after 3 seconds
                setTimeout(() => setSubmitStatus(null), 3000);
            }, 1500);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        // Clear error for the field being edited
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: '' });
        }
    };



    return (
        <section
            id="contact"
            ref={sectionRef}
            style={{
                padding: '6rem 5% 5rem',
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
                zIndex: 10,
            }}
        >
            <div style={{ maxWidth: '600px', width: '100%', textAlign: 'center' }}>
                <span className="eyebrow-pill animate-eyebrow">07 — Contact</span>
                <h2
                    className="animate-heading"
                    style={{
                        fontSize: 'clamp(2.2rem, 4.5vw, 3.8rem)',
                        marginBottom: '1rem',
                        color: 'var(--text-primary)',
                        letterSpacing: '-0.03em',
                        lineHeight: 1.1
                    }}
                >
                    Let's Build Together
                </h2>
                <p style={{ color: 'rgba(250,250,250,0.45)', marginBottom: '3.5rem', fontSize: '1rem', lineHeight: 1.7 }}>
                    Interested in collaborating on a monumental project? Reach out below.
                </p>

                <div className="glass-form" style={{ marginTop: '0', width: '100%' }}>
                    <form ref={formRef} onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem', textAlign: 'left' }}>

                        {/* Name Field */}
                        <div style={{ position: 'relative' }}>
                            <input
                                type="text"
                                name="name"
                                placeholder="Your Name"
                                value={formData.name}
                                onChange={handleChange}
                                className="interactive-element"
                                style={{
                                    width: '100%',
                                    background: 'transparent',
                                    border: 'none',
                                    borderBottom: `1px solid ${errors.name ? '#ef4444' : 'rgba(255,255,255,0.2)'}`,
                                    padding: '1rem 0',
                                    color: 'var(--text-primary)',
                                    fontSize: '1.2rem',
                                    fontFamily: 'var(--font-body)',
                                    outline: 'none',
                                    transition: 'border-color 0.3s ease'
                                }}
                            />
                            {errors.name && <span style={{ color: '#ef4444', fontSize: '0.8rem', position: 'absolute', bottom: '-1.5rem', left: 0 }}>{errors.name}</span>}
                        </div>

                        {/* Email Field */}
                        <div style={{ position: 'relative' }}>
                            <input
                                type="email"
                                name="email"
                                placeholder="Professional Email"
                                value={formData.email}
                                onChange={handleChange}
                                className="interactive-element"
                                style={{
                                    width: '100%',
                                    background: 'transparent',
                                    border: 'none',
                                    borderBottom: `1px solid ${errors.email ? '#ef4444' : 'rgba(255,255,255,0.2)'}`,
                                    padding: '1rem 0',
                                    color: 'var(--text-primary)',
                                    fontSize: '1.2rem',
                                    fontFamily: 'var(--font-body)',
                                    outline: 'none',
                                    transition: 'border-color 0.3s ease'
                                }}
                            />
                            {errors.email && <span style={{ color: '#ef4444', fontSize: '0.8rem', position: 'absolute', bottom: '-1.5rem', left: 0 }}>{errors.email}</span>}
                        </div>

                        {/* Inquiry Field */}
                        <div style={{ position: 'relative' }}>
                            <textarea
                                name="inquiry"
                                placeholder="Inquiry"
                                value={formData.inquiry}
                                onChange={handleChange}
                                className="interactive-element"
                                rows={4}
                                style={{
                                    width: '100%',
                                    background: 'transparent',
                                    border: 'none',
                                    borderBottom: `1px solid ${errors.inquiry ? '#ef4444' : 'rgba(255,255,255,0.2)'}`,
                                    padding: '1rem 0',
                                    color: 'var(--text-primary)',
                                    fontSize: '1.2rem',
                                    fontFamily: 'var(--font-body)',
                                    outline: 'none',
                                    resize: 'none',
                                    transition: 'border-color 0.3s ease'
                                }}
                            />
                            {errors.inquiry && <span style={{ color: '#ef4444', fontSize: '0.8rem', position: 'absolute', bottom: '-1.5rem', left: 0 }}>{errors.inquiry}</span>}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="interactive-element"
                            style={{
                                marginTop: '1.5rem',
                                background: 'transparent',
                                border: '1px solid #bea98e',
                                color: '#bea98e',
                                padding: '1.2rem 3rem',
                                fontSize: '1rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.15em',
                                fontWeight: 600,
                                cursor: 'none', // Overridden by custom cursor anyway, but good practice
                                transition: 'all 0.3s ease',
                                alignSelf: 'center',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.75rem',
                                opacity: isSubmitting ? 0.7 : 1
                            }}
                            onMouseOver={(e) => {
                                if (!isSubmitting) {
                                    e.currentTarget.style.background = '#bea98e';
                                    e.currentTarget.style.color = '#000';
                                }
                            }}
                            onMouseOut={(e) => {
                                if (!isSubmitting) {
                                    e.currentTarget.style.background = 'transparent';
                                    e.currentTarget.style.color = '#bea98e';
                                }
                            }}
                        >
                            {isSubmitting ? 'Transmitting...' : 'Send Message'}
                        </button>

                        {/* Success feedback */}
                        {submitStatus && (
                            <div style={{ textAlign: 'center', color: '#10b981', marginTop: '1rem', fontWeight: 600 }}>
                                {submitStatus}
                            </div>
                        )}
                    </form>
                </div>

                {/* Social Links Grid */}
                <div style={{ marginTop: '3.5rem' }}>
                    <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.08)', marginBottom: '2.5rem' }} />
                    <p style={{ color: 'rgba(250,250,250,0.35)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '1.75rem' }}>Connect With Me</p>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: 'clamp(2rem, 5vw, 4rem)',
                        flexWrap: 'wrap'
                    }}>
                        <a href="https://www.linkedin.com/in/abrahim007" target="_blank" rel="noopener noreferrer" className="interactive-element" style={{ color: 'var(--text-primary)', textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', transition: 'color 0.3s ease' }} onMouseOver={(e) => e.currentTarget.style.color = '#bea98e'} onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-primary)'}>
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                                <rect x="2" y="9" width="4" height="12"></rect>
                                <circle cx="4" cy="4" r="2"></circle>
                            </svg>
                            <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>LinkedIn</span>
                        </a>
                        <a href="mailto:mdrahim.cse@gmail.com" className="interactive-element" style={{ color: 'var(--text-primary)', textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', transition: 'color 0.3s ease' }} onMouseOver={(e) => e.currentTarget.style.color = '#bea98e'} onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-primary)'}>
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                <polyline points="22,6 12,13 2,6"></polyline>
                            </svg>
                            <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Email Me</span>
                        </a>

                        <a href="tel:+8801722108281" className="interactive-element" style={{ color: 'var(--text-primary)', textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', transition: 'color 0.3s ease' }} onMouseOver={(e) => e.currentTarget.style.color = '#bea98e'} onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-primary)'}>
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                            </svg>
                            <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Call Me</span>
                        </a>
                    </div>
                </div>

            </div>

            {/* Modern Minimalist Footer */}
            <footer style={{
                position: 'absolute',
                bottom: 0,
                width: '100%',
                padding: '2rem 5%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderTop: '1px solid rgba(255,255,255,0.05)',
                color: 'var(--text-secondary)',
                fontSize: '0.85rem'
            }}>
                <div>&copy; {new Date().getFullYear()} Md Abdur Rahim. All rights reserved.</div>
                <div style={{ display: 'flex', gap: '2rem' }}>
                    <a href="#work" className="interactive-element" style={{ color: 'inherit', textDecoration: 'none' }}>Work</a>
                    <a href="#about" className="interactive-element" style={{ color: 'inherit', textDecoration: 'none' }}>About</a>
                </div>
            </footer>
        </section>
    );
};
