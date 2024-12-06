/**
 * Formata uma data para o padrão YYYY-MM-DD
 * @param {Date} date - Data a ser formatada
 * @returns {string} Data formatada no padrão YYYY-MM-DD
 */
export function formatDateUtil(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}
