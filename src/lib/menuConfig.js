import { DEFAULT_MENU_ITEMS } from '../data/constants';

export const repairLegacyText = (value) => {
  if (typeof value !== 'string') return value;
  let repaired = value;
  for (let i = 0; i < 3; i += 1) {
    if (!/[ÃÂâð]/.test(repaired)) break;
    try {
      const next = decodeURIComponent(escape(repaired));
      if (!next || next === repaired) break;
      repaired = next;
    } catch {
      break;
    }
  }
  return repaired;
};

const sanitizeMenuItem = (itemInput) => {
  const item = itemInput && typeof itemInput === 'object' ? itemInput : {};
  return {
    ...item,
    icon: repairLegacyText(String(item.icon || '')),
    label: repairLegacyText(String(item.label || '')),
    group: repairLegacyText(String(item.group || '')),
  };
};

export const mergeMenuItemsWithDefaults = (customMenuItems) => {
  const incoming = Array.isArray(customMenuItems) ? customMenuItems : [];
  const safeDefaults = DEFAULT_MENU_ITEMS.map((item) => sanitizeMenuItem(item));
  const defaultById = new Map(safeDefaults.map((item) => [item.id, item]));

  const normalizedIncoming = incoming
    .filter((item) => item && typeof item.id === 'string')
    .map((item) => {
      const defaultItem = defaultById.get(item.id);
      const mergedItem = defaultItem ? { ...defaultItem, ...item } : item;
      return sanitizeMenuItem(mergedItem);
    });

  const incomingIds = new Set(normalizedIncoming.map((item) => item.id));
  const missingDefaults = safeDefaults
    .filter((item) => !incomingIds.has(item.id))
    .map((item) => ({ ...item }));

  return [...normalizedIncoming, ...missingDefaults];
};
