import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PartnersCarousel from '../components/PartnersCarousel';

const About = () => {
    const { t, i18n } = useTranslation();
    const currentLang = i18n.language;
    const getPath = (path) => `/${currentLang}${path}`;

    const [visibleSections, setVisibleSections] = useState({});

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setVisibleSections((prev) => ({
                            ...prev,
                            [entry.target.id]: true,
                        }));
                    }
                });
            },
            { threshold: 0.1 }
        );

        document.querySelectorAll('[id^="section-"]').forEach((section) => {
            observer.observe(section);
        });

        return () => observer.disconnect();
    }, []);

    return (
        <div style={styles.page}>
            {/* Hero Section with Background */}
            <section style={styles.hero} className="about-hero about-hero-mobile">
                <div style={styles.heroOverlay}>
                    <div className="container">
                        <h1 style={styles.heroTitle}>{t('about_page.hero.title')}</h1>
                        <p style={styles.heroSubtitle}>{t('about_page.hero.subtitle')}</p>
                    </div>
                </div>
            </section>

            {/* Histoire Section */}
            <section style={styles.section}>
                <div className="container">
                    <div style={styles.contentGrid} className="about-content-grid">
                        <div style={styles.imageWrapper} className="about-image-wrapper">
                            <img src="/about-meeting-pro.png" alt="Histoire INVIK SA" style={styles.sectionImage} />
                        </div>
                        <div style={styles.contentWrapper}>
                            <h2 style={styles.sectionTitle}>{t('about_page.history.title')}</h2>
                            <p style={styles.text}>{t('about_page.history.p1')}</p>
                            <p style={styles.text}>{t('about_page.history.p2')}</p>
                            <p style={styles.text}>{t('about_page.history.p3')}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section style={{ ...styles.section, backgroundColor: '#f8f9fa' }}>
                <div className="container">
                    <h2 style={styles.centerTitle}>{t('about_page.services.title')}</h2>
                    <p style={styles.centerSubtitle}>{t('about_page.services.subtitle')}</p>
                    <div style={styles.servicesGrid} className="servicesGrid">
                        <div className="service-card-hover" style={styles.serviceCard}>
                            <div style={styles.serviceIcon}>💳</div>
                            <h3 style={styles.cardTitle}>{t('about_page.services.items.accounts.title')}</h3>
                            <p style={styles.cardText}>{t('about_page.services.items.accounts.text')}</p>
                        </div>
                        <div className="service-card-hover" style={styles.serviceCard}>
                            <div style={styles.serviceIcon}>🌍</div>
                            <h3 style={styles.cardTitle}>{t('about_page.services.items.transfers.title')}</h3>
                            <p style={styles.cardText}>{t('about_page.services.items.transfers.text')}</p>
                        </div>
                        <div className="service-card-hover" style={styles.serviceCard}>
                            <div style={styles.serviceIcon}>💼</div>
                            <h3 style={styles.cardTitle}>{t('about_page.services.items.business.title')}</h3>
                            <p style={styles.cardText}>{t('about_page.services.items.business.text')}</p>
                        </div>
                        <div className="service-card-hover" style={styles.serviceCard}>
                            <div style={styles.serviceIcon}>📈</div>
                            <h3 style={styles.cardTitle}>{t('about_page.services.items.invest.title')}</h3>
                            <p style={styles.cardText}>{t('about_page.services.items.invest.text')}</p>
                        </div>
                        <div className="service-card-hover" style={styles.serviceCard}>
                            <div style={styles.serviceIcon}>🏠</div>
                            <h3 style={styles.cardTitle}>{t('about_page.services.items.loans.title')}</h3>
                            <p style={styles.cardText}>{t('about_page.services.items.loans.text')}</p>
                        </div>
                        <div className="service-card-hover" style={styles.serviceCard}>
                            <div style={styles.serviceIcon}>🛡️</div>
                            <h3 style={styles.cardTitle}>{t('about_page.services.items.insurance.title')}</h3>
                            <p style={styles.cardText}>{t('about_page.services.items.insurance.text')}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Vision & Ambitions Section - 10 Year Roadmap */}
            <section id="section-vision" style={{
                ...styles.section,
                opacity: visibleSections['section-vision'] ? 1 : 0,
                transform: visibleSections['section-vision'] ? 'translateY(0)' : 'translateY(30px)',
                transition: 'all 0.8s ease-out',
            }}>
                <div className="container">
                    <h2 style={styles.centerTitle}>{t('about_page.vision.title')}</h2>
                    <p style={styles.centerSubtitle}>{t('about_page.vision.subtitle')}</p>

                    {/* Timeline 10 ans */}
                    <div style={styles.timelineContainer} className="timeline-grid">
                        {/* 2025-2027 */}
                        <div className="timeline-card-hover" style={{ ...styles.timelineCard, background: 'linear-gradient(135deg, #003366 0%, #004d99 100%)' }}>
                            <div style={styles.timelineYear}>{t('about_page.vision.phases.p1.year')}</div>
                            <h3 style={styles.timelineTitle}>{t('about_page.vision.phases.p1.title')}</h3>
                            <ul style={styles.timelineList}>
                                {t('about_page.vision.phases.p1.items', { returnObjects: true }).map((item, i) => <li key={i}>{item}</li>)}
                            </ul>
                        </div>

                        {/* 2028-2030 */}
                        <div className="timeline-card-hover" style={{ ...styles.timelineCard, background: 'linear-gradient(135deg, #004d99 0%, #0066cc 100%)' }}>
                            <div style={styles.timelineYear}>{t('about_page.vision.phases.p2.year')}</div>
                            <h3 style={styles.timelineTitle}>{t('about_page.vision.phases.p2.title')}</h3>
                            <ul style={styles.timelineList}>
                                {t('about_page.vision.phases.p2.items', { returnObjects: true }).map((item, i) => <li key={i}>{item}</li>)}
                            </ul>
                        </div>

                        {/* 2031-2033 */}
                        <div style={{ ...styles.timelineCard, background: 'linear-gradient(135deg, #0066cc 0%, #0080ff 100%)' }} className="timeline-card-hover">
                            <div style={styles.timelineYear}>{t('about_page.vision.phases.p3.year')}</div>
                            <h3 style={styles.timelineTitle}>{t('about_page.vision.phases.p3.title')}</h3>
                            <ul style={styles.timelineList}>
                                {t('about_page.vision.phases.p3.items', { returnObjects: true }).map((item, i) => <li key={i}>{item}</li>)}
                            </ul>
                        </div>
                    </div>

                    {/* Objectifs Chiffrés */}
                    <div style={styles.goalsSection}>
                        <h3 style={{ ...styles.centerTitle, fontSize: '2.2rem', marginTop: '4rem' }}>{t('about_page.goals.title')}</h3>
                        <div style={styles.goalsGrid} className="goals-grid">
                            <div className="goal-card-special" style={{ ...styles.goalCard, borderTop: '4px solid #00ccff' }}>
                                <div style={styles.goalNumber}>{t('about_page.goals.items.clients.number')}</div>
                                <div style={styles.goalLabel}>{t('about_page.goals.items.clients.label')}</div>
                                <div style={styles.goalDesc}>{t('about_page.goals.items.clients.desc')}</div>
                            </div>
                            <div className="goal-card-special" style={{ ...styles.goalCard, borderTop: '4px solid #0080ff' }}>
                                <div style={styles.goalNumber}>{t('about_page.goals.items.assets.number')}</div>
                                <div style={styles.goalLabel}>{t('about_page.goals.items.assets.label')}</div>
                                <div style={styles.goalDesc}>{t('about_page.goals.items.assets.desc')}</div>
                            </div>
                            <div className="goal-card-special" style={{ ...styles.goalCard, borderTop: '4px solid #0066cc' }}>
                                <div style={styles.goalNumber}>{t('about_page.goals.items.countries.number')}</div>
                                <div style={styles.goalLabel}>{t('about_page.goals.items.countries.label')}</div>
                                <div style={styles.goalDesc}>{t('about_page.goals.items.countries.desc')}</div>
                            </div>
                            <div className="goal-card-special" style={{ ...styles.goalCard, borderTop: '4px solid #004d99' }}>
                                <div style={styles.goalNumber}>{t('about_page.goals.items.carbon.number')}</div>
                                <div style={styles.goalLabel}>{t('about_page.goals.items.carbon.label')}</div>
                                <div style={styles.goalDesc}>{t('about_page.goals.items.carbon.desc')}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Partners & Shareholders Section */}
            <section style={{ ...styles.section, background: 'linear-gradient(135deg, #003366 0%, #004d99 100%)', color: 'white' }}>
                <div className="container">
                    <h2 style={{ ...styles.centerTitle, color: 'white' }}>{t('about_page.partners.title')}</h2>
                    <p style={{ ...styles.centerSubtitle, color: 'rgba(255,255,255,0.9)', marginBottom: '3rem' }}>
                        {t('about_page.partners.subtitle')}
                    </p>

                    {/* Actionnaires Principaux */}
                    <div style={styles.partnersSection}>
                        <h3 style={styles.partnersSectionTitle}>{t('about_page.partners.shareholders.title')}</h3>
                        <div style={styles.partnersGrid} className="partners-grid">
                            <div className="partner-card-hover" style={styles.partnerCard}>
                                <h4 style={styles.partnerName}>Luxembourg Financial Group</h4>
                                <p style={styles.partnerRole}>{t('about_page.partners.shareholders.lfg_role')}</p>
                                <p style={styles.partnerDesc}>{t('about_page.partners.shareholders.lfg')}</p>
                            </div>
                            <div className="partner-card-hover" style={styles.partnerCard}>
                                <h4 style={styles.partnerName}>European Tech Ventures</h4>
                                <p style={styles.partnerRole}>{t('about_page.partners.shareholders.etv_role')}</p>
                                <p style={styles.partnerDesc}>{t('about_page.partners.shareholders.etv')}</p>
                            </div>
                            <div className="partner-card-hover" style={styles.partnerCard}>
                                <h4 style={styles.partnerName}>Capital Partners International</h4>
                                <p style={styles.partnerRole}>{t('about_page.partners.shareholders.cpi_role')}</p>
                                <p style={styles.partnerDesc}>{t('about_page.partners.shareholders.cpi')}</p>
                            </div>
                        </div>
                    </div>

                    {/* Partenaires Technologiques */}
                    <div style={styles.partnersSection}>
                        <h3 style={styles.partnersSectionTitle}>{t('about_page.partners.ecosystem.title')}</h3>
                        <PartnersCarousel />
                    </div>

                    {/* Clients Entreprises */}
                    <div style={styles.partnersSection}>
                        <h3 style={styles.partnersSectionTitle}>{t('about_page.partners.clients.title')}</h3>
                        <p style={{ ...styles.centerSubtitle, color: 'rgba(255,255,255,0.9)', marginBottom: '2rem' }}>
                            {t('about_page.partners.clients.subtitle')}
                        </p>
                        <div style={styles.statsGrid} className="stats-grid">
                            <div style={styles.statCard}>
                                <div style={styles.statNumber}>2 500+</div>
                                <div style={styles.statLabel}>{t('about_page.partners.clients.stats.pme')}</div>
                            </div>
                            <div style={styles.statCard}>
                                <div style={styles.statNumber}>350+</div>
                                <div style={styles.statLabel}>{t('about_page.partners.clients.stats.large')}</div>
                            </div>
                            <div style={styles.statCard}>
                                <div style={styles.statNumber}>12 000+</div>
                                <div style={styles.statLabel}>{t('about_page.partners.clients.stats.startups')}</div>
                            </div>
                            <div style={styles.statCard}>
                                <div style={styles.statNumber}>€2.5Mds</div>
                                <div style={styles.statLabel}>{t('about_page.partners.clients.stats.volume')}</div>
                            </div>
                        </div>
                    </div>

                    {/* CTA pour entreprises */}
                    <div style={styles.ctaSection}>
                        <h3 style={styles.ctaTitle}>{t('about_page.partners.cta.title')}</h3>
                        <p style={styles.ctaText}>{t('about_page.partners.cta.text')}</p>
                        <Link to={getPath('/contact')} style={{ ...styles.ctaButton, textDecoration: 'none', display: 'inline-block' }}>{t('about_page.partners.cta.button')}</Link>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section style={{ ...styles.section, backgroundColor: '#f0f4f8' }}>
                <div className="container">
                    <h2 style={styles.centerTitle}>{t('about_page.values.title')}</h2>
                    <div style={styles.valuesGrid} className="valuesGrid">
                        <div className="value-card-hover" style={styles.valueCard}>
                            <div style={styles.valueIcon}>🔒</div>
                            <h3 style={styles.cardTitle}>{t('about_page.values.items.security.title')}</h3>
                            <p style={styles.cardText}>{t('about_page.values.items.security.text')}</p>
                        </div>
                        <div className="value-card-hover" style={styles.valueCard}>
                            <div style={styles.valueIcon}>💡</div>
                            <h3 style={styles.cardTitle}>{t('about_page.values.items.innovation.title')}</h3>
                            <p style={styles.cardText}>{t('about_page.values.items.innovation.text')}</p>
                        </div>
                        <div className="value-card-hover" style={styles.valueCard}>
                            <div style={styles.valueIcon}>🤝</div>
                            <h3 style={styles.cardTitle}>{t('about_page.values.items.transparency.title')}</h3>
                            <p style={styles.cardText}>{t('about_page.values.items.transparency.text')}</p>
                        </div>
                        <div className="value-card-hover" style={styles.valueCard}>
                            <div style={styles.valueIcon}>🌱</div>
                            <h3 style={styles.cardTitle}>{t('about_page.values.items.responsibility.title')}</h3>
                            <p style={styles.cardText}>{t('about_page.values.items.responsibility.text')}</p>
                        </div>
                    </div>
                </div>
            </section>
            <style>
                {`
                    @media (max-width: 768px) {
                        .about-hero-mobile {
                            min-height: 160px !important;
                        }
                        .about-hero-mobile h1 {
                            font-size: 1.3rem !important;
                        }
                    }
                `}
            </style>
        </div>
    );
};

