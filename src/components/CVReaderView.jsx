import React, { useRef, useEffect } from 'react';

/* ═══════════════════════════════════════════════════════════
   THEME TOKENS — dark & light palettes
   ═══════════════════════════════════════════════════════════ */
const themes = {
    dark: {
        bg: 'rgba(10,10,14,0.95)',
        name: '#FFFFFF',
        heading: '#F2EEE8',
        accent: '#bea98e',
        accentStrong: '#D4AF80',
        body: 'rgba(250,250,250,0.6)',
        bodyStrong: 'rgba(250,250,250,0.8)',
        muted: 'rgba(250,250,250,0.35)',
        contactText: 'rgba(250,250,250,0.5)',
        border: 'rgba(190,169,142,0.15)',
        borderMed: 'rgba(190,169,142,0.2)',
        tagBg: 'rgba(190,169,142,0.06)',
        tagBorder: 'rgba(190,169,142,0.15)',
        tagText: 'rgba(250,250,250,0.7)',
        badgeBg: 'rgba(190,169,142,0.1)',
        refBg: 'rgba(190,169,142,0.04)',
        refBorder: 'rgba(190,169,142,0.12)',
        refAccent: 'rgba(190,169,142,0.4)',
        dotShadow: '0 0 0 3px rgba(190,169,142,0.15), 0 0 12px rgba(190,169,142,0.2)',
        bulletDot: 'rgba(190,169,142,0.4)',
        divider: 'linear-gradient(90deg, transparent, rgba(190,169,142,0.3), transparent)',
        iconBg: 'rgba(190,169,142,0.1)',
        scrollThumb: 'rgba(190,169,142,0.25)',
    },
    light: {
        bg: '#FFFFFF',
        name: '#1a1828',
        heading: '#1a1828',
        accent: '#8a6d30',
        accentStrong: '#8a6d30',
        body: '#3d3555',
        bodyStrong: '#1a1828',
        muted: '#5c5470',
        contactText: '#5c5470',
        border: '#d4c8a8',
        borderMed: '#c9b88a',
        tagBg: '#f7f2e8',
        tagBorder: '#d4c8a8',
        tagText: '#3d3555',
        badgeBg: '#e8dfc8',
        refBg: '#f5f0e5',
        refBorder: '#d4c8a8',
        refAccent: '#c9b88a',
        dotShadow: '0 0 0 3px rgba(138,109,48,0.12)',
        bulletDot: 'rgba(138,109,48,0.35)',
        divider: 'linear-gradient(90deg, transparent, #c9b88a, transparent)',
        iconBg: '#e2d9c5',
        scrollThumb: 'rgba(138,109,48,0.25)',
    },
};

