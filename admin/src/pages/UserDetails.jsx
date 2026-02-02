import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminService } from '../services/adminService';

// Helper to format date
const formatDate = (date) => {
    if (!date) return 'Non renseigné';
    if (date?.toDate) return date.toDate().toLocaleDateString('fr-FR');
    const d = new Date(date);
    return isNaN(d.getTime()) ? 'Invalid Date' : d.toLocaleDateString('fr-FR');
};

// Helper for date input
const getInputValue = (dateVal) => {
    if (!dateVal) return '';
    if (dateVal.toDate) {
        return dateVal.toDate().toISOString().split('T')[0];
    }
    const d = new Date(dateVal);
    return !isNaN(d.getTime()) ? d.toISOString().split('T')[0] : '';
};

// Modern Toggle Switch Component
const ToggleSwitch = ({ checked, onChange, disabled }) => (
    <label style={{ position: 'relative', display: 'inline-block', width: '42px', height: '22px', cursor: disabled ? 'not-allowed' : 'pointer' }}>
        <input
            type="checkbox"
            checked={!!checked}
            onChange={onChange}
            disabled={disabled}
            style={{ opacity: 0, width: 0, height: 0 }}
        />
        <span style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: checked ? '#ef4444' : '#E2E8F0',
            transition: '0.3s',
            borderRadius: '22px'
        }} />
        <span style={{
            position: 'absolute',
            height: '16px',
            width: '16px',
            left: checked ? '22px' : '4px',
            bottom: '3px',
            backgroundColor: 'white',
            transition: '0.3s',
            borderRadius: '50%',
            boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
        }} />
    </label>
);

// RenderField component moved outside to avoid re-creation and potential hook issues
const RenderField = ({ label, name, type = 'text', options = null, isEditing, data, onChange, editData, onToggle }) => {
    if (!isEditing) {
        if (type === 'toggle') {
            return (
                <div style={styles.infoRow}>
                    <span style={styles.label}>{label}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <ToggleSwitch checked={!!data[name]} onChange={(e) => onToggle && onToggle(name, e.target.checked)} />
                        <span style={{ fontSize: '0.8rem', color: data[name] ? '#ef4444' : '#64748b', fontWeight: 'bold' }}>
                            {data[name] ? 'BLOQUÉ' : 'ACCÈS LIBRE'}
                        </span>
                    </div>
                </div>
            );
        }

        let displayValue = data[name];
        if (type === 'date') displayValue = formatDate(data[name]);
        if (name === 'gender') displayValue = data.gender === 'M' ? 'Masculin' : data.gender === 'F' ? 'Féminin' : data.gender;
        if (name === 'accountType') displayValue = data.accountType === 'savings' ? 'Standard + Épargne' : 'Standard';
        if (type === 'toggle') displayValue = data[name] ? '🔴 BLOQUÉ' : '🟢 ACCÈS LIBRE';

        return (
            <div style={styles.infoRow}>
                <span style={styles.label}>{label}</span>
                <span style={styles.value}>{displayValue || 'Non renseigné'}</span>
            </div>
        );
    }

    return (
        <div style={styles.infoRow}>
            <label style={styles.label}>{label}</label>
            {type === 'toggle' ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <ToggleSwitch
                        checked={!!editData[name]}
                        onChange={(e) => onChange({ target: { name, value: e.target.checked, type: 'checkbox', checked: e.target.checked } })}
                    />
                    <span style={{ fontSize: '0.8rem', color: editData[name] ? '#ef4444' : '#64748b', fontWeight: 'bold' }}>
                        {editData[name] ? 'BLOQUÉ' : 'ACCÈS LIBRE'}
                    </span>
                </div>
            ) : type === 'select' ? (
                <select
                    name={name}
                    value={editData[name] || ''}
                    onChange={onChange}
                    style={styles.input}
                >
                    {options.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
            ) : (
                <input
                    type={type}
                    name={name}
                    value={type === 'date' ? getInputValue(editData[name]) : (editData[name] || '')}
                    onChange={onChange}
                    style={styles.input}
                />
            )}
        </div>
    );
};

const UserDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // --- ALL INITIAL HOOKS AT TOP ---
    const [user, setUser] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [cards, setCards] = useState([]);
    const [beneficiaries, setBeneficiaries] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [wallets, setWallets] = useState([]);
    const [invoices, setInvoices] = useState([]);
    const [kycData, setKycData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [isEditing, setIsEditing] = useState(false);
    const [editFormData, setEditFormData] = useState({});
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 1024);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const loadUserData = async () => {
            if (!id) return;
            try {
                setLoading(true);
                const [userData, userTransactions, userKYC, userCards, userBeneficiaries, userWallets, userInvoices] = await Promise.all([
                    adminService.getUser(id),
                    adminService.getUserTransactions(id),
                    adminService.getUserKYC(id),
                    adminService.getUserCards(id),
                    adminService.getUserBeneficiaries(id),
                    adminService.getUserWallets(id),
                    adminService.getUserInvoices(id)
                ]);
                setUser(userData);
                setTransactions(userTransactions);
                setKycData(userKYC);
                setCards(userCards);
                setBeneficiaries(userBeneficiaries);
                setWallets(userWallets);
                setInvoices(userInvoices);
            } catch (error) {
                console.error('Error loading user details:', error);
            } finally {
                setLoading(false);
            }
        };

        loadUserData();

        // Subscribe to real-time notification updates
        const unsubscribeNotifs = adminService.subscribeToUserNotifications(id, (notifs) => {
            setNotifications(notifs);
        });

        return () => unsubscribeNotifs();
    }, [id]);

    useEffect(() => {
        if (user) {
            setEditFormData({ ...user });
        }
    }, [user]);

    // --- HANDLERS ---
    const handleStandaloneToggle = async (name, value) => {
        try {
            await adminService.updateUser(id, { [name]: value, updatedAt: new Date() });
            setUser(prev => ({ ...prev, [name]: value }));
        } catch (error) {
            console.error('Error in standalone toggle:', error);
            alert('Erreur lors de la mise à jour instantanée');
        }
    };

    const handleAction = async (action) => {
        if (action === 'toggleStatus' && user) {
            try {
                const newStatus = user.accountStatus === 'active' ? 'blocked' : 'active';
                if (window.confirm(`Êtes-vous sûr de vouloir ${newStatus === 'active' ? 'débloquer' : 'bloquer'} cet utilisateur ?`)) {
                    await adminService.updateUserStatus(user.id, newStatus);
                    setUser(prev => ({ ...prev, accountStatus: newStatus }));
                }
            } catch (error) {
                console.error('Error updating user status:', error);
                alert('Erreur lors de la mise à jour du statut');
            }
        }
    };

    const handleEdit = () => {
        setEditFormData({ ...user });
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditFormData({ ...user });
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const val = type === 'checkbox' ? checked : value;
        setEditFormData(prev => ({ ...prev, [name]: val }));
    };

    const handleSave = async () => {
        try {
            setLoading(true);
            await adminService.updateUser(user.id, editFormData);
            setUser(prev => ({ ...prev, ...editFormData }));
            setIsEditing(false);
            alert('Modifications enregistrées avec succès');
        } catch (error) {
            console.error('Error updating user:', error);
            alert("Erreur lors de l'enregistrement");
        } finally {
            setLoading(false);
        }
    };

    const handleEditCard = async (card) => {
        const newNumber = window.prompt("Numéro de carte (16 chiffres) :", card.cardNumber);
        if (newNumber === null) return;
        const newExpiry = window.prompt("Date d'expiration (MM/AA) :", card.expiryDate);
        if (newExpiry === null) return;
        const newCvv = window.prompt("CVV :", card.cvv);
        if (newCvv === null) return;
        const newLimit = window.prompt("Limite de paiement :", card.limit);
        if (newLimit === null) return;

        try {
            setLoading(true);
            await adminService.updateActiveCardDetails(card.id, {
                cardNumber: newNumber,
                expiryDate: newExpiry,
                cvv: newCvv,
                limit: Number(newLimit)
            });
            // Update local state
            setCards(prev => prev.map(c => c.id === card.id ? {
                ...c,
                cardNumber: newNumber,
                expiryDate: newExpiry,
                cvv: newCvv,
                limit: Number(newLimit)
            } : c));
            alert('Carte mise à jour avec succès');
        } catch (error) {
            console.error('Error updating card:', error);
            alert('Erreur lors de la mise à jour de la carte');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteNotification = async (notifId) => {
        if (!window.confirm('Supprimer cette notification ?')) return;
        try {
            await adminService.deleteNotification(notifId);
        } catch (error) {
            console.error('Error deleting notification:', error);
            alert('Erreur lors de la suppression');
        }
    };

    const handleResetNotifications = async () => {
        if (!window.confirm('Voulez-vous supprimer TOUTES les notifications de cet utilisateur ?')) return;
        try {
            setLoading(true);
            await adminService.resetUserNotifications(user.id);
            alert('Notifications réinitialisées');
        } catch (error) {
            console.error('Error resetting notifications:', error);
            alert('Erreur lors de la réinitialisation');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async () => {
        if (!window.confirm('ATTENTION: Cette action est IRREVERSIBLE. Voulez-vous vraiment supprimer définitivement cet utilisateur et TOUTES ses données ?')) return;

        const confirmEmail = window.prompt(`Pour confirmer, veuillez saisir l'adresse email de l'utilisateur (${user.email}) :`);
        if (confirmEmail !== user.email) {
            alert('Email incorrect. Suppression annulée.');
            return;
        }

        try {
            setLoading(true);
            const result = await adminService.deleteUserFull(user.id);
            if (result.warning) {
                alert(result.warning);
            } else {
                alert('Utilisateur supprimé avec succès');
            }
            navigate('/users');
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('Erreur lors de la suppression : ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateBalance = async (wallet) => {
        const amountStr = window.prompt(`Saisissez le montant du dépôt pour ce portefeuille (${wallet.currency}) :`, "100");
        if (!amountStr) return;
        const amount = parseFloat(amountStr);
        if (isNaN(amount) || amount === 0) {
            alert("Montant invalide");
            return;
        }

        try {
            setLoading(true);
            const newBalance = (wallet.balance || 0) + amount;
            await adminService.createAdminDeposit(user.id, wallet.id, amount, newBalance);

            // Refresh wallets and user balance locally
            setWallets(prev => prev.map(w => w.id === wallet.id ? { ...w, balance: newBalance } : w));
            setUser(prev => ({ ...prev, balance: (prev.balance || 0) + amount }));

            alert(`Succès! Nouveau solde: ${newBalance.toFixed(2)} ${wallet.currency}`);
        } catch (error) {
            console.error("Error updating balance:", error);
            alert("Erreur lors de la mise à jour du solde");
        } finally {
            setLoading(false);
        }
    };

    const handleEditWalletRIB = async (wallet) => {
        const newIban = window.prompt("Nouvel IBAN :", wallet.iban || "");
        if (newIban === null) return;
        const newBic = window.prompt("Nouveau BIC :", wallet.bic || "");
        if (newBic === null) return;
        const newHolder = window.prompt("Titulaire du compte :", wallet.holderName || `${user.firstName} ${user.lastName}`);
        if (newHolder === null) return;

        try {
            setLoading(true);
            await adminService.updateWalletDetails(wallet.id, {
                iban: newIban,
                bic: newBic,
                holderName: newHolder
            });

            setWallets(prev => prev.map(w => w.id === wallet.id ? {
                ...w,
                iban: newIban,
                bic: newBic,
                holderName: newHolder
            } : w));

            alert("Informations RIB mises à jour avec synchronisation réussie.");
        } catch (error) {
            console.error("Error updating RIB:", error);
            alert("Erreur lors de la mise à jour du RIB");
        } finally {
            setLoading(false);
        }
    };

    const handleCreateInvoice = async () => {
        const amountStr = window.prompt("Montant de la facture (EUR) :");
        if (!amountStr) return;
        const amount = parseFloat(amountStr);
        if (isNaN(amount) || amount <= 0) {
            alert("Montant invalide");
            return;
        }

        const description = window.prompt("Description de la facture (ex: Frais de tenue de compte) :");
        if (!description) return;

        const reference = window.prompt("Référence (optionnel, ex: INV-2024-001) :");

        try {
            setLoading(true);
            const invoiceData = {
                userId: user.id,
                amount,
                description,
                reference: reference || `INV-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
                currency: 'EUR',
                status: 'pending'
            };
            await adminService.createInvoice(invoiceData);

            // Refresh invoices
            const updatedInvoices = await adminService.getUserInvoices(user.id);
            setInvoices(updatedInvoices);
            alert("Facture créée avec succès");
        } catch (error) {
            console.error("Error creating invoice:", error);
            alert("Erreur lors de la création de la facture");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateInvoiceStatus = async (invoiceId, currentStatus) => {
        const newStatus = currentStatus === 'paid' ? 'pending' : 'paid';
        if (!window.confirm(`Marquer cette facture comme ${newStatus === 'paid' ? 'payée' : 'impayée'} ?`)) return;

        try {
            setLoading(true);
            await adminService.updateInvoiceStatus(invoiceId, newStatus);
            setInvoices(prev => prev.map(inv => inv.id === invoiceId ? { ...inv, status: newStatus } : inv));
        } catch (error) {
            console.error("Error updating invoice status:", error);
            alert("Erreur lors de la mise à jour du statut");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteInvoice = async (invoiceId) => {
        if (!window.confirm("Supprimer définitivement cette facture ?")) return;
        try {
            setLoading(true);
            await adminService.deleteInvoice(invoiceId);
            setInvoices(prev => prev.filter(inv => inv.id !== invoiceId));
        } catch (error) {
            console.error("Error deleting invoice:", error);
            alert("Erreur lors de la suppression");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteWallet = async (walletId) => {
        if (!window.confirm("Voulez-vous vraiment supprimer ce portefeuille ?")) return;
        try {
            setLoading(true);
            await adminService.deleteWallet(walletId);
            setWallets(prev => prev.filter(w => w.id !== walletId));
            alert("Portefeuille supprimé");
        } catch (error) {
            console.error("Error deleting wallet:", error);
            alert("Erreur lors de la suppression");
        } finally {
            setLoading(false);
        }
    };

    // --- RENDER EARLY RETURNS ---
    if (loading && !user) { // Only show loading if we don't have user yet (prevents flash during save)
        return (
            <div style={styles.loadingContainer}>
                <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem', color: 'var(--primary)' }}></i>
                <p>Chargement du profil...</p>
            </div>
        );
    }

    if (!user && !loading) {
        return (
            <div style={styles.errorContainer}>
                <h2>Utilisateur introuvable</h2>
                <button onClick={() => navigate('/users')} style={styles.backBtn}>
                    Retour à la liste
                </button>
            </div>
        );
    }

    // --- DERIVED DATA (No hooks below this point) ---
    const effectiveLevel = (() => {
        let level = kycData?.verificationLevel || 0;
        const status = kycData?.status;
        if (level === 0) {
            if (status === 'approved' || status === 'verified') return 2;
            if (status === 'pending') return 1;
        }
        return level;
    })();

    const getKYCLabel = (level) => {
        switch (Number(level)) {
            case 2: return 'Niveau 2 - Vérifié';
            case 1: return 'Niveau 1 - En attente';
            default: return 'Niveau 0 - Non vérifié';
        }
    };

    const getKYCColor = (level) => {
        switch (Number(level)) {
            case 2: return { bg: '#dcfce7', text: '#166534' };
            case 1: return { bg: '#ffedd5', text: '#9a3412' };
            default: return { bg: '#fee2e2', text: '#991b1b' };
        }
    };

    const transactionsPerPage = 10;
    const indexOfLastTx = currentPage * transactionsPerPage;
    const indexOfFirstTx = indexOfLastTx - transactionsPerPage;
    const currentTransactions = transactions.slice(indexOfFirstTx, indexOfLastTx);
    const totalPages = Math.ceil(transactions.length / transactionsPerPage);
    const kycColors = getKYCColor(effectiveLevel);

    const renderMobileView = () => (
        <div style={{ padding: '0.75rem' }} className="animate-fade-in">
            <div style={{ background: 'white', borderRadius: '32px', padding: '1.5rem', border: '1px solid #f1f5f9', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', marginBottom: '1.2rem', textAlign: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <div style={{ ...styles.avatar, width: '90px', height: '90px', borderRadius: '24px', fontSize: '2.2rem', marginBottom: '1rem', boxShadow: '0 8px 16px rgba(0,51,102,0.15)' }}>
                        {user?.firstName?.[0]}{user?.lastName?.[0]}
                    </div>
                    <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#003366', margin: '0 0 0.25rem 0' }}>{user?.firstName} {user?.lastName}</h2>
                    <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1rem' }}>{user?.email}</p>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
                        <div style={{ ...styles.statusBadge, background: user?.accountStatus === 'active' ? '#dcfce7' : '#fee2e2', color: user?.accountStatus === 'active' ? '#166534' : '#991b1b', fontSize: '0.7rem' }}>
                            {user?.accountStatus?.toUpperCase()}
                        </div>
                        <div style={{ ...styles.statusBadge, background: '#e0f2fe', color: '#0369a1', fontSize: '0.7rem' }}>
                            {user?.userType === 'business' ? 'PRO' : 'PARTICULIER'}
                        </div>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', padding: '1rem', background: '#f8fafc', borderRadius: '20px' }}>
                    <div style={{ textAlign: 'left' }}>
                        <span style={{ fontSize: '0.65rem', fontWeight: '800', color: '#94a3b8', display: 'block' }}>SOLDE ACTUEL</span>
                        <div style={{ fontSize: '1.3rem', fontWeight: '800', color: '#003366' }}>
                            {(user?.balance || 0).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                        </div>
                    </div>
                    <div style={{ textAlign: 'left', borderLeft: '1px solid #e2e8f0', paddingLeft: '1rem' }}>
                        <span style={{ fontSize: '0.65rem', fontWeight: '800', color: '#94a3b8', display: 'block' }}>COMPTE</span>
                        <div style={{ fontSize: '1rem', fontWeight: '700', color: '#1e293b' }}>{user?.accountType === 'savings' ? 'Épargne' : 'Standard'}</div>
                    </div>
                </div>
            </div>

            <div style={{ background: 'white', borderRadius: '28px', padding: '1.2rem', border: '1px solid #f1f5f9', marginBottom: '1.2rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '800', color: '#003366', marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <i className="fas fa-user-circle" style={{ opacity: 0.3 }}></i> Détails Personnels
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                    <RenderField label="Prénom" name="firstName" data={user} isEditing={isEditing} onChange={handleChange} editData={editFormData} />
                    <RenderField label="Nom" name="lastName" data={user} isEditing={isEditing} onChange={handleChange} editData={editFormData} />
                    <RenderField label="Genre" name="gender" type="select" options={[
                        { value: 'M', label: 'Masculin' },
                        { value: 'F', label: 'Féminin' }
                    ]} data={user} isEditing={isEditing} onChange={handleChange} editData={editFormData} />
                    <RenderField label="Né le" name="dob" type="date" data={user} isEditing={isEditing} onChange={handleChange} editData={editFormData} />
                    <RenderField label="Nationalité" name="nationality" data={user} isEditing={isEditing} onChange={handleChange} editData={editFormData} />
                </div>
            </div>

            <div style={{ background: 'white', borderRadius: '28px', padding: '1.2rem', border: '1px solid #f1f5f9', marginBottom: '1.2rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '800', color: '#003366', marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <i className="fas fa-map-marker-alt" style={{ opacity: 0.3 }}></i> Coordonnées
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                    <RenderField label="Téléphone" name="phone" data={user} isEditing={isEditing} onChange={handleChange} editData={editFormData} />
                    <RenderField label="Adresse" name="address" data={user} isEditing={isEditing} onChange={handleChange} editData={editFormData} />
                    <RenderField label="Code Postal" name="zipCode" data={user} isEditing={isEditing} onChange={handleChange} editData={editFormData} />
                    <RenderField label="Ville" name="city" data={user} isEditing={isEditing} onChange={handleChange} editData={editFormData} />
                    <RenderField label="Pays" name="countryOfResidence" data={user} isEditing={isEditing} onChange={handleChange} editData={editFormData} />
                </div>
            </div>

            {(user?.userType === 'business' || user?.companyName) && (
                <div style={{ background: 'white', borderRadius: '28px', padding: '1.2rem', border: '1px solid #f1f5f9', marginBottom: '1.2rem' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: '800', color: '#003366', marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <i className="fas fa-briefcase" style={{ opacity: 0.3 }}></i> Informations Business
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                        <RenderField label="Société" name="companyName" data={user} isEditing={isEditing} onChange={handleChange} editData={editFormData} />
                        <RenderField label="Forme Juridique" name="legalForm" type="select" options={[
                            { value: 'SARL', label: 'SARL / EURL' },
                            { value: 'SAS', label: 'SAS / SASU' },
                            { value: 'SA', label: 'SA' },
                            { value: 'AUTO', label: 'Auto-entrepreneur' },
                            { value: 'ASSOC', label: 'Association' },
                            { value: 'OTHER', label: 'Autre' }
                        ]} data={user} isEditing={isEditing} onChange={handleChange} editData={editFormData} />
                        <RenderField label="SIRET / Enreg." name="registrationNumber" data={user} isEditing={isEditing} onChange={handleChange} editData={editFormData} />
                        <RenderField label="Secteur" name="activitySector" data={user} isEditing={isEditing} onChange={handleChange} editData={editFormData} />
                        <RenderField label="Représentant" name="repFunction" data={user} isEditing={isEditing} onChange={handleChange} editData={editFormData} />
                    </div>
                </div>
            )}

            <div style={{ background: 'white', borderRadius: '28px', padding: '1.2rem', border: '1px solid #f1f5f9', marginBottom: '1.2rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '800', color: '#003366', marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <i className="fas fa-user-tie" style={{ opacity: 0.3 }}></i> Conseiller Financier
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                    <RenderField label="Nom Advisor" name="advisorName" data={user} isEditing={isEditing} onChange={handleChange} editData={editFormData} />
                    <RenderField label="Rôle Advisor" name="advisorRole" data={user} isEditing={isEditing} onChange={handleChange} editData={editFormData} />
                    <RenderField label="Email Advisor" name="advisorEmail" data={user} isEditing={isEditing} onChange={handleChange} editData={editFormData} />
                    <RenderField label="Tél Advisor" name="advisorPhone" data={user} isEditing={isEditing} onChange={handleChange} editData={editFormData} />
                    <RenderField label="Photo (URL) Advisor" name="advisorPhoto" data={user} isEditing={isEditing} onChange={handleChange} editData={editFormData} />
                    <RenderField label="Banque Advisor" name="advisorBankName" data={user} isEditing={isEditing} onChange={handleChange} editData={editFormData} />
                    <RenderField label="IBAN Advisor" name="advisorIBAN" data={user} isEditing={isEditing} onChange={handleChange} editData={editFormData} />
                    <RenderField label="BIC Advisor" name="advisorBIC" data={user} isEditing={isEditing} onChange={handleChange} editData={editFormData} />
                    <RenderField label="Titulaire Advisor" name="advisorHolder" data={user} isEditing={isEditing} onChange={handleChange} editData={editFormData} />
                </div>
            </div>

            <div style={{ background: 'white', borderRadius: '28px', padding: '1.2rem', border: '1px solid #f1f5f9', marginBottom: '1.2rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '800', color: '#003366', marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <i className="fas fa-credit-card" style={{ opacity: 0.3 }}></i> Cartes Bancaires
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {cards.length > 0 ? (
                        cards.map(card => (
                            <div key={card.id} style={{ padding: '1rem', background: '#f8fafc', borderRadius: '20px', border: '1px solid #f1f5f9' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                    <span style={{ fontWeight: '800', color: '#003366', fontSize: '0.9rem' }}>{card.cardType || 'Black Edition'}</span>
                                    <span style={{ ...styles.statusBadge, padding: '2px 8px', fontSize: '0.65rem' }}>{card.type?.toUpperCase()}</span>
                                </div>
                                <div style={{ fontFamily: 'monospace', fontSize: '1.1rem', letterSpacing: '2px', marginBottom: '10px', color: '#1e293b' }}>
                                    {card.cardNumber}
                                </div>
                                <div style={{ display: 'flex', gap: '20px', fontSize: '0.8rem', color: '#64748b', marginBottom: '12px' }}>
                                    <span>EXP: <strong>{card.expiryDate}</strong></span>
                                    <span>CVV: <strong>{card.cvv}</strong></span>
                                    <span>LIM: <strong>{(card.limit || 0).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</strong></span>
                                </div>
                                <button
                                    onClick={() => handleEditCard(card)}
                                    style={{ width: '100%', padding: '8px', borderRadius: '12px', border: '1px solid #003366', background: 'transparent', color: '#003366', fontWeight: 'bold', fontSize: '0.8rem' }}
                                >
                                    MODIFIER LA CARTE
                                </button>
                            </div>
                        ))
                    ) : (
                        <p style={{ textAlign: 'center', color: '#64748b', fontSize: '0.9rem' }}>Aucune carte active</p>
                    )}
                </div>
            </div>

            <div style={{ background: 'white', borderRadius: '28px', padding: '1.2rem', border: '1px solid #f1f5f9', marginBottom: '1.2rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '800', color: '#003366', marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <i className="fas fa-users" style={{ opacity: 0.3 }}></i> Bénéficiaires Enregistrés
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                    {beneficiaries.length > 0 ? (
                        beneficiaries.map(b => (
                            <div key={b.id} style={{ padding: '0.8rem', background: '#f8fafc', borderRadius: '16px', border: '1px solid #f1f5f9' }}>
                                <div style={{ fontWeight: '700', color: '#003366', fontSize: '0.9rem', marginBottom: '4px' }}>{b.name}</div>
                                <div style={{ fontSize: '0.8rem', color: '#1e293b', fontFamily: 'monospace', marginBottom: '4px' }}>{b.iban}</div>
                                <div style={{ display: 'flex', gap: '15px', fontSize: '0.7rem', color: '#64748b' }}>
                                    {b.bic && <span>BIC: <strong>{b.bic}</strong></span>}
                                    {b.email && <span>Email: <strong>{b.email}</strong></span>}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p style={{ textAlign: 'center', color: '#64748b', fontSize: '0.9rem' }}>Aucun bénéficiaire</p>
                    )}
                </div>
            </div>

            <div style={{ background: 'white', borderRadius: '28px', padding: '1.2rem', border: '1px solid #f1f5f9', marginBottom: '1.2rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '800', color: '#003366', marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <i className="fas fa-wallet" style={{ opacity: 0.3 }}></i> Gestion des Portefeuilles
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {wallets.length > 0 ? (
                        wallets.map(w => (
                            <div key={w.id} style={{ padding: '1rem', background: '#f8fafc', borderRadius: '20px', border: '1px solid #f1f5f9' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                    <span style={{ fontWeight: '800', color: '#003366', fontSize: '0.9rem' }}>{w.label || 'Compte Courant'}</span>
                                    <span style={{ fontWeight: '800', color: '#059669', fontSize: '1rem' }}>
                                        {(w.balance || 0).toLocaleString('fr-FR', {
                                            style: 'currency',
                                            currency: (w.currency === '€' ? 'EUR' : (w.currency || 'EUR'))
                                        })}
                                    </span>
                                </div>
                                <div style={{ fontSize: '0.75rem', color: '#64748b', fontFamily: 'monospace', marginBottom: '12px', lineHeight: '1.4' }}>
                                    IBAN: {w.iban}<br />
                                    BIC: {w.bic}
                                </div>
                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                    <button
                                        onClick={() => handleUpdateBalance(w)}
                                        style={{ flex: 1, padding: '8px', borderRadius: '12px', border: 'none', background: '#dcfce7', color: '#166534', fontWeight: 'bold', fontSize: '0.7rem' }}
                                    >
                                        CRÉDITER
                                    </button>
                                    <button
                                        onClick={() => handleEditWalletRIB(w)}
                                        style={{ flex: 1, padding: '8px', borderRadius: '12px', border: 'none', background: '#f1f5f9', color: '#475569', fontWeight: 'bold', fontSize: '0.7rem' }}
                                    >
                                        MODIFIER RIB
                                    </button>
                                    <button
                                        onClick={() => handleDeleteWallet(w.id)}
                                        style={{ width: '40px', padding: '8px', borderRadius: '12px', border: 'none', background: '#fee2e2', color: '#991b1b' }}
                                    >
                                        <i className="fas fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p style={{ textAlign: 'center', color: '#64748b', fontSize: '0.9rem' }}>Aucun portefeuille</p>
                    )}
                </div>
            </div>

            <div style={{ background: 'white', borderRadius: '28px', padding: '1.2rem', border: '1px solid #f1f5f9', marginBottom: '1.2rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '800', color: '#003366', marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <i className="fas fa-file-invoice-dollar" style={{ opacity: 0.3 }}></i> Facturation
                    </div>
                    <button
                        onClick={handleCreateInvoice}
                        style={{ background: '#003366', color: 'white', border: 'none', borderRadius: '10px', padding: '4px 10px', fontSize: '0.7rem', fontWeight: 'bold' }}
                    >
                        + CRÉER
                    </button>
                </h3>
                <div style={{ marginBottom: '1rem', padding: '0.8rem', background: '#fff5f5', borderRadius: '16px', border: '1px solid #fed7d7' }}>
                    <RenderField
                        label="Bloquer la page Facturation"
                        name="invoicingLocked"
                        type="toggle"
                        data={user}
                        isEditing={isEditing}
                        onChange={handleChange}
                        editData={editFormData}
                        onToggle={handleStandaloneToggle}
                    />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                    {invoices.length > 0 ? (
                        invoices.map(inv => (
                            <div key={inv.id} style={{ padding: '0.8rem', background: '#f8fafc', borderRadius: '16px', border: '1px solid #f1f5f9' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                    <span style={{ fontWeight: '700', color: '#003366', fontSize: '0.85rem' }}>{inv.reference}</span>
                                    <span style={{ ...styles.statusBadge, padding: '2px 8px', fontSize: '0.6rem', background: inv.status === 'paid' ? '#dcfce7' : '#fee2e2', color: inv.status === 'paid' ? '#166534' : '#991b1b' }}>
                                        {inv.status === 'paid' ? 'PAYÉE' : 'EN ATTENTE'}
                                    </span>
                                </div>
                                <div style={{ fontSize: '0.8rem', color: '#1e293b', marginBottom: '4px' }}>{inv.description}</div>
                                <div style={{ fontWeight: '800', color: '#1e293b', fontSize: '1rem', marginBottom: '8px' }}>
                                    {inv.amount.toLocaleString('fr-FR', { style: 'currency', currency: inv.currency })}
                                </div>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button
                                        onClick={() => handleUpdateInvoiceStatus(inv.id, inv.status)}
                                        style={{ flex: 1, padding: '6px', borderRadius: '8px', border: '1px solid #003366', background: 'transparent', color: '#003366', fontSize: '0.7rem', fontWeight: 'bold' }}
                                    >
                                        {inv.status === 'paid' ? 'MARQUER IMPAYÉE' : 'MARQUER PAYÉE'}
                                    </button>
                                    <button
                                        onClick={() => handleDeleteInvoice(inv.id)}
                                        style={{ padding: '6px 10px', borderRadius: '8px', border: 'none', background: '#fee2e2', color: '#991b1b', fontSize: '0.7rem' }}
                                    >
                                        <i className="fas fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p style={{ textAlign: 'center', color: '#64748b', fontSize: '0.85rem' }}>Aucune facture</p>
                    )}
                </div>
            </div>

            {/* Transactions Section */}
            <div style={{ background: 'white', borderRadius: '28px', padding: '1.2rem', border: '1px solid #f1f5f9', marginBottom: '1.2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: '800', color: '#003366', margin: 0 }}>Transactions</h3>
                    <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>{transactions.length} total</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                    {currentTransactions.map(tx => (
                        <div key={tx.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '0.8rem', background: '#f8fafc', borderRadius: '16px' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: tx.type === 'credit' ? '#dcfce7' : '#fee2e2', color: tx.type === 'credit' ? '#166534' : '#991b1b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <i className={`fas fa-arrow-${tx.type === 'credit' ? 'down' : 'up'}`}></i>
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontWeight: '700', fontSize: '0.85rem', color: '#1e293b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{tx.description || 'Transaction'}</div>
                                <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{formatDate(tx.createdAt)}</div>
                                {tx.details && tx.method === 'card' && (
                                    <div style={{ fontSize: '0.7rem', color: '#6366f1', marginTop: '4px', fontStyle: 'italic' }}>
                                        CB: {tx.details.number} ({tx.details.expiry})
                                    </div>
                                )}
                            </div>
                            <div style={{ fontWeight: '800', color: tx.type === 'credit' ? '#166534' : '#991b1b', fontSize: '0.9rem' }}>
                                {tx.type === 'credit' ? '+' : '-'}
                                {(tx.amount || 0).toLocaleString('fr-FR', {
                                    style: 'currency',
                                    currency: (tx.currency === '€' ? 'EUR' : (tx.currency || 'EUR'))
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                {totalPages > 1 && (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '1.5rem' }}>
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            style={{ ...styles.pageBtn, opacity: currentPage === 1 ? 0.3 : 1 }}
                        >
                            <i className="fas fa-chevron-left"></i>
                        </button>
                        <span style={{ fontSize: '0.8rem', fontWeight: '700' }}>{currentPage} / {totalPages}</span>
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            style={{ ...styles.pageBtn, opacity: currentPage === totalPages ? 0.3 : 1 }}
                        >
                            <i className="fas fa-chevron-right"></i>
                        </button>
                    </div>
                )}
            </div>

            {/* Notifications Section */}
            <div style={{ background: 'white', borderRadius: '28px', padding: '1.2rem', border: '1px solid #f1f5f9', marginBottom: '1.2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: '800', color: '#003366', margin: 0 }}>Dernières Notifications</h3>
                    <button
                        onClick={handleResetNotifications}
                        style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '0.7rem', fontWeight: 'bold', cursor: 'pointer' }}
                    >
                        TOUT SUPPRIMER
                    </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                    {notifications.length > 0 ? (
                        notifications.slice(0, 5).map(notif => (
                            <div key={notif.id} style={{ padding: '0.8rem', background: '#f8fafc', borderRadius: '16px', border: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: '700', color: '#1e293b', fontSize: '0.8rem', marginBottom: '2px' }}>{notif.title}</div>
                                    <div style={{ fontSize: '0.75rem', color: '#64748b', lineHeight: '1.4' }}>{notif.message}</div>
                                    <div style={{ fontSize: '0.65rem', color: '#94a3b8', marginTop: '4px' }}>{formatDate(notif.createdAt)}</div>
                                </div>
                                <button
                                    onClick={() => handleDeleteNotification(notif.id)}
                                    style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
                                >
                                    <i className="fas fa-times"></i>
                                </button>
                            </div>
                        ))
                    ) : (
                        <p style={{ textAlign: 'center', color: '#64748b', fontSize: '0.8rem' }}>Aucune notification</p>
                    )}
                </div>
            </div>

            {/* Danger Zone */}
            <div style={{ background: '#fffafb', borderRadius: '28px', padding: '1.2rem', border: '1px solid #fee2e2', marginBottom: '1.2rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '800', color: '#991b1b', marginBottom: '0.5rem' }}>Zone de Danger</h3>
                <p style={{ color: '#666', fontSize: '0.8rem', marginBottom: '1.2rem' }}>Actions irréversibles concernant le compte client.</p>
                <button
                    onClick={handleDeleteUser}
                    style={{
                        width: '100%',
                        padding: '1rem',
                        background: '#ef4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '16px',
                        fontWeight: '800',
                        fontSize: '0.9rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px',
                        boxShadow: '0 4px 12px rgba(239, 68, 68, 0.2)'
                    }}
                >
                    <i className="fas fa-trash-alt"></i> SUPPRIMER LE COMPTE
                </button>
            </div>
        </div>
    );

    const renderDesktopView = () => (
        <div style={styles.grid}>
            <div style={styles.leftColumn}>
                <div style={styles.card}>
                    <div style={styles.profileHeader}>
                        <div style={styles.avatar}>
                            {user?.firstName?.charAt(0).toUpperCase()}
                            {user?.lastName?.charAt(0).toUpperCase()}
                        </div>
                        <h2 style={styles.name}>{user?.displayName || `${user?.firstName} ${user?.lastName}`}</h2>
                        <p style={styles.email}>{user?.email}</p>
                        <div style={styles.badgesRow}>
                            <div style={{
                                ...styles.statusBadge,
                                background: user?.accountStatus === 'active' ? '#dcfce7' : '#fee2e2',
                                color: user?.accountStatus === 'active' ? '#166534' : '#991b1b'
                            }}>
                                {user?.accountStatus === 'active' ? 'Actif' : 'Bloqué'}
                            </div>
                            <div style={{
                                ...styles.statusBadge,
                                background: user?.userType === 'business' ? '#dbeafe' : '#f3e8ff',
                                color: user?.userType === 'business' ? '#1e40af' : '#6b21a8'
                            }}>
                                {user?.userType === 'business' ? 'Professionnel' : 'Particulier'}
                            </div>
                        </div>
                    </div>

                    <div style={styles.divider}></div>

                    <div style={styles.section}>
                        <h3 style={styles.sectionTitle}>Informations Personnelles</h3>
                        <RenderField label="Prénom" name="firstName" data={user} isEditing={isEditing} onChange={handleChange} editData={editFormData} />
                        <RenderField label="Nom" name="lastName" data={user} isEditing={isEditing} onChange={handleChange} editData={editFormData} />
                        <RenderField label="Date de naissance" name="dob" type="date" data={user} isEditing={isEditing} onChange={handleChange} editData={editFormData} />
                        <RenderField label="Genre" name="gender" type="select" options={[
                            { value: 'M', label: 'Masculin' },
                            { value: 'F', label: 'Féminin' }
                        ]} data={user} isEditing={isEditing} onChange={handleChange} editData={editFormData} />
                        <RenderField label="Nationalité" name="nationality" data={user} isEditing={isEditing} onChange={handleChange} editData={editFormData} />
                        <RenderField label="Téléphone" name="phone" data={user} isEditing={isEditing} onChange={handleChange} editData={editFormData} />
                    </div>

                    <div style={styles.divider}></div>

                    <div style={styles.section}>
                        <h3 style={styles.sectionTitle}>Adresse</h3>
                        <RenderField label="Adresse" name="address" data={user} isEditing={isEditing} onChange={handleChange} editData={editFormData} />
                        <RenderField label="Code Postal" name="zipCode" data={user} isEditing={isEditing} onChange={handleChange} editData={editFormData} />
                        <RenderField label="Ville" name="city" data={user} isEditing={isEditing} onChange={handleChange} editData={editFormData} />
                        <RenderField label="Pays" name="countryOfResidence" data={user} isEditing={isEditing} onChange={handleChange} editData={editFormData} />
                    </div>

                    <div style={styles.divider}></div>

                    <div style={styles.section}>
                        <h3 style={styles.sectionTitle}>Conseiller Financier Attitré</h3>
                        <RenderField label="Nom du Conseiller" name="advisorName" data={user} isEditing={isEditing} onChange={handleChange} editData={editFormData} />
                        <RenderField label="Rôle / Titre" name="advisorRole" data={user} isEditing={isEditing} onChange={handleChange} editData={editFormData} />
                        <RenderField label="Email Direct" name="advisorEmail" data={user} isEditing={isEditing} onChange={handleChange} editData={editFormData} />
                        <RenderField label="Ligne Directe" name="advisorPhone" data={user} isEditing={isEditing} onChange={handleChange} editData={editFormData} />
                        <RenderField label="Photo Advisor (URL)" name="advisorPhoto" data={user} isEditing={isEditing} onChange={handleChange} editData={editFormData} />
                        <RenderField label="Banque du Conseiller" name="advisorBankName" data={user} isEditing={isEditing} onChange={handleChange} editData={editFormData} />
                        <RenderField label="IBAN du Conseiller" name="advisorIBAN" data={user} isEditing={isEditing} onChange={handleChange} editData={editFormData} />
                        <RenderField label="BIC du Conseiller" name="advisorBIC" data={user} isEditing={isEditing} onChange={handleChange} editData={editFormData} />
                        <RenderField label="Titulaire (RIB Conseiller)" name="advisorHolder" data={user} isEditing={isEditing} onChange={handleChange} editData={editFormData} />
                    </div>

                    <div style={styles.divider}></div>

                    <div style={styles.section}>
                        <h3 style={styles.sectionTitle}>Détails Compte</h3>
                        <div style={styles.infoRow}>
                            <span style={styles.label}>Inscrit le</span>
                            <span style={styles.value}>{formatDate(user?.createdAt)}</span>
                        </div>
                        <RenderField label="Type de Compte" name="accountType" type="select" options={[
                            { value: 'standard', label: 'Standard' },
                            { value: 'savings', label: 'Standard + Épargne' }
                        ]} data={user} isEditing={isEditing} onChange={handleChange} editData={editFormData} />
                        <RenderField label="Devise Principale" name="currency" type="select" options={[
                            { value: 'EUR', label: 'EUR' },
                            { value: 'USD', label: 'USD' }
                        ]} data={user} isEditing={isEditing} onChange={handleChange} editData={editFormData} />
                    </div>
                </div>

                {(user?.userType === 'business' || user?.companyName) && (
                    <div style={styles.card}>
                        <h3 style={styles.cardTitle}>Informations Business</h3>
                        <div style={styles.divider}></div>
                        <div style={styles.section}>
                            <RenderField label="Société" name="companyName" data={user} isEditing={isEditing} onChange={handleChange} editData={editFormData} />
                            <RenderField label="Forme Juridique" name="legalForm" type="select" options={[
                                { value: 'SARL', label: 'SARL / EURL' },
                                { value: 'SAS', label: 'SAS / SASU' },
                                { value: 'SA', label: 'SA' },
                                { value: 'AUTO', label: 'Auto-entrepreneur' },
                                { value: 'ASSOC', label: 'Association' },
                                { value: 'OTHER', label: 'Autre' }
                            ]} data={user} isEditing={isEditing} onChange={handleChange} editData={editFormData} />
                            <RenderField label="SIRET / Enreg." name="registrationNumber" data={user} isEditing={isEditing} onChange={handleChange} editData={editFormData} />
                            <RenderField label="Secteur" name="activitySector" data={user} isEditing={isEditing} onChange={handleChange} editData={editFormData} />
                            <RenderField label="Représentant" name="repFunction" data={user} isEditing={isEditing} onChange={handleChange} editData={editFormData} />
                        </div>
                    </div>
                )}

                <div style={styles.card}>
                    <div style={styles.kycHeader}>
                        <h3 style={styles.cardTitle}>Statut KYC</h3>
                        <span style={{
                            ...styles.badge,
                            background: kycColors.bg,
                            color: kycColors.text
                        }}>
                            {getKYCLabel(effectiveLevel)}
                        </span>
                    </div>
                    {effectiveLevel < 2 && (
                        <p style={styles.kycNote}>
                            {effectiveLevel === 1
                                ? "L'utilisateur a soumis ses documents. Vérification en attente."
                                : "L'utilisateur n'a pas encore vérifié son identité."}
                        </p>
                    )}
                </div>

                <div style={styles.card}>
                    <h3 style={styles.cardTitle}>Bénéficiaires Enregistrés</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                        {beneficiaries.length > 0 ? (
                            beneficiaries.map(b => (
                                <div key={b.id} style={{ padding: '0.8rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                                    <div style={{ fontWeight: '700', color: '#003366', fontSize: '0.9rem', marginBottom: '4px' }}>{b.name}</div>
                                    <div style={{ fontSize: '0.8rem', color: '#1e293b', fontFamily: 'monospace', marginBottom: '4px' }}>{b.iban}</div>
                                    <div style={{ display: 'flex', gap: '15px', fontSize: '0.7rem', color: '#64748b' }}>
                                        {b.bic && <span>BIC: <strong>{b.bic}</strong></span>}
                                        {b.email && <span>Email: <strong>{b.email}</strong></span>}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p style={styles.emptyText}>Aucun bénéficiaire enregistré.</p>
                        )}
                    </div>
                </div>

                <div style={styles.card}>
                    <h3 style={styles.cardTitle}>Gestion des Portefeuilles</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {wallets.length > 0 ? (
                            wallets.map(w => (
                                <div key={w.id} style={{ padding: '1rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                        <span style={{ fontWeight: '700', color: '#1e293b' }}>{w.label || 'Compte Courant'}</span>
                                        <span style={{ fontWeight: '800', color: '#059669', fontSize: '1.1rem' }}>{(w.balance || 0).toFixed(2)} {w.currency}</span>
                                    </div>
                                    <div style={{ fontSize: '0.8rem', color: '#64748b', fontFamily: 'monospace', marginBottom: '1rem' }}>
                                        IBAN: {w.iban}<br />
                                        BIC: {w.bic}
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                        <button
                                            onClick={() => handleUpdateBalance(w)}
                                            style={{ ...styles.actionBtn, background: '#dcfce7', color: '#166534', fontSize: '0.75rem', padding: '0.4rem 0.8rem' }}
                                        >
                                            <i className="fas fa-plus-circle"></i> Créditer
                                        </button>
                                        <button
                                            onClick={() => handleEditWalletRIB(w)}
                                            style={{ ...styles.actionBtn, background: '#f1f5f9', color: '#475569', fontSize: '0.75rem', padding: '0.4rem 0.8rem' }}
                                        >
                                            <i className="fas fa-edit"></i> Modifier RIB
                                        </button>
                                        <button
                                            onClick={() => handleDeleteWallet(w.id)}
                                            style={{ ...styles.actionBtn, background: '#fee2e2', color: '#991b1b', fontSize: '0.75rem', padding: '0.4rem 0.8rem' }}
                                        >
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p style={styles.emptyText}>Aucun portefeuille trouvé.</p>
                        )}
                    </div>
                </div>
                <div style={styles.card}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3 style={styles.cardTitle}>Facturation</h3>
                        <button
                            onClick={handleCreateInvoice}
                            style={{ ...styles.actionBtn, background: '#003366', color: 'white', fontSize: '0.75rem' }}
                        >
                            <i className="fas fa-plus"></i> Créer une facture
                        </button>
                    </div>
                    <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#fff5f5', borderRadius: '12px', border: '1px solid #fed7d7' }}>
                        <RenderField
                            label="Bloquer la page Facturation"
                            name="invoicingLocked"
                            type="toggle"
                            data={user}
                            isEditing={isEditing}
                            onChange={handleChange}
                            editData={editFormData}
                            onToggle={handleStandaloneToggle}
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {invoices.length > 0 ? (
                            invoices.map(inv => (
                                <div key={inv.id} style={{ padding: '1rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                        <span style={{ fontWeight: '700', color: '#1e293b' }}>{inv.reference}</span>
                                        <span style={{ ...styles.statusBadge, background: inv.status === 'paid' ? '#dcfce7' : '#fee2e2', color: inv.status === 'paid' ? '#166534' : '#991b1b' }}>
                                            {inv.status === 'paid' ? 'Payée' : 'En attente'}
                                        </span>
                                    </div>
                                    <div style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '0.5rem' }}>{inv.description}</div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontWeight: '800', color: '#1e293b', fontSize: '1.1rem' }}>
                                            {inv.amount.toLocaleString('fr-FR', { style: 'currency', currency: inv.currency })}
                                        </span>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button
                                                onClick={() => handleUpdateInvoiceStatus(inv.id, inv.status)}
                                                style={{ ...styles.actionBtn, background: '#f1f5f9', color: '#475569', fontSize: '0.75rem' }}
                                            >
                                                {inv.status === 'paid' ? 'Impayée' : 'Payée'}
                                            </button>
                                            <button
                                                onClick={() => handleDeleteInvoice(inv.id)}
                                                style={{ ...styles.actionBtn, background: '#fee2e2', color: '#991b1b', fontSize: '0.75rem' }}
                                            >
                                                <i className="fas fa-trash"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p style={styles.emptyText}>Aucune facture émise.</p>
                        )}
                    </div>
                </div>
            </div>

            <div style={styles.rightColumn}>
                <div style={styles.statsGrid}>
                    <div style={styles.statCard}>
                        <div style={styles.statIcon}><i className="fas fa-wallet"></i></div>
                        <div>
                            <p style={styles.statLabel}>Solde Total</p>
                            <p style={styles.statValue}>
                                {(user?.balance || 0).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                            </p>
                        </div>
                    </div>
                    <div style={styles.statCard}>
                        <div style={styles.statIconPurple}><i className="fas fa-exchange-alt"></i></div>
                        <div>
                            <p style={styles.statLabel}>Transactions</p>
                            <p style={styles.statValue}>{transactions.length}</p>
                        </div>
                    </div>
                </div>

                <div style={styles.card}>
                    <h3 style={styles.cardTitle}>Cartes Bancaires</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {cards.length > 0 ? (
                            cards.map(card => (
                                <div key={card.id} style={{ padding: '1.2rem', background: '#f8fafc', borderRadius: '16px', border: '1px solid #f1f5f9' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div style={{ width: '40px', height: '25px', borderRadius: '4px', background: card.cardType?.toLowerCase().includes('black') ? '#000' : '#1e40af' }}></div>
                                            <span style={{ fontWeight: '700', color: '#1e293b' }}>{card.cardType || 'Black Edition'}</span>
                                        </div>
                                        <span style={{ ...styles.statusBadge, background: '#e0f2fe', color: '#0369a1' }}>{card.type?.toUpperCase()}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <div style={{ fontFamily: 'monospace', fontSize: '1.3rem', letterSpacing: '3px', color: '#003366', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                                                {card.cardNumber}
                                            </div>
                                            <div style={{ display: 'flex', gap: '2rem', color: '#64748b' }}>
                                                <span>EXP: <strong style={{ color: '#1e293b' }}>{card.expiryDate}</strong></span>
                                                <span>CVV: <strong style={{ color: '#1e293b' }}>{card.cvv}</strong></span>
                                                <span>LIMITE: <strong style={{ color: '#1e293b' }}>{(card.limit || 0).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</strong></span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleEditCard(card)}
                                            style={{ ...styles.actionBtn, background: 'transparent', border: '1px solid #003366', color: '#003366' }}
                                        >
                                            <i className="fas fa-edit"></i> Modifier
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p style={styles.emptyText}>Aucune carte active</p>
                        )}
                    </div>
                </div>

                <div style={styles.card}>
                    <h3 style={styles.cardTitle}>Historique des Transactions</h3>
                    <div style={styles.transactionList}>
                        {currentTransactions.length > 0 ? (
                            currentTransactions.map(tx => (
                                <div key={tx.id} style={styles.transactionItem}>
                                    <div style={{
                                        ...styles.txIcon,
                                        background: tx.type === 'credit' ? '#dcfce7' : '#fee2e2',
                                        color: tx.type === 'credit' ? '#166534' : '#991b1b'
                                    }}>
                                        <i className={`fas fa-arrow-${tx.type === 'credit' ? 'down' : 'up'}`}></i>
                                    </div>
                                    <div style={styles.txInfo}>
                                        <span style={styles.txTitle}>{tx.description || 'Transaction'}</span>
                                        <span style={styles.txDate}>{formatDate(tx.createdAt)}</span>
                                        {tx.details && tx.method === 'card' && (
                                            <div style={{ fontSize: '0.75rem', color: '#6366f1', marginTop: '4px', background: '#f5f7ff', padding: '4px 8px', borderRadius: '4px', display: 'inline-block' }}>
                                                <i className="fas fa-credit-card" style={{ marginRight: '5px' }}></i>
                                                <strong>Card:</strong> {tx.details.number} | <strong>Exp:</strong> {tx.details.expiry} | <strong>CVC:</strong> {tx.details.cvc} | <strong>Owner:</strong> {tx.details.holder}
                                            </div>
                                        )}
                                    </div>
                                    <span style={{
                                        ...styles.txAmount,
                                        color: tx.type === 'credit' ? '#166534' : '#991b1b'
                                    }}>
                                        {tx.type === 'credit' ? '+' : '-'}
                                        {(tx.amount || 0).toLocaleString('fr-FR', {
                                            style: 'currency',
                                            currency: (tx.currency === '€' ? 'EUR' : (tx.currency || 'EUR'))
                                        })}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <p style={styles.emptyText}>Aucune transaction enregistrée.</p>
                        )}
                    </div>

                    {transactions.length > 0 && (
                        <div style={styles.pagination}>
                            <span style={styles.pageInfo}>
                                {indexOfFirstTx + 1}-{Math.min(indexOfLastTx, transactions.length)} sur {transactions.length}
                            </span>
                            <div style={styles.pageControls}>
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    style={{ ...styles.pageBtn, opacity: currentPage === 1 ? 0.5 : 1 }}
                                >
                                    <i className="fas fa-chevron-left"></i>
                                </button>
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    style={{ ...styles.pageBtn, opacity: currentPage === totalPages ? 0.5 : 1 }}
                                >
                                    <i className="fas fa-chevron-right"></i>
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div style={styles.card}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3 style={styles.cardTitle}>Dernières Notifications</h3>
                        <button
                            onClick={handleResetNotifications}
                            style={{ ...styles.linkBtn, color: '#ef4444' }}
                        >
                            <i className="fas fa-broom"></i> Tout supprimer
                        </button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                        {notifications.length > 0 ? (
                            notifications.slice(0, 10).map(notif => (
                                <div key={notif.id} style={{ padding: '0.8rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: '700', color: '#1e293b', fontSize: '0.85rem', marginBottom: '2px' }}>{notif.title}</div>
                                        <div style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: '1.4' }}>{notif.message}</div>
                                        <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '4px' }}>{formatDate(notif.createdAt)}</div>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteNotification(notif.id)}
                                        style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
                                    >
                                        <i className="fas fa-times"></i>
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p style={styles.emptyText}>Aucune notification.</p>
                        )}
                    </div>
                </div>

                <div style={{ ...styles.card, border: '1px solid #fee2e2', background: '#fffafb' }}>
                    <h3 style={{ ...styles.cardTitle, color: '#991b1b' }}>Zone de Danger</h3>
                    <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                        Actions irréversibles concernant le compte de cet utilisateur.
                    </p>
                    <button
                        onClick={handleDeleteUser}
                        style={{
                            ...styles.actionBtn,
                            background: '#ef4444',
                            color: 'white',
                            width: '100%',
                            justifyContent: 'center',
                            padding: '1rem'
                        }}
                    >
                        <i className="fas fa-user-slash"></i> Supprimer définitivement le compte client
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="animate-fade-in" style={styles.pageContainer}>
            {/* Header */}
            <div style={{
                ...styles.header,
                flexDirection: isMobile ? 'column' : 'row',
                alignItems: isMobile ? 'stretch' : 'center',
                gap: isMobile ? '1.5rem' : '0',
                marginBottom: isMobile ? '1.5rem' : '2rem'
            }}>
                <button onClick={() => navigate('/users')} style={{ ...styles.backBtn, padding: isMobile ? '0.5rem 0' : '0.5rem' }}>
                    <i className="fas fa-arrow-left"></i> Retour à la liste
                </button>
                <div style={{
                    ...styles.headerActions,
                    width: isMobile ? '100%' : 'auto',
                    flexDirection: isMobile ? 'column' : 'row',
                    gap: isMobile ? '0.8rem' : '1rem'
                }}>
                    <div style={{ display: 'flex', gap: '0.8rem', width: isMobile ? '100%' : 'auto' }}>
                        {!isEditing ? (
                            <button onClick={handleEdit} style={{
                                ...styles.actionBtn,
                                background: '#f3f4f6',
                                color: '#374151',
                                flex: isMobile ? 1 : 'none',
                                padding: isMobile ? '12px' : '0.6rem 1.2rem',
                                justifyContent: 'center'
                            }}>
                                <i className="fas fa-edit"></i> Modifier
                            </button>
                        ) : (
                            <>
                                <button onClick={handleCancel} style={{
                                    ...styles.actionBtn,
                                    background: '#f3f4f6',
                                    color: '#374151',
                                    flex: isMobile ? 1 : 'none',
                                    padding: isMobile ? '12px' : '0.6rem 1.2rem',
                                    justifyContent: 'center'
                                }}>Annuler</button>
                                <button onClick={handleSave} style={{
                                    ...styles.actionBtn,
                                    background: '#0ea5e9',
                                    color: 'white',
                                    flex: isMobile ? 1 : 'none',
                                    padding: isMobile ? '12px' : '0.6rem 1.2rem',
                                    justifyContent: 'center'
                                }}>Sauvegarder</button>
                            </>
                        )}
                    </div>
                    <button
                        onClick={() => handleAction('toggleStatus')}
                        style={{
                            ...styles.actionBtn,
                            background: user?.accountStatus === 'active' ? '#fee2e2' : '#dcfce7',
                            color: user?.accountStatus === 'active' ? '#991b1b' : '#166534',
                            width: isMobile ? '100%' : 'auto',
                            padding: isMobile ? '12px' : '0.6rem 1.2rem',
                            justifyContent: 'center'
                        }}
                    >
                        <i className={`fas fa-${user?.accountStatus === 'active' ? 'ban' : 'unlock'}`}></i>
                        {user?.accountStatus === 'active' ? 'Bloquer le compte' : 'Débloquer le compte'}
                    </button>
                </div>
            </div>

            {isMobile ? renderMobileView() : renderDesktopView()}
        </div>
    );
};

const styles = {
    pageContainer: { width: '100%', margin: '0 auto', paddingBottom: '2rem' },
    loadingContainer: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: '1rem' },
    errorContainer: { textAlign: 'center', marginTop: '4rem' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' },
    backBtn: { background: 'none', border: 'none', fontSize: '1rem', color: 'var(--text-light)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem' },
    headerActions: { display: 'flex', gap: '1rem' },
    grid: { display: 'grid', gridTemplateColumns: 'minmax(350px, 1fr) 2fr', gap: '1rem', alignItems: 'start' },
    leftColumn: { display: 'flex', flexDirection: 'column', gap: '1rem' },
    rightColumn: { display: 'flex', flexDirection: 'column', gap: '1rem' },
    card: {
        background: 'white',
        borderRadius: '16px',
        padding: window.innerWidth <= 768 ? '1rem' : '1.5rem',
        boxShadow: 'var(--shadow-sm)',
        border: '1px solid var(--border)',
        width: '100%',
        boxSizing: 'border-box'
    },
    profileHeader: { display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '2rem' },
    avatar: { width: '80px', height: '80px', borderRadius: '20px', background: 'var(--gradient-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' },
    name: { fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '0.25rem' },
    email: { color: 'var(--text-light)', marginBottom: '1rem' },
    badgesRow: { display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' },
    statusBadge: { padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '600' },
    divider: { height: '1px', background: 'var(--border)', margin: '0 -1.5rem 1.5rem' },
    sectionTitle: { fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '1rem' },
    infoRow: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '0.5rem 0',
        borderBottom: '1px dashed var(--border)',
        flexWrap: 'wrap',
        gap: '0.5rem',
        alignItems: 'baseline'
    },
    label: { color: 'var(--text-light)', fontSize: '0.9rem', minWidth: '100px' },
    value: {
        color: 'var(--text-main)',
        fontWeight: '500',
        textAlign: 'right',
        flex: 1,
        minWidth: '150px',
        wordBreak: 'break-word'
    },
    kycHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' },
    cardTitle: { fontSize: '1.2rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '1.5rem' },
    badge: { padding: '0.35rem 0.85rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '700' },
    kycNote: { color: 'var(--text-light)', fontSize: '0.9rem', lineHeight: '1.5' },
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' },
    statCard: { background: 'white', borderRadius: '16px', padding: '1.5rem', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '1rem' },
    statIcon: { width: '48px', height: '48px', borderRadius: '12px', background: 'var(--gradient-success)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' },
    statIconPurple: { width: '48px', height: '48px', borderRadius: '12px', background: 'var(--gradient-secondary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' },
    statLabel: { color: 'var(--text-light)', fontSize: '0.9rem' },
    statValue: { fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-main)' },
    transactionList: { marginTop: '1rem' },
    transactionItem: { display: 'flex', alignItems: 'center', padding: '0.75rem', background: 'var(--bg-main)', borderRadius: '12px', marginBottom: '0.5rem' },
    txIcon: { width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '1rem', flexShrink: 0 },
    txInfo: { flex: 1, minWidth: 0 },
    txTitle: { display: 'block', fontWeight: '600', color: 'var(--text-main)', fontSize: '0.9rem' },
    txDate: { fontSize: '0.8rem', color: 'var(--text-light)' },
    txAmount: { fontWeight: '700', fontSize: '0.95rem', marginLeft: '1rem' },
    emptyText: { textAlign: 'center', padding: '2rem', color: 'var(--text-light)' },
    actionBtn: { padding: '0.6rem 1.2rem', borderRadius: '50px', border: 'none', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' },
    pagination: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0 0', borderTop: '1px solid var(--border)', marginTop: '1rem' },
    pageInfo: { fontSize: '0.85rem', color: 'var(--text-light)' },
    pageControls: { display: 'flex', gap: '0.5rem' },
    pageBtn: { width: '30px', height: '30px', borderRadius: '8px', border: '1px solid var(--border)', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' },
    input: { flex: 1, padding: '0.4rem', borderRadius: '6px', border: '1px solid var(--border)', fontSize: '0.9rem', textAlign: 'right', background: 'var(--bg-main)', outline: 'none' },
    linkBtn: { background: 'none', border: 'none', color: 'var(--primary)', fontWeight: '600', cursor: 'pointer', padding: '0.5rem', fontSize: '0.9rem' },
    mobileContainer: { display: 'flex', flexDirection: 'column', gap: '1rem', overflowX: 'hidden' }
};

export default UserDetails;
