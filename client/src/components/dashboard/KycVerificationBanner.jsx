import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { useTranslation } from 'react-i18next';

const KycVerificationBanner = ({ children, variant = 'default', style = {} }) => {
    const { userData } = useAuth();
    const { kycStatus, loading } = useData();
    const { showToast } = useNotifications();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Show loading state while data is being fetched to prevent flash of blocking screen
    if (loading || kycStatus === null || kycStatus === undefined) {
        return <div style={{ padding: '50px', textAlign: 'center', color: '#666' }}>{t('banner.loading')}</div>;
    }

    const status = kycStatus?.status;
    const isVerified = status === 'verified';

    // If verified and using blocking mode (children), unblock (return children)
    if (children && isVerified) {
        return children;
    }

    // If verified and using legacy banner mode (default), hide it
    if (variant === 'default' && isVerified) {
        return null;
    }

    const handleVerifyClick = () => {
        if (isVerified) {
            showToast(t('banner.toasts.verified'), "success");
        } else if (status === 'submitted') {
            showToast(t('banner.toasts.submitted'), "info");
        } else {
            navigate(`/${i18n.language}/dashboard/kyc`);
        }
    };

    // BADGE MODE
    if (variant === 'badge') {
        const isSubmitted = status === 'submitted';
        const mobileBadgeStyle = isMobile ? { padding: '8px', span: { display: 'none' } } : {};

        let badgeBg, badgeIcon, badgeText, pulseColor, animation;

        if (isVerified) {
            badgeBg = '#27ae60'; // Green
            badgeIcon = 'fas fa-check-circle';
            badgeText = t('banner.status.verified');
            pulseColor = 'transparent';
            animation = 'none';
        } else if (isSubmitted) {
            badgeBg = '#f39c12'; // Orange
            badgeIcon = 'fas fa-clock';
            badgeText = t('banner.status.submitted');
            pulseColor = 'rgba(243, 156, 18, 0.7)';
            animation = 'pulseBadge 2s infinite';
        } else if (status === 'unverified') {
            badgeBg = '#c0392b'; // Dark Red
            badgeIcon = 'fas fa-exclamation-triangle';
            badgeText = t('banner.status.rejected');
            pulseColor = 'rgba(192, 57, 43, 0.7)';
            animation = 'pulseBadge 2s infinite';
        } else {
            badgeBg = '#e74c3c'; // Red
            badgeIcon = 'fas fa-shield-alt';
            badgeText = t('banner.status.verify_now');
            pulseColor = 'rgba(231, 76, 60, 0.7)';
            animation = 'pulseBadge 2s infinite';
        }

        return (
            <>
                <style>
                    {`
                    @keyframes pulseBadge {
                        0% { opacity: 1; transform: scale(1); box-shadow: 0 0 0 0 ${pulseColor}; }
                        50% { opacity: 0.8; transform: scale(1.02); box-shadow: 0 0 0 10px rgba(0,0,0,0); }
                        100% { opacity: 1; transform: scale(1); box-shadow: 0 0 0 0 rgba(0,0,0,0); }
                    }
                    `}
                </style>
                <div
                    style={{
                        ...styles.badge,
                        ...style,
                        ...mobileBadgeStyle,
                        background: badgeBg,
                        boxShadow: isVerified ? 'none' : `0 4px 15px ${isSubmitted ? 'rgba(243, 156, 18, 0.4)' : 'rgba(231, 76, 60, 0.4)'}`,
                        animation: animation,
                        cursor: isVerified ? 'default' : 'pointer'
                    }}
                    onClick={handleVerifyClick}
                    className="kyc-badge"
                    title={isVerified ? t('banner.status.verified') : t('banner.status.click_to_verify')}
                >
                    <i className={badgeIcon} style={{ fontSize: isMobile ? '1.2rem' : '1rem' }}></i>
                    {!isMobile && <span>{badgeText}</span>}
                </div>
            </>
        );
    }

    // BLOCKING MODE (if children provided)
    if (children) {
        const isSubmitted = status === 'submitted';
        const isUnverified = status === 'unverified';
        return (
            <div style={styles.blockingContainer}>
                <div style={{ ...styles.blockingCard, padding: isMobile ? '1.5rem' : '3rem' }}>
                    <div style={{ ...styles.iconBoxBlocking, background: isUnverified ? '#c0392b' : (isSubmitted ? '#f39c12' : '#003366') }}>
                        <i className={isUnverified ? "fas fa-exclamation-circle" : (isSubmitted ? "fas fa-clock" : "fas fa-shield-alt")} style={styles.iconBlocking}></i>
                    </div>
                    <h2 style={{ ...styles.titleBlocking, fontSize: isMobile ? '1.5rem' : '2rem', color: isUnverified ? '#c0392b' : (isSubmitted ? '#f39c12' : '#1a202c') }}>
                        {isUnverified ? t('banner.blocking.refused') : (isSubmitted ? t('banner.blocking.in_progress') : t('banner.blocking.required'))}
                    </h2>
                    <p style={styles.descriptionBlocking}>
                        {isUnverified
                            ? (kycStatus?.reviewNotes ? `${t('banner.blocking.motif')} ${kycStatus.reviewNotes}` : t('banner.blocking.not_compliant'))
                            : (isSubmitted
                                ? t('banner.blocking.analyzing')
                                : t('banner.blocking.restricted'))
                        }
                    </p>
                    <button
                        style={{ ...styles.buttonBlocking, background: isSubmitted ? '#f39c12' : '#003366', cursor: isSubmitted ? 'default' : 'pointer', opacity: isSubmitted ? 0.8 : 1 }}
                        onClick={handleVerifyClick}
                        disabled={isSubmitted}
                    >
                        {isSubmitted ? t('banner.blocking.waiting') : t('banner.blocking.start')}
                        {!isSubmitted && <i className="fas fa-arrow-right" style={{ marginLeft: '8px' }}></i>}
                    </button>
                    <div style={styles.secureBadge}>
                        <i className="fas fa-lock" style={{ marginRight: '8px' }}></i> {t('banner.blocking.secure')}
                    </div>
                </div>
            </div>
        );
    }

    // HEADER BANNER MODE (Legacy/Optional)
    return (
        <div style={styles.banner}>
            <div style={styles.iconBox}>
                <i className="fas fa-shield-alt" style={styles.icon}></i>
            </div>
            <div style={styles.content}>
                <h3 style={styles.title}>
                    {status === 'unverified' ? t('banner.legacy.action_required') : t('banner.legacy.identity_required')}
                </h3>
                <p style={styles.description}>
                    {status === 'unverified'
                        ? (kycStatus?.reviewNotes || t('banner.legacy.not_validated'))
                        : t('banner.legacy.complete_kyc')
                    }
                </p>
                <button style={styles.button} onClick={handleVerifyClick}>
                    {status === 'unverified' ? t('banner.legacy.fix_file') : t('banner.legacy.verify_identity')} <i className="fas fa-arrow-right" style={{ marginLeft: '8px' }}></i>
                </button>
            </div>
        </div>
    );
};

