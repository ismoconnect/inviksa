import React, { useState, useEffect } from 'react';
import { Navigate, useParams, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useTranslation } from 'react-i18next';

const ProtectedRoute = ({ children }) => {
    const { currentUser, loading } = useAuth();
    const { lang } = useParams();
    const location = useLocation();
    const { i18n } = useTranslation();
    const [isAdmin, setIsAdmin] = useState(false);
    const [checkingRole, setCheckingRole] = useState(true);

    const currentLang = lang || i18n.language || 'fr';

    useEffect(() => {
        const checkUserRole = async () => {
            if (currentUser) {
                try {
                    const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
                    if (userDoc.exists() && userDoc.data().role === 'admin') {
                        setIsAdmin(true);
                    }
                } catch (error) {
                    console.error("Error checking user role:", error);
                }
            }
            setCheckingRole(false);
        };

        if (!loading) {
            checkUserRole();
        }
    }, [currentUser, loading]);

    if (loading || checkingRole) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                backgroundColor: '#f8f9fa'
            }}>
                <div className="loader">Chargement...</div>
            </div>
        );
    }

    if (!currentUser) {
        return <Navigate to={`/${currentLang}/login`} state={{ from: location }} replace />;
    }

    // Skip email verification check for admin users
    if (!isAdmin && !currentUser.emailVerified) {
        return <Navigate to={`/${currentLang}/email-verification-pending`} state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRoute;
