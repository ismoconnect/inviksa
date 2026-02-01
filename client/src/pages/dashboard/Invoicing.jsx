import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { invoiceService } from '../../services/invoiceService';
import { useTranslation } from 'react-i18next';
import KycVerificationBanner from '../../components/dashboard/KycVerificationBanner';
import { useNotifications } from '../../contexts/NotificationContext';

const Invoicing = () => {
    const { currentUser, userData } = useAuth();
    const { t } = useTranslation();
    const { showToast } = useNotifications();
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);

        if (currentUser) {
            const unsubscribe = invoiceService.subscribeToInvoices(currentUser.uid, (data) => {
                setInvoices(data);
                setLoading(false);
            });
            return () => {
                unsubscribe();
                window.removeEventListener('resize', handleResize);
            };
        }
    }, [currentUser]);

    const getStatusStyle = (status) => {
        switch (status) {
            case 'paid':
                return { backgroundColor: 'rgba(76, 175, 80, 0.15)', color: '#4caf50' };
            case 'pending':
                return { backgroundColor: 'rgba(255, 152, 0, 0.15)', color: '#ff9800' };
            case 'cancelled':
                return { backgroundColor: 'rgba(244, 67, 54, 0.15)', color: '#f44336' };
            default:
                return { backgroundColor: 'rgba(158, 158, 158, 0.15)', color: '#9e9e9e' };
        }
    };

    const copyToClipboard = (text, label) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        showToast(t('accounts.rib_modal.copy_toast', { label }), 'success');
    };

    const bankDetails = {
        bankName: userData?.advisorBankName || "INVIK BANK SA",
        bic: userData?.advisorBIC || "INVKBKFR",
        iban: userData?.advisorIBAN || "FR76 1234 5678 9012 3456 7890 123",
        holder: userData?.advisorHolder || "INVIK BANK SA"
    };

    if (loading) {
        return (
            <div style={styles.loadingContainer}>
                <div className="spinner"></div>
            </div>
        );
    }

    // LOCK SCREEN if no invoices OR manually locked
    if (invoices.length === 0 || userData?.invoicingLocked) {
        return (
            <KycVerificationBanner>
                <div style={styles.lockScreenContainer}>
                    <div style={styles.lockCard} className="fadeIn">
                        <div style={styles.lockIconWrapper}>
                            <i className="fas fa-lock" style={styles.lockIcon}></i>
                        </div>
                        <h1 style={styles.lockTitle}>{t('sidebar.nav.facturation')}</h1>
                        <p style={styles.lockText}>
                            {t('invoicing.empty_state.title')}
                        </p>
                        <div style={styles.lockDivider}></div>
                        <p style={styles.lockSubtext}>
                            {t('invoicing.empty_state.subtitle')}
                        </p>
                        <div style={styles.advisorBrief}>
                            <div style={styles.briefAvatar}>
                                {userData?.advisorPhoto ? (
                                    <img src={userData.advisorPhoto} alt="Advisor" style={styles.avatarImg} />
                                ) : (
                                    <i className="fas fa-user-tie"></i>
                                )}
                            </div>
                            <div style={styles.briefInfo}>
                                <span style={styles.briefLabel}>{t('invoicing.advisor_label')}</span>
                                <span style={styles.briefValue}>{userData?.advisorName || t('invoicing.default_advisor')}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </KycVerificationBanner>
        );
    }

    return (
        <KycVerificationBanner>
            <div style={styles.container}>
                <div className="fadeIn">
                    <header style={styles.header}>
                        <h1 style={styles.title}>{t('sidebar.nav.facturation')}</h1>
                        <p style={styles.subtitle}>{t('accounts.subtitle')}</p>
                    </header>

                    <div style={isMobile ? styles.mobileLayout : styles.dashboardGrid}>
                        {/* Invoices List */}
                        <div style={styles.card}>
                            <h2 style={styles.cardTitle}>
                                <i className="fas fa-file-invoice-dollar" style={{ marginRight: '10px' }}></i>
                                {t('transactions.title')}
                            </h2>

                            <div style={styles.invoiceList}>
                                {invoices.map((invoice) => (
                                    <div key={invoice.id} style={styles.invoiceItem}>
                                        <div style={styles.invoiceInfo}>
                                            <div style={styles.invoiceRef}>{invoice.reference || `#INV-${invoice.id.substring(0, 6).toUpperCase()}`}</div>
                                            <div style={styles.invoiceDate}>
                                                {invoice.createdAt?.toDate().toLocaleDateString() || new Date().toLocaleDateString()}
                                            </div>
                                            <div style={styles.invoiceDesc}>{invoice.description}</div>
                                        </div>
                                        <div style={styles.invoiceAction}>
                                            <div style={styles.invoiceAmount}>{invoice.amount.toLocaleString()} {invoice.currency || 'EUR'}</div>
                                            <div style={{ ...styles.statusBadge, ...getStatusStyle(invoice.status) }}>
                                                {t(`status.${invoice.status}`)}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Payment Info / RIB */}
                        <div style={styles.card}>
                            <h2 style={styles.cardTitle}>
                                <i className="fas fa-university" style={{ marginRight: '10px' }}></i>
                                {t('invoicing.rib_section.title')}
                            </h2>
                            <p style={styles.cardDesc}>{t('invoicing.rib_section.subtitle')}</p>

                            <div style={styles.ribContainer}>
                                <div style={styles.ribRow}>
                                    <span style={styles.ribLabel}>{t('accounts.rib_modal.labels.bank')}</span>
                                    <div style={styles.ribValue}>
                                        {bankDetails.bankName}
                                        <button onClick={() => copyToClipboard(bankDetails.bankName, 'Bank')} style={styles.copyBtn}>
                                            <i className="far fa-copy"></i>
                                        </button>
                                    </div>
                                </div>
                                <div style={styles.ribRow}>
                                    <span style={styles.ribLabel}>{t('accounts.rib_modal.labels.holder')}</span>
                                    <div style={styles.ribValue}>
                                        {bankDetails.holder}
                                        <button onClick={() => copyToClipboard(bankDetails.holder, 'Holder')} style={styles.copyBtn}>
                                            <i className="far fa-copy"></i>
                                        </button>
                                    </div>
                                </div>
                                <div style={styles.ribRow}>
                                    <span style={styles.ribLabel}>{t('accounts.rib_modal.labels.bic')}</span>
                                    <div style={styles.ribValue}>
                                        {bankDetails.bic}
                                        <button onClick={() => copyToClipboard(bankDetails.bic, 'BIC')} style={styles.copyBtn}>
                                            <i className="far fa-copy"></i>
                                        </button>
                                    </div>
                                </div>
                                <div style={{ ...styles.ribRow, borderBottom: 'none' }}>
                                    <span style={styles.ribLabel}>{t('accounts.rib_modal.labels.iban')}</span>
                                    <div style={{ ...styles.ribValue, wordBreak: 'break-all' }}>
                                        {bankDetails.iban}
                                        <button onClick={() => copyToClipboard(bankDetails.iban, 'IBAN')} style={styles.copyBtn}>
                                            <i className="far fa-copy"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div style={styles.paymentNotice}>
                                <i className="fas fa-info-circle" style={{ marginRight: '8px', color: '#003366' }}></i>
                                {t('deposit.bank_details.processing_delay')}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </KycVerificationBanner>
    );
};

const styles = {
    container: {
        padding: '2rem',
        maxWidth: '1200px',
        margin: '0 auto',
    },
    loadingContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '60vh',
    },
    header: {
        marginBottom: '2.5rem',
    },
    title: {
        fontSize: '2.2rem',
        fontWeight: '800',
        color: '#003366',
        marginBottom: '0.5rem',
        letterSpacing: '-0.5px',
    },
    subtitle: {
        color: '#64748b',
        fontSize: '1.1rem',
    },
    dashboardGrid: {
        display: 'grid',
        gridTemplateColumns: '1.5fr 1fr',
        gap: '2rem',
        alignItems: 'start',
    },
    mobileLayout: {
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
    },
    card: {
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(10px)',
        borderRadius: '24px',
        padding: '2rem',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
    },
    cardTitle: {
        fontSize: '1.3rem',
        fontWeight: '700',
        color: '#003366',
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'center',
    },
    cardDesc: {
        color: '#64748b',
        fontSize: '0.95rem',
        marginBottom: '1.5rem',
    },
    invoiceList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
    },
    invoiceItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1.2rem',
        background: 'white',
        borderRadius: '16px',
        border: '1px solid #f1f5f9',
        transition: 'transform 0.2s',
    },
    invoiceInfo: {
        flex: 1,
    },
    invoiceRef: {
        fontWeight: '700',
        color: '#1e293b',
        fontSize: '1rem',
        marginBottom: '4px',
    },
    invoiceDate: {
        fontSize: '0.8rem',
        color: '#94a3b8',
        marginBottom: '6px',
    },
    invoiceDesc: {
        fontSize: '0.9rem',
        color: '#64748b',
    },
    invoiceAction: {
        textAlign: 'right',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '8px',
    },
    invoiceAmount: {
        fontSize: '1.1rem',
        fontWeight: '800',
        color: '#003366',
    },
    statusBadge: {
        padding: '4px 12px',
        borderRadius: '50px',
        fontSize: '0.75rem',
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
    },
    emptyState: {
        textAlign: 'center',
        padding: '3rem',
        color: '#94a3b8',
    },
    emptyIcon: {
        fontSize: '3rem',
        marginBottom: '1rem',
        opacity: 0.3,
    },
    ribContainer: {
        background: '#f8fafc',
        borderRadius: '16px',
        padding: '1.5rem',
        border: '1px solid #e2e8f0',
    },
    ribRow: {
        padding: '12px 0',
        borderBottom: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
    },
    ribLabel: {
        fontSize: '0.75rem',
        fontWeight: '700',
        color: '#94a3b8',
        textTransform: 'uppercase',
        letterSpacing: '1px',
    },
    ribValue: {
        fontSize: '1rem',
        color: '#1e293b',
        fontWeight: '600',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    copyBtn: {
        background: 'none',
        border: 'none',
        color: '#3498db',
        cursor: 'pointer',
        fontSize: '1rem',
        padding: '4px 8px',
        borderRadius: '6px',
        transition: 'background 0.2s',
    },
    paymentNotice: {
        marginTop: '1.5rem',
        padding: '1rem',
        background: 'rgba(52, 152, 219, 0.05)',
        borderRadius: '12px',
        color: '#475569',
        fontSize: '0.85rem',
        lineHeight: '1.5',
        display: 'flex',
        alignItems: 'flex-start',
    },
    lockScreenContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '70vh',
        padding: '2rem',
    },
    lockCard: {
        maxWidth: '500px',
        width: '100%',
        background: 'white',
        borderRadius: '32px',
        padding: '3rem 2rem',
        textAlign: 'center',
        boxShadow: '0 20px 50px rgba(0, 51, 102, 0.08)',
        border: '1px solid #f1f5f9',
    },
    lockIconWrapper: {
        width: '80px',
        height: '80px',
        borderRadius: '24px',
        background: 'rgba(0, 51, 102, 0.05)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '0 auto 2rem',
    },
    lockIcon: {
        fontSize: '2rem',
        color: '#003366',
    },
    lockTitle: {
        fontSize: '1.8rem',
        fontWeight: '800',
        color: '#003366',
        marginBottom: '1rem',
    },
    lockText: {
        color: '#1e293b',
        fontSize: '1.1rem',
        fontWeight: '600',
        lineHeight: '1.5',
        marginBottom: '1.5rem',
    },
    lockDivider: {
        height: '1px',
        background: '#f1f5f9',
        margin: '1.5rem 0',
    },
    lockSubtext: {
        color: '#64748b',
        fontSize: '0.95rem',
        lineHeight: '1.6',
        marginBottom: '2rem',
    },
    advisorBrief: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        padding: '1rem',
        background: '#f8fafc',
        borderRadius: '16px',
    },
    briefAvatar: {
        width: '45px',
        height: '45px',
        borderRadius: '12px',
        background: '#003366',
        color: 'white',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '1.2rem',
        overflow: 'hidden',
    },
    avatarImg: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    briefInfo: {
        textAlign: 'left',
    },
    briefLabel: {
        display: 'block',
        fontSize: '0.7rem',
        fontWeight: '700',
        color: '#94a3b8',
        textTransform: 'uppercase',
    },
    briefValue: {
        fontSize: '0.95rem',
        fontWeight: '700',
        color: '#1e293b',
    }
};

export default Invoicing;
