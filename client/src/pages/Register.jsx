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
                    <div style={styles.inputWrapper}>
                        <i className="fas fa-lock" style={styles.inputIcon}></i>
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            autoComplete="new-password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            style={{ ...styles.input, paddingRight: '2.5rem' }}
                            className="light-futuristic-input"
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} style={eyeButtonStyle}>
                            <i className={`fas ${showPassword ? 'fa-eye' : 'fa-eye-slash'}`}></i>
                        </button>
                    </div>
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>{t('auth.register.form.fields.confirm_password')} *</label>
                    <div style={styles.inputWrapper}>
                        <i className="fas fa-check-double" style={styles.inputIcon}></i>
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            autoComplete="new-password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            style={{ ...styles.input, paddingRight: '2.5rem' }}
                            className="light-futuristic-input"
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
                    <div style={styles.formGroup}><label style={styles.label}>{t('auth.register.form.fields.firstname')} *</label><div style={styles.inputWrapper}><i className="fas fa-user" style={styles.inputIcon}></i><input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required style={styles.input} className="light-futuristic-input" /></div></div>
                    <div style={styles.formGroup}><label style={styles.label}>{t('auth.register.form.fields.lastname')} *</label><div style={styles.inputWrapper}><i className="fas fa-signature" style={styles.inputIcon}></i><input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required style={styles.input} className="light-futuristic-input" /></div></div>
                    <div style={styles.formGroup}><label style={styles.label}>{t('auth.register.form.fields.dob')} *</label><div style={styles.inputWrapper}><i className="fas fa-calendar-alt" style={styles.inputIcon}></i><input type="date" name="dob" value={formData.dob} onChange={handleChange} required style={styles.input} className="light-futuristic-input" /></div></div>
                    <div style={styles.formGroup}><label style={styles.label}>{t('auth.register.form.fields.birthplace')} *</label><div style={styles.inputWrapper}><i className="fas fa-map-marker-alt" style={styles.inputIcon}></i><input type="text" name="birthPlace" placeholder={t('auth.register.form.fields.birthplace_placeholder')} value={formData.birthPlace} onChange={handleChange} required style={styles.input} className="light-futuristic-input" /></div></div>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>{t('auth.register.form.fields.gender')} *</label>
                        <div style={styles.inputWrapper}><i className="fas fa-venus-mars" style={styles.inputIcon}></i><select name="gender" value={formData.gender} onChange={handleChange} required style={styles.select} className="light-futuristic-input">
                            <option value="">{t('auth.register.form.placeholders.choose')}</option>
                            <option value="M">{t('auth.register.form.options.gender.male')}</option>
                            <option value="F">{t('auth.register.form.options.gender.female')}</option>
                        </select></div>
                    </div>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>{t('auth.register.form.fields.nationality')} *</label>
                        <div style={styles.inputWrapper}><i className="fas fa-globe" style={styles.inputIcon}></i><select name="nationality" value={formData.nationality} onChange={handleChange} required style={styles.select} className="light-futuristic-input">
                            <option value="">{t('auth.register.form.placeholders.select')}</option>
                            {countries.map(c => <option key={c} value={c}>{c}</option>)}
                        </select></div>
                    </div>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>{t('auth.register.form.fields.residence')} *</label>
                        <div style={styles.inputWrapper}><i className="fas fa-home" style={styles.inputIcon}></i><select name="countryOfResidence" value={formData.countryOfResidence} onChange={handleChange} required style={styles.select} className="light-futuristic-input">
                            <option value="">{t('auth.register.form.placeholders.select')}</option>
                            {countries.map(c => <option key={c} value={c}>{c}</option>)}
                        </select></div>
                    </div>
                </div>
            </div>

            <div style={styles.section}>
                <h4 style={styles.sectionHeading}>{t('auth.register.form.coords_section')}</h4>
                <div style={styles.formGrid} className="register-form-grid">
                    <div className="full-width-mobile" style={{ gridColumn: '1/-1' }}><label style={styles.label}>{t('auth.register.form.fields.address')} *</label><div style={styles.inputWrapper}><i className="fas fa-road" style={styles.inputIcon}></i><input type="text" name="address" value={formData.address} onChange={handleChange} required style={styles.input} className="light-futuristic-input" /></div></div>
                    <div style={styles.formGroup}><label style={styles.label}>{t('auth.register.form.fields.zip')} *</label><div style={styles.inputWrapper}><i className="fas fa-mail-bulk" style={styles.inputIcon}></i><input type="text" name="zipCode" value={formData.zipCode} onChange={handleChange} required style={styles.input} className="light-futuristic-input" /></div></div>
                    <div style={styles.formGroup}><label style={styles.label}>{t('auth.register.form.fields.city')} *</label><div style={styles.inputWrapper}><i className="fas fa-city" style={styles.inputIcon}></i><input type="text" name="city" value={formData.city} onChange={handleChange} required style={styles.input} className="light-futuristic-input" /></div></div>
                    <div style={styles.formGroup}><label style={styles.label}>{t('auth.register.form.fields.phone')} *</label><div style={styles.inputWrapper}><i className="fas fa-phone" style={styles.inputIcon}></i><input type="tel" name="phone" value={formData.phone} onChange={handleChange} required style={styles.input} className="light-futuristic-input" /></div></div>
                    <div style={styles.formGroup}><label style={styles.label}>{t('auth.register.form.fields.email')} *</label><div style={styles.inputWrapper}><i className="fas fa-envelope" style={styles.inputIcon}></i><input type="email" name="email" autoComplete="email" value={formData.email} onChange={handleChange} required style={styles.input} className="light-futuristic-input" /></div></div>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>{t('auth.register.form.fields.currency')} *</label>
                        <div style={styles.inputWrapper}><i className="fas fa-coins" style={styles.inputIcon}></i><select name="currency" value={formData.currency} onChange={handleChange} required style={styles.select} className="light-futuristic-input">
                            <option value="EUR">EUR (€)</option><option value="USD">USD ($)</option>
                        </select></div>
                    </div>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>{t('auth.register.form.fields.savings_opt')} *</label>
                        <div style={styles.inputWrapper}><i className="fas fa-piggy-bank" style={styles.inputIcon}></i><select name="accountType" value={formData.accountType} onChange={handleChange} required style={styles.select} className="light-futuristic-input">
                            <option value="standard">{t('auth.register.form.options.account_type.standard')}</option>
                            <option value="savings">{t('auth.register.form.options.account_type.savings')}</option>
                        </select></div>
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
                    <div className="full-width-mobile" style={{ gridColumn: '1/-1' }}><label style={styles.label}>{t('auth.register.form.fields.company_name')} *</label><div style={styles.inputWrapper}><i className="fas fa-building" style={styles.inputIcon}></i><input type="text" name="companyName" value={formData.companyName} onChange={handleChange} required style={styles.input} className="light-futuristic-input" /></div></div>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>{t('auth.register.form.fields.legal_form')} *</label>
                        <div style={styles.inputWrapper}><i className="fas fa-file-contract" style={styles.inputIcon}></i><select name="legalForm" value={formData.legalForm} onChange={handleChange} required style={styles.select} className="light-futuristic-input">
                            <option value="">{t('auth.register.form.placeholders.choose')}</option>
                            <option value="SARL">SARL / EURL</option>
                            <option value="SAS">SAS / SASU</option>
                            <option value="SA">SA</option>
                            <option value="AUTO">{t('auth.register.form.options.legal_form.auto')}</option>
                            <option value="ASSOC">{t('auth.register.form.options.legal_form.assoc')}</option>
                            <option value="OTHER">{t('auth.register.form.options.legal_form.other')}</option>
                        </select></div>
                    </div>
                    <div style={styles.formGroup}><label style={styles.label}>{t('auth.register.form.fields.siret')} *</label><div style={styles.inputWrapper}><i className="fas fa-id-card" style={styles.inputIcon}></i><input type="text" name="registrationNumber" value={formData.registrationNumber} onChange={handleChange} required style={styles.input} className="light-futuristic-input" /></div></div>
                    <div style={styles.formGroup}><label style={styles.label}>{t('auth.register.form.fields.sector')} *</label><div style={styles.inputWrapper}><i className="fas fa-industry" style={styles.inputIcon}></i><input type="text" name="activitySector" value={formData.activitySector} onChange={handleChange} required style={styles.input} className="light-futuristic-input" /></div></div>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>{t('auth.register.form.fields.residence')} *</label>
                        <div style={styles.inputWrapper}><i className="fas fa-home" style={styles.inputIcon}></i><select name="countryOfResidence" value={formData.countryOfResidence} onChange={handleChange} required style={styles.select} className="light-futuristic-input">
                            <option value="">{t('auth.register.form.placeholders.select')}</option>
                            {countries.map(c => <option key={c} value={c}>{c}</option>)}
                        </select></div>
                    </div>
                    <div className="full-width-mobile" style={{ gridColumn: '1/-1' }}><label style={styles.label}>{t('auth.register.form.fields.hq_address')} *</label><div style={styles.inputWrapper}><i className="fas fa-map-marked-alt" style={styles.inputIcon}></i><input type="text" name="address" value={formData.address} onChange={handleChange} required style={styles.input} className="light-futuristic-input" /></div></div>
                </div>
            </div>

            <div style={styles.section}>
                <h4 style={styles.sectionHeading}>{t('auth.register.form.rep_section')}</h4>
                <div style={styles.formGrid} className="register-form-grid">
                    <div style={styles.formGroup}><label style={styles.label}>{t('auth.register.form.fields.firstname')} *</label><div style={styles.inputWrapper}><i className="fas fa-user-tie" style={styles.inputIcon}></i><input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required style={styles.input} className="light-futuristic-input" /></div></div>
                    <div style={styles.formGroup}><label style={styles.label}>{t('auth.register.form.fields.lastname')} *</label><div style={styles.inputWrapper}><i className="fas fa-signature" style={styles.inputIcon}></i><input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required style={styles.input} className="light-futuristic-input" /></div></div>
                    <div style={styles.formGroup}><label style={styles.label}>{t('auth.register.form.fields.birthplace')} *</label><div style={styles.inputWrapper}><i className="fas fa-map-marker-alt" style={styles.inputIcon}></i><input type="text" name="birthPlace" placeholder={t('auth.register.form.fields.birthplace_placeholder')} value={formData.birthPlace} onChange={handleChange} required style={styles.input} className="light-futuristic-input" /></div></div>
                    <div style={styles.formGroup}><label style={styles.label}>{t('auth.register.form.fields.function')} *</label><div style={styles.inputWrapper}><i className="fas fa-briefcase" style={styles.inputIcon}></i><input type="text" name="repFunction" placeholder={t('auth.register.form.fields.function_placeholder')} value={formData.repFunction} onChange={handleChange} required style={styles.input} className="light-futuristic-input" /></div></div>
                    <div style={styles.formGroup}><label style={styles.label}>{t('auth.register.form.fields.pro_email')} *</label><div style={styles.inputWrapper}><i className="fas fa-envelope" style={styles.inputIcon}></i><input type="email" name="email" autoComplete="email" value={formData.email} onChange={handleChange} required style={styles.input} className="light-futuristic-input" /></div></div>
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
        <div style={styles.page} className="register-page auth-page">
            {/* High-Tech Background Elements */}
            <div style={styles.bgGlow1} className="floating-glow-light"></div>
            <div style={styles.bgGlow2} className="floating-glow-light-delayed"></div>
            <div style={styles.gridOverlay}></div>

            {/* Desktop Hero - Hidden on mobile (Refined for light theme) */}
            <section style={styles.hero} className="register-hero desktop-only">
                <div style={styles.heroOverlay}>
                    <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 10 }}>
                        <h1 style={styles.heroTitle} className="register-hero-title">{t('auth.register.title')}</h1>
                        <p style={styles.heroSubtitle}>{t('auth.register.subtitle')}</p>
                    </div>
                </div>
            </section>

            {/* Mobile Header - Visible only on mobile */}
            <div className="mobile-register-header" style={{ position: 'relative', zIndex: 20 }}>
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
                        <div style={styles.selectionCardWrapper} className="glass-light-glow">
                            <SelectionStep handleSelectType={handleSelectType} styles={styles} t={t} />
                        </div>
                    ) : (
                        <div style={styles.formCard} className="register-form-card glass-light-glow">
                            <div style={styles.logoWrapper}>
                                <img src="/logo-new.png" alt="Logo" style={styles.miniLogo} />
                            </div>
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
                        <div className="mobile-form-container glass-light-glow" style={{ borderRadius: '24px', padding: '1rem', background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(20px)' }}>
                            <div style={styles.logoWrapper}>
                                <img src="/logo-new.png" alt="Logo" style={styles.miniLogo} />
                            </div>
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

            <style>
                {`
                    .register-page {
                        position: relative;
                        overflow-x: hidden;
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
                        width: 100%;
                        border-radius: 8px;
                        font-family: inherit;
                        outline: none;
                        transition: all 0.3s ease;
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
                    .register-submit-btn {
                        background: linear-gradient(135deg, #003366 0%, #0066cc 100%) !important;
                        color: white !important;
                        transition: all 0.3s ease !important;
                        border: none !important;
                        position: relative;
                        overflow: hidden;
                    }
                    .register-submit-btn::after {
                        content: '';
                        position: absolute;
                        top: -50%;
                        left: -100%;
                        width: 100%;
                        height: 200%;
                        background: linear-gradient(
                            to right,
                            rgba(255, 255, 255, 0) 0%,
                            rgba(255, 255, 255, 0.2) 50%,
                            rgba(255, 255, 255, 0) 100%
                        );
                        transform: rotate(25deg);
                        transition: all 0.8s;
                    }
                    .register-submit-btn:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 10px 20px rgba(0, 51, 102, 0.2) !important;
                    }
                    .register-submit-btn:hover::after {
                        left: 150%;
                    }
                    .secondary-btn-glow {
                        background: linear-gradient(135deg, #00ccff 0%, #0088cc 100%) !important;
                        border: none !important;
                        color: white !important;
                        transition: all 0.3s ease !important;
                    }
                    .secondary-btn-glow:hover {
                        background: linear-gradient(135deg, #00eeff 0%, #00ccff 100%) !important;
                        transform: translateY(-2px);
                        box-shadow: 0 8px 20px rgba(0, 204, 255, 0.3) !important;
                    }
                    @keyframes fadeInUp {
                        from { opacity: 0; transform: translateY(15px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    .register-selection-item {
                        transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) !important;
                    }
                    .register-selection-item:hover {
                        transform: translateY(-8px) scale(1.02);
                        box-shadow: 0 25px 50px rgba(0, 204, 255, 0.4) !important;
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
        paddingBottom: '5rem',
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
    hero: {
        backgroundImage: 'url(/service/service-8.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '140px', // Reduced height for more compact look
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    heroOverlay: {
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0, 51, 102, 0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    heroTitle: { color: 'white', fontSize: '2rem', fontWeight: '900', textTransform: 'uppercase', marginBottom: '0.3rem', letterSpacing: '1px' },
    heroSubtitle: { color: '#f0f9ff', fontSize: '1rem', fontWeight: '500', opacity: 0.9 },

    formContainer: { maxWidth: '1000px', margin: '0 auto', padding: '0 1.5rem', marginTop: '-2.5rem', position: 'relative', zIndex: 10 },

    // Selection Gateway Styles
    selectionContainer: { textAlign: 'center' },
    selectionCardWrapper: {
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        padding: '3rem 2rem',
        borderRadius: '24px',
    },
    gatewayTitle: { fontSize: '1.8rem', color: '#001a33', fontWeight: '900', marginBottom: '0.5rem', letterSpacing: '-1px' },
    gatewaySubtitle: { color: '#526b8a', marginBottom: '2.5rem', fontSize: '1rem', fontWeight: '500' },
    cardsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' },
    selectionCard: {
        background: 'linear-gradient(135deg, #003366 0%, #0066cc 100%)',
        padding: '2.5rem 2rem',
        borderRadius: '20px',
        cursor: 'pointer',
        textAlign: 'center',
        transition: 'all 0.3s ease',
        boxShadow: '0 12px 30px rgba(0, 51, 102, 0.2)',
        position: 'relative',
        overflow: 'hidden'
    },
    iconCircle: { width: '70px', height: '70px', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', fontSize: '1.8rem', color: 'white', backdropFilter: 'blur(5px)' },
    iconCircleBlue: { width: '70px', height: '70px', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', fontSize: '1.8rem', color: 'white', backdropFilter: 'blur(5px)' },
    cardTypeTitle: { fontSize: '1.4rem', fontWeight: '800', color: 'white', marginBottom: '0.8rem' },
    cardTypeDesc: { color: 'rgba(255,255,255,0.9)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: '1.4', fontWeight: '500' },
    cardFeatures: { listStyle: 'none', padding: 0, margin: '0 0 1.5rem', textAlign: 'left', color: 'white', fontSize: '0.85rem', fontWeight: '600' },
    cardBtn: { width: '100%', padding: '0.8rem', backgroundColor: 'white', color: '#003366', border: 'none', borderRadius: '10px', fontWeight: '800', cursor: 'pointer', fontSize: '0.9rem' },
    cardBtnBlue: { width: '100%', padding: '0.8rem', backgroundColor: 'white', color: '#003366', border: 'none', borderRadius: '10px', fontWeight: '800', cursor: 'pointer', fontSize: '0.9rem' },

    // Form Styles
    formCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        padding: '2rem 2.5rem',
        borderRadius: '24px',
    },
    logoWrapper: {
        textAlign: 'center',
        marginBottom: '1rem'
    },
    miniLogo: {
        height: '50px',
        width: 'auto',
    },
    formTitle: { fontSize: '1.8rem', color: '#001a33', fontWeight: '900', textAlign: 'center', marginBottom: '0.2rem', letterSpacing: '-1px' },
    formSubtitle: { textAlign: 'center', color: '#526b8a', marginBottom: '2rem', fontSize: '0.9rem', fontWeight: '500' },
    section: { marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid rgba(0, 51, 102, 0.05)' },
    sectionNoBorder: { marginBottom: 0 },
    sectionHeading: { fontSize: '0.75rem', color: '#00ccff', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '1.2rem' },
    formGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' },
    formGroup: { display: 'flex', flexDirection: 'column', gap: '0.3rem' },
    label: { fontSize: '0.65rem', fontWeight: '800', color: '#003366', textTransform: 'uppercase', letterSpacing: '1px' },
    inputWrapper: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
    },
    inputIcon: {
        position: 'absolute',
        left: '1rem',
        color: '#0066cc',
        fontSize: '0.85rem',
        zIndex: 2,
        opacity: 0.7
    },
    input: { padding: '0.7rem 0.9rem', borderRadius: '8px', border: '1px solid rgba(0, 102, 204, 0.15)', fontSize: '0.9rem', backgroundColor: 'rgba(255,255,255,0.4)', outline: 'none', fontWeight: '600', color: '#003366' },
    select: { padding: '0.7rem 0.9rem', borderRadius: '8px', border: '1px solid rgba(0, 102, 204, 0.15)', fontSize: '0.9rem', backgroundColor: 'rgba(255,255,255,0.4)', color: '#003366', cursor: 'pointer', outline: 'none', fontWeight: '600' },
    checkboxGroup: { display: 'flex', gap: '0.8rem', marginTop: '1.5rem', marginBottom: '2rem', alignItems: 'flex-start' },
    checkbox: { width: '18px', height: '18px', cursor: 'pointer', marginTop: '2px' },
    checkboxLabel: { fontSize: '0.8rem', color: '#526b8a', lineHeight: '1.4', fontWeight: '500' },
    submitContainer: { textAlign: 'center' },
    submitBtn: { padding: '0.9rem 3rem', borderRadius: '10px', fontSize: '1rem', fontWeight: '800', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '1px' },
    link: { color: '#0088cc', fontWeight: '700', cursor: 'pointer', textDecoration: 'none', transition: 'all 0.3s ease' },
    bgGlow1: {},
    bgGlow2: {}
};

export default Register;
