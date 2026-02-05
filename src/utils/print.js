import { formatIDR, formatDateShort } from './formatters';

/**
 * Print distribution invoice / surat jalan
 * @param {Object} distribution - Distribution object
 * @param {Object} partner - Partner object
 * @param {Object} product - Product object
 */
export const printDistributionInvoice = (distribution, partner, product) => {
  const printWindow = window.open('', '_blank');

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Surat Jalan ${distribution.id}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
          
          body {
            font-family: 'Inter', sans-serif;
            padding: 60px 40px;
            color: #1e293b;
            line-height: 1.6;
          }
          
          .header {
            border-bottom: 3px solid #f59e0b;
            padding-bottom: 30px;
            margin-bottom: 30px;
          }
          
          .header h1 {
            color: #0f172a;
            font-size: 28px;
            margin-bottom: 10px;
          }
          
          .dist-id {
            color: #64748b;
            font-size: 14px;
          }
          
          .grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
            margin-bottom: 30px;
          }
          
          .section-title {
            font-weight: 700;
            color: #0f172a;
            font-size: 12px;
            text-transform: uppercase;
            margin-bottom: 8px;
          }
          
          .section-content {
            color: #475569;
            font-size: 14px;
          }
          
          .info-box {
            background: #fef3c7;
            padding: 20px;
            border-radius: 8px;
            margin: 30px 0;
            border-left: 4px solid #f59e0b;
          }
          
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 30px 0;
          }
          
          thead {
            background: #fef3c7;
          }
          
          th {
            text-align: left;
            padding: 14px 16px;
            font-weight: 700;
            color: #0f172a;
            font-size: 13px;
            text-transform: uppercase;
          }
          
          td {
            padding: 14px 16px;
            border-bottom: 1px solid #fde68a;
            color: #334155;
          }
          
          .status-badge {
            display: inline-block;
            padding: 6px 12px;
            border-radius: 6px;
            font-size: 12px;
            font-weight: 700;
            text-transform: uppercase;
          }
          
          .status-progress {
            background: #fef3c7;
            color: #d97706;
          }
          
          .status-done {
            background: #d1fae5;
            color: #059669;
          }
          
          .signature-section {
            margin-top: 60px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 40px;
            text-align: center;
          }
          
          .signature-box {
            padding: 20px;
          }
          
          .signature-title {
            font-weight: 700;
            margin-bottom: 60px;
            color: #0f172a;
          }
          
          .signature-line {
            border-bottom: 2px solid #334155;
            display: inline-block;
            width: 200px;
            margin-top: 10px;
          }
          
          .footer {
            margin-top: 60px;
            text-align: center;
            color: #94a3b8;
            font-size: 13px;
            padding-top: 30px;
            border-top: 1px solid #e2e8f0;
          }
          
          @media print {
            body {
              padding: 20px;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>SURAT JALAN DISTRIBUSI</h1>
          <p class="dist-id">No. Surat Jalan: <strong>${distribution.id}</strong></p>
        </div>
        
        <div class="grid">
          <div>
            <div class="section-title">Dari:</div>
            <div class="section-content">
              <strong>ERP DISTRI - GUDANG PUSAT</strong><br/>
              Sistem Distribusi & Konsinyasi
            </div>
          </div>
          <div>
            <div class="section-title">Kepada:</div>
            <div class="section-content">
              <strong>${partner.name}</strong><br/>
              ${partner.address}<br/>
              WA: ${partner.phone}
            </div>
          </div>
        </div>
        
        <div class="info-box">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; font-size: 14px;">
            <div>
              <strong>Tanggal Permintaan:</strong><br/>
              ${formatDateShort(distribution.reqDate)}
            </div>
            <div>
              <strong>Tanggal Pengiriman:</strong><br/>
              ${formatDateShort(distribution.date)}
            </div>
          </div>
        </div>
        
        <table>
          <thead>
            <tr>
              <th>Nama Produk</th>
              <th style="text-align: center;">Kuantitas</th>
              <th style="text-align: right;">Harga Satuan</th>
              <th style="text-align: right;">Total Nilai</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>${product.name}</strong></td>
              <td style="text-align: center; font-weight: 700; font-size: 16px; color: #f59e0b;">${distribution.qty}</td>
              <td style="text-align: right;">${formatIDR(product.price)}</td>
              <td style="text-align: right; font-weight: 700;">${formatIDR(product.price * distribution.qty)}</td>
            </tr>
          </tbody>
        </table>
        
        <div style="margin: 30px 0; padding: 16px; background: #f8fafc; border-radius: 8px;">
          <strong>Status Pengiriman:</strong> 
          <span class="status-badge ${distribution.status === 'Selesai' ? 'status-done' : 'status-progress'}">
            ${distribution.status}
          </span>
        </div>
        
        <div class="signature-section">
          <div class="signature-box">
            <div class="signature-title">Pengirim (Gudang)</div>
            <div style="height: 80px;"></div>
            <div class="signature-line"></div>
            <div style="margin-top: 8px; color: #64748b; font-size: 13px;">( ..................... )</div>
          </div>
          <div class="signature-box">
            <div class="signature-title">Penerima (Mitra)</div>
            <div style="height: 80px;"></div>
            <div class="signature-line"></div>
            <div style="margin-top: 8px; color: #64748b; font-size: 13px;">( ..................... )</div>
          </div>
        </div>
        
        <div class="footer">
          Dokumen ini adalah bukti sah pengiriman barang konsinyasi.<br/>
          Dicetak otomatis oleh sistem ERP Distribusi.
        </div>
        
        <script>
          window.onload = () => {
            window.print();
          };
        </script>
      </body>
    </html>
  `);

  printWindow.document.close();
};

/**
 * Print sales invoice
 * @param {Object} sale - Sale object
 */
export const printInvoice = (sale) => {
  const printWindow = window.open('', '_blank');

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Invoice ${sale.id}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
          
          body {
            font-family: 'Inter', sans-serif;
            padding: 60px 40px;
            color: #1e293b;
            line-height: 1.6;
          }
          
          .header {
            border-bottom: 3px solid #f59e0b;
            padding-bottom: 30px;
            margin-bottom: 30px;
          }
          
          .header h1 {
            color: #0f172a;
            font-size: 28px;
            margin-bottom: 10px;
          }
          
          .invoice-id {
            color: #64748b;
            font-size: 14px;
          }
          
          .grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
            margin-bottom: 30px;
          }
          
          .section-title {
            font-weight: 700;
            color: #0f172a;
            margin-bottom: 8px;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          
          .section-content {
            color: #475569;
            font-size: 14px;
          }
          
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 30px 0;
          }
          
          thead {
            background: #f8fafc;
          }
          
          th {
            text-align: left;
            padding: 14px 16px;
            font-weight: 700;
            color: #0f172a;
            font-size: 13px;
            text-transform: uppercase;
            letter-spacing: 0.3px;
          }
          
          td {
            padding: 14px 16px;
            border-bottom: 1px solid #e2e8f0;
            color: #334155;
          }
          
          .total-row {
            font-weight: 700;
            font-size: 18px;
            background: #fef3c7;
          }
          
          .total-row td {
            padding: 18px 16px;
            border-bottom: none;
          }
          
          .payment-method {
            margin: 20px 0;
            padding: 16px;
            background: #f1f5f9;
            border-radius: 8px;
            font-size: 14px;
          }
          
          .payment-method strong {
            color: #0f172a;
          }
          
          .footer {
            margin-top: 60px;
            text-align: center;
            color: #94a3b8;
            font-size: 13px;
            padding-top: 30px;
            border-top: 1px solid #e2e8f0;
          }
          
          @media print {
            body {
              padding: 20px;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>INVOICE PENJUALAN</h1>
          <p class="invoice-id">ID Transaksi: <strong>${sale.id}</strong></p>
        </div>
        
        <div class="grid">
          <div>
            <div class="section-title">Dari:</div>
            <div class="section-content">
              <strong>ERP DISTRI PUSAT</strong><br/>
              Gudang Utama
            </div>
          </div>
          <div>
            <div class="section-title">Kepada:</div>
            <div class="section-content">
              <strong>${sale.buyerName}</strong><br/>
              Melalui: ${sale.partnerName}
            </div>
          </div>
        </div>
        
        <p style="color: #64748b; font-size: 14px;">
          Tanggal: <strong>${formatDateShort(sale.saleDate)}</strong>
        </p>
        
        <table>
          <thead>
            <tr>
              <th>Produk</th>
              <th style="text-align: center;">Qty</th>
              <th style="text-align: right;">Harga Satuan</th>
              <th style="text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>${sale.productName}</strong></td>
              <td style="text-align: center;">${sale.qty}</td>
              <td style="text-align: right;">${formatIDR(sale.price)}</td>
              <td style="text-align: right;">${formatIDR(sale.total)}</td>
            </tr>
            <tr class="total-row">
              <td colspan="3" style="text-align: right;">Total Bayar</td>
              <td style="text-align: right;">${formatIDR(sale.total)}</td>
            </tr>
          </tbody>
        </table>
        
        <div class="payment-method">
          Metode Pembayaran: <strong>${sale.paymentMethod}</strong>
        </div>
        
        <div class="footer">
          Terima kasih atas kepercayaan Anda.<br/>
          Dokumen ini dicetak otomatis oleh sistem ERP Distribusi.
        </div>
        
        <script>
          window.onload = () => {
            window.print();
            // Optional: close after print
            // window.onafterprint = () => window.close();
          };
        </script>
      </body>
    </html>
  `);

  printWindow.document.close();
};

