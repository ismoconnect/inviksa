import React, { createContext, useContext, useState, useEffect } from 'react';
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    sendEmailVerification,
    updatePassword,
    sendPasswordResetEmail
} from 'firebase/auth';
import { auth, db } from '../firebase/config';
import { doc, getDoc, setDoc, updateDoc, onSnapshot, serverTimestamp, query, collection, where, getDocs, writeBatch } from 'firebase/firestore';
import { walletService } from '../services/walletService';
import { cardService } from '../services/cardService';
import { ribService } from '../services/ribService';
import { userService } from '../services/userService';
import emailService from '../services/emailService';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    const login = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    const register = async (email, password, profileData) => {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Create user document in Firestore
        await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            email: user.email,
            ...profileData,
            accountStatus: 'active',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });

        // Create separate KYC document
        await setDoc(doc(db, "kyc", user.uid), {
            userId: user.uid,
            status: 'pending',
            submittedAt: null,
            reviewedAt: null,
            documents: {},
            verificationLevel: 0,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });

        // Create initial wallets/accounts
        const wallets = await walletService.createInitialWallets(
            user.uid,
            user.email,
            profileData.displayName || (userType === 'personal' ? `${profileData.firstName} ${profileData.lastName}` : profileData.companyName),
            profileData.accountType || 'standard',
            profileData.mainCurrency || 'EUR'
        );

        // Find main wallet for card creation
        const mainWallet = wallets.find(w => w.type === 'main');
        if (mainWallet) {
            await cardService.createInitialCard(user.uid, mainWallet.id);
        }

        // Create RIBs for all wallets
        await ribService.createInitialRibs(user.uid, wallets);

        // Admin Notification
        try {
            await emailService.sendAdminRegistrationNotification({
                ...profileData,
                email: user.email,
                uid: user.uid
            });
        } catch (adminNotifError) {
            console.warn("Failed to notify admin of new registration:", adminNotifError);
        }

        // Send email verification
        await sendEmailVerification(user);

        return userCredential;
    };

    const logout = () => {
        return signOut(auth);
    };

    useEffect(() => {
        let unsubscribeUserDoc = null;

        const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user);

            if (unsubscribeUserDoc) {
                unsubscribeUserDoc();
                unsubscribeUserDoc = null;
            }

            if (user) {
                // Subscribe to user data in real-time
                unsubscribeUserDoc = onSnapshot(doc(db, "users", user.uid), (userDoc) => {
                    if (userDoc.exists()) {
                        const data = userDoc.data();
                        setUserData(data);
                    }
                });

                // Auto-repair wallets if needed (only once on login)
                const checkRepairs = async () => {
                    try {
                        const userDoc = await getDoc(doc(db, "users", user.uid));
                        if (!userDoc.exists()) return;
                        const data = userDoc.data();

                        const q = query(collection(db, "wallets"), where("userId", "==", user.uid));
                        const walletSnap = await getDocs(q);
                        const batch = writeBatch(db);
                        let needsUpdate = false;

                        walletSnap.forEach(wDoc => {
                            const wData = wDoc.data();
                            if (!wData.ownerEmail) {
                                batch.update(wDoc.ref, {
                                    ownerEmail: user.email,
                                    ownerName: data.displayName || `${data.firstName} ${data.lastName}`
                                });
                                needsUpdate = true;
                            }
                        });

                        if (needsUpdate) {
                            await batch.commit();
                            console.log("Wallets repaired with owner info");
                        }
                    } catch (err) {
                        console.warn("Failed to auto-repair wallets", err);
                    }
                };
                checkRepairs();
            } else {
                setUserData(null);
            }
            setLoading(false);
        });

        return () => {
            unsubscribeAuth();
            if (unsubscribeUserDoc) unsubscribeUserDoc();
        };
    }, []);

    const updateUserData = async (newProfileData) => {
        if (!currentUser) return;
        const userRef = doc(db, "users", currentUser.uid);
        await updateDoc(userRef, {
            ...newProfileData,
            updatedAt: serverTimestamp()
        });
        // Refresh local state
        setUserData(prev => ({ ...prev, ...newProfileData }));
    };

    const deleteAccount = async () => {
        if (!currentUser) return;
        const uid = currentUser.uid;

        // 1. Purge all Firestore data
        await userService.purgeFullUserData(uid);

        // 2. Logout (we don't delete from Auth directly as it requires re-auth/admin)
        await logout();
    };

    const checkEmailVerification = async () => {
        const user = auth.currentUser;
        if (!user) return;

        await user.reload();
        // Since reload() updates the existing object's properties, 
        // and setUserData will trigger a re-render, we just need to ensure
        // state points to the real Firebase User instance.
        setCurrentUser(user);

        // Also refresh Firestore user data
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
            const data = userDoc.data();
            setUserData(data);

            // Send welcome email if verified and not already sent
            if (user.emailVerified && !data.welcomeEmailSent) {
                try {
                    await emailService.sendWelcomeEmail(
                        user.email,
                        data.firstName || data.displayName || 'Client',
                        data.language || 'fr'
                    );

                    // Mark as sent in Firestore
                    await updateDoc(doc(db, "users", user.uid), {
                        welcomeEmailSent: true,
                        updatedAt: serverTimestamp()
                    });

                    // Update local state
                    setUserData(prev => ({ ...prev, welcomeEmailSent: true }));
                    console.log("Welcome email sent after verification");
                } catch (err) {
                    console.warn("Failed to send welcome email:", err);
                }
            }
        }
    };

    const changePassword = async (newPassword) => {
        const user = auth.currentUser;
        if (!user) return;
        await updatePassword(user, newPassword);
    };

    const resetPassword = (email) => {
        return sendPasswordResetEmail(auth, email);
    };

    const value = {
        user: currentUser,
        currentUser,
        userData,
        login,
        register,
        logout,
        updateUserData,
        deleteAccount,
        checkEmailVerification,
        changePassword,
        resetPassword,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
