import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { loanService } from '../../services/loanService';
import { notificationService } from '../../services/notificationService';
import { walletService } from '../../services/walletService'; // Added walletService
import { useNotifications } from '../../contexts/NotificationContext';
import { useNavigate } from 'react-router-dom';
import KycVerificationBanner from '../../components/dashboard/KycVerificationBanner';
import { useTranslation } from 'react-i18next';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, details, submitting }) => {
    const { t } = useTranslation();
    if (!isOpen) return null;

    return (
        <div style={styles.modalOverlay}>
            <div style={styles.modalContent} className="fadeInUp">
                <h3 style={styles.modalTitle}>{t('credits.messages.confirm_title')}</h3>
                <div style={styles.modalBody}>
                    <div style={styles.modalRow}>
                        <span>{t('credits.form.project_type')} :</span>
                        <strong>{details.type}</strong>
                    </div>
                    <div style={styles.modalRow}>
                        <span>{t('credits.form.amount')} :</span>
                        <strong>{(details.montant || 0).toLocaleString()} €</strong>
                    </div>
                    <div style={styles.modalRow}>
                        <span>{t('credits.form.months')} :</span>
                        <strong>{details.duree} {t('credits.form.months_label')}</strong>
                    </div>
                    <div style={styles.modalRow}>
                        <span>{t('credits.form.monthly_payment')} :</span>
                        <strong>{details.mensualite} €</strong>
                    </div>
                    <div style={{ ...styles.modalRow, flexDirection: 'column', alignItems: 'flex-start', gap: '5px' }}>
                        <span>{t('credits.form.project_description')} :</span>
                        <p style={styles.modalDesc}>{details.description}</p>
                    </div>
                </div>
                <div style={styles.modalActions}>
                    <button style={styles.cancelBtn} onClick={onClose} disabled={submitting}>{t('common.edit') || 'Modifier'}</button>
                    <button style={styles.confirmBtn} onClick={onConfirm} disabled={submitting}>
                        {submitting ? <i className="fas fa-spinner fa-spin"></i> : t('credits.messages.confirm_button')}
                    </button>
                </div>
            </div>
        </div>
    );
};

