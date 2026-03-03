import { useEffect } from 'react';

/**
 * TiltEffect — globally attaches mouse-tracking 3D tilt + specular shine
 * to every .glass-card element on the page. Mount once in App.jsx.
 */
export const TiltEffect = () => {
    useEffect(() => {
        const MAX_TILT = 6;          // degrees
        const SHINE_OPACITY = 0.07;  // max shine brightness (subtle)

        let tracked = new Map(); // element → { shine, handler }

        const applyTilt = (card) => {
            // Inject a shine overlay span into each card
            const shine = document.createElement('span');
            shine.style.cssText = `
                position: absolute;
                inset: 0;
                border-radius: inherit;
                pointer-events: none;
                background: radial-gradient(circle at 50% 50%, rgba(255,255,255,0.12), transparent 65%);
                opacity: 0;
                transition: opacity 0.3s ease;
                z-index: 1;
            `;
            // Ensure card has position:relative (glass-card already has it via CSS)
            card.style.position = 'relative';
            card.appendChild(shine);

            const onMove = (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const cx = rect.width / 2;
                const cy = rect.height / 2;

                const rotY = ((x - cx) / cx) * MAX_TILT;
                const rotX = -((y - cy) / cy) * MAX_TILT;

                // Position the specular highlight at the cursor
                const pctX = (x / rect.width) * 100;
                const pctY = (y / rect.height) * 100;

                card.style.transform = `
                    perspective(800px)
                    rotateX(${rotX}deg)
                    rotateY(${rotY}deg)
                    scale3d(1.015, 1.015, 1.015)
                `;
                card.style.transition = 'transform 0.1s ease-out, box-shadow 0.3s ease';
                card.style.zIndex = '2';

                shine.style.background = `radial-gradient(circle at ${pctX}% ${pctY}%, rgba(255,255,255,${SHINE_OPACITY * 2}), transparent 60%)`;
                shine.style.opacity = '1';
            };

            const onLeave = () => {
                card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
                card.style.transition = 'transform 0.5s ease, box-shadow 0.5s ease';
                card.style.zIndex = '';
                shine.style.opacity = '0';
            };

            card.addEventListener('mousemove', onMove);
            card.addEventListener('mouseleave', onLeave);
            tracked.set(card, { shine, onMove, onLeave });
        };

        const cleanupCard = (card) => {
            const data = tracked.get(card);
            if (!data) return;
            card.removeEventListener('mousemove', data.onMove);
            card.removeEventListener('mouseleave', data.onLeave);
            if (data.shine.parentNode === card) card.removeChild(data.shine);
            tracked.delete(card);
        };

        // Attach to all current glass-cards
        const attach = () => {
            document.querySelectorAll('.glass-card').forEach((card) => {
                if (!tracked.has(card)) applyTilt(card);
            });
        };

        attach();

        // Re-scan on DOM changes (e.g. carousel re-renders)
        const observer = new MutationObserver(attach);
        observer.observe(document.body, { childList: true, subtree: true });

        return () => {
            observer.disconnect();
            tracked.forEach((_, card) => cleanupCard(card));
        };
    }, []);

    return null;
};