/**
 * Print return document
 * @param {Object} returnData - Return object
 */
export const printReturnInvoice = (returnData) => {
  const printWindow = window.open('', '_blank');

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Bukti Retur ${returnData.id}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
          
          body {
            font-family: 'Inter', sans-serif;
            padding: 60px 40px;
            color: #1e293b;
            line-height: 1.6;
          }
          
          .header {
            border-bottom: 3px solid #e11d48;
            padding-bottom: 30px;
            margin-bottom: 30px;
          }
          
          .header h1 {
            color: #e11d48;
            font-size: 28px;
            margin-bottom: 10px;
          }
          
          .return-id {
            color: #64748b;
            font-size: 14px;
          }
          
          .info-section {
            margin-bottom: 30px;
            padding: 20px;
            background: #fff1f2;
            border-radius: 8px;
            border-left: 4px solid #e11d48;
          }
          
          .info-label {
            font-weight: 700;
            color: #0f172a;
            font-size: 12px;
            text-transform: uppercase;
            margin-bottom: 4px;
          }
          
          .info-value {
            color: #475569;
            font-size: 14px;
          }
          
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 30px 0;
          }
          
          thead {
            background: #fff1f2;
          }
          
          th {
            text-align: left;
            padding: 14px 16px;
            font-weight: 700;
            color: #be123c;
            font-size: 13px;
            text-transform: uppercase;
          }
          
          td {
            padding: 14px 16px;
            border-bottom: 1px solid #fecdd3;
            color: #334155;
          }
          
          .signature-section {
            margin-top: 60px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 40px;
            text-align: center;
          }
          
          .signature-box {
            padding: 20px;
          }
          
          .signature-title {
            font-weight: 700;
            margin-bottom: 60px;
            color: #0f172a;
          }
          
          .signature-line {
            border-bottom: 2px solid #334155;
            display: inline-block;
            width: 200px;
            margin-top: 10px;
          }
          
          .footer {
            margin-top: 60px;
            text-align: center;
            color: #94a3b8;
            font-size: 13px;
            padding-top: 30px;
            border-top: 1px solid #e2e8f0;
          }
          
          @media print {
            body {
              padding: 20px;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>BUKTI RETUR BARANG</h1>
          <p class="return-id">ID Retur: <strong>${returnData.id}</strong></p>
        </div>
        
        <div class="info-section">
          <div class="info-label">Tanggal Retur</div>
          <div class="info-value"><strong>${formatDateShort(returnData.date)}</strong></div>
          <div class="info-label" style="margin-top: 12px;">Mitra</div>
          <div class="info-value"><strong>${returnData.partnerName}</strong></div>
        </div>
        
        <table>
          <thead>
            <tr>
              <th>Produk</th>
              <th style="text-align: center;">Kuantitas</th>
              <th>Alasan Retur</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>${returnData.productName}</strong></td>
              <td style="text-align: center; font-weight: 700; color: #e11d48;">${returnData.qty}</td>
              <td><em>${returnData.reason}</em></td>
            </tr>
          </tbody>
        </table>
        
        <div class="signature-section">
          <div class="signature-box">
            <div class="signature-title">Penerima Gudang</div>
            <div style="height: 80px;"></div>
            <div class="signature-line"></div>
            <div style="margin-top: 8px; color: #64748b; font-size: 13px;">( ..................... )</div>
          </div>
          <div class="signature-box">
            <div class="signature-title">Pihak Mitra</div>
            <div style="height: 80px;"></div>
            <div class="signature-line"></div>
            <div style="margin-top: 8px; color: #64748b; font-size: 13px;">( ..................... )</div>
          </div>
        </div>
        
        <div class="footer">
          Dokumen ini adalah bukti sah pengembalian stok ke gudang pusat.<br/>
          Dicetak otomatis oleh sistem ERP Distribusi.
        </div>
        
        <script>
          window.onload = () => {
            window.print();
            // Optional: close after print
            // window.onafterprint = () => window.close();
          };
        </script>
      </body>
    </html>
  `);

  printWindow.document.close();
};
