import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Services = () => {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const currentLang = i18n.language;
    const getPath = (path) => `/${currentLang}${path}`;

    // Static assets mapping based on ID
    const serviceAssets = {
        5: { image: "/service/service-5.jpg", icon: "🏠" },
        4: { image: "/service/service-4.jpg", icon: "📈" },
        1: { image: "/service/service-1.jpg", icon: "💳" },
        2: { image: "/service/service-2.jpg", icon: "🌍" },
        6: { image: "/service/service-6.jpg", icon: "🛡️" },
        3: { image: "/service/service-3.jpg", icon: "💼" }
    };

    const servicesData = t('services_page.services_list', { returnObjects: true });

    // Merge translation data with assets
    const services = Array.isArray(servicesData) ? servicesData.map(service => ({
        ...service,
        items: service.features, // translation uses 'features' key, component uses features
        ...serviceAssets[service.id]
    })) : [];

    const handleNavigate = (path) => {
        navigate(getPath(path));
    };

    const handleServiceAction = (id) => {
        if (id >= 1 && id <= 4) {
            handleNavigate('/register');
        } else if (id === 5) {
            handleNavigate('/credit-request');
        } else {
            handleNavigate('/contact');
        }
    };

    return (
        <div style={styles.page}>
            {/* Hero Section */}
            <section style={styles.hero} className="services-hero services-hero-mobile">
                <div style={styles.heroOverlay}>
                    <div className="container">
                        <h1 style={styles.heroTitle}>{t('services_page.hero.title')}</h1>
                        <p style={styles.heroSubtitle}>{t('services_page.hero.subtitle')}</p>
                    </div>
                </div>
            </section>

            {/* Services Sections */}
            {/* Navigation Anchor Buttons */}
            <div style={styles.navContainer} className="services-nav-sticky">
                <div className="container no-scrollbar nav-grid-mobile" style={styles.navGrid}>
                    {services.map((service) => (
                        <button
                            key={service.id}
                            onClick={() => {
                                const element = document.getElementById(`service-${service.id}`);
                                if (element) {
                                    const offset = 100; // Header height offset
                                    const elementPosition = element.getBoundingClientRect().top;
                                    const offsetPosition = elementPosition + window.pageYOffset - offset;
                                    window.scrollTo({
                                        top: offsetPosition,
                                        behavior: "smooth"
                                    });
                                }
                            }}
                            className="nav-button-hover nav-button-mobile"
                            style={styles.navButton}
                        >
                            <span style={styles.navIcon}>{service.icon}</span>
                            <span style={styles.navText}>{service.title}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="container services-list-container" style={{ padding: '4rem 2rem' }}>
                <style>
                    {`
                        @media (max-width: 768px) {
                            .service-top-split {
                                flex-direction: column !important;
                            }
                            .service-image-wrapper {
                                width: 100% !important;
                                height: 250px !important;
                            }
                            .service-content-wrapper {
                                width: 100% !important;
                                padding: 2rem 0 !important;
                            }
                            .services-list-container {
                                padding: 2rem 0.2rem !important;
                            }
                            .use-cases-section-mobile {
                                padding: 0.8rem 0.2rem !important;
                                border-radius: 8px !important;
                                margin-bottom: 0.8rem !important;
                            }
                            .use-case-card-mobile {
                                padding: 0.5rem !important;
                                border-radius: 8px !important;
                            }
                            .use-cases-grid {
                                grid-template-columns: 1fr !important;
                                gap: 0.5rem !important;
                            }
                            .nav-grid-mobile {
                                flex-wrap: wrap !important;
                                justify-content: center !important;
                                gap: 0.4rem !important;
                                padding: 0.4rem !important;
                                overflow-x: hidden !important;
                            }
                            .nav-button-mobile {
                                width: calc(50% - 0.5rem) !important;
                                flex-shrink: 1 !important;
                                padding: 0.6rem 0.6rem !important;
                                font-size: 0.75rem !important;
                                font-weight: 800 !important;
                                justify-content: center !important;
                                white-space: normal !important;
                                text-align: center !important;
                                height: 60px !important;
                                background: linear-gradient(135deg, #f0f7ff 0%, #e1efff 100%) !important;
                                border: 1px solid rgba(0, 82, 204, 0.1) !important;
                                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05) !important;
                            }
                            .nav-button-mobile span {
                                font-size: 0.9rem !important;
                            }
                            .services-hero-mobile {
                                min-height: 160px !important;
                            }
                            .services-hero-mobile h1 {
                                font-size: 1.3rem !important;
                            }
                            .about-hero-mobile h1 {
                                font-size: 1.3rem !important;
                            }
                        }
                        .use-case-hover:hover {
                            background-color: rgba(255, 255, 255, 0.15) !important;
                            transform: translateY(-5px);
                            border-color: rgba(255, 255, 255, 0.3) !important;
                            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                        }
                    `}
                </style>
                {services.map((service, index) => (
                    <section key={service.id} id={`service-${service.id}`} style={styles.serviceSection} className="service-item-card">
                        <div style={{
                            ...styles.topSection,
                            flexDirection: index % 2 === 0 ? 'row' : 'row-reverse'
                        }} className="service-top-split">
                            {/* Image */}
                            <div style={styles.imageContainer} className="service-image-hover service-image-wrapper">
                                <img src={service.image} alt={service.title} style={styles.serviceImage} />
                            </div>

                            {/* Content */}
                            <div style={styles.contentContainer} className="service-content-wrapper">
                                <div style={styles.iconBadge} className="service-icon-badge">{service.icon}</div>
                                <h2 style={styles.serviceTitle}>{service.title}</h2>
                                <p style={styles.serviceDescription}>{service.description}</p>

                                {/* Features */}
                                <div style={styles.featuresSection}>
                                    <h3 style={styles.featuresTitle}>{t('services_page.features_title')}</h3>
                                    <ul style={styles.featuresList}>
                                        {/* Translation json uses features key array */}
                                        {service.features && service.features.map((feature, idx) => (
                                            <li key={idx} style={styles.featureItem}>
                                                <span style={styles.checkmark}>✓</span>
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <button
                                    onClick={() => handleServiceAction(service.id)}
                                    style={styles.ctaButton}
                                >
                                    {service.id === 5 ? t('services_page.buttons.simulate') : t('services_page.buttons.open_account')}
                                </button>
                            </div>
                        </div>

                        {/* Expertises (Cas d'utilisation) */}
                        <div style={styles.useCasesSection} className="use-cases-section-mobile">
                            <h3 style={styles.useCasesTitle}>
                                {t('services_page.use_cases_title')}
                            </h3>
                            <div style={styles.useCasesGrid} className="use-cases-grid">
                                {service.useCases && service.useCases.map((useCase, idx) => (
                                    <div key={idx} className="use-case-hover use-case-card-mobile" style={styles.useCaseCard}>
                                        <h4 style={styles.useCaseTitle}>{useCase.title}</h4>
                                        <p style={styles.useCaseText}>{useCase.text || useCase.case || useCase.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                ))}
            </div>

            {/* CTA Section */}
            <section style={styles.ctaSection} className="cta-banner">
                <div className="container">
                    <h2 style={styles.ctaTitle}>{t('services_page.cta.title')}</h2>
                    <p style={styles.ctaText}>
                        {t('services_page.cta.text')}
                    </p>
                    <button onClick={() => handleNavigate('/register')} style={styles.ctaButtonLarge}>{t('services_page.cta.button')}</button>
                </div>
            </section>
        </div>
    );
};

const styles = {
    page: {
        minHeight: '100vh',
    },
    hero: {
        backgroundImage: 'url(/banner-cards.jpg)',
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
    navContainer: {
        backgroundColor: 'white',
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        position: 'sticky',
        top: '110px', // Increased to avoid overlap with main navbar
        zIndex: 90, // Lower than navbar usually
        padding: '1rem 0',
    },
    navGrid: {
        display: 'flex',
        flexWrap: 'nowrap',
        gap: '1rem',
        justifyContent: 'center',
        overflowX: 'auto',
        padding: '0.5rem 1rem',
        maxWidth: '100%',
        scrollbarWidth: 'none', // Firefox
        msOverflowStyle: 'none', // IE 10+
    },
    navButton: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.6rem',
        padding: '0.6rem 1.5rem',
        border: '1px solid rgba(0, 82, 204, 0.15)',
        borderRadius: '50px',
        background: 'linear-gradient(135deg, #ffffff 0%, #f0f7ff 100%)',
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        fontSize: '0.9rem',
        color: '#003366',
        fontWeight: '800',
        whiteSpace: 'nowrap',
        flexShrink: 0,
        boxShadow: '0 4px 15px rgba(0, 51, 102, 0.05)',
    },
    navIcon: {
        fontSize: '1.2rem',
    },
    serviceSection: {
        marginBottom: '6rem',
        background: 'linear-gradient(135deg, #00ccff 0%, #0088cc 100%)', // Pure Blue Branding
        borderRadius: '24px',
        padding: '3rem',
        boxShadow: '0 15px 40px rgba(0, 204, 255, 0.2)',
        color: 'white' // Default text white
    },
    topSection: {
        display: 'flex',
        gap: '3rem',
        marginBottom: '3rem',
        alignItems: 'center',
    },
    imageContainer: {
        flex: '1',
        minWidth: '400px',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
        transition: 'transform 0.3s ease',
        height: '400px',
        border: '4px solid rgba(255,255,255,0.2)'
    },
    serviceImage: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        display: 'block',
    },
    contentContainer: {
        flex: '1',
        minWidth: '400px',
    },
    iconBadge: {
        fontSize: '3rem',
        marginBottom: '1rem',
        background: 'rgba(255,255,255,0.2)',
        width: 'fit-content',
        padding: '1rem',
        borderRadius: '16px',
        backdropFilter: 'blur(5px)'
    },
    serviceTitle: {
        fontSize: '2.5rem',
        color: 'white', // White Title
        marginBottom: '1.5rem',
        fontWeight: '800',
        textShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    serviceDescription: {
        fontSize: '1.1rem',
        color: 'white', // White Description for better contrast on dark blue
        lineHeight: 1.8,
        marginBottom: '2rem',
        opacity: 0.95
    },
    featuresSection: {
        marginBottom: '2.5rem',
    },
    featuresTitle: {
        fontSize: '1.5rem',
        color: 'white',
        marginBottom: '1rem',
        fontWeight: '700',
    },
    featuresList: {
        listStyle: 'none',
        padding: 0,
        margin: 0,
    },
    featureItem: {
        padding: '0.8rem 0',
        fontSize: '1.05rem',
        color: 'black', // Black Features as requested
        display: 'flex',
        alignItems: 'center',
        gap: '0.8rem',
        fontWeight: '700'
    },
    checkmark: {
        color: 'white', // White Checkmark
        fontWeight: 'bold',
        fontSize: '1.3rem',
    },
    useCasesSection: {
        marginBottom: '2.5rem',
        backgroundColor: 'rgba(255,255,255,0.03)',
        padding: '2.5rem 2rem',
        borderRadius: '24px',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.05)',
    },
    useCasesGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem',
        marginTop: '1.5rem',
    },
    useCasesTitle: {
        fontSize: '1.6rem',
        color: '#00ccff', // Electric Blue Title
        marginBottom: '2rem',
        fontWeight: '800',
        textTransform: 'uppercase',
        letterSpacing: '1px'
    },
    useCaseCard: {
        backgroundColor: 'rgba(255,255,255,0.08)',
        padding: '2rem',
        borderRadius: '20px',
        border: '1px solid rgba(255,255,255,0.1)',
        transition: 'all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
    },
    useCaseTitle: {
        fontSize: '1.2rem',
        color: 'white',
        marginBottom: '1rem',
        fontWeight: '800',
    },
    useCaseText: {
        fontSize: '1rem',
        color: 'rgba(255,255,255,0.85)', // High contrast text
        lineHeight: 1.6,
        margin: 0,
    },
    ctaButton: {
        backgroundColor: 'black', // Black Button as requested
        color: 'white',
        padding: '1rem 2.5rem',
        fontSize: '1.1rem',
        fontWeight: '800',
        border: '2px solid rgba(255,255,255,0.2)',
        borderRadius: '50px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
    },
    ctaSection: {
        background: 'linear-gradient(135deg, #003366 0%, #004d99 100%)',
        padding: '5rem 2rem',
        textAlign: 'center',
        color: 'white',
    },
    ctaTitle: {
        fontSize: '2.5rem',
        marginBottom: '1rem',
        fontWeight: '800',
    },
    ctaText: {
        fontSize: '1.2rem',
        marginBottom: '2.5rem',
        opacity: 0.95,
    },
    ctaButtonLarge: {
        backgroundColor: '#00ccff',
        color: 'white',
        padding: '1.2rem 3rem',
        fontSize: '1.2rem',
        fontWeight: '700',
        border: 'none',
        borderRadius: '50px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 15px rgba(0,204,255,0.3)',
    },
};

export default Services;
