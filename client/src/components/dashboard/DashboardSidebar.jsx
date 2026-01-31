import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supportService } from '../../services/supportService';
import { useTranslation } from 'react-i18next';

const DashboardSidebar = ({ isOpen, toggleSidebar }) => {
    const { logout, userData, currentUser } = useAuth();
    const [unreadSupport, setUnreadSupport] = useState(0);
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const isMobile = window.innerWidth < 768;

    useEffect(() => {
        if (!currentUser) return;
        const unsubscribe = supportService.subscribeToUnreadCount(currentUser.uid, (count) => {
            setUnreadSupport(count);
        });
        return () => unsubscribe();
    }, [currentUser]);

    const handleLogout = async () => {
        try {
            await logout();
            navigate(`/${i18n.language}/login`);
        } catch (error) {
            console.error("Erreur déconnexion:", error);
        }
    };

    const menuItems = [
        { name: t('sidebar.nav.dashboard'), path: `/${i18n.language}/dashboard`, icon: 'fas fa-th-large' },
        { name: t('sidebar.nav.accounts'), path: `/${i18n.language}/dashboard/accounts`, icon: 'fas fa-wallet' },
        { name: t('sidebar.nav.transfers'), path: `/${i18n.language}/dashboard/transfers`, icon: 'fas fa-exchange-alt' },
        { name: t('sidebar.nav.beneficiaries'), path: `/${i18n.language}/dashboard/beneficiaries`, icon: 'fas fa-users' },
        { name: t('sidebar.nav.deposit'), path: `/${i18n.language}/dashboard/deposit`, icon: 'fas fa-plus-circle' },
        { name: t('sidebar.nav.cards'), path: `/${i18n.language}/dashboard/cards`, icon: 'fas fa-credit-card' },
        { name: t('sidebar.nav.credits'), path: `/${i18n.language}/dashboard/credits`, icon: 'fas fa-hand-holding-usd' },
        { name: t('sidebar.nav.history'), path: `/${i18n.language}/dashboard/history`, icon: 'fas fa-history' },
        { name: t('sidebar.nav.documents'), path: `/${i18n.language}/dashboard/documents`, icon: 'fas fa-file-invoice' },
        { name: t('sidebar.nav.support'), path: `/${i18n.language}/dashboard/support`, icon: 'fas fa-headset', badge: unreadSupport },
        { name: t('sidebar.nav.settings'), path: `/${i18n.language}/dashboard/settings`, icon: 'fas fa-cog' },
    ];

    return (
        <aside className={`dashboard-sidebar ${isOpen ? 'open' : ''}`}>
            <div className="sidebar-header">
                <div className="logo-container">
                    <img src="/logo-white-transparent.png" alt="INVIK SA" className="sidebar-logo" />
                </div>
                <button className="sidebar-close md-only" onClick={toggleSidebar}>
                    <i className="fas fa-times"></i>
                </button>
            </div>

            <div className="sidebar-user">
                <div className="user-avatar">
                    {userData?.firstName?.charAt(0) || 'U'}
                </div>
                <div className="user-info">
                    <span className="user-name">{userData?.firstName} {userData?.lastName}</span>
                    <span className="user-status">{t('sidebar.user.account_type', { type: userData?.accountType || 'Standard' })}</span>
                </div>
            </div>

            <nav className="sidebar-nav">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.path === `/${i18n.language}/dashboard`}
                        className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}
                        onClick={() => window.innerWidth < 768 && toggleSidebar()}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <i className={item.icon}></i>
                            <span>{item.name}</span>
                        </div>
                        {item.badge > 0 && (
                            <span style={{
                                background: '#e11d48',
                                color: 'white',
                                fontSize: '0.7rem',
                                fontWeight: 'bold',
                                padding: '2px 8px',
                                borderRadius: '10px',
                                minWidth: '18px',
                                height: '18px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                            }}>
                                {item.badge}
                            </span>
                        )}
                    </NavLink>
                ))}
            </nav>

            <div className="sidebar-footer">
                <button onClick={handleLogout} className="sidebar-logout">
                    <i className="fas fa-sign-out-alt"></i>
                    <span>{t('sidebar.logout')}</span>
                </button>
            </div>
        </aside>
    );
};

export default DashboardSidebar;
