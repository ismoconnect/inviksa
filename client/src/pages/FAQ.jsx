import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const FAQ = () => {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const currentLang = i18n.language;
    const getPath = (path) => `/${currentLang}${path}`;

    // State to track which FAQ item is open. 
    const [activeIndex, setActiveIndex] = useState(0); // Open first one by default

    const toggleFAQ = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    const faqData = t('faq_page.items', { returnObjects: true }) || [];

    // Splitting data for 2 columns visual
    const midPoint = Math.ceil(faqData.length / 2);
    const leftColumnData = faqData.slice(0, midPoint);
    const rightColumnData = faqData.slice(midPoint);

    const handleNavigate = (path) => {
        navigate(getPath(path));
    };

    return (
        <div style={styles.page}>
            {/* Hero Section */}
            <section style={styles.hero} className="faq-hero faq-hero-mobile">
                <div style={styles.heroOverlay}>
                    <div className="container">
                        <h1 style={styles.heroTitle}>{t('faq_page.hero.title')}</h1>
                        <p style={styles.breadcrumb}>{t('faq_page.hero.breadcrumb')}</p>
                    </div>
                </div>
            </section>

            {/* FAQ Items Grid */}
            <div className="container faq-grid" style={styles.contentContainer}>

                {/* Left Column */}
                <div style={styles.column} className="faq-column">
                    {leftColumnData.map((item, index) => (
                        <FAQItem
                            key={index}
                            item={item}
                            isOpen={activeIndex === index}
                            onClick={() => toggleFAQ(index)}
                        />
                    ))}
                </div>

                {/* Right Column */}
                <div style={styles.column} className="faq-column">
                    {rightColumnData.map((item, index) => (
                        <FAQItem
                            key={index + midPoint}
                            item={item}
                            isOpen={activeIndex === (index + midPoint)}
                            onClick={() => toggleFAQ(index + midPoint)}
                        />
                    ))}
                </div>

            </div>

            {/* CTA Section */}
            <section style={styles.ctaSection} className="faq-cta-banner">
                <div className="container" style={styles.ctaContainer}>
                    <h2 style={styles.ctaTitle}>{t('faq_page.cta.title')}</h2>
                    <p style={styles.ctaText}>{t('faq_page.cta.text')}</p>
                    <div style={styles.ctaButtons} className="faq-cta-buttons">
                        <button style={styles.btnPrimary} onClick={() => handleNavigate('/register')}>
                            {t('faq_page.cta.buttons.open_account')}
                        </button>
                        <button style={styles.btnSecondary} onClick={() => handleNavigate('/contact')}>
                            {t('faq_page.cta.buttons.contact')}
                        </button>
                    </div>
                </div>
            </section>
            <style>
                {`
                    @media (max-width: 768px) {
                        .faq-hero-mobile {
                            height: 150px !important;
                            margin-bottom: 2rem !important;
                        }
                        .faq-hero-mobile h1 {
                            font-size: 1.3rem !important;
                        }
                    }
                `}
            </style>
        </div>
    );
};

// Sub-component for individual item
const FAQItem = ({ item, isOpen, onClick }) => {
    return (
        <div style={styles.faqItem} className="faq-item-card">
            <div style={styles.questionRow} onClick={onClick} className="faq-question-row">
                <h3 style={styles.questionText}>{item.question}</h3>
                <div style={styles.iconContainer}>
                    {isOpen ? (
                        <span style={styles.iconMinus}>−</span>
                    ) : (
                        <span style={styles.iconPlus}>+</span>
                    )}
                </div>
            </div>
            <div
                style={{
                    ...styles.answerContainer,
                    maxHeight: isOpen ? '500px' : '0',
                    opacity: isOpen ? 1 : 0,
                    paddingTop: isOpen ? '1rem' : '0',
                }}
                className="faq-answer-container"
            >
                <p style={styles.answerText}>{item.answer}</p>
            </div>
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
        backgroundImage: 'url(/banner-faq.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        height: '200px', // Reduced height
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '3rem', // Reduced margin
    },
    heroOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    heroTitle: {
        fontSize: '3rem',
        color: 'white',
        fontWeight: '800',
        textAlign: 'center',
        marginBottom: '0.5rem',
        textTransform: 'uppercase',
        letterSpacing: '3px',
    },
    breadcrumb: {
        color: '#ccc',
        textAlign: 'center',
        fontSize: '0.9rem',
        fontWeight: '500',
        letterSpacing: '1px',
        textTransform: 'uppercase',
    },
    contentContainer: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '2rem',
        alignItems: 'start',
        marginBottom: '6rem',
    },
    column: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
    },
    faqItem: {
        backgroundColor: 'white',
        borderRadius: '4px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
        overflow: 'hidden',
        border: '1px solid #eee',
    },
    questionRow: {
        padding: '1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        cursor: 'pointer',
        backgroundColor: 'white',
        transition: 'background-color 0.2s',
    },
    questionText: {
        fontSize: '1rem',
        fontWeight: '700',
        color: '#222',
        margin: 0,
        flex: 1,
        paddingRight: '1rem',
    },
    iconContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '24px',
        height: '24px',
    },
    iconPlus: {
        fontSize: '1.5rem',
        fontWeight: 'bold',
        color: '#555',
        lineHeight: 1,
    },
    iconMinus: {
        fontSize: '1.5rem',
        fontWeight: 'bold',
        color: '#00ccff',
        lineHeight: 1,
        backgroundColor: '#e6f7ff',
        width: '30px',
        height: '30px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
    },
    answerContainer: {
        paddingLeft: '1.5rem',
        paddingRight: '1.5rem',
        overflow: 'hidden',
        transition: 'all 0.3s ease-in-out',
        backgroundColor: 'white',
    },
    answerText: {
        color: '#666',
        lineHeight: '1.6',
        fontSize: '0.95rem',
        marginBottom: '1.5rem',
        marginTop: 0,
    },
    // CTA Section Styles
    ctaSection: {
        backgroundColor: '#003366',
        padding: '3rem 1rem',
        textAlign: 'center',
        marginTop: '4rem',
        borderRadius: '20px',
        margin: '0 2rem',
    },
    ctaContainer: {
        maxWidth: '800px',
        margin: '0 auto',
    },
    ctaTitle: {
        color: 'white',
        fontSize: '2rem',
        fontWeight: 'bold',
        marginBottom: '1rem',
    },
    ctaText: {
        color: '#b3d1ff',
        fontSize: '1.1rem',
        marginBottom: '2.5rem',
        lineHeight: '1.6',
    },
    ctaButtons: {
        display: 'flex',
        gap: '1.5rem',
        justifyContent: 'center',
        flexWrap: 'wrap',
    },
    btnPrimary: {
        backgroundColor: '#00ccff',
        color: '#003366',
        padding: '1rem 2.5rem',
        border: 'none',
        borderRadius: '50px',
        fontSize: '1rem',
        fontWeight: '800',
        textTransform: 'uppercase',
        cursor: 'pointer',
        boxShadow: '0 10px 20px rgba(0, 204, 255, 0.3)',
        transition: 'all 0.3s ease',
    },
    btnSecondary: {
        backgroundColor: 'transparent',
        color: 'white',
        padding: '1rem 2.5rem',
        border: '2px solid #00ccff',
        borderRadius: '50px',
        fontSize: '1rem',
        fontWeight: '700',
        textTransform: 'uppercase',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
    }
};

export default FAQ;
