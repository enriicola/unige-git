const pad2 = (value) => String(value).padStart(2, '0');

export const formatDateTime = (value) => {
  if (!value) return '—';
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return typeof value === 'string' ? value : '—';
  }
  const hours = date.getHours();
  const hours12 = hours % 12 || 12;
  const minutes = pad2(date.getMinutes());
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const day = pad2(date.getDate());
  const month = pad2(date.getMonth() + 1);
  const year = date.getFullYear();
  return `${hours12}:${minutes} ${ampm}, ${day}/${month}/${year}`;
};
