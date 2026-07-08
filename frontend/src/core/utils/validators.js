/**
 * core/utils/validators.js
 * Pure validation helpers — no UI, no API calls.
 */

/** Check if a value is non-empty string/array/object */
export function isNotEmpty(value) {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'object') return Object.keys(value).length > 0;
  return Boolean(value);
}

/** Validate email format */
export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/** Validate a grade value (0–20 scale) */
export function isValidGrade(value) {
  const num = parseFloat(value);
  return !isNaN(num) && num >= 0 && num <= 20;
}

/** Validate that a time string is HH:MM format */
export function isValidTime(timeStr) {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(timeStr);
}