/* ── Reusable section heading ── */
const SectionHead = ({ icon, title, t }) => (
    <div style={{
        display: 'flex', alignItems: 'center', gap: '0.75rem',
        marginBottom: '1.5rem', paddingBottom: '0.75rem',
        borderBottom: `1px solid ${t.border}`,
    }}>
        <span style={{
            width: 28, height: 28, borderRadius: '50%',
            background: t.iconBg, border: `1px solid ${t.borderMed}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.7rem', color: t.accent, flexShrink: 0,
        }}>{icon}</span>
        <span style={{
            fontFamily: 'var(--font-body, Inter, sans-serif)',
            fontSize: '0.68rem', fontWeight: 700,
            letterSpacing: '0.2em', textTransform: 'uppercase',
            color: t.accent,
        }}>{title}</span>
    </div>
);

/* ── Skill tag ── */
const SkillTag = ({ label, t }) => (
    <span style={{
        display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
        background: t.tagBg, border: `1px solid ${t.tagBorder}`,
        borderRadius: '6px', padding: '0.4rem 0.75rem',
        fontSize: '0.78rem', fontWeight: 500, color: t.tagText,
        fontFamily: 'var(--font-body, Inter, sans-serif)',
    }}>
        <span style={{
            width: 3, height: 12, borderRadius: 2,
            background: t.accent, flexShrink: 0,
        }} />
        {label}
    </span>
);

/* ── Job card ── */
const JobCard = ({ role, company, period, project, bullets, t }) => (
    <div style={{ marginBottom: '2rem', position: 'relative' }}>
        <div style={{
            position: 'absolute', left: -6, top: 6,
            width: 10, height: 10, borderRadius: '50%',
            background: t.accent, boxShadow: t.dotShadow,
        }} />
        <div style={{
            borderLeft: `1px solid ${t.border}`,
            paddingLeft: '1.5rem', marginLeft: 0,
        }}>
            <h3 style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: '1.05rem', fontWeight: 700,
                color: t.heading, margin: 0, lineHeight: 1.3,
            }}>{role}</h3>
            <div style={{
                display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap',
                gap: '0.25rem', marginTop: '0.35rem', marginBottom: '0.5rem',
                fontSize: '0.75rem', fontWeight: 600, color: t.accent,
                letterSpacing: '0.04em',
                fontFamily: 'var(--font-body, Inter, sans-serif)',
            }}>
                <span>{company}</span>
                <span>{period}</span>
            </div>
            {project && (
                <span style={{
                    display: 'inline-block', background: t.badgeBg,
                    color: t.accentStrong, fontSize: '0.7rem',
                    padding: '0.2rem 0.7rem', borderRadius: '100px',
                    fontWeight: 700, letterSpacing: '0.04em', marginBottom: '0.6rem',
                    fontFamily: 'var(--font-body, Inter, sans-serif)',
                }}>{project}</span>
            )}
            <ul style={{ margin: 0, paddingLeft: '1.1rem', listStyleType: 'none' }}>
                {bullets.map((b, i) => (
                    <li key={i} style={{
                        fontSize: '0.85rem', color: t.body,
                        marginBottom: '0.35rem', lineHeight: 1.6,
                        position: 'relative', paddingLeft: '0.75rem',
                        fontFamily: 'var(--font-body, Inter, sans-serif)',
                    }}>
                        <span style={{
                            position: 'absolute', left: -8, top: '0.55em',
                            width: 4, height: 4, borderRadius: '50%',
                            background: t.bulletDot,
                        }} />
                        {b}
                    </li>
                ))}
            </ul>
        </div>
    </div>
);

/* ── Education block ── */
const EduBlock = ({ degree, school, year, t }) => (
    <div style={{ marginBottom: '1rem' }}>
        <strong style={{
            display: 'block', color: t.heading,
            fontSize: '0.88rem', fontWeight: 600,
            fontFamily: "'Outfit', sans-serif",
        }}>{degree}</strong>
        <span style={{
            fontSize: '0.8rem', color: t.body,
            fontFamily: 'var(--font-body, Inter, sans-serif)',
        }}>{school}</span>
        <span style={{
            display: 'block', fontSize: '0.72rem',
            color: t.muted, marginTop: '0.15rem',
            fontFamily: 'var(--font-body, Inter, sans-serif)',
        }}>{year}</span>
    </div>
);

/* ═══════════════════════════════════════════════════════════
   MAIN READER VIEW — accepts isDark prop
   ═══════════════════════════════════════════════════════════ */
export const CVReaderView = ({ isDark = true }) => {
    const t = isDark ? themes.dark : themes.light;
    const scrollRef = useRef(null);

    const skills = [
        'IT Project Management', 'Business Analysis (BA)',
        'Requirement Gathering', 'ITSM & Operations',
        'Team Leadership', 'Jira / Confluence', 'MS Excel (Advanced)',
    ];

    /* helper: strong text color for bullet labels */
    const bs = t.bodyStrong;

    return (
        <div
            ref={scrollRef}
            data-lenis-prevent="true"
            style={{
                flex: 1, overflowY: 'auto', overflowX: 'hidden',
                background: t.bg,
                scrollbarWidth: 'thin',
                scrollbarColor: `${t.scrollThumb} transparent`,
                transition: 'background 0.4s ease',
                margin: 0,
                padding: '10px 0',
                border: 'none',
            }}
        >
            <div style={{
                maxWidth: '720px', margin: '0 auto',
                padding: '3rem 2rem 4rem',
            }}>
                {/* ── Header ── */}
                <header style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
                    <h1 style={{
                        fontFamily: "'Outfit', sans-serif",
                        fontSize: 'clamp(1.6rem, 4vw, 2.2rem)',
                        fontWeight: 700, color: t.name,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        margin: 0, lineHeight: 1.1,
                        transition: 'color 0.4s ease',
                    }}>Md. Abdur Rahim</h1>
                    <div style={{
                        fontSize: '0.7rem', color: t.accent,
                        fontWeight: 600, marginTop: '0.6rem',
                        textTransform: 'uppercase', letterSpacing: '0.22em',
                        fontFamily: 'var(--font-body, Inter, sans-serif)',
                        transition: 'color 0.4s ease',
                    }}>Project Coordinator | Support Manager</div>

                    <div style={{
                        display: 'flex', flexWrap: 'wrap',
                        justifyContent: 'center', gap: '0.6rem 1.2rem',
                        marginTop: '1.2rem', fontSize: '0.78rem',
                        color: t.contactText,
                        fontFamily: 'var(--font-body, Inter, sans-serif)',
                        transition: 'color 0.4s ease',
                    }}>
                        {[
                            { icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>, text: 'mdrahim.cse@gmail.com', href: 'mailto:mdrahim.cse@gmail.com' },
                            { icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>, text: '+880 1722-108281', href: 'tel:+8801722108281' },
                            { icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>, text: 'mdrahim.com', href: 'https://mdrahim.com' },
                            { icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.16-3.66c-1.12 0-1.8.61-2.11 1.16v-1h-2.33v8.8h2.33v-4.93c0-.26.02-.51.1-.7.22-.53.71-1.07 1.54-1.07 1.09 0 1.52.83 1.52 2.05v4.65h2.33M7.32 8.42a1.35 1.35 0 1 0 0-2.7 1.35 1.35 0 0 0 0 2.7m-1.17 10.08h2.33V9.7H6.15v8.8z"/></svg>, text: 'linkedin.com/in/abrahim007', href: 'https://www.linkedin.com/in/abrahim007' },
                        ].map((c, i) => (
                            <a key={i} href={c.href} target="_blank" rel="noopener noreferrer"
                                style={{
                                    color: 'inherit', textDecoration: 'none',
                                    display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                                    transition: 'color 0.2s',
                                }}
                                onMouseOver={e => e.currentTarget.style.color = t.accent}
                                onMouseOut={e => e.currentTarget.style.color = 'inherit'}
                            >
                                <span style={{ fontSize: '0.7rem', opacity: 0.7 }}>{c.icon}</span>
                                {c.text}
                            </a>
                        ))}
                    </div>

                    <div style={{
                        height: 1, marginTop: '1.5rem', background: t.divider,
                    }} />
                </header>

                {/* ── Summary ── */}
                <section style={{ marginBottom: '2.5rem' }}>
                    <SectionHead icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>} title="Profile Summary" t={t} />
                    <p style={{
                        fontSize: '0.88rem', color: t.body,
                        lineHeight: 1.8, margin: 0,
                        fontFamily: 'var(--font-body, Inter, sans-serif)',
                        transition: 'color 0.4s ease',
                    }}>
                        IT professional with over 4 years of experience leading cross-functional teams.
                        Currently managing the national <strong style={{ color: t.accentStrong }}>myGov ITSM Project</strong>,
                        focusing on system implementation, mitigating risks, and enforcing SLAs.
                        Looking to bring this technical leadership to a role focused on complete project
                        ownership, guiding teams to deliver on core business objectives.
                    </p>
                </section>

                {/* ── Experience ── */}
                <section style={{ marginBottom: '2.5rem' }}>
                    <SectionHead icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20 6h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zM10 4h4v2h-4V4zm10 16H4V8h16v12z"/></svg>} title="Professional Experience" t={t} />
                    <JobCard t={t}
                        role="Project Coordinator & Support Manager"
                        company="UY Systems Ltd." period="Dec 2023 – Present"
                        project="Project: myGov ITSM Project (a2i)"
                        bullets={[
                            <><strong style={{ color: bs }}>Team Leadership:</strong> Led the Support, Implementation, Call Center QA teams for the national myGov ITSM project. Managed daily schedules and team resources.</>,
                            <><strong style={{ color: bs }}>System Implementation:</strong> Managed practical implementation of myGov system for government offices/agencies — handling configurations, user onboarding, and live technical support.</>,
                            <><strong style={{ color: bs }}>Stakeholder Reporting:</strong> Built and maintained clear reporting systems for executives and government stakeholders.</>,
                            <><strong style={{ color: bs }}>SLA & Operations:</strong> Handled daily operational tasks and solved problems early to ensure support and call center teams strictly met all client Service Level Agreements.</>,
                        ]}
                    />
                    <JobCard t={t}
                        role="Sr. Executive (Implementation & Support)"
                        company="Business Automation Ltd." period="Mar 2021 – Nov 2023"
                        project="Project: National Portal Framework (a2i)"
                        bullets={[
                            <><strong style={{ color: bs }}>Team Operations:</strong> Guided daily support tasks and mentored team members to keep portal operations running smoothly.</>,
                            <><strong style={{ color: bs }}>Quality Assurance:</strong> Handled manual testing for government website features to ensure exact requirements were met.</>,
                            <><strong style={{ color: bs }}>Client Support:</strong> Managed incoming technical issues and user requests, focusing on fixing root causes.</>,
                            <><strong style={{ color: bs }}>Training & Documentation:</strong> Wrote clear user guides and led practical training sessions for the National Portal Framework.</>,
                        ]}
                    />
                    <JobCard t={t}
                        role="Data Entry Operator"
                        company="Chhinnamukul Bangladesh" period="Jul 2018 – Nov 2019"
                        project="Project: Basic Literacy Project (MOPME)"
                        bullets={[
                            'Accurately entered and updated data into designated systems with high precision.',
                            'Performed quality checks on data to identify and correct errors.',
                        ]}
                    />
                </section>

                {/* ── Skills ── */}
                <section style={{ marginBottom: '2.5rem' }}>
                    <SectionHead icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.06-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.73,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.06,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.43-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.49-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/></svg>} title="Skills & Expertise" t={t} />
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {skills.map((s, i) => <SkillTag key={i} label={s} t={t} />)}
                    </div>
                </section>

                {/* ── Education ── */}
                <section style={{ marginBottom: '2.5rem' }}>
                    <SectionHead icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 14.72l5-2.45v3.72z"/></svg>} title="Education" t={t} />
                    <EduBlock t={t} degree="B.Sc. in CSE" school="Asian University of Bangladesh" year="2023" />
                    <EduBlock t={t} degree="Diploma in Engineering" school="Kurigram Polytechnic Institute" year="2020" />
                    <EduBlock t={t} degree="Secondary School Certificate" school="Kurigram Govt. High School" year="2016" />
                </section>

                {/* ── Reference ── */}
                <section>
                    <SectionHead icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/></svg>} title="Reference" t={t} />
                    <div style={{
                        background: t.refBg,
                        border: `1px solid ${t.refBorder}`,
                        borderLeft: `3px solid ${t.refAccent}`,
                        borderRadius: '8px', padding: '1rem 1.25rem',
                        fontSize: '0.85rem', lineHeight: 1.6, color: t.body,
                        fontFamily: 'var(--font-body, Inter, sans-serif)',
                        transition: 'all 0.4s ease',
                    }}>
                        <strong style={{ color: t.heading }}>{`Md. Moniruzzaman, PMP`}</strong><br />
                        Project Director & CTO, UY Systems Ltd.<br />
                        <a href="mailto:zaman@uysys.com"
                            style={{ color: t.accentStrong, textDecoration: 'none' }}>zaman@uysys.com</a>
                        {' | +880 1712-027826'}
                    </div>
                </section>
            </div>
        </div>
    );
};
