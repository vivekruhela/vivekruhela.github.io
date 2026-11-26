// View counts read from GoatCounter's public counter API at BUILD time, so the numbers are written
// straight into the HTML. Every visitor sees them, including people whose ad blocker or browser
// (Brave, uBlock Origin, Firefox strict mode) blocks requests to goatcounter.com. The page script
// then tries to refresh the number live; if that request is blocked, the built-in number stays.
// The deploy workflow rebuilds on a schedule so the built-in numbers stay fresh.
import { site as loadSite } from './content';

const cache = new Map<string, Promise<number | null>>();

export function views(path: string): Promise<number | null> {
  const { beta, goatcounter } = loadSite();
  if (beta || !goatcounter) return Promise.resolve(null);
  if (!cache.has(path)) {
    const url = `https://${goatcounter}.goatcounter.com/counter/${encodeURIComponent(path)}.json`;
    cache.set(
      path,
      fetch(url, { signal: AbortSignal.timeout(10_000) })
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => (d ? Number(String(d.count).replace(/\D/g, '')) || null : null))
        .catch(() => null),
    );
  }
  return cache.get(path)!;
}

export const fmtViews = (n: number) => `${n.toLocaleString('en-US')} ${n === 1 ? 'view' : 'views'}`;
