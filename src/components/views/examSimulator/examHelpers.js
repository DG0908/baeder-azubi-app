import { PERMISSIONS } from '../../../data/constants';

export const getFirstName = (fullName) =>
  String(fullName || '').trim().split(/\s+/)[0] || '?';

export const formatCandidateLabel = (account) => {
  const name = getFirstName(account.name);
  const role = (PERMISSIONS[account.role] || PERMISSIONS.azubi).label;
  const company = account.company ? ` · ${account.company}` : '';
  return `${name} (${role}${company})`;
};

export const formatAttemptDate = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleString('de-DE');
};
