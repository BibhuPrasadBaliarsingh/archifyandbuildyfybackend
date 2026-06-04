function escapeValue(value) {
  if (value === undefined || value === null) return '';
  const text = String(value).replace(/\r?\n/g, ' ').replace(/\t/g, ' ');
  return `"${text.replace(/"/g, '""')}"`;
}

function formatDate(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString().split('T')[0];
}

function sendExcel(res, filename, headers, rows) {
  res.setHeader('Content-Type', 'application/vnd.ms-excel; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  const lines = [headers.map(escapeValue).join('\t')];
  for (const row of rows) {
    lines.push(row.map(escapeValue).join('\t'));
  }
  res.send('\ufeff' + lines.join('\r\n'));
}

module.exports = { sendExcel, formatDate };
