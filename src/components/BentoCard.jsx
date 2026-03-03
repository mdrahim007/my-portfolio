import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const BentoCard = ({ data, index }) => {
    const cardRef = useRef(null);

    useEffect(() => {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (!prefersReducedMotion && cardRef.current) {
            gsap.fromTo(
                cardRef.current,
                {
                    opacity: 0,
                    y: 60, // Start slightly lower
                },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1.2,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: cardRef.current,
                        start: 'top 85%', // Trigger when top of card is 85% down viewport
                        // play once, don't reverse
                        toggleActions: 'play none none none',
                    },
                }
            );
        }
    }, []);

    return (
        <article
            ref={cardRef}
            className={`bento-card-container bento-size-${data.size}`}
        >
            <div className="bento-image-wrapper">
                <img
                    src={data.image}
                    alt={data.title}
                    className="bento-image"
                />
                {/* Subtle overlay gradient to ensure text readability if placed over image */}
                <div className="bento-overlay"></div>
            </div>

            <div className="bento-content">
                <span className="bento-category">{data.role}</span>
                <h3 className="bento-title">{data.title}</h3>
            </div>
        </article>
    );
};