const styles = {
    page: {
        minHeight: '100vh',
    },
    hero: {
        backgroundImage: 'url(/banner-privacy.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        minHeight: '220px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    heroOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 51, 102, 0.85)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    heroTitle: {
        fontSize: '3.5rem',
        marginBottom: '1rem',
        color: 'white',
        fontWeight: '800',
        textAlign: 'center',
        position: 'relative',
        zIndex: 1,
    },
    heroSubtitle: {
        fontSize: '1.5rem',
        color: 'rgba(255,255,255,0.95)',
        textAlign: 'center',
        position: 'relative',
        zIndex: 1,
    },
    section: {
        padding: '6rem 0',
    },
    contentGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '4rem',
        alignItems: 'center',
    },
    imageWrapper: {
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
    },
    sectionImage: {
        width: '100%',
        height: 'auto',
        display: 'block',
    },
    contentWrapper: {
        padding: '1rem',
    },
    sectionTitle: {
        fontSize: '2.5rem',
        color: 'var(--primary-color)',
        marginBottom: '2rem',
        fontWeight: '700',
    },
    centerTitle: {
        textAlign: 'center',
        fontSize: '2.8rem',
        color: 'var(--primary-color)',
        marginBottom: '1rem',
        fontWeight: '800',
    },
    centerSubtitle: {
        textAlign: 'center',
        fontSize: '1.2rem',
        color: '#666',
        marginBottom: '4rem',
        maxWidth: '700px',
        margin: '0 auto 4rem',
    },
    text: {
        lineHeight: 1.8,
        fontSize: '1.05rem',
        color: '#555',
        marginBottom: '1.5rem',
        textAlign: 'justify',
    },
    servicesGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem',
    },
    serviceCard: {
        background: 'linear-gradient(135deg, #00ccff 0%, #0088cc 100%)', // Pure Blue
        padding: '2.5rem 2rem',
        borderRadius: '24px',
        boxShadow: '0 15px 40px rgba(0, 204, 255, 0.3)',
        textAlign: 'center',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        border: 'none',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden'
    },
    serviceIcon: {
        fontSize: '3rem',
        marginBottom: '1.5rem',
        textShadow: '0 4px 10px rgba(0,0,0,0.2)'
    },
    cardTitle: {
        marginBottom: '1rem',
        color: 'white', // White Title
        fontSize: '1.4rem',
        fontWeight: '800',
        textShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    cardText: {
        color: 'black', // Black Text as requested
        lineHeight: 1.6,
        fontSize: '1rem',
        fontWeight: '700' // Bold for legibility on blue
    },
    partnersSection: {
        marginBottom: '4rem',
    },
    partnersSectionTitle: {
        fontSize: '1.8rem',
        marginBottom: '2rem',
        textAlign: 'center',
        color: 'white',
        fontWeight: '700',
    },
    partnersGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '2rem',
    },
    partnerCard: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        padding: '2rem',
        borderRadius: '12px',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.2)',
        transition: 'all 0.3s ease',
    },
    partnerName: {
        fontSize: '1.3rem',
        marginBottom: '0.5rem',
        color: 'white',
        fontWeight: '700',
    },
    partnerRole: {
        fontSize: '0.95rem',
        color: '#00ccff',
        marginBottom: '0.8rem',
        fontWeight: '600',
    },
    partnerDesc: {
        fontSize: '0.95rem',
        color: 'rgba(255,255,255,0.8)',
        lineHeight: 1.5,
    },
    statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '2rem',
    },
    statCard: {
        textAlign: 'center',
        padding: '2rem',
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: '12px',
        backdropFilter: 'blur(10px)',
    },
    statNumber: {
        fontSize: '3rem',
        fontWeight: '800',
        color: '#00ccff',
        marginBottom: '0.5rem',
    },
    statLabel: {
        fontSize: '1rem',
        color: 'rgba(255,255,255,0.9)',
        fontWeight: '500',
    },
    ctaSection: {
        textAlign: 'center',
        marginTop: '4rem',
        padding: '3rem',
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: '16px',
        backdropFilter: 'blur(10px)',
    },
    ctaTitle: {
        fontSize: '2rem',
        marginBottom: '1rem',
        color: 'white',
        fontWeight: '700',
    },
    ctaText: {
        fontSize: '1.1rem',
        color: 'rgba(255,255,255,0.9)',
        marginBottom: '2rem',
        maxWidth: '600px',
        margin: '0 auto 2rem',
    },
    ctaButton: {
        backgroundColor: 'black', // Black Button
        color: 'white',
        padding: '1.2rem 3rem',
        fontSize: '1.1rem',
        fontWeight: '800',
        border: 'none',
        borderRadius: '50px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
    },
    valuesGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '2rem',
    },
    valueCard: {
        background: 'linear-gradient(135deg, #00ccff 0%, #0088cc 100%)', // Pure Blue
        padding: '2.5rem 2rem',
        borderRadius: '24px',
        boxShadow: '0 15px 40px rgba(0, 204, 255, 0.3)',
        textAlign: 'center',
        transition: 'transform 0.3s ease',
        border: 'none',
    },
    valueIcon: {
        fontSize: '3.5rem',
        marginBottom: '1.5rem',
        textShadow: '0 4px 10px rgba(0,0,0,0.2)'
    },
    timelineContainer: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem',
        marginTop: '3rem',
    },
    timelineCard: {
        padding: '2.5rem',
        borderRadius: '16px',
        color: 'white',
        boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        cursor: 'pointer',
    },
    timelineYear: {
        fontSize: '2.5rem',
        fontWeight: '800',
        marginBottom: '1rem',
        color: '#00ccff',
        textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
    },
    timelineTitle: {
        fontSize: '1.5rem',
        marginBottom: '1.5rem',
        fontWeight: '700',
        color: 'white',
    },
    timelineList: {
        listStyle: 'none',
        padding: 0,
        margin: 0,
    },
    goalsSection: {
        marginTop: '5rem',
    },
    goalsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '2rem',
        marginTop: '3rem',
    },
    goalCard: {
        backgroundColor: 'white',
        padding: '2.5rem 2rem',
        borderRadius: '12px',
        boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
        textAlign: 'center',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    },
    goalNumber: {
        fontSize: '3rem',
        fontWeight: '800',
        color: 'var(--primary-color)',
        marginBottom: '0.5rem',
        transition: 'all 0.3s ease',
    },
    goalLabel: {
        fontSize: '1.2rem',
        fontWeight: '700',
        color: '#333',
        marginBottom: '0.5rem',
    },
    goalDesc: {
        fontSize: '0.95rem',
        color: '#666',
    },
};

export default About;
