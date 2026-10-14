// Private-beta lock. While the BETA_PASSWORD secret is set (Cloudflare dashboard → this Worker →
// Settings → Variables and Secrets), every page asks for a password. Delete the secret to go public.
export default {
  async fetch(request, env) {
    const password = env.BETA_PASSWORD;
    if (password) {
      const auth = request.headers.get('Authorization') || '';
      const [scheme, encoded] = auth.split(' ');
      let given = '';
      if (scheme === 'Basic' && encoded) {
        try { given = atob(encoded).split(':').slice(1).join(':'); } catch {}
      }
      if (!(await same(given, password))) {
        return new Response('This site is in private beta.', {
          status: 401,
          headers: { 'WWW-Authenticate': 'Basic realm="Private beta", charset="UTF-8"', 'Cache-Control': 'no-store' },
        });
      }
    }
    const res = await env.ASSETS.fetch(request);
    if (!password) return res;
    const out = new Response(res.body, res);
    out.headers.set('Cache-Control', 'private, no-store');
    return out;
  },
};

// Constant-time comparison so the password can't be guessed from response timing.
async function same(a, b) {
  const enc = new TextEncoder();
  const [ha, hb] = await Promise.all([a, b].map((s) => crypto.subtle.digest('SHA-256', enc.encode(s))));
  return crypto.subtle.timingSafeEqual ? crypto.subtle.timingSafeEqual(ha, hb) : a === b;
}
