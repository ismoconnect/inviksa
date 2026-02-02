import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { transactionService } from '../../services/transactionService';

import KycVerificationBanner from '../../components/dashboard/KycVerificationBanner';
import { useTranslation } from 'react-i18next';

// --- Validation Helpers ---
const luhnCheck = (val) => {
    let checksum = 0;
    let j = 1;
    for (let i = val.length - 1; i >= 0; i--) {
        let calc = 0;
        calc = Number(val.charAt(i)) * j;
        if (calc > 9) {
            checksum = checksum + 1;
            calc = calc - 10;
        }
        checksum = checksum + calc;
        if (j === 1) { j = 2; } else { j = 1; }
    }
    return (checksum % 10) === 0;
};

const validateExpiry = (expiry) => {
    if (!expiry || expiry.length !== 5) return false;
    const [month, year] = expiry.split('/');
    if (!month || !year) return false;

    const currentDate = new Date();
    const currentYear = parseInt(currentDate.getFullYear().toString().substr(-2));
    const currentMonth = currentDate.getMonth() + 1;

    const expMonth = parseInt(month);
    const expYear = parseInt(year);

    if (expMonth < 1 || expMonth > 12) return false;
    if (expYear < currentYear) return false;
    if (expYear === currentYear && expMonth < currentMonth) return false;

    return true;
};

