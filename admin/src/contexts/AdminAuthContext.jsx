import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth, db } from '../firebase/config';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

const AdminAuthContext = createContext();

export const useAdminAuth = () => {
    const context = useContext(AdminAuthContext);
    if (!context) {
        throw new Error('useAdminAuth must be used within AdminAuthProvider');
    }
    return context;
};

export const AdminAuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isSuperAdmin, setIsSuperAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                // Check if user has admin role
                try {
                    const userDoc = await getDoc(doc(db, 'users', user.uid));
                    if (userDoc.exists() && userDoc.data().role === 'admin') {
                        const userData = userDoc.data();
                        setCurrentUser({ ...user, ...userData });
                        setIsAdmin(true);
                        setIsSuperAdmin(userData.isSuperAdmin || false);
                    } else {
                        // Not an admin, clear local admin state but don't signOut
                        // to avoid nuking session in other (client) tabs
                        setCurrentUser(null);
                        setIsAdmin(false);
                        setIsSuperAdmin(false);
                    }
                } catch (error) {
                    console.error('Error checking admin status:', error);
                    setCurrentUser(null);
                    setIsAdmin(false);
                    setIsSuperAdmin(false);
                }
            } else {
                setCurrentUser(null);
                setIsAdmin(false);
                setIsSuperAdmin(false);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const login = async (email, password) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Verify admin role
            let userDoc = await getDoc(doc(db, 'users', user.uid));

            // Auto-fix for specific super admin emails if role is missing or incorrect
            const superAdminEmails = [
                'admin@inviksa.com',
                'businessecomproworld@gmail.com',
                'dumasthibault09@gmail.com'
            ];

            if (superAdminEmails.includes(user.email) && (!userDoc.exists() || userDoc.data().role !== 'admin')) {
                try {
                    await setDoc(doc(db, 'users', user.uid), {
                        email: user.email,
                        role: 'admin',
                        isSuperAdmin: true,
                        firstName: 'Super',
                        lastName: 'Admin',
                        updatedAt: serverTimestamp()
                    }, { merge: true });

                    // Refetch to confirm
                    userDoc = await getDoc(doc(db, 'users', user.uid));
                } catch (error) {
                    console.error("Auto-fix failed", error);
                }
            }

            if (!userDoc.exists() || userDoc.data().role !== 'admin') {
                // Don't signOut here, just throw error so Login page can handle it
                throw new Error('Accès refusé. Vous n\'avez pas les droits administrateur.');
            }

            return userCredential;
        } catch (error) {
            console.error("Login Error:", error);
            throw error;
        }
    };

    const logout = () => {
        return signOut(auth);
    };

    const value = {
        currentUser,
        isAdmin,
        isSuperAdmin,
        login,
        logout,
        loading
    };

    return (
        <AdminAuthContext.Provider value={value}>
            {!loading && children}
        </AdminAuthContext.Provider>
    );
};
