import { formatIDR, formatDateShort } from './formatters';

export const formatInvoiceMessage = (sale, settings) => {
    const defaultTemplate = `*INVOICE: {companyName}*\n--------------------------------\n📅 Tanggal: {date}\n👤 Pembeli: {buyerName}\n📦 Produk: {productName}\n🔢 Qty: {qty}\n💰 Harga: {price}\n--------------------------------\n*TOTAL: {total}*\n--------------------------------\nTerima kasih telah berbelanja! 🙏`;

    const template = settings?.waInvoiceTemplate || defaultTemplate;
    const companyName = settings?.companyName || 'ERP Distribusi';
    const date = formatDateShort(sale.saleDate);

    let message = template
        .replace('{companyName}', companyName)
        .replace('{date}', date)
        .replace('{buyerName}', sale.buyerName)
        .replace('{productName}', sale.productName)
        .replace('{qty}', sale.qty)
        .replace('{price}', formatIDR(sale.price))
        .replace('{total}', formatIDR(sale.total));

    return encodeURIComponent(message);
};

export const formatDistributionMessage = (dist, partner, product, settings) => {
    const defaultTemplate = `*SURAT JALAN: {companyName}*\n--------------------------------\n📅 Tanggal: {date}\n🚚 Tujuan: {partnerName}\n📦 Barang: {productName}\n🔢 Jumlah Kirim: {qty}\nℹ️ Status: {status}\n--------------------------------\nMohon konfirmasi jika barang sudah diterima via link ini. Terima kasih! 🙏`;

    const template = settings?.waDistributionTemplate || defaultTemplate;
    const companyName = settings?.companyName || 'ERP Distribusi';
    const date = formatDateShort(dist.date);

    let message = template
        .replace('{companyName}', companyName)
        .replace('{date}', date)
        .replace('{partnerName}', partner?.name || '-')
        .replace('{productName}', product?.name || '-')
        .replace('{qty}', dist.qty) // Note: using qty instead of amount based on dist object structure
        .replace('{status}', dist.status);

    return encodeURIComponent(message);
};

export const openWhatsApp = (phone, message) => {
    // If phone starts with 0, replace with 62. If not, assume it's correct or let WA handle it.
    // For now, since we don't store phone numbers in this MVP, we'll just open WA api without phone
    // which prompts user to select contact.

    const url = `https://wa.me/?text=${message}`;
    window.open(url, '_blank');
};
