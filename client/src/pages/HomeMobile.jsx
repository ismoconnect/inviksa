import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const HomeMobile = () => {
    const { t, i18n } = useTranslation();
    const currentLang = i18n.language;
    const getPath = (path) => `/${currentLang}${path}`;

    const [currentSlide, setCurrentSlide] = useState(0);

    const slides = [
        {
            image: '/mobile-hero-1.png',
            title: t('home.hero.title'),
            subtitle: t('home.hero.subtitle')
        },
        {
            image: '/mobile-hero-bg.png',
            title: t('home.slides.1.title'),
            subtitle: t('home.slides.1.subtitle')
        },
        {
            image: '/mobile-hero-person.png',
            title: t('home.slides.2.title'),
            subtitle: t('home.slides.2.subtitle')
        }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 6000);
        return () => clearInterval(interval);
    }, [slides.length]);

    // --- Simulator State & Logic ---
    const [amount, setAmount] = useState(150000);
    const [duration, setDuration] = useState(120);
    const [interestRate, setInterestRate] = useState(2.99);
    const [monthlyPayment, setMonthlyPayment] = useState(0);

    const rates = [1.99, 2.50, 2.99, 3.50, 3.99, 4.50, 4.99, 5.50, 5.99, 6.50, 7.00];

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
        }
    ];

    const testimonialImages = [
        "/avatar-male-pro.png", "/avatar-female-pro.png", "/avatar-male-pro.png",
        "/avatar-female-pro.png", "/avatar-male-pro.png", "/avatar-female-pro.png"
    ];

    const testimonialData = t('home.testimonials.items', { returnObjects: true });
    const testimonials = Array.isArray(testimonialData) ? testimonialData.map((item, index) => ({
        ...item,
        image: testimonialImages[index] || "/avatar-male.png"
    })) : [];

    // --- Scroll Reveal Logic ---
    useEffect(() => {
        const observerOptions = {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, observerOptions);

        const revealElements = document.querySelectorAll('[class*="reveal-"]');
        revealElements.forEach(el => observer.observe(el));

        return () => revealElements.forEach(el => observer.unobserve(el));
    }, []);

    return (
        <div className="mobile-only" style={styles.mobilePage}>
            {/* 1. HERO SECTION */}
            <section className="mobile-hero-slider" style={styles.hero}>
                {slides.map((slide, index) => (
                    <div
                        key={index}
                        style={{
                            ...styles.slide,
                            backgroundImage: `url(${slide.image})`,
                            opacity: currentSlide === index ? 1 : 0,
                            zIndex: currentSlide === index ? 1 : 0
                        }}
                    >
                        <div style={styles.heroOverlay}></div>
                        <div style={styles.heroContent} className={currentSlide === index ? "fadeInUp" : ""}>
                            <h1 style={styles.heroTitle}>{slide.title}</h1>
                            <p style={styles.heroSubtitle}>{slide.subtitle}</p>
                            <div style={styles.heroActions}>
                                <Link to={getPath('/register')} style={styles.primaryBtn}>{t('home.hero.cta_primary')}</Link>
                                <Link to={getPath('/services')} style={styles.secondaryBtn}>{t('home.hero.cta_secondary')}</Link>
                            </div>
                        </div>
                    </div>
                ))}
            </section>

            {/* 2. QUICK STATS */}
            <section style={styles.quickStats} className="reveal-up">
                <div style={styles.statBox}>
                    <span style={styles.statIcon}>🛡️</span>
                    <span style={styles.statLabel}>{t('home.features.security.title')}</span>
                </div>
                <div style={styles.statBox}>
                    <span style={styles.statIcon}>📞</span>
                    <span style={styles.statLabel}>{t('home.features.support.title')}</span>
                </div>
                <div style={styles.statBox}>
                    <span style={styles.statIcon}>⏱️</span>
                    <span style={styles.statLabel}>{t('home.features.speed.title')}</span>
                </div>
            </section>

            {/* 3. SIMULATOR SECTION */}
            {/* 3. SIMULATOR SECTION */}
            <section style={styles.simSection} className="reveal-up">
                <style>
                    {`
                        .mobile-range {
                            -webkit-appearance: none;
                            width: 100%;
                            height: 6px;
                            background: #eef2f7;
                            border-radius: 10px;
                            outline: none;
                        }
                        .mobile-range::-webkit-slider-thumb {
                            -webkit-appearance: none;
                            appearance: none;
                            width: 26px;
                            height: 26px;
                            background: #ffffff;
                            border: 4px solid #003366;
                            border-radius: 50%;
                            cursor: pointer;
                            box-shadow: 0 4px 10px rgba(0, 51, 102, 0.15);
                        }
                        .mobile-range::-moz-range-thumb {
                            width: 26px;
                            height: 26px;
                            background: #ffffff;
                            border: 4px solid #003366;
                            border-radius: 50%;
                            cursor: pointer;
                        }
                    `}
                </style>
                <div style={styles.sectionHeader}>
                    <div style={styles.sectionLabel}>{t('home.simulator.label') || 'Simulateur'}</div>
                    <h2 style={styles.sectionTitle}>{t('home.simulator.title')}</h2>
                    <p style={styles.sectionSubtitle}>{t('home.simulator.subtitle')}</p>
                </div>
                <div style={styles.simCard}>
                    <div style={styles.inputGroup}>
                        <div style={styles.labelRow}>
                            <label style={styles.label}>{t('home.simulator.amount')}</label>
                            <span style={styles.labelValue}>{amount.toLocaleString()} €</span>
                        </div>
                        <input
                            type="range" min="5000" max="900000" step="5000"
                            value={amount} onChange={(e) => setAmount(Number(e.target.value))}
                            className="mobile-range"
                        />
                    </div>
                    <div style={styles.inputGroup}>
                        <div style={styles.labelRow}>
                            <label style={styles.label}>{t('home.simulator.duration')}</label>
                            <span style={styles.labelValue}>{duration} {t('home.simulator.months')}</span>
                        </div>
                        <input
                            type="range" min="12" max="360" step="12"
                            value={duration} onChange={(e) => setDuration(Number(e.target.value))}
                            className="mobile-range"
                        />
                    </div>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>{t('home.simulator.rate')}</label>
                        <div style={styles.selectWrapper}>
                            <select
                                value={interestRate}
                                onChange={(e) => setInterestRate(Number(e.target.value))}
                                style={styles.simSelect}
                            >
                                {rates.map(r => <option key={r} value={r}>{r}%</option>)}
                            </select>
                        </div>
                    </div>

                    <div style={styles.resultsContainer}>
                        <span style={styles.resLabel}>{t('home.simulator.monthly_payment')}</span>
                        <div style={styles.resValue}>
                            {monthlyPayment.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                            <span style={styles.currency}> €</span>
                            <span style={styles.perMonth}>/mois</span>
                        </div>
                    </div>

                    <Link to={getPath('/credit-request')} state={{ amount, duration, interestRate }} style={styles.simSubmit}>
                        {t('home.simulator.submit')}
                    </Link>
                </div>
            </section>

            {/* 4. SERVICES SECTION */}
            <section style={styles.servicesSection}>
                <style>
                    {`
                        .service-card-hover {
                            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
                            position: relative;
                            overflow: hidden;
                        }
                        .service-card-hover:hover, .service-card-hover:active {
                            transform: translateY(-8px) scale(1.02);
                            box-shadow: 0 20px 40px rgba(0, 51, 102, 0.12) !important;
                            border-color: #00ccff !important;
                        }
                        .service-card-hover::after {
                            content: '';
                            position: absolute;
                            top: 0;
                            left: -100%;
                            width: 100%;
                            height: 100%;
                            background: linear-gradient(
                                90deg,
                                transparent,
                                rgba(255, 255, 255, 0.2),
                                transparent
                            );
                            transition: 0.5s;
                        }
                        .service-card-hover:hover::after {
                            left: 100%;
                        }
                        .feature-check {
                            color: #00ccff;
                            margin-right: 10px;
                            font-weight: bold;
                        }
                    `}
                </style>
                <div style={styles.sectionHeader}>
                    <div style={styles.sectionLabel}>{t('home.services.label') || 'Expertises'}</div>
                    <h2 style={styles.sectionTitle} className="reveal-up">{t('home.services.title')}</h2>
                    <p style={styles.sectionSubtitle} className="reveal-up delay-1">{t('home.services.subtitle')}</p>
                </div>
                <div style={styles.servicesGrid}>
                    {services.map((s, i) => (
                        <div key={i} style={styles.serviceItem} className={`service-card-hover reveal-up delay-${(i % 3) + 1}`}>
                            <div style={styles.serviceHeader}>
                                <div style={styles.serviceIconWrap}>
                                    <span style={styles.serviceIcon}>{s.icon}</span>
                                </div>
                                <h3 style={styles.serviceLabel}>{s.title}</h3>
                            </div>
                            <div style={styles.serviceDivider}></div>
                            <ul style={styles.featuresList}>
                                {Array.isArray(s.features) && s.features.map((f, fi) => (
                                    <li key={fi} style={styles.featureItem}>
                                        <span className="feature-check">✓</span>
                                        {f}
                                    </li>
                                ))}
                            </ul>
                            <div style={styles.serviceFooter}>
                                <Link to={getPath('/services')} style={styles.learnMore}>
                                    {t('common.learn_more') || 'En savoir plus'} →
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* 5. FEATURES INFO */}
            <section style={styles.infoSection}>
                <div style={styles.infoGrid}>
                    <div style={styles.infoCard}>
                        <h3>{t('home.features.security.title')}</h3>
                        <p>{t('home.features.security.text')}</p>
                    </div>
                    <div style={styles.infoCard}>
                        <h3>{t('home.features.fees.title')}</h3>
                        <p>{t('home.features.fees.text')}</p>
                    </div>
                </div>
            </section>

            {/* 6. ABOUT SECTION */}
            <section style={styles.aboutMini} className="reveal-up">
                <div style={styles.aboutImgContainer} className="reveal-scale">
                    <img src="/mobile-about-pro.png" alt="Expertise" style={styles.aboutImg} />
                </div>
                <div style={styles.aboutLabel}>{t('home.about.label')}</div>
                <h2 style={styles.aboutTitle}>{t('home.about.title')}</h2>
                <div style={styles.aboutContentBody}>
                    <p style={styles.aboutText}>{t('home.about.p1')}</p>
                    <p style={styles.aboutText}>{t('home.about.p2')}</p>
                    <p style={styles.aboutTextHighlight}><strong>{t('home.about.highlight')}</strong></p>
                </div>
                <Link to={getPath('/about')} style={styles.aboutLink}>{t('home.about.cta')}</Link>
            </section>

            {/* 7. TESTIMONIALS */}
            <section style={styles.testimonialsSection} className="reveal-up">
                <h2 style={styles.sectionTitle}>{t('home.testimonials.title')}</h2>
                <div style={styles.testimonialTrack}>
                    {testimonials.slice(0, 3).map((t, i) => (
                        <div key={i} style={styles.testimonialCard} className={`reveal-right delay-${i + 1}`}>
                            <img src={t.image} alt={t.name} style={styles.tAvatar} />
                            <h4 style={styles.tName}>{t.name}</h4>
                            <p style={styles.tRole}>{t.role}</p>
                            <p style={styles.tText}>"{t.text}"</p>
                        </div>
                    ))}
                </div>
                <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                    <Link to={getPath('/reviews')} style={styles.viewMoreBtn}>{t('common.view_more') || 'Voir plus'}</Link>
                </div>
            </section>
        </div>
    );
};

const styles = {
    mobilePage: {
        backgroundColor: '#fff',
        overflowX: 'hidden'
    },
    hero: {
        height: '80dvh',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#fff'
    },
    slide: {
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        textAlign: 'center',
        transition: 'opacity 0.6s ease-in-out',
        willChange: 'opacity',
        filter: 'none',
        WebkitFilter: 'none'
    },
    heroOverlay: {
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        background: 'transparent', // Completely transparent for maximum visibility
        zIndex: 1
    },
    heroContent: {
        position: 'relative',
        zIndex: 5,
        width: '90%',
        padding: '1.5rem 1rem', // Reduced padding
        backgroundColor: 'transparent',
        border: '2px solid rgba(255, 255, 255, 0.8)',
        borderRadius: '30px',
        margin: '20px auto 0',
        textAlign: 'center',
        backdropFilter: 'none'
    },
    heroTitle: {
        fontSize: '1.85rem', // Reduced font size
        fontWeight: '900',
        color: '#fff',
        lineHeight: '1.2',
        marginBottom: '1rem',
        textShadow: `
            2px 2px 0 #000,
            -2px -2px 0 #000,
            2px -2px 0 #000,
            -2px 2px 0 #000,
            0px 2px 10px rgba(0,0,0,0.8)
        `
    },
    heroSubtitle: {
        fontSize: '0.9rem', // Reduced font size
        color: '#fff',
        marginBottom: '2rem',
        lineHeight: '1.5',
        maxWidth: '100%',
        margin: '0 auto 2rem',
        fontWeight: '700',
        textShadow: `
            1.5px 1.5px 0 #000,
            -1.5px -1.5px 0 #000,
            1.5px -1.5px 0 #000,
            -1.5px 1.5px 0 #000
        `
    },
    heroActions: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.8rem',
        maxWidth: '260px',
        margin: '0 auto'
    },
    primaryBtn: {
        background: 'linear-gradient(135deg, #00ccff 0%, #0099cc 100%)',
        color: 'white',
        padding: '1rem',
        borderRadius: '50px',
        fontWeight: '800',
        textDecoration: 'none',
        fontSize: '0.95rem',
        boxShadow: '0 10px 25px rgba(0,204,255,0.3)'
    },
    secondaryBtn: {
        border: '1.5px solid rgba(255,255,255,0.5)',
        color: 'white',
        padding: '0.9rem',
        borderRadius: '50px',
        fontWeight: '800',
        textDecoration: 'none',
        fontSize: '0.95rem',
        background: 'rgba(255,255,255,0.1)',
        backdropFilter: 'blur(5px)'
    },
    quickStats: {
        display: 'flex',
        justifyContent: 'space-around',
        padding: '1.5rem 1rem',
        backgroundColor: 'white',
        marginTop: '-2.5rem',
        position: 'relative',
        zIndex: 11,
        margin: '0 1.2rem',
        borderRadius: '24px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.12)'
    },
    statBox: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.4rem'
    },
    statIcon: { fontSize: '1.4rem' },
    statLabel: { fontSize: '0.65rem', fontWeight: '800', color: '#003366', textTransform: 'uppercase', letterSpacing: '0.5px' },
    simSection: { padding: '5rem 1.5rem', backgroundColor: '#f0f5fa' },
    sectionHeader: { textAlign: 'center', marginBottom: '3rem' },
    sectionLabel: { color: '#00ccff', fontWeight: '900', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '1.5px', marginBottom: '0.5rem' },
    sectionTitle: { fontSize: '2.1rem', color: '#003366', fontWeight: '900', marginBottom: '0.8rem', lineHeight: '1.2' },
    sectionSubtitle: { color: '#6b7280', fontSize: '1rem', maxWidth: '320px', margin: '0 auto', lineHeight: '1.5' },
    simCard: {
        padding: '2.5rem 1.8rem',
        borderRadius: '32px',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        boxShadow: '0 25px 60px rgba(0,51,102,0.12)',
        border: '1px solid #fff',
        backdropFilter: 'blur(10px)'
    },
    inputGroup: { marginBottom: '2.2rem' },
    labelRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '0.8rem' },
    label: { fontSize: '0.75rem', color: '#6b7280', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' },
    labelValue: { fontSize: '1.2rem', color: '#003366', fontWeight: '900' },
    selectWrapper: { position: 'relative', marginTop: '0.5rem' },
    simSelect: {
        width: '100%',
        padding: '1.1rem 1.2rem',
        borderRadius: '16px',
        border: '2px solid #eef2f7',
        backgroundColor: '#fff',
        color: '#003366',
        fontWeight: '800',
        fontSize: '1.1rem',
        appearance: 'none',
        backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23003366%22%20stroke-width%3D%223%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E")',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 1.2rem center',
        transition: 'all 0.3s ease'
    },
    resultsContainer: {
        background: 'linear-gradient(135deg, #003366 0%, #001a33 100%)',
        padding: '2.2rem 1.5rem',
        borderRadius: '24px',
        marginBottom: '2rem',
        textAlign: 'center',
        boxShadow: '0 15px 35px rgba(0,51,102,0.25)',
        color: '#fff'
    },
    resLabel: { fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1.5px', display: 'block', marginBottom: '0.8rem' },
    resValue: { fontSize: '2.8rem', color: '#fff', fontWeight: '900', lineHeight: '1' },
    currency: { fontSize: '1.5rem', verticalAlign: 'top', marginLeft: '2px' },
    perMonth: { fontSize: '1rem', color: 'rgba(255,255,255,0.6)', fontWeight: '600' },
    simSubmit: {
        display: 'block',
        background: 'linear-gradient(135deg, #00ccff 0%, #0099cc 100%)',
        color: 'white',
        padding: '1.3rem',
        textAlign: 'center',
        borderRadius: '50px',
        fontWeight: '900',
        textDecoration: 'none',
        fontSize: '1.1rem',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        boxShadow: '0 12px 25px rgba(0,204,255,0.3)',
        transition: 'all 0.3s ease'
    },
    servicesSection: { padding: '5rem 1.2rem', backgroundColor: '#fff' },
    servicesGrid: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        marginTop: '3rem'
    },
    serviceItem: {
        backgroundColor: '#fff',
        padding: '2.5rem 1.8rem',
        borderRadius: '32px',
        border: '1.5px solid #f0f3f6',
        boxShadow: '0 15px 40px rgba(0,0,0,0.06)',
        position: 'relative',
        transition: 'all 0.4s ease',
        backgroundImage: 'radial-gradient(circle at top right, rgba(0, 204, 255, 0.03) 0%, transparent 40%)'
    },
    serviceHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '1.2rem',
        marginBottom: '1.5rem'
    },
    serviceIconWrap: {
        width: '55px',
        height: '55px',
        background: 'linear-gradient(135deg, #f0faff 0%, #e6f7ff 100%)',
        borderRadius: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid #e6f7ff'
    },
    serviceIcon: { fontSize: '1.8rem' },
    serviceLabel: { fontSize: '1.25rem', fontWeight: '900', color: '#003366', margin: 0 },
    serviceDivider: {
        height: '1px',
        background: 'linear-gradient(90deg, #f0f3f6 0%, transparent 100%)',
        marginBottom: '1.5rem'
    },
    featuresList: { listStyle: 'none', padding: 0, margin: '0 0 2rem 0' },
    featureItem: {
        fontSize: '0.95rem',
        color: '#4b5563',
        marginBottom: '1rem',
        lineHeight: '1.5',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
    },
    serviceFooter: {
        display: 'flex',
        justifyContent: 'flex-end'
    },
    learnMore: {
        fontSize: '0.85rem',
        color: '#00ccff',
        fontWeight: '800',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        textDecoration: 'none'
    },
    infoSection: { padding: '2rem 1.2rem', backgroundColor: '#f9faff' },
    infoGrid: { display: 'flex', flexDirection: 'column', gap: '1rem' },
    infoCard: {
        padding: '1.5rem',
        backgroundColor: 'white',
        borderRadius: '16px',
        borderLeft: '4px solid #00ccff'
    },
    aboutMini: { padding: '5rem 1.5rem', textAlign: 'center' },
    aboutImgContainer: { marginBottom: '2.5rem', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' },
    aboutImg: { width: '100%', display: 'block' },
    aboutLabel: { color: '#00ccff', fontWeight: '900', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '1px', marginBottom: '0.8rem' },
    aboutTitle: { fontSize: '1.8rem', color: '#003366', fontWeight: '900', marginBottom: '1.5rem', lineHeight: '1.3' },
    aboutContentBody: { textAlign: 'left', marginBottom: '2.5rem' },
    aboutText: { color: '#555', lineHeight: '1.7', marginBottom: '1rem', fontSize: '0.95rem' },
    aboutTextHighlight: { color: '#003366', fontSize: '1rem' },
    aboutLink: {
        display: 'inline-block',
        backgroundColor: '#00ccff',
        color: 'white',
        padding: '1.1rem 2.8rem',
        borderRadius: '50px',
        fontWeight: '800',
        textDecoration: 'none',
        boxShadow: '0 10px 20px rgba(0,204,255,0.2)'
    },
    testimonialsSection: { padding: '5rem 1.2rem', backgroundColor: '#f4f8fb' },
    testimonialTrack: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        marginTop: '2.5rem'
    },
    testimonialCard: {
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '24px',
        textAlign: 'center',
        boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
    },
    tAvatar: { width: '70px', height: '70px', borderRadius: '50%', border: '3px solid #00ccff', marginBottom: '1rem' },
    tName: { fontSize: '1.1rem', color: '#003366', fontWeight: '800', marginBottom: '0.2rem' },
    tRole: { fontSize: '0.8rem', color: '#888', marginBottom: '1rem' },
    tText: { fontSize: '0.9rem', color: '#555', fontStyle: 'italic', lineHeight: '1.6' },
    viewMoreBtn: {
        color: '#0099cc',
        fontWeight: '800',
        textDecoration: 'none',
        fontSize: '1rem',
        borderBottom: '2px solid'
    }
};

export default HomeMobile;
