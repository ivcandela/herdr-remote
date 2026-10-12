// Peers: other herdr-web servers this one fronts, so a single UI (and a single
// token) reaches every machine. A peer's API is exposed at /h/<name>/api/*.

// `travel=http://192.168.1.30:4270` -> {name, url}; null when malformed.
export function parsePeer(spec) {
  const i = typeof spec === 'string' ? spec.indexOf('=') : -1;
  if (i < 1) return null;
  const name = spec.slice(0, i).trim();
  if (!/^[A-Za-z0-9._-]+$/.test(name)) return null;
  try {
    const u = new URL(spec.slice(i + 1).trim());
    if (u.protocol !== 'http:' && u.protocol !== 'https:') return null;
    return { name, url: u.origin };
  } catch {
    return null;
  }
}

// Splits `/h/<name>/api/...`; null for anything else (only the API is proxied).
export function splitPeerPath(pathname) {
  const m = pathname.match(/^\/h\/([^/]+)(\/api\/.*)$/);
  if (!m) return null;
  try {
    return { name: decodeURIComponent(m[1]), path: m[2] };
  } catch {
    return null;
  }
}

// The client's own `token` query param authenticates to us, never to the peer.
export function forwardSearch(search) {
  const params = new URLSearchParams(search);
  params.delete('token');
  const qs = params.toString();
  return qs ? '?' + qs : '';
}
