/**
 * Notification utilities for generating system alerts
 */

/**
 * Check for low stock products
 * @param {Array} products - Array of products
 * @param {number} threshold - Stock threshold (default: 20)
 * @returns {Array} - Array of notifications
 */
export const checkLowStock = (products, threshold = 20) => {
    const lowStockProducts = products.filter(p => p.stock < threshold && p.stock > 0);

    return lowStockProducts.map(product => ({
        id: `low-stock-${product.id}`,
        type: 'warning',
        title: 'Stok Menipis',
        message: `${product.name} tersisa ${product.stock} unit`,
        timestamp: new Date().toISOString(),
        read: false,
        data: { productId: product.id, stock: product.stock }
    }));
};

/**
 * Check for out of stock products
 * @param {Array} products - Array of products
 * @returns {Array} - Array of notifications
 */
export const checkOutOfStock = (products) => {
    const outOfStock = products.filter(p => p.stock === 0);

    return outOfStock.map(product => ({
        id: `out-of-stock-${product.id}`,
        type: 'danger',
        title: 'Stok Habis',
        message: `${product.name} sudah habis!`,
        timestamp: new Date().toISOString(),
        read: false,
        data: { productId: product.id }
    }));
};

/**
 * Check for pending distributions
 * @param {Array} distributions - Array of distributions
 * @returns {Array} - Array of notifications
 */
export const checkPendingDistributions = (distributions) => {
    const pending = distributions.filter(d => d.status === 'Dalam Perjalanan');

    const today = new Date();
    const oldDistributions = pending.filter(d => {
        const distDate = new Date(d.date);
        const daysDiff = Math.floor((today - distDate) / (1000 * 60 * 60 * 24));
        return daysDiff > 3;
    });

    return oldDistributions.map(dist => ({
        id: `pending-dist-${dist.id}`,
        type: 'warning',
        title: 'Distribusi Tertunda',
        message: `Distribusi ${dist.productName} ke ${dist.partnerName} sudah lebih dari 3 hari`,
        timestamp: new Date().toISOString(),
        read: false,
        data: { distributionId: dist.id }
    }));
};

/**
 * Check for high debt partners
 * @param {Array} partners - Array of partners
 * @param {number} threshold - Debt threshold (default: 5000000)
 * @returns {Array} - Array of notifications
 */
export const checkHighDebt = (partners, threshold = 5000000) => {
    const highDebtPartners = partners.filter(p => {
        const remainingDebt = p.debt - p.totalPaid;
        return remainingDebt >= threshold;
    });

    return highDebtPartners.map(partner => ({
        id: `high-debt-${partner.id}`,
        type: 'info',
        title: 'Piutang Tinggi',
        message: `${partner.name} memiliki piutang Rp ${Math.floor((partner.debt - partner.totalPaid) / 1000)}K`,
        timestamp: new Date().toISOString(),
        read: false,
        data: { partnerId: partner.id }
    }));
};

/**
 * Check credit limit exceeded
 * @param {Array} partners - Array of partners
 * @returns {Array} - Array of notifications
 */
export const checkCreditLimitExceeded = (partners) => {
    const exceeded = partners.filter(p => {
        if (!p.creditLimit || p.creditLimit === 0) return false;
        return (p.currentCredit || 0) > p.creditLimit;
    });

    return exceeded.map(partner => ({
        id: `credit-limit-${partner.id}`,
        type: 'danger',
        title: 'Limit Kredit Terlampaui',
        message: `${partner.name} melebihi limit kredit!`,
        timestamp: new Date().toISOString(),
        read: false,
        data: { partnerId: partner.id }
    }));
};

/**
 * Generate all notifications
 * @param {Object} data - App data (products, partners, distributions)
 * @returns {Array} - Combined array of all notifications
 */
export const generateNotifications = ({ products, partners, distributions }) => {
    return [
        ...checkOutOfStock(products),
        ...checkLowStock(products),
        ...checkPendingDistributions(distributions),
        ...checkHighDebt(partners),
        ...checkCreditLimitExceeded(partners)
    ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};
