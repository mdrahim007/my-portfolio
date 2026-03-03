import { useEffect, useState } from 'react';

export const IntroScreen = ({ onComplete }) => {
    const [phase, setPhase] = useState('enter'); // 'enter' | 'hold' | 'exit'

    useEffect(() => {
        // enter → hold → exit
        const t1 = setTimeout(() => setPhase('hold'), 800);
        const t2 = setTimeout(() => setPhase('exit'), 2000);
        const t3 = setTimeout(() => onComplete?.(), 2700);
        return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    }, []);

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            background: '#080810',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            opacity: phase === 'exit' ? 0 : 1,
            transition: 'opacity 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
            pointerEvents: phase === 'exit' ? 'none' : 'all',
        }}>

            {/* Monogram */}
            <div style={{
                position: 'relative',
                opacity: phase === 'enter' ? 0 : 1,
                transform: phase === 'enter' ? 'scale(0.85)' : 'scale(1)',
                transition: 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}>
                {/* Outer glow ring */}
                <div style={{
                    position: 'absolute',
                    inset: '-20px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(190,169,142,0.12) 0%, transparent 70%)',
                    opacity: phase === 'hold' ? 1 : 0,
                    transition: 'opacity 0.8s ease',
                }} />

                {/* Main monogram circle */}
                <div style={{
                    width: '90px',
                    height: '90px',
                    borderRadius: '50%',
                    border: '1px solid rgba(190,169,142,0.35)',
                    background: 'rgba(190,169,142,0.06)',
                    backdropFilter: 'blur(12px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                }}>
                    <span style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: '2rem',
                        fontWeight: 700,
                        letterSpacing: '-0.02em',
                        background: 'linear-gradient(135deg, #FAFAFA 0%, #D4AF80 50%, #FAFAFA 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                    }}>AR</span>
                </div>
            </div>

            {/* Name line */}
            <div style={{
                opacity: phase === 'hold' ? 1 : 0,
                transform: phase === 'hold' ? 'translateY(0)' : 'translateY(8px)',
                transition: 'opacity 0.5s ease 0.2s, transform 0.5s ease 0.2s',
                textAlign: 'center',
            }}>
                <p style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.7rem',
                    letterSpacing: '0.25em',
                    textTransform: 'uppercase',
                    color: 'rgba(190,169,142,0.7)',
                    margin: 0,
                }}>Md. Abdur Rahim</p>
            </div>

            {/* Thin loading line */}
            <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                height: '2px',
                background: 'linear-gradient(90deg, transparent, #D4AF80, transparent)',
                width: phase === 'enter' ? '0%' : phase === 'hold' ? '100%' : '100%',
                transition: 'width 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
                opacity: phase === 'exit' ? 0 : 1,
            }} />
        </div>
    );
};
