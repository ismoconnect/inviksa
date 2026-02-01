import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { useTranslation } from 'react-i18next';

const History = () => {
    const { currentUser } = useAuth();
    const { wallets, transactions, loading } = useData();
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [currentPage, setCurrentPage] = useState(1);
    const { t, i18n } = useTranslation();

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Helper to get formatted date parts
    const getDateParts = (timestamp) => {
        if (!timestamp) return { day: '..', month: '...' };
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        const locale = i18n.language === 'en' ? 'en-US' : 'fr-FR';
        return {
            day: date.toLocaleDateString(locale, { day: '2-digit' }),
            month: date.toLocaleDateString(locale, { month: 'short' }).toUpperCase().replace('.', '')
        };
    };

    const getTitle = (tx) => {
        if (tx.type === 'deposit') return t('history.types.deposit');
        if (tx.type === 'transfer_internal') return t('history.types.transfer_internal', { name: tx.toAccountName || t('history.types.internal_account') });
        if (tx.type === 'transfer_instant') return t('history.types.transfer_instant', { name: tx.beneficiaryName || t('history.types.beneficiary') });
        if (tx.type === 'receive_instant') return t('history.types.receive_instant');
        if (tx.type === 'transfer_external') return t('history.types.transfer_external', { name: tx.beneficiaryName || t('history.types.beneficiary') });
        return t('history.types.operation');
    };

    const getWalletName = (walletId) => {
        const wallet = wallets?.find(w => w.id === walletId);
        if (!wallet) return '---';
        return wallet.type === 'main' ? t('accounts.main') :
            wallet.type === 'savings' ? t('accounts.savings') :
                wallet.type === 'credit' ? t('accounts.credit') : t('accounts.card.other');
    };

    const getDescription = (tx) => {
        const targetAcc = getWalletName(tx.toWalletId);

        if (tx.method === 'admin') {
            return `VIREMENT INVIK BANK → ${targetAcc}`;
        }

        if (tx.type === 'credit' || tx.type === 'deposit') {
            const method = tx.method || 'card';
            const methodKey = method === 'card' ? 'transactions.by_card' : 'transactions.by_transfer';
            const methodText = t(methodKey);
            const statusText = tx.status === 'in_review' ? ` (${t('status.in_review')})` : '';
            return `${t('transactions.deposit')} ${methodText} → ${targetAcc}${statusText}`;
        }

        if (tx.type === 'receive_instant') {
            const targetAcc = getWalletName(tx.toWalletId);
            const sender = tx.senderName || t('history.types.unknown');
            return `${sender} → ${targetAcc}`;
        }

        // For transfers
        if (['transfer', 'transfer_internal', 'transfer_external', 'transfer_instant'].includes(tx.type)) {
            const sourceAcc = getWalletName(tx.fromWalletId);
            const beneficiary = tx.beneficiaryName || (tx.toWalletId ? getWalletName(tx.toWalletId) : '');

            if (beneficiary) {
                return `${sourceAcc} → ${beneficiary}`;
            }
            return `${t('transactions.transfer')} ( ${sourceAcc} )`;
        }

        return '';
    };

    // Calculate generic fees (mock logic as per requirement, usually 0 for internal/instant)
    const getFees = (tx) => {
        // Example logic: 0.00 € for everything for now
        return `0,00 ${tx.currency || '€'}`;
    };

    // Pagination Logic
    const itemsPerPage = isMobile ? 8 : 10;
    const totalPages = Math.ceil(transactions.length / itemsPerPage);
    const currentTransactions = transactions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const PaginationControls = () => {
        if (totalPages <= 1) return null;
        return (
            <div style={isMobile ? styles.mobilePagination : styles.desktopPagination}>
                <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(p => p - 1)}
                    style={currentPage === 1 ? styles.pageBtnDisabled : styles.pageBtn}
                >
                    <i className="fas fa-chevron-left"></i>
                </button>
                <div style={styles.pageIndicator}>{t('deposit.pagination.page', { current: currentPage, total: totalPages })}</div>
                <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(p => p + 1)}
                    style={currentPage === totalPages ? styles.pageBtnDisabled : styles.pageBtn}
                >
                    <i className="fas fa-chevron-right"></i>
                </button>
            </div>
        );
    };

    if (loading && transactions.length === 0) return <div style={styles.loading}>{t('loading')}</div>;

    // --- MOBILE VIEW ---
    if (isMobile) {
        return (
            <div style={{ padding: '1rem', paddingBottom: '80px' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#003366', marginBottom: '1.5rem' }}>{t('sidebar.nav.history')}</h1>

                {transactions.length === 0 ? (
                    <div style={styles.mobileEmpty}>{t('history.empty')}</div>
                ) : (
                    <>
                        <div style={styles.mobileList}>
                            {currentTransactions.map(tx => {
                                const { day, month } = getDateParts(tx.createdAt);
                                return (
                                    <div key={tx.id} style={styles.mobileItem}>
                                        <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
                                            {/* Left: Icon or Date Stack */}
                                            <div style={{
                                                width: '44px',
                                                height: '44px',
                                                backgroundColor: '#f8fafc',
                                                borderRadius: '12px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                flexShrink: 0
                                            }}>
                                                <i className={tx.type === 'deposit' || tx.type === 'receive_instant' ? 'fas fa-arrow-down' : 'fas fa-arrow-up'}
                                                    style={{ color: tx.type === 'deposit' || tx.type === 'receive_instant' ? '#27ae60' : '#d63031' }}></i>
                                            </div>

                                            {/* Right: Info */}
                                            <div style={{ flex: 1 }}>
                                                {/* Top Row: Name & Amount */}
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px', gap: '8px' }}>
                                                    <div style={{ fontWeight: '700', color: '#1a1a1a', fontSize: '0.88rem', lineHeight: '1.2' }}>
                                                        {getTitle(tx)}
                                                    </div>
                                                    <div style={{
                                                        fontWeight: '800',
                                                        fontSize: '0.92rem',
                                                        color: tx.type === 'deposit' || tx.type === 'receive_instant' ? '#27ae60' : '#1a1a1a',
                                                        whiteSpace: 'nowrap'
                                                    }}>
                                                        {tx.type === 'deposit' || tx.type === 'receive_instant' ? '+' : '-'}{parseFloat(tx.amount).toFixed(2)} €
                                                    </div>
                                                </div>

                                                {/* Middle Row: Description */}
                                                <div style={{ fontSize: '0.75rem', color: '#666', marginBottom: '8px', lineHeight: '1.4' }}>
                                                    {getDescription(tx)}
                                                </div>

                                                {/* Bottom Row: Metadata & Status */}
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '10px' }}>
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                                        {tx.beneficiaryIban && (
                                                            <span style={{
                                                                fontSize: '0.65rem',
                                                                color: '#003366',
                                                                backgroundColor: '#f1f5f9',
                                                                alignSelf: 'flex-start',
                                                                padding: '2px 8px',
                                                                borderRadius: '6px',
                                                                fontWeight: '700',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: '4px'
                                                            }}>
                                                                <i className="fas fa-university" style={{ fontSize: '0.6rem' }}></i>
                                                                {t('history.details.iban_label', { iban: tx.beneficiaryIban.substring(tx.beneficiaryIban.length - 10) })}
                                                            </span>
                                                        )}
                                                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                                            <span style={{ fontSize: '0.68rem', fontWeight: '600', color: '#999' }}>
                                                                {day} {month}
                                                            </span>
                                                            <span style={{ width: '3px', height: '3px', backgroundColor: '#ddd', borderRadius: '50%' }}></span>
                                                            <span style={{ fontSize: '0.65rem', color: '#999', fontStyle: 'italic' }}>
                                                                {t('history.details.ref')} {tx.id.substring(0, 8)}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <span style={{
                                                        fontSize: '0.58rem',
                                                        padding: '2px 8px',
                                                        borderRadius: '50px',
                                                        fontWeight: '800',
                                                        textTransform: 'uppercase',
                                                        letterSpacing: '0.4px',
                                                        backgroundColor: tx.status === 'completed' ? '#dcfce7' :
                                                            tx.status === 'rejected' ? '#fee2e2' :
                                                                tx.status === 'pending' ? '#fef9c3' : '#e0f2fe',
                                                        color: tx.status === 'completed' ? '#166534' :
                                                            tx.status === 'rejected' ? '#991b1b' :
                                                                tx.status === 'pending' ? '#854d0e' : '#0369a1',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '4px'
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
                                    </div>
                                );
                            })}
                        </div>
                        <PaginationControls />
                    </>
                )}
            </div>
        );
    }

    // --- DESKTOP VIEW ---
    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h1 style={styles.title}>{t('history.title')}</h1>
                <p style={styles.subtitle}>{t('history.subtitle')}</p>
            </header>

            <div style={styles.tableCard}>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>{t('history.columns.date')}</th>
                            <th style={styles.th}>{t('history.columns.type')}</th>
                            <th style={styles.th}>{t('history.columns.category')}</th>
                            <th style={styles.th}>{t('history.columns.amount')}</th>
                            <th style={styles.th}>{t('history.columns.fees')}</th>
                            <th style={styles.th}>{t('status.title') || 'STATUS'}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentTransactions.map(tx => {
                            const { day, month } = getDateParts(tx.createdAt);
                            return (
                                <tr key={tx.id} style={styles.trBody}>
                                    {/* DATE */}
                                    <td style={{ ...styles.td, width: '80px' }}>
                                        <div style={styles.dateStack}>
                                            <div style={styles.dateDay}>{day}</div>
                                            <div style={styles.dateMonth}>{month}</div>
                                        </div>
                                    </td>

                                    {/* TYPE (Rich) */}
                                    <td style={styles.td}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                            <div style={{ fontWeight: '600', color: '#2d3436', fontSize: '0.95rem' }}>
                                                {getTitle(tx)}
                                            </div>
                                            <div style={{ fontSize: '0.85rem', color: '#636e72' }}>
                                                {getDescription(tx)}
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '6px' }}>
                                                {tx.beneficiaryIban && (
                                                    <div style={{ ...styles.metaText, color: '#003366', fontWeight: '700', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                        <i className="fas fa-university" style={{ fontSize: '0.65rem' }}></i>
                                                        {t('history.details.iban_label', { iban: tx.beneficiaryIban })}
                                                    </div>
                                                )}
                                                {tx.senderName && tx.type === 'receive_instant' && (
                                                    <span style={styles.metaText}>{t('history.details.sender', { name: tx.senderName })}</span>
                                                )}
                                                <span style={{ ...styles.metaText, fontStyle: 'italic', fontSize: '0.7rem' }}>
                                                    {t('history.details.ref')} {tx.id.substring(0, 8)}
                                                </span>
                                            </div>
                                        </div>
                                    </td>

                                    {/* CATEGORIE */}
                                    <td style={styles.td}>
                                        <span style={styles.categoryBadge}>{t('history.details.uncategorized')}</span>
                                    </td>

                                    {/* MONTANT */}
                                    <td style={styles.td}>
                                        <span style={{
                                            fontWeight: '700',
                                            padding: '6px 12px',
                                            borderRadius: '8px',
                                            backgroundColor: tx.type === 'deposit' || tx.type === 'receive_instant'
                                                ? 'rgba(0, 184, 148, 0.1)' // Green bg
                                                : 'rgba(214, 48, 49, 0.1)', // Red bg
                                            color: tx.type === 'deposit' || tx.type === 'receive_instant'
                                                ? '#00b894' // Green text
                                                : '#d63031' // Red text
                                        }}>
                                            {tx.type === 'deposit' || tx.type === 'receive_instant' ? '+' : '-'}
                                            {parseFloat(tx.amount).toFixed(2)} €
                                        </span>
                                    </td>

                                    {/* FRAIS */}
                                    <td style={{ ...styles.td, color: '#636e72', fontSize: '0.9rem' }}>
                                        {getFees(tx)}
                                    </td>

                                    {/* STATUS */}
                                    <td style={styles.td}>
                                        <span style={{
                                            fontSize: '0.75rem',
                                            padding: '4px 10px',
                                            borderRadius: '50px',
                                            fontWeight: '700',
                                            backgroundColor: tx.status === 'completed' ? '#dcfce7' :
                                                tx.status === 'rejected' ? '#fee2e2' :
                                                    tx.status === 'pending' ? '#fef9c3' : '#e0f2fe',
                                            color: tx.status === 'completed' ? '#166534' :
                                                tx.status === 'rejected' ? '#991b1b' :
                                                    tx.status === 'pending' ? '#854d0e' : '#0369a1',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '4px'
                                        }}>
                                            {tx.status === 'pending' || tx.status === 'in_review' ? (
                                                <i className="fas fa-circle-notch fa-spin"></i>
                                            ) : tx.status === 'completed' ? (
                                                <i className="fas fa-check-circle"></i>
                                            ) : (
                                                <i className="fas fa-times-circle"></i>
                                            )}
                                            {t(`status.${tx.status || 'pending'}`)}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                {transactions.length === 0 && <div style={{ padding: '3rem', textAlign: 'center', color: '#888' }}>{t('history.empty')}</div>}
                <PaginationControls />
            </div>
        </div>
    );
};

const styles = {
    container: { maxWidth: '1200px', margin: '0 auto', paddingBottom: '40px' },
    loading: { textAlign: 'center', padding: '4rem', color: '#003366' },
    header: { marginBottom: '2rem' },
    title: { fontSize: '2rem', color: '#003366', fontWeight: '800', letterSpacing: '-0.5px' },
    subtitle: { color: '#666', marginTop: '5px' },

    tableCard: { backgroundColor: 'white', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', overflow: 'hidden', border: '1px solid #f0f0f0' },
    table: { width: '100%', borderCollapse: 'collapse' },

    th: {
        textAlign: 'left',
        padding: '1.5rem',
        backgroundColor: 'white',
        color: '#b2bec3',
        fontSize: '0.75rem',
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        borderBottom: '1px solid #f0f0f0'
    },
    td: {
        padding: '1.5rem',
        borderBottom: '1px solid #f9f9f9',
        verticalAlign: 'top'
    },
    trBody: { transition: 'background 0.2s', ':hover': { backgroundColor: '#fcfcfc' } },

    // Date Stack Styles
    dateStack: { textAlign: 'center', width: '50px' },
    dateStackMobile: {
        textAlign: 'center',
        minWidth: '45px',
        paddingRight: '12px',
        borderRight: '1px solid #f0f0f0',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
    },
    dateDay: { fontSize: '1.4rem', fontWeight: '700', color: '#2d3436', lineHeight: '1' },
    dateMonth: { fontSize: '0.7rem', fontWeight: '700', color: '#b2bec3', textTransform: 'uppercase', marginTop: '2px' },

    // Meta Text
    metaText: { fontSize: '0.75rem', color: '#b2bec3' },

    // Badges
    categoryBadge: {
        backgroundColor: '#dfe6e9',
        color: '#636e72',
        padding: '6px 12px',
        borderRadius: '50px',
        fontSize: '0.75rem',
        fontWeight: '600'
    },
    categoryBadgeMobile: {
        backgroundColor: '#f1f2f6',
        color: '#a4b0be',
        padding: '2px 8px',
        borderRadius: '4px',
        fontSize: '0.65rem',
        marginTop: '6px'
    },
    miniBadge: {
        fontSize: '0.65rem',
        color: '#b2bec3',
        backgroundColor: '#f7f7f7',
        padding: '2px 6px',
        borderRadius: '4px'
    },

    // MOBILE specific
    mobileEmpty: { textAlign: 'center', padding: '3rem', color: '#888' },
    mobileList: { display: 'flex', flexDirection: 'column', gap: '10px' },
    mobileItem: {
        display: 'flex',
        alignItems: 'stretch',
        padding: '16px',
        backgroundColor: 'white',
        borderRadius: '16px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
        border: '1px solid #f5f5f5'
    },

    desktopPagination: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', padding: '2rem', borderTop: '1px solid #f0f0f0' },
    mobilePagination: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', padding: '1.5rem' },
    pageBtn: { background: '#f0f4f8', border: 'none', borderRadius: '10px', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#003366', cursor: 'pointer', transition: 'all 0.2s' },
    pageBtnDisabled: { background: '#f5f5f5', border: 'none', borderRadius: '10px', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#dfe6e9', cursor: 'not-allowed' },
    pageIndicator: { fontSize: '0.9rem', fontWeight: '600', color: '#636e72' }
};

export default History;
