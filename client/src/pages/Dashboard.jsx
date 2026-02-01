import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import KycVerificationBanner from '../components/dashboard/KycVerificationBanner';
import { useTranslation } from 'react-i18next';
import DashboardPro from './DashboardPro';

const Dashboard = () => {
    const { currentUser, userData } = useAuth();

    // Redirect to professional dashboard if user has professional account or business userType
    if (userData?.accountType === 'professional' || userData?.userType === 'business') {
        return <DashboardPro />;
    }

    const { wallets, transactions: allTransactions, loading, kycStatus } = useData();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation(); // Hook initialization
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const transactions = allTransactions.slice(0, 5);

    const getWalletName = (walletId) => {
        const wallet = wallets.find(w => w.id === walletId);
        if (!wallet) return '---';
        return wallet.type === 'main' ? t('accounts.main') :
            wallet.type === 'savings' ? t('accounts.savings') :
                wallet.type === 'credit' ? t('accounts.credit') : t('accounts.card.other');
    };

    // Function to get translated transaction description
    const getTransactionDescription = (tx) => {
        const targetAcc = getWalletName(tx.toWalletId);

        if (tx.method === 'admin') {
            return `VIREMENT INVIK BANK → ${targetAcc}`;
        }

        if (tx.type === 'credit' || tx.type === 'deposit') {
            const method = tx.method || 'card';
            const methodText = method === 'card' ? t('transactions.by_card') : t('transactions.by_transfer');
            return `${t('transactions.deposit')} ${methodText} → ${targetAcc}`;
        }

        if (tx.type === 'receive_instant') {
            const sender = tx.senderName || t('history.types.unknown');
            return `${sender} → ${targetAcc}`;
        }

        // Transfer (Sender)
        const sourceAcc = getWalletName(tx.fromWalletId);
        const beneficiary = tx.beneficiaryName || (tx.toWalletId ? getWalletName(tx.toWalletId) : '');

        if (beneficiary) {
            return `${sourceAcc} → ${beneficiary}`;
        }
        return `${t('transactions.transfer')} ( ${sourceAcc} )`;
    };

    const mainAcc = wallets.find(w => w.type === 'main') || { balance: 0, currency: 'EUR', iban: '---' };
    const savingsAcc = wallets.find(w => w.type === 'savings') || { balance: 0, currency: 'EUR' };
    const creditAcc = wallets.find(w => w.type === 'credit') || { balance: 0, currency: 'EUR' };

    if (loading && wallets.length === 0) {
        return <div style={styles.loading}>{t('loading')}</div>;
    }

    // Dynamic Locale for formatting
    const currentLocale = i18n.language === 'en' ? 'en-US' : (i18n.language === 'fr' ? 'fr-FR' : i18n.language);

    return (
        <div style={styles.dashboardContainer}>
            <header style={styles.header}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <h1 style={{ ...styles.welcome, marginBottom: 0 }}>{t('welcome', { name: userData?.firstName || currentUser?.email })}</h1>
                    <KycVerificationBanner variant="badge" />
                </div>
                <p style={styles.date}>{new Date().toLocaleDateString(currentLocale, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </header>

            <div style={styles.statsGrid} className="stats-grid-mobile">
                {/* Main Account Card */}
                <div style={styles.mainCard}>
                    <div style={styles.cardHeader}>
                        <h3 style={{ ...styles.cardLabel, color: 'rgba(255,255,255,0.8)' }}>{t('accounts.main')}</h3>
                        <i className="fas fa-wallet" style={{ ...styles.cardIcon, color: 'white' }}></i>
                    </div>
                    <p style={{ ...styles.balance, color: 'white' }} className="balance-mobile">
                        {mainAcc.balance.toLocaleString(currentLocale, { minimumFractionDigits: 2 })} {mainAcc.currency}
                    </p>
                    {kycStatus?.status === 'verified' ? (
                        <p style={{ ...styles.cardInfo, color: 'rgba(255,255,255,0.6)' }}>
                            {t('history.details.iban_label', { iban: mainAcc.iban.substring(0, 15) })}...
                        </p>
                    ) : (
                        <p style={{ ...styles.cardInfo, color: 'rgba(255,255,255,0.6)', fontStyle: 'italic', fontSize: '0.8rem' }}>
                            <i className="fas fa-lock" style={{ marginRight: '5px' }}></i> {t('accounts.hidden_iban')}
                        </p>
                    )}
                </div>

                {/* Savings Card */}
                <div style={styles.card}>
                    <div style={styles.cardHeader}>
                        <h3 style={styles.cardLabel}>{t('accounts.savings')}</h3>
                        <i className="fas fa-piggy-bank" style={{ ...styles.cardIcon, color: '#27ae60' }}></i>
                    </div>
                    <p style={{ ...styles.balance, color: '#27ae60' }} className="balance-mobile">
                        {savingsAcc.balance.toLocaleString(currentLocale, { minimumFractionDigits: 2 })} {savingsAcc.currency}
                    </p>
                    <p style={styles.cardInfo}>{t('accounts.rate')}</p>
                </div>

                {/* Credit Card */}
                <div style={styles.card}>
                    <div style={styles.cardHeader}>
                        <h3 style={styles.cardLabel}>{t('accounts.credit')}</h3>
                        <i className="fas fa-file-invoice-dollar" style={{ ...styles.cardIcon, color: '#e74c3c' }}></i>
                    </div>
                    <p style={{ ...styles.balance, color: '#e74c3c' }} className="balance-mobile">
                        {creditAcc.balance.toLocaleString(currentLocale, { minimumFractionDigits: 2 })} {creditAcc.currency}
                    </p>
                    <p style={styles.cardInfo}>{creditAcc.balance < 0 ? t('accounts.repayment') : t('accounts.no_debt')}</p>
                </div>
            </div>

            <div style={styles.mainContent} className="dashboard-grid-stack">
                <div style={styles.transactionsSection}>
                    <h2 style={styles.sectionTitle}>{t('transactions.title')}</h2>
                    <div style={styles.transactionList}>
                        {transactions.length > 0 ? (
                            transactions.map(tx => {
                                const isPositive = tx.type === 'credit' || tx.type === 'deposit' || tx.type === 'receive_instant' || tx.method === 'admin';
                                return (
                                    <div key={tx.id} style={styles.transactionItem}>
                                        <div style={styles.transIconBox}>
                                            <i className={isPositive ? 'fas fa-arrow-down' : 'fas fa-arrow-up'}
                                                style={{ color: isPositive ? '#27ae60' : '#e74c3c' }}></i>
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            {/* Row 1: Name and Amount */}
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px', gap: '8px' }}>
                                                <p style={{
                                                    ...styles.transName,
                                                    fontSize: isMobile ? '0.82rem' : '0.95rem',
                                                    lineHeight: '1.2'
                                                }}>
                                                    {getTransactionDescription(tx)}
                                                </p>
                                                <p style={{
                                                    ...styles.transAmount,
                                                    color: isPositive ? '#27ae60' : '#333',
                                                    fontSize: isMobile ? '0.85rem' : '1rem',
                                                    whiteSpace: 'nowrap'
                                                }}>
                                                    {isPositive ? '+' : '-'}{tx.amount.toLocaleString(currentLocale, { minimumFractionDigits: 2 })} {tx.currency}
                                                </p>
                                            </div>

                                            {/* Row 2: Date/IBAN and Status */}
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                                                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                                                    <p style={{ ...styles.transDate, fontSize: isMobile ? '0.7rem' : '0.8rem' }}>
                                                        {tx.createdAt?.toDate().toLocaleDateString(currentLocale)}
                                                    </p>
                                                    {tx.beneficiaryIban && (
                                                        <p style={{ ...styles.transDate, fontSize: '0.6rem', background: '#f8fafc', padding: '1px 4px', borderRadius: '4px', color: '#888' }}>
                                                            {t('history.details.iban_label', { iban: tx.beneficiaryIban.substring(0, 10) + '...' })}
                                                        </p>
                                                    )}
                                                </div>

                                                <span style={{
                                                    fontSize: isMobile ? '0.58rem' : '0.65rem',
                                                    background: tx.status === 'completed' ? '#dcfce7' :
                                                        tx.status === 'rejected' ? '#fee2e2' :
                                                            tx.status === 'pending' ? '#fef9c3' : '#e0f2fe',
                                                    color: tx.status === 'completed' ? '#166534' :
                                                        tx.status === 'rejected' ? '#991b1b' :
                                                            tx.status === 'pending' ? '#854d0e' : '#0369a1',
                                                    padding: isMobile ? '1px 6px' : '2px 8px',
                                                    borderRadius: '50px',
                                                    fontWeight: '800',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '3px',
                                                    whiteSpace: 'nowrap',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.3px'
                                                }}>
                                                    {tx.status === 'pending' || tx.status === 'in_review' ? (
                                                        <i className="fas fa-circle-notch fa-spin" style={{ fontSize: '0.55rem' }}></i>
                                                    ) : tx.status === 'completed' ? (
                                                        <i className="fas fa-check-circle" style={{ fontSize: '0.55rem' }}></i>
                                                    ) : (
                                                        <i className="fas fa-times-circle" style={{ fontSize: '0.55rem' }}></i>
                                                    )}
                                                    {t(`status.${tx.status || 'pending'}`)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div style={styles.emptyState}>
                                <i className="fas fa-history" style={styles.emptyIcon}></i>
                                <p style={styles.emptyMsg}>{t('transactions.empty')}</p>
                            </div>
                        )}
                    </div>
                </div>

                <div style={styles.actionsSection}>
                    <h2 style={styles.sectionTitle}>{t('actions.title')}</h2>
                    <div style={styles.actionsGrid}>
                        <button style={styles.actionBtn} onClick={() => navigate(`/${i18n.language}/dashboard/transfers`)}>
                            <i className="fas fa-paper-plane"></i> {t('actions.transfer')}
                        </button>
                        <button style={styles.actionBtn} onClick={() => navigate(`/${i18n.language}/dashboard/credits`)}>
                            <i className="fas fa-hand-holding-usd"></i> {t('actions.credit')}
                        </button>
                        <button style={styles.actionBtn} onClick={() => navigate(`/${i18n.language}/dashboard/deposit`)}>
                            <i className="fas fa-plus-circle"></i> {t('actions.deposit')}
                        </button>
                        <button style={styles.actionBtn} onClick={() => navigate(`/${i18n.language}/dashboard/cards`)}>
                            <i className="fas fa-credit-card"></i> {t('actions.cards')}
                        </button>
                    </div>
                </div>
            </div>
        </div >
    );
};

const styles = {
    dashboardContainer: {
        maxWidth: '1200px',
        margin: '0 auto',
    },
    loading: {
        textAlign: 'center',
        padding: '3rem',
        color: '#003366',
        fontSize: '1.2rem',
    },
    header: {
        marginBottom: '2rem',
    },
    welcome: {
        fontSize: '1.8rem',
        color: '#003366',
        fontWeight: '800',
        margin: 0,
    },
    date: {
        color: '#666',
        marginTop: '0.3rem',
    },
    statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2.5rem',
    },
    mainCard: {
        background: 'linear-gradient(135deg, #003366 0%, #00509e 100%)',
        padding: '1.8rem',
        borderRadius: '20px',
        boxShadow: '0 10px 30px rgba(0, 51, 102, 0.2)',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
    },
    card: {
        backgroundColor: 'white',
        padding: '1.8rem',
        borderRadius: '20px',
        border: '1px solid #eef2f6',
        boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
    },
    cardHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem',
    },
    cardIcon: {
        fontSize: '1.5rem',
        color: '#003366',
        opacity: 0.8,
    },
    cardLabel: {
        fontSize: '0.85rem',
        color: '#888',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        margin: 0,
    },
    balance: {
        fontSize: '2.2rem',
        fontWeight: '800',
        color: '#003366',
        margin: '0 0 0.5rem 0',
    },
    cardInfo: {
        fontSize: '0.85rem',
        color: '#aaa',
        margin: 0,
    },
    mainContent: {
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '2rem',
    },
    transactionsSection: {
        backgroundColor: 'white',
        padding: '1.8rem',
        borderRadius: '20px',
        border: '1px solid #eef2f6',
        boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
    },
    actionsSection: {
        backgroundColor: 'white',
        padding: '1.8rem',
        borderRadius: '20px',
        border: '1px solid #eef2f6',
        boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
    },
    sectionTitle: {
        fontSize: '1.1rem',
        color: '#003366',
        fontWeight: '700',
        marginBottom: '1.5rem',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
    },
    transactionList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
    },
    transactionItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '1rem 0',
        borderBottom: '1px solid #f8fbff',
    },
    transIconBox: {
        width: '40px',
        height: '40px',
        backgroundColor: '#f8fbff',
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    transName: {
        margin: 0,
        fontWeight: '700',
        color: '#333',
        fontSize: '0.95rem',
    },
    transDate: {
        margin: 0,
        fontSize: '0.8rem',
        color: '#aaa',
    },
    transAmount: {
        margin: 0,
        fontWeight: '800',
        fontSize: '1rem',
    },
    emptyState: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem',
        color: '#ccc',
        padding: '2rem 0',
    },
    emptyIcon: {
        fontSize: '3rem',
    },
    emptyMsg: {
        margin: 0,
        fontStyle: 'italic',
    },
    actionsGrid: {
        display: 'grid',
        gap: '1rem',
    },
    actionBtn: {
        padding: '1.2rem',
        backgroundColor: '#f8fbff',
        border: '1px solid #eef6ff',
        borderRadius: '12px',
        color: '#003366',
        textAlign: 'left',
        fontWeight: '700',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        fontSize: '0.95rem',
    }
};

export default Dashboard;
