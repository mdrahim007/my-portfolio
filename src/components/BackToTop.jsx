import { useState } from 'react';

export const WhatsAppButton = () => {
    const [hovered, setHovered] = useState(false);

    // Replace with actual WhatsApp number + country code
    const WA_NUMBER = "8801722108281";
    const WA_LINK = `https://wa.me/${WA_NUMBER}`;

    return (
        <>
            <style dangerouslySetInnerHTML={{
                __html: `
                .wa-btn {
                    position: fixed;
                    bottom: 2.2rem;
                    right: 2.2rem;
                    z-index: 9999;
                    height: 56px;
                    border-radius: 100px;
                    display: flex;
                    align-items: center;
                    padding: 0 14px;
                    text-decoration: none;
                    transition: all 0.4s cubic-bezier(0.34, 1.2, 0.64, 1);
                    overflow: hidden;
                    white-space: nowrap;
                    box-sizing: border-box;
                    max-width: 56px; /* Collapsed width matches height */
                }
                .wa-btn:hover {
                    max-width: 200px; /* Expanded width on hover */
                    padding: 0 20px 0 14px;
                }
                .wa-btn .wa-icon {
                    width: 28px;
                    height: 28px;
                    transition: fill 0.4s ease;
                    flex-shrink: 0;
                }
                .wa-btn .wa-text {
                    font-family: var(--font-body);
                    font-weight: 600;
                    font-size: 0.9rem;
                    color: rgba(250, 250, 250, 0.95);
                    margin-left: 10px;
                    opacity: 0;
                    transform: translateX(10px);
                    transition: opacity 0.3s ease, transform 0.3s ease;
                }
                .wa-btn:hover .wa-text {
                    opacity: 1;
                    transform: translateX(0);
                    transition-delay: 0.1s;
                }
                
                /* Mobile sizing keeps it as a circle without hover expansion */
                @media (max-width: 900px) {
                    .wa-btn {
                        bottom: 1.5rem;
                        right: 1.5rem;
                        height: 50px;
                        width: 50px;
                        min-width: 50px;
                        max-width: 50px;
                        padding: 0;
                        justify-content: center;
                    }
                    .wa-btn:hover {
                        max-width: 50px; /* Disable expansion */
                        padding: 0;
                    }
                    .wa-btn .wa-icon {
                        width: 26px;
                        height: 26px;
                    }
                    .wa-btn .wa-text {
                        display: none; /* Hide text on mobile entirely */
                    }
                }
                @media (max-width: 480px) {
                    .wa-btn {
                        bottom: 1.25rem;
                        right: 1.25rem;
                        height: 46px;
                        width: 46px;
                        min-width: 46px;
                        max-width: 46px;
                        padding: 0;
                        justify-content: center;
                    }
                    .wa-btn:hover {
                        max-width: 46px; /* Disable expansion */
                        padding: 0;
                    }
                    .wa-btn .wa-icon {
                        width: 24px;
                        height: 24px;
                    }
                }
            `}} />
            <a
                href={WA_LINK}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                aria-label="Chat on WhatsApp"
                className="interactive-element wa-btn"
                style={{
                    // Glassmorphism WhatsApp green theme
                    background: hovered ? 'rgba(37, 211, 102, 0.2)' : 'rgba(15, 15, 20, 0.65)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    border: hovered ? '1px solid rgba(37, 211, 102, 0.5)' : '1px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: hovered
                        ? '0 0 24px rgba(37, 211, 102, 0.3), 0 8px 32px rgba(0,0,0,0.5)'
                        : '0 8px 32px rgba(0,0,0,0.4)',
                    transform: hovered ? 'scale(1.04)' : 'scale(1)',
                }}
            >
                <svg
                    className="wa-icon"
                    viewBox="0 0 24 24"
                    fill={hovered ? '#25D366' : 'rgba(250, 250, 250, 0.85)'}
                >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.81 11.81 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.88 11.88 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.82 11.82 0 0 0-3.48-8.413Z" />
                </svg>
                <span className="wa-text">Message me</span>
            </a>
        </>
    );
};
