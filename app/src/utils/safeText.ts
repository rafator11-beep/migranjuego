// Utility helpers to safely normalize text values that may come from localStorage/DB/UI.
// Prevents runtime crashes like: TypeError: x.toLowerCase is not a function

export function asString(value: unknown): string {
  if (value == null) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  // common patterns: { name: 'Rafa' } or { player_name: 'Rafa' }
  if (typeof value === 'object') {
    const v = value as any;
    if (typeof v.name === 'string') return v.name;
    if (typeof v.player_name === 'string') return v.player_name;
    if (typeof v.label === 'string') return v.label;
    if (typeof v.value === 'string') return v.value;
  }
  try {
    return String(value);
  } catch {
    return '';
  }
}

export function safeLower(value: unknown): string {
  return asString(value).toLowerCase();
}
