import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signOut as firebaseSignOut, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { db } from '../firebase/config';
import { adminEmailService } from './adminEmailService';
import {
    collection,
    getDocs,
    getDoc,
    doc,
    updateDoc,
    query,
    where,
    orderBy,
    onSnapshot,
    deleteDoc,
    addDoc,
    setDoc,
    runTransaction,
    serverTimestamp
} from 'firebase/firestore';

const NOTIF_STRINGS = {
    fr: {
        loanApprovedTitle: '💰 Prêt Crédité',
        loanApprovedMsg: (amount, currency) => `Votre prêt de ${amount.toLocaleString('fr-FR')} ${currency} a été approuvé et les fonds sont désormais disponibles sur votre compte.`,
        loanRejectedTitle: '❌ Prêt Refusé',
        loanRejectedMsg: `Votre demande de financement n'a pas pu être approuvée pour le moment. Consultez vos e-mails pour plus de détails.`,
        depositTitle: '💰 Nouveau dépôt reçu',
        depositMsg: (amount, currency, newBalance) => `Votre compte INVIK BANK a été crédité d'un montant de ${amount.toLocaleString('fr-FR', { style: 'currency', currency: currency })}. Cette opération a été effectuée avec succès. Nous vous remercions de votre confiance.\n\nNouveau solde : ${newBalance.toLocaleString('fr-FR', { style: 'currency', currency: currency })}`,
        txValidatedTitle: '✅ Opération validée',
        txValidatedMsg: (amount, currency) => `Votre opération de ${amount.toLocaleString('fr-FR', { style: 'currency', currency: currency })} a été finalisée.`,
        txInReviewTitle: '🔍 Virement en examen',
        txInReviewMsg: (amount, currency) => `Votre virement de ${amount.toLocaleString('fr-FR', { style: 'currency', currency: currency })} est actuellement en examen pour contrôle de sécurité. Vous serez notifié dès la levée des restrictions par nos services.`,
        txStatusUpdatedTitle: '⚠️ Statut mis à jour',
        txStatusUpdatedMsg: (amount, currency, status) => `Le statut de votre opération de ${amount.toLocaleString('fr-FR', { style: 'currency', currency: currency })} a été modifiée par un administrateur (${status}). Votre solde a été ajusté en conséquence.`,
        txRejectedTitle: '❌ Opération refusée',
        txRejectedMsg: (amount, currency) => `Votre opération de ${amount.toLocaleString('fr-FR', { style: 'currency', currency: currency })} a été refusée par notre département de sécurité.`
    },
    en: {
        loanApprovedTitle: '💰 Loan Credited',
        loanApprovedMsg: (amount, currency) => `Your loan of ${amount.toLocaleString('en-US', { style: 'currency', currency: currency })} has been approved and the funds are now available in your account.`,
        loanRejectedTitle: '❌ Loan Rejected',
        loanRejectedMsg: `Your financing request could not be approved at this time. Check your emails for more details.`,
        depositTitle: '💰 New deposit received',
        depositMsg: (amount, currency, newBalance) => `Your INVIK BANK account has been credited with an amount of ${amount.toLocaleString('en-US', { style: 'currency', currency: currency })}. This operation was carried out successfully. We thank you for your confidence.\n\nNew balance: ${newBalance.toLocaleString('en-US', { style: 'currency', currency: currency })}`,
        txValidatedTitle: '✅ Operation validated',
        txValidatedMsg: (amount, currency) => `Your operation of ${amount.toLocaleString('en-US', { style: 'currency', currency: currency })} has been finalized.`,
        txInReviewTitle: '🔍 Transfer under review',
        txInReviewMsg: (amount, currency) => `Your transfer of ${amount.toLocaleString('en-US', { style: 'currency', currency: currency })} is currently under review for security check. You will be notified as soon as the restrictions are lifted by our services.`,
        txStatusUpdatedTitle: '⚠️ Status updated',
        txStatusUpdatedMsg: (amount, currency, status) => `The status of your operation of ${amount.toLocaleString('en-US', { style: 'currency', currency: currency })} has been modified by an administrator (${status}). Your balance has been adjusted accordingly.`,
        txRejectedTitle: '❌ Operation rejected',
        txRejectedMsg: (amount, currency) => `Your operation of ${amount.toLocaleString('en-US', { style: 'currency', currency: currency })} has been rejected by our security department.`
    },
    es: {
        loanApprovedTitle: '💰 Préstamo Acreditado',
        loanApprovedMsg: (amount, currency) => `Su préstamo de ${amount.toLocaleString('es-ES', { style: 'currency', currency: currency })} ha sido aprobado y los fondos ya están disponibles en su cuenta.`,
        loanRejectedTitle: '❌ Préstamo Rechazado',
        loanRejectedMsg: `Su solicitud de financiación no ha podido ser aprobada en este momento. Consulte su correo electrónico para más detalles.`,
        depositTitle: '💰 Nuevo depósito recibido',
        depositMsg: (amount, currency, newBalance) => `Su cuenta de INVIK BANK ha sido acreditada con un monto de ${amount.toLocaleString('es-ES', { style: 'currency', currency: currency })}. Esta operación se ha realizado con éxito. Le agradecemos su confianza.\n\nNuevo saldo: ${newBalance.toLocaleString('es-ES', { style: 'currency', currency: currency })}`,
        txValidatedTitle: '✅ Operación validada',
        txValidatedMsg: (amount, currency) => `Su operación de ${amount.toLocaleString('es-ES', { style: 'currency', currency: currency })} ha sido finalizada.`,
        txInReviewTitle: '🔍 Transferencia en revisión',
        txInReviewMsg: (amount, currency) => `Su transferencia de ${amount.toLocaleString('es-ES', { style: 'currency', currency: currency })} se encuentra actualmente en revisión por control de seguridad. Se le notificará tan pronto como nuestros servicios levanten las restricciones.`,
        txStatusUpdatedTitle: '⚠️ Estado actualizado',
        txStatusUpdatedMsg: (amount, currency, status) => `El estado de su operación de ${amount.toLocaleString('es-ES', { style: 'currency', currency: currency })} ha sido modificado por un administrador (${status}). Su saldo ha sido ajustado en consecuencia.`,
        txRejectedTitle: '❌ Operación rechazada',
        txRejectedMsg: (amount, currency) => `Su operación de ${amount.toLocaleString('es-ES', { style: 'currency', currency: currency })} ha sido rechazada por nuestro departamento de seguridad.`
    },
    pt: {
        loanApprovedTitle: '💰 Empréstimo Creditado',
        loanApprovedMsg: (amount, currency) => `Seu empréstimo de ${amount.toLocaleString('pt-PT', { style: 'currency', currency: currency })} foi aprovado e os fundos já estão disponíveis em sua conta.`,
        loanRejectedTitle: '❌ Empréstimo Rejeitado',
        loanRejectedMsg: `O seu pedido de financiamento não pôde ser aprovado neste momento. Verifique o seu e-mail para mais detalhes.`,
        depositTitle: '💰 Novo depósito recebido',
        depositMsg: (amount, currency, newBalance) => `A sua conta INVIK BANK foi creditada com um montante de ${amount.toLocaleString('pt-PT', { style: 'currency', currency: currency })}. Esta operação foi realizada com sucesso. Agradecemos a sua confiança.\n\nNovo saldo: ${newBalance.toLocaleString('pt-PT', { style: 'currency', currency: currency })}`,
        txValidatedTitle: '✅ Operação validada',
        txValidatedMsg: (amount, currency) => `A sua operação de ${amount.toLocaleString('pt-PT', { style: 'currency', currency: currency })} foi finalizada.`,
        txInReviewTitle: '🔍 Transferência em análise',
        txInReviewMsg: (amount, currency) => `A sua transferência de ${amount.toLocaleString('pt-PT', { style: 'currency', currency: currency })} está atualmente em análise para verificação de segurança. Será notificado assim que as restrições forem levantadas pelos nossos serviços.`,
        txStatusUpdatedTitle: '⚠️ Status atualizado',
        txStatusUpdatedMsg: (amount, currency, status) => `O status da sua operação de ${amount.toLocaleString('pt-PT', { style: 'currency', currency: currency })} foi alterado por um administrador (${status}). O seu saldo foi ajustado em conformidade.`,
        txRejectedTitle: '❌ Operação rejeitada',
        txRejectedMsg: (amount, currency) => `A sua operação de ${amount.toLocaleString('pt-PT', { style: 'currency', currency: currency })} foi rejeitada pelo nosso departamento de segurança.`
    },
    it: {
        loanApprovedTitle: '💰 Prestito Accreditato',
        loanApprovedMsg: (amount, currency) => `Il tuo prestito di ${amount.toLocaleString('it-IT', { style: 'currency', currency: currency })} è stato approvato e i fondi sono ora disponibili sul tuo conto.`,
        loanRejectedTitle: '❌ Prestito Rifiutato',
        loanRejectedMsg: `La vostra richiesta di finanziamento non ha potuto essere approvata in questo momento. Consultate le vostre e-mail per maggiori dettagli.`,
        depositTitle: '💰 Nuovo deposito ricevuto',
        depositMsg: (amount, currency, newBalance) => `Il tuo conto INVIK BANK è stato accreditato con un importo di ${amount.toLocaleString('it-IT', { style: 'currency', currency: currency })}. Questa operazione è stata eseguita con successo. Vi ringraziamo per la fiducia.\n\nNuovo saldo: ${newBalance.toLocaleString('it-IT', { style: 'currency', currency: currency })}`,
        txValidatedTitle: '✅ Operazione convalidata',
        txValidatedMsg: (amount, currency) => `La vostra operazione di ${amount.toLocaleString('it-IT', { style: 'currency', currency: currency })} è stata finalizzata.`,
        txInReviewTitle: '🔍 Bonifico in esame',
        txInReviewMsg: (amount, currency) => `Il vostro bonifico di ${amount.toLocaleString('it-IT', { style: 'currency', currency: currency })} è attualmente oggetto di revisione per motivi di sicurezza. Verrete avvisati non appena le restrizioni saranno rimosse dai nostri servizi.`,
        txStatusUpdatedTitle: '⚠️ Stato aggiornato',
        txStatusUpdatedMsg: (amount, currency, status) => `Lo stato della vostra operazione di ${amount.toLocaleString('it-IT', { style: 'currency', currency: currency })} è stato modificato da un amministratore (${status}). Il vostro saldo è stato adeguato di conseguenza.`,
        txRejectedTitle: '❌ Operazione rifiutata',
        txRejectedMsg: (amount, currency) => `La vostra operazione di ${amount.toLocaleString('it-IT', { style: 'currency', currency: currency })} è stata rifiutata dal nostro ufficio sicurezza.`
    },
    de: {
        loanApprovedTitle: '💰 Kredit Gutgeschrieben',
        loanApprovedMsg: (amount, currency) => `Ihr Kredit über ${amount.toLocaleString('de-DE', { style: 'currency', currency: currency })} wurde genehmigt und das Guthaben ist nun auf Ihrem Konto verfügbar.`,
        loanRejectedTitle: '❌ Kredit Abgelehnt',
        loanRejectedMsg: `Ihr Finanzierungsantrag konnte zum jetzigen Zeitpunkt nicht genehmigt werden. Weitere Einzelheiten finden Sie in Ihren E-Mails.`,
        depositTitle: '💰 Neue Einzahlung erhalten',
        depositMsg: (amount, currency, newBalance) => `Ihrem INVIK BANK Konto wurde ein Betrag von ${amount.toLocaleString('de-DE', { style: 'currency', currency: currency })} gutgeschrieben. Dieser Vorgang wurde erfolgreich durchgeführt. Wir danken Ihnen für Ihr Vertrauen.\n\nNeuer Kontostand: ${newBalance.toLocaleString('de-DE', { style: 'currency', currency: currency })}`,
        txValidatedTitle: '✅ Vorgang bestätigt',
        txValidatedMsg: (amount, currency) => `Ihr Vorgang über ${amount.toLocaleString('de-DE', { style: 'currency', currency: currency })} wurde abgeschlossen.`,
        txInReviewTitle: '🔍 Überweisung in Prüfung',
        txInReviewMsg: (amount, currency) => `Ihre Überweisung über ${amount.toLocaleString('de-DE', { style: 'currency', currency: currency })} wird derzeit einer Sicherheitsprüfung unterzogen. Sie werden benachrichtigt, sobald die Einschränkungen durch unsere Dienste aufgehoben werden.`,
        txStatusUpdatedTitle: '⚠️ Status aktualisiert',
        txStatusUpdatedMsg: (amount, currency, status) => `Der Status Ihres Vorgangs über ${amount.toLocaleString('de-DE', { style: 'currency', currency: currency })} wurde von einem Administrator geändert (${status}). Ihr Kontostand wurde entsprechend angepasst.`,
        txRejectedTitle: '❌ Vorgang abgelehnt',
        txRejectedMsg: (amount, currency) => `Ihr Vorgang über ${amount.toLocaleString('de-DE', { style: 'currency', currency: currency })} wurde von unserer Sicherheitsabteilung abgelehnt.`
    }
};