const Credits = () => {
    const { currentUser } = useAuth();
    const { wallets, loans: history, loading } = useData(); // Added wallets
    const { showToast } = useNotifications();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();

    // Form States
    const [amount, setAmount] = useState(100000);
    const [duration, setDuration] = useState(120); // months
    const [interestRate, setInterestRate] = useState(2.5); // Initial annual rate
    const [projectType, setProjectType] = useState(t('credits.types.personnel'));
    const [otherType, setOtherType] = useState('');
    const [projectDescription, setProjectDescription] = useState('');

    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [showConfirmation, setShowConfirmation] = useState(false);

    // Logic: Check for pending loans
    const pendingRequest = history.find(l => l.status === 'pending');
    const hasPendingLoan = !!pendingRequest;

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Automatic rate calculation (mirroring Simulator behavior)
    useEffect(() => {
        let rate = 3.5;
        if (amount > 100000) rate = 1.5;
        else if (amount > 50000) rate = 2.0;
        else if (amount > 20000) rate = 2.5;
        else if (amount > 5000) rate = 3.0;

        setInterestRate(rate);
    }, [amount]);

    // Check Approval - Remboursement and other effects can go here
    useEffect(() => {
        // This logic is now handled by the Admin Service during approval
        // to ensure atomic updates and audit logs.
    }, [history, wallets, loading, currentUser, showToast]);

    const calculateMonthly = () => {
        const r = (interestRate / 100) / 12;
        const n = duration;
        const p = amount;
        if (r === 0) return (p / n).toFixed(2);
        const monthly = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
        return monthly.toFixed(2);
    };

    const handleInitialSubmit = () => {
        setMessage({ type: '', text: '' });

        if (hasPendingLoan) {
            setMessage({ type: 'error', text: t('credits.messages.already_pending') });
            return;
        }

        if (projectDescription.length < 10) {
            setMessage({ type: 'error', text: t('credits.messages.description_short') });
            return;
        }

        setShowConfirmation(true);
    };

    const handleConfirmApply = async () => {
        setSubmitting(true);
        try {
            await loanService.applyForLoan(currentUser.uid, {
                montant: amount,
                duree: duration,
                mensualite: calculateMonthly(),
                taux: interestRate,
                type: projectType === 'Autre' ? otherType : projectType,
                description: projectDescription
            }, i18n.language);
            setMessage({ type: 'success', text: t('credits.messages.success') });
            setShowConfirmation(false);
            setProjectDescription('');
        } catch (err) {
            setMessage({ type: 'error', text: t('credits.messages.error') });
            setShowConfirmation(false);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading && history.length === 0) return <div style={{ textAlign: 'center', padding: '5rem' }}>{t('loading')}</div>;

    const renderLockedOverlay = () => hasPendingLoan && (
        <div style={styles.lockedOverlay}>
            <div style={styles.lockedContent}>
                <i className="fas fa-file-contract" style={{ fontSize: '3rem', color: '#003366', marginBottom: '1rem' }}></i>
                <h3 style={{ color: '#003366', marginBottom: '10px' }}>{t('credits.status.dossier_title')}</h3>
                <p style={{ color: '#555', marginBottom: '1.5rem' }}>
                    {t('credits.status.dossier_desc', { amount: (pendingRequest?.amount || pendingRequest?.montant || 0).toLocaleString() })}
                    <br /><br />
                    {t('credits.status.dossier_notice')}
                </p>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                    <button onClick={() => navigate(`/${i18n.language}/dashboard/support`)} style={{ ...styles.supportLink, border: 'none', cursor: 'pointer', fontSize: '0.9rem' }}>{t('credits.support.contact_btn')}</button>
                </div>
            </div>
        </div>
    );

    const getStatusBadge = (status) => {
        switch (status) {
            case 'pending': return { label: t('credits.status.pending'), color: '#e65100', bg: '#fff3e0' };
            case 'approved':
            case 'accepted':
                return { label: t('credits.status.approved'), color: '#2e7d32', bg: '#e8f5e9' };
            case 'rejected': return { label: t('credits.status.rejected'), color: '#c62828', bg: '#ffebee' };
            default: return { label: status, color: '#555', bg: '#f5f7fa' };
        }
    };

    const renderHistoryItemContent = (loan) => {
        const badge = getStatusBadge(loan.status);
        const isApproved = loan.status === 'approved' || loan.status === 'accepted';

        if (isApproved) {
            return (
                <div style={{ width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#003366' }}>{(loan.amount || loan.montant || 0).toLocaleString()} €</span>
                                <i className="fas fa-check-circle" style={{ color: '#2e7d32', fontSize: '1.2rem' }} title="Approuvé"></i>
                            </div>
                            <div style={{ fontSize: '0.85rem', color: '#666' }}>
                                {loan.type} • {loan.duration || loan.duree || 0} mois
                            </div>
                        </div>
                    </div>

                    <div style={{
                        marginTop: '12px',
                        padding: '12px',
                        background: 'linear-gradient(to right, #f1f8e9, #ffffff)',
                        borderRadius: '10px',
                        borderLeft: '4px solid #2e7d32',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                    }}>
                        <p style={{ margin: '0 0 10px', fontSize: '0.9rem', color: '#1b5e20', fontWeight: '600', display: 'flex', alignItems: 'center' }}>
                            <i className="fas fa-coins" style={{ marginRight: '8px' }}></i>
                            {t('credits.support.fonds_avail')}
                        </p>
                        <button
                            onClick={() => navigate(`/${i18n.language}/dashboard/accounts`)}
                            style={{
                                background: '#2e7d32',
                                color: 'white',
                                border: 'none',
                                padding: '8px 16px',
                                borderRadius: '8px',
                                fontSize: '0.85rem',
                                cursor: 'pointer',
                                fontWeight: '600',
                                width: '100%',
                                textAlign: 'center',
                                boxShadow: '0 2px 4px rgba(46, 125, 50, 0.2)',
                                transition: 'all 0.2s',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                        >
                            {t('credits.support.access_btn')}
                            <i className="fas fa-arrow-right"></i>
                        </button>
                    </div>
                </div>
            );
        }

        return (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 'bold' }}>{(loan.amount || loan.montant || 0).toLocaleString()} €</div>
                    <div style={{ fontSize: '0.8rem', color: '#888' }}>{loan?.type || 'N/A'} • {loan.duration || loan.duree || 0} mois</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.75rem', display: 'inline-block', padding: '4px 12px', borderRadius: '50px', backgroundColor: badge.bg, fontWeight: 'bold', color: badge.color }}>
                        {badge.label}
                    </div>
                </div>
            </div>
        );
    };

    const commonFormContent = (
        <>
            <div style={styles.inputGroup}>
                <label style={styles.label}>{t('credits.form.project_type')}</label>
                <select
                    style={styles.select}
                    value={projectType}
                    onChange={(e) => setProjectType(e.target.value)}
                    disabled={hasPendingLoan}
                >
                    <option value={t('credits.types.personnel')}>{t('credits.types.personnel')}</option>
                    <option value={t('credits.types.immobilier')}>{t('credits.types.immobilier')}</option>
                    <option value={t('credits.types.vehicule')}>{t('credits.types.vehicule')}</option>
                    <option value={t('credits.types.professionnel')}>{t('credits.types.professionnel')}</option>
                    <option value="Autre">{t('credits.types.autre')}</option>
                </select>

                {projectType === 'Autre' && (
                    <div style={{ marginTop: '1rem' }}>
                        <label style={styles.label}>{t('credits.form.specific_project')}</label>
                        <input
                            style={styles.select}
                            placeholder={t('credits.form.specific_project_placeholder')}
                            value={otherType}
                            onChange={(e) => setOtherType(e.target.value)}
                            disabled={hasPendingLoan}
                        />
                    </div>
                )}
            </div>

            <div style={styles.inputGroup}>
                <label style={styles.label}>{t('credits.form.project_description')}</label>
                <textarea
                    style={styles.textarea}
                    placeholder={t('credits.form.project_description_placeholder')}
                    value={projectDescription}
                    onChange={(e) => setProjectDescription(e.target.value)}
                    rows="3"
                    disabled={hasPendingLoan}
                />
            </div>

            <div style={styles.inputGroup}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <label style={styles.label}>{t('credits.form.amount')}</label>
                    <span style={styles.valueDisplay}>{(amount || 0).toLocaleString()} €</span>
                </div>
                <input type="range" min="5000" max="900000" step="5000" value={amount} onChange={(e) => setAmount(Number(e.target.value))} style={styles.range} disabled={hasPendingLoan} />
            </div>

            <div style={styles.inputGroup}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <label style={styles.label}>{t('credits.form.months')}</label>
                    <span style={styles.valueDisplay}>{duration} {t('credits.form.months_label')} ({Math.floor(duration / 12)} {t('credits.form.years')})</span>
                </div>
                <input type="range" min="12" max="300" step="12" value={duration} onChange={(e) => setDuration(Number(e.target.value))} style={styles.range} disabled={hasPendingLoan} />
            </div>

            <div style={styles.inputGroup}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <label style={styles.label}>Taux d'intérêt (TAEG)</label>
                    <span style={styles.valueDisplay}>{interestRate} %</span>
                </div>
                <input type="range" min="1.0" max="15.0" step="0.1" value={interestRate} onChange={(e) => setInterestRate(Number(e.target.value))} style={styles.range} disabled={hasPendingLoan} />
            </div>
        </>
    );

    if (isMobile) {
        return (
            <KycVerificationBanner>
                <div style={{ padding: '1rem', position: 'relative' }}>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#003366', marginBottom: '1.5rem' }}>{t('sidebar.nav.credits')}</h1>

                    {message.text && !showConfirmation && (
                        <div style={{ ...styles.alert, background: message.type === 'success' ? '#e8f5e9' : '#ffebee', color: message.type === 'success' ? '#2e7d32' : '#c62828', marginBottom: '1rem' }}>
                            {message.text}
                        </div>
                    )}

                    <div style={{ ...styles.mobileCard, position: 'relative', overflow: 'hidden' }}>
                        {hasPendingLoan && renderLockedOverlay()}

                        <h3 style={{ fontSize: '1rem', color: '#003366', marginBottom: '1.5rem' }}>{t('credits.form.simulator_title')}</h3>

                        {commonFormContent}

                        <div style={styles.mobileResult}>
                            <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>{t('credits.form.monthly_payment')}</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{calculateMonthly()} €</div>
                        </div>

                        <button style={styles.mobileSubmitBtn} onClick={handleInitialSubmit} disabled={submitting || hasPendingLoan}>
                            {submitting ? t('credits.form.sending') || '...' : t('credits.form.apply_button')}
                        </button>
                    </div>

                    <div style={{ marginTop: '2rem' }}>
                        <h3 style={{ fontSize: '1rem', color: '#003366', marginBottom: '1rem' }}>{t('credits.history.title')}</h3>
                        {history.length === 0 ? (
                            <p style={{ fontSize: '0.85rem', color: '#888' }}>{t('credits.history.empty')}</p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {history.map(loan => (
                                    <div key={loan.id} style={styles.mobileHistoryItem}>
                                        {renderHistoryItemContent(loan)}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <ConfirmationModal
                        isOpen={showConfirmation}
                        onClose={() => setShowConfirmation(false)}
                        onConfirm={handleConfirmApply}
                        details={{
                            type: projectType === 'Autre' ? otherType : projectType,
                            montant: amount,
                            duree: duration,
                            mensualite: calculateMonthly(),
                            description: projectDescription
                        }}
                        submitting={submitting}
                    />
                </div>
            </KycVerificationBanner>
        );
    }

    // DESKTOP
    return (
        <KycVerificationBanner>
            <div style={styles.container}>
                <header style={styles.header}>
                    <h1 style={styles.title}>{t('credits.title')}</h1>
                    <p style={styles.subtitle}>{t('credits.subtitle')}</p>
                </header>

                <div style={styles.grid}>
                    <div style={{ ...styles.card, position: 'relative', overflow: 'hidden' }}>
                        {hasPendingLoan && renderLockedOverlay()}

                        <h2 style={{ color: '#003366', marginBottom: '1.5rem' }}>{t('credits.form.your_simulation')}</h2>

                        {commonFormContent}

                        <div style={styles.summaryBox}>
                            <div style={styles.summRow}><span>{t('credits.form.interest_rate')}</span><strong>{interestRate}%</strong></div>
                            <div style={styles.summRow}><span>{t('credits.form.monthly_payment')} {t('credits.form.monthly_payment_est')}</span><strong style={{ fontSize: '1.4rem', color: '#003366' }}>{calculateMonthly()} €</strong></div>
                            <button style={styles.applyBtn} onClick={handleInitialSubmit} disabled={submitting || hasPendingLoan}>
                                {submitting ? t('credits.form.processing') : t('credits.form.apply_button_official')}
                            </button>
                        </div>
                        {message.text && <div style={{ ...styles.alert, background: message.type === 'success' ? '#e8f5e9' : '#ffebee', color: message.type === 'success' ? '#2e7d32' : '#c62828' }}>{message.text}</div>}
                    </div>

                    <div style={styles.historyCard}>
                        <h2 style={{ color: '#003366', marginBottom: '1.5rem' }}>{t('credits.history.tracking')}</h2>
                        {history.length === 0 ? (
                            <div style={styles.empty}>{t('credits.history.empty_desktop')}</div>
                        ) : (
                            <div style={styles.loanList}>
                                {history.map(loan => (
                                    <div key={loan.id} style={styles.loanItem}>
                                        {renderHistoryItemContent(loan)}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Service Client Banner */}
                        <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#f8fbff', borderRadius: '12px', border: '1px solid #e3f2fd', textAlign: 'center' }}>
                            <i className="fas fa-headset" style={{ fontSize: '2rem', color: '#003366', marginBottom: '1rem' }}></i>
                            <h4 style={{ margin: '0 0 10px', color: '#003366' }}>{t('credits.support.need_help')}</h4>
                            <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1rem' }}>{t('credits.support.advisors_desc')}</p>
                            <button onClick={() => navigate(`/${i18n.language}/dashboard/support`)} style={{ ...styles.supportLinkOutline, border: '2px solid #003366', cursor: 'pointer', background: 'transparent', fontSize: '0.9rem' }}>{t('credits.support.contact_advisor')}</button>
                        </div>
                    </div>
                </div>

                <ConfirmationModal
                    isOpen={showConfirmation}
                    onClose={() => setShowConfirmation(false)}
                    onConfirm={handleConfirmApply}
                    details={{
                        type: projectType === 'Autre' ? otherType : projectType,
                        montant: amount,
                        duree: duration,
                        mensualite: calculateMonthly(),
                        description: projectDescription
                    }}
                    submitting={submitting}
                />
            </div>
        </KycVerificationBanner>
    );
};

const styles = {
    container: { maxWidth: '1100px', margin: '0 auto' },
    header: { marginBottom: '2.5rem' },
    title: { fontSize: '1.8rem', color: '#003366', fontWeight: '800' },
    subtitle: { color: '#666' },
    grid: { display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' },
    card: { backgroundColor: 'white', padding: '2rem', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' },
    inputGroup: { marginBottom: '2rem' },
    label: { fontSize: '0.9rem', color: '#555', fontWeight: '600', display: 'block', marginBottom: '8px' },
    select: { width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #eef2f6', fontSize: '1rem', outline: 'none', backgroundColor: '#f8fafc', boxSizing: 'border-box' },
    textarea: { width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #eef2f6', fontSize: '1rem', outline: 'none', backgroundColor: '#f8fafc', fontFamily: 'inherit', resize: 'vertical', boxSizing: 'border-box' },
    valueDisplay: { color: '#003366', fontWeight: '800', fontSize: '1.1rem' },
    range: { width: '100%', cursor: 'pointer', margin: '15px 0' },
    summaryBox: { background: '#f8fbff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #e3f2fd' },
    summRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' },
    applyBtn: { width: '100%', padding: '1.2rem', background: '#003366', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '1rem', marginTop: '1rem', cursor: 'pointer' },
    historyCard: { backgroundColor: 'white', padding: '2rem', borderRadius: '20px', border: '1px solid #eee' },
    loanList: { display: 'flex', flexDirection: 'column', gap: '15px' },
    loanItem: { padding: '15px', borderBottom: '1px solid #f5f5f5', display: 'flex', alignItems: 'center' },
    empty: { textAlign: 'center', padding: '3rem', color: '#888', fontStyle: 'italic' },
    alert: { marginTop: '1rem', padding: '1rem', borderRadius: '8px', textAlign: 'center', fontSize: '0.9rem' },

    // MOBILE
    mobileCard: { background: 'white', padding: '1.5rem', borderRadius: '16px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' },
    mobileResult: { background: '#003366', color: 'white', padding: '1.2rem', borderRadius: '12px', textAlign: 'center', marginBottom: '1.5rem' },
    mobileSubmitBtn: { width: '100%', padding: '14px', background: '#003366', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold' },
    mobileHistoryItem: { background: 'white', padding: '12px', borderRadius: '10px', border: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },

    // OVERLAY & MODAL
    lockedOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(2px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10, padding: '2rem', borderRadius: '16px' },
    lockedContent: { textAlign: 'center', background: 'white', padding: '2rem', borderRadius: '20px', boxShadow: '0 10px 40px rgba(0,0,0,0.1)', maxWidth: '400px' },
    lockedBtnDisabled: { padding: '10px 20px', background: '#e0e0e0', color: '#999', border: 'none', borderRadius: '50px', fontWeight: 'bold' },
    supportLink: { padding: '10px 20px', background: '#00ccff', color: 'white', borderRadius: '50px', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.9rem' },
    supportLinkOutline: { display: 'inline-block', padding: '10px 20px', border: '2px solid #003366', color: '#003366', borderRadius: '50px', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.9rem' },

    // Modal Confirm
    modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' },
    modalContent: { backgroundColor: 'white', borderRadius: '20px', width: '100%', maxWidth: '500px', padding: '2rem', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' },
    modalTitle: { textAlign: 'center', color: '#003366', marginBottom: '1.5rem', fontWeight: '800' },
    modalBody: { marginBottom: '2rem' },
    modalRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #eee' },
    modalDesc: { fontSize: '0.9rem', color: '#666', lineHeight: '1.5', background: '#f8f9fa', padding: '10px', borderRadius: '8px', width: '100%', boxSizing: 'border-box' },
    modalActions: { display: 'flex', gap: '15px' },
    cancelBtn: { flex: 1, padding: '12px', background: '#f5f5f5', color: '#555', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' },
    confirmBtn: { flex: 1, padding: '12px', background: '#003366', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }
};

export default Credits;
