import { site } from '../lib/content';

// Blocks search engines while site.yaml says beta: true.
export function GET() {
  const body = site().beta ? 'User-agent: *\nDisallow: /\n' : 'User-agent: *\nAllow: /\n';
  return new Response(body, { headers: { 'Content-Type': 'text/plain' } });
}