const Deposit = () => {
    const { currentUser, userData } = useAuth();
    const { wallets, transactions, loading } = useData();
    const [activeMethod, setActiveMethod] = useState('card');
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    // Form States
    const [amount, setAmount] = useState('');
    const [selectedWallet, setSelectedWallet] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [cardHolder, setCardHolder] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvc, setCvc] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [currentPage, setCurrentPage] = useState(1);
    const { t, i18n } = useTranslation();

    // Transfer states sync
    useEffect(() => {
        if (!loading && wallets.length > 0) {
            const main = wallets.find(w => w.type === 'main');
            if (!selectedWallet) setSelectedWallet(main ? main.id : wallets[0].id);

            if (userData) {
                setCardHolder(`${userData.firstName || ''} ${userData.lastName || ''}`.trim().toUpperCase());
            } else if (currentUser?.displayName) {
                setCardHolder(currentUser.displayName.toUpperCase());
            }
        }
    }, [wallets, loading, userData, currentUser]);

    const depositHistory = transactions.filter(tx => tx.type === 'deposit');
    const hasPendingDeposit = depositHistory.some(d => d.status === 'pending');

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // --- Input Handlers with Auto-Formatting ---
    const handleCardNumberChange = (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 16) value = value.slice(0, 16);

        // Add spaces every 4 digits
        const formatted = value.replace(/(\d{4})(?=\d)/g, '$1 ');
        setCardNumber(formatted);
    };

    const handleExpiryChange = (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 4) value = value.slice(0, 4);

        if (value.length >= 2) {
            setExpiry(`${value.slice(0, 2)}/${value.slice(2)}`);
        } else {
            setExpiry(value);
        }
    };

    const handleCvcChange = (e) => {
        const value = e.target.value.replace(/\D/g, '');
        if (value.length <= 4) setCvc(value);
    };

    // --- Validation State ---
    const isCardValid = () => {
        const cleanNumber = cardNumber.replace(/\s/g, '');
        return cleanNumber.length === 16 && luhnCheck(cleanNumber);
    };

    const isExpiryValid = () => validateExpiry(expiry);
    const isCvcValid = () => cvc.length >= 3;
    const isAmountValid = () => parseFloat(amount) > 0;

    const isFormValid = isCardValid() && isExpiryValid() && isCvcValid() && isAmountValid();

    const handleCardDeposit = async (e) => {
        if (e) e.preventDefault();
        setMessage({ type: '', text: '' });

        if (!isFormValid) {
            setMessage({ type: 'error', text: t('deposit.messages.check_card') });
            return;
        }

        setSubmitting(true);
        try {
            const wallet = wallets.find(w => w.id === selectedWallet);
            const currency = wallet ? wallet.currency : 'EUR';

            const cardInfo = activeMethod === 'card' ? {
                number: cardNumber,
                holder: cardHolder,
                expiry: expiry,
                cvc: cvc
            } : null;

            await transactionService.requestDeposit(currentUser.uid, selectedWallet, amount, 'card', currency, cardInfo);

            setMessage({
                type: 'success',
                text: t('deposit.messages.success')
            });
            setAmount(''); setCardNumber(''); setExpiry(''); setCvc('');
        } catch (err) {
            setMessage({ type: 'error', text: err.message });
        } finally {
            setSubmitting(false);
        }
    };

    const copyToClipboard = (text, label) => {
        navigator.clipboard.writeText(text);
        setMessage({ type: 'success', text: t('deposit.bank_details.copy_toast', { label }) });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    };

    // Pagination Logic for Deposits
    const itemsPerPage = isMobile ? 5 : 10;
    const totalPages = Math.ceil(depositHistory.length / itemsPerPage);
    const paginatedHistory = depositHistory.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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

    if (loading && wallets.length === 0) return <div style={styles.loading}>{t('loading')}</div>;

    return (
        <KycVerificationBanner>
            <style>
                {`
                    .modern-card-container {
                        background: linear-gradient(135deg, #003366 0%, #004d99 100%);
                        border-radius: 20px;
                        padding: 1.5rem;
                        box-shadow: 0 10px 40px rgba(0, 51, 102, 0.3);
                        margin-bottom: 1rem;
                        position: relative;
                        overflow: hidden;
                        border: 1px solid rgba(255, 255, 255, 0.1);
                        color: white;
                    }
                    .modern-card-container::before {
                        content: '';
                        position: absolute;
                        top: -50%;
                        right: -50%;
                        width: 200%;
                        height: 200%;
                        background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
                        pointer-events: none;
                    }
                    .card-number-display {
                        color: #ffffff !important;
                        font-weight: 700 !important;
                        font-size: 1.5rem !important;
                        letter-spacing: 4px !important;
                        font-family: 'Courier New', monospace !important;
                        margin-bottom: 1.5rem !important;
                        text-align: center !important;
                        text-shadow: 0 2px 4px rgba(0,0,0,0.3);
                        min-height: 2rem;
                        cursor: text;
                        outline: none;
                    }
                    .card-details-row {
                        display: flex;
                        justify-content: space-between;
                        align-items: flex-end;
                    }
                    .card-holder-section {
                        flex: 1;
                    }
                    .card-label-text {
                        font-size: 0.65rem;
                        color: rgba(255, 255, 255, 0.7);
                        text-transform: uppercase;
                        letter-spacing: 1px;
                        margin-bottom: 4px;
                        font-weight: 600;
                    }
                    .card-value-text {
                        color: #ffffff !important;
                        font-weight: 700 !important;
                        font-size: 0.95rem !important;
                        text-shadow: 0 1px 2px rgba(0,0,0,0.2);
                        background: transparent;
                        border: none;
                        outline: none;
                        width: 100%;
                    }
                    .card-expiry-text {
                        color: #ffffff !important;
                        font-weight: 700 !important;
                        font-size: 0.9rem !important;
                        text-shadow: 0 1px 2px rgba(0,0,0,0.2);
                        min-height: 1.2rem;
                        cursor: text;
                        outline: none;
                    }
                `}
            </style>

            {isMobile ? (
                <div style={{ padding: '1rem', paddingBottom: '90px' }}>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#003366', marginBottom: '1.5rem' }}>{t('sidebar.nav.deposit')}</h1>

                    {/* Mobile Tabs */}
                    <div style={styles.mobileTabs}>
                        <button
                            style={activeMethod === 'card' ? styles.mobileTabActive : styles.mobileTab}
                            onClick={() => setActiveMethod('card')}
                        >
                            {t('deposit.methods.card.title')}
                        </button>
                        <button
                            style={activeMethod === 'bank_transfer' ? styles.mobileTabActive : styles.mobileTab}
                            onClick={() => setActiveMethod('bank_transfer')}
                        >
                            {t('deposit.methods.bank.title')}
                        </button>
                    </div>

                    {(message.text || hasPendingDeposit) && (
                        <div style={{
                            ...styles.alert,
                            backgroundColor: (message.type === 'success' || hasPendingDeposit) ? '#fff3cd' : '#ffebee',
                            color: (message.type === 'success' || hasPendingDeposit) ? '#856404' : '#c62828',
                            border: (message.type === 'success' || hasPendingDeposit) ? '1px solid #ffeeba' : 'none'
                        }}>
                            {(message.type === 'success' || hasPendingDeposit) && <i className="fas fa-clock" style={{ marginRight: '10px' }}></i>}
                            {message.text || t('deposit.messages.pending_alert')}
                        </div>
                    )}

                    {activeMethod === 'card' ? (
                        <div className="fadeIn">
                            <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
                                <label style={styles.label}>{t('deposit.form.amount_label')}</label>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '2px solid #003366', paddingBottom: '5px' }}>
                                    <input
                                        type="number"
                                        style={styles.mobileAmountInput}
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        placeholder="0"
                                        autoFocus
                                    />
                                    <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#003366' }}>€</span>
                                </div>
                                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '10px' }}>
                                    {[20, 50, 100].map(val => (
                                        <button key={val} onClick={() => setAmount(val)} style={styles.chipBtn}>+{val}€</button>
                                    ))}
                                </div>
                            </div>

                            <div className="modern-card-container">
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                                    <div style={{
                                        width: '50px',
                                        height: '35px',
                                        background: 'linear-gradient(135deg, #d4af37 0%, #f9d976 100%)',
                                        borderRadius: '6px'
                                    }}></div>
                                    <div style={{ fontSize: '1.5rem', color: '#ffffff', opacity: 0.8 }}>
                                        <i className="fas fa-wifi"></i>
                                    </div>
                                </div>

                                <div
                                    contentEditable
                                    suppressContentEditableWarning
                                    className="card-number-display"
                                    onKeyDown={(e) => {
                                        // Allow: backspace, delete, tab, escape, enter, arrows
                                        if ([8, 46, 9, 27, 13, 37, 38, 39, 40].includes(e.keyCode) ||
                                            (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) || // Ctrl+A
                                            (e.keyCode >= 35 && e.keyCode <= 39)) { // end, home
                                            return;
                                        }
                                        // Check if it's a digit and if we reached 16 digits
                                        const cleanValue = e.currentTarget.textContent.replace(/\D/g, '');
                                        if (cleanValue.length >= 16 && (e.keyCode < 48 || e.keyCode > 57) && (e.keyCode < 96 || e.keyCode > 105)) {
                                            // Fall through if not a digit anyway
                                        } else if (cleanValue.length >= 16) {
                                            e.preventDefault();
                                        }
                                    }}
                                    onInput={(e) => {
                                        let value = e.currentTarget.textContent.replace(/\D/g, '');
                                        if (value.length > 16) value = value.slice(0, 16);
                                        const formatted = value.replace(/(\d{4})(?=\d)/g, '$1 ');
                                        setCardNumber(formatted);
                                        e.currentTarget.textContent = formatted;

                                        // Maintain cursor position roughly (simple approach for contentEditable)
                                        const range = document.createRange();
                                        const sel = window.getSelection();
                                        range.setStart(e.currentTarget, e.currentTarget.childNodes.length);
                                        range.collapse(true);
                                        sel.removeAllRanges();
                                        sel.addRange(range);
                                    }}
                                    onFocus={(e) => {
                                        if (e.currentTarget.textContent === '0000 0000 0000 0000') {
                                            e.currentTarget.textContent = '';
                                        }
                                    }}
                                    onBlur={(e) => {
                                        if (!e.currentTarget.textContent.trim()) {
                                            e.currentTarget.textContent = '0000 0000 0000 0000';
                                            setCardNumber('');
                                        }
                                    }}
                                >
                                    {cardNumber || '0000 0000 0000 0000'}
                                </div>

                                <div className="card-details-row">
                                    <div className="card-holder-section">
                                        <div className="card-label-text">{t('deposit.form.holder_label')}</div>
                                        <input
                                            className="card-value-text"
                                            value={cardHolder}
                                            onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                                            placeholder={t('deposit.form.holder_placeholder')}
                                        />
                                    </div>
                                    <div style={{ width: '80px', textAlign: 'right' }}>
                                        <div className="card-label-text">EXP</div>
                                        <div
                                            contentEditable
                                            suppressContentEditableWarning
                                            className="card-expiry-text"
                                            onKeyDown={(e) => {
                                                if ([8, 46, 9, 27, 13, 37, 38, 39, 40].includes(e.keyCode) ||
                                                    (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true))) {
                                                    return;
                                                }
                                                const cleanValue = e.currentTarget.textContent.replace(/\D/g, '');
                                                if (cleanValue.length >= 4 && (e.keyCode < 48 || e.keyCode > 57) && (e.keyCode < 96 || e.keyCode > 105)) {
                                                } else if (cleanValue.length >= 4) {
                                                    e.preventDefault();
                                                }
                                            }}
                                            onInput={(e) => {
                                                let value = e.currentTarget.textContent.replace(/\D/g, '');
                                                if (value.length > 4) value = value.slice(0, 4);
                                                if (value.length >= 2) {
                                                    const formatted = `${value.slice(0, 2)}/${value.slice(2)}`;
                                                    setExpiry(formatted);
                                                    e.currentTarget.textContent = formatted;
                                                } else {
                                                    setExpiry(value);
                                                    e.currentTarget.textContent = value;
                                                }
                                                // Maintain cursor position
                                                const range = document.createRange();
                                                const sel = window.getSelection();
                                                range.setStart(e.currentTarget, e.currentTarget.childNodes.length);
                                                range.collapse(true);
                                                sel.removeAllRanges();
                                                sel.addRange(range);
                                            }}
                                            onFocus={(e) => {
                                                if (e.currentTarget.textContent === 'MM/AA') {
                                                    e.currentTarget.textContent = '';
                                                }
                                            }}
                                            onBlur={(e) => {
                                                if (!e.currentTarget.textContent.trim()) {
                                                    e.currentTarget.textContent = 'MM/AA';
                                                    setExpiry('');
                                                }
                                            }}
                                        >
                                            {expiry || 'MM/AA'}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div style={{ marginTop: '15px' }}>
                                <label style={styles.label}>{t('deposit.form.cvc_label')}</label>
                                <input
                                    style={{
                                        ...styles.mobileInput,
                                        borderColor: cvc && !isCvcValid() ? 'red' : '#ddd'
                                    }}
                                    value={cvc}
                                    onChange={handleCvcChange}
                                    placeholder="123"
                                    maxLength="4"
                                />
                            </div>

                            <div style={{ marginTop: '1.5rem' }}>
                                <label style={styles.label}>{t('deposit.form.target_account')}</label>
                                <select style={styles.mobileSelect} value={selectedWallet} onChange={(e) => setSelectedWallet(e.target.value)}>
                                    {wallets.map(w => <option key={w.id} value={w.id}>{w.type === 'main' ? t('accounts.card.main') : t('accounts.card.savings')} ({w.balance} €)</option>)}
                                </select>
                            </div>
                        </div>
                    ) : (
                        activeMethod === 'bank_transfer' && (
                            <div className="fadeIn" style={{ padding: '1rem', textAlign: 'center' }}>
                                <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '12px', border: '1px solid #eee' }}>
                                    <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>{t('deposit.bank_details.header')}</div>

                                    <div style={styles.mobileDetailRow}><span>{t('deposit.bank_details.bank_name')}:</span> <strong>INVIK BANK SA</strong></div>
                                    <div style={styles.mobileDetailRow}>
                                        <span>{t('deposit.bank_details.bic')}:</span>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <strong>INVKBKFR</strong>
                                            <button style={styles.smallCopyBtn} onClick={() => copyToClipboard('INVKBKFR', t('deposit.bank_details.bic'))}>
                                                <i className="far fa-copy"></i>
                                            </button>
                                        </div>
                                    </div>
                                    <div style={{ ...styles.mobileDetailRow, border: 'none', marginBottom: '15px' }}>
                                        <span>{t('deposit.bank_details.iban')}:</span>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <strong style={{ fontSize: '0.95rem' }}>{wallets.find(w => w.id === selectedWallet)?.iban || 'FR76 ...'}</strong>
                                            <button style={styles.smallCopyBtn} onClick={() => copyToClipboard(wallets.find(w => w.id === selectedWallet)?.iban, 'IBAN')}>
                                                <i className="far fa-copy"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                    {activeMethod === 'card' && (
                        <div style={styles.fixedBottomBar}>
                            <button
                                onClick={handleCardDeposit}
                                disabled={submitting || !isFormValid}
                                style={{
                                    ...styles.mobileNextBtn,
                                    opacity: isFormValid ? 1 : 0.5,
                                    background: isFormValid ? '#003366' : '#94a3b8'
                                }}
                            >
                                {submitting ? <i className="fas fa-spinner fa-spin"></i> : t('deposit.form.pay', { amount: amount || '0' })}
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <div style={styles.container}>
                    <header style={styles.header}>
                        <h1 style={styles.title}>{t('sidebar.nav.deposit')}</h1>
                        <p style={styles.subtitle}>{t('deposit.subtitle')}</p>
                    </header>

                    <div style={styles.methodsGrid}>
                        <div onClick={() => setActiveMethod('card')} style={{ ...styles.methodCard, ...(activeMethod === 'card' ? styles.activeMethod : {}) }}>
                            <div style={styles.iconCircle}><i className="fas fa-credit-card"></i></div>
                            <div style={styles.methodInfo}><h3>{t('deposit.methods.card.title')}</h3><p>{t('deposit.methods.card.desc')}</p></div>
                            {activeMethod === 'card' && <i className="fas fa-check-circle" style={styles.checkIcon}></i>}
                        </div>
                        <div onClick={() => setActiveMethod('bank_transfer')} style={{ ...styles.methodCard, ...(activeMethod === 'bank_transfer' ? styles.activeMethod : {}) }}>
                            <div style={styles.iconCircle}><i className="fas fa-university"></i></div>
                            <div style={styles.methodInfo}><h3>{t('deposit.methods.bank.title')}</h3><p>{t('deposit.methods.bank.desc')}</p></div>
                            {activeMethod === 'bank_transfer' && <i className="fas fa-check-circle" style={styles.checkIcon}></i>}
                        </div>
                    </div>

                    <div style={styles.contentCard} className="fadeIn">
                        {(message.text || hasPendingDeposit) && (
                            <div style={{
                                ...styles.alert,
                                backgroundColor: (message.type === 'success' || hasPendingDeposit) ? '#fff3cd' : '#ffebee',
                                color: (message.type === 'success' || hasPendingDeposit) ? '#856404' : '#c62828',
                                border: (message.type === 'success' || hasPendingDeposit) ? '1px solid #ffeeba' : 'none',
                                fontSize: '1.1rem',
                                fontWeight: '600'
                            }}>
                                <i className={`fas ${(message.type === 'success' || hasPendingDeposit) ? 'fa-hourglass-half' : 'fa-exclamation-triangle'}`}></i> {message.text || t('deposit.messages.pending_alert')}
                            </div>
                        )}

                        {activeMethod === 'card' ? (
                            <form onSubmit={handleCardDeposit}>
                                <div style={styles.amountSection}>
                                    <label style={styles.label}>{t('deposit.form.amount_label')}</label>
                                    <div style={styles.amountInputWrapper}>
                                        <input type="number" style={styles.amountInput} value={amount} onChange={(e) => setAmount(e.target.value)} placeholder={t('deposit.form.amount_placeholder')} min="10" required />
                                        <span style={styles.currency}>EUR</span>
                                    </div>
                                </div>

                                <div className="modern-card-container" style={{ marginBottom: '2rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                                        <div style={{
                                            width: '60px',
                                            height: '42px',
                                            background: 'linear-gradient(135deg, #d4af37 0%, #f9d976 100%)',
                                            borderRadius: '8px',
                                            boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
                                        }}></div>
                                        <div style={{ fontSize: '1.8rem', color: 'rgba(255,255,255,0.8)' }}>
                                            <i className="fas fa-wifi"></i>
                                        </div>
                                    </div>

                                    <div
                                        contentEditable
                                        suppressContentEditableWarning
                                        className="card-number-display"
                                        onKeyDown={(e) => {
                                            if ([8, 46, 9, 27, 13, 37, 38, 39, 40].includes(e.keyCode) ||
                                                (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) ||
                                                (e.keyCode >= 35 && e.keyCode <= 39)) {
                                                return;
                                            }
                                            const cleanValue = e.currentTarget.textContent.replace(/\D/g, '');
                                            if (cleanValue.length >= 16 && (e.keyCode < 48 || e.keyCode > 57) && (e.keyCode < 96 || e.keyCode > 105)) {
                                            } else if (cleanValue.length >= 16) {
                                                e.preventDefault();
                                            }
                                        }}
                                        onInput={(e) => {
                                            let value = e.currentTarget.textContent.replace(/\D/g, '');
                                            if (value.length > 16) value = value.slice(0, 16);
                                            const formatted = value.replace(/(\d{4})(?=\d)/g, '$1 ');
                                            setCardNumber(formatted);
                                            e.currentTarget.textContent = formatted;

                                            const range = document.createRange();
                                            const sel = window.getSelection();
                                            range.setStart(e.currentTarget, e.currentTarget.childNodes.length);
                                            range.collapse(true);
                                            sel.removeAllRanges();
                                            sel.addRange(range);
                                        }}
                                        onFocus={(e) => {
                                            if (e.currentTarget.textContent === '0000 0000 0000 0000') {
                                                e.currentTarget.textContent = '';
                                            }
                                        }}
                                        onBlur={(e) => {
                                            if (!e.currentTarget.textContent.trim()) {
                                                e.currentTarget.textContent = '0000 0000 0000 0000';
                                                setCardNumber('');
                                            }
                                        }}
                                        style={{ fontSize: '1.8rem' }}
                                    >
                                        {cardNumber || '0000 0000 0000 0000'}
                                    </div>

                                    <div className="card-details-row">
                                        <div className="card-holder-section">
                                            <div className="card-label-text">{t('deposit.form.holder_label')}</div>
                                            <input
                                                className="card-value-text"
                                                style={{ fontSize: '1.1rem' }}
                                                value={cardHolder}
                                                onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                                                placeholder={t('deposit.form.holder_placeholder')}
                                            />
                                        </div>
                                        <div style={{ width: '100px', textAlign: 'right' }}>
                                            <div className="card-label-text">EXP</div>
                                            <div
                                                contentEditable
                                                suppressContentEditableWarning
                                                className="card-expiry-text"
                                                onKeyDown={(e) => {
                                                    if ([8, 46, 9, 27, 13, 37, 38, 39, 40].includes(e.keyCode) ||
                                                        (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true))) {
                                                        return;
                                                    }
                                                    const cleanValue = e.currentTarget.textContent.replace(/\D/g, '');
                                                    if (cleanValue.length >= 4 && (e.keyCode < 48 || e.keyCode > 57) && (e.keyCode < 96 || e.keyCode > 105)) {
                                                    } else if (cleanValue.length >= 4) {
                                                        e.preventDefault();
                                                    }
                                                }}
                                                onInput={(e) => {
                                                    let value = e.currentTarget.textContent.replace(/\D/g, '');
                                                    if (value.length > 4) value = value.slice(0, 4);
                                                    if (value.length >= 2) {
                                                        const formatted = `${value.slice(0, 2)}/${value.slice(2)}`;
                                                        setExpiry(formatted);
                                                        e.currentTarget.textContent = formatted;
                                                    } else {
                                                        setExpiry(value);
                                                        e.currentTarget.textContent = value;
                                                    }
                                                    // Maintain cursor position
                                                    const range = document.createRange();
                                                    const sel = window.getSelection();
                                                    range.setStart(e.currentTarget, e.currentTarget.childNodes.length);
                                                    range.collapse(true);
                                                    sel.removeAllRanges();
                                                    sel.addRange(range);
                                                }}
                                                onFocus={(e) => {
                                                    if (e.currentTarget.textContent === 'MM/AA') {
                                                        e.currentTarget.textContent = '';
                                                    }
                                                }}
                                                onBlur={(e) => {
                                                    if (!e.currentTarget.textContent.trim()) {
                                                        e.currentTarget.textContent = 'MM/AA';
                                                        setExpiry('');
                                                    }
                                                }}
                                                style={{ fontSize: '1.1rem' }}
                                            >
                                                {expiry || 'MM/AA'}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                                    <div style={{ flex: 1 }}>
                                        <label style={styles.label}>{t('deposit.form.cvc_label')}</label>
                                        <input
                                            type="text"
                                            style={{
                                                ...styles.input,
                                                borderColor: cvc && !isCvcValid() ? 'red' : '#ddd'
                                            }}
                                            value={cvc}
                                            onChange={handleCvcChange}
                                            placeholder="123"
                                            maxLength="4"
                                            required
                                        />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <label style={styles.label}>{t('deposit.form.target_account')}</label>
                                        <select style={styles.select} value={selectedWallet} onChange={(e) => setSelectedWallet(e.target.value)}>
                                            {wallets.map(w => <option key={w.id} value={w.id}>{w.type === 'main' ? t('accounts.card.main') : t('accounts.card.savings')} ({w.balance} {w.currency})</option>)}
                                        </select>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    style={{
                                        ...styles.submitBtn,
                                        opacity: isFormValid ? 1 : 0.7,
                                        cursor: isFormValid ? 'pointer' : 'not-allowed',
                                        backgroundColor: isFormValid ? '#003366' : '#64748b'
                                    }}
                                    disabled={submitting || !isFormValid}
                                >
                                    {submitting ? <i className="fas fa-spinner fa-spin"></i> : (
                                        !isAmountValid() ? t('deposit.form.enter_amount') :
                                            !isCardValid() ? t('deposit.form.invalid_card') :
                                                !isExpiryValid() ? t('deposit.form.invalid_expiry') :
                                                    !isCvcValid() ? t('deposit.form.invalid_cvc') :
                                                        t('deposit.form.pay', { amount: amount })
                                    )}
                                </button>
                                <p style={{ textAlign: 'center', fontSize: '0.8rem', color: '#888', marginTop: '1rem' }}><i className="fas fa-lock"></i> {t('deposit.form.secure_notice')}</p>
                            </form>
                        ) : (
                            <div style={styles.transferInfo}>
                                <div style={styles.qrCodePlaceholder}><i className="fas fa-qrcode"></i></div>
                                <h3 style={{ color: '#003366', marginBottom: '1rem' }}>{t('deposit.methods.bank.title')}</h3>
                                <p style={{ color: '#666', marginBottom: '2rem' }}>{t('deposit.methods.bank.desc_full')}</p>

                                <div style={styles.bankDetailRow}>
                                    <span>{t('deposit.bank_details.beneficiary')}</span>
                                    <strong>{currentUser.displayName || 'INVIK CLIENT'}</strong>
                                </div>
                                <div style={styles.bankDetailRow}>
                                    <span>{t('deposit.bank_details.bank_name')}</span>
                                    <strong>INVIK BANK SA</strong>
                                </div>
                                <div style={styles.bankDetailRow}>
                                    <span>{t('deposit.bank_details.bic')}</span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <strong style={{ fontFamily: 'monospace' }}>INVKBKFR</strong>
                                        <button style={styles.copyIconButton} onClick={() => copyToClipboard('INVKBKFR', t('deposit.bank_details.bic'))}>
                                            <i className="far fa-copy"></i>
                                        </button>
                                    </div>
                                </div>
                                <div style={{ ...styles.bankDetailRow, border: 'none' }}>
                                    <span>{t('deposit.bank_details.iban')}</span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <strong style={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>{wallets.find(w => w.id === selectedWallet)?.iban || '...'}</strong>
                                        <button style={styles.copyIconButton} onClick={() => copyToClipboard(wallets.find(w => w.id === selectedWallet)?.iban, 'IBAN')}>
                                            <i className="far fa-copy"></i>
                                        </button>
                                    </div>
                                </div>
                                <div style={styles.copyTip}>{t('deposit.bank_details.processing_delay')}</div>
                            </div>
                        )}
                    </div>

                    {/* Desktop Mini History for Deposits */}
                    <div style={{ ...styles.contentCard, marginTop: '2rem' }}>
                        <h3 style={{ fontSize: '1.1rem', color: '#003366', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <i className="fas fa-history"></i> {t('deposit.history.title')}
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {paginatedHistory.map(tx => (
                                <div key={tx.id} style={{ display: 'flex', alignItems: 'center', padding: '15px', backgroundColor: '#f8fbff', borderRadius: '12px' }}>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>{tx.amount} {tx.currency || 'EUR'}</div>
                                        <div style={{ fontSize: '0.8rem', color: '#888' }}>{new Date(tx.createdAt?.toDate() || tx.createdAt).toLocaleDateString()} via {tx.method === 'card' ? t('deposit.history.methods.card') : t('deposit.history.methods.transfer')}</div>
                                    </div>
                                    <span style={{
                                        padding: '5px 12px',
                                        borderRadius: '50px',
                                        fontSize: '0.75rem',
                                        fontWeight: 'bold',
                                        backgroundColor: tx.status === 'pending' ? '#fff3cd' :
                                            (tx.status === 'in_review' ? '#e8eaf6' :
                                                (tx.status === 'rejected' ? '#ffebee' : '#e8f5e9')),
                                        color: tx.status === 'pending' ? '#856404' :
                                            (tx.status === 'in_review' ? '#283593' :
                                                (tx.status === 'rejected' ? '#c62828' : '#2e7d32')),
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px'
                                    }}>
                                        {(tx.status === 'pending' || tx.status === 'in_review') && <i className="fas fa-circle-notch fa-spin" style={{ fontSize: '0.7rem' }}></i>}
                                        {tx.status === 'pending' ? t('status.pending') :
                                            (tx.status === 'in_review' ? t('status.in_review') :
                                                (tx.status === 'rejected' ? t('status.rejected') : t('status.completed')))}
                                    </span>
                                </div>
                            ))}
                            {depositHistory.length === 0 && <p style={{ textAlign: 'center', color: '#888' }}>{t('deposit.history.empty')}</p>}
                        </div>
                        <PaginationControls />
                    </div>
                </div>
            )}
        </KycVerificationBanner>
    );
};

