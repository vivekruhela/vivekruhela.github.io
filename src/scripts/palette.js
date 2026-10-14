// ⌘K search over /search.json (built from all content at build time).
const $ = (s) => document.querySelector(s);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const bg = $('#palBg'), inp = $('#palIn'), ul = $('#palList');
let idx = null, sel = 0, res = [];

async function load() {
  if (!idx) {
    try { idx = await (await fetch('/search.json')).json(); } catch { idx = []; }
  }
}
function render() {
  const q = inp.value.toLowerCase().trim().split(/\s+/).filter(Boolean);
  res = (idx || []).filter((i) => q.every((w) => (i.t + ' ' + i.x).toLowerCase().includes(w))).slice(0, 12);
  sel = Math.min(sel, Math.max(0, res.length - 1));
  ul.innerHTML = res.length
    ? res.map((r, i) => `<li class="${i === sel ? 'sel' : ''}" data-i="${i}"><span class="t">${esc(r.t)}</span><span class="x">${esc(r.x)}</span></li>`).join('')
    : `<li class="empty">No matches. Try "myeloma", "Alzheimer" or "2025".</li>`;
}
async function open() { bg.hidden = false; inp.value = ''; sel = 0; inp.focus(); await load(); render(); }
function close() { bg.hidden = true; }
function go(i) {
  const r = res[i];
  if (!r) return;
  close();
  const u = new URL(r.u, location.href);
  if (u.pathname === location.pathname && window.siteGo) window.siteGo(u);
  else location.href = r.u;
}
$('#openPal').addEventListener('click', open);
bg.addEventListener('click', (e) => { if (e.target === bg) close(); });
ul.addEventListener('click', (e) => { const li = e.target.closest('li[data-i]'); if (li) go(+li.dataset.i); });
inp.addEventListener('input', () => { sel = 0; render(); });
addEventListener('keydown', (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); bg.hidden ? open() : close(); return; }
  if (bg.hidden) return;
  if (e.key === 'Escape') close();
  else if (e.key === 'ArrowDown') { sel = Math.min(res.length - 1, sel + 1); render(); e.preventDefault(); }
  else if (e.key === 'ArrowUp') { sel = Math.max(0, sel - 1); render(); e.preventDefault(); }
  else if (e.key === 'Enter') go(sel);
});
