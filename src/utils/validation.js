import { formatIDR } from './formatters';

/**
 * Validation utilities for form inputs and business logic
 */

/**
 * Validate stock availability
 * @param {number} requestedQty - Requested quantity
 * @param {number} availableStock - Available stock
 * @throws {Error} If validation fails
 */
export const validateStock = (requestedQty, availableStock) => {
    if (requestedQty <= 0) {
        throw new Error('Kuantitas harus lebih dari 0');
    }

    if (requestedQty > availableStock) {
        throw new Error(`Stok tidak cukup! Tersedia: ${availableStock}, Diminta: ${requestedQty}`);
    }

    return true;
};

/**
 * Validate payment amount
 * @param {number} amount - Payment amount
 * @param {number} maxAmount - Maximum allowed payment
 * @throws {Error} If validation fails
 */
export const validatePayment = (amount, maxAmount) => {
    if (amount <= 0) {
        throw new Error('Jumlah pembayaran harus lebih dari 0');
    }

    if (amount > maxAmount) {
        throw new Error(`Pembayaran melebihi piutang! Maksimal: ${formatIDR(maxAmount)}`);
    }

    return true;
};

/**
 * Validate credit limit
 * @param {number} newCredit - New credit to add
 * @param {number} currentCredit - Current credit used
 * @param {number} creditLimit - Credit limit
 * @throws {Error} If validation fails
 */
export const validateCreditLimit = (newCredit, currentCredit, creditLimit) => {
    if (creditLimit === 0) return true; // No limit set

    const totalCredit = currentCredit + newCredit;

    if (totalCredit > creditLimit) {
        throw new Error(
            `Melebihi limit kredit! Limit: ${formatIDR(creditLimit)}, ` +
            `Digunakan: ${formatIDR(currentCredit)}, ` +
            `Tambahan: ${formatIDR(newCredit)}`
        );
    }

    return true;
};

/**
 * Validate price/amount is positive
 * @param {number} amount - Amount to validate
 * @param {string} fieldName - Field name for error message
 * @throws {Error} If validation fails
 */
export const validatePositiveAmount = (amount, fieldName = 'Jumlah') => {
    if (amount <= 0) {
        throw new Error(`${fieldName} harus lebih dari 0`);
    }

    return true;
};

/**
 * Validate required fields
 * @param {Object} data - Form data
 * @param {Array<string>} requiredFields - Array of required field names
 * @throws {Error} If validation fails
 */
export const validateRequiredFields = (data, requiredFields) => {
    const missingFields = requiredFields.filter(field => {
        const value = data[field];
        return value === null || value === undefined || value === '';
    });

    if (missingFields.length > 0) {
        throw new Error(`Field wajib diisi: ${missingFields.join(', ')}`);
    }

    return true;
};

/**
 * Show confirmation dialog
 * @param {string} message - Confirmation message
 * @param {string} itemName - Item name being deleted/modified
 * @returns {boolean}
 */
export const confirmAction = (message, itemName = '') => {
    const fullMessage = itemName
        ? `${message} "${itemName}"?\n\nAksi ini tidak dapat dibatalkan.`
        : `${message}\n\nAksi ini tidak dapat dibatalkan.`;

    return window.confirm(fullMessage);
};

/**
 * Validate discount percentage
 * @param {number} discount - Discount percentage
 * @throws {Error} If validation fails
 */
export const validateDiscount = (discount) => {
    if (discount < 0 || discount > 100) {
        throw new Error('Diskon harus antara 0-100%');
    }

    return true;
};

/**
 * Calculate price with discount
 * @param {number} price - Original price
 * @param {number} discount - Discount percentage (0-100)
 * @returns {number} - Price after discount
 */
export const calculateDiscountedPrice = (price, discount = 0) => {
    if (discount === 0) return price;

    validateDiscount(discount);
    return Math.round(price * (100 - discount) / 100);
};
