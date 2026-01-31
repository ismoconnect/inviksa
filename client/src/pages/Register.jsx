import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { countries } from '../data/countries';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import { useTranslation } from 'react-i18next';

// --- SUB-COMPONENTS (Extracted to prevent re-renders) ---

const SelectionStep = ({ handleSelectType, styles, t }) => (
    <div style={styles.selectionContainer} className="fadeInUp register-selection-card">
        <h2 style={styles.gatewayTitle}>{t('auth.register.selection.title')}</h2>
        <p style={styles.gatewaySubtitle}>{t('auth.register.selection.subtitle')}</p>

        <div style={styles.cardsGrid} className="selection-grid">
            {/* Personal Card */}
            <div
                style={styles.selectionCard}
                className="card-hover register-selection-item"
                onClick={() => handleSelectType('personal')}
            >
                <div style={styles.iconCircle}>👤</div>
                <h3 style={styles.cardTypeTitle}>{t('auth.register.selection.personal.title')}</h3>
                <p style={styles.cardTypeDesc}>{t('auth.register.selection.personal.desc')}</p>
                <ul style={styles.cardFeatures}>
                    <li>✓ Compte courant & Épargne</li>
                    <li>✓ Cartes Visa / Mastercard</li>
                    <li>✓ Prêts personnels</li>
                </ul>
                <button style={styles.cardBtn}>{t('auth.register.selection.personal.btn')}</button>
            </div>

            {/* Business Card */}
            <div
                style={styles.selectionCard}
                className="card-hover register-selection-item"
                onClick={() => handleSelectType('business')}
            >
                <div style={styles.iconCircleBlue}>🏢</div>
                <h3 style={styles.cardTypeTitle}>{t('auth.register.selection.business.title')}</h3>
                <p style={styles.cardTypeDesc}>{t('auth.register.selection.business.desc')}</p>
                <ul style={styles.cardFeatures}>
                    <li>✓ Gestion de trésorerie</li>
                    <li>✓ Paiements internationaux</li>
                    <li>✓ Crédits professionnels</li>
                </ul>
                <button style={styles.cardBtnBlue}>{t('auth.register.selection.business.btn')}</button>
            </div>
        </div>
    </div>
);

const SecuritySection = ({ formData, handleChange, loading, error, styles, setStep, suffix, t }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const eyeButtonStyle = {
        position: 'absolute',
        right: '1rem',
        top: '50%',
        transform: 'translateY(-50%)',
        background: 'none',
        border: 'none',
        color: '#94a3b8',
        cursor: 'pointer',
        fontSize: '1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2
    };

    return (
        <div style={styles.sectionNoBorder}>
            <h4 style={styles.sectionHeading}>{t('auth.register.form.security_section')}</h4>
            <div style={styles.formGrid} className="register-form-grid">
                <div style={styles.formGroup}>
                    <label style={styles.label}>{t('auth.register.form.fields.password')} *</label>
                    <div style={{ position: 'relative' }}>
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            autoComplete="new-password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            style={{ ...styles.input, paddingRight: '3.5rem' }}
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} style={eyeButtonStyle}>
                            <i className={`fas ${showPassword ? 'fa-eye' : 'fa-eye-slash'}`}></i>
                        </button>
                    </div>
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>{t('auth.register.form.fields.confirm_password')} *</label>
                    <div style={{ position: 'relative' }}>
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            autoComplete="new-password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            style={{ ...styles.input, paddingRight: '3.5rem' }}
                        />
                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={eyeButtonStyle}>
                            <i className={`fas ${showConfirmPassword ? 'fa-eye' : 'fa-eye-slash'}`}></i>
                        </button>
                    </div>
                </div>
            </div>

            <div style={styles.checkboxGroup}>
                <input type="checkbox" name="termsAccepted" id={`terms-${suffix}`} checked={formData.termsAccepted} onChange={handleChange} required style={styles.checkbox} />
                <label htmlFor={`terms-${suffix}`} style={styles.checkboxLabel}>
                    {t('auth.register.form.fields.terms')}
                </label>
            </div>

            {error && (
                <div style={{
                    backgroundColor: '#ffebee',
                    color: '#c62828',
                    padding: '1rem',
                    borderRadius: '8px',
                    marginBottom: '1.5rem',
                    fontSize: '0.9rem',
                    textAlign: 'center',
                    border: '1px solid #ffcdd2'
                }}>
                    {error}
                </div>
            )}

            <div style={styles.submitContainer}>
                <button
                    type="submit"
                    style={{
                        ...styles.submitBtn,
                        opacity: loading ? 0.7 : 1,
                        cursor: loading ? 'not-allowed' : 'pointer'
                    }}
                    className="register-submit-btn"
                    disabled={loading}
                >
                    {loading ? t('auth.register.form.submitting') : t('auth.register.form.submit')}
                </button>
                <div style={{ marginTop: '1.5rem' }}>
                    <a onClick={() => setStep(0)} style={{ ...styles.link, fontSize: '0.9rem' }}>← {t('auth.register.form.back')}</a>
                </div>
            </div>
        </div>
    );
};

