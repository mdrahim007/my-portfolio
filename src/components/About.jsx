import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useScrollReveal } from '../hooks/useScrollReveal';

gsap.registerPlugin(ScrollTrigger);

export const About = () => {
    const sectionRef = useRef(null);
    const photoRef = useRef(null);
    const textContainerRef = useRef(null);

    // Shared scroll reveals for eyebrow, heading, stagger items
    useScrollReveal(sectionRef);

    useEffect(() => {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) return;

        const ctx = gsap.context(() => {
            // ── Photo parallax: floats upward slower than the page scroll ──────
            if (photoRef.current) {
                gsap.fromTo(
                    photoRef.current,
                    { y: 40 },
                    {
                        y: -60,
                        ease: 'none',
                        scrollTrigger: {
                            trigger: sectionRef.current,
                            start: 'top bottom',
                            end: 'bottom top',
                            scrub: 1.5,
                        },
                    }
                );
            }

            // ── Text paragraphs stagger (fine-grained beyond the hook's stagger) ──
            if (textContainerRef.current) {
                const paragraphs = textContainerRef.current.querySelectorAll('p');
                gsap.fromTo(
                    paragraphs,
                    { opacity: 0, y: 35 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.9,
                        stagger: 0.15,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: textContainerRef.current,
                            start: 'top 75%',
                            toggleActions: 'play none none none',
                        },
                    }
                );
            }
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            id="about"
            ref={sectionRef}
            className="section-padding"
            style={{
                minHeight: '100vh',
                position: 'relative',
                zIndex: 10,
            }}
        >
            <div className="responsive-grid-2" style={{ maxWidth: '1400px', margin: '0 auto' }}>
                {/* Left Side: Portrait with parallax */}
                <div style={{ position: 'relative' }}>
                    <div
                        style={{
                            width: '100%',
                            paddingTop: '115%',
                            position: 'relative',
                            borderRadius: '24px',
                            overflow: 'hidden',
                            backgroundColor: 'var(--bg-surface)'
                        }}
                    >
                        <img
                            ref={photoRef}
                            src="/my_photo2.jpg"
                            alt="Md Abdur Rahim — Professional Photo"
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                filter: 'none',
                                willChange: 'transform',
                            }}
                        />
                    </div>
                </div>

                {/* Right Side: Editorial Text */}
                <div ref={textContainerRef} style={{ paddingRight: '2rem' }}>
                    <span className="eyebrow-pill animate-eyebrow">06 — About</span>
                    <h2
                        className="animate-heading"
                        style={{
                            fontSize: 'clamp(2.2rem, 4.5vw, 3.5rem)',
                            marginBottom: '0.5rem',
                            color: 'var(--text-primary)',
                            letterSpacing: '-0.03em',
                            lineHeight: 1.1
                        }}
                    >
                        Bridging Systems <br />& Support
                    </h2>

                    <span
                        className="eyebrow animate-eyebrow"
                        style={{
                            marginBottom: '2rem',
                            color: 'var(--accent)',
                            fontWeight: 400,
                            letterSpacing: '0.15em'
                        }}
                    >
                        Professional Summary
                    </span>

                    <p style={{ fontSize: '1.05rem', color: 'rgba(250,250,250,0.65)', marginBottom: '1.25rem', lineHeight: 1.8, maxWidth: '55ch' }}>
                        With over 5 years of experience in the IT Support domain, I currently lead the Support and Implementation team for the myGov ITSM project. My focus is on architecting environments where rapid resolution and strict Service Level Agreements (SLAs) are consistently met.
                    </p>

                    <p style={{ fontSize: '1.05rem', color: 'rgba(250,250,250,0.65)', marginBottom: '1.25rem', lineHeight: 1.8, maxWidth: '55ch' }}>
                        Beyond day-to-day team leadership, I oversee the deployment of ITSM scalable solutions, analyze complex client requirements for system optimization, and execute extensive manual QA testing to verify government website functionality against national requirements.
                    </p>

                    <p style={{ fontSize: '1.05rem', color: 'rgba(250,250,250,0.65)', lineHeight: 1.8, maxWidth: '55ch' }}>
                        When I'm not managing multi-channel support or generating detailed performance reports, you can find me conducting capability-building training sessions on the National Portal Framework.
                    </p>
                </div>
            </div>


        </section>
    );
};
