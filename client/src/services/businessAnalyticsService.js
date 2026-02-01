/**
 * Business Analytics Service
 * Provides analytics and calculations for professional accounts
 */

/**
 * Calculate monthly revenue from transactions
 * @param {Array} transactions - All transactions
 * @returns {Array} Monthly revenue data for last 6 months
 */
export const calculateMonthlyRevenue = (transactions) => {
    const now = new Date();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    // Filter incoming transactions (deposits, received transfers)
    const incomingTransactions = transactions.filter(tx =>
        tx.type === 'deposit' ||
        tx.type === 'credit' ||
        tx.type === 'receive_instant' ||
        tx.method === 'admin'
    );

    // Group by month
    const monthlyData = {};
    incomingTransactions.forEach(tx => {
        if (!tx.createdAt) return;

        const date = tx.createdAt.toDate();
        if (date < sixMonthsAgo) return;

        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

        if (!monthlyData[monthKey]) {
            monthlyData[monthKey] = {
                month: monthKey,
                revenue: 0,
                count: 0
            };
        }

        monthlyData[monthKey].revenue += tx.amount || 0;
        monthlyData[monthKey].count += 1;
    });

    // Convert to array and sort
    return Object.values(monthlyData).sort((a, b) => a.month.localeCompare(b.month));
};

/**
 * Categorize expenses based on transaction data
 * @param {Array} transactions - All transactions
 * @returns {Array} Categorized expenses
 */
export const categorizeExpenses = (transactions) => {
    // Filter outgoing transactions
    const outgoingTransactions = transactions.filter(tx =>
        tx.type === 'transfer_instant' ||
        tx.type === 'transfer_external' ||
        tx.type === 'transfer_internal'
    );

    const categories = {
        transfers: { name: 'Virements', total: 0, count: 0, color: '#3498db' },
        suppliers: { name: 'Fournisseurs', total: 0, count: 0, color: '#e74c3c' },
        salaries: { name: 'Salaires', total: 0, count: 0, color: '#2ecc71' },
        taxes: { name: 'Taxes & Impôts', total: 0, count: 0, color: '#f39c12' },
        other: { name: 'Autres', total: 0, count: 0, color: '#95a5a6' }
    };

    outgoingTransactions.forEach(tx => {
        const beneficiary = (tx.beneficiaryName || '').toLowerCase();
        const amount = tx.amount || 0;

        // Simple categorization based on beneficiary name
        if (beneficiary.includes('urssaf') || beneficiary.includes('impôt') || beneficiary.includes('tax')) {
            categories.taxes.total += amount;
            categories.taxes.count += 1;
        } else if (beneficiary.includes('salaire') || beneficiary.includes('salary')) {
            categories.salaries.total += amount;
            categories.salaries.count += 1;
        } else if (beneficiary.includes('fournisseur') || beneficiary.includes('supplier')) {
            categories.suppliers.total += amount;
            categories.suppliers.count += 1;
        } else {
            categories.transfers.total += amount;
            categories.transfers.count += 1;
        }
    });

    return Object.values(categories).filter(cat => cat.total > 0);
};

/**
 * Calculate VAT summary
 * @param {Array} transactions - All transactions
 * @param {number} vatRate - VAT rate (default 20%)
 * @returns {Object} VAT collected and deductible
 */
export const calculateVAT = (transactions, vatRate = 0.20) => {
    const incoming = transactions.filter(tx =>
        tx.type === 'deposit' ||
        tx.type === 'credit' ||
        tx.type === 'receive_instant'
    );

    const outgoing = transactions.filter(tx =>
        tx.type === 'transfer_instant' ||
        tx.type === 'transfer_external'
    );

    const totalRevenue = incoming.reduce((sum, tx) => sum + (tx.amount || 0), 0);
    const totalExpenses = outgoing.reduce((sum, tx) => sum + (tx.amount || 0), 0);

    return {
        collected: totalRevenue * vatRate,
        deductible: totalExpenses * vatRate,
        net: (totalRevenue * vatRate) - (totalExpenses * vatRate)
    };
};

/**
 * Get recent clients from transactions
 * @param {Array} transactions - All transactions
 * @param {number} limit - Number of clients to return
 * @returns {Array} Recent clients
 */
export const getRecentClients = (transactions, limit = 5) => {
    const incoming = transactions.filter(tx =>
        (tx.type === 'receive_instant' || tx.type === 'deposit') &&
        tx.senderName
    );

    // Group by sender
    const clients = {};
    incoming.forEach(tx => {
        const name = tx.senderName;
        if (!clients[name]) {
            clients[name] = {
                name,
                totalAmount: 0,
                transactionCount: 0,
                lastTransaction: tx.createdAt
            };
        }
        clients[name].totalAmount += tx.amount || 0;
        clients[name].transactionCount += 1;

        if (tx.createdAt && tx.createdAt.toDate() > clients[name].lastTransaction.toDate()) {
            clients[name].lastTransaction = tx.createdAt;
        }
    });

    return Object.values(clients)
        .sort((a, b) => b.lastTransaction.toDate() - a.lastTransaction.toDate())
        .slice(0, limit);
};

const businessAnalyticsService = {
    calculateMonthlyRevenue,
    categorizeExpenses,
    calculateVAT,
    getRecentClients
};

export default businessAnalyticsService;
