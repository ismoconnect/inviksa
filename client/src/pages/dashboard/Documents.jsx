import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { useTranslation } from 'react-i18next';
import { ribService } from '../../services/ribService';
import KycVerificationBanner from '../../components/dashboard/KycVerificationBanner';
import { jsPDF } from 'jspdf';

const Documents = () => {
    const { currentUser, userData } = useAuth();
    const { ribs, loading } = useData();
    const { showToast } = useNotifications();
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const { t, i18n } = useTranslation();

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Helper to load image
    const loadImage = (url) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'Anonymous';
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                resolve(canvas.toDataURL('image/png'));
            };
            img.onerror = reject;
            img.src = url;
        });
    };

    // Helper to add standard Header & Footer to PDF
    const addPdfBranding = async (doc, title) => {
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();

        // --- Header ---
        doc.setFillColor(0, 51, 102); // Navy Blue
        doc.rect(0, 0, pageWidth, 40, 'F');

        try {
            const logoData = await loadImage('/logo-new.png');
            doc.addImage(logoData, 'PNG', 20, 8, 25, 25);
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(22);
            doc.setFont("helvetica", "bold");
            doc.text("INVIK S.A.", 50, 25);
            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");
            doc.text(t('documents.branding.tagline'), 50, 32);
        } catch (e) {
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(22);
            doc.setFont("helvetica", "bold");
            doc.text("INVIK S.A.", 20, 25);
        }

        // Document Title
        doc.setTextColor(0, 51, 102);
        doc.setFontSize(18);
        doc.setFont("helvetica", "bold");
        doc.text(title.toUpperCase(), 20, 60);

        // Date
        doc.setFontSize(9);
        doc.setFont("helvetica", "italic");
        const localeMap = { 'en': 'en-US', 'fr': 'fr-FR', 'de': 'de-DE', 'es': 'es-ES', 'it': 'it-IT', 'pt': 'pt-PT' };
        const locale = localeMap[i18n.language] || 'en-US';
        doc.text(`${t('history.columns.date')}: ${new Date().toLocaleDateString(locale)} ${t('common.at')} ${new Date().toLocaleTimeString(locale)}`, 20, 68);

        // --- Footer ---
        doc.setDrawColor(240, 240, 240);
        doc.line(20, pageHeight - 30, pageWidth - 20, pageHeight - 30);

        doc.setFontSize(7);
        doc.setTextColor(150, 150, 150);
        doc.text(t('documents.branding.legal_1'), pageWidth / 2, pageHeight - 22, { align: "center" });
        doc.text(t('documents.branding.legal_2'), pageWidth / 2, pageHeight - 17, { align: "center" });
        doc.text(t('documents.branding.legal_3'), pageWidth / 2, pageHeight - 12, { align: "center" });
    };

    const handleDownload = async (rib) => {
        try {
            const doc = new jsPDF();
            const pageWidth = doc.internal.pageSize.getWidth();

            await addPdfBranding(doc, t('documents.sections.rib'));

            // --- Holder Info ---
            doc.setDrawColor(240, 240, 240);
            doc.line(20, 75, pageWidth - 20, 75);

            doc.setTextColor(100, 100, 100);
            doc.setFontSize(10);
            doc.setFont("helvetica", "bold");
            doc.text(t('documents.rib.holder'), 20, 85);

            doc.setTextColor(0, 0, 0);
            doc.setFontSize(12);
            doc.setFont("helvetica", "normal");
            const fullName = `${userData?.firstName || ''} ${userData?.lastName || ''}`.trim() || rib.holderName || t('history.types.beneficiary');
            doc.text(fullName, 20, 93);
            doc.text(userData?.address || t('settings.profile.not_defined'), 20, 100);
            if (userData?.zipCode || userData?.city) {
                doc.text(`${userData?.zipCode || ""} ${userData?.city || ""}`, 20, 107);
            }

            // --- Bank Info ---
            doc.setTextColor(100, 100, 100);
            doc.setFontSize(10);
            doc.setFont("helvetica", "bold");
            doc.text(t('documents.rib.bank'), 120, 85);

            doc.setTextColor(0, 0, 0);
            doc.setFontSize(12);
            doc.setFont("helvetica", "normal");
            doc.text("INVIK S.A.", 120, 93);
            doc.setFontSize(9);
            doc.text("51, Blvd Grande-Duchesse Charlotte", 120, 100);
            doc.text("L-1331 Luxembourg", 120, 107);

            // --- Banking Details Table ---
            const tableY = 120;
            const tableHeight = 60;
            const tableWidth = pageWidth - 40;
            const colWidth = tableWidth / 4;

            doc.setFillColor(248, 251, 255);
            doc.rect(20, tableY, tableWidth, tableHeight, 'F');
            doc.setDrawColor(0, 51, 102);
            doc.setLineWidth(0.5);
            doc.rect(20, tableY, tableWidth, tableHeight, 'S');

            doc.setDrawColor(230, 230, 230);
            doc.line(20 + colWidth, tableY, 20 + colWidth, tableY + tableHeight);
            doc.line(20 + colWidth * 2, tableY, 20 + colWidth * 2, tableY + tableHeight);
            doc.line(20 + colWidth * 3, tableY, 20 + colWidth * 3, tableY + tableHeight);

            doc.setFontSize(8); // Slightly smaller for long labels
            doc.setTextColor(100, 100, 100);
            doc.setFont("helvetica", "bold");
            doc.text(t('documents.rib.bank_code').toUpperCase(), 20 + 5, tableY + 10);
            doc.text(t('documents.rib.branch_code').toUpperCase(), 20 + colWidth + 5, tableY + 10);
            doc.text(t('documents.rib.account_number').toUpperCase(), 20 + colWidth * 2 + 5, tableY + 10);
            doc.text(t('documents.rib.key').toUpperCase(), 20 + colWidth * 3 + 5, tableY + 10);

            doc.setFontSize(10);
            doc.setTextColor(0, 51, 102);
            doc.setFont("courier", "bold");
            doc.text(rib.bankCode || "12345", 20 + 5, tableY + 25);
            doc.text(rib.branchCode || "67890", 20 + colWidth + 5, tableY + 25);
            doc.text(rib.accountNumber || "XXXXXXXX", 20 + colWidth * 2 + 5, tableY + 25);
            doc.text(rib.ribKey || "00", 20 + colWidth * 3 + 5, tableY + 25);

            doc.setFontSize(11);
            doc.setTextColor(0, 0, 0);
            doc.setFont("helvetica", "bold");
            doc.text(`${t('documents.rib.iban')} :`, 25, tableY + 40);
            doc.text(`${t('documents.rib.bic')} :`, 25, tableY + 52);

            doc.setFont("courier", "bold");
            doc.text(rib.iban || t('documents.rib.not_defined'), 55, tableY + 40);
            doc.setFont("helvetica", "normal");
            doc.text(rib.bic || "INVKFR2P", 55, tableY + 52);

            const accountLabel = t(`accounts.card.${rib.walletType || 'main'}`);
            doc.save(`RIB_INVIK_SA_${accountLabel.split(' ').join('_')}.pdf`);
            showToast(t('documents.messages.rib_success'), "success");
        } catch (error) {
            console.error("PDF Generation error:", error);
            showToast(t('documents.messages.rib_error'), "error");
        }
    };

    const handleDownloadContract = async () => {
        try {
            const doc = new jsPDF();
            const pageWidth = doc.internal.pageSize.getWidth();
            const fullName = `${userData?.firstName || ''} ${userData?.lastName || ''}`.trim() || t('history.types.beneficiary');

            // Pre-load logo to avoid signature errors
            let logoData = null;
            try {
                logoData = await loadImage('/logo-new.png');
            } catch (e) {
                console.warn("Could not load logo", e);
            }

            await addPdfBranding(doc, t('documents.contract.pdf_title'));

            // --- Parties ---
            doc.setFontSize(11);
            doc.setFont("helvetica", "bold");
            doc.text(t('documents.contract.parties'), 20, 85);

            doc.setFont("helvetica", "normal");
            doc.text(t('documents.contract.bank_party'), 25, 95);
            doc.text(t('documents.contract.client_party', { name: fullName }), 25, 102);
            doc.setFontSize(10);
            doc.text(t('documents.contract.residing_at', { address: userData?.address || t('documents.rib.not_defined'), zip: userData?.zipCode || "", city: userData?.city || "" }), 30, 108);

            // --- Body ---
            doc.setFontSize(11);
            doc.setFont("helvetica", "bold");
            doc.text(t('documents.contract.object_title'), 20, 125);
            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            const intro = t('documents.contract.object_text');
            const splitIntro = doc.splitTextToSize(intro, pageWidth - 40);
            doc.text(splitIntro, 20, 135, { lineHeightFactor: 1.5 });

            doc.setFont("helvetica", "bold");
            doc.text(t('documents.contract.terms_title'), 20, 155);
            doc.setFont("helvetica", "normal");
            const terms = [
                t('documents.contract.terms_1'),
                t('documents.contract.terms_2'),
                t('documents.contract.terms_3'),
                t('documents.contract.terms_4')
            ];

            let currentY = 165;
            terms.forEach(term => {
                const splitTerm = doc.splitTextToSize(term, pageWidth - 50);
                doc.text(splitTerm, 25, currentY, { lineHeightFactor: 1.4 });
                currentY += (splitTerm.length * 7); // Increment Y based on lines
            });

            doc.setFont("helvetica", "bold");
            doc.text(t('documents.contract.duration_title'), 20, currentY + 10);
            doc.setFont("helvetica", "normal");
            const durationText = t('documents.contract.duration_text');
            const splitDuration = doc.splitTextToSize(durationText, pageWidth - 40);
            doc.text(splitDuration, 20, currentY + 20, { lineHeightFactor: 1.4 });

            // --- Signatures (New Page) ---
            doc.addPage();
            await addPdfBranding(doc, t('documents.sections.contract'));

            const sigY = 85;
            doc.setFont("helvetica", "bold");
            doc.text(t('documents.contract.signatures_title'), 20, sigY);

            doc.setFontSize(9);
            const localeMap = { 'en': 'en-US', 'fr': 'fr-FR', 'de': 'de-DE', 'es': 'es-ES', 'it': 'it-IT', 'pt': 'pt-PT' };
            const localeDate = localeMap[i18n.language] || 'en-US';
            doc.text(t('documents.contract.made_at', { date: new Date().toLocaleDateString(localeDate) }), 20, sigY + 8);

            doc.rect(20, sigY + 15, 70, 30); // Client Box
            doc.text(t('documents.contract.client_sig'), 25, sigY + 20);
            doc.setFontSize(8);
            doc.text(t('documents.contract.certified_sig'), 25, sigY + 40);

            doc.rect(pageWidth - 90, sigY + 15, 70, 30); // Bank Box
            doc.setFontSize(9);
            doc.text(t('documents.contract.bank_sig'), pageWidth - 85, sigY + 20);

            if (logoData) {
                doc.addImage(logoData, 'PNG', pageWidth - 55, sigY + 15, 15, 15);
            }

            doc.save(`CONTRAT_INVIK_SA_${fullName.split(' ').join('_')}.pdf`);
            showToast(t('documents.messages.contract_success'), "success");
        } catch (error) {
            console.error("Contract Generation error:", error);
            showToast(t('documents.messages.contract_error'), "error");
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const handleShare = (rib) => {
        const accountLabel = t(`accounts.card.${rib.walletType || 'main'}`);
        if (navigator.share) {
            navigator.share({
                title: `RIB - ${accountLabel}`,
                text: t('documents.rib.share_msg', { name: accountLabel, iban: rib.iban }),
                url: window.location.href // In real app, this would be the PDF URL
            }).catch(console.error);
        } else {
            // Fallback
            navigator.clipboard.writeText(rib.iban);
            showToast(t('documents.messages.iban_copied'), "success");
        }
    };

    if (loading && ribs.length === 0) {
        return <div style={styles.loading}>{t('loading')}</div>;
    }

    // --- DESKTOP VIEW ---
    const DesktopView = () => (
        <div style={styles.container}>
            <header style={styles.header}>
                <h1 style={styles.title}>{t('documents.title')}</h1>
                <p style={styles.subtitle}>{t('documents.subtitle')}</p>
            </header>

            <section style={styles.section}>
                <h2 style={styles.sectionTitle}>
                    <i className="fas fa-university" style={styles.titleIcon}></i>
                    {t('documents.sections.rib')}
                </h2>

                {ribs.length === 0 ? (
                    <div style={styles.emptyState}>
                        <div style={styles.emptyIconCircle}>
                            <i className="fas fa-file-invoice" style={styles.emptyIcon}></i>
                        </div>
                        <p>{t('documents.messages.empty')}</p>
                    </div>
                ) : (
                    <div style={styles.grid}>
                        {ribs.map(rib => (
                            <div key={rib.id} style={styles.card} className="doc-card">
                                <div style={styles.cardLeftBorder(rib.walletType)}></div>
                                <div style={styles.cardContent}>
                                    <div style={styles.cardHeader}>
                                        <div style={styles.iconBox(rib.walletType)}>
                                            <i className="fas fa-file-invoice-dollar"></i>
                                        </div>
                                        <div style={styles.cardInfo}>
                                            <h3 style={styles.docTitle}>{t('documents.rib.title', { name: t(`accounts.card.${rib.walletType || 'main'}`) })}</h3>
                                            <div style={styles.ribDetails}>
                                                <div style={styles.detailRow}>
                                                    <span style={styles.detailLabel}>{t('documents.rib.holder')}:</span>
                                                    <span style={styles.detailValue}>{rib.holderName || (userData?.firstName + ' ' + userData?.lastName)}</span>
                                                </div>

                                                {/* French RIB Standard Display */}
                                                <div style={styles.ribTableContainer}>
                                                    <div style={styles.ribTable}>
                                                        <div style={styles.ribTableCol}>
                                                            <span style={styles.ribTableLabel}>{t('documents.rib.bank_code')}</span>
                                                            <span style={styles.ribTableValue}>{rib.bankCode || '12345'}</span>
                                                        </div>
                                                        <div style={styles.ribTableCol}>
                                                            <span style={styles.ribTableLabel}>{t('documents.rib.branch_code')}</span>
                                                            <span style={styles.ribTableValue}>{rib.branchCode || '67890'}</span>
                                                        </div>
                                                        <div style={styles.ribTableCol}>
                                                            <span style={styles.ribTableLabel}>{t('documents.rib.account_number')}</span>
                                                            <span style={styles.ribTableValue}>{rib.accountNumber || 'XXXXXXXX'}</span>
                                                        </div>
                                                        <div style={styles.ribTableCol}>
                                                            <span style={styles.ribTableLabel}>{t('documents.rib.key')}</span>
                                                            <span style={styles.ribTableValue}>{rib.ribKey || '00'}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div style={styles.detailRow}>
                                                    <span style={styles.detailLabel}>IBAN:</span>
                                                    <span style={styles.detailValue} className="monospace">{rib.iban}</span>
                                                </div>
                                                <div style={styles.detailRow}>
                                                    <span style={styles.detailLabel}>BIC:</span>
                                                    <span style={styles.detailValue}>{rib.bic || 'INVKFR2P'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div style={styles.actions}>
                                        <button onClick={() => handleDownload(rib)} style={styles.downloadBtn}>
                                            <i className="fas fa-download"></i>
                                            <span>{t('documents.rib.download_pdf')}</span>
                                        </button>
                                        <button onClick={handlePrint} style={styles.printBtn} title={t('documents.rib.print')}>
                                            <i className="fas fa-print"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            <section style={styles.section}>
                <h2 style={styles.sectionTitle}>
                    <i className="fas fa-file-contract" style={styles.titleIcon}></i>
                    {t('documents.sections.contracts')}
                </h2>
                <div style={styles.grid}>
                    <div style={styles.card} className="doc-card">
                        <div style={styles.cardLeftBorder('contract')}></div>
                        <div style={styles.cardContent}>
                            <div style={styles.cardHeader}>
                                <div style={{ ...styles.iconBox('contract'), backgroundColor: '#eef2f6', color: '#666' }}>
                                    <i className="fas fa-signature"></i>
                                </div>
                                <div style={styles.cardInfo}>
                                    <h3 style={styles.docTitle}>{t('documents.contract.title')}</h3>
                                    <p style={styles.docMeta}>
                                        <i className="far fa-clock" style={{ marginRight: '5px' }}></i>
                                        {t('documents.contract.signed_on', { date: userData?.createdAt?.toDate().toLocaleDateString(i18n.language === 'en' ? 'en-US' : (i18n.language === 'de' ? 'de-DE' : (i18n.language === 'es' ? 'es-ES' : (i18n.language === 'it' ? 'it-IT' : (i18n.language === 'pt' ? 'pt-PT' : 'fr-FR'))))) || 'N/A' })}
                                    </p>
                                </div>
                            </div>
                            <div style={styles.actions}>
                                <button onClick={handleDownloadContract} style={styles.downloadBtn}>
                                    <i className="fas fa-file-pdf"></i>
                                    <span>{t('documents.contract.download')}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );

    // --- MOBILE VIEW ---
    const MobileView = () => (
        <div style={styles.mobileContainer}>
            <div style={styles.mobileHeader}>
                <h1>{t('sidebar.nav.documents')}</h1>
                <span style={styles.mobileBadge}>{ribs.length} {t('documents.messages.available')}</span>
            </div>

            <div style={styles.mobileList}>
                {ribs.map(rib => (
                    <div key={rib.id} style={styles.mobileCard}>
                        <div style={styles.mobileCardTop}>
                            <div style={{ ...styles.mobileIconBadge, backgroundColor: rib.walletType === 'main' ? '#e3f2fd' : (rib.walletType === 'savings' ? '#e8f5e9' : '#ffebee'), color: rib.walletType === 'main' ? '#1565c0' : (rib.walletType === 'savings' ? '#2e7d32' : '#c62828') }}>
                                <i className="fas fa-file-alt"></i>
                            </div>
                            <div style={styles.mobileCardInfo}>
                                <h3>{t(`accounts.card.${rib.walletType || 'main'}`)}</h3>
                                <p>{rib.iban.match(/.{1,4}/g).join(' ').substring(0, 20)}...</p>
                            </div>
                        </div>
                        <div style={styles.mobileCardActions}>
                            <button onClick={() => handleDownload(rib)} style={styles.mobileActionBtnPrimary}>
                                <i className="fas fa-download"></i> PDF
                            </button>
                            <button onClick={() => handleShare(rib)} style={styles.mobileActionBtnSecondary}>
                                <i className="fas fa-share-alt"></i>
                            </button>
                        </div>
                    </div>
                ))}

                <div style={styles.mobileCard}>
                    <div style={styles.mobileCardTop}>
                        <div style={{ ...styles.mobileIconBadge, backgroundColor: '#f5f5f5', color: '#616161' }}>
                            <i className="fas fa-signature"></i>
                        </div>
                        <div style={styles.mobileCardInfo}>
                            <h3>{t('documents.contract.client_contract')}</h3>
                            <p>{t('documents.contract.signed_on', { date: userData?.createdAt?.toDate().toLocaleDateString(i18n.language === 'en' ? 'en-US' : (i18n.language === 'de' ? 'de-DE' : (i18n.language === 'es' ? 'es-ES' : (i18n.language === 'it' ? 'it-IT' : (i18n.language === 'pt' ? 'pt-PT' : 'fr-FR'))))) || 'N/A' })}</p>
                        </div>
                    </div>
                    <div style={styles.mobileCardActions}>
                        <button onClick={handleDownloadContract} style={styles.mobileActionBtnPrimary}>
                            <i className="fas fa-download"></i> PDF
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    return <KycVerificationBanner>{isMobile ? <MobileView /> : <DesktopView />}</KycVerificationBanner>;
};

const styles = {
    // Shared / Desktop
    container: { maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' },
    loading: { textAlign: 'center', padding: '4rem', color: '#003366', fontSize: '1.2rem', fontWeight: '500' },
    header: { marginBottom: '3rem', textAlign: 'center' },
    title: { fontSize: '2.5rem', color: '#003366', fontWeight: '800', marginBottom: '0.8rem' },
    subtitle: { color: '#666', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' },
    section: { marginBottom: '4rem' },
    sectionTitle: { fontSize: '1.5rem', color: '#1a1a1a', marginBottom: '2rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid #eee', paddingBottom: '1rem' },
    titleIcon: { color: '#003366' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' },
    card: { backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.04)', display: 'flex', overflow: 'hidden', transition: 'transform 0.3s ease', cursor: 'default', position: 'relative' },
    cardLeftBorder: (type) => ({ width: '8px', backgroundColor: type === 'main' ? '#003366' : (type === 'savings' ? '#27ae60' : '#e74c3c'), flexShrink: 0 }),
    cardContent: { flex: 1, padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.2rem' },
    cardHeader: { display: 'flex', alignItems: 'flex-start', gap: '1.2rem' },
    iconBox: (type) => ({ width: '64px', height: '64px', backgroundColor: type === 'main' ? '#f0f4f8' : (type === 'savings' ? '#eafaf1' : (type === 'credit' ? '#fdeaea' : '#f0f0f0')), color: type === 'main' ? '#003366' : (type === 'savings' ? '#27ae60' : (type === 'credit' ? '#e74c3c' : '#7f8c8d')), borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', flexShrink: 0 }),
    cardInfo: { display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' },
    docTitle: { fontSize: '1.2rem', fontWeight: '900', color: '#003366', marginBottom: '0.8rem' },
    ribDetails: { display: 'flex', flexDirection: 'column', gap: '8px' },
    detailRow: { display: 'flex', gap: '12px', alignItems: 'baseline' },
    detailLabel: { fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '800', width: '90px', flexShrink: 0 },
    detailValue: { fontSize: '0.95rem', color: '#1e293b', fontWeight: '600', wordBreak: 'break-all' },

    ribTableContainer: { backgroundColor: '#f8fbff', padding: '12px', borderRadius: '12px', border: '1px solid #eef6ff', margin: '5px 0' },
    ribTable: { display: 'flex', justifyContent: 'space-between', gap: '10px' },
    ribTableCol: { display: 'flex', flexDirection: 'column', gap: '2px' },
    ribTableLabel: { fontSize: '0.6rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' },
    ribTableValue: { fontSize: '0.85rem', color: '#003366', fontWeight: '850', fontFamily: 'monospace' },

    docMeta: { fontSize: '0.9rem', color: '#7f8c8d' },
    actions: { display: 'flex', gap: '1rem', marginTop: 'auto' },
    downloadBtn: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', padding: '0.8rem 1.2rem', backgroundColor: '#003366', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s', fontSize: '0.95rem', boxShadow: '0 4px 6px rgba(0, 51, 102, 0.2)' },
    printBtn: { width: '46px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'white', color: '#666', border: '1px solid #ddd', borderRadius: '10px', cursor: 'pointer', fontSize: '1.1rem' },
    emptyState: { padding: '4rem', backgroundColor: 'white', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', textAlign: 'center', color: '#666' },
    emptyIconCircle: { width: '80px', height: '80px', backgroundColor: '#f8fbff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' },
    emptyIcon: { fontSize: '2.5rem', color: '#003366' },

    // Mobile Specific
    mobileContainer: { padding: '1rem', backgroundColor: '#f4f6f9', minHeight: '80vh' },
    mobileHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
    mobileBadge: { backgroundColor: '#e3f2fd', color: '#1565c0', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '700' },
    mobileList: { display: 'flex', flexDirection: 'column', gap: '1rem' },
    mobileCard: { backgroundColor: 'white', borderRadius: '16px', padding: '1.2rem', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' },
    mobileCardTop: { display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.2rem' },
    mobileIconBadge: { width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' },
    mobileCardInfo: { flex: 1 },
    mobileCardActions: { display: 'flex', gap: '0.8rem' },
    mobileActionBtnPrimary: { flex: 1, padding: '0.8rem', backgroundColor: '#003366', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' },
    mobileActionBtnSecondary: { width: '48px', backgroundColor: '#f5f5f5', color: '#333', border: 'none', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }
};

export default Documents;
