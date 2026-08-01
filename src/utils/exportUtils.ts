import { Transaction, CurrencyMode } from '../types';

export interface ReportFilterOptions {
  startDate?: string;
  endDate?: string;
  dateRangeLabel?: string;
}

export function filterTransactionsByDate(
  transactions: Transaction[],
  options?: ReportFilterOptions
): Transaction[] {
  if (!options) return transactions;
  const { startDate, endDate, dateRangeLabel } = options;

  if (startDate || endDate) {
    return transactions.filter((t) => {
      const txDate = new Date(t.rawDate || t.date).getTime();
      if (startDate && txDate < new Date(startDate).getTime()) return false;
      if (endDate && txDate > new Date(endDate).getTime() + 86400000) return false;
      return true;
    });
  }

  if (dateRangeLabel) {
    const now = new Date();
    if (dateRangeLabel === 'This Month') {
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
      return transactions.filter((t) => new Date(t.rawDate || t.date).getTime() >= monthStart);
    }
    if (dateRangeLabel === 'Last 30 days') {
      const thirtyDaysAgo = now.getTime() - 30 * 24 * 60 * 60 * 1000;
      return transactions.filter((t) => new Date(t.rawDate || t.date).getTime() >= thirtyDaysAgo);
    }
  }

  return transactions;
}

