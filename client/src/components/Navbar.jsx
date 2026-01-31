import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import LanguageSelector from './LanguageSelector';
import { settingsService } from '../services/settingsService';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [globalSettings, setGlobalSettings] = useState({ hideLanguageSelector: false });
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();

    const { t, i18n } = useTranslation();
    const currentLang = i18n.language;

    useEffect(() => {
        const unsubscribe = settingsService.subscribeToGlobalSettings((settings) => {
            setGlobalSettings(settings);
        });
        return () => unsubscribe();
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    const handleLogout = async () => {
        try {
            await logout();
            closeMenu();
            navigate(`/${currentLang}/login`);
        } catch (error) {
            console.error("Erreur déconnexion:", error);
        }
    };

    // Helper to create localized paths
    const getPath = (path) => `/${currentLang}${path}`;

    return (
        <nav style={styles.nav} className="navbar-fixed">
            <div className="container" style={styles.container}>
                <div style={styles.logo}>
                    <Link to={getPath('/')} style={styles.logoLink} onClick={closeMenu}>
                        <img src="/logo-new.png" alt="INVIK SA" className="nav-logo" />
                    </Link>
                </div>

                {/* Mobile Actions (Login Icon + Lang + Hamburger) */}
                <div className="nav-mobile-actions" style={styles.mobileActions}>
                    {!globalSettings.hideLanguageSelector && (
                        <div className="mobile-lang-selector">
                            <LanguageSelector />
                        </div>
                    )}
                    <Link to={getPath('/login')} className="nav-mobile-user" onClick={closeMenu}>
                        <i className="fas fa-user-circle"></i>
                    </Link>
                    <div className="nav-toggle" style={styles.toggle} onClick={toggleMenu}>
                        <i className={isMenuOpen ? "fas fa-times" : "fas fa-bars"}></i>
                    </div>
                </div>

                <div className={`nav-menu ${isMenuOpen ? 'active' : ''}`} style={styles.links}>
                    <NavLink to={getPath('/')} end onClick={closeMenu} className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>{t('navbar.home')}</NavLink>
                    <NavLink to={getPath('/about')} onClick={closeMenu} className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>{t('navbar.about')}</NavLink>
                    <NavLink to={getPath('/services')} onClick={closeMenu} className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>{t('navbar.services')}</NavLink>
                    <NavLink to={getPath('/cards')} onClick={closeMenu} className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>{t('navbar.cards')}</NavLink>
                    <NavLink to={getPath('/faq')} onClick={closeMenu} className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>{t('navbar.faq')}</NavLink>
                    <NavLink to={getPath('/contact')} onClick={closeMenu} className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>{t('navbar.contact')}</NavLink>


                    {currentUser ? (
                        <>
                            <NavLink to={getPath('/dashboard')} onClick={closeMenu} className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>{t('navbar.dashboard')}</NavLink>
                            <button onClick={handleLogout} className="nav-button logout-btn" style={{ ...styles.button, backgroundColor: '#e74c3c' }}>DÉCONNEXION</button>
                        </>
                    ) : (
                        <Link to={getPath('/login')} onClick={closeMenu} className="nav-button" style={styles.button}>{t('navbar.login')} / {t('navbar.register')}</Link>
                    )}

                    {/* Language Selector Desktop (Far Right) */}
                    {!globalSettings.hideLanguageSelector && (
                        <div className="desktop-only">
                            <LanguageSelector />
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

const styles = {
    nav: {
        backgroundColor: 'white',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        padding: '0.8rem 0',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
    },
    container: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    logo: {
        fontSize: '1.5rem',
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
    },
    logoLink: {
        color: 'var(--primary-color)',
        textDecoration: 'none',
        display: 'flex',
        alignItems: 'center',
    },
    links: {
        display: 'flex',
        gap: '1.5rem',
        alignItems: 'center',
    },
    button: {
        backgroundColor: 'var(--primary-color)',
        color: 'white',
        padding: '0.6rem 1.2rem',
        borderRadius: '6px',
        textDecoration: 'none',
        fontWeight: 600,
        fontSize: '0.9rem',
        transition: 'all 0.3s ease',
    },
    toggle: {
        display: 'none', // Hidden on desktop
    },
    mobileActions: {
        alignItems: 'center',
        gap: '15px',
    }
};

export default Navbar;
