/* ================= Almore · 共享脚本 ================= */
(function () {
  const KEY = 'jubian_auth';

  function safeGet(store) { try { return JSON.parse(store.getItem(KEY)); } catch (e) { return null; } }
  function safeSet(store, v) { try { store.setItem(KEY, JSON.stringify(v)); return true; } catch (e) { return false; } }

  // ---- Auth helpers (multi-fallback: URL params -> sessionStorage -> localStorage) ----
  // 兼容 file:// 下部分浏览器禁用 localStorage 的情况，避免登录后被弹回登录页
  window.Auth = {
    login(user) { safeSet(localStorage, user); safeSet(sessionStorage, user); },
    logout() { try { localStorage.removeItem(KEY); } catch (e) {} try { sessionStorage.removeItem(KEY); } catch (e) {} location.href = 'login.html'; },
    current() {
      const p = new URLSearchParams(location.search);
      if (p.get('name')) {
        const u = { name: p.get('name'), email: p.get('email') || '', plan: p.get('plan') || 'Growth 成长版' };
        this.login(u);
        return u;
      }
      return safeGet(sessionStorage) || safeGet(localStorage);
    },
    // build a dashboard URL that carries auth in query string as a robust fallback
    dashUrl(user) {
      const q = new URLSearchParams({ name: user.name || '开发者', email: user.email || '', plan: user.plan || 'Growth 成长版' });
      return 'dashboard.html?' + q.toString();
    },
    require() { const u = this.current(); if (!u) { location.href = 'login.html'; } return u; }
  };

  // ---- Toast ----
  window.toast = function (msg, type) {
    let box = document.querySelector('.toast-box');
    if (!box) { box = document.createElement('div'); box.className = 'toast-box'; document.body.appendChild(box); }
    const t = document.createElement('div');
    t.className = 'toast ' + (type || 'ok');
    const icon = type === 'warn' ? 'ri-error-warning-fill' : 'ri-checkbox-circle-fill';
    t.innerHTML = '<i class="' + icon + '"></i>' + msg;
    box.appendChild(t);
    setTimeout(() => { t.style.opacity = '0'; t.style.transform = 'translateX(30px)'; t.style.transition = '.3s'; setTimeout(() => t.remove(), 300); }, 2600);
  };

  // ---- Reveal on scroll ----
  function initReveal() {
    const els = document.querySelectorAll('.reveal');
    if (!els.length) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    els.forEach((el, i) => { el.style.transitionDelay = (i % 4) * 70 + 'ms'; io.observe(el); });
  }

  // ---- Animated counters ----
  function initCounters() {
    const els = document.querySelectorAll('[data-count]');
    if (!els.length) return;
    const fmt = (n) => n >= 1000 ? Math.round(n).toLocaleString('en-US') : Math.round(n);
    const run = (el) => {
      const target = +el.dataset.count, pre = el.dataset.prefix || '', suf = el.dataset.suffix || '';
      let start = null;
      const step = (ts) => {
        if (!start) start = ts;
        const p = Math.min((ts - start) / 1600, 1), eased = 1 - Math.pow(1 - p, 3);
        el.textContent = pre + fmt(target * eased) + suf;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { run(e.target); io.unobserve(e.target); } });
    }, { threshold: 0.5 });
    els.forEach((el) => io.observe(el));
  }

  // ---- Header shadow ----
  function initHeader() {
    const hdr = document.querySelector('header.site');
    if (!hdr) return;
    addEventListener('scroll', () => hdr.classList.toggle('scrolled', scrollY > 10));
  }

  // ---- Self-contained visuals (replace all external images with inline SVG) ----
  // 外部图床在受限网络下会空白/裂图，统一替换为高质感内联 SVG 插画，必定可见。
  const PAL = [['#2b6cf6', '#1e50c8'], ['#06a7ff', '#0284c7'], ['#3b82f6', '#1e50c8'], ['#0ea5e9', '#2b6cf6'], ['#6366f1', '#2b6cf6'], ['#0891b2', '#06a7ff']];
  function hash(s) { let h = 0; s = String(s || ''); for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; }
  function uri(svg) { return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg); }
  function pair(seed) { return PAL[hash(seed) % PAL.length]; }
  const ICONS = {
    game: '<rect x="2.5" y="7.5" width="19" height="9.5" rx="4.5"/><path d="M7 11v3M5.5 12.5h3"/><circle cx="15.5" cy="11.5" r="0.9"/><circle cx="17.5" cy="13.5" r="0.9"/>',
    beauty: '<path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/><path d="M18.5 15.5l.7 1.9 1.9.7-1.9.7-.7 1.9-.7-1.9-1.9-.7 1.9-.7z"/>',
    fmcg: '<path d="M9.5 3h5M10 3v3l-2.5 3.5A3 3 0 0 0 7 11v7a3 3 0 0 0 3 3h4a3 3 0 0 0 3-3v-7a3 3 0 0 0-.5-1.5L14 6V3"/><path d="M7 14h10"/>',
    tool: '<rect x="3" y="6" width="18" height="13" rx="3"/><path d="M3 10h18M16 14.5h2.5"/>',
    ai: '<rect x="5" y="8" width="14" height="10" rx="3"/><path d="M12 4.5V8M9 12.5h.01M15 12.5h.01M2.5 12h1.5M20 12h1.5"/>',
    chart: '<path d="M4 20V11M9.3 20V5M14.7 20v-6M20 20V8M2.5 20h19"/>',
    image: '<rect x="3" y="5" width="18" height="14" rx="3"/><circle cx="8.5" cy="10" r="1.6"/><path d="M20 16l-4.5-4.5L11 16l-2-2-4 4"/>'
  };
  function iconFor(t) {
    t = String(t || '').toLowerCase();
    if (/游戏|飞车|竞速|泡泡|game|play/.test(t)) return ICONS.game;
    if (/美妆|化妆|口红|礼盒|beauty|cosmet/.test(t)) return ICONS.beauty;
    if (/日化|快消|洁净|礼包|秒杀|fmcg|clean/.test(t)) return ICONS.fmcg;
    if (/记账|工具|效率|tool|casual/.test(t)) return ICONS.tool;
    if (/agent|ai|对话|口语|机器人|robot/.test(t)) return ICONS.ai;
    if (/数据|看板|收益|竞价|报表|analytic|dashboard|chart|data/.test(t)) return ICONS.chart;
    return ICONS.image;
  }
  function photoSVG(w, h, seed) {
    const p = pair(seed); w = Math.max(60, w || 600); h = Math.max(60, h || 400);
    const s = Math.min(w, h) * 0.30 / 24, cx = w / 2, cy = h / 2;
    return uri('<svg xmlns="http://www.w3.org/2000/svg" width="' + w + '" height="' + h + '" viewBox="0 0 ' + w + ' ' + h + '"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + p[0] + '"/><stop offset="1" stop-color="' + p[1] + '"/></linearGradient><pattern id="d" width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.4" fill="#ffffff" fill-opacity="0.10"/></pattern></defs><rect width="' + w + '" height="' + h + '" fill="url(#g)"/><rect width="' + w + '" height="' + h + '" fill="url(#d)"/><circle cx="' + (w * 0.82) + '" cy="' + (h * 0.2) + '" r="' + (h * 0.28) + '" fill="#ffffff" fill-opacity="0.08"/><circle cx="' + (w * 0.12) + '" cy="' + (h * 0.9) + '" r="' + (h * 0.22) + '" fill="#ffffff" fill-opacity="0.07"/><g transform="translate(' + cx + ',' + cy + ') scale(' + s + ') translate(-12,-12)" fill="none" stroke="#ffffff" stroke-opacity="0.95" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">' + iconFor(seed) + '</g></svg>');
  }
  function avatarSVG(seed) {
    const p = pair(seed + 'a');
    return uri('<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + p[0] + '"/><stop offset="1" stop-color="' + p[1] + '"/></linearGradient></defs><rect width="80" height="80" fill="url(#g)"/><circle cx="40" cy="31" r="13.5" fill="#ffffff" fill-opacity="0.95"/><path d="M15 71 c0-15 12-25 25-25 s25 10 25 25 z" fill="#ffffff" fill-opacity="0.95"/></svg>');
  }
  function monoSVG(letter, seed) {
    const p = pair(seed); letter = (letter || '·').slice(0, 2);
    return uri('<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + p[0] + '"/><stop offset="1" stop-color="' + p[1] + '"/></linearGradient></defs><rect width="80" height="80" rx="18" fill="url(#g)"/><text x="40" y="53" font-size="34" font-family="Arial, PingFang SC, Microsoft YaHei, sans-serif" font-weight="700" fill="#ffffff" text-anchor="middle">' + letter + '</text></svg>');
  }
  function localize(img) {
    if (img.dataset.localized) return;
    const src = img.getAttribute('src') || '';
    if (!/^https?:/.test(src)) return; // keep local/data URIs
    img.dataset.localized = '1';
    const alt = (img.getAttribute('alt') || '').trim();
    if (src.indexOf('simpleicons.org') > -1) {
      img.style.visibility = 'visible';
      img.src = monoSVG(alt ? alt.charAt(0).toUpperCase() : '·', alt || src);
    } else if (src.indexOf('pravatar') > -1) {
      img.src = avatarSVG(src + alt);
    } else {
      img.src = photoSVG(parseInt(img.getAttribute('width')) || img.clientWidth, parseInt(img.getAttribute('height')) || img.clientHeight, alt || src);
    }
  }
  // 优先展示真实图片；仅当加载失败或超时未出图时，才替换为内联 SVG，避免"部分图片无法展示"。
  function watch(img) {
    const src = img.getAttribute('src') || '';
    if (!/^https?:/.test(src) || img.dataset.watch) return;
    img.dataset.watch = '1';
    if (img.complete && img.naturalWidth > 0) return;
    img.addEventListener('error', () => localize(img), { once: true });
    const to = setTimeout(() => { if (!(img.complete && img.naturalWidth > 0)) localize(img); }, 1800);
    img.addEventListener('load', () => { if (img.naturalWidth > 0) clearTimeout(to); }, { once: true });
  }
  function watchAll(root) { (root || document).querySelectorAll('img').forEach(watch); }
  function initImages() {
    watchAll(document);
    if (window.MutationObserver) {
      new MutationObserver((muts) => muts.forEach((m) => m.addedNodes.forEach((n) => {
        if (n.nodeType !== 1) return;
        if (n.tagName === 'IMG') watch(n);
        else if (n.querySelectorAll) n.querySelectorAll('img').forEach(watch);
      }))).observe(document.body, { childList: true, subtree: true });
    }
  }

  document.addEventListener('DOMContentLoaded', () => { initReveal(); initCounters(); initHeader(); initImages(); });
})();
