import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Cards = () => {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const currentLang = i18n.language;
    const getPath = (path) => `/${currentLang}${path}`;
    const [isFlipped, setIsFlipped] = useState(false);

    return (
        <div style={styles.page}>
            {/* Hero Section */}
            <section style={styles.hero} className="cards-hero cards-hero-mobile">
                <div style={styles.heroOverlay}>
                    <div className="container">
                        <h1 style={styles.heroTitle}>{t('cards_page.hero.title')}</h1>
                        <p style={styles.breadcrumb}>{t('cards_page.hero.breadcrumb')}</p>
                    </div>
                </div>
            </section>

            {/* Intro Section */}
            <section className="container" style={styles.introSection}>
                <h4 style={styles.introSubtitle}>{t('cards_page.intro.subtitle')}</h4>
                <h2 style={styles.introTitle}>
                    {t('cards_page.intro.title')}
                </h2>
            </section>

            {/* Cards Grid */}
            <div style={styles.gridContainer} className="container cards-grid">

                {/* Visual Card 1: Silver */}
                <div style={styles.cardWrapper} className="card-hover">
                    <img
                        src="/resource/visa_classic_silver_invick.png"
                        alt="Carte Visa Classic Silver - INVICK SA"
                        style={styles.cardImage}
                    />
                    <div style={styles.cardInfo}>
                        <h3 style={styles.cardTitle}>{t('cards_page.cards.silver.title')}</h3>
                        <p style={styles.cardDesc}>
                            {t('cards_page.cards.silver.desc')}
                        </p>
                        <button style={styles.cardButton} onClick={() => navigate(getPath('/register'))}>{t('cards_page.cta_button')}</button>
                    </div>
                </div>

                {/* Visual Card 2: Gold */}
                <div style={styles.cardWrapper} className="card-hover">
                    <img
                        src="/resource/mastercard_gold_invick.png"
                        alt="Carte Mastercard Gold - INVICK SA"
                        style={styles.cardImage}
                    />
                    <div style={styles.cardInfo}>
                        <h3 style={styles.cardTitle}>{t('cards_page.cards.gold.title')}</h3>
                        <p style={styles.cardDesc}>
                            {t('cards_page.cards.gold.desc')}
                        </p>
                        <button style={styles.cardButton} onClick={() => navigate(getPath('/register'))}>{t('cards_page.cta_button')}</button>
                    </div>
                </div>

                {/* Visual Card 3: Platinum */}
                <div style={styles.cardWrapper} className="card-hover">
                    <img
                        src="/resource/visa_platinum_invick.png"
                        alt="Carte Visa Platinum - INVICK SA"
                        style={styles.cardImage}
                    />
                    <div style={styles.cardInfo}>
                        <h3 style={styles.cardTitle}>{t('cards_page.cards.platinum.title')}</h3>
                        <p style={styles.cardDesc}>
                            {t('cards_page.cards.platinum.desc')}
                        </p>
                        <button style={styles.cardButton} onClick={() => navigate(getPath('/register'))}>{t('cards_page.cta_button')}</button>
                    </div>
                </div>

            </div>

            {/* Virtual Card Section */}
            <section style={styles.virtualSection} className="container virtual-section">
                <div style={styles.virtualContent} className="virtual-content">
                    <h2 style={styles.virtualTitle}>{t('cards_page.virtual.title')}</h2>
                    <p style={styles.virtualDesc}>
                        {t('cards_page.virtual.desc')}
                    </p>
                    <ul style={styles.virtualFeatures}>
                        {t('cards_page.virtual.features', { returnObjects: true }).map((item, i) => (
                            <li key={i} style={styles.virtualFeature}>{item}</li>
                        ))}
                    </ul>
                    <button style={styles.ctaButtonLarge} onClick={() => navigate(getPath('/register'))}>
                        {t('cards_page.virtual.button')}
                    </button>
                </div>

                {/* 3D Flip Card Container */}
                <div style={styles.virtualVisual} onClick={() => setIsFlipped(!isFlipped)} className="virtual-visual-wrapper">
                    <div style={{
                        ...styles.flipCardInner,
                        transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
                    }} className="flip-card-inner">
                        {/* Front Side */}
                        <div style={styles.flipCardFront} className="flip-card-front">
                            <div style={styles.virtualCard} className="virtual-card">
                                <div style={styles.cardTop}>
                                    <span style={{ fontWeight: 'bold', fontSize: '1.2rem', letterSpacing: '1px' }}>INVIK DIGITAL</span>
                                    <span style={{ fontSize: '0.8rem' }}>VIRTUAL</span>
                                </div>
                                <div style={styles.cardChip}></div>
                                <div style={styles.cardMid}>
                                    <div style={{ fontSize: '1.3rem', letterSpacing: '3px', fontFamily: 'monospace', marginBottom: '1rem' }}>
                                        •••• •••• •••• 4242
                                    </div>
                                </div>
                                <div style={styles.cardBottom}>
                                    <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>{t('cards_page.virtual.card_back.valid_until')} 12/28</span>
                                    <span style={{ fontWeight: 'bold', fontSize: '1.2rem', fontStyle: 'italic' }}>VISA</span>
                                </div>
                            </div>
                        </div>

                        {/* Back Side */}
                        <div style={styles.flipCardBack} className="flip-card-back">
                            <div style={styles.virtualCardBack} className="virtual-card virtual-card-back">
                                <div style={styles.cardMagneticStrip}></div>
                                <div style={styles.cardSignatureRow}>
                                    <div style={styles.cardSignature}>{t('cards_page.virtual.card_back.signature')}</div>
                                    <div style={styles.cardCvc}>123</div>
                                </div>
                                <div style={styles.cardBackText}>
                                    {t('cards_page.virtual.card_back.text')}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <style>
                {`
                    @media (max-width: 768px) {
                        .cards-hero-mobile {
                            height: 160px !important;
                            margin-bottom: 2rem !important;
                        }
                        .cards-hero-mobile h1 {
                            font-size: 1.3rem !important;
                        }
                        .virtual-section {
                            padding-top: 3rem !important;
                            padding-bottom: 8rem !important;
                            gap: 2rem !important;
                        }
                        .virtual-visual-wrapper {
                            height: 300px !important;
                            margin-top: 2rem !important;
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
        backgroundImage: 'url(/banner-cards.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        height: '220px', // Reduced height
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
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    heroTitle: {
        fontSize: '3.5rem',
        color: 'white',
        fontWeight: '800',
        textAlign: 'center',
        marginBottom: '1rem',
        textTransform: 'uppercase',
        letterSpacing: '2px',
    },
    breadcrumb: {
        color: '#ccc',
        textAlign: 'center',
        fontSize: '0.9rem',
        fontWeight: '500',
        letterSpacing: '1px',
    },
    introSection: {
        textAlign: 'center',
        maxWidth: '800px',
        margin: '0 auto 4rem auto',
        padding: '0 1rem',
    },
    introSubtitle: {
        color: '#00ccff',
        fontSize: '0.9rem',
        fontWeight: '700',
        textTransform: 'uppercase',
        marginBottom: '1rem',
        letterSpacing: '1px',
    },
    introTitle: {
        fontSize: '2rem',
        color: '#003366',
        fontWeight: '700',
        lineHeight: '1.4',
    },
    gridContainer: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '2rem',
        padding: '2rem',
        marginBottom: '4rem',
    },
    cardWrapper: {
        backgroundColor: 'white',
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: '0 10px 40px rgba(0,0,0,0.05)',
        transition: 'transform 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        padding: '0 0 2rem 0',
    },
    cardImage: {
        width: '100%',
        height: 'auto',
        objectFit: 'cover',
        display: 'block',
        marginBottom: '1rem',
    },
    cardInfo: {
        padding: '1.5rem 2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        flex: 1,
    },
    cardTitle: {
        fontSize: '1.4rem',
        fontWeight: '700',
        color: '#003366',
        marginBottom: '1rem',
    },
    cardDesc: {
        fontSize: '0.95rem',
        color: '#666',
        lineHeight: '1.6',
        marginBottom: '2rem',
        flex: 1,
    },
    cardButton: {
        backgroundColor: '#001a33',
        color: 'white',
        padding: '0.8rem 1.5rem',
        border: 'none',
        borderRadius: '4px',
        fontSize: '0.85rem',
        fontWeight: '700',
        textTransform: 'uppercase',
        cursor: 'pointer',
        letterSpacing: '0.5px',
        transition: 'background-color 0.3s',
        width: '100%',
    },
    // Virtual Section Styles
    virtualSection: {
        display: 'flex',
        alignItems: 'center',
        gap: '4rem',
        backgroundColor: 'white',
        borderRadius: '20px',
        padding: '4rem',
        boxShadow: '0 10px 40px rgba(0,0,0,0.05)',
        flexWrap: 'wrap',
    },
    virtualContent: {
        flex: 1,
        minWidth: '300px',
    },
    virtualTitle: {
        fontSize: '2.2rem',
        color: '#003366',
        fontWeight: '800',
        marginBottom: '1.5rem',
    },
    virtualDesc: {
        fontSize: '1.1rem',
        color: '#555',
        lineHeight: '1.7',
        marginBottom: '2rem',
    },
    virtualFeatures: {
        listStyle: 'none',
        padding: 0,
        marginBottom: '2.5rem',
    },
    virtualFeature: {
        fontSize: '1.05rem',
        color: '#444',
        marginBottom: '0.8rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
    },
    ctaButtonLarge: {
        backgroundColor: '#00ccff',
        color: '#003366',
        padding: '1rem 3rem',
        border: 'none',
        borderRadius: '50px',
        fontSize: '1rem',
        fontWeight: '800',
        textTransform: 'uppercase',
        cursor: 'pointer',
        boxShadow: '0 5px 20px rgba(0, 204, 255, 0.4)',
        transition: 'all 0.3s ease',
    },
    // FLIP CARD ANIMATION STYLES
    virtualVisual: {
        flex: 1,
        minWidth: '300px',
        height: '320px', // Further increased from 260px to 320px
        perspective: '1000px',
        cursor: 'pointer',
    },
    flipCardInner: {
        position: 'relative',
        width: '100%',
        height: '100%',
        textAlign: 'center',
        transition: 'transform 0.6s',
        transformStyle: 'preserve-3d',
    },
    flipCardFront: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
    },
    flipCardBack: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
        transform: 'rotateY(180deg)',
    },
    // Front Design (Re-used)
    virtualCard: {
        width: '100%',
        maxWidth: '350px',
        height: '210px',
        background: 'linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)',
        borderRadius: '16px',
        padding: '25px',
        color: 'white',
        boxShadow: '0 20px 50px rgba(0, 114, 255, 0.3)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
        margin: '0 auto',
    },
    // Back Design
    virtualCardBack: {
        width: '100%',
        maxWidth: '350px',
        height: '210px',
        background: 'linear-gradient(135deg, #0072ff 0%, #00c6ff 100%)', // Reversed gradient
        borderRadius: '16px',
        color: 'white',
        boxShadow: '0 20px 50px rgba(0, 114, 255, 0.3)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative',
        margin: '0 auto',
    },
    cardMagneticStrip: {
        width: '100%',
        height: '40px',
        backgroundColor: '#1a1a1a',
        marginTop: '25px',
    },
    cardSignatureRow: {
        display: 'flex',
        alignItems: 'center',
        padding: '0 25px',
        marginTop: '15px',
        gap: '10px',
    },
    cardSignature: {
        flex: 1,
        height: '35px',
        backgroundColor: '#eee',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#333',
        fontFamily: 'cursive',
        fontSize: '0.9rem',
        borderRadius: '4px',
    },
    cardCvc: {
        width: '40px',
        height: '35px',
        backgroundColor: 'white',
        color: '#000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
        fontStyle: 'italic',
        borderRadius: '4px',
    },
    cardBackText: {
        padding: '15px 25px',
        fontSize: '0.6rem',
        opacity: 0.8,
        textAlign: 'left',
        marginTop: 'auto',
    },
    // Inner Elements
    cardTop: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardChip: {
        width: '45px',
        height: '35px',
        backgroundColor: 'rgba(255,255,255,0.3)',
        borderRadius: '6px',
        marginTop: '1.5rem',
    },
    cardMid: {
        // spacer or mid section
    },
    cardBottom: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
};

export default Cards;