const styles = {
    badge: {
        background: '#e74c3c', // Red
        color: 'white',
        padding: '0.6rem 1.2rem',
        borderRadius: '50px',
        display: 'flex',
        alignItems: 'center',
        gap: '0.6rem',
        cursor: 'pointer',
        boxShadow: '0 4px 15px rgba(231, 76, 60, 0.4)',
        fontWeight: '600',
        fontSize: '0.9rem',
        zIndex: 100,
        transition: 'all 0.2s',
        border: '1px solid rgba(255,255,255,0.2)',
        animation: 'pulseBadge 2s infinite'
    },
    banner: {
        background: 'linear-gradient(135deg, #003366 0%, #00509e 100%)',
        borderRadius: '24px',
        padding: '2rem',
        display: 'flex',
        alignItems: 'center',
        gap: '2rem',
        marginBottom: '2rem',
        boxShadow: '0 20px 40px rgba(0, 51, 102, 0.2)',
        color: 'white'
    },
    // ... existing styles ...
    blockingContainer: {
        position: 'relative',
        minHeight: '80vh',
        background: 'rgba(244, 247, 254, 0.95)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        boxSizing: 'border-box'
    },
    blockingCard: {
        background: 'white',
        borderRadius: '30px',
        padding: window.innerWidth <= 768 ? '2rem' : '3rem',
        maxWidth: '550px',
        width: '100%',
        textAlign: 'center',
        boxShadow: '0 50px 100px -20px rgba(0,0,0,0.15), 0 30px 60px -30px rgba(0,0,0,0.2)'
    },
    iconBoxBlocking: {
        width: '100px',
        height: '100px',
        background: '#003366',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 2rem',
        boxShadow: '0 20px 40px rgba(0, 51, 102, 0.3)'
    },
    iconBlocking: {
        fontSize: '3rem',
        color: 'white'
    },
    titleBlocking: {
        fontSize: '2rem',
        fontWeight: '900',
        color: '#1a202c',
        marginBottom: '1rem'
    },
    descriptionBlocking: {
        fontSize: '1.1rem',
        color: '#718096',
        lineHeight: '1.6',
        marginBottom: '2.5rem'
    },
    buttonBlocking: {
        padding: '16px 40px',
        background: '#003366',
        color: 'white',
        border: 'none',
        borderRadius: '50px',
        fontSize: '1.1rem',
        fontWeight: 'bold',
        cursor: 'pointer',
        boxShadow: '0 20px 40px rgba(0, 51, 102, 0.4)',
        transition: 'transform 0.2s',
        marginBottom: '2rem',
        width: '100%'
    },
    secureBadge: {
        display: 'inline-flex',
        alignItems: 'center',
        background: '#f7fafc',
        padding: '10px 20px',
        borderRadius: '50px',
        color: '#003366',
        fontSize: '0.9rem',
        fontWeight: '600'
    },
    iconBox: {
        width: '80px',
        height: '80px',
        background: 'rgba(255, 255, 255, 0.2)',
        borderRadius: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
    },
    icon: {
        fontSize: '2.5rem',
        color: 'white'
    },
    content: {
        flex: 1
    },
    title: {
        fontSize: '1.5rem',
        fontWeight: 'bold',
        marginBottom: '0.5rem',
        color: 'white'
    },
    description: {
        fontSize: '1rem',
        marginBottom: '1.5rem',
        opacity: 0.95,
        lineHeight: '1.6'
    },
    button: {
        padding: '12px 30px',
        background: 'white',
        color: '#003366',
        border: 'none',
        borderRadius: '12px',
        fontSize: '1rem',
        fontWeight: 'bold',
        cursor: 'pointer',
        boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)'
    }
};

export default KycVerificationBanner;
