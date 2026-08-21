// Anonymous, per-browser identifiers. Nothing here identifies a person; they
// exist so the poll can stop the same browser voting twice and so the visit
// counter can tell a returning visitor from a new one.

const TOKEN_KEY = 'bi_visitor_token';
const SEEN_KEY = 'bi_visitor_seen';
const SESSION_KEY = 'bi_visit_counted';

function randomToken() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  // Older browsers: not cryptographically strong, but this is only a dedupe
  // hint, never a security boundary.
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}

export function getVisitorToken() {
  let token = localStorage.getItem(TOKEN_KEY);
  if (!token) {
    token = randomToken();
    localStorage.setItem(TOKEN_KEY, token);
  }
  return token;
}

// True the first time this browser ever loads the site.
export function isNewVisitor() {
  return !localStorage.getItem(SEEN_KEY);
}

export function markVisitorSeen() {
  localStorage.setItem(SEEN_KEY, '1');
}

// The counter measures sessions, not page views, so a visitor reading six
// articles registers once. sessionStorage clears when the tab closes.
export function shouldCountVisit() {
  return !sessionStorage.getItem(SESSION_KEY);
}

export function markVisitCounted() {
  sessionStorage.setItem(SESSION_KEY, '1');
}
