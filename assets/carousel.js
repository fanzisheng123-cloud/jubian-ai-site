/* 卡牌式轮播：scroll-snap + 当前卡居中放大，支持箭头/圆点/键盘/触摸/自动播放 */
(function () {
  var TARGETS = [['.scn-grid', 284]];
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  TARGETS.forEach(function (t) {
    var track = document.querySelector(t[0]);
    if (!track) return;
    [].slice.call(track.querySelectorAll(':scope > .conn')).forEach(function (c) { c.remove(); });
    var cards = [].slice.call(track.children);
    if (cards.length < 2) return;

    var cx = document.createElement('div'); cx.className = 'cx';
    var vp = document.createElement('div'); vp.className = 'cx-viewport';
    track.parentNode.insertBefore(cx, track);
    cx.appendChild(vp); vp.appendChild(track);
    track.classList.add('cx-track');
    track.style.setProperty('--cx-w', t[1] + 'px');
    track.tabIndex = 0;
    track.setAttribute('role', 'region');
    track.setAttribute('aria-roledescription', 'carousel');

    var prev = btn('cx-btn cx-prev', 'ri-arrow-left-s-line', '上一张');
    var next = btn('cx-btn cx-next', 'ri-arrow-right-s-line', '下一张');
    var dots = document.createElement('div'); dots.className = 'cx-dots';
    cx.appendChild(prev); cx.appendChild(next); cx.appendChild(dots);
    var dotEls = cards.map(function (_, i) {
      var d = document.createElement('button'); d.type = 'button'; d.setAttribute('aria-label', '第 ' + (i + 1) + ' 张');
      d.onclick = function () { go(i); }; dots.appendChild(d); return d;
    });

    var cur = 0, timer = null, raf = 0;
    function btn(cls, icon, label) {
      var b = document.createElement('button'); b.type = 'button'; b.className = cls; b.setAttribute('aria-label', label);
      b.innerHTML = '<i class="' + icon + '"></i>'; return b;
    }
    function pad() {
      var p = Math.max(16, (track.clientWidth - cards[0].offsetWidth) / 2);
      track.style.paddingLeft = track.style.paddingRight = p + 'px';
    }
    function setActive(i) {
      cur = i;
      cards.forEach(function (c, k) { c.classList.toggle('is-active', k === i); });
      dotEls.forEach(function (d, k) { d.classList.toggle('on', k === i); });
    }
    function target(i) { var c = cards[i]; return c.offsetLeft - (track.clientWidth - c.offsetWidth) / 2; }
    function go(i, instant) {
      i = (i + cards.length) % cards.length;
      track.scrollTo({ left: target(i), behavior: instant || reduce ? 'instant' : 'smooth' });
      setActive(i);
    }
    function nearest() {
      var mid = track.scrollLeft + track.clientWidth / 2, best = 0, bd = 1e9;
      cards.forEach(function (c, k) {
        var d = Math.abs(c.offsetLeft + c.offsetWidth / 2 - mid);
        if (d < bd) { bd = d; best = k; }
      });
      return best;
    }

    track.addEventListener('scroll', function () {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(function () { var n = nearest(); if (n !== cur) setActive(n); });
    }, { passive: true });
    prev.onclick = function () { go(cur - 1); };
    next.onclick = function () { go(cur + 1); };
    cards.forEach(function (c, k) {
      c.addEventListener('click', function (e) { if (k !== cur && !e.target.closest('a,button')) { e.preventDefault(); go(k); } });
    });
    track.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(cur - 1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); go(cur + 1); }
    });

    var inView = false, paused = false;
    function tick() { stop(); if (reduce || !inView || paused) return; timer = setInterval(function () { go(cur + 1); }, 4200); }
    function stop() { clearInterval(timer); timer = null; }
    ['pointerenter', 'focusin', 'touchstart'].forEach(function (ev) { cx.addEventListener(ev, function () { paused = true; stop(); }, { passive: true }); });
    ['pointerleave', 'focusout'].forEach(function (ev) { cx.addEventListener(ev, function () { paused = false; tick(); }); });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) { inView = es[0].isIntersecting; tick(); }, { threshold: 0.35 }).observe(cx);
    }

    var pop = cards.findIndex(function (c) { return c.classList.contains('pop'); });
    var start = pop >= 0 ? pop : Math.floor((cards.length - 1) / 2);
    function init() { pad(); go(start, true); }
    init();
    window.addEventListener('load', init);
    var rt; window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(function () { pad(); go(cur, true); }, 120); });
  });
})();