export function exportTransactionsToCSV(
  transactions: Transaction[],
  currency: CurrencyMode,
  options?: ReportFilterOptions,
  filename = 'Golden_Penny_Financial_Report.csv'
) {
  const filtered = filterTransactionsByDate(transactions, options);
  const rate = currency === 'INR' ? 83.5 : 1;
  const symbol = currency === 'INR' ? '₹' : '$';

  const totalIncome = filtered
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount * rate, 0);

  const totalExpense = filtered
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount * rate, 0);

  const netSavings = totalIncome - totalExpense;

  const summaryRows = [
    `"GOLDEN PENNY FINANCIAL REPORT"`,
    `"Date Range: ${options?.dateRangeLabel || 'Custom Date Wise Filter'}"`,
    `"Generated Date: ${new Date().toLocaleDateString()}"`,
    `"Author & Creator: Debraj Bhowmick"`,
    `"Copyright: © Golden Penny. All Rights Reserved."`,
    ``,
    `"KPI METRICS SUMMARY"`,
    `"Total Income (${currency})",${totalIncome.toFixed(2)}`,
    `"Total Expense (${currency})",${totalExpense.toFixed(2)}`,
    `"Net Cash Flow (${currency})",${netSavings.toFixed(2)}`,
    ``,
    `"ITEMIZED TRANSACTIONS LOG"`,
  ];

  const headers = [
    'ID',
    'Date',
    'Description',
    'Details',
    'Account',
    'Category',
    'Payment Mode',
    'Status',
    'Type',
    `Amount (${symbol})`,
  ];

  const rows = filtered.map((t) => {
    const displayAmount = (t.type === 'expense' ? -1 : 1) * Math.abs(t.amount * rate);
    return [
      `"${t.id}"`,
      `"${t.date}"`,
      `"${t.description.replace(/"/g, '""')}"`,
      `"${(t.details || '').replace(/"/g, '""')}"`,
      `"${t.account.replace(/"/g, '""')}"`,
      `"${t.category.replace(/"/g, '""')}"`,
      `"${t.paymentMode}"`,
      `"${t.status}"`,
      `"${t.type}"`,
      displayAmount.toFixed(2),
    ];
  });

  const csvContent = [
    ...summaryRows,
    headers.join(','),
    ...rows.map((r) => r.join(',')),
    ``,
    `"© Golden Penny - Designed & Developed by Debraj Bhowmick"`,
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportTransactionsToPDF(
  transactions: Transaction[],
  currency: CurrencyMode,
  options?: ReportFilterOptions,
  title = 'Golden Penny Financial Report & Statement'
) {
  const filtered = filterTransactionsByDate(transactions, options);
  const symbol = currency === 'INR' ? '₹' : '$';
  const rate = currency === 'INR' ? 83.5 : 1;

  const totalIncome = filtered
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount * rate, 0);

  const totalExpense = filtered
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount * rate, 0);

  const netBalance = totalIncome - totalExpense;

  // Category breakdown calculation
  const categoryTotals: Record<string, number> = {};
  filtered.forEach((t) => {
    if (t.type === 'expense') {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount * rate;
    }
  });

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>${title}</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            background: #09090b;
            color: #e4e1e6;
            padding: 32px;
            margin: 0;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid #27272a;
            padding-bottom: 16px;
            margin-bottom: 24px;
          }
          .brand-logo {
            font-size: 26px;
            font-weight: 800;
            color: #f59e0b;
            letter-spacing: -0.5px;
          }
          .tagline {
            font-size: 11px;
            color: #908fa0;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            margin-top: 2px;
          }
          .meta {
            text-align: right;
            font-size: 12px;
            color: #908fa0;
          }
          .date-badge {
            display: inline-block;
            background: rgba(99, 102, 241, 0.15);
            color: #c0c1ff;
            border: 1px solid rgba(99, 102, 241, 0.3);
            padding: 4px 10px;
            border-radius: 6px;
            font-weight: 600;
            margin-bottom: 20px;
            font-size: 12px;
          }
          .summary-cards {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 16px;
            margin-bottom: 24px;
          }
          .card {
            background: #18181b;
            border: 1px solid #27272a;
            border-radius: 12px;
            padding: 18px;
          }
          .card-title {
            font-size: 11px;
            color: #908fa0;
            text-transform: uppercase;
            font-weight: 700;
            letter-spacing: 0.5px;
          }
          .card-val {
            font-size: 22px;
            font-weight: 800;
            margin-top: 6px;
            font-family: monospace;
          }
          .income { color: #4edea3; }
          .expense { color: #ffb4ab; }
          .balance { color: #c0c1ff; }
          
          .section-title {
            font-size: 14px;
            font-weight: 700;
            color: #ffffff;
            margin-top: 24px;
            margin-bottom: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 8px;
            background: #131316;
            border-radius: 8px;
            overflow: hidden;
          }
          th {
            background: #1b1b1e;
            color: #908fa0;
            font-size: 11px;
            text-transform: uppercase;
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #27272a;
          }
          td {
            padding: 12px;
            font-size: 13px;
            border-bottom: 1px solid #27272a;
          }
          tr:hover {
            background: #1f1f22;
          }
          .status {
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: bold;
          }
          .status-cleared { background: rgba(78, 222, 163, 0.2); color: #4edea3; }
          .status-pending { background: rgba(255, 185, 95, 0.2); color: #ffb95f; }
          .status-unmatched { background: rgba(255, 180, 171, 0.2); color: #ffb4ab; }
          
          .copyright-footer {
            margin-top: 40px;
            padding-top: 16px;
            border-t: 1px solid #27272a;
            text-align: center;
            font-size: 12px;
            color: #908fa0;
          }
          .author-tag {
            color: #f59e0b;
            font-weight: 700;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="brand-logo">✨ Golden Penny</div>
            <div class="tagline">Personal Wealth & Finance OS</div>
          </div>
          <div class="meta">
            <div><strong>Report Date:</strong> ${new Date().toLocaleDateString()}</div>
            <div><strong>Currency:</strong> ${currency}</div>
            <div><strong>Filter:</strong> ${options?.dateRangeLabel || 'Custom Date Wise'}</div>
          </div>
        </div>

        <div class="date-badge">
          📅 Date Range Selected: ${options?.dateRangeLabel || 'All Time'} (${filtered.length} transactions included)
        </div>

        <div class="summary-cards">
          <div class="card">
            <div class="card-title">Total Income</div>
            <div class="card-val income">+${symbol}${totalIncome.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          </div>
          <div class="card">
            <div class="card-title">Total Expenses</div>
            <div class="card-val expense">-${symbol}${totalExpense.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          </div>
          <div class="card">
            <div class="card-title">Net Savings / Cash Flow</div>
            <div class="card-val balance">${symbol}${netBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          </div>
        </div>

        <div class="section-title">Itemized Transactions Log</div>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Account</th>
              <th>Category</th>
              <th>Status</th>
              <th style="text-align: right;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${filtered
              .map((t) => {
                const amt = t.amount * rate;
                const statusClass =
                  t.status === 'Cleared'
                    ? 'status-cleared'
                    : t.status === 'Pending'
                    ? 'status-pending'
                    : 'status-unmatched';
                return `
                <tr>
                  <td>${t.date}</td>
                  <td><strong>${t.description}</strong><br/><span style="color:#908fa0;font-size:11px;">${t.details || ''}</span></td>
                  <td>${t.account}</td>
                  <td>${t.category}</td>
                  <td><span class="status ${statusClass}">${t.status}</span></td>
                  <td style="text-align: right; font-weight: bold; color: ${t.type === 'expense' ? '#ffb4ab' : '#4edea3'};">
                    ${t.type === 'expense' ? '-' : '+'}${symbol}${amt.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                </tr>
              `;
              })
              .join('')}
          </tbody>
        </table>

        <div class="copyright-footer">
          © Golden Penny • All Rights Reserved.<br/>
          Designed & Developed by <span class="author-tag">Debraj Bhowmick</span>
        </div>

        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
    </html>
  `;

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  }
}

