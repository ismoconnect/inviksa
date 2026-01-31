import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import HomeMobile from './HomeMobile';

const Home = () => {
    const { t, i18n } = useTranslation();
    const currentLang = i18n.language;
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [currentSlide, setCurrentSlide] = useState(0);
    const getPath = (path) => `/${currentLang}${path}`;

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const slides = [
        {
            image: '/hero-bg.png',
            title: t('home.hero.title'),
            subtitle: t('home.hero.subtitle')
        },
        {
            image: '/banner-7.jpg',
            title: t('home.slides.1.title'),
            subtitle: t('home.slides.1.subtitle')
        },
        {
            image: '/banner-8.jpg',
            title: t('home.slides.2.title'),
            subtitle: t('home.slides.2.subtitle')
        }
    ];

    // --- Simulator State & Logic ---
    const [amount, setAmount] = useState(150000);
    const [duration, setDuration] = useState(120);
    const [interestRate, setInterestRate] = useState(2.99);
    const [monthlyPayment, setMonthlyPayment] = useState(0);

    const rates = [
        1.99, 2.50, 2.99, 3.50, 3.99, 4.50, 4.99, 5.50, 5.99, 6.50, 7.00
    ];

    useEffect(() => {
        const monthlyRate = interestRate / 100 / 12;
        const payment = (amount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -duration));
        setMonthlyPayment(payment);
    }, [amount, duration, interestRate]);

    const services = [
        {
            title: t('home.services.items.current_account.title'),
            icon: "💳",
            features: t('home.services.items.current_account.features', { returnObjects: true })
        },
        {
            title: t('home.services.items.savings.title'),
            icon: "🏦",
            features: t('home.services.items.savings.features', { returnObjects: true })
        },
        {
            title: t('home.services.items.loans.title'),
            icon: "💸",
            features: t('home.services.items.loans.features', { returnObjects: true })
        },
        {
            title: t('home.services.items.transfers.title'),
            icon: "🌍",
            features: t('home.services.items.transfers.features', { returnObjects: true })
        },
        {
            title: t('home.services.items.cards.title'),
            icon: "💎",
            features: t('home.services.items.cards.features', { returnObjects: true })
        },
        {
            title: t('home.services.items.investments.title'),
            icon: "📈",
            features: t('home.services.items.investments.features', { returnObjects: true })
        },
        {
            title: t('home.services.items.mortgage.title'),
            icon: "🏠",
            features: t('home.services.items.mortgage.features', { returnObjects: true })
        },
        {
            title: t('home.services.items.pro.title'),
            icon: "💼",
            features: t('home.services.items.pro.features', { returnObjects: true })
        },
        {
            title: t('home.services.items.insurance.title'),
            icon: "🛡️",
            features: t('home.services.items.insurance.features', { returnObjects: true })
        }
    ];

    // Note: Testimonials are kept static for now as they are specific people, but could be translated if needed.
    // Testimonials images mapping (order must match translation file)
    const testimonialImages = [
        "/avatar-male-pro.png",
        "/avatar-female-pro.png",
        "/avatar-male-pro.png",
        "/avatar-female-pro.png",
        "/avatar-male-pro.png",
        "/avatar-female-pro.png",
        "/avatar-male-pro.png",
        "/avatar-female-pro.png",
        "/avatar-male-pro.png",
        "/avatar-female-pro.png",
        "/avatar-male-pro.png",
        "/avatar-female-pro.png",
        "/avatar-male-pro.png"
    ];

    const testimonialData = t('home.testimonials.items', { returnObjects: true });

    // Merge translations with images
    const testimonials = Array.isArray(testimonialData) ? testimonialData.map((item, index) => ({
        ...item,
        image: testimonialImages[index] || "/avatar-male.png"
    })) : [];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 6000);
        return () => clearInterval(interval);
    }, [slides.length]);

    if (isMobile) {
        return <HomeMobile />;
    }

    return (
        <div style={styles.page}>
            {/* Hero Section */}
            <section style={styles.hero} className="hero-section desktop-only">
                {slides.map((slide, index) => (
                    <div
                        key={index}
                        className="hero-slide"
                        style={{
                            ...styles.slide,
                            backgroundImage: `url(${slide.image})`,
                            opacity: currentSlide === index ? 1 : 0,
                            zIndex: currentSlide === index ? 1 : 0
                        }}
                    />
                ))}

                <div style={styles.overlay} className="hero-overlay">
                    <div className="container" style={styles.heroSplit}>
                        <div style={styles.heroLeft} className="hero-content fadeInUp">
                            <h1 style={styles.heroTitle} className="hero-title">{slides[currentSlide].title}</h1>
                            <p style={styles.heroSubtitle} className="hero-subtitle">{slides[currentSlide].subtitle}</p>
                            <div style={styles.heroButtons} className="hero-buttons">
                                <Link to={getPath('/register')} style={styles.primaryButton}>{t('home.hero.cta_primary')}</Link>
                                <Link to={getPath('/services')} style={styles.secondaryButton}>{t('home.hero.cta_secondary')}</Link>
                            </div>
                        </div>

                        <div style={styles.heroRight} className="hero-right fadeInUp">
                            <div style={styles.simulatorBox} className="simulator-card glass-card">
                                <h3 style={styles.simTitle}>{t('home.simulator.title')}</h3>
                                <p style={styles.simSubtitle}>{t('home.simulator.subtitle')}</p>

                                <div style={styles.simGroup}>
                                    <label style={styles.simLabel}>
                                        {t('home.simulator.amount')} : <span style={styles.simValue}>{amount.toLocaleString()} €</span>
                                    </label>
                                    <input
                                        type="range" min="5000" max="900000" step="5000"
                                        value={amount} onChange={(e) => setAmount(Number(e.target.value))}
                                        style={styles.range}
                                    />
                                </div>

                                <div style={styles.simGroup}>
                                    <label style={styles.simLabel}>
                                        {t('home.simulator.duration')} : <span style={styles.simValue}>{duration} {t('home.simulator.months')} ({Math.floor(duration / 12)} {t('home.simulator.years')})</span>
                                    </label>
                                    <input
                                        type="range" min="12" max="360" step="12"
                                        value={duration} onChange={(e) => setDuration(Number(e.target.value))}
                                        style={styles.range}
                                    />
                                </div>

                                <div style={styles.simGroup}>
                                    <label style={styles.simLabel}>
                                        {t('home.simulator.rate')} : <span style={styles.simValue}>{interestRate}%</span>
                                    </label>
                                    <select
                                        value={interestRate}
                                        onChange={(e) => setInterestRate(Number(e.target.value))}
                                        style={styles.simSelect}
                                    >
                                        {rates.map(r => <option key={r} value={r}>{r}%</option>)}
                                    </select>
                                </div>

                                <div style={styles.simResults}>
                                    <div style={styles.simResultItem}>
                                        <span style={styles.simResLabel}>{t('home.simulator.rate_type')}</span>
                                        <span style={styles.simResVal}>{t('home.simulator.fixed')}</span>
                                    </div>
                                    <div style={styles.simResultItem}>
                                        <span style={styles.simResLabel}>{t('home.simulator.monthly_payment')}</span>
                                        <span style={styles.simResValHighlight}>{monthlyPayment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €</span>
                                    </div>
                                </div>

                                <Link
                                    to={getPath('/credit-request')}
                                    state={{ amount, duration, interestRate }}
                                    style={styles.simBtn}
                                >
                                    {t('home.simulator.submit')}
                                </Link>
                                <p style={styles.simDisclaimer}>{t('home.simulator.disclaimer')}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={styles.dots}>
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            style={{
                                ...styles.dot,
                                backgroundColor: currentSlide === index ? '#00ccff' : 'rgba(255,255,255,0.3)',
                                width: currentSlide === index ? '40px' : '10px'
                            }}
                        />
                    ))}
                </div>
            </section>

            {/* Removed redundant mobile markers as we use a separate component */}

            {/* Features Info Section */}
            <section style={styles.infoSection} className="info-section">
                <div className="container">
                    <div style={styles.infoGrid} className="info-grid">
                        <div className="info-card">
                            <div className="icon-circle">🛡️</div>
                            <h3 style={styles.infoTitle}>{t('home.features.security.title')}</h3>
                            <p style={styles.infoText}>{t('home.features.security.text')}</p>
                        </div>
                        <div className="info-card">
                            <div className="icon-circle">📞</div>
                            <h3 style={styles.infoTitle}>{t('home.features.support.title')}</h3>
                            <p style={styles.infoText}>{t('home.features.support.text')}</p>
                        </div>
                        <div className="info-card">
                            <div className="icon-circle">💸</div>
                            <h3 style={styles.infoTitle}>{t('home.features.fees.title')}</h3>
                            <p style={styles.infoText}>{t('home.features.fees.text')}</p>
                        </div>
                        <div className="info-card">
                            <div className="icon-circle">⏱️</div>
                            <h3 style={styles.infoTitle}>{t('home.features.speed.title')}</h3>
                            <p style={styles.infoText}>{t('home.features.speed.text')}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section style={styles.aboutSection} className="about-section">
                <div style={styles.aboutContainer} className="container about-container">
                    <div style={styles.aboutImageWrapper} className="about-image-wrapper">
                        <div className="dot-pattern"></div>
                        <img src="/about-meeting-pro.png" alt="About" style={styles.aboutImage} className="about-image" />
                        <div style={styles.reviewBadge} className="review-badge">★★★★★<br />{t('home.about.badge_review')}</div>
                        <div style={styles.experienceBadge} className="experience-badge">
                            <span style={styles.experienceNumber}>15</span>
                            <span style={styles.experienceText}>{t('home.about.badge_exp')}</span>
                        </div>
                    </div>
                    <div style={styles.aboutContent} className="about-content">
                        <div style={styles.aboutLabel}>{t('home.about.label')}</div>
                        <h2 style={styles.aboutTitle}>{t('home.about.title')}</h2>
                        <p style={styles.aboutText}>
                            {t('home.about.p1')}
                        </p>
                        <p style={styles.aboutText}>
                            {t('home.about.p2')}
                        </p>
                        <p style={styles.aboutText}>
                            {t('home.about.p3')}
                            <br /><br />
                            <strong>{t('home.about.highlight')}</strong>
                        </p>
                        <Link to={getPath('/about')} style={styles.primaryButton}>{t('home.about.cta')}</Link>
                    </div>
                </div>
            </section>

            {/* Removed mobile markers */}

            {/* Services Section - 8 CARDS */}
            <section style={styles.servicesSection} className="services-section">
                <div className="container">
                    <div style={styles.servicesHeader}>
                        <h2 style={styles.sectionTitle}>{t('home.services.title')}</h2>
                        <p style={styles.sectionSubtitle}>{t('home.services.subtitle')}</p>
                    </div>
                    <div style={styles.servicesGrid} className="servicesGrid">
                        {services.map((s, i) => (
                            <div key={i} className="service-card">
                                <div style={styles.serviceCardContent}>
                                    <div style={styles.serviceCardText}>
                                        <h3>{s.title}</h3>
                                        <ul>{s.features.map((f, fi) => <li key={fi}>{f}</li>)}</ul>
                                    </div>
                                    <div className="service-icon-wrapper-large">
                                        <span className="service-icon-floating-large">{s.icon}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section - HORIZONTAL AUTO-SLIDER */}
            <section style={styles.testimonialsSection}>
                <div className="container">
                    <div style={styles.testimonialsHeader}>
                        <div style={styles.testimonialsLabel}>{t('home.testimonials.label')}</div>
                        <h2 style={styles.testimonialsTitle}>{t('home.testimonials.title')}</h2>
                    </div>
                </div>


                <div style={styles.testiSliderContainer}>
                    <div style={styles.testiTrack}>
                        {/* Double the list for infinite scroll effect */}
                        {[...testimonials, ...testimonials].map((t, i) => (
                            <Link key={i} to={getPath('/reviews')} style={{ ...styles.testimonialCardSlider, textDecoration: 'none', color: 'inherit', display: 'block' }}>
                                <div style={styles.tAvatar}>
                                    <img src={t.image} alt={t.name} style={styles.tImg} />
                                </div>
                                <h4 style={{ color: '#003366', margin: '0.5rem 0' }}>{t.name}</h4>
                                <p style={{ fontSize: '0.85rem', color: '#666' }}>{t.role}</p>
                                <div style={styles.stars}>★★★★★</div>
                                <p style={styles.testimonialText}>"{t.text}"</p>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

const styles = {
    page: { minHeight: '100vh', backgroundColor: '#fff' },
    hero: { position: 'relative', height: '850px', backgroundColor: '#000', overflow: 'hidden' },
    slide: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundSize: 'cover', backgroundPosition: 'center 20%', transition: 'opacity 1s ease-in-out', zIndex: 1 },
    overlay: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 5, 20, 0.75)', zIndex: 2, display: 'flex', alignItems: 'center' },
    heroSplit: { display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '4rem', alignItems: 'center' },
    heroLeft: { color: 'white' },
    heroTitle: { fontSize: '4.5rem', fontWeight: '900', lineHeight: '1.1', marginBottom: '2rem', letterSpacing: '-0.02em', color: '#FFFFFF', textShadow: '0 4px 10px rgba(0,0,0,0.3)' },
    heroSubtitle: { fontSize: '1.4rem', color: 'rgba(255,255,255,0.9)', marginBottom: '3rem', maxWidth: '650px', fontWeight: '400' },
    heroButtons: { display: 'flex', gap: '1.5rem' },
    primaryButton: {
        background: 'linear-gradient(135deg, #00ccff 0%, #0099cc 100%)',
        color: 'white',
        padding: '1.2rem 2.5rem',
        borderRadius: '50px',
        textDecoration: 'none',
        fontWeight: '800',
        fontSize: '1.1rem',
        boxShadow: '0 10px 20px rgba(0, 204, 255, 0.3)',
        transition: 'all 0.3s ease'
    },
    secondaryButton: {
        border: '2px solid rgba(255,255,255,0.5)',
        color: 'white',
        padding: '1.2rem 2.5rem',
        borderRadius: '50px',
        textDecoration: 'none',
        fontWeight: '800',
        fontSize: '1.1rem',
        backdropFilter: 'blur(10px)',
        transition: 'all 0.3s ease'
    },
    heroRight: { display: 'flex', justifyContent: 'flex-end' },
    simulatorBox: {
        width: '100%',
        maxWidth: '450px',
        padding: '3rem',
        borderRadius: '32px'
    },
    simTitle: { fontSize: '1.6rem', color: '#003366', fontWeight: '800', marginBottom: '0.5rem' },
    simSubtitle: { color: '#666', fontSize: '0.9rem', marginBottom: '1.5rem' },
    simGroup: { marginBottom: '1.5rem' },
    simLabel: { display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#333', marginBottom: '0.5rem' },
    simValue: { float: 'right', color: '#003366', fontWeight: '800' },
    range: { width: '100%', accentColor: '#003366' },
    simSelect: {
        width: '100%',
        padding: '0.8rem',
        borderRadius: '12px',
        border: '1px solid #ddd',
        backgroundColor: '#fff',
        color: '#333',
        fontWeight: '600',
        fontSize: '0.9rem',
        outline: 'none',
        cursor: 'pointer',
        appearance: 'none',
        backgroundImage: 'linear-gradient(45deg, transparent 50%, #003366 50%), linear-gradient(135deg, #003366 50%, transparent 50%)',
        backgroundPosition: 'calc(100% - 20px) calc(1em + 2px), calc(100% - 15px) calc(1em + 2px)',
        backgroundSize: '5px 5px, 5px 5px',
        backgroundRepeat: 'no-repeat'
    },
    simResults: { display: 'flex', justifyContent: 'space-between', backgroundColor: '#f0f7ff', padding: '1.2rem', borderRadius: '12px', marginBottom: '1.5rem' },
    simResultItem: { display: 'flex', flexDirection: 'column' },
    simResLabel: { fontSize: '0.65rem', color: '#888', textTransform: 'uppercase' },
    simResVal: { fontWeight: '800' },
    simResValHighlight: { fontSize: '1.3rem', fontWeight: '900', color: '#00ccff' },
    simBtn: { display: 'block', padding: '1rem', backgroundColor: '#003366', color: 'white', textDecoration: 'none', textAlign: 'center', borderRadius: '12px', fontWeight: '800' },
    simDisclaimer: { textAlign: 'center', fontSize: '0.7rem', color: '#999', marginTop: '0.8rem' },
    dots: { position: 'absolute', bottom: '40px', left: '10%', display: 'flex', gap: '0.8rem', zIndex: 10 },
    dot: { height: '10px', borderRadius: '10px', transition: 'all 0.3s ease', border: 'none', cursor: 'pointer' },
    infoSection: { padding: '6rem 0', backgroundColor: '#f8f9fa' },
    infoGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' },
    infoTitle: { color: '#003366', fontSize: '1.1rem', margin: '1rem 0', fontWeight: '700' },
    infoText: { color: '#666', fontSize: '0.9rem', lineHeight: '1.6' },
    aboutSection: { padding: '7rem 0', overflow: 'hidden' },
    aboutContainer: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '4rem', alignItems: 'center' },
    aboutImageWrapper: { position: 'relative' },
    aboutImage: { width: '100%', borderRadius: '12px' },
    reviewBadge: { position: 'absolute', top: '20px', left: '-10px', backgroundColor: 'white', padding: '1rem', borderRadius: '8px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)', fontWeight: '700', color: '#f4c150' },
    experienceBadge: { position: 'absolute', bottom: '-20px', right: '-20px', width: '120px', height: '120px', backgroundColor: '#00ccff', borderRadius: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white' },
    experienceNumber: { fontSize: '2.5rem', fontWeight: '900' },
    experienceText: { fontSize: '0.7rem', fontWeight: '600' },
    aboutLabel: { color: '#00ccff', fontWeight: '800', marginBottom: '1rem' },
    aboutTitle: { fontSize: '2.2rem', color: '#003366', fontWeight: '800', marginBottom: '1.5rem' },
    aboutText: { color: '#555', marginBottom: '1.5rem', lineHeight: '1.7' },
    servicesSection: { padding: '7rem 0', backgroundColor: '#f4f7fa' },
    servicesHeader: { textAlign: 'center', marginBottom: '4rem' },
    sectionTitle: { fontSize: '2.5rem', color: '#003366', fontWeight: '800' },
    sectionSubtitle: { color: '#666' },
    servicesGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' },
    serviceCardContent: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', gap: '1rem' },
    serviceCardText: { flex: 1 },

    testimonialsSection: { padding: '7rem 0', overflow: 'hidden' },
    testimonialsHeader: { textAlign: 'center', marginBottom: '4rem' },
    testimonialsLabel: { color: '#00ccff', fontWeight: '800' },
    testimonialsTitle: { fontSize: '2.5rem', color: '#003366', fontWeight: '800' },

    // Slider Styles
    testiSliderContainer: { width: '100%', overflow: 'hidden', padding: '2rem 0' },
    testiTrack: {
        display: 'flex',
        width: 'fit-content',
        animation: 'scrollTestimonials 60s linear infinite',
        gap: '2rem'
    },
    testimonialCardSlider: {
        flex: '0 0 380px',
        backgroundColor: '#fcfcfc',
        padding: '2.5rem',
        borderRadius: '24px',
        textAlign: 'center',
        border: '1px solid #eee'
    },

    tAvatar: { width: '80px', height: '80px', margin: '0 auto 1.5rem', borderRadius: '50%', overflow: 'hidden', border: '3px solid #00ccff' },
    tImg: { width: '100%', height: '100%', objectFit: 'cover' },
    stars: { color: '#f4c150', margin: '0.5rem 0' },
    testimonialText: { color: '#555', fontStyle: 'italic', lineHeight: '1.6', marginTop: '1rem' }
};

export default Home;
