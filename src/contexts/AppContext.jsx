import React, { createContext, useContext, useState, useEffect } from 'react';
import { saveToStorage, loadFromStorage, STORAGE_KEYS } from '../utils/storage';
import { generateId, getCurrentDate } from '../utils/formatters';

const AppContext = createContext();

// Initial data
const INITIAL_PRODUCTS = [
    { id: 'p1', name: 'Kopi Arabika 250g', category: 'Minuman', price: 45000, stock: 150 },
    { id: 'p2', name: 'Teh Hijau Organik', category: 'Minuman', price: 35000, stock: 15 },
    { id: 'p3', name: 'Cokelat Bubuk Premium', category: 'Makanan', price: 60000, stock: 85 },
    { id: 'p4', name: 'Gula Aren Cair', category: 'Bahan Baku', price: 25000, stock: 10 },
];

const INITIAL_PARTNERS = [
    { id: 'm1', name: 'Toko Berkah Utama', owner: 'Budi Santoso', address: 'Jl. Melati No. 5', phone: '08123456789', type: 'Konsinyasi', debt: 500000, totalPaid: 0, inventory: {} },
    { id: 'm2', name: 'Mini Market Sejahtera', owner: 'Siti Aminah', address: 'Ruko Hijau Kav 3', phone: '08987654321', type: 'Konsinyasi', debt: 0, totalPaid: 0, inventory: {} },
];

