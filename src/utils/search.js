/**
 * Search utilities for filtering data
 */

/**
 * Search in object - checks if query matches any field value
 * @param {Object} obj - Object to search in
 * @param {string} query - Search query
 * @returns {boolean}
 */
export const searchInObject = (obj, query) => {
    if (!query || query.trim() === '') return true;

    const searchTerm = query.toLowerCase();

    return Object.values(obj).some(value => {
        if (value === null || value === undefined) return false;

        // Handle nested objects
        if (typeof value === 'object') {
            return searchInObject(value, query);
        }

        // Convert to string and search
        return String(value).toLowerCase().includes(searchTerm);
    });
};

/**
 * Filter items by date range
 * @param {Array} items - Array of items with date field
 * @param {string} dateField - Field name containing date
 * @param {string|null} startDate - Start date (YYYY-MM-DD)
 * @param {string|null} endDate - End date (YYYY-MM-DD)
 * @returns {Array}
 */
export const filterByDateRange = (items, dateField, startDate, endDate) => {
    if (!startDate && !endDate) return items;

    return items.filter(item => {
        const itemDate = new Date(item[dateField]);

        if (startDate && itemDate < new Date(startDate)) return false;
        if (endDate && itemDate > new Date(endDate)) return false;

        return true;
    });
};

/**
 * Filter items by status
 * @param {Array} items - Array of items
 * @param {string} status - Status to filter by
 * @returns {Array}
 */
export const filterByStatus = (items, status) => {
    if (!status || status === 'all') return items;

    return items.filter(item => item.status === status);
};

/**
 * Filter items by category
 * @param {Array} items - Array of items
 * @param {string} category - Category to filter by
 * @returns {Array}
 */
export const filterByCategory = (items, category) => {
    if (!category || category === 'all') return items;

    return items.filter(item => item.category === category);
};

/**
 * Sort items by field
 * @param {Array} items - Array of items
 * @param {string} field - Field to sort by
 * @param {string} order - 'asc' or 'desc'
 * @returns {Array}
 */
export const sortBy = (items, field, order = 'asc') => {
    return [...items].sort((a, b) => {
        const aVal = a[field];
        const bVal = b[field];

        if (aVal < bVal) return order === 'asc' ? -1 : 1;
        if (aVal > bVal) return order === 'asc' ? 1 : -1;
        return 0;
    });
};
