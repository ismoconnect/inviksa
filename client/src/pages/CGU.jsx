import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const CGU = () => {
    const { t } = useTranslation();
    const sections = t('legal.cgu.sections', { returnObjects: true });

    return (
        <div style={styles.page}>
            {/* Hero Section */}
            <section style={styles.hero} className="legal-hero legal-hero-mobile">
                <div style={styles.heroOverlay}>
                    <div className="container">
                        <h1 style={styles.heroTitle}>{t('legal.cgu.title')}</h1>
                        <p style={styles.breadcrumb}>{t('legal.common.back_home')} / {t('legal.cgu.breadcrumb')}</p>
                    </div>
                </div>
            </section>

            {/* Content Section */}
            <section className="container" style={styles.contentSection}>
                <div style={styles.card} className="legal-content-card">
                    <p style={styles.lastUpdate}>{t('legal.common.last_update')}</p>

                    <p style={styles.intro}>{t('legal.cgu.intro_1')}</p>
                    <p style={styles.intro}>{t('legal.cgu.intro_2')}</p>
                    <p style={styles.text}>{t('legal.cgu.intro_3')}</p>

                    {sections.map((section, index) => (
                        <div key={index}>
                            <h2 style={styles.sectionTitle}>{section.title}</h2>
                            {section.text && <p style={styles.text}>{section.text}</p>}
                            {section.text2 && <p style={styles.text}>{section.text2}</p>}

                            {section.list && (
                                <ul style={styles.list}>
                                    {section.list.map((item, i) => (
                                        <li key={i} style={styles.listItem}>{item}</li>
                                    ))}
                                </ul>
                            )}

                            {section.text3 && <p style={styles.text}>{section.text3}</p>}

                            {section.subsections && section.subsections.map((sub, j) => (
                                <div key={j}>
                                    <h3 style={styles.subSectionTitle}>{sub.title}</h3>
                                    {sub.text && <p style={styles.text}>{sub.text}</p>}
                                    {sub.list && (
                                        <ul style={styles.list}>
                                            {sub.list.map((item, k) => (
                                                <li key={k} style={styles.listItem}>{item}</li>
                                            ))}
                                        </ul>
                                    )}
                                    {sub.text_after && <p style={styles.text}>{sub.text_after}</p>}
                                </div>
                            ))}
                        </div>
                    ))}

                    <div style={styles.ctaWrapper}>
                        <Link to="/contact" style={styles.ctaButton} className="premium-button legal-cta-btn">
                            {t('legal.common.cta_contact')}
                        </Link>
                    </div>
                </div>
            </section>
            <style>
                {`
                    @media (max-width: 768px) {
                        .legal-hero-mobile {
                            height: 120px !important;
                            margin-bottom: 1.5rem !important;
                        }
                        .legal-hero-mobile h1 {
                            font-size: 1.2rem !important;
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
        backgroundColor: '#f8f9fa',
        paddingBottom: '5rem',
    },
    hero: {
        backgroundImage: 'url(/banner-cgu.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        height: '180px', // Reduced height
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '2rem', // Reduced margin
    },
    heroOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    heroTitle: {
        fontSize: '2.2rem',
        color: 'white',
        fontWeight: '800',
        textAlign: 'center',
        marginBottom: '0.5rem',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        fontFamily: "'Outfit', sans-serif",
        padding: '0 1rem',
    },
    breadcrumb: {
        color: '#ccc',
        textAlign: 'center',
        fontSize: '0.85rem',
        fontWeight: '500',
        letterSpacing: '1px',
    },
    contentSection: {
        maxWidth: '1000px',
        margin: '0 auto',
        padding: '0 1.5rem',
    },
    card: {
        backgroundColor: 'white',
        borderRadius: '20px',
        padding: '3rem',
        boxShadow: '0 10px 40px rgba(0,0,0,0.05)',
    },
    lastUpdate: {
        color: '#888',
        fontSize: '0.9rem',
        marginBottom: '2rem',
        fontStyle: 'italic',
    },
    intro: {
        fontSize: '1.1rem',
        color: '#444',
        lineHeight: '1.8',
        marginBottom: '1.5rem',
    },
    sectionTitle: {
        fontSize: '1.6rem',
        color: '#003366',
        fontWeight: '700',
        marginTop: '3.5rem',
        marginBottom: '1.5rem',
        borderBottom: '2px solid #00ccff',
        paddingBottom: '0.5rem',
        display: 'inline-block',
        fontFamily: "'Outfit', sans-serif",
    },
    subSectionTitle: {
        fontSize: '1.2rem',
        color: '#004d99',
        fontWeight: '600',
        marginTop: '2rem',
        marginBottom: '1rem',
        fontFamily: "'Outfit', sans-serif",
    },
    text: {
        fontSize: '1rem',
        color: '#555',
        lineHeight: '1.7',
        marginBottom: '1rem',
    },
    list: {
        paddingLeft: '1.5rem',
        marginBottom: '2rem',
    },
    listItem: {
        fontSize: '1rem',
        color: '#555',
        lineHeight: '1.7',
        marginBottom: '0.8rem',
        listStyleType: 'disc',
    },
    ctaWrapper: {
        marginTop: '4rem',
        textAlign: 'center',
        borderTop: '1px solid #eee',
        paddingTop: '3rem',
    },
    ctaButton: {
        backgroundColor: '#003366',
        color: 'white',
        padding: '1.2rem 2.8rem',
        borderRadius: '50px',
        fontSize: '1rem',
        fontWeight: '700',
        textDecoration: 'none',
        display: 'inline-block',
        transition: 'all 0.3s ease',
        boxShadow: '0 10px 20px rgba(0, 51, 102, 0.2)',
        fontFamily: "'Outfit', sans-serif",
        letterSpacing: '1px',
    },
};

export default CGU;
