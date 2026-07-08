/**
 * core/utils/formatters.js
 * Pure utility functions shared across all modules.
 * NO UI dependencies. NO API calls. Pure transformations only.
 */

// ─── Date Utilities ────────────────────────────────────────────────────────────

/** Format a date string to French locale (e.g. "lundi 7 mai 2026") */
export function formatDateFr(dateString, options = {}) {
  if (!dateString) return '—';
  const defaults = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('fr-FR', { ...defaults, ...options });
}

/** Format a date to short form (e.g. "07/05/2026") */
export function formatDateShort(dateString) {
  if (!dateString) return '—';
  return new Date(dateString).toLocaleDateString('fr-FR');
}

/** Format time string "HH:MM:SS" → "HH:MM" */
export function formatTime(timeString) {
  if (!timeString) return '—';
  return timeString.substring(0, 5);
}

/** Get the French day name for today */
export function getTodayFr() {
  const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  return days[new Date().getDay()];
}

/** Check if a schedule session is currently live */
export function isSessionLive(heureDebut, heureFin) {
  if (!heureDebut || !heureFin) return false;
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const [sh, sm] = heureDebut.split(':').map(Number);
  const [eh, em] = heureFin.split(':').map(Number);
  const startMinutes = sh * 60 + sm;
  const endMinutes = eh * 60 + em;
  return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
}

// ─── String Utilities ───────────────────────────────────────────────────────────

/** Strip HTML tags from a string */
export function stripHtml(html) {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '');
}

/** Truncate text to a max length with ellipsis */
export function truncate(text, maxLength = 80) {
  if (!text) return '';
  const clean = stripHtml(text);
  return clean.length > maxLength ? clean.substring(0, maxLength) + '…' : clean;
}

/** Capitalize the first letter of a string */
export function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/** Build full name from prenom + nom */
export function fullName(user) {
  if (!user) return '—';
  return `${user.prenom || ''} ${user.nom || ''}`.trim() || '—';
}

/** Get initials from a name (for avatars) */
export function getInitials(name) {
  if (!name) return '?';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
}

// ─── Number Utilities ───────────────────────────────────────────────────────────

/** Format a grade value (e.g. 15.4 → "15.40") */
export function formatGrade(value) {
  if (value === null || value === undefined) return '—';
  return Number(value).toFixed(2);
}

/** Clamp a number between min and max */
export function clamp(value, min = 0, max = 100) {
  return Math.min(Math.max(value, min), max);
}
