import React, { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';
import { useAdminAuth } from '../contexts/AdminAuthContext';

const ManageAdmins = () => {
    const { isSuperAdmin, currentUser } = useAdminAuth();
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        isSuperAdmin: false
    });
    const [status, setStatus] = useState({ type: '', message: '' });
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 1024);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (isSuperAdmin) {
            fetchAdmins();
        }
    }, [isSuperAdmin]);

    const fetchAdmins = async () => {
        try {
            const data = await adminService.getAllAdmins();
            setAdmins(data);
        } catch (error) {
            console.error("Error fetching admins:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateAdmin = async (e) => {
        e.preventDefault();
        setStatus({ type: 'info', message: 'Création en cours...' });
        try {
            await adminService.createAdminAccount(formData.email, formData.password, {
                firstName: formData.firstName,
                lastName: formData.lastName,
                isSuperAdmin: formData.isSuperAdmin
            });
            setStatus({ type: 'success', message: 'Compte administrateur créé avec succès !' });
            setShowModal(false);
            setFormData({ email: '', password: '', firstName: '', lastName: '', isSuperAdmin: false });
            fetchAdmins();
        } catch (error) {
            console.error("Error creating admin:", error);
            setStatus({ type: 'error', message: `Erreur: ${error.message}` });
        }
    };

    const handleDeleteAdmin = async (adminId, adminName) => {
        if (adminId === currentUser?.uid) {
            alert("Vous ne pouvez pas supprimer votre propre compte.");
            return;
        }

        if (window.confirm(`Êtes-vous sûr de vouloir supprimer le compte administrateur de ${adminName} ? Cette action bloquera ses accès.`)) {
            try {
                await adminService.deleteAdminAccount(adminId);
                setStatus({ type: 'success', message: 'Compte administrateur supprimé.' });
                fetchAdmins();
            } catch (error) {
                console.error("Error deleting admin:", error);
                setStatus({ type: 'error', message: `Erreur lors de la suppression: ${error.message}` });
            }
        }
    };

    const styles = {
        container: { padding: 'clamp(1rem, 5vw, 2.5rem)', maxWidth: '1400px', margin: '0 auto' },
        header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', gap: '1rem' },
        title: { fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', fontWeight: '900', margin: 0, color: '#003366', letterSpacing: '-0.5px' },
        subtitle: { color: '#64748b', margin: '0.25rem 0 0 0', fontSize: 'clamp(0.85rem, 2vw, 1rem)' },
        addBtn: {
            background: '#003366',
            color: 'white',
            border: 'none',
            padding: '0.9rem 1.8rem',
            borderRadius: '16px',
            fontWeight: '700',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            boxShadow: '0 8px 20px rgba(0, 51, 102, 0.2)',
            transition: 'all 0.3s ease',
            flexShrink: 0
        },
        alert: { padding: '1.2rem', borderRadius: '16px', marginBottom: '2rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.95rem' },

        // Desktop Table Styles
        tableCard: {
            background: 'white',
            borderRadius: '24px',
            boxShadow: '0 4px 25px rgba(0,0,0,0.04)',
            border: '1px solid #f1f5f9',
            overflow: 'hidden'
        },
        table: { width: '100%', borderCollapse: 'collapse' },
        th: {
            padding: '1.2rem 1.5rem',
            textAlign: 'left',
            background: '#f8fafc',
            color: '#64748b',
            fontSize: '0.75rem',
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            borderBottom: '1px solid #f1f5f9'
        },
        tr: { borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s' },
        td: { padding: '1.2rem 1.5rem', fontSize: '0.95rem', color: '#1e293b' },
        userCell: { display: 'flex', alignItems: 'center', gap: '1rem' },
        avatar: {
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #003366 0%, #004d99 100%)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '800',
            fontSize: '1rem'
        },
        userName: { fontWeight: '700' },
        superBadge: { background: '#e0f2fe', color: '#0369a1', padding: '4px 10px', borderRadius: '50px', fontSize: '0.75rem', fontWeight: '800' },
        adminBadge: { background: '#f1f5f9', color: '#475569', padding: '4px 10px', borderRadius: '50px', fontSize: '0.75rem', fontWeight: '800' },
        statusBadge: { padding: '4px 10px', borderRadius: '50px', fontSize: '0.75rem', fontWeight: '800' },
        deleteBtn: {
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            border: '1px solid #fee2e2',
            background: '#fff',
            color: '#ef4444',
            cursor: 'pointer',
            transition: 'all 0.2s',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center'
        },

        // Mobile View Styles
        mobileGrid: { display: 'flex', flexDirection: 'column', gap: '1.2rem' },
        mobileCard: {
            background: 'white',
            borderRadius: '24px',
            padding: '1.2rem',
            border: '1px solid #f1f5f9',
            boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
        },
        cardHeaderMobile: { display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.2rem' },
        avatarMobile: {
            width: '45px',
            height: '45px',
            borderRadius: '14px',
            background: '#003366',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.2rem',
            fontWeight: '800'
        },
        infoMobile: { flex: 1, minWidth: 0 },
        nameMobile: { margin: 0, fontSize: '1.1rem', fontWeight: '800', color: '#1e293b' },
        emailMobile: { fontSize: '0.85rem', color: '#64748b', display: 'block', textOverflow: 'ellipsis', overflow: 'hidden' },
        deleteBtnMobile: {
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            border: 'none',
            background: '#fee2e2',
            color: '#ef4444',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        },
        cardBodyMobile: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: '1rem',
            borderTop: '1px solid #f1f5f9'
        },
        badgeGroup: { display: 'flex', gap: '8px' },
        superBadgeMobile: { padding: '4px 12px', borderRadius: '50px', background: '#003366', color: 'white', fontSize: '0.65rem', fontWeight: '800' },
        adminBadgeMobile: { padding: '4px 12px', borderRadius: '50px', background: '#f1f5f9', color: '#475569', fontSize: '0.65rem', fontWeight: '800' },
        statusBadgeMobile: { padding: '4px 12px', borderRadius: '50px', fontSize: '0.65rem', fontWeight: '800' },
        dateMobile: { fontSize: '0.75rem', color: '#94a3b8' },

        // Global Styles
        loading: { textAlign: 'center', padding: '5rem', color: '#64748b' },
        emptyState: { textAlign: 'center', padding: '5rem', color: '#94a3b8' },
        overlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,30,0.4)',
            backdropFilter: 'blur(8px)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            padding: '2rem 1rem',
            overflowY: 'auto'
        },
        modal: {
            background: 'white',
            width: '100%',
            maxWidth: '520px',
            borderRadius: '32px',
            padding: 'clamp(1.5rem, 5vw, 2.5rem)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            position: 'relative',
            marginTop: isMobile ? '40px' : '60px',
            maxHeight: 'none',
            overflowY: 'visible'
        },
        modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' },
        closeBtn: { background: '#f1f5f9', border: 'none', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center' },
        form: { display: 'flex', flexDirection: 'column', gap: '1.5rem' },
        row: {
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
            gap: '1rem'
        },
        inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
        formHint: { color: '#94a3b8', fontSize: '0.75rem', marginTop: '4px' },
        checkboxGroup: { padding: '1.2rem', background: '#f8fafc', borderRadius: '20px', border: '1px solid #f1f5f9' },
        checkboxWrapper: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' },
        checkbox: { width: '18px', height: '18px', cursor: 'pointer' },
        checkboxLabel: { fontWeight: '700', color: '#1e293b', fontSize: '0.95rem', cursor: 'pointer' },
        checkboxHint: { margin: '0 0 0 30px', fontSize: '0.8rem', color: '#64748b' },
        modalActions: { display: 'flex', gap: '1rem', marginTop: '1rem' },
        cancelBtn: { flex: 1, padding: '1rem', borderRadius: '16px', border: '1px solid #e2e8f0', background: 'white', fontWeight: '700', cursor: 'pointer', color: '#64748b' },
        submitBtn: { flex: 1, padding: '1rem', borderRadius: '16px', border: 'none', background: '#003366', color: 'white', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0, 51, 102, 0.15)' },
        input: {
            padding: '0.8rem 1rem',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            fontSize: '1rem',
            outline: 'none',
            transition: 'border-color 0.2s',
            width: '100%',
            boxSizing: 'border-box'
        },
        errorContainer: { textAlign: 'center', padding: '5rem', color: '#64748b' }
    };

    if (!isSuperAdmin) {
        return (
            <div style={styles.errorContainer}>
                <i className="fas fa-lock fa-3x" style={{ color: '#e74c3c', marginBottom: '1rem' }}></i>
                <h2>Accès Restreint</h2>
                <p>Seul le Super Administrateur peut accéder à cette page.</p>
            </div>
        );
    }

    const MobileView = () => (
        <div style={styles.mobileGrid} className="animate-fade-in">
            {admins.map(admin => (
                <div key={admin.id} style={styles.mobileCard}>
                    <div style={styles.cardHeaderMobile}>
                        <div style={styles.avatarMobile}>
                            {admin.firstName?.[0]?.toUpperCase()}
                        </div>
                        <div style={styles.infoMobile}>
                            <h3 style={styles.nameMobile}>{admin.firstName} {admin.lastName}</h3>
                            <span style={styles.emailMobile}>{admin.email}</span>
                        </div>
                        {admin.id !== currentUser?.uid && (
                            <button
                                onClick={(e) => { e.stopPropagation(); handleDeleteAdmin(admin.id, `${admin.firstName} ${admin.lastName}`); }}
                                style={styles.deleteBtnMobile}
                            >
                                <i className="fas fa-trash"></i>
                            </button>
                        )}
                    </div>
                    <div style={styles.cardBodyMobile}>
                        <div style={styles.badgeGroup}>
                            {admin.isSuperAdmin ? (
                                <span style={styles.superBadgeMobile}>SUPER ADMIN</span>
                            ) : (
                                <span style={styles.adminBadgeMobile}>ADMIN</span>
                            )}
                            <span style={{
                                ...styles.statusBadgeMobile,
                                background: (admin.accountStatus || 'active') === 'active' ? '#dcfce7' : '#fee2e2',
                                color: (admin.accountStatus || 'active') === 'active' ? '#15803d' : '#b91c1c'
                            }}>
                                {admin.accountStatus?.toUpperCase() || 'ACTIF'}
                            </span>
                        </div>
                        <div style={styles.dateMobile}>
                            Créé le {admin.createdAt?.toDate ? admin.createdAt.toDate().toLocaleDateString() : 'N/A'}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    const DesktopView = () => (
        <div style={styles.tableCard} className="animate-fade-in">
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.th}>Administrateur</th>
                        <th style={styles.th}>Email</th>
                        <th style={styles.th}>Rôle</th>
                        <th style={styles.th}>Statut</th>
                        <th style={styles.th}>Date de création</th>
                        <th style={{ ...styles.th, textAlign: 'center' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {admins.map(admin => (
                        <tr key={admin.id} style={styles.tr}>
                            <td style={styles.td}>
                                <div style={styles.userCell}>
                                    <div style={styles.avatar}>
                                        {admin.firstName?.[0]?.toUpperCase()}
                                    </div>
                                    <span style={styles.userName}>{admin.firstName} {admin.lastName}</span>
                                </div>
                            </td>
                            <td style={styles.td}>{admin.email}</td>
                            <td style={styles.td}>
                                {admin.isSuperAdmin ? (
                                    <span style={styles.superBadge}>Super Admin</span>
                                ) : (
                                    <span style={styles.adminBadge}>Administrateur</span>
                                )}
                            </td>
                            <td style={styles.td}>
                                <span style={{
                                    ...styles.statusBadge,
                                    background: (admin.accountStatus || 'active') === 'active' ? '#dcfce7' : '#fee2e2',
                                    color: (admin.accountStatus || 'active') === 'active' ? '#15803d' : '#b91c1c'
                                }}>
                                    {admin.accountStatus || 'Actif'}
                                </span>
                            </td>
                            <td style={styles.td}>
                                {admin.createdAt?.toDate ? admin.createdAt.toDate().toLocaleDateString() : 'N/A'}
                            </td>
                            <td style={{ ...styles.td, textAlign: 'center' }}>
                                {admin.id !== currentUser?.uid && (
                                    <button
                                        onClick={() => handleDeleteAdmin(admin.id, `${admin.firstName} ${admin.lastName}`)}
                                        style={styles.deleteBtn}
                                        title="Supprimer"
                                    >
                                        <i className="fas fa-trash"></i>
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <div>
                    <h1 style={styles.title}>Gestion des Admins</h1>
                    <p style={styles.subtitle}>Supervision des accès et permissions de l'équipe.</p>
                </div>
                <button style={styles.addBtn} onClick={() => setShowModal(true)}>
                    <i className="fas fa-plus"></i> <span style={isMobile ? { display: 'none' } : {}}>Nouvel Admin</span>
                </button>
            </header>

            {status.message && (
                <div style={{
                    ...styles.alert,
                    backgroundColor: status.type === 'success' ? '#dcfce7' : (status.type === 'error' ? '#fee2e2' : '#e0f2fe'),
                    color: status.type === 'success' ? '#166534' : (status.type === 'error' ? '#991b1b' : '#0369a1')
                }}>
                    <i className={`fas fa-${status.type === 'success' ? 'check-circle' : (status.type === 'error' ? 'exclamation-circle' : 'info-circle')}`}></i>
                    {status.message}
                </div>
            )}

            {loading ? (
                <div style={styles.loading}>
                    <i className="fas fa-circle-notch fa-spin fa-2x"></i>
                    <p>Chargement des comptes...</p>
                </div>
            ) : admins.length > 0 ? (
                isMobile ? <MobileView /> : <DesktopView />
            ) : (
                <div style={styles.emptyState}>
                    <i className="fas fa-users-slash fa-3x"></i>
                    <h3>Aucun administrateur</h3>
                    <p>Commencez par en créer un nouveau.</p>
                </div>
            )}

            {/* Modal de création */}
            {showModal && (
                <div style={styles.overlay} onClick={() => setShowModal(false)}>
                    <div style={styles.modal} className="animate-slide-up" onClick={e => e.stopPropagation()}>
                        <div style={styles.modalHeader}>
                            <h2>Nouvel Administrateur</h2>
                            <button onClick={() => setShowModal(false)} style={styles.closeBtn}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <form onSubmit={handleCreateAdmin} style={styles.form}>
                            <div style={styles.row}>
                                <div style={styles.inputGroup}>
                                    <label>Prénom</label>
                                    <input
                                        type="text"
                                        required
                                        style={styles.input}
                                        value={formData.firstName}
                                        onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                                        placeholder="Jean"
                                    />
                                </div>
                                <div style={styles.inputGroup}>
                                    <label>Nom</label>
                                    <input
                                        type="text"
                                        required
                                        style={styles.input}
                                        value={formData.lastName}
                                        onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                                        placeholder="Dupont"
                                    />
                                </div>
                            </div>
                            <div style={styles.inputGroup}>
                                <label>Email professionnel</label>
                                <input
                                    type="email"
                                    required
                                    style={styles.input}
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="admin-inviksa@monsupport-app.com"
                                />
                            </div>
                            <div style={styles.inputGroup}>
                                <label>Mot de passe provisoire</label>
                                <input
                                    type="password"
                                    required
                                    style={styles.input}
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                    placeholder="••••••••"
                                    minLength="8"
                                />
                                <small style={styles.formHint}>
                                    L'admin pourra le changer ultérieurement.
                                </small>
                            </div>
                            <div style={styles.checkboxGroup}>
                                <div style={styles.checkboxWrapper}>
                                    <input
                                        type="checkbox"
                                        id="superAdmin"
                                        style={styles.checkbox}
                                        checked={formData.isSuperAdmin}
                                        onChange={e => setFormData({ ...formData, isSuperAdmin: e.target.checked })}
                                    />
                                    <label htmlFor="superAdmin" style={styles.checkboxLabel}>Accordez les privilèges de Super Admin</label>
                                </div>
                                <p style={styles.checkboxHint}>Le Super Admin peut gérer d'autres administrateurs.</p>
                            </div>

                            <div style={styles.modalActions}>
                                <button type="button" onClick={() => setShowModal(false)} style={styles.cancelBtn}>Annuler</button>
                                <button type="submit" style={styles.submitBtn}>Créer le compte</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageAdmins;
