import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import KycVerificationBanner from '../components/dashboard/KycVerificationBanner';
import { useTranslation } from 'react-i18next';
import businessAnalyticsService from '../services/businessAnalyticsService';

const DashboardPro = () => {
    const { currentUser, userData } = useAuth();
    const { wallets, transactions: allTransactions, loading, kycStatus } = useData();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const transactions = allTransactions.slice(0, 5);
    const currentLocale = i18n.language === 'en' ? 'en-US' : (i18n.language === 'fr' ? 'fr-FR' : i18n.language);

    // Business Analytics
    const monthlyRevenue = businessAnalyticsService.calculateMonthlyRevenue(allTransactions);
    const expenseCategories = businessAnalyticsService.categorizeExpenses(allTransactions);
    const vatSummary = businessAnalyticsService.calculateVAT(allTransactions);
    const recentClients = businessAnalyticsService.getRecentClients(allTransactions);

    const getWalletName = (walletId) => {
        const wallet = wallets.find(w => w.id === walletId);
        if (!wallet) return '---';
        return wallet.type === 'main' ? t('accounts.main') :
            wallet.type === 'savings' ? t('accounts.savings') :
                wallet.type === 'credit' ? t('accounts.credit') : t('accounts.card.other');
    };

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

    // Calculate total revenue
    const totalRevenue = monthlyRevenue.reduce((sum, month) => sum + month.revenue, 0);
    const currentMonthRevenue = monthlyRevenue[monthlyRevenue.length - 1]?.revenue || 0;

    if (loading && wallets.length === 0) {
        return <div style={styles.loading}>{t('loading')}</div>;
    }

    return (
        <div style={styles.container}>
            <KycVerificationBanner kycStatus={kycStatus} />

            {/* Professional Badge */}
            <div style={styles.proBadge}>
                <i className="fas fa-briefcase"></i>
                <span>{t('dashboard.pro.title') || 'Espace Professionnel'}</span>
            </div>

            {/* Account Cards */}
            <div style={styles.accountsGrid}>
                <div style={{ ...styles.accountCard, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                    <div style={styles.accountHeader}>
                        <span style={styles.accountType}>{t('accounts.main')}</span>
                        <i className="fas fa-wallet" style={styles.accountIcon}></i>
                    </div>
                    <p style={styles.balance} className="balance-mobile">
                        {mainAcc.balance.toLocaleString(currentLocale, { minimumFractionDigits: 2 })} {mainAcc.currency}
                    </p>
                    <p style={styles.cardInfo}>IBAN: {mainAcc.iban}</p>
                </div>

                <div style={{ ...styles.accountCard, background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
                    <div style={styles.accountHeader}>
                        <span style={styles.accountType}>{t('accounts.savings')}</span>
                        <i className="fas fa-piggy-bank" style={styles.accountIcon}></i>
                    </div>
                    <p style={styles.balance} className="balance-mobile">
                        {savingsAcc.balance.toLocaleString(currentLocale, { minimumFractionDigits: 2 })} {savingsAcc.currency}
                    </p>
                    <p style={styles.cardInfo}>{t('accounts.savings_rate_description')}</p>
                </div>

                <div style={{ ...styles.accountCard, background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
                    <div style={styles.accountHeader}>
                        <span style={styles.accountType}>{t('accounts.credit')}</span>
                        <i className="fas fa-credit-card" style={styles.accountIcon}></i>
                    </div>
                    <p style={{ ...styles.balance, color: '#e74c3c' }} className="balance-mobile">
                        {creditAcc.balance.toLocaleString(currentLocale, { minimumFractionDigits: 2 })} {creditAcc.currency}
                    </p>
                    <p style={styles.cardInfo}>{creditAcc.balance < 0 ? t('accounts.repayment') : t('accounts.no_debt')}</p>
                </div>
            </div>

            <div style={styles.mainContent} className="dashboard-grid-stack">
                {/* Revenue Overview */}
                <div style={styles.businessCard}>
                    <div style={styles.cardHeader}>
                        <h2 style={styles.sectionTitle}>
                            <i className="fas fa-chart-line" style={{ marginRight: '8px', color: '#27ae60' }}></i>
                            {t('dashboard.pro.revenue') || 'Chiffre d\'affaires'}
                        </h2>
                    </div>
                    <div style={styles.revenueStats}>
                        <div style={styles.statBox}>
                            <p style={styles.statLabel}>{t('dashboard.pro.current_month') || 'Mois en cours'}</p>
                            <p style={styles.statValue}>
                                {currentMonthRevenue.toLocaleString(currentLocale, { minimumFractionDigits: 2 })} €
                            </p>
                        </div>
                        <div style={styles.statBox}>
                            <p style={styles.statLabel}>{t('dashboard.pro.total_6months') || 'Total 6 mois'}</p>
                            <p style={styles.statValue}>
                                {totalRevenue.toLocaleString(currentLocale, { minimumFractionDigits: 2 })} €
                            </p>
                        </div>
                    </div>
                    <div style={styles.miniChart}>
                        {monthlyRevenue.map((month, index) => (
                            <div key={index} style={styles.chartBar}>
                                <div
                                    style={{
                                        ...styles.chartBarFill,
                                        height: `${(month.revenue / Math.max(...monthlyRevenue.map(m => m.revenue))) * 100}%`
                                    }}
                                ></div>
                                <span style={styles.chartLabel}>{month.month.split('-')[1]}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Expense Breakdown */}
                <div style={styles.businessCard}>
                    <div style={styles.cardHeader}>
                        <h2 style={styles.sectionTitle}>
                            <i className="fas fa-chart-pie" style={{ marginRight: '8px', color: '#e74c3c' }}></i>
                            {t('dashboard.pro.expenses') || 'Dépenses professionnelles'}
                        </h2>
                    </div>
                    {expenseCategories.length > 0 ? (
                        <div style={styles.expenseList}>
                            {expenseCategories.map((cat, index) => (
                                <div key={index} style={styles.expenseItem}>
                                    <div style={styles.expenseInfo}>
                                        <div style={{ ...styles.colorDot, backgroundColor: cat.color }}></div>
                                        <span style={styles.expenseName}>{cat.name}</span>
                                    </div>
                                    <span style={styles.expenseAmount}>
                                        {cat.total.toLocaleString(currentLocale, { minimumFractionDigits: 2 })} €
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p style={styles.emptyMsg}>{t('dashboard.pro.no_expenses') || 'Aucune dépense enregistrée'}</p>
                    )}
                </div>

                {/* VAT Summary */}
                <div style={styles.businessCard}>
                    <div style={styles.cardHeader}>
                        <h2 style={styles.sectionTitle}>
                            <i className="fas fa-percent" style={{ marginRight: '8px', color: '#f39c12' }}></i>
                            {t('dashboard.pro.tax_summary') || 'Résumé TVA'}
                        </h2>
                    </div>
                    <div style={styles.vatGrid}>
                        <div style={styles.vatBox}>
                            <p style={styles.vatLabel}>{t('dashboard.pro.vat_collected') || 'TVA collectée'}</p>
                            <p style={{ ...styles.vatValue, color: '#27ae60' }}>
                                +{vatSummary.collected.toLocaleString(currentLocale, { minimumFractionDigits: 2 })} €
                            </p>
                        </div>
                        <div style={styles.vatBox}>
                            <p style={styles.vatLabel}>{t('dashboard.pro.vat_deductible') || 'TVA déductible'}</p>
                            <p style={{ ...styles.vatValue, color: '#e74c3c' }}>
                                -{vatSummary.deductible.toLocaleString(currentLocale, { minimumFractionDigits: 2 })} €
                            </p>
                        </div>
                        <div style={{ ...styles.vatBox, gridColumn: '1 / -1', borderTop: '2px solid #eef6ff', paddingTop: '12px' }}>
                            <p style={styles.vatLabel}>{t('dashboard.pro.vat_net') || 'TVA nette à payer'}</p>
                            <p style={{ ...styles.vatValue, color: '#003366', fontSize: '1.3rem', fontWeight: '900' }}>
                                {vatSummary.net.toLocaleString(currentLocale, { minimumFractionDigits: 2 })} €
                            </p>
                        </div>
                    </div>
                </div>

                {/* Recent Clients */}
                <div style={styles.businessCard}>
                    <div style={styles.cardHeader}>
                        <h2 style={styles.sectionTitle}>
                            <i className="fas fa-users" style={{ marginRight: '8px', color: '#3498db' }}></i>
                            {t('dashboard.pro.clients') || 'Clients récents'}
                        </h2>
                    </div>
                    {recentClients.length > 0 ? (
                        <div style={styles.clientList}>
                            {recentClients.map((client, index) => (
                                <div key={index} style={styles.clientItem}>
                                    <div style={styles.clientInfo}>
                                        <div style={styles.clientAvatar}>
                                            {client.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p style={styles.clientName}>{client.name}</p>
                                            <p style={styles.clientMeta}>
                                                {client.transactionCount} {t('dashboard.pro.transactions') || 'transactions'}
                                            </p>
                                        </div>
                                    </div>
                                    <span style={styles.clientAmount}>
                                        {client.totalAmount.toLocaleString(currentLocale, { minimumFractionDigits: 2 })} €
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p style={styles.emptyMsg}>{t('dashboard.pro.no_clients') || 'Aucun client enregistré'}</p>
                    )}
                </div>

                {/* Recent Transactions */}
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
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                                                <p style={{ ...styles.transDate, fontSize: isMobile ? '0.7rem' : '0.8rem' }}>
                                                    {tx.createdAt?.toDate().toLocaleDateString(currentLocale)}
                                                </p>
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
                                                    textTransform: 'uppercase'
                                                }}>
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
            </div>

            {/* Quick Actions */}
            <div style={styles.actionsSection}>
                <h2 style={styles.sectionTitle}>{t('actions.title')}</h2>
                <div style={styles.actionsGrid}>
                    <button style={styles.actionBtn} onClick={() => navigate(`/${i18n.language}/dashboard/invoicing`)}>
                        <i className="fas fa-file-invoice"></i> {t('dashboard.pro.quick_invoice') || 'Créer une facture'}
                    </button>
                    <button style={styles.actionBtn} onClick={() => navigate(`/${i18n.language}/dashboard/transfers`)}>
                        <i className="fas fa-paper-plane"></i> {t('actions.transfer')}
                    </button>
                    <button style={styles.actionBtn} onClick={() => navigate(`/${i18n.language}/dashboard/deposit`)}>
                        <i className="fas fa-plus-circle"></i> {t('actions.deposit')}
                    </button>
                    <button style={styles.actionBtn} onClick={() => navigate(`/${i18n.language}/dashboard/history`)}>
                        <i className="fas fa-history"></i> {t('sidebar.nav.history')}
                    </button>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        padding: '1.5rem',
        maxWidth: '1400px',
        margin: '0 auto',
    },
    loading: {
        textAlign: 'center',
        padding: '3rem',
        fontSize: '1.2rem',
        color: '#666',
    },
    proBadge: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '8px 16px',
        borderRadius: '50px',
        fontWeight: '700',
        fontSize: '0.9rem',
        marginBottom: '1.5rem',
        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
    },
    accountsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem',
    },
    accountCard: {
        padding: '1.5rem',
        borderRadius: '16px',
        color: 'white',
        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        cursor: 'pointer',
    },
    accountHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem',
    },
    accountType: {
        fontSize: '0.9rem',
        opacity: 0.9,
        fontWeight: '600',
    },
    accountIcon: {
        fontSize: '1.5rem',
        opacity: 0.8,
    },
    balance: {
        fontSize: '2rem',
        fontWeight: '900',
        margin: '0.5rem 0',
        letterSpacing: '-0.5px',
    },
    cardInfo: {
        fontSize: '0.85rem',
        opacity: 0.85,
        margin: 0,
    },
    mainContent: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem',
    },
    businessCard: {
        background: 'white',
        borderRadius: '16px',
        padding: '1.5rem',
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
    },
    cardHeader: {
        marginBottom: '1.5rem',
    },
    sectionTitle: {
        fontSize: '1.1rem',
        fontWeight: '800',
        color: '#003366',
        margin: 0,
        display: 'flex',
        alignItems: 'center',
    },
    revenueStats: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1rem',
        marginBottom: '1.5rem',
    },
    statBox: {
        background: '#f8fbff',
        padding: '1rem',
        borderRadius: '12px',
        textAlign: 'center',
    },
    statLabel: {
        fontSize: '0.8rem',
        color: '#666',
        margin: '0 0 0.5rem 0',
    },
    statValue: {
        fontSize: '1.5rem',
        fontWeight: '900',
        color: '#003366',
        margin: 0,
    },
    miniChart: {
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        height: '120px',
        gap: '8px',
    },
    chartBar: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-end',
        height: '100%',
    },
    chartBarFill: {
        width: '100%',
        background: 'linear-gradient(180deg, #27ae60 0%, #2ecc71 100%)',
        borderRadius: '4px 4px 0 0',
        minHeight: '10px',
        transition: 'height 0.3s ease',
    },
    chartLabel: {
        fontSize: '0.7rem',
        color: '#666',
        marginTop: '4px',
    },
    expenseList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
    },
    expenseItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px',
        background: '#f8fbff',
        borderRadius: '8px',
    },
    expenseInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
    },
    colorDot: {
        width: '12px',
        height: '12px',
        borderRadius: '50%',
    },
    expenseName: {
        fontSize: '0.9rem',
        fontWeight: '600',
        color: '#333',
    },
    expenseAmount: {
        fontSize: '0.95rem',
        fontWeight: '800',
        color: '#003366',
    },
    vatGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1rem',
    },
    vatBox: {
        background: '#f8fbff',
        padding: '1rem',
        borderRadius: '12px',
        textAlign: 'center',
    },
    vatLabel: {
        fontSize: '0.8rem',
        color: '#666',
        margin: '0 0 0.5rem 0',
    },
    vatValue: {
        fontSize: '1.2rem',
        fontWeight: '900',
        margin: 0,
    },
    clientList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
    },
    clientItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px',
        background: '#f8fbff',
        borderRadius: '8px',
    },
    clientInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
    },
    clientAvatar: {
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: '900',
        fontSize: '1.1rem',
    },
    clientName: {
        fontSize: '0.9rem',
        fontWeight: '700',
        color: '#333',
        margin: '0 0 4px 0',
    },
    clientMeta: {
        fontSize: '0.75rem',
        color: '#666',
        margin: 0,
    },
    clientAmount: {
        fontSize: '0.95rem',
        fontWeight: '800',
        color: '#27ae60',
    },
    transactionsSection: {
        gridColumn: '1 / -1',
        background: 'white',
        borderRadius: '16px',
        padding: '1.5rem',
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
    },
    transactionList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
    },
    transactionItem: {
        display: 'flex',
        gap: '12px',
        padding: '12px',
        background: '#f8fbff',
        borderRadius: '12px',
        transition: 'all 0.2s ease',
    },
    transIconBox: {
        width: '44px',
        height: '44px',
        borderRadius: '12px',
        background: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.2rem',
        flexShrink: 0,
    },
    transName: {
        fontWeight: '700',
        color: '#1a1a1a',
        margin: 0,
    },
    transAmount: {
        fontWeight: '900',
        margin: 0,
    },
    transDate: {
        color: '#888',
        margin: 0,
    },
    emptyState: {
        textAlign: 'center',
        color: '#ccc',
        padding: '2rem 0',
    },
    emptyIcon: {
        fontSize: '3rem',
    },
    emptyMsg: {
        margin: 0,
        fontStyle: 'italic',
        color: '#999',
    },
    actionsSection: {
        background: 'white',
        borderRadius: '16px',
        padding: '1.5rem',
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
    },
    actionsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
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
    },
};

export default DashboardPro;
