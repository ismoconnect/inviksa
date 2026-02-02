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
                <div
                    style={styles.mainCard}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = styles.mainCard['--hover-lift'];
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                    }}
                >
                    <div style={styles.cardHeader}>
                        <h3 style={{ ...styles.cardLabel, color: 'rgba(255,255,255,0.7)' }}>{t('accounts.main')}</h3>
                        <div style={{ ...styles.cardIcon, background: 'rgba(255,255,255,0.1)' }}>
                            <i className="fas fa-wallet" style={{ color: 'white' }}></i>
                        </div>
                    </div>
                    <p style={{ ...styles.balance, color: 'white' }} className="balance-mobile">
                        {mainAcc.balance.toLocaleString(currentLocale, { minimumFractionDigits: 2 })} {mainAcc.currency}
                    </p>
                    {kycStatus?.status === 'verified' ? (
                        <p style={{ ...styles.cardInfo, color: 'rgba(255,255,255,0.6)' }}>
                            <i className="fas fa-id-card-alt" style={{ opacity: 0.7 }}></i>
                            {t('history.details.iban_label', { iban: mainAcc.iban.substring(0, 15) })}...
                        </p>
                    ) : (
                        <p style={{ ...styles.cardInfo, color: 'rgba(255,255,255,0.6)', fontStyle: 'italic', fontSize: '0.85rem' }}>
                            <i className="fas fa-lock"></i> {t('accounts.hidden_iban')}
                        </p>
                    )}
                </div>

                {/* Savings Card */}
                <div
                    style={styles.card}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-8px)';
                        e.currentTarget.style.boxShadow = '0 20px 40px rgba(39, 174, 96, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = styles.card.boxShadow;
                    }}
                >
                    <div style={styles.cardHeader}>
                        <h3 style={styles.cardLabel}>{t('accounts.savings')}</h3>
                        <div style={{ ...styles.cardIcon, background: '#e8f5e9' }}>
                            <i className="fas fa-piggy-bank" style={{ color: '#27ae60' }}></i>
                        </div>
                    </div>
                    <p style={{ ...styles.balance, color: '#1e293b' }} className="balance-mobile">
                        {savingsAcc.balance.toLocaleString(currentLocale, { minimumFractionDigits: 2 })} <span style={{ color: '#27ae60' }}>{savingsAcc.currency}</span>
                    </p>
                    <p style={styles.cardInfo}>
                        <i className="fas fa-chart-line" style={{ color: '#27ae60' }}></i>
                        {t('accounts.rate')}
                    </p>
                </div>

                {/* Credit Card */}
                <div
                    style={styles.card}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-8px)';
                        e.currentTarget.style.boxShadow = '0 20px 40px rgba(231, 76, 60, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = styles.card.boxShadow;
                    }}
                >
                    <div style={styles.cardHeader}>
                        <h3 style={styles.cardLabel}>{t('accounts.credit')}</h3>
                        <div style={{ ...styles.cardIcon, background: '#fee2e2' }}>
                            <i className="fas fa-file-invoice-dollar" style={{ color: '#e74c3c' }}></i>
                        </div>
                    </div>
                    <p style={{ ...styles.balance, color: '#1e293b' }} className="balance-mobile">
                        {creditAcc.balance.toLocaleString(currentLocale, { minimumFractionDigits: 2 })} <span style={{ color: '#e74c3c' }}>{creditAcc.currency}</span>
                    </p>
                    <p style={styles.cardInfo}>
                        <i className={creditAcc.balance < 0 ? "fas fa-exclamation-circle" : "fas fa-check-circle"}
                            style={{ color: creditAcc.balance < 0 ? '#e74c3c' : '#27ae60' }}></i>
                        {creditAcc.balance < 0 ? t('accounts.repayment') : t('accounts.no_debt')}
                    </p>
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
        animation: 'fadeIn 0.8s ease-out',
    },
    loading: {
        textAlign: 'center',
        padding: '3rem',
        color: '#003366',
        fontSize: '1.2rem',
    },
    header: {
        marginBottom: '2.5rem',
        padding: '0.5rem 0',
    },
    welcome: {
        fontSize: '2rem',
        color: '#003366',
        fontWeight: '900',
        margin: 0,
        letterSpacing: '-0.5px',
        textShadow: '0 2px 4px rgba(0,51,102,0.05)',
    },
    date: {
        color: '#64748b',
        marginTop: '0.5rem',
        fontSize: '0.95rem',
        fontWeight: '500',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
    },
    statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '1.8rem',
        marginBottom: '3rem',
    },
    mainCard: {
        background: 'linear-gradient(135deg, #003366 0%, #00509e 100%)',
        padding: '2rem',
        borderRadius: '24px',
        boxShadow: '0 20px 40px rgba(0, 51, 102, 0.15)',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        cursor: 'default',
        border: '1px solid rgba(255,255,255,0.1)',
        '--hover-lift': 'translateY(-8px)',
    },
    card: {
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(10px)',
        padding: '2rem',
        borderRadius: '24px',
        border: '1px solid rgba(238, 242, 246, 0.8)',
        boxShadow: '0 15px 35px rgba(0,0,0,0.04)',
        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        cursor: 'default',
    },
    cardHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
    },
    cardIcon: {
        fontSize: '1.4rem',
        width: '45px',
        height: '45px',
        borderRadius: '14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'transform 0.3s ease',
    },
    cardLabel: {
        fontSize: '0.9rem',
        color: '#64748b',
        textTransform: 'uppercase',
        letterSpacing: '1.2px',
        margin: 0,
        fontWeight: '700',
    },
    balance: {
        fontSize: '2.4rem',
        fontWeight: '900',
        margin: '0 0 0.8rem 0',
        letterSpacing: '-1px',
    },
    cardInfo: {
        fontSize: '0.9rem',
        color: '#94a3b8',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        fontWeight: '500',
    },
    mainContent: {
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '2.5rem',
    },
    transactionsSection: {
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '24px',
        border: '1px solid #f1f5f9',
        boxShadow: '0 10px 30px rgba(0,0,0,0.02)',
    },
    actionsSection: {
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '24px',
        border: '1px solid #f1f5f9',
        boxShadow: '0 10px 30px rgba(0,0,0,0.02)',
    },
    sectionTitle: {
        fontSize: '1.25rem',
        color: '#003366',
        fontWeight: '800',
        marginBottom: '2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    transactionList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
    },
    transactionItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '1.2rem',
        padding: '1.2rem',
        borderRadius: '16px',
        transition: 'background-color 0.2s ease',
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: '#f8fafc',
        }
    },
    transIconBox: {
        width: '48px',
        height: '48px',
        backgroundColor: '#f1f5f9',
        borderRadius: '14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.1rem',
    },
    transName: {
        margin: 0,
        fontWeight: '700',
        color: '#1e293b',
        fontSize: '1rem',
    },
    transDate: {
        margin: 0,
        fontSize: '0.85rem',
        color: '#64748b',
        fontWeight: '500',
    },
    transAmount: {
        margin: 0,
        fontWeight: '900',
        fontSize: '1.1rem',
        letterSpacing: '-0.5px',
    },
    emptyState: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4rem 0',
        color: '#94a3b8',
    },
    emptyIcon: {
        fontSize: '4rem',
        marginBottom: '1.5rem',
        opacity: 0.2,
    },
    emptyMsg: {
        fontSize: '1.1rem',
        fontWeight: '500',
        margin: 0,
    },
    actionsGrid: {
        display: 'grid',
        gap: '1.2rem',
    },
    actionBtn: {
        padding: '1.2rem',
        backgroundColor: '#f8fafc',
        border: '1px solid #f1f5f9',
        borderRadius: '16px',
        color: '#003366',
        textAlign: 'left',
        fontWeight: '800',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        gap: '1.2rem',
        fontSize: '1rem',
        '&:hover': {
            backgroundColor: '#003366',
            color: 'white',
            transform: 'translateX(5px)',
            boxShadow: '0 10px 20px rgba(0, 51, 102, 0.1)',
        }
    }
};

export default Dashboard;
