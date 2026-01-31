import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const FooterMobile = () => {
    const { t, i18n } = useTranslation();
    const currentLang = i18n.language;
    const getPath = (path) => `/${currentLang}${path}`;

    const [openSection, setOpenSection] = useState(null);

    const toggleSection = (section) => {
        setOpenSection(openSection === section ? null : section);
    };

    return (
        <footer style={styles.footer}>
            {/* Logo & Description */}
            <div style={styles.logoSection}>
                <img src="/logo-white-transparent.png" alt="INVIK SA Logo" style={styles.logo} />
                <p style={styles.description}>
                    {t('footer.description')}
                </p>
            </div>

            {/* Social Icons */}
            <div style={styles.socialIcons}>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" style={styles.iconCircle}>
                    <i className="fab fa-facebook-f"></i>
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" style={styles.iconCircle}>
                    <i className="fab fa-youtube"></i>
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" style={styles.iconCircle}>
                    <i className="fab fa-linkedin-in"></i>
                </a>
            </div>

            {/* Accordion Sections */}
            <div style={styles.accordionContainer}>
                {/* Navigation Section */}
                <div style={styles.accordionItem}>
                    <button
                        style={styles.accordionHeader}
                        onClick={() => toggleSection('navigation')}
                    >
                        <span>{t('footer.navigation.title')}</span>
                        <span style={{
                            ...styles.accordionIcon,
                            transform: openSection === 'navigation' ? 'rotate(180deg)' : 'rotate(0deg)'
                        }}>▼</span>
                    </button>
                    <div style={{
                        ...styles.accordionContent,
                        maxHeight: openSection === 'navigation' ? '500px' : '0',
                        opacity: openSection === 'navigation' ? '1' : '0'
                    }}>
                        <Link to={getPath('/')} style={styles.link}>• {t('footer.navigation.home')}</Link>
                        <Link to={getPath('/about')} style={styles.link}>• {t('footer.navigation.about')}</Link>
                        <Link to={getPath('/services')} style={styles.link}>• {t('footer.navigation.services')}</Link>
                        <Link to={getPath('/cards')} style={styles.link}>• {t('footer.navigation.cards')}</Link>
                        <Link to={getPath('/faq')} style={styles.link}>• {t('footer.navigation.faq')}</Link>
                    </div>
                </div>

                {/* Support Section */}
                <div style={styles.accordionItem}>
                    <button
                        style={styles.accordionHeader}
                        onClick={() => toggleSection('support')}
                    >
                        <span>{t('footer.support.title')}</span>
                        <span style={{
                            ...styles.accordionIcon,
                            transform: openSection === 'support' ? 'rotate(180deg)' : 'rotate(0deg)'
                        }}>▼</span>
                    </button>
                    <div style={{
                        ...styles.accordionContent,
                        maxHeight: openSection === 'support' ? '500px' : '0',
                        opacity: openSection === 'support' ? '1' : '0'
                    }}>
                        <Link to={getPath('/contact')} style={styles.link}>• {t('footer.support.contact')}</Link>
                        <Link to={getPath('/credit-request')} style={styles.link}>• {t('footer.support.credit_request')}</Link>
                    </div>
                </div>

                {/* Legal Section */}
                <div style={styles.accordionItem}>
                    <button
                        style={styles.accordionHeader}
                        onClick={() => toggleSection('legal')}
                    >
                        <span>{t('footer.legal.title')}</span>
                        <span style={{
                            ...styles.accordionIcon,
                            transform: openSection === 'legal' ? 'rotate(180deg)' : 'rotate(0deg)'
                        }}>▼</span>
                    </button>
                    <div style={{
                        ...styles.accordionContent,
                        maxHeight: openSection === 'legal' ? '500px' : '0',
                        opacity: openSection === 'legal' ? '1' : '0'
                    }}>
                        <Link to={getPath('/confidentialite')} style={styles.link}>• {t('footer.legal.privacy')}</Link>
                        <Link to={getPath('/cgu')} style={styles.link}>• {t('footer.legal.cgu')}</Link>
                        <Link to={getPath('/mentions-legales')} style={styles.link}>• {t('footer.legal.mentions')}</Link>
                        <Link to={getPath('/reviews')} style={styles.link}>• {t('footer.legal.reviews')}</Link>
                    </div>
                </div>
            </div>

            {/* Copyright */}
            <div style={styles.copyright}>
                © {new Date().getFullYear()} {t('footer.copyright')}
            </div>
        </footer>
    );
};

const styles = {
    footer: {
        backgroundColor: '#050a14',
        color: '#fff',
        padding: '2.5rem 1.5rem 1.5rem',
        fontFamily: "'Inter', sans-serif"
    },
    logoSection: {
        textAlign: 'center',
        marginBottom: '1.5rem'
    },
    logo: {
        width: '100px',
        height: 'auto',
        marginBottom: '1rem'
    },
    description: {
        fontSize: '0.8rem',
        lineHeight: '1.5',
        color: '#ccc',
        margin: '0 auto',
        maxWidth: '90%'
    },
    socialIcons: {
        display: 'flex',
        justifyContent: 'center',
        gap: '1rem',
        marginBottom: '2rem'
    },
    iconCircle: {
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        backgroundColor: 'rgba(255,255,255,0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        textDecoration: 'none',
        fontSize: '16px',
        transition: 'all 0.3s ease',
        border: '1px solid rgba(255,255,255,0.1)'
    },
    accordionContainer: {
        marginBottom: '2rem'
    },
    accordionItem: {
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        marginBottom: '0.5rem'
    },
    accordionHeader: {
        width: '100%',
        padding: '1.2rem 0',
        backgroundColor: 'transparent',
        border: 'none',
        color: '#fff',
        fontSize: '0.95rem',
        fontWeight: '700',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        cursor: 'pointer',
        fontFamily: "'Outfit', sans-serif",
        textAlign: 'left'
    },
    accordionIcon: {
        fontSize: '0.7rem',
        transition: 'transform 0.3s ease',
        color: '#00ccff'
    },
    accordionContent: {
        overflow: 'hidden',
        transition: 'max-height 0.4s ease, opacity 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.8rem',
        paddingBottom: '1rem'
    },
    link: {
        color: '#ccc',
        textDecoration: 'none',
        fontSize: '0.85rem',
        transition: 'color 0.3s',
        paddingLeft: '0.5rem'
    },
    copyright: {
        textAlign: 'center',
        paddingTop: '1.5rem',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        color: '#666',
        fontSize: '0.75rem',
        lineHeight: '1.5'
    }
};

export default FooterMobile;