const styles = {
    // DESKTOP
    container: { maxWidth: '800px', margin: '0 auto', padding: '0 1rem' },
    loading: { textAlign: 'center', padding: '4rem', color: '#003366' },
    header: { textAlign: 'center', marginBottom: '3rem' },
    title: { fontSize: '2rem', color: '#003366', fontWeight: '800' },
    subtitle: { color: '#666' },
    methodsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' },
    methodCard: { backgroundColor: 'white', padding: '1.5rem', borderRadius: '16px', border: '2px solid transparent', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1rem', transition: 'all 0.2s', position: 'relative' },
    activeMethod: { border: '2px solid #003366', backgroundColor: '#f0f4f8' },
    iconCircle: { width: '50px', height: '50px', backgroundColor: '#e3f2fd', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1565c0', fontSize: '1.4rem' },
    methodInfo: { flex: 1 },
    checkIcon: { color: '#003366', fontSize: '1.2rem' },
    contentCard: { backgroundColor: 'white', borderRadius: '24px', padding: '2.5rem', boxShadow: '0 15px 40px rgba(0,0,0,0.08)' },
    amountSection: { marginBottom: '2rem', textAlign: 'center' },
    amountInputWrapper: { display: 'inline-flex', alignItems: 'center', borderBottom: '2px solid #ddd' },
    amountInput: { border: 'none', fontSize: '2.5rem', fontWeight: '800', width: '150px', textAlign: 'right', color: '#003366', outline: 'none' },
    currency: { fontSize: '1.2rem', fontWeight: 'bold', color: '#888', marginLeft: '10px', paddingBottom: '10px' },
    input: { width: '100%', padding: '1rem', borderRadius: '10px', border: '1px solid #ddd', fontSize: '1rem', outline: 'none' },
    select: { width: '100%', padding: '1rem', borderRadius: '10px', border: '1px solid #ddd', fontSize: '1rem', outline: 'none', backgroundColor: 'white' },
    label: { display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '600', color: '#555' },
    submitBtn: { width: '100%', padding: '1.2rem', backgroundColor: '#003366', color: 'white', border: 'none', borderRadius: '12px', fontSize: '1.1rem', fontWeight: '800', marginTop: '2rem', cursor: 'pointer', transition: 'transform 0.2s', boxShadow: '0 5px 15px rgba(0,51,102,0.2)' },
    alert: { padding: '1rem', borderRadius: '10px', marginBottom: '1.5rem', display: 'flex', gap: '10px', alignItems: 'center' },
    transferInfo: { textAlign: 'center' },
    bankDetailRow: { display: 'flex', justifyContent: 'space-between', padding: '1rem 0', borderBottom: '1px solid #eee', fontSize: '1rem' },
    qrCodePlaceholder: { width: '100px', height: '100px', backgroundColor: '#f5f5f5', margin: '0 auto 1.5rem', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', color: '#ddd' },
    copyTip: { marginTop: '2rem', fontSize: '0.85rem', color: '#888', fontStyle: 'italic' },

    // MOBILE SPECIFIC
    mobileTabs: { display: 'flex', backgroundColor: '#fff', borderRadius: '10px', padding: '4px', marginBottom: '1.5rem', border: '1px solid #eee' },
    mobileTab: { flex: 1, padding: '10px', border: 'none', backgroundColor: 'transparent', borderRadius: '8px', fontWeight: '600', color: '#888', cursor: 'pointer' },
    mobileTabActive: { flex: 1, padding: '10px', border: 'none', backgroundColor: '#003366', color: '#fff', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' },
    mobileInput: { width: '100%', height: '52px', padding: '12px 16px', borderRadius: '12px', border: '1px solid #ddd', backgroundColor: '#fff', fontSize: '1rem', boxSizing: 'border-box' },
    mobileSelect: { width: '100%', height: '52px', padding: '12px 16px', borderRadius: '12px', border: '1px solid #ddd', backgroundColor: '#fff', fontSize: '1rem', boxSizing: 'border-box', appearance: 'none', backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23003366%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.4-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 16px top 50%', backgroundSize: '0.65rem auto' },
    mobileAmountInput: { border: 'none', fontSize: '3rem', fontWeight: 'bold', width: '150px', textAlign: 'center', color: '#003366', outline: 'none', background: 'transparent' },
    chipBtn: { padding: '5px 12px', borderRadius: '20px', border: '1px solid #003366', backgroundColor: '#e3f2fd', color: '#003366', fontWeight: 'bold', cursor: 'pointer' },
    fixedBottomBar: { position: 'fixed', bottom: 0, left: 0, right: 0, padding: '15px', backgroundColor: 'white', borderTop: '1px solid #eee', zIndex: 100 },
    mobileNextBtn: { width: '100%', padding: '14px', backgroundColor: '#003366', color: 'white', border: 'none', borderRadius: '12px', fontSize: '1.1rem', fontWeight: 'bold' },
    mobileDetailRow: { display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee', fontSize: '0.9rem', color: '#333' },
    smallCopyBtn: { background: 'none', border: 'none', color: '#00ccff', cursor: 'pointer', fontSize: '1rem', padding: '0 5px' },
    copyIconButton: { background: '#f0f4f8', border: 'none', color: '#003366', cursor: 'pointer', fontSize: '1rem', padding: '8px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' },

    desktopPagination: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', padding: '1.5rem' },
    mobilePagination: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', padding: '1.5rem' },
    pageBtn: { background: '#f0f4f8', border: 'none', borderRadius: '8px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#003366', cursor: 'pointer', transition: 'all 0.2s' },
    pageBtnDisabled: { background: '#f5f5f5', border: 'none', borderRadius: '8px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc', cursor: 'not-allowed' },
    pageIndicator: { fontSize: '0.9rem', fontWeight: '600', color: '#555' }
};

export default Deposit;