export const AppProvider = ({ children }) => {
    // Auth State
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);

    // Business Data State
    const [products, setProducts] = useState(() => loadFromStorage(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS));
    const [partners, setPartners] = useState(() => loadFromStorage(STORAGE_KEYS.PARTNERS, INITIAL_PARTNERS));
    const [distributions, setDistributions] = useState(() => loadFromStorage(STORAGE_KEYS.DISTRIBUTIONS, []));
    const [sales, setSales] = useState(() => loadFromStorage(STORAGE_KEYS.SALES, []));
    const [returns, setReturns] = useState(() => loadFromStorage(STORAGE_KEYS.RETURNS, []));
    const [payments, setPayments] = useState(() => loadFromStorage(STORAGE_KEYS.PAYMENTS, []));

    // Persist to localStorage whenever state changes
    useEffect(() => {
        saveToStorage(STORAGE_KEYS.PRODUCTS, products);
    }, [products]);

    useEffect(() => {
        saveToStorage(STORAGE_KEYS.PARTNERS, partners);
    }, [partners]);

    useEffect(() => {
        saveToStorage(STORAGE_KEYS.DISTRIBUTIONS, distributions);
    }, [distributions]);

    useEffect(() => {
        saveToStorage(STORAGE_KEYS.SALES, sales);
    }, [sales]);

    useEffect(() => {
        saveToStorage(STORAGE_KEYS.RETURNS, returns);
    }, [returns]);

    useEffect(() => {
        saveToStorage(STORAGE_KEYS.PAYMENTS, payments);
    }, [payments]);

    // Auth Actions
    const login = (username) => {
        if (username === 'admin' || username === 'staf') {
            setUser(username);
            setIsLoggedIn(true);
            saveToStorage(STORAGE_KEYS.USER, username);
            return true;
        }
        return false;
    };

    const logout = () => {
        setUser(null);
        setIsLoggedIn(false);
        saveToStorage(STORAGE_KEYS.USER, null);
    };

    // Product Actions
    const addProduct = (productData) => {
        const newProduct = {
            id: generateId('p'),
            ...productData,
            stock: parseInt(productData.stock)
        };
        setProducts([...products, newProduct]);
        return newProduct;
    };

    const updateProduct = (id, updates) => {
        setProducts(products.map(p => p.id === id ? { ...p, ...updates } : p));
    };

    const deleteProduct = (id) => {
        setProducts(products.filter(p => p.id !== id));
    };

    // Partner Actions
    const addPartner = (partnerData) => {
        const newPartner = {
            id: generateId('m'),
            ...partnerData,
            type: 'Konsinyasi',
            debt: 0,
            totalPaid: 0,
            inventory: {}
        };
        setPartners([...partners, newPartner]);
        return newPartner;
    };

    const updatePartner = (id, updates) => {
        setPartners(partners.map(p => p.id === id ? { ...p, ...updates } : p));
    };

    const deletePartner = (id) => {
        setPartners(partners.filter(p => p.id !== id));
    };

    const recordPayment = (partnerId, amount) => {
        setPartners(partners.map(p =>
            p.id === partnerId ? { ...p, totalPaid: p.totalPaid + amount } : p
        ));

        const partner = partners.find(p => p.id === partnerId);
        const payment = {
            id: generateId('PAY'),
            date: getCurrentDate(),
            partnerName: partner.name,
            amount: amount
        };
        setPayments([payment, ...payments]);
        return payment;
    };

    // Distribution Actions
    const createDistribution = (distributionData) => {
        const product = products.find(p => p.id === distributionData.productId);

        if (product.stock < distributionData.qty) {
            throw new Error('Stok gudang tidak mencukupi!');
        }

        // Reduce warehouse stock
        setProducts(products.map(p =>
            p.id === distributionData.productId
                ? { ...p, stock: p.stock - distributionData.qty }
                : p
        ));

        // Add to partner debt
        const totalValue = product.price * distributionData.qty;
        setPartners(partners.map(p =>
            p.id === distributionData.partnerId
                ? { ...p, debt: p.debt + totalValue }
                : p
        ));

        const newDistribution = {
            id: generateId('DST'),
            ...distributionData,
            productName: product.name,
            date: getCurrentDate(),
            status: 'Dalam Perjalanan'
        };

        setDistributions([newDistribution, ...distributions]);
        return newDistribution;
    };

    const markAsDelivered = (distId) => {
        const dist = distributions.find(d => d.id === distId);

        // Update distribution status
        setDistributions(distributions.map(d =>
            d.id === distId ? { ...d, status: 'Selesai' } : d
        ));

        // Add to partner inventory
        setPartners(partners.map(p => {
            if (p.id === dist.partnerId) {
                const newInv = { ...p.inventory };
                newInv[dist.productId] = (newInv[dist.productId] || 0) + dist.qty;
                return { ...p, inventory: newInv };
            }
            return p;
        }));
    };

    // Sales Actions
    const createSale = (saleData) => {
        const product = products.find(p => p.id === saleData.productId);
        const saleTotal = saleData.price * saleData.qty;

        if (saleData.isDirect) {
            // Direct sale from warehouse
            if (product.stock < saleData.qty) {
                throw new Error('Stok gudang tidak cukup');
            }
            setProducts(products.map(p =>
                p.id === saleData.productId
                    ? { ...p, stock: p.stock - saleData.qty }
                    : p
            ));
        } else {
            // Sale from partner
            const partner = partners.find(p => p.id === saleData.partnerId);
            if ((partner.inventory[saleData.productId] || 0) < saleData.qty) {
                throw new Error('Stok di mitra tidak cukup');
            }

            setPartners(partners.map(p => {
                if (p.id === saleData.partnerId) {
                    const newInv = { ...p.inventory };
                    newInv[saleData.productId] -= saleData.qty;
                    return {
                        ...p,
                        inventory: newInv,
                        debt: p.debt - saleTotal
                    };
                }
                return p;
            }));
        }

        const newSale = {
            id: generateId('SLS'),
            ...saleData,
            productName: product.name,
            partnerName: saleData.isDirect ? 'Gudang Pusat' : partners.find(p => p.id === saleData.partnerId).name,
            total: saleTotal,
            date: getCurrentDate()
        };

        setSales([newSale, ...sales]);
        return newSale;
    };

    // Return Actions
    const createReturn = (partnerId, productId, qty, reason) => {
        const product = products.find(p => p.id === productId);
        const partner = partners.find(p => p.id === partnerId);

        // Return stock to warehouse
        setProducts(products.map(p =>
            p.id === productId
                ? { ...p, stock: p.stock + qty }
                : p
        ));

        // Reduce from partner inventory and debt
        setPartners(partners.map(p => {
            if (p.id === partnerId) {
                const newInv = { ...p.inventory };
                newInv[productId] = (newInv[productId] || 0) - qty;
                return {
                    ...p,
                    inventory: newInv,
                    debt: p.debt - (product.price * qty)
                };
            }
            return p;
        }));

        const newReturn = {
            id: generateId('RET'),
            date: getCurrentDate(),
            partnerName: partner.name,
            productName: product.name,
            qty: qty,
            reason: reason
        };

        setReturns([newReturn, ...returns]);
        return newReturn;
    };

    const value = {
        // Auth
        isLoggedIn,
        user,
        login,
        logout,

        // Products
        products,
        addProduct,
        updateProduct,
        deleteProduct,

        // Partners
        partners,
        addPartner,
        updatePartner,
        deletePartner,
        recordPayment,

        // Distributions
        distributions,
        createDistribution,
        markAsDelivered,

        // Sales
        sales,
        createSale,

        // Returns
        returns,
        createReturn,

        // Payments
        payments
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within AppProvider');
    }
    return context;
};
