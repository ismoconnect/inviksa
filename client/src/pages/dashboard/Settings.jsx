import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { settingsService } from '../../services/settingsService';

const Settings = () => {
    const { userData, updateUserData, changePassword } = useAuth();
    const [globalSettings, setGlobalSettings] = useState({ hideLanguageSelector: false });
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [status, setStatus] = useState({ type: '', text: '' });
    const [activeTab, setActiveTab] = useState('profile');
    const { t, i18n } = useTranslation();

    const [passwordData, setPasswordData] = useState({ current: '', new: '', confirm: '' });
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passStrength, setPassStrength] = useState(0);

    // Helper function to convert old language names to codes
    const getLanguageCode = (lang) => {
        const nameToCode = {
            'Français': 'fr',
            'English': 'en',
            'Español': 'es',
            'Italiano': 'it',
            'Português': 'pt',
            'Deutsch': 'de'
        };
        // If it's already a code (2 chars), return it
        if (lang && lang.length === 2) return lang;
        // If it's a name, convert it
        return nameToCode[lang] || i18n.language || 'fr';
    };

    const [editData, setEditData] = useState({
        firstName: userData?.firstName || '',
        lastName: userData?.lastName || '',
        phone: userData?.phone || '',
        address: userData?.address || '',
        city: userData?.city || '',
        zipCode: userData?.zipCode || '',
        countryOfResidence: userData?.countryOfResidence || '',
        nationality: userData?.nationality || '',
        dob: userData?.dob || '',
        birthPlace: userData?.birthPlace || '',
        gender: userData?.gender || '',
        // PRO FIELDS
        companyName: userData?.companyName || '',
        legalForm: userData?.legalForm || '',
        siret: userData?.siret || '',
        creationDate: userData?.creationDate || '',
        vatNumber: userData?.vatNumber || '',
        sector: userData?.sector || '',

        notificationsEnabled: userData?.notificationsEnabled ?? true,
        language: getLanguageCode(userData?.language)
    });

    React.useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const unsubscribe = settingsService.subscribeToGlobalSettings((settings) => {
            setGlobalSettings(settings);
        });
        return () => unsubscribe();
    }, []);

    // Sync userData to local editData state when it loads
    useEffect(() => {
        if (userData) {
            setEditData({
                firstName: userData.firstName || '',
                lastName: userData.lastName || '',
                phone: userData.phone || '',
                address: userData.address || '',
                city: userData.city || '',
                zipCode: userData.zipCode || '',
                countryOfResidence: userData.countryOfResidence || '',
                nationality: userData.nationality || '',
                dob: userData.dob || '',
                birthPlace: userData.birthPlace || '',
                gender: userData.gender || '',
                // PRO FIELDS
                companyName: userData.companyName || '',
                legalForm: userData.legalForm || '',
                siret: userData.siret || '',
                creationDate: userData.creationDate || '',
                vatNumber: userData.vatNumber || '',
                sector: userData.sector || '',

                notificationsEnabled: userData.notificationsEnabled ?? true,
                language: getLanguageCode(userData.language)
            });

            // Auto-migrate old language names to codes in the database
            const currentLang = userData.language;
            if (currentLang && currentLang.length > 2) {
                const langCode = getLanguageCode(currentLang);
                updateUserData({ language: langCode }).catch(err =>
                    console.warn('Failed to migrate language to code:', err)
                );
            }
        }
    }, [userData, i18n.language]);

    const handleSave = async () => {
        try {
            await updateUserData(editData);
            setStatus({ type: 'success', text: t('settings.messages.success') });
            setTimeout(() => setStatus({ type: '', text: '' }), 5000);
        } catch (err) {
            setStatus({ type: 'error', text: t('settings.messages.error') });
        }
    };

    const handleLanguageChange = async (newLangCode) => {
        try {
            // 1. Always update Firestore with the LANGUAGE CODE (not the name)
            // This ensures email templates work correctly
            if (userData?.language !== newLangCode) {
                await updateUserData({ language: newLangCode });
                console.log(`Synchronisation de la langue vers Firestore : ${newLangCode}`);
            }

            // 2. Navigation / UI Update
            // We only need to reload/change language if the code is actually different
            if (newLangCode !== i18n.language) {
                const currentPath = window.location.pathname;
                const pathParts = currentPath.split('/');

                if (pathParts[1] && ['fr', 'en', 'es', 'it', 'pt', 'de'].includes(pathParts[1])) {
                    pathParts[1] = newLangCode;
                }

                const newPath = pathParts.join('/');
                i18n.changeLanguage(newLangCode);
                window.location.href = newPath;
            } else {
                // If code is same but we updated Firestore, maybe just show a success message
                setStatus({ type: 'success', text: t('settings.messages.success') });
                setTimeout(() => setStatus({ type: '', text: '' }), 5000);
            }
        } catch (err) {
            console.error("Erreur lors de la synchronisation de la langue :", err);
            if (newLangCode !== i18n.language) {
                i18n.changeLanguage(newLangCode);
            }
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (passwordData.new !== passwordData.confirm) {
            setStatus({ type: 'error', text: t('settings.messages.pwd_mismatch') });
            return;
        }
        if (passwordData.new.length < 8) {
            setStatus({ type: 'error', text: t('settings.messages.pwd_short') });
            return;
        }
        try {
            await changePassword(passwordData.new);
            setStatus({ type: 'success', text: t('settings.messages.pwd_success') });
            setPasswordData({ current: '', new: '', confirm: '' });
            setTimeout(() => setStatus({ type: '', text: '' }), 5000);
        } catch (err) {
            setStatus({ type: 'error', text: t('settings.messages.pwd_error') });
        }
    };

    const checkStrength = (pass) => {
        let score = 0;
        if (pass.length > 8) score++;
        if (/[A-Z]/.test(pass)) score++;
        if (/[0-9]/.test(pass)) score++;
        if (/[^a-zA-Z0-9]/.test(pass)) score++;
        setPassStrength(score);
    };

    const renderInput = (label, name, icon, type = "text", disabled = false) => (
        <div style={styles.formGroup}>
            <label style={styles.label}>{label}</label>
            <div style={styles.inputWrapper}>
                {icon && <i className={icon} style={styles.inputIcon}></i>}
                <input
                    type={type}
                    style={{ ...styles.input, paddingLeft: icon ? '45px' : '16px', backgroundColor: disabled ? '#f8fafc' : 'white' }}
                    value={editData[name] || ''}
                    onChange={e => setEditData({ ...editData, [name]: e.target.value })}
                    disabled={disabled}
                />
            </div>
        </div>
    );

    const renderTextarea = (label, name, icon, placeholder = '', rows = 2) => (
        <div style={styles.formGroup}>
            <label style={styles.label}>{label}</label>
            <div style={styles.inputWrapper}>
                {icon && <i className={icon} style={{ ...styles.inputIcon, top: '16px' }}></i>}
                <textarea
                    style={{
                        ...styles.input,
                        paddingLeft: icon ? '45px' : '16px',
                        minHeight: `${rows * 2.5}rem`,
                        resize: 'vertical',
                        fontFamily: 'inherit',
                        lineHeight: '1.5'
                    }}
                    placeholder={placeholder}
                    value={editData[name] || ''}
                    onChange={e => setEditData({ ...editData, [name]: e.target.value })}
                    rows={rows}
                />
            </div>
        </div>
    );


    if (isMobile) {
        return (
            <div style={{ padding: '1rem', paddingBottom: '3rem' }}>
                <h1 style={styles.mobileTitle}>{t('settings.tabs.profile')}</h1>

                <div style={styles.mobileTabs}>
                    <button style={activeTab === 'profile' ? styles.mobileTabActive : styles.mobileTab} onClick={() => setActiveTab('profile')}>{t('settings.tabs.profile')}</button>
                    <button style={activeTab === 'security' ? styles.mobileTabActive : styles.mobileTab} onClick={() => setActiveTab('security')}>{t('settings.tabs.security')}</button>
                    <button style={activeTab === 'prefs' ? styles.mobileTabActive : styles.mobileTab} onClick={() => setActiveTab('prefs')}>{t('settings.tabs.prefs')}</button>
                </div>

                <div className="fadeIn" key={activeTab}>
                    {activeTab === 'profile' && (
                        <div style={styles.mobileGlassCard}>
                            <div style={styles.mobileSectionHeader}>{t('settings.profile.client_folder')}</div>
                            <div style={styles.mobileIdBox}>
                                <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 'bold' }}>{t('settings.profile.login_id')}</div>
                                <div style={{ color: '#0f172a', fontWeight: 'bold', wordWrap: 'break-word', overflowWrap: 'break-word', wordBreak: 'break-word' }}>{userData?.email}</div>
                            </div>
                            {renderInput(t('settings.profile.first_name'), 'firstName', 'fas fa-user')}
                            {renderInput(t('settings.profile.last_name'), 'lastName', 'fas fa-id-card')}
                            {renderInput(t('settings.profile.dob'), 'dob', 'fas fa-calendar-alt', 'date')}
                            {renderInput(t('settings.profile.pob'), 'birthPlace', 'fas fa-map-marker-alt')}
                            {renderInput(t('settings.profile.phone'), 'phone', 'fas fa-phone')}
                            <div style={{ ...styles.mobileSectionHeader, marginTop: '20px' }}>{t('settings.profile.location')}</div>
                            {renderTextarea(t('settings.profile.address'), 'address', 'fas fa-map-marker-alt', '123 Rue de la République, Apt 4B', 2)}
                            <div style={{ display: 'flex', gap: '10px' }}>
                                {renderInput(t('settings.profile.city'), 'city', null)}
                                {renderInput(t('settings.profile.zip'), 'zipCode', null)}
                            </div>

                            <div style={{ ...styles.mobileSectionHeader, marginTop: '30px', borderTop: '1px solid #f1f5f9', paddingTop: '20px' }}>{t('settings.advisor.title')}</div>
                            <div style={styles.advisorCardMobile}>
                                <img src={userData?.advisorPhoto || "/advisor.png"} alt="Conseiller" style={styles.advisorAvatarMobile} />
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 'bold', color: '#003366', fontSize: '1.1rem' }}>{userData?.advisorName || 'Thomas Muller'}</div>
                                    <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '4px' }}>{userData?.advisorRole || t('settings.advisor.role')}</div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.85rem', color: '#16a34a', fontWeight: 'bold' }}>
                                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e' }}></div> {t('settings.advisor.available')}
                                    </div>
                                </div>
                            </div>

                            <div style={styles.advisorMobileDetails}>
                                <a href={`mailto:${userData?.advisorEmail || 't.muller@invik-sa.com'}`} style={styles.advisorMobileItem}>
                                    <i className="fas fa-envelope" style={{ color: '#003366', width: '20px' }}></i>
                                    <span style={{ color: '#64748b', fontSize: '0.9rem' }}>{userData?.advisorEmail || 't.muller@invik-sa.com'}</span>
                                </a>
                                <a href={`tel:${userData?.advisorPhone || '+33170950000'}`} style={styles.advisorMobileItem}>
                                    <i className="fas fa-phone-alt" style={{ color: '#003366', width: '20px' }}></i>
                                    <span style={{ color: '#64748b', fontSize: '0.9rem' }}>{userData?.advisorPhone || '+33 1 70 95 00 00'}</span>
                                </a>
                            </div>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div style={styles.mobileGlassCard}>
                            <div style={styles.mobileSectionHeader}>{t('settings.security.password_title')}</div>
                            <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '20px' }}>
                                {t('settings.security.password_desc')}
                            </p>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>{t('settings.security.new_password')}</label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type={showNewPassword ? "text" : "password"}
                                        style={{ ...styles.input, paddingRight: '3.5rem' }}
                                        placeholder="••••••••"
                                        value={passwordData.new}
                                        onChange={e => {
                                            setPasswordData({ ...passwordData, new: e.target.value });
                                            checkStrength(e.target.value);
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        style={{
                                            position: 'absolute',
                                            right: '1rem',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            background: 'none',
                                            border: 'none',
                                            color: '#94a3b8',
                                            cursor: 'pointer',
                                            fontSize: '1rem',
                                            zIndex: 2
                                        }}
                                    >
                                        <i className={`fas ${showNewPassword ? 'fa-eye' : 'fa-eye-slash'}`}></i>
                                    </button>
                                </div>
                                <div style={{
                                    height: '4px', background: '#f1f5f9', borderRadius: '2px', marginTop: '8px', overflow: 'hidden'
                                }}>
                                    <div style={{
                                        height: '100%',
                                        width: `${(passStrength / 4) * 100}%`,
                                        background: passStrength < 2 ? '#ef4444' : passStrength < 4 ? '#f59e0b' : '#22c55e',
                                        transition: '0.3s'
                                    }}></div>
                                </div>
                            </div>

                            <div style={{ ...styles.formGroup, marginTop: '15px' }}>
                                <label style={styles.label}>{t('settings.security.confirm_password')}</label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        style={{ ...styles.input, paddingRight: '3.5rem' }}
                                        placeholder="••••••••"
                                        value={passwordData.confirm}
                                        onChange={e => setPasswordData({ ...passwordData, confirm: e.target.value })}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        style={{
                                            position: 'absolute',
                                            right: '1rem',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            background: 'none',
                                            border: 'none',
                                            color: '#94a3b8',
                                            cursor: 'pointer',
                                            fontSize: '1rem',
                                            zIndex: 2
                                        }}
                                    >
                                        <i className={`fas ${showConfirmPassword ? 'fa-eye' : 'fa-eye-slash'}`}></i>
                                    </button>
                                </div>
                            </div>

                            {status.text && (
                                <div style={{
                                    padding: '12px',
                                    borderRadius: '12px',
                                    background: status.type === 'success' ? '#f0fdf4' : '#fef2f2',
                                    color: status.type === 'success' ? '#15803d' : '#b91c1c',
                                    fontSize: '0.85rem',
                                    textAlign: 'center',
                                    marginTop: '15px',
                                    fontWeight: '600'
                                }}>
                                    {status.text}
                                </div>
                            )}

                            <button style={{ ...styles.mobileSaveBtn, marginTop: '20px' }} onClick={handlePasswordChange}>
                                {t('settings.security.update_pwd_btn')}
                            </button>

                            <div style={{ marginTop: '30px', padding: '15px', background: '#f8fafc', borderRadius: '15px' }}>
                                <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#003366', marginBottom: '10px' }}>{t('settings.security.security_tips')}</div>
                                <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.75rem', color: '#64748b', lineHeight: '1.6' }}>
                                    <li>{t('settings.security.tip_8_chars')}</li>
                                    <li>{t('settings.security.tip_caps')}</li>
                                    <li>{t('settings.security.tip_special')}</li>
                                    <li>{t('settings.security.tip_avoid_personal')}</li>
                                </ul>
                            </div>
                        </div>
                    )}

                    {activeTab === 'prefs' && (
                        <div style={styles.mobileGlassCard}>
                            <div style={styles.mobileSectionHeader}>{t('settings.preferences.personalization')}</div>
                            {!globalSettings.hideLanguageSelector ? (
                                <div style={styles.mobileActionRow}>
                                    <div style={styles.mobileActionIcon}><i className="fas fa-language"></i></div>
                                    <div style={{ flex: 1 }}><strong>{t('settings.preferences.lang_label')}</strong></div>
                                    <select
                                        style={styles.mobileSelect}
                                        value={i18n.language}
                                        onChange={(e) => handleLanguageChange(e.target.value)}
                                    >
                                        <option value="fr">Français</option>
                                        <option value="en">English</option>
                                        <option value="es">Español</option>
                                        <option value="it">Italiano</option>
                                        <option value="pt">Português</option>
                                        <option value="de">Deutsch</option>
                                    </select>
                                </div>
                            ) : (
                                <div style={{ padding: '10px', textAlign: 'center', color: '#64748b', fontSize: '0.8rem' }}>
                                    {t('settings.preferences.lang_locked', 'Le changement de langue est actuellement indisponible.')}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {activeTab !== 'security' && (
                    <button style={styles.mobileSaveBtn} onClick={handleSave}>{t('settings.profile.save_btn')}</button>
                )}
                {status.text && <p style={{ textAlign: 'center', color: status.type === 'success' ? '#22c55e' : '#ef4444', marginTop: '15px', fontSize: '0.9rem' }}>{status.text}</p>}
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h1 style={styles.title}>{t('settings.title')}</h1>
                <p style={styles.subtitle}>{t('settings.subtitle')}</p>
            </header>

            <div style={styles.premiumCard}>
                <div style={styles.sidebar}>
                    <button style={activeTab === 'profile' ? styles.sideTabActive : styles.sideTab} onClick={() => setActiveTab('profile')}>
                        <i className="fas fa-user-circle"></i> {t('settings.tabs.my_info')}
                    </button>
                    <button style={activeTab === 'security' ? styles.sideTabActive : styles.sideTab} onClick={() => setActiveTab('security')}>
                        <i className="fas fa-shield-alt"></i> {t('settings.tabs.security_access')}
                    </button>
                    <button style={activeTab === 'prefs' ? styles.sideTabActive : styles.sideTab} onClick={() => setActiveTab('prefs')}>
                        <i className="fas fa-sliders-h"></i> {t('settings.tabs.preferences')}
                    </button>

                    <div style={styles.securityIndicator}>
                        <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 'bold', marginBottom: '10px' }}>{t('settings.security.protection_level')}</div>
                        <div style={styles.securityBar}><div style={{ ...styles.securityFill, width: '75%' }}></div></div>
                        <div style={{ fontSize: '0.75rem', marginTop: '10px', color: '#475569' }}>{t('settings.security.optimal_verified')}</div>
                    </div>
                </div>

                <div style={styles.content}>
                    <div className="fadeIn" key={activeTab}>
                        {activeTab === 'profile' && (
                            <>
                                <h2 style={styles.contentTitle}>{t('settings.profile.title')}</h2>
                                <div style={styles.profileSummary}>
                                    <div>
                                        <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 'bold' }}>{t('settings.profile.email_contact')}</div>
                                        <div style={{ fontSize: '1.2rem', color: '#003366', fontWeight: 'bold' }}>{userData?.email}</div>
                                    </div>
                                    <div style={styles.statusChip}>{t('settings.profile.email_verified')} <i className="fas fa-check-circle"></i></div>
                                </div>
                                {/* Detect if Pro Account */}
                                {(userData?.companyName || userData?.accountType === 'business') ? (
                                    // PROFESSIONAL PROFILE
                                    <div style={styles.formGrid}>
                                        {renderInput(t('settings.profile.legal_rep_first'), 'firstName', 'fas fa-user')}
                                        {renderInput(t('settings.profile.legal_rep_last'), 'lastName', 'fas fa-id-card')}
                                        {renderInput(t('settings.profile.company_name'), 'companyName', 'fas fa-building')}
                                        {renderInput(t('settings.profile.legal_form'), 'legalForm', 'fas fa-gavel')}
                                        {renderInput(t('settings.profile.siret'), 'siret', 'fas fa-fingerprint')}
                                        {renderInput(t('settings.profile.vat'), 'vatNumber', 'fas fa-percent')}
                                        {renderInput(t('settings.profile.sector'), 'sector', 'fas fa-briefcase')}
                                        {renderInput(t('settings.profile.phone'), 'phone', 'fas fa-phone-alt')}
                                        {renderInput(t('settings.profile.creation_date'), 'creationDate', 'fas fa-calendar-alt', 'date')}
                                        {renderInput(t('settings.profile.city'), 'city', 'fas fa-city')}
                                        <div style={{ gridColumn: '1 / -1' }}>{renderTextarea(t('settings.profile.headquarters'), 'address', 'fas fa-map-marked-alt', '123 Avenue des Champs-Élysées, 75008 Paris', 2)}</div>
                                        {renderInput(t('settings.profile.zip'), 'zipCode', null)}
                                        {renderInput(t('settings.profile.country'), 'countryOfResidence', 'fas fa-globe')}
                                    </div>
                                ) : (
                                    // PERSONAL PROFILE
                                    <div style={styles.formGrid}>
                                        {renderInput(t('settings.profile.first_name'), 'firstName', 'fas fa-user')}
                                        {renderInput(t('settings.profile.last_name'), 'lastName', 'fas fa-id-card')}
                                        {renderInput(t('settings.profile.phone'), 'phone', 'fas fa-phone-alt')}
                                        {renderInput(t('settings.profile.nationality'), 'nationality', 'fas fa-flag')}
                                        {renderInput(t('settings.profile.dob'), 'dob', 'fas fa-calendar-alt', 'date')}
                                        {renderInput(t('settings.profile.pob'), 'birthPlace', 'fas fa-map-marker-alt')}
                                        <div style={{ gridColumn: '1 / -1' }}>{renderTextarea(t('settings.profile.address'), 'address', 'fas fa-map-marked-alt', '123 Rue de la République, Apt 4B', 2)}</div>
                                        {renderInput(t('settings.profile.city'), 'city', null)}
                                        {renderInput(t('settings.profile.zip'), 'zipCode', null)}
                                    </div>
                                )}

                                <div style={{ marginTop: '4rem', borderTop: '1px solid #f1f5f9', paddingTop: '3rem' }}>
                                    <h3 style={{ ...styles.label, marginBottom: '2rem', color: '#003366' }}>{t('settings.advisor.title')}</h3>
                                    <div style={styles.advisorCard}>
                                        <div style={styles.advisorInfo}>
                                            <img src={userData?.advisorPhoto || "/advisor.png"} alt={userData?.advisorName || "Thomas Muller"} style={styles.advisorAvatar} />
                                            <div>
                                                <div style={styles.advisorName}>{userData?.advisorName || 'Thomas Muller'}</div>
                                                <div style={styles.advisorRole}>{userData?.advisorRole || t('settings.advisor.role')}</div>
                                                <div style={styles.advisorStatus}>
                                                    <span style={styles.statusDot}></span> {t('settings.advisor.available')}
                                                </div>
                                            </div>
                                        </div>
                                        <div style={styles.advisorContacts}>
                                            <div style={styles.advisorContactItem}>
                                                <i className="fas fa-envelope" style={styles.contactIcon}></i>
                                                <div>
                                                    <div style={styles.contactLabel}>{t('settings.advisor.email_label')}</div>
                                                    <div style={styles.contactValue}>{userData?.advisorEmail || 't.muller@invik-sa.com'}</div>
                                                </div>
                                            </div>
                                            <div style={styles.advisorContactItem}>
                                                <i className="fas fa-phone-alt" style={styles.contactIcon}></i>
                                                <div>
                                                    <div style={styles.contactLabel}>{t('settings.advisor.phone_label')}</div>
                                                    <div style={styles.contactValue}>{userData?.advisorPhone || '+33 1 70 95 00 00'}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {activeTab === 'security' && (
                            <>
                                <h2 style={styles.contentTitle}>{t('settings.security.title')}</h2>
                                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '3rem' }}>
                                    <div>
                                        <div style={{ background: '#f8fafc', padding: '2.5rem', borderRadius: '30px', border: '1px solid #f1f5f9' }}>
                                            <h3 style={{ margin: '0 0 1rem', fontSize: '1.2rem', color: '#003366' }}>{t('settings.security.update_access_btn')}</h3>
                                            <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '2rem' }}>
                                                {t('settings.security.password_desc')}
                                            </p>

                                            <form onSubmit={handlePasswordChange}>
                                                <div style={styles.formGroup}>
                                                    <label style={styles.label}>{t('settings.security.new_password')}</label>
                                                    <div style={{ position: 'relative' }}>
                                                        <input
                                                            type={showNewPassword ? "text" : "password"}
                                                            style={{ ...styles.input, paddingRight: '3.5rem' }}
                                                            placeholder="••••••••"
                                                            value={passwordData.new}
                                                            onChange={e => {
                                                                setPasswordData({ ...passwordData, new: e.target.value });
                                                                checkStrength(e.target.value);
                                                            }}
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                                            style={{
                                                                position: 'absolute',
                                                                right: '1rem',
                                                                top: '50%',
                                                                transform: 'translateY(-50%)',
                                                                background: 'none',
                                                                border: 'none',
                                                                color: '#94a3b8',
                                                                cursor: 'pointer',
                                                                fontSize: '1rem',
                                                                zIndex: 2
                                                            }}
                                                        >
                                                            <i className={`fas ${showNewPassword ? 'fa-eye' : 'fa-eye-slash'}`}></i>
                                                        </button>
                                                    </div>
                                                    <div style={{
                                                        height: '4px', background: '#eceef1', borderRadius: '2px', marginTop: '10px', overflow: 'hidden'
                                                    }}>
                                                        <div style={{
                                                            height: '100%',
                                                            width: `${(passStrength / 4) * 100}%`,
                                                            background: passStrength < 2 ? '#ef4444' : passStrength < 4 ? '#f59e0b' : '#22c55e',
                                                            transition: '0.4s cubic-bezier(0.1, 0.7, 1.0, 0.1)'
                                                        }}></div>
                                                    </div>
                                                    <div style={{ fontSize: '0.75rem', marginTop: '5px', color: passStrength < 2 ? '#ef4444' : '#64748b' }}>
                                                        {t('settings.security.strength.label')} {passStrength < 2 ? t('settings.security.strength.weak') : passStrength < 4 ? t('settings.security.strength.medium') : t('settings.security.strength.excellent')}
                                                    </div>
                                                </div>

                                                <div style={{ ...styles.formGroup, marginTop: '1.5rem' }}>
                                                    <label style={styles.label}>{t('settings.security.confirm_password')}</label>
                                                    <div style={{ position: 'relative' }}>
                                                        <input
                                                            type={showConfirmPassword ? "text" : "password"}
                                                            style={{ ...styles.input, paddingRight: '3.5rem' }}
                                                            placeholder="••••••••"
                                                            value={passwordData.confirm}
                                                            onChange={e => setPasswordData({ ...passwordData, confirm: e.target.value })}
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                            style={{
                                                                position: 'absolute',
                                                                right: '1rem',
                                                                top: '50%',
                                                                transform: 'translateY(-50%)',
                                                                background: 'none',
                                                                border: 'none',
                                                                color: '#94a3b8',
                                                                cursor: 'pointer',
                                                                fontSize: '1rem',
                                                                zIndex: 2
                                                            }}
                                                        >
                                                            <i className={`fas ${showConfirmPassword ? 'fa-eye' : 'fa-eye-slash'}`}></i>
                                                        </button>
                                                    </div>
                                                </div>

                                                {status.text && (
                                                    <div style={{
                                                        margin: '20px 0 10px',
                                                        padding: '12px 20px',
                                                        borderRadius: '15px',
                                                        background: status.type === 'success' ? '#f0fdf4' : '#fef2f2',
                                                        color: status.type === 'success' ? '#15803d' : '#b91c1c',
                                                        fontSize: '0.9rem',
                                                        fontWeight: 'bold',
                                                        textAlign: 'center',
                                                        border: `1px solid ${status.type === 'success' ? '#15803d20' : '#b91c1c20'}`
                                                    }}>
                                                        {status.text}
                                                    </div>
                                                )}

                                                <button type="submit" style={{ ...styles.saveBtn, marginTop: '1rem', width: '100%' }}>
                                                    {t('settings.security.update_access_btn')}
                                                </button>
                                            </form>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                        <div style={{ ...styles.optionCard, background: 'white' }}>
                                            <div style={styles.optionIcon}><i className="fas fa-history"></i></div>
                                            <div>
                                                <div style={{ fontWeight: 'bold' }}>{t('settings.security.last_mod')}</div>
                                                <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{t('settings.security.days_ago', { count: 14 })}</div>
                                            </div>
                                        </div>
                                        <div style={{ ...styles.optionCard, background: 'white' }}>
                                            <div style={styles.optionIcon}><i className="fas fa-lock"></i></div>
                                            <div>
                                                <div style={{ fontWeight: 'bold' }}>{t('settings.security.encrypted_storage')}</div>
                                                <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{t('settings.security.protected_aes')}</div>
                                            </div>
                                        </div>
                                        <div style={{ padding: '2rem', borderRadius: '30px', background: '#00336605', border: '1px dashed #00336620' }}>
                                            <div style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#003366', marginBottom: '1rem' }}>
                                                <i className="fas fa-lightbulb" style={{ marginRight: '10px' }}></i> {t('settings.security.security_reqs')}
                                            </div>
                                            <ul style={{ margin: 0, paddingLeft: '1.5rem', fontSize: '0.85rem', color: '#64748b', lineHeight: '1.8' }}>
                                                <li>{t('settings.security.tip_8_chars')}</li>
                                                <li>{t('settings.security.tip_caps')}</li>
                                                <li>{t('settings.security.tip_numbers')}</li>
                                                <li>{t('settings.security.tip_special')}</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {activeTab === 'prefs' && (
                            <>
                                <h2 style={styles.contentTitle}>{t('settings.preferences.title')}</h2>
                                <div style={styles.prefBox}>
                                    {!globalSettings.hideLanguageSelector ? (
                                        <div style={{ ...styles.prefRow, borderBottom: 'none' }}>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontWeight: 'bold' }}>{t('settings.preferences.lang_label')}</div>
                                                <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{t('settings.preferences.lang_desc')}</div>
                                            </div>
                                            <select
                                                style={styles.select}
                                                value={i18n.language}
                                                onChange={(e) => handleLanguageChange(e.target.value)}
                                            >
                                                <option value="fr">Français</option>
                                                <option value="en">English</option>
                                                <option value="es">Español</option>
                                                <option value="it">Italiano</option>
                                                <option value="pt">Português</option>
                                                <option value="de">Deutsch</option>
                                            </select>
                                        </div>
                                    ) : (
                                        <div style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>
                                            <i className="fas fa-lock" style={{ marginRight: '10px' }}></i>
                                            {t('settings.preferences.lang_locked', 'Le changement de langue est actuellement indisponible.')}
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>

                    <div style={styles.formFooter}>
                        {activeTab !== 'security' && (
                            <>
                                <button style={styles.saveBtn} onClick={handleSave}>{t('settings.profile.update_btn')}</button>
                                {status.text && (
                                    <div style={{ ...styles.alert, background: status.type === 'success' ? '#f0fdf4' : '#fef2f2', color: status.type === 'success' ? '#15803d' : '#b91c1c' }}>
                                        {status.text}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: { maxWidth: '1100px', margin: '0 auto', padding: '3rem 1.5rem' },
    header: { marginBottom: '3.5rem' },
    title: { fontSize: '2.5rem', color: '#0f172a', fontWeight: '900', letterSpacing: '-1px' },
    subtitle: { color: '#64748b', fontSize: '1.1rem', marginTop: '5px' },

    premiumCard: { display: 'grid', gridTemplateColumns: '320px 1fr', background: 'white', borderRadius: '40px', boxShadow: '0 40px 100px -20px rgba(0, 51, 102, 0.12)', overflow: 'hidden', minHeight: '650px', border: '1px solid #f1f5f9' },

    sidebar: { background: '#f8fafc', padding: '3rem 2rem', borderRight: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', gap: '15px' },
    sideTab: { display: 'flex', alignItems: 'center', gap: '15px', padding: '18px 24px', borderRadius: '20px', border: 'none', background: 'transparent', color: '#94a3b8', fontWeight: '600', cursor: 'pointer', transition: '0.3s', textAlign: 'left' },
    sideTabActive: { display: 'flex', alignItems: 'center', gap: '15px', padding: '18px 24px', borderRadius: '20px', border: 'none', background: 'white', color: '#003366', fontWeight: 'bold', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.04)', textAlign: 'left', transform: 'translateX(10px)' },
    securityIndicator: { marginTop: 'auto', background: 'white', padding: '25px', borderRadius: '25px', border: '1px solid #f1f5f9' },
    securityBar: { height: '6px', background: '#f1f5f9', borderRadius: '3px', overflow: 'hidden' },
    securityFill: { height: '100%', background: '#22c55e', borderRadius: '3px' },

    content: { padding: '4rem', background: 'white' },
    contentTitle: { color: '#003366', fontSize: '1.8rem', fontWeight: '900', marginBottom: '3rem' },
    profileSummary: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', background: '#f8fafc', padding: '30px', borderRadius: '30px', marginBottom: '3rem', border: '1px solid #f1f5f9' },
    statusChip: { padding: '8px 16px', borderRadius: '50px', background: 'rgba(34, 197, 94, 0.1)', color: '#16a34a', fontWeight: 'bold', fontSize: '0.85rem' },

    formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' },
    formGroup: { display: 'flex', flexDirection: 'column', gap: '10px', boxSizing: 'border-box' },
    label: { fontSize: '0.75rem', fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' },
    inputWrapper: { position: 'relative', boxSizing: 'border-box', width: '100%' },
    inputIcon: { position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#003366' },
    input: { width: '100%', padding: '14px 20px', borderRadius: '16px', border: '1px solid #e2e8f0', fontSize: '1rem', transition: '0.2s', outline: 'none', color: '#334155', boxSizing: 'border-box', wordWrap: 'break-word', overflowWrap: 'break-word' },

    optionGrid: { display: 'flex', flexDirection: 'column', gap: '20px' },
    optionCard: { display: 'flex', alignItems: 'center', gap: '25px', padding: '25px', borderRadius: '25px', border: '1px solid #f1f5f9', background: '#f8fafc' },
    optionIcon: { width: '56px', height: '56px', background: 'white', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#003366', fontSize: '1.4rem' },
    activeTag: { padding: '6px 16px', background: '#dcfce7', color: '#166534', borderRadius: '50px', fontWeight: 'bold', fontSize: '0.8rem' },
    actionBtn: { padding: '10px 20px', borderRadius: '12px', border: '1px solid #e2e8f0', background: 'white', fontWeight: 'bold', cursor: 'pointer' },

    prefBox: { background: '#f8fafc', borderRadius: '30px', padding: '10px 30px', border: '1px solid #f1f5f9' },
    prefRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '25px 0', borderBottom: '1px solid #f1f5f9', fontSize: '1.1rem', fontWeight: '500' },
    toggle: { width: '44px', height: '22px', cursor: 'pointer', accentColor: '#003366' },
    select: { padding: '8px 16px', borderRadius: '10px', border: '1px solid #e2e8f0', outline: 'none' },

    formFooter: { marginTop: '4rem', borderTop: '1px solid #f1f5f9', paddingTop: '3rem', display: 'flex', flexDirection: 'column', gap: '20px' },
    saveBtn: { padding: '18px 45px', background: 'linear-gradient(135deg, #003366 0%, #004d99 100%)', color: 'white', border: 'none', borderRadius: '20px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 15px 35px rgba(0, 51, 102, 0.2)' },
    alert: { padding: '15px 25px', borderRadius: '15px', fontWeight: 'bold', textAlign: 'center' },

    // MOBILE
    mobileTitle: { fontSize: '2.5rem', fontWeight: '900', color: '#0f172a', marginBottom: '2rem', textAlign: 'center', letterSpacing: '-1.5px' },
    mobileTabs: { display: 'flex', background: '#f1f5f9', padding: '6px', borderRadius: '24px', marginBottom: '2.5rem' },
    mobileTab: { flex: 1, padding: '14px', border: 'none', background: 'transparent', color: '#94a3b8', fontWeight: 'bold', borderRadius: '18px', fontSize: '0.9rem' },
    mobileTabActive: { flex: 1, padding: '14px', border: 'none', background: 'white', color: '#003366', fontWeight: 'bold', borderRadius: '18px', boxShadow: '0 8px 16px rgba(0,0,0,0.05)' },
    mobileGlassCard: { background: 'white', padding: '2.5rem 1.5rem', borderRadius: '40px', boxShadow: '0 30px 60px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9', overflow: 'hidden', boxSizing: 'border-box' },
    mobileSectionHeader: { fontSize: '0.85rem', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '20px' },
    mobileIdBox: { background: '#f8fafc', padding: '20px', borderRadius: '20px', marginBottom: '25px', wordWrap: 'break-word', overflowWrap: 'break-word', wordBreak: 'break-word' },
    mobileActionRow: { display: 'flex', alignItems: 'center', gap: '15px' },
    mobileActionIcon: { width: '44px', height: '44px', background: '#f1f5f9', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#003366' },
    mobileSaveBtn: { width: '100%', padding: '22px', background: '#003366', color: 'white', border: 'none', borderRadius: '25px', fontSize: '1.1rem', fontWeight: 'bold', marginTop: '2.5rem', boxShadow: '0 20px 40px rgba(0, 51, 102, 0.15)' },
    mobileSelect: { padding: '10px 20px', borderRadius: '12px', border: '1px solid #e2e8f0' },

    // Advisor Styles
    advisorCard: { background: '#f8fafc', padding: '40px', borderRadius: '40px', border: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    advisorInfo: { display: 'flex', alignItems: 'center', gap: '30px' },
    advisorAvatar: { width: '100px', height: '100px', borderRadius: '35px', objectFit: 'cover', border: '4px solid white', boxShadow: '0 10px 25px rgba(0,0,0,0.08)' },
    advisorName: { fontSize: '1.4rem', fontWeight: 'bold', color: '#003366' },
    advisorRole: { fontSize: '0.9rem', color: '#64748b', marginTop: '4px' },
    advisorStatus: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#16a34a', fontWeight: 'bold', marginTop: '12px', background: 'rgba(34, 197, 94, 0.08)', padding: '6px 14px', borderRadius: '50px', width: 'fit-content' },
    statusDot: { width: '8px', height: '8px', background: '#22c55e', borderRadius: '50%' },
    advisorContacts: { display: 'flex', flexDirection: 'column', gap: '20px' },
    advisorContactItem: { display: 'flex', alignItems: 'center', gap: '15px' },
    contactIcon: { width: '44px', height: '44px', background: 'white', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#003366', boxShadow: '0 5px 15px rgba(0,0,0,0.04)' },
    contactLabel: { fontSize: '0.65rem', color: '#94a3b8', fontWeight: 'bold', letterSpacing: '1px' },
    contactValue: { fontSize: '0.9rem', color: '#0f172a', fontWeight: '600' },

    advisorCardMobile: { background: '#f8fafc', padding: '25px', borderRadius: '30px', display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '15px', border: '1px solid #f1f5f9' },
    advisorAvatarMobile: { width: '70px', height: '70px', borderRadius: '24px', objectFit: 'cover', border: '2px solid white', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' },
    advisorMobileDetails: { display: 'flex', flexDirection: 'column', gap: '12px', background: 'white', padding: '20px', borderRadius: '25px', border: '1px solid #f1f5f9' },
    advisorMobileItem: { display: 'flex', alignItems: 'center', gap: '15px', textDecoration: 'none' },
    advisorActionBtnMobile: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', width: '100%', padding: '18px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '20px', color: '#003366', fontWeight: 'bold', textDecoration: 'none', fontSize: '0.9rem' }
};

export default Settings;
