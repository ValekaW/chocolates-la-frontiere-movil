// $95.00 MXN
export function money(value, { currency = true } = {}) {
  return `$${Number(value).toFixed(2)}${currency ? ' MXN' : ''}`;
}

// D1 guarda las fechas en UTC como "2026-10-16 18:55:16" → "16 de octubre de 2026"
export function formatDate(sqlDate) {
  if (!sqlDate) return '';
  return new Date(`${sqlDate.replace(' ', 'T')}Z`).toLocaleDateString('es-MX', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
}
