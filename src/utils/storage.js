// LocalStorage utility functions for data persistence
// Siap untuk migrate ke Supabase nanti

const STORAGE_KEYS = {
    PRODUCTS: 'erp_products',
    PARTNERS: 'erp_partners',
    DISTRIBUTIONS: 'erp_distributions',
    SALES: 'erp_sales',
    RETURNS: 'erp_returns',
    PAYMENTS: 'erp_payments',
    EXPENSES: 'erp_expenses',
    NOTIFICATIONS: 'erp_notifications',
    CASHFLOW: 'erp_cashflow',
    USER: 'erp_user'
};

/**
 * Save data to localStorage
 * @param {string} key - Storage key
 * @param {any} data - Data to save
 */
export const saveToStorage = (key, data) => {
    try {
        const serialized = JSON.stringify(data);
        localStorage.setItem(key, serialized);
        return true;
    } catch (error) {
        console.error('Error saving to localStorage:', error);
        return false;
    }
};

/**
 * Load data from localStorage
 * @param {string} key - Storage key
 * @param {any} defaultValue - Default value if key doesn't exist
 * @returns {any} Loaded data or default value
 */
export const loadFromStorage = (key, defaultValue = null) => {
    try {
        const serialized = localStorage.getItem(key);
        if (serialized === null) {
            return defaultValue;
        }
        return JSON.parse(serialized);
    } catch (error) {
        console.error('Error loading from localStorage:', error);
        return defaultValue;
    }
};

/**
 * Remove data from localStorage
 * @param {string} key - Storage key
 */
export const removeFromStorage = (key) => {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (error) {
        console.error('Error removing from localStorage:', error);
        return false;
    }
};

/**
 * Clear all ERP data from localStorage
 */
export const clearAllStorage = () => {
    try {
        Object.values(STORAGE_KEYS).forEach(key => {
            localStorage.removeItem(key);
        });
        return true;
    } catch (error) {
        console.error('Error clearing localStorage:', error);
        return false;
    }
};

export { STORAGE_KEYS };
