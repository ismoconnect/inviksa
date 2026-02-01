import { db } from '../firebase/config';
import {
    collection,
    query,
    where,
    onSnapshot,
    orderBy,
    addDoc,
    serverTimestamp,
    updateDoc,
    doc
} from 'firebase/firestore';

export const invoiceService = {
    // Subscribe to invoices for a specific user
    subscribeToInvoices: (userId, callback) => {
        const q = query(
            collection(db, 'invoices'),
            where('userId', '==', userId),
            orderBy('createdAt', 'desc')
        );

        return onSnapshot(q, (snapshot) => {
            const invoices = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            callback(invoices);
        }, (error) => {
            console.error("Error subscribing to invoices:", error);
        });
    },

    // Create a new invoice (admin use)
    createInvoice: async (invoiceData) => {
        try {
            const docRef = await addDoc(collection(db, 'invoices'), {
                ...invoiceData,
                createdAt: serverTimestamp(),
                status: 'pending'
            });
            return docRef.id;
        } catch (error) {
            console.error("Error creating invoice:", error);
            throw error;
        }
    },

    // Update invoice status (admin use)
    updateInvoiceStatus: async (invoiceId, status) => {
        try {
            const docRef = doc(db, 'invoices', invoiceId);
            await updateDoc(docRef, {
                status,
                updatedAt: serverTimestamp()
            });
        } catch (error) {
            console.error("Error updating invoice status:", error);
            throw error;
        }
    }
};
