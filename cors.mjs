// Opt-in CORS so one herdr-web UI can talk to the API of other herdr-web hosts.
// Auth is a bearer token (no cookies), so an allow-list of origins is enough.

const ALLOW_HEADERS = 'Authorization, Content-Type';
const ALLOW_METHODS = 'GET, POST, OPTIONS';

// Normalizes `http://host:4270/` to `http://host:4270`; null for anything that isn't an origin.
export function normalizeOrigin(value) {
  try {
    const u = new URL(value);
    return u.protocol === 'http:' || u.protocol === 'https:' ? u.origin : null;
  } catch {
    return null;
  }
}

// Returns the headers to add to a response for `origin`, or null when it isn't allowed.
export function corsHeaders(allowed, origin) {
  if (!origin || !allowed.includes(origin)) return null;
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Headers': ALLOW_HEADERS,
    'Access-Control-Allow-Methods': ALLOW_METHODS,
    'Access-Control-Max-Age': '600',
    Vary: 'Origin',
  };
}