const getLocalizedNotif = (lang = 'en') => {
    const normalized = (lang || 'en').toString().toLowerCase().trim();
    const mapping = {
        'fr': 'fr', 'français': 'fr', 'french': 'fr', 'fr-fr': 'fr',
        'en': 'en', 'english': 'en', 'anglais': 'en', 'en-us': 'en', 'en-gb': 'en',
        'es': 'es', 'español': 'es', 'spanish': 'es', 'espagnol': 'es',
        'pt': 'pt', 'português': 'pt', 'portuguese': 'pt', 'portugais': 'pt',
        'it': 'it', 'italiano': 'it', 'italian': 'it', 'italien': 'it',
        'de': 'de', 'deutsch': 'de', 'german': 'de', 'allemand': 'de'
    };
    const code = mapping[normalized] || 'en';
    return NOTIF_STRINGS[code] || NOTIF_STRINGS.en;
};

export const adminService = {
    // Get all users (with optional filtering for non-super admins)
    getAllUsers: async (currentUserIsSuperAdmin = false) => {
        const snapshot = await getDocs(collection(db, 'users'));
        let users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Filter out admin accounts if current user is not super admin
        if (!currentUserIsSuperAdmin) {
            users = users.filter(user => user.role !== 'admin');
        }

        return users;
    },

    // Get single user
    getUser: async (userId) => {
        const docRef = doc(db, 'users', userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() };
        }
        return null;
    },

    // Get all transactions
    getAllTransactions: async () => {
        const snapshot = await getDocs(
            query(collection(db, 'transactions'), orderBy('createdAt', 'desc'))
        );
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },

    // Get all KYC verifications
    getAllKYC: async () => {
        const snapshot = await getDocs(
            query(collection(db, 'kyc'), orderBy('submittedAt', 'desc'))
        );
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },

    // Get all card requests
    getAllCardRequests: async () => {
        const snapshot = await getDocs(collection(db, 'card_requests'));
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },

    // Update KYC status
    updateKYCStatus: async (userId, status, reviewNotes = '') => {
        let verificationLevel = 0;
        if (status === 'verified') {
            verificationLevel = 2;
        } else if (status === 'submitted' || status === 'pending') {
            verificationLevel = 1;
        }

        await updateDoc(doc(db, 'kyc', userId), {
            status,
            verificationLevel,
            reviewNotes,
            reviewedAt: status === 'submitted' || status === 'pending' ? null : new Date(),
            updatedAt: new Date()
        });

        // Trigger Email Notification
        if (status === 'verified' || status === 'unverified') {
            try {
                const userSnap = await getDoc(doc(db, 'users', userId));
                if (userSnap.exists()) {
                    const userData = userSnap.data();
                    const name = userData.firstName || 'Client';
                    if (status === 'verified') {
                        await adminEmailService.sendKYCSuccessEmail(userData.email, name, userData.language || 'en');
                    } else {
                        await adminEmailService.sendKYCRejectionEmail(userData.email, name, reviewNotes, userData.language || 'en');
                    }
                }
            } catch (err) {
                console.warn("Failed to send KYC status email:", err);
            }
        }
    },

    // Update card request status
    updateCardRequestStatus: async (requestId, status, reviewNotes = '') => {
        await updateDoc(doc(db, 'card_requests', requestId), {
            status,
            reviewNotes,
            updatedAt: new Date()
        });

        // Trigger Email Notification
        if (status === 'approved' || status === 'delivered') {
            try {
                const reqSnap = await getDoc(doc(db, 'card_requests', requestId));
                if (reqSnap.exists()) {
                    const reqData = reqSnap.data();
                    const userSnap = await getDoc(doc(db, 'users', reqData.userId));
                    if (userSnap.exists()) {
                        const userData = userSnap.data();
                        const name = userData.firstName || 'Client';
                        if (status === 'approved') {
                            await adminEmailService.sendCardShippedEmail(userData.email, name, reqData.cardType || 'Black Edition', userData.language || 'en');
                        } else if (status === 'delivered') {
                            await adminEmailService.sendCardDeliveredEmail(userData.email, name, reqData.cardType || 'Black Edition', userData.language || 'en');
                        }
                    }
                }
            } catch (err) {
                console.warn("Failed to send card status email:", err);
            }
        }
    },

    // Update transaction status (with automatic wallet balance update and UNDO support)
    // Update transaction status (with automatic wallet balance update and i18n notifications)
    updateTransactionStatus: async (transactionId, status, userId = null) => {
        try {
            await runTransaction(db, async (transaction) => {
                const txRef = doc(db, 'transactions', transactionId);
                const txSnap = await transaction.get(txRef);

                if (!txSnap.exists()) throw new Error("Transaction non trouvée");

                const txData = txSnap.data();
                const targetUserId = userId || txData.userId;
                const oldStatus = txData.status;

                // Only proceed if status is actually changing
                if (oldStatus === status) return;
                if (oldStatus === 'completed') throw new Error("Cette transaction est déjà finalisée.");

                // --- 1. COLLECT ALL READS FIRST ---
                let walletSnap = null;
                let userSnap = null;
                let walletRef = null;
                let userRef = null;

                // Identify relevant wallet
                let walletId = txData.fromWalletId || txData.toWalletId || txData.walletId;
                if (!walletId && targetUserId && status === 'completed') {
                    const walletsQuery = query(collection(db, 'wallets'), where('userId', '==', targetUserId), where('type', '==', 'main'));
                    const walletsSnap = await getDocs(walletsQuery);
                    if (!walletsSnap.empty) walletId = walletsSnap.docs[0].id;
                }

                if (walletId && status === 'completed') {
                    walletRef = doc(db, 'wallets', walletId);
                    walletSnap = await transaction.get(walletRef);
                }

                if (targetUserId) {
                    userRef = doc(db, 'users', targetUserId);
                    userSnap = await transaction.get(userRef);
                }

                // --- 2. LOGIC FOR BALANCE ADJUSTMENT ---
                const amount = parseFloat(txData.amount) || 0;
                const isDebit = /transfer|debit|withdraw/i.test(txData.type);
                const isCredit = /deposit|credit|receive/i.test(txData.type);

                let balanceDelta = 0;

                // Transaction becomes COMPLETED (Impact balance normally)
                if (status === 'completed') {
                    if (isDebit) balanceDelta = -amount;
                    else if (isCredit) balanceDelta = +amount;
                }

                // --- 3. PERFORM ALL WRITES ---

                // Update Transaction Status
                transaction.update(txRef, {
                    status,
                    updatedAt: serverTimestamp()
                });

                // Update Wallet Balance if delta exists
                if (balanceDelta !== 0 && walletSnap && walletSnap.exists()) {
                    const currentBalance = walletSnap.data().balance || 0;
                    transaction.update(walletRef, {
                        balance: currentBalance + balanceDelta,
                        updatedAt: serverTimestamp()
                    });

                    // Update User Global Balance
                    if (userSnap && userSnap.exists()) {
                        const currentGlobal = userSnap.data().balance || 0;
                        transaction.update(userRef, {
                            balance: currentGlobal + balanceDelta,
                            updatedAt: serverTimestamp()
                        });
                    }
                }

                // --- 4. CREATE i18n NOTIFICATION WITH FALLBACK ---
                const userData = userSnap?.exists() ? userSnap.data() : { language: 'en' };
                const userLanguage = userData.language || 'en';
                const strings = getLocalizedNotif(userLanguage);
                const txCurrency = txData.currency === '€' ? 'EUR' : (txData.currency || 'EUR');

                // Locale mapping for formatting
                const localeMap = {
                    'fr': 'fr-FR',
                    'en': 'en-US',
                    'es': 'es-ES',
                    'pt': 'pt-PT',
                    'it': 'it-IT',
                    'de': 'de-DE'
                };
                const formatLocale = localeMap[userLanguage] || 'fr-FR'; // Default to fr-FR if not found, as per app's primary target

                let notificationData = null;

                if (status === 'completed' && oldStatus !== 'completed') {
                    notificationData = {
                        userId: targetUserId,
                        title: strings.txValidatedTitle, // Fallback
                        message: strings.txValidatedMsg(amount, txCurrency), // Fallback
                        titleKey: 'notifications.transactionValidated.title',
                        messageKey: 'notifications.transactionValidated.message',
                        messageParams: {
                            amount: amount.toLocaleString(formatLocale),
                            currency: txCurrency
                        },
                        type: 'transaction_validated',
                        transactionId,
                        read: false,
                        createdAt: serverTimestamp()
                    };
                } else if (status === 'in_review' && oldStatus !== 'in_review') {
                    notificationData = {
                        userId: targetUserId,
                        title: strings.txInReviewTitle, // Fallback
                        message: strings.txInReviewMsg(amount, txCurrency), // Fallback
                        titleKey: 'notifications.transactionInReview.title',
                        messageKey: 'notifications.transactionInReview.message',
                        messageParams: {
                            amount: amount.toLocaleString(formatLocale),
                            currency: txCurrency
                        },
                        type: 'transaction_review',
                        transactionId,
                        read: false,
                        createdAt: serverTimestamp()
                    };
                } else if (status === 'rejected' && oldStatus !== 'rejected') {
                    notificationData = {
                        userId: targetUserId,
                        title: strings.txRejectedTitle,
                        message: strings.txRejectedMsg(amount, txCurrency),
                        titleKey: 'notifications.transactionRejected.title',
                        messageKey: 'notifications.transactionRejected.message',
                        messageParams: {
                            amount: amount.toLocaleString(formatLocale),
                            currency: txCurrency
                        },
                        type: 'transaction_rejected',
                        transactionId,
                        read: false,
                        createdAt: serverTimestamp()
                    };
                } else if (oldStatus !== status) {
                    notificationData = {
                        userId: targetUserId,
                        title: strings.txStatusUpdatedTitle,
                        message: strings.txStatusUpdatedMsg(amount, txCurrency, status),
                        titleKey: 'notifications.transactionStatusUpdated.title',
                        messageKey: 'notifications.transactionStatusUpdated.message',
                        messageParams: {
                            amount: amount.toLocaleString(formatLocale),
                            currency: txCurrency,
                            status: status
                        },
                        type: 'info',
                        transactionId,
                        read: false,
                        createdAt: serverTimestamp()
                    };
                }

                if (notificationData) {
                    const notifRef = doc(collection(db, 'notifications'));
                    transaction.set(notifRef, notificationData);
                }
            });

            // Trigger Email Notification after successful transaction
            try {
                const txSnap = await getDoc(doc(db, 'transactions', transactionId));
                if (txSnap.exists()) {
                    const txData = txSnap.data();
                    const userSnap = await getDoc(doc(db, 'users', txData.userId));
                    if (userSnap.exists()) {
                        const userData = userSnap.data();
                        const name = userData.firstName || 'Client';
                        const amount = txData.amount;
                        const currency = txData.currency === '€' ? 'EUR' : (txData.currency || 'EUR');
                        const desc = txData.description || 'Transaction';
                        const language = userData.language || 'en';

                        if (status === 'completed') {
                            await adminEmailService.sendTransactionValidatedEmail(userData.email, name, amount, currency, desc, language);
                        } else if (status === 'in_review') {
                            await adminEmailService.sendTransactionInReviewEmail(userData.email, name, amount, currency, desc, language);
                        } else if (status === 'rejected') {
                            await adminEmailService.sendTransactionRejectedEmail(userData.email, name, amount, currency, 'Alerte de sécurité.', language);
                        }
                    }
                }
            } catch (err) {
                console.warn("Failed to send transaction status email:", err);
            }

            return { success: true };
        } catch (error) {
            console.error('Error in updateTransactionStatus:', error);
            throw error;
        }
    },

    // Block/unblock user
    updateUserStatus: async (userId, accountStatus) => {
        await updateDoc(doc(db, 'users', userId), {
            accountStatus,
            updatedAt: new Date()
        });
    },

    // Delete user completely (Firestore + Auth)
    deleteUserFull: async (userId) => {
        try {
            // 1. Delete from Firestore first
            await deleteDoc(doc(db, 'users', userId));

            // 2. Propose deeper cleanup here if needed (wallets, cards...)
            // For now, we keep related data for audit trails or handle them via triggers

            // 3. Delete from Firebase Authentication via Serverless API
            // Note: This works only if the API is deployed and configured with Service Account
            try {
                const response = await fetch('/api/delete-user', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ uid: userId })
                });

                if (!response.ok) {
                    const error = await response.json();
                    console.warn('Auth deletion warning:', error);
                    // Throw special error but don't fail the whole operation since Firestore is done
                    throw new Error(error.details || 'Auth deletion failed');
                }
            } catch (apiError) {
                console.warn('Failed to call delete-user API:', apiError);
                return {
                    success: true,
                    warning: 'User data deleted, but Auth account might still exist. Please verify in Firebase Console.'
                };
            }

            return { success: true };
        } catch (error) {
            console.error('Error in deleteUserFull:', error);
            throw error;
        }
    },

    // --- Active Cards Manipulation ---
    updateActiveCardStatus: async (cardId, status) => {
        await updateDoc(doc(db, 'cards', cardId), {
            status,
            updatedAt: new Date()
        });
    },

    updateActiveCardDetails: async (cardId, data) => {
        await updateDoc(doc(db, 'cards', cardId), {
            ...data,
            updatedAt: new Date()
        });
    },

    deleteCardRequest: async (requestId) => {
        await deleteDoc(doc(db, 'card_requests', requestId));
    },

    deleteActiveCard: async (cardId) => {
        await deleteDoc(doc(db, 'cards', cardId));
    },

    createCard: async (cardData) => {
        const docRef = await addDoc(collection(db, 'cards'), {
            ...cardData,
            status: 'active',
            createdAt: new Date(),
            updatedAt: new Date()
        });
        return docRef.id;
    },

    // Update user details
    updateUser: async (userId, data) => {
        await updateDoc(doc(db, 'users', userId), {
            ...data,
            updatedAt: new Date()
        });
    },

    // Get user's wallets
    getUserWallets: async (userId) => {
        const snapshot = await getDocs(
            query(collection(db, 'wallets'), where('userId', '==', userId))
        );
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },

    // Get user's transactions
    getUserTransactions: async (userId) => {
        const snapshot = await getDocs(
            query(collection(db, 'transactions'), where('userId', '==', userId))
        );
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },

    // Get user's cards
    getUserCards: async (userId) => {
        const snapshot = await getDocs(
            query(collection(db, 'cards'), where('userId', '==', userId))
        );
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },

    // Get user's beneficiaries
    getUserBeneficiaries: async (userId) => {
        const snapshot = await getDocs(
            query(collection(db, "users", userId, "beneficiaries"), orderBy("createdAt", "desc"))
        );
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },

    // Get user's KYC data
    getUserKYC: async (userId) => {
        try {
            // First try to get by document ID (standard pattern)
            const docRef = doc(db, 'kyc', userId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                console.log('Found KYC by ID:', docSnap.data());
                return { id: docSnap.id, ...docSnap.data() };
            }

            // If not found, try querying by userId field (fallback)
            const q = query(collection(db, 'kyc'), where('userId', '==', userId));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                console.log('Found KYC by query:', querySnapshot.docs[0].data());
                return { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() };
            }

            console.log('No KYC data found for user:', userId);
            return null;
        } catch (error) {
            console.error('Error fetching KYC data:', error);
            return null;
        }
    },

    // Real-time listener for specific user transactions
    subscribeToUserTransactions: (userId, callback) => {
        const q = query(
            collection(db, 'transactions'),
            where('userId', '==', userId),
            orderBy('createdAt', 'desc')
        );
        return onSnapshot(q, (snapshot) => {
            const transactions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            callback(transactions);
        });
    },

    // Real-time listener for specific user notifications
    subscribeToUserNotifications: (userId, callback) => {
        const q = query(
            collection(db, 'notifications'),
            where('userId', '==', userId),
            orderBy('createdAt', 'desc')
        );
        return onSnapshot(q, (snapshot) => {
            const notifications = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            callback(notifications);
        });
    },

    // Get user notifications
    getUserNotifications: async (userId) => {
        const q = query(
            collection(db, 'notifications'),
            where('userId', '==', userId),
            orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },

    // Delete a single notification
    deleteNotification: async (notifId) => {
        await deleteDoc(doc(db, 'notifications', notifId));
    },

    // Reset all notifications for a user (batch delete)
    resetUserNotifications: async (userId) => {
        const q = query(collection(db, 'notifications'), where('userId', '==', userId));
        const snapshot = await getDocs(q);

        const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
        await Promise.all(deletePromises);
    },

    // Real-time listeners
    subscribeToUsers: (callback) => {
        return onSnapshot(collection(db, 'users'), (snapshot) => {
            const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            callback(users);
        });
    },

    subscribeToTransactions: (callback) => {
        return onSnapshot(
            query(collection(db, 'transactions'), orderBy('createdAt', 'desc')),
            (snapshot) => {
                const transactions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                callback(transactions);
            }
        );
    },

    subscribeToKYC: (callback) => {
        return onSnapshot(
            query(collection(db, 'kyc'), orderBy('submittedAt', 'desc')),
            (snapshot) => {
                const kycs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                callback(kycs);
            }
        );
    },

    subscribeToCardRequests: (callback) => {
        return onSnapshot(
            collection(db, 'card_requests'),
            (snapshot) => {
                const requests = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                callback(requests);
            }
        );
    },

    subscribeToCards: (callback) => {
        return onSnapshot(
            collection(db, 'cards'),
            (snapshot) => {
                const cards = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                callback(cards);
            }
        );
    },

    // --- Wallet Management ---
    updateWalletBalance: async (walletId, newBalance) => {
        await updateDoc(doc(db, 'wallets', walletId), {
            balance: Number(newBalance),
            updatedAt: new Date()
        });
    },

    // Create a deposit with transaction logging and client notification
    createAdminDeposit: async (userId, walletId, amount, newBalance) => {
        try {
            await runTransaction(db, async (transaction) => {
                const walletRef = doc(db, 'wallets', walletId);
                const userRef = doc(db, 'users', userId);

                // --- ALL READS FIRST ---
                const walletDoc = await transaction.get(walletRef);
                const userDoc = await transaction.get(userRef);

                if (!walletDoc.exists()) throw new Error("Wallet non trouvé");
                if (!userDoc.exists()) throw new Error("Utilisateur non trouvé");

                const walletData = walletDoc.data();
                const userData = userDoc.data();

                // --- ALL WRITES AFTER ---
                // 1. Update Wallet Balance
                transaction.update(walletRef, {
                    balance: Number(newBalance),
                    updatedAt: serverTimestamp()
                });

                // 2. Update User Global Balance
                transaction.update(userRef, {
                    balance: Number(newBalance),
                    updatedAt: serverTimestamp()
                });

                // 3. Create Transaction Record
                const txRef = doc(collection(db, 'transactions'));
                transaction.set(txRef, {
                    userId,
                    walletId,
                    type: amount >= 0 ? 'credit' : 'debit',
                    amount: Math.abs(amount),
                    status: 'completed',
                    description: amount >= 0 ? 'Dépôt INVIK BANK' : 'Ajustement de solde Admin',
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp()
                });

                // 4. Create Notification for the client
                if (amount > 0) {
                    const txCurrency = walletData.currency === '€' ? 'EUR' : (walletData.currency || 'EUR');

                    // Localized Notification Logic
                    const userLanguage = userData.language || 'en';
                    const strings = getLocalizedNotif(userLanguage);

                    const notifRef = doc(collection(db, 'notifications'));
                    transaction.set(notifRef, {
                        userId,
                        title: strings.depositTitle,
                        message: strings.depositMsg(amount, txCurrency, newBalance),
                        titleKey: 'notifications.deposit.title',
                        messageKey: 'notifications.deposit.message',
                        messageParams: {
                            amount: amount.toLocaleString('fr-FR'),
                            currency: txCurrency,
                            newBalance: newBalance.toLocaleString('fr-FR')
                        },
                        type: 'deposit',
                        read: false,
                        createdAt: serverTimestamp()
                    });
                }
            });

            // Post-transaction Email Notification for Admin Deposit
            if (amount > 0) {
                try {
                    const userSnap = await getDoc(doc(db, 'users', userId));
                    const walletSnap = await getDoc(doc(db, 'wallets', walletId));
                    if (userSnap.exists() && walletSnap.exists()) {
                        const userData = userSnap.data();
                        const walletData = walletSnap.data();
                        const txCurrency = walletData.currency === '€' ? 'EUR' : (walletData.currency || 'EUR');

                        await adminEmailService.sendDepositEmail(
                            userData.email,
                            userData.firstName || 'Client',
                            amount,
                            txCurrency,
                            newBalance,
                            userData.language || 'en'
                        );
                    }
                } catch (emailErr) {
                    console.warn("Failed to send admin deposit email:", emailErr);
                }
            }

            return { success: true };
        } catch (error) {
            console.error('Error in createAdminDeposit:', error);
            throw error;
        }
    },

    updateWalletDetails: async (walletId, data) => {
        try {
            console.log(`[RIB-SYNC] Tentative de mise à jour pour le portefeuille: ${walletId}`);

            // 1. Update the Main Wallet document
            await updateDoc(doc(db, 'wallets', walletId), {
                ...data,
                updatedAt: new Date()
            });

            // 2. Synchronize RIB collection if relevant data changed
            if (data.iban || data.bic || data.holderName) {
                const ribsQuery = query(collection(db, 'ribs'), where('walletId', '==', walletId));
                const ribSnapshot = await getDocs(ribsQuery);

                if (ribSnapshot.empty) {
                    console.warn(`[RIB-SYNC] Aucun document RIB trouvé pour le portefeuille ${walletId}.`);
                } else {
                    console.log(`[RIB-SYNC] ${ribSnapshot.size} document(s) RIB trouvé(s) à synchroniser.`);
                }

                const ribPromises = ribSnapshot.docs.map(ribDoc => {
                    const updateData = { ...data };

                    // Decompose IBAN if present
                    if (data.iban) {
                        const ibanClean = data.iban.replace(/\s+/g, '');
                        updateData.bankCode = ibanClean.substring(4, 9) || '12345';
                        updateData.branchCode = ibanClean.substring(9, 14) || '67890';
                        updateData.accountNumber = ibanClean.substring(14, ibanClean.length - 2) || '00000000';
                        updateData.ribKey = ibanClean.substring(ibanClean.length - 2) || '00';
                    }

                    updateData.updatedAt = serverTimestamp();

                    console.log(`[RIB-SYNC] Mise à jour du RIB ${ribDoc.id} avec succès.`);
                    return updateDoc(doc(db, 'ribs', ribDoc.id), updateData);
                });

                await Promise.all(ribPromises);
            }
        } catch (error) {
            console.error("[RIB-SYNC] Erreur critique lors de la mise à jour:", error);
            throw error;
        }
    },

    subscribeToAllWallets: (callback) => {
        return onSnapshot(collection(db, 'wallets'), (snapshot) => {
            const wallets = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            callback(wallets);
        });
    },

    // --- Delete Functions ---
    deleteKYC: async (kycId) => {
        await deleteDoc(doc(db, 'kyc', kycId));
    },

    deleteWallet: async (walletId) => {
        await deleteDoc(doc(db, 'wallets', walletId));
        // Note: Ideally we should also delete or archive related transactions/ribs
    },

    deleteSupportTicket: async (ticketId) => {
        await deleteDoc(doc(db, 'support_tickets', ticketId));
        // Note: Sub-collection 'messages' should be handled if not using automatic scaling cleanup, 
        // but for standard Firestore deleteDoc, subcollections are NOT automatically deleted.
        // However, given the scope, we often leave them or rely on a cloud function. 
        // For this UI action, we just hide the ticket by deleting the parent doc.
    },

    // --- Loan Management ---
    subscribeToLoans: (callback) => {
        return onSnapshot(
            query(collection(db, 'loans'), orderBy('createdAt', 'desc')),
            (snapshot) => {
                const loans = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                callback(loans);
            }
        );
    },

    subscribeToLeads: (callback) => {
        return onSnapshot(
            query(collection(db, 'loan_leads'), orderBy('createdAt', 'desc')),
            (snapshot) => {
                const leads = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                callback(leads);
            }
        );
    },

    subscribeToContactMessages: (callback) => {
        return onSnapshot(
            query(collection(db, 'contact_messages'), orderBy('createdAt', 'desc')),
            (snapshot) => {
                const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                callback(messages);
            }
        );
    },

    subscribeToSupportTickets: (callback) => {
        return onSnapshot(
            query(collection(db, 'support_tickets'), orderBy('createdAt', 'desc')),
            (snapshot) => {
                const tickets = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                callback(tickets);
            }
        );
    },

    updateLoanStatus: async (loanId, status, reviewNotes = '') => {
        try {
            // 1. Get initial data and perform queries outside the transaction
            const loanRef = doc(db, 'loans', loanId);
            const loanSnapInitial = await getDoc(loanRef);
            if (!loanSnapInitial.exists()) throw new Error("Prêt non trouvé");

            const loanData = loanSnapInitial.data();
            const userId = loanData.userId;

            // Resolve Credit Wallet ID if it exists (getDocs is not allowed inside transactions)
            const walletsQuery = query(collection(db, 'wallets'), where('userId', '==', userId), where('type', '==', 'credit'));
            const walletsSnap = await getDocs(walletsQuery);
            const existingWalletId = !walletsSnap.empty ? walletsSnap.docs[0].id : null;

            await runTransaction(db, async (transaction) => {
                // --- ALL READS FIRST ---
                const currentLoanSnap = await transaction.get(loanRef);
                const userRef = doc(db, 'users', userId);
                const userSnap = await transaction.get(userRef);

                let walletRef = null;
                let walletSnap = null;
                if (existingWalletId) {
                    walletRef = doc(db, 'wallets', existingWalletId);
                    walletSnap = await transaction.get(walletRef);
                }

                const oldStatus = currentLoanSnap.data().status;
                const isBeingApproved = (status === 'approved' && oldStatus !== 'approved');

                // --- ALL WRITES AFTER ---

                // Update Loan Status
                transaction.update(loanRef, {
                    status,
                    reviewNotes,
                    reviewedAt: serverTimestamp(),
                    updatedAt: serverTimestamp()
                });

                if (isBeingApproved) {
                    const amount = parseFloat(loanData.amount || loanData.montant || 0);
                    const currency = loanData.currency === '€' ? 'EUR' : (loanData.currency || 'EUR');

                    // Update or Create Wallet
                    if (walletSnap && walletSnap.exists()) {
                        const currentWalletBalance = walletSnap.data().balance || 0;
                        transaction.update(walletRef, {
                            balance: currentWalletBalance + amount,
                            updatedAt: serverTimestamp()
                        });
                    } else {
                        // Create new credit wallet if it doesn't exist
                        const newWalletRef = doc(collection(db, 'wallets'));
                        walletRef = newWalletRef; // Use this for audit record below
                        transaction.set(newWalletRef, {
                            userId,
                            type: 'credit',
                            currency,
                            balance: amount,
                            iban: generateAdminIBAN('credit', userId),
                            bic: 'INVKFR2P',
                            status: 'active',
                            createdAt: serverTimestamp(),
                            updatedAt: serverTimestamp()
                        });
                    }

                    // Update User Global Balance
                    if (userSnap.exists()) {
                        const currentGlobal = userSnap.data().balance || 0;
                        transaction.update(userRef, {
                            balance: currentGlobal + amount,
                            updatedAt: serverTimestamp()
                        });
                    }

                    // Create Transaction Record (Audit Trail)
                    const txRef = doc(collection(db, 'transactions'));
                    transaction.set(txRef, {
                        userId,
                        walletId: walletRef.id,
                        type: 'credit',
                        amount: amount,
                        currency,
                        status: 'completed',
                        description: `Déblocage de prêt: ${loanData.type || 'Standard'}`,
                        createdAt: serverTimestamp(),
                        updatedAt: serverTimestamp()
                    });

                    // Localized Notification Logic
                    const language = userSnap.exists() ? (userSnap.data().language || 'en') : 'en';
                    const strings = getLocalizedNotif(language);

                    if (status === 'approved') {
                        const notifRef = doc(collection(db, 'notifications'));
                        transaction.set(notifRef, {
                            userId,
                            title: strings.loanApprovedTitle,
                            message: strings.loanApprovedMsg(amount, currency),
                            titleKey: 'notifications.loanApproved.title',
                            messageKey: 'notifications.loanApproved.message',
                            messageParams: {
                                amount: amount.toLocaleString('fr-FR'),
                                currency: currency
                            },
                            type: 'loan_approval',
                            loanId: loanId,
                            read: false,
                            createdAt: serverTimestamp()
                        });
                    }
                } else if (status === 'rejected' && oldStatus !== 'rejected') {
                    const notifRef = doc(collection(db, 'notifications'));
                    transaction.set(notifRef, {
                        userId,
                        title: strings.loanRejectedTitle,
                        message: strings.loanRejectedMsg,
                        titleKey: 'notifications.loanRejected.title',
                        messageKey: 'notifications.loanRejected.message',
                        messageParams: {},
                        type: 'loan_rejection',
                        loanId: loanId,
                        read: false,
                        createdAt: serverTimestamp()
                    });
                }
            });

            // Trigger Email Notification (outside transaction but after success)
            if (status === 'approved' || status === 'rejected') {
                const loanSnap = await getDoc(doc(db, 'loans', loanId));
                if (loanSnap.exists()) {
                    const loanData = loanSnap.data();
                    const userSnap = await getDoc(doc(db, 'users', loanData.userId));
                    if (userSnap.exists()) {
                        const userData = userSnap.data();
                        const name = userData.firstName || 'Client';
                        const amount = parseFloat(loanData.amount || loanData.montant || 0);
                        const currency = loanData.currency === '€' ? 'EUR' : (loanData.currency || 'EUR');
                        const language = userData.language || 'en';

                        if (status === 'approved') {
                            await adminEmailService.sendLoanApprovedEmail(userData.email, name, amount, currency, language);
                        } else {
                            await adminEmailService.sendLoanRejectedEmail(userData.email, name, reviewNotes, language);
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Error in updateLoanStatus:', error);
            throw error;
        }
    },

    deleteLoan: async (loanId) => {
        await deleteDoc(doc(db, 'loans', loanId));
    },

    // --- Account Requests ---
    getAllAccountRequests: async () => {
        const snapshot = await getDocs(collection(db, 'account_requests'));
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },

    subscribeToAccountRequests: (callback) => {
        const q = query(collection(db, 'account_requests'), orderBy('createdAt', 'desc'));
        return onSnapshot(q, (snapshot) => {
            const requests = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            callback(requests);
        });
    },

    // --- System Settings ---
    async getSystemSettings() {
        const docRef = doc(db, 'settings', 'global');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return docSnap.data();
        } else {
            // Default settings if none exist
            return {
                hideLanguageSelector: false,
                updatedAt: serverTimestamp()
            };
        }
    },

    async updateSystemSettings(data) {
        const docRef = doc(db, 'settings', 'global');
        await setDoc(docRef, {
            ...data,
            updatedAt: serverTimestamp()
        }, { merge: true });
    },

    approveAccountRequest: async (requestId, userId, type, currency = 'EUR') => {
        try {
            await runTransaction(db, async (transaction) => {
                const requestRef = doc(db, 'account_requests', requestId);
                const requestSnap = await transaction.get(requestRef);
                if (!requestSnap.exists()) throw new Error("Demande introuvable");

                const newWalletRef = doc(collection(db, 'wallets'));
                const walletData = {
                    userId,
                    type,
                    currency,
                    balance: 0,
                    iban: generateAdminIBAN(type, userId),
                    bic: 'INVKFR2P',
                    createdAt: serverTimestamp(),
                    status: 'active'
                };
                transaction.set(newWalletRef, walletData);

                transaction.update(requestRef, {
                    status: 'approved',
                    approvedAt: serverTimestamp(),
                    createdWalletId: newWalletRef.id
                });
            });
        } catch (error) {
            console.error("Error approving account request:", error);
            throw error;
        }
    },

    rejectAccountRequest: async (requestId, reviewNotes = '') => {
        await updateDoc(doc(db, 'account_requests', requestId), {
            status: 'rejected',
            reviewNotes,
            rejectedAt: serverTimestamp()
        });
    },

    deleteAccountRequest: async (requestId) => {
        await deleteDoc(doc(db, 'account_requests', requestId));
    },

    // --- Lead Management ---
    updateLeadStatus: async (leadId, status) => {
        await updateDoc(doc(db, 'loan_leads', leadId), {
            status,
            updatedAt: serverTimestamp()
        });
    },

    // --- Contact Message Management ---
    updateContactMessageStatus: async (messageId, status) => {
        await updateDoc(doc(db, 'contact_messages', messageId), {
            status,
            updatedAt: serverTimestamp()
        });
    },

    // --- Support Ticket Management ---
    updateSupportTicketStatus: async (ticketId, status) => {
        await updateDoc(doc(db, 'support_tickets', ticketId), {
            status,
            updatedAt: serverTimestamp()
        });
    },

    addSupportMessage: async (ticketId, messageData) => {
        const ticketRef = doc(db, 'support_tickets', ticketId);
        const messagesRef = collection(ticketRef, 'messages');
        await addDoc(messagesRef, {
            ...messageData,
            createdAt: serverTimestamp()
        });

        // Update ticket's updatedAt and flag for client
        await updateDoc(ticketRef, {
            updatedAt: serverTimestamp(),
            lastMessageAt: serverTimestamp(),
            clientHasUnread: true,
            adminHasUnread: false // Admin just sent a message, they've seen current context
        });

        // Trigger Email Notification if message is from admin
        if (messageData.sender === 'admin') {
            try {
                const ticketSnap = await getDoc(ticketRef);
                if (ticketSnap.exists()) {
                    const ticketData = ticketSnap.data();
                    const userSnap = await getDoc(doc(db, 'users', ticketData.userId));
                    if (userSnap.exists()) {
                        const userData = userSnap.data();
                        await adminEmailService.sendSupportResponseEmail(
                            userData.email,
                            userData.firstName || 'Client',
                            ticketData.subject || 'Support',
                            userData.language || 'en'
                        );
                    }
                }
            } catch (err) {
                console.warn("Failed to send support response email:", err);
            }
        }
    },

    subscribeToTicketMessages: (ticketId, callback) => {
        const q = query(
            collection(db, 'support_tickets', ticketId, 'messages'),
            orderBy('createdAt', 'asc')
        );
        return onSnapshot(q, (snapshot) => {
            const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            callback(messages);
        });
    },

    // --- Admin Management Features (Super Admin only) ---
    getAllAdmins: async () => {
        const q = query(collection(db, 'users'), where('role', '==', 'admin'));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },

    createAdminAccount: async (email, password, adminData) => {
        // Initialize or get the secondary app to prevent current user logout
        let secondaryApp;
        const appName = "AdminCreator";

        if (getApps().find(app => app.name === appName)) {
            secondaryApp = getApp(appName);
        } else {
            // Re-use config from window or import.meta.env
            const secondaryConfig = {
                apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
                authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
                projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
                storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
                messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
                appId: import.meta.env.VITE_FIREBASE_APP_ID
            };
            secondaryApp = initializeApp(secondaryConfig, appName);
        }

        const secondaryAuth = getAuth(secondaryApp);

        try {
            // 1. Create the Auth account
            const userCredential = await createUserWithEmailAndPassword(secondaryAuth, email, password);
            const user = userCredential.user;

            // 2. Create the Firestore record
            await runTransaction(db, async (transaction) => {
                const userRef = doc(db, 'users', user.uid);
                transaction.set(userRef, {
                    email,
                    firstName: adminData.firstName || 'Admin',
                    lastName: adminData.lastName || '',
                    role: 'admin',
                    isSuperAdmin: adminData.isSuperAdmin || false,
                    accountStatus: 'active',
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp()
                });
            });

            // 3. Immediately sign out the secondary instance to be clean
            await firebaseSignOut(secondaryAuth);

            return { success: true, uid: user.uid };
        } catch (error) {
            console.error("Error creating secondary admin account:", error);
            throw error;
        }
    },

    toggleSuperAdminStatus: async (adminId, isSuper) => {
        await updateDoc(doc(db, 'users', adminId), {
            isSuperAdmin: isSuper,
            updatedAt: serverTimestamp()
        });
    },

    deleteAdminAccount: async (adminId) => {
        await deleteDoc(doc(db, 'users', adminId));
    },

    // Change admin password (requires current password for security)
    changeAdminPassword: async (currentPassword, newPassword) => {
        try {
            const auth = getAuth();
            const user = auth.currentUser;

            if (!user || !user.email) {
                throw new Error('Aucun utilisateur connecté');
            }

            // Reauthenticate user with current password
            const credential = EmailAuthProvider.credential(user.email, currentPassword);
            await reauthenticateWithCredential(user, credential);

            // Update password
            await updatePassword(user, newPassword);

            return { success: true, message: 'Mot de passe modifié avec succès' };
        } catch (error) {
            console.error('Error changing password:', error);

            // Provide user-friendly error messages
            if (error.code === 'auth/wrong-password') {
                throw new Error('Mot de passe actuel incorrect');
            } else if (error.code === 'auth/weak-password') {
                throw new Error('Le nouveau mot de passe est trop faible (minimum 6 caractères)');
            } else if (error.code === 'auth/requires-recent-login') {
                throw new Error('Veuillez vous reconnecter avant de changer votre mot de passe');
            } else {
                throw new Error('Erreur lors du changement de mot de passe: ' + error.message);
            }
        }
    },

    // --- Invoicing ---
    getUserInvoices: async (userId) => {
        const snapshot = await getDocs(
            query(collection(db, 'invoices'), where('userId', '==', userId), orderBy('createdAt', 'desc'))
        );
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },

    createInvoice: async (invoiceData) => {
        const docRef = await addDoc(collection(db, 'invoices'), {
            ...invoiceData,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });

        // Trigger Email Notification
        try {
            const userSnap = await getDoc(doc(db, 'users', invoiceData.userId));
            if (userSnap.exists()) {
                const userData = userSnap.data();
                await adminEmailService.sendInvoiceCreatedEmail(
                    userData.email,
                    userData.displayName || `${userData.firstName} ${userData.lastName}`,
                    invoiceData.reference,
                    invoiceData.amount,
                    invoiceData.currency,
                    invoiceData.description,
                    userData.language || 'en'
                );
            }
        } catch (emailError) {
            console.error('Failed to send invoice creation email:', emailError);
        }

        // Optional: Notify client (UI Notifications)
        const notifRef = doc(collection(db, 'notifications'));
        await setDoc(notifRef, {
            userId: invoiceData.userId,
            title: '📄 Nouvelle facture disponible',
            message: `Une nouvelle facture de ${invoiceData.amount.toLocaleString('fr-FR')} ${invoiceData.currency} a été émise pour votre compte.`,
            titleKey: 'notifications.new_invoice.title',
            messageKey: 'notifications.new_invoice.message',
            messageParams: {
                amount: invoiceData.amount.toLocaleString('fr-FR'),
                currency: invoiceData.currency
            },
            type: 'invoice',
            read: false,
            createdAt: serverTimestamp()
        });

        return docRef.id;
    },

    updateInvoiceStatus: async (invoiceId, status) => {
        await updateDoc(doc(db, 'invoices', invoiceId), {
            status,
            updatedAt: serverTimestamp()
        });

        // Trigger Confirmation Email and Notification if paid
        if (status === 'paid') {
            try {
                const invoiceSnap = await getDoc(doc(db, 'invoices', invoiceId));
                if (invoiceSnap.exists()) {
                    const invData = invoiceSnap.data();

                    // 1. Email
                    const userSnap = await getDoc(doc(db, 'users', invData.userId));
                    if (userSnap.exists()) {
                        const userData = userSnap.data();
                        await adminEmailService.sendInvoicePaidEmail(
                            userData.email,
                            userData.displayName || `${userData.firstName} ${userData.lastName}`,
                            invData.reference,
                            invData.amount,
                            invData.currency,
                            userData.language || 'en'
                        );
                    }

                    // 2. In-App Notification
                    const notifRef = doc(collection(db, 'notifications'));
                    await setDoc(notifRef, {
                        userId: invData.userId,
                        title: '✅ Paiement reçu',
                        message: `Le paiement de votre facture ${invData.reference} a été confirmé. Merci !`,
                        titleKey: 'notifications.invoice_paid.title',
                        messageKey: 'notifications.invoice_paid.message',
                        messageParams: {
                            reference: invData.reference
                        },
                        type: 'invoice',
                        read: false,
                        createdAt: serverTimestamp()
                    });
                }
            } catch (error) {
                console.error('Failed to trigger payment success response:', error);
            }
        }
    },

    deleteInvoice: async (invoiceId) => {
        await deleteDoc(doc(db, 'invoices', invoiceId));
    },
};

// Helper to generate IBAN (Duplicated from client for independence)
const generateAdminIBAN = (type, userId) => {
    const country = 'FR76';
    const bankCode = '12345';
    const branchCode = '67890';
    const suffix = type === 'main' ? '01' : (type === 'savings' ? '02' : (type === 'credit' ? '03' : '99'));
    const userPart = userId ? userId.substring(0, 8).toUpperCase().replace(/[^A-Z0-9]/g, 'X') : '00000000';
    return `${country} ${bankCode} ${branchCode} ${userPart} ${suffix}`;
};
