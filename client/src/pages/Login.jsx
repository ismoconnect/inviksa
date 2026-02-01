import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

const Login = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const { login, resetPassword, currentUser } = useAuth();
    const { showToast } = useNotifications();

    // Auto-redirect if already logged in
    useEffect(() => {
        if (currentUser) {
            const from = location.state?.from?.pathname || `/${i18n.language}/dashboard`;
            navigate(from, { replace: true });
        }
    }, [currentUser, navigate, i18n.language, location.state]);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isForgotMode, setIsForgotMode] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        if (!email) {
            setError(t('auth.login.error_empty_email'));
            return;
        }
        setLoading(true);
        try {
            await resetPassword(email);
            setError('');
            showToast(t('auth.login.success_reset'), 'info');
            setIsForgotMode(false); // Optionally return to login mode
        } catch (err) {
            setError(t('auth.login.error_reset'));
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(email, password);
            const from = location.state?.from?.pathname || `/${i18n.language}/dashboard`;
            navigate(from, { replace: true });
        } catch (err) {
            console.error("Erreur de connexion:", err);
            setError(t('auth.login.error_login'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.page} className="auth-page">
            {/* High-Tech Background Elements */}
            <div style={styles.bgGlow1} className="floating-glow-light"></div>
            <div style={styles.bgGlow2} className="floating-glow-light-delayed"></div>
            <div style={styles.gridOverlay}></div>

            <div className="container" style={styles.container}>
                <div style={styles.authCard} className="auth-card glass-light-glow">
                    <div style={styles.formContent} className="auth-form-content">
                        <div style={styles.logoWrapper}>
                            <img src="/logo-new.png" alt="Logo" style={styles.miniLogo} />
                        </div>
                        <h2 style={styles.title}>{t('auth.login.title')}</h2>
                        <p style={styles.subtitle}>{t('auth.login.subtitle')}</p>

                        {error && (
                            <div style={styles.errorBanner} className="fadeInUp">
                                <i className="fas fa-exclamation-circle" style={{ marginRight: '8px' }}></i>
                                {error}
                            </div>
                        )}

                        <form onSubmit={isForgotMode ? handleForgotPassword : handleSubmit}>
                            <div style={styles.formGroup} className="input-animate">
                                <label style={styles.label}>{t('auth.login.identifier')}</label>
                                <div style={styles.inputWrapper}>
                                    <i className="fas fa-envelope" style={styles.inputIcon}></i>
                                    <input
                                        type="email"
                                        name="email"
                                        autoComplete="username"
                                        placeholder={t('auth.login.email_placeholder')}
                                        style={styles.input}
                                        className="light-futuristic-input"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            {!isForgotMode && (
                                <>
                                    <div style={styles.formGroup} className="input-animate-delayed">
                                        <label style={styles.label}>{t('auth.login.password')}</label>
                                        <div style={styles.inputWrapper}>
                                            <i className="fas fa-lock" style={styles.inputIcon}></i>
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                name="password"
                                                autoComplete="current-password"
                                                placeholder={t('auth.login.password_placeholder')}
                                                style={{ ...styles.input, paddingRight: '2.5rem' }}
                                                className="light-futuristic-input"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                style={styles.eyeBtn}
                                            >
                                                <i className={`fas ${showPassword ? 'fa-eye' : 'fa-eye-slash'}`}></i>
                                            </button>
                                        </div>
                                    </div>
                                    <div style={styles.forgot}>
                                        <a href="#" onClick={(e) => { e.preventDefault(); setIsForgotMode(true); }} style={styles.link}>{t('auth.login.forgot_password')}</a>
                                    </div>
                                </>
                            )}

                            <button
                                type="submit"
                                style={{
                                    ...styles.submitButton,
                                    opacity: loading ? 0.7 : 1,
                                    cursor: loading ? 'not-allowed' : 'pointer'
                                }}
                                className="electric-btn-shimmer"
                                disabled={loading}
                            >
                                {loading ? (
                                    <div className="btn-loader-dark"></div>
                                ) : (
                                    isForgotMode ? t('auth.login.sending') : t('auth.login.submit')
                                )}
                            </button>

                            {isForgotMode && (
                                <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                                    <a href="#" onClick={(e) => { e.preventDefault(); setIsForgotMode(false); }} style={styles.link}>{t('auth.login.back_to_login')}</a>
                                </div>
                            )}
                        </form>

                        {!isForgotMode && (
                            <>
                                <div style={styles.divider}>
                                    <span>{t('auth.login.not_client')}</span>
                                </div>

                                <button
                                    onClick={() => navigate(`/${i18n.language}/register`)}
                                    style={styles.registerButton}
                                    className="light-glass-btn"
                                >
                                    {t('auth.login.open_account')}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <style>
                {`
                    .auth-page {
                        position: relative;
                        overflow: hidden;
                    }
                    .glass-light-glow {
                        border: 1px solid rgba(0, 204, 255, 0.2) !important;
                        box-shadow: 0 20px 40px -10px rgba(0, 51, 102, 0.1) !important;
                        position: relative;
                        z-index: 10;
                    }
                    .light-futuristic-input {
                        background: rgba(255, 255, 255, 0.4) !important;
                        color: #003366 !important;
                        border: 1px solid rgba(0, 102, 204, 0.15) !important;
                        padding-left: 2.8rem !important;
                    }
                    .light-futuristic-input:focus {
                        border-color: #00ccff !important;
                        box-shadow: 0 0 15px rgba(0, 204, 255, 0.2) !important;
                        background: white !important;
                    }
                    .floating-glow-light {
                        position: absolute;
                        width: 800px;
                        height: 800px;
                        background: radial-gradient(circle, rgba(0, 204, 255, 0.08) 0%, rgba(255, 255, 255, 0) 70%);
                        top: -300px;
                        right: -200px;
                        border-radius: 50%;
                        filter: blur(100px);
                        animation: floatLight 20s infinite alternate;
                        z-index: 1;
                    }
                    .floating-glow-light-delayed {
                        position: absolute;
                        width: 600px;
                        height: 600px;
                        background: radial-gradient(circle, rgba(0, 51, 102, 0.04) 0%, rgba(255, 255, 255, 0) 70%);
                        bottom: -200px;
                        left: -100px;
                        border-radius: 50%;
                        filter: blur(100px);
                        animation: floatLight 25s infinite alternate-reverse;
                        z-index: 1;
                    }
                    @keyframes floatLight {
                        0% { transform: translate(0, 0) rotate(0deg); }
                        100% { transform: translate(100px, 50px) rotate(10deg); }
                    }
                    .electric-btn-shimmer {
                        position: relative;
                        overflow: hidden;
                        transition: all 0.3s ease !important;
                    }
                    .electric-btn-shimmer::after {
                        content: '';
                        position: absolute;
                        top: -50%;
                        left: -100%;
                        width: 100%;
                        height: 200%;
                        background: linear-gradient(
                            to right,
                            rgba(255, 255, 255, 0) 0%,
                            rgba(255, 255, 255, 0.3) 50%,
                            rgba(255, 255, 255, 0) 100%
                        );
                        transform: rotate(25deg);
                        transition: all 0.8s;
                    }
                    .electric-btn-shimmer:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 10px 20px rgba(0, 204, 255, 0.2) !important;
                    }
                    .electric-btn-shimmer:hover::after {
                        left: 150%;
                    }
                    .light-glass-btn {
                        background: linear-gradient(135deg, #00ccff 0%, #0088cc 100%) !important;
                        border: none !important;
                        color: white !important;
                        transition: all 0.3s ease !important;
                        box-shadow: 0 4px 12px rgba(0, 204, 255, 0.2) !important;
                    }
                    .light-glass-btn:hover {
                        background: linear-gradient(135deg, #00eeff 0%, #00ccff 100%) !important;
                        transform: translateY(-2px);
                        box-shadow: 0 8px 20px rgba(0, 204, 255, 0.4) !important;
                    }
                    .input-animate {
                        animation: fadeInUp 0.5s ease-out both;
                    }
                    .input-animate-delayed {
                        animation: fadeInUp 0.5s ease-out 0.15s both;
                    }
                    @keyframes fadeInUp {
                        from { opacity: 0; transform: translateY(15px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    .btn-loader-dark {
                        width: 20px;
                        height: 20px;
                        border: 2px solid rgba(255, 255, 255, 0.3);
                        border-radius: 50%;
                        border-top-color: #fff;
                        animation: spin 0.8s linear infinite;
                        margin: 0 auto;
                    }
                    @keyframes spin {
                        to { transform: rotate(360deg); }
                    }
                `}
            </style>
        </div>
    );
};

const styles = {
    page: {
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f0f9ff 0%, #ffffff 50%, #e0f2fe 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        position: 'relative'
    },
    gridOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: 'radial-gradient(rgba(0, 204, 255, 0.03) 1px, transparent 0)',
        backgroundSize: '30px 30px',
        zIndex: 2
    },
    container: {
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
        position: 'relative',
        zIndex: 10
    },
    authCard: {
        width: '100%',
        maxWidth: '420px',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRadius: '24px',
        overflow: 'hidden',
    },
    formContent: {
        padding: '1rem 1.5rem', // Minimal padding
    },
    logoWrapper: {
        textAlign: 'center',
        marginBottom: '0.8rem' // Minimal margin
    },
    miniLogo: {
        height: '50px', // More compact logo
        width: 'auto',
    },
    title: {
        textAlign: 'center',
        marginBottom: '0.1rem', // Minimal margin
        color: '#001a33',
        fontSize: '1.5rem', // Even more compact
        fontWeight: '900',
        letterSpacing: '-1px',
    },
    subtitle: {
        textAlign: 'center',
        marginBottom: '1rem', // Minimal margin
        color: '#526b8a',
        fontSize: '0.85rem',
        lineHeight: '1.2',
    },
    formGroup: {
        marginBottom: '0.6rem', // Ultra-compact
    },
    label: {
        display: 'block',
        marginBottom: '0.2rem', // Minimal margin
        fontSize: '0.65rem',
        fontWeight: '800',
        color: '#003366',
        textTransform: 'uppercase',
        letterSpacing: '1px'
    },
    inputWrapper: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
    },
    inputIcon: {
        position: 'absolute',
        left: '1rem',
        color: '#0066cc',
        fontSize: '0.9rem',
        zIndex: 2,
        opacity: 0.7
    },
    input: {
        width: '100%',
        padding: '0.7rem 0.9rem',
        borderRadius: '8px',
        fontSize: '0.9rem',
        outline: 'none',
        boxSizing: 'border-box',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        fontWeight: '600'
    },
    forgot: {
        textAlign: 'right',
        marginBottom: '0.8rem', // Minimal margin
        fontSize: '0.75rem',
    },
    link: {
        color: '#0088cc',
        textDecoration: 'none',
        fontWeight: '700',
    },
    submitButton: {
        width: '100%',
        padding: '0.8rem', // Compact padding
        background: 'linear-gradient(135deg, #003366 0%, #0066cc 100%)',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '0.9rem',
        fontWeight: '800',
        marginBottom: '0.8rem', // Reduced margin
        boxShadow: '0 4px 10px rgba(0, 51, 102, 0.1)',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        cursor: 'pointer'
    },
    divider: {
        textAlign: 'center',
        borderTop: '1px solid rgba(0, 51, 102, 0.08)',
        paddingTop: '0.8rem', // Minimal padding
        marginBottom: '0.6rem', // Minimal margin
        color: '#6b7280',
        fontSize: '0.75rem',
    },
    registerButton: {
        width: '100%',
        padding: '0.75rem', // Compact padding
        borderRadius: '8px',
        fontSize: '0.85rem',
        fontWeight: '800',
        cursor: 'pointer',
        textTransform: 'uppercase',
        letterSpacing: '1px'
    },
    eyeBtn: {
        position: 'absolute',
        right: '0.9rem',
        top: '50%',
        transform: 'translateY(-50%)',
        background: 'none',
        border: 'none',
        color: '#94a3b8',
        cursor: 'pointer',
        fontSize: '1rem',
        display: 'flex',
        alignItems: 'center',
        zIndex: 2,
    },
    errorBanner: {
        backgroundColor: '#fef2f2',
        color: '#dc2626',
        padding: '0.6rem', // Minimal padding
        borderRadius: '8px',
        marginBottom: '1rem', // Minimal margin
        fontSize: '0.85rem',
        fontWeight: '600',
        textAlign: 'center',
        border: '1px solid #fee2e2',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    bgGlow1: {},
    bgGlow2: {}
};

export default Login;