const PersonalForm = ({ formData, handleChange, handleSubmit, loading, error, setStep, view, styles, t }) => (
    <div className="fadeInUp">
        <h2 style={styles.formTitle}>{t('auth.register.form.personal_title')}</h2>
        <p style={styles.formSubtitle}>{t('auth.register.form.personal_subtitle')}</p>

        <form onSubmit={handleSubmit}>
            <div style={styles.section}>
                <h4 style={styles.sectionHeading}>{t('auth.register.form.identity_section')}</h4>
                <div style={styles.formGrid} className="register-form-grid">
                    <div style={styles.formGroup}><label style={styles.label}>{t('auth.register.form.fields.firstname')} *</label><input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required style={styles.input} /></div>
                    <div style={styles.formGroup}><label style={styles.label}>{t('auth.register.form.fields.lastname')} *</label><input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required style={styles.input} /></div>
                    <div style={styles.formGroup}><label style={styles.label}>{t('auth.register.form.fields.dob')} *</label><input type="date" name="dob" value={formData.dob} onChange={handleChange} required style={styles.input} /></div>
                    <div style={styles.formGroup}><label style={styles.label}>{t('auth.register.form.fields.birthplace')} *</label><input type="text" name="birthPlace" placeholder={t('auth.register.form.fields.birthplace_placeholder')} value={formData.birthPlace} onChange={handleChange} required style={styles.input} /></div>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>{t('auth.register.form.fields.gender')} *</label>
                        <select name="gender" value={formData.gender} onChange={handleChange} required style={styles.select}>
                            <option value="">{t('auth.register.form.placeholders.choose')}</option>
                            <option value="M">{t('auth.register.form.options.gender.male')}</option>
                            <option value="F">{t('auth.register.form.options.gender.female')}</option>
                        </select>
                    </div>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>{t('auth.register.form.fields.nationality')} *</label>
                        <select name="nationality" value={formData.nationality} onChange={handleChange} required style={styles.select}>
                            <option value="">{t('auth.register.form.placeholders.select')}</option>
                            {countries.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>{t('auth.register.form.fields.residence')} *</label>
                        <select name="countryOfResidence" value={formData.countryOfResidence} onChange={handleChange} required style={styles.select}>
                            <option value="">{t('auth.register.form.placeholders.select')}</option>
                            {countries.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            <div style={styles.section}>
                <h4 style={styles.sectionHeading}>{t('auth.register.form.coords_section')}</h4>
                <div style={styles.formGrid} className="register-form-grid">
                    <div className="full-width-mobile" style={{ gridColumn: '1/-1' }}><label style={styles.label}>{t('auth.register.form.fields.address')} *</label><input type="text" name="address" value={formData.address} onChange={handleChange} required style={styles.input} /></div>
                    <div style={styles.formGroup}><label style={styles.label}>{t('auth.register.form.fields.zip')} *</label><input type="text" name="zipCode" value={formData.zipCode} onChange={handleChange} required style={styles.input} /></div>
                    <div style={styles.formGroup}><label style={styles.label}>{t('auth.register.form.fields.city')} *</label><input type="text" name="city" value={formData.city} onChange={handleChange} required style={styles.input} /></div>
                    <div style={styles.formGroup}><label style={styles.label}>{t('auth.register.form.fields.phone')} *</label><input type="tel" name="phone" value={formData.phone} onChange={handleChange} required style={styles.input} /></div>
                    <div style={styles.formGroup}><label style={styles.label}>{t('auth.register.form.fields.email')} *</label><input type="email" name="email" autoComplete="email" value={formData.email} onChange={handleChange} required style={styles.input} /></div>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>{t('auth.register.form.fields.currency')} *</label>
                        <select name="currency" value={formData.currency} onChange={handleChange} required style={styles.select}>
                            <option value="EUR">EUR (€)</option><option value="USD">USD ($)</option>
                        </select>
                    </div>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>{t('auth.register.form.fields.savings_opt')} *</label>
                        <select name="accountType" value={formData.accountType} onChange={handleChange} required style={styles.select}>
                            <option value="standard">{t('auth.register.form.options.account_type.standard')}</option>
                            <option value="savings">{t('auth.register.form.options.account_type.savings')}</option>
                        </select>
                    </div>
                </div>
            </div>

            <SecuritySection
                formData={formData}
                handleChange={handleChange}
                loading={loading}
                error={error}
                styles={styles}
                setStep={setStep}
                suffix={view}
                t={t}
            />
        </form>
    </div>
);

const BusinessForm = ({ formData, handleChange, handleSubmit, loading, error, setStep, view, styles, t }) => (
    <div className="fadeInUp">
        <h2 style={styles.formTitle}>{t('auth.register.form.business_title')}</h2>
        <p style={styles.formSubtitle}>{t('auth.register.form.business_subtitle')}</p>

        <form onSubmit={handleSubmit}>
            <div style={styles.section}>
                <h4 style={styles.sectionHeading}>{t('auth.register.form.company_section')}</h4>
                <div style={styles.formGrid} className="register-form-grid">
                    <div className="full-width-mobile" style={{ gridColumn: '1/-1' }}><label style={styles.label}>{t('auth.register.form.fields.company_name')} *</label><input type="text" name="companyName" value={formData.companyName} onChange={handleChange} required style={styles.input} /></div>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>{t('auth.register.form.fields.legal_form')} *</label>
                        <select name="legalForm" value={formData.legalForm} onChange={handleChange} required style={styles.select}>
                            <option value="">{t('auth.register.form.placeholders.choose')}</option>
                            <option value="SARL">SARL / EURL</option>
                            <option value="SAS">SAS / SASU</option>
                            <option value="SA">SA</option>
                            <option value="AUTO">{t('auth.register.form.options.legal_form.auto')}</option>
                            <option value="ASSOC">{t('auth.register.form.options.legal_form.assoc')}</option>
                            <option value="OTHER">{t('auth.register.form.options.legal_form.other')}</option>
                        </select>
                    </div>
                    <div style={styles.formGroup}><label style={styles.label}>{t('auth.register.form.fields.siret')} *</label><input type="text" name="registrationNumber" value={formData.registrationNumber} onChange={handleChange} required style={styles.input} /></div>
                    <div style={styles.formGroup}><label style={styles.label}>{t('auth.register.form.fields.sector')} *</label><input type="text" name="activitySector" value={formData.activitySector} onChange={handleChange} required style={styles.input} /></div>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>{t('auth.register.form.fields.residence')} *</label>
                        <select name="countryOfResidence" value={formData.countryOfResidence} onChange={handleChange} required style={styles.select}>
                            <option value="">{t('auth.register.form.placeholders.select')}</option>
                            {countries.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div className="full-width-mobile" style={{ gridColumn: '1/-1' }}><label style={styles.label}>{t('auth.register.form.fields.hq_address')} *</label><input type="text" name="address" value={formData.address} onChange={handleChange} required style={styles.input} /></div>
                </div>
            </div>

            <div style={styles.section}>
                <h4 style={styles.sectionHeading}>{t('auth.register.form.rep_section')}</h4>
                <div style={styles.formGrid} className="register-form-grid">
                    <div style={styles.formGroup}><label style={styles.label}>{t('auth.register.form.fields.firstname')} *</label><input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required style={styles.input} /></div>
                    <div style={styles.formGroup}><label style={styles.label}>{t('auth.register.form.fields.lastname')} *</label><input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required style={styles.input} /></div>
                    <div style={styles.formGroup}><label style={styles.label}>{t('auth.register.form.fields.birthplace')} *</label><input type="text" name="birthPlace" placeholder={t('auth.register.form.fields.birthplace_placeholder')} value={formData.birthPlace} onChange={handleChange} required style={styles.input} /></div>
                    <div style={styles.formGroup}><label style={styles.label}>{t('auth.register.form.fields.function')} *</label><input type="text" name="repFunction" placeholder={t('auth.register.form.fields.function_placeholder')} value={formData.repFunction} onChange={handleChange} required style={styles.input} /></div>
                    <div style={styles.formGroup}><label style={styles.label}>{t('auth.register.form.fields.pro_email')} *</label><input type="email" name="email" autoComplete="email" value={formData.email} onChange={handleChange} required style={styles.input} /></div>
                </div>
            </div>

            <SecuritySection
                formData={formData}
                handleChange={handleChange}
                loading={loading}
                error={error}
                styles={styles}
                setStep={setStep}
                suffix={view}
                t={t}
            />
        </form>
    </div>
);

const MobileSelection = ({ handleSelectType, t }) => (
    <div className="mobile-selection-wrapper">
        <div className="mobile-selection-item" onClick={() => handleSelectType('personal')}>
            <div className="mobile-selection-icon">👤</div>
            <div className="mobile-selection-info">
                <h3>{t('auth.register.selection.personal.title')}</h3>
                <p>{t('auth.register.selection.personal.desc')}</p>
            </div>
            <i className="fas fa-chevron-right"></i>
        </div>
        <div className="mobile-selection-item" onClick={() => handleSelectType('business')}>
            <div className="mobile-selection-icon blue">🏢</div>
            <div className="mobile-selection-info">
                <h3>{t('auth.register.selection.business.title')}</h3>
                <p>{t('auth.register.selection.business.desc')}</p>
            </div>
            <i className="fas fa-chevron-right"></i>
        </div>
    </div>
);

// --- MAIN COMPONENT ---

const Register = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const { register } = useAuth();
    const { showToast } = useNotifications();
    const [step, setStep] = useState(0); // 0: Selection, 1: Form
    const [userType, setUserType] = useState(null); // 'personal' or 'business'
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Joint logic for both forms
    const [formData, setFormData] = useState({
        // Common 
        email: '',
        password: '',
        confirmPassword: '',
        currency: 'EUR',
        termsAccepted: false,

        // Personal Specific
        firstName: '',
        lastName: '',
        dob: '',
        birthPlace: '',
        gender: '',
        nationality: '',
        countryOfResidence: '',
        address: '',
        city: '',
        zipCode: '',
        phone: '',
        accountType: 'standard',

        // Business Specific
        companyName: '',
        legalForm: '',
        registrationNumber: '',
        activitySector: '',
        repFunction: '', // Gérant, Président, etc.
    });

    const handleSelectType = (type) => {
        setUserType(type);
        setStep(1);
        window.scrollTo(0, 0);
    };

    const handleChange = useCallback((e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        const name = e.target.name;
        setFormData(prev => ({ ...prev, [name]: value }));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError(t('auth.register.form.error_match'));
            return;
        }

        if (formData.password.length < 6) {
            setError(t('auth.register.form.error_length'));
            return;
        }

        setLoading(true);
        try {
            const { email, password, confirmPassword, termsAccepted, ...profileData } = formData;
            await register(email, password, {
                ...profileData,
                userType,
                language: i18n.language, // Save current browser language
                displayName: userType === 'personal' ? `${formData.firstName} ${formData.lastName}` : formData.companyName
            });

            showToast(t('auth.register.form.success'), 'success');
            navigate(`/${i18n.language}/email-verification-pending`);
        } catch (err) {
            console.error("Erreur d'inscription:", err);
            if (err.code === 'auth/email-already-in-use') {
                setError(t('auth.register.form.error_exists'));
            } else {
                setError(t('auth.register.form.error_generic'));
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.page} className="register-page">
            {/* Desktop Hero - Hidden on mobile */}
            <section style={styles.hero} className="register-hero desktop-only">
                <div style={styles.heroOverlay}>
                    <div className="container" style={{ textAlign: 'center' }}>
                        <h1 style={styles.heroTitle} className="register-hero-title">{t('auth.register.title')}</h1>
                        <p style={styles.heroSubtitle}>{t('auth.register.subtitle')}</p>
                    </div>
                </div>
            </section>

            {/* Mobile Header - Visible only on mobile */}
            <div className="mobile-register-header">
                <button onClick={() => step === 1 ? setStep(0) : navigate(-1)} className="mobile-back-btn">
                    <i className="fas fa-arrow-left"></i>
                </button>
                <h1>{step === 0 ? "Inscription" : (userType === 'personal' ? t('auth.register.selection.personal.title') : t('auth.register.selection.business.title'))}</h1>
                <div style={{ width: '40px' }}></div> {/* Spacer */}
            </div>

            <div className="container" style={styles.formContainer}>
                {/* Desktop Version */}
                <div className="desktop-register-view">
                    {step === 0 ? (
                        <SelectionStep handleSelectType={handleSelectType} styles={styles} t={t} />
                    ) : (
                        <div style={styles.formCard} className="register-form-card">
                            {userType === 'personal' ? (
                                <PersonalForm
                                    formData={formData}
                                    handleChange={handleChange}
                                    handleSubmit={handleSubmit}
                                    loading={loading}
                                    error={error}
                                    setStep={setStep}
                                    view="desktop"
                                    styles={styles}
                                    t={t}
                                />
                            ) : (
                                <BusinessForm
                                    formData={formData}
                                    handleChange={handleChange}
                                    handleSubmit={handleSubmit}
                                    loading={loading}
                                    error={error}
                                    setStep={setStep}
                                    view="desktop"
                                    styles={styles}
                                    t={t}
                                />
                            )}
                        </div>
                    )}
                </div>

                {/* Mobile Version Rendering */}
                <div className="mobile-register-view">
                    {step === 0 ? (
                        <MobileSelection handleSelectType={handleSelectType} t={t} />
                    ) : (
                        <div className="mobile-form-container">
                            {userType === 'personal' ? (
                                <PersonalForm
                                    formData={formData}
                                    handleChange={handleChange}
                                    handleSubmit={handleSubmit}
                                    loading={loading}
                                    error={error}
                                    setStep={setStep}
                                    view="mobile"
                                    styles={styles}
                                    t={t}
                                />
                            ) : (
                                <BusinessForm
                                    formData={formData}
                                    handleChange={handleChange}
                                    handleSubmit={handleSubmit}
                                    loading={loading}
                                    error={error}
                                    setStep={setStep}
                                    view="mobile"
                                    styles={styles}
                                    t={t}
                                />
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const styles = {
    page: { minHeight: '100vh', backgroundColor: '#f0f2f5', paddingBottom: '5rem' },
    hero: {
        backgroundImage: 'url(/service/service-8.jpg)', backgroundSize: 'cover', backgroundPosition: 'center',
        height: '180px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center'
    },
    heroOverlay: {
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0, 51, 102, 0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center'
    },
    heroTitle: { color: 'white', fontSize: '2.5rem', fontWeight: '800', textTransform: 'uppercase', marginBottom: '0.5rem' },
    heroSubtitle: { color: '#e0e0e0', fontSize: '1.1rem' },

    formContainer: { maxWidth: '1000px', margin: '0 auto', padding: '0 1.5rem', marginTop: '-3rem', position: 'relative', zIndex: 10 },

    // Selection Gateway Styles
    selectionContainer: { textAlign: 'center', backgroundColor: 'white', padding: '4rem 3rem', borderRadius: '20px', boxShadow: '0 20px 50px rgba(0,0,0,0.1)' },
    gatewayTitle: { fontSize: '2rem', color: '#003366', fontWeight: '800', marginBottom: '1rem' },
    gatewaySubtitle: { color: '#666', marginBottom: '3.5rem', fontSize: '1.1rem' },
    cardsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem' },
    selectionCard: {
        background: 'linear-gradient(135deg, #00ccff 0%, #0088cc 100%)', // Pure Blue
        padding: '3rem 2rem',
        borderRadius: '24px',
        cursor: 'pointer',
        textAlign: 'center',
        border: 'none',
        transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        boxShadow: '0 15px 40px rgba(0, 204, 255, 0.3)',
        position: 'relative',
        overflow: 'hidden'
    },
    iconCircle: { width: '80px', height: '80px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', fontSize: '2rem', color: 'white', backdropFilter: 'blur(5px)' },
    iconCircleBlue: { width: '80px', height: '80px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', fontSize: '2rem', color: 'white', backdropFilter: 'blur(5px)' },
    cardTypeTitle: { fontSize: '1.5rem', fontWeight: '800', color: 'white', marginBottom: '1rem' }, // White Title
    cardTypeDesc: { color: 'white', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: '1.5', fontWeight: '500', opacity: 0.95 }, // White/High contrast desc
    cardFeatures: { listStyle: 'none', padding: 0, margin: '0 0 2rem', textAlign: 'left', color: 'black', fontSize: '0.95rem', fontWeight: '700' }, // Black Features
    cardBtn: { width: '100%', padding: '1rem', backgroundColor: 'black', color: 'white', border: 'none', borderRadius: '50px', fontWeight: '800', cursor: 'pointer', boxShadow: '0 5px 15px rgba(0,0,0,0.2)' }, // Black Button
    cardBtnBlue: { width: '100%', padding: '1rem', backgroundColor: 'black', color: 'white', border: 'none', borderRadius: '50px', fontWeight: '800', cursor: 'pointer', boxShadow: '0 5px 15px rgba(0,0,0,0.2)' }, // Black Button

    // Form Styles
    formCard: { backgroundColor: 'white', padding: '4rem', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' },
    formTitle: { fontSize: '2.2rem', color: '#003366', fontWeight: '800', textAlign: 'center', marginBottom: '0.5rem' },
    formSubtitle: { textAlign: 'center', color: '#666', marginBottom: '3.5rem', fontSize: '1rem' },
    section: { marginBottom: '3rem', paddingBottom: '3rem', borderBottom: '1px solid #f0f0f0' },
    sectionNoBorder: { marginBottom: 0 },
    sectionHeading: { fontSize: '1rem', color: '#00ccff', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '2rem' },
    formGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' },
    formGroup: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
    label: { fontSize: '0.9rem', fontWeight: '700', color: '#1a1a1a' },
    input: { padding: '1rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', backgroundColor: '#fcfcfc', outline: 'none' },
    select: { padding: '1rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', backgroundColor: '#fcfcfc', color: '#333', cursor: 'pointer', outline: 'none' },
    checkboxGroup: { display: 'flex', gap: '1rem', marginTop: '2rem', marginBottom: '3rem' },
    checkbox: { width: '20px', height: '20px', cursor: 'pointer' },
    checkboxLabel: { fontSize: '0.9rem', color: '#555', lineHeight: '1.5' },
    submitContainer: { textAlign: 'center' },
    submitBtn: { padding: '1.2rem 4rem', backgroundColor: '#003366', color: 'white', border: 'none', borderRadius: '50px', fontSize: '1.1rem', fontWeight: '800', cursor: 'pointer', boxShadow: '0 10px 25px rgba(0, 51, 102, 0.2)' },
    link: { color: '#00ccff', fontWeight: '700', cursor: 'pointer', textDecoration: 'none' },
};

export default Register;
