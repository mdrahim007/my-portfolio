import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * useScrollReveal — attaches GSAP scroll-triggered reveal animations to
 * a container ref. Targets elements by className:
 *
 *   .animate-eyebrow   — slides up subtly, fades in (for eyebrow labels)
 *   .animate-heading   — slides up from below with power4 ease   (for h1/h2)
 *   .animate-rule      — expands from left (for <hr> section dividers)
 *   .animate-stagger   — staggered fade + Y reveal (for cards, paragraphs)
 *
 * Usage:
 *   const sectionRef = useRef(null);
 *   useScrollReveal(sectionRef);
 */
export const useScrollReveal = (containerRef, deps = []) => {
    useEffect(() => {
        if (!containerRef?.current) return;

        const ctx = gsap.context(() => {
            // ── Eyebrow labels ──────────────────────────────────────────────────────
            const eyebrows = containerRef.current.querySelectorAll('.animate-eyebrow');
            eyebrows.forEach((el) => {
                gsap.fromTo(
                    el,
                    { y: 18, opacity: 0 },
                    {
                        y: 0,
                        opacity: 0.85,
                        duration: 0.7,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: el,
                            start: 'top 90%',
                            toggleActions: 'play none none none',
                        },
                    }
                );
            });

            // ── Section headings ────────────────────────────────────────────────────
            const headings = containerRef.current.querySelectorAll('.animate-heading');
            headings.forEach((el) => {
                gsap.fromTo(
                    el,
                    { y: 60, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 1.1,
                        ease: 'power4.out',
                        scrollTrigger: {
                            trigger: el,
                            start: 'top 88%',
                            toggleActions: 'play none none none',
                        },
                    }
                );
            });

            // ── Section divider rules ───────────────────────────────────────────────
            const rules = containerRef.current.querySelectorAll('.animate-rule');
            rules.forEach((el) => {
                gsap.fromTo(
                    el,
                    { scaleX: 0, transformOrigin: 'left center', opacity: 0 },
                    {
                        scaleX: 1,
                        opacity: 1,
                        duration: 1.2,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: el,
                            start: 'top 92%',
                            toggleActions: 'play none none none',
                        },
                    }
                );
            });

            // ── Staggered content blocks ────────────────────────────────────────────
            const staggerGroups = containerRef.current.querySelectorAll('.animate-stagger-group');
            staggerGroups.forEach((group) => {
                const items = group.children;
                gsap.fromTo(
                    items,
                    { y: 50, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 0.9,
                        stagger: 0.12,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: group,
                            start: 'top 85%',
                            toggleActions: 'play none none none',
                        },
                    }
                );
            });

            // ── Individual stagger items (outside a group) ──────────────────────────
            const staggerItems = containerRef.current.querySelectorAll('.animate-stagger');
            if (staggerItems.length > 0) {
                gsap.fromTo(
                    staggerItems,
                    { y: 40, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 0.85,
                        stagger: 0.1,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: staggerItems[0],
                            start: 'top 85%',
                            toggleActions: 'play none none none',
                        },
                    }
                );
            }
        }, containerRef);

        return () => ctx.revert();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);
};
