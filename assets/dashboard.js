/* ================= 聚变 JuBian AI · 控制台逻辑 ================= */
const user = Auth.require();
if (user) {
  document.getElementById('uName').textContent = user.name || '开发者';
  document.getElementById('uPlan').textContent = user.plan || 'Starter 开发者版';
  const w = document.getElementById('welcomeName'); if (w) w.textContent = '欢迎回来，' + (user.name || '开发者') + ' 👋';
  const s = document.getElementById('setName'); if (s) s.value = user.name || '';
  const e = document.getElementById('setEmail'); if (e) e.value = user.email || '';
}

/* ---------- Mock data ---------- */
// 覆盖 游戏 / 化妆品 / 日化 / 休闲应用 等真实消费行业，头像用真实行业图片
const IMG = {
  game1: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?auto=format&fit=crop&w=120&h=120&q=80',
  game2: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=120&h=120&q=80',
  beauty: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=120&h=120&q=80',
  fmcg: 'https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=120&h=120&q=80',
  casual: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=120&h=120&q=80'
};
const apps = [
  { id: 1, name: '萌宠泡泡龙', cat: '休闲游戏', img: IMG.game1, platform: 'iOS / Android', slots: 4, status: 'on', revenue: 32480, fill: 98.6 },
  { id: 2, name: '花漾美妆商城', cat: '化妆品', img: IMG.beauty, platform: 'Web / 小程序', slots: 3, status: 'on', revenue: 21860, fill: 97.2 },
  { id: 3, name: '洁净生活日化旗舰', cat: '日用快消', img: IMG.fmcg, platform: 'H5 / 小程序', slots: 2, status: 'on', revenue: 18940, fill: 99.1 },
  { id: 4, name: '悠享记账', cat: '休闲工具', img: IMG.casual, platform: '小程序', slots: 3, status: 'on', revenue: 9120, fill: 95.4 },
  { id: 5, name: '王牌飞车竞速', cat: '竞速游戏', img: IMG.game2, platform: 'Android', slots: 2, status: 'off', revenue: 0, fill: 0 }
];

const channels = [
  { id: 'admob', name: 'AdMob', logo: 'googleads', type: '广告聚合', on: true, ecpm: 46.2, fill: 98.4, rev: 28640 },
  { id: 'pangle', name: 'Pangle 穿山甲', logo: 'tiktok', type: '广告聚合', on: true, ecpm: 41.7, fill: 97.8, rev: 24180 },
  { id: 'tencent', name: '腾讯广告 / 优量汇', logo: 'tencentqq', type: '广告聚合', on: true, ecpm: 35.1, fill: 96.2, rev: 15920 },
  { id: 'meta', name: 'Meta Audience', logo: 'meta', type: '海外广告', on: true, ecpm: 38.9, fill: 94.5, rev: 12340 },
  { id: 'unity', name: 'Unity Ads', logo: 'unity', type: '游戏激励', on: false, ecpm: 29.4, fill: 90.1, rev: 0 },
  { id: 'openai', name: 'OpenAI 计费', logo: 'openai', type: 'API 分账', on: true, ecpm: 29.4, fill: 100, rev: 9860 },
  { id: 'stripe', name: 'Stripe 订阅', logo: 'stripe', type: '会员订阅', on: true, ecpm: 0, fill: 100, rev: 6420 },
  { id: 'bidou', name: '兜底渠道', logo: 'buffer', type: '兜底补量', on: true, ecpm: 12.0, fill: 100, rev: 2180 }
];

let billing = [
  { no: 'W20260915001', type: '提现', amt: -50000, way: '招商银行 ****8821', st: 'ok', time: '2026-09-15 10:24' },
  { no: 'S20260915002', type: '收益结算', amt: 86420, way: 'T+1 自动入账', st: 'ok', time: '2026-09-15 02:00' },
  { no: 'W20260914003', type: '提现', amt: -30000, way: '支付宝', st: 'warn', time: '2026-09-14 18:12' },
  { no: 'S20260914004', type: '收益结算', amt: 78210, way: 'T+1 自动入账', st: 'ok', time: '2026-09-14 02:00' },
  { no: 'W20260913005', type: '提现', amt: -20000, way: '招商银行 ****8821', st: 'warn', time: '2026-09-13 21:40' }
];

const rnd = (min, max) => Math.round(min + Math.random() * (max - min));

/* build report rows: last 30 days x active apps x active channels (sampled) */
let reportRows = [];
(function buildReports() {
  const activeApps = apps.filter(a => a.status === 'on');
  const activeChans = channels.filter(c => c.on && c.type !== '会员订阅');
  for (let d = 0; d < 30; d++) {
    const date = new Date(2026, 8, 15 - d);
    const ds = date.toISOString().slice(0, 10);
    activeApps.forEach(a => activeChans.forEach(c => {
      if (Math.random() < 0.5) return; // sample to keep table readable
      const req = rnd(80000, 600000);
      const fill = +(90 + Math.random() * 9).toFixed(1);
      const imp = Math.round(req * fill / 100);
      const clk = Math.round(imp * (0.008 + Math.random() * 0.03));
      const ecpm = +(c.ecpm * (0.8 + Math.random() * 0.5)).toFixed(1);
      const rev = Math.round(imp / 1000 * ecpm);
      reportRows.push({ date: ds, app: a.name, chan: c.name, req, fill, imp, clk, ecpm, rev });
    }));
  }
  reportRows.sort((x, y) => y.date.localeCompare(x.date) || y.rev - x.rev);
})();

/* ---------- View switching ---------- */
const titles = { overview: '数据概览', reports: '收益报表', channels: '变现渠道', apps: '应用与广告位', strategy: '竞价策略', audience: '人群与意图', review: 'AI 物料审核', orders: '商单市场', messages: '消息中心', billing: '结算中心', settings: '账户设置' };
let charts = {};
document.querySelectorAll('.side-link').forEach(link => {
  link.addEventListener('click', () => {
    const v = link.dataset.view;
    document.querySelectorAll('.side-link').forEach(l => l.classList.remove('active'));
    link.classList.add('active');
    document.querySelectorAll('.view').forEach(sec => sec.classList.remove('active'));
    document.getElementById('v-' + v).classList.add('active');
    document.getElementById('pageTitle').textContent = titles[v];
    document.getElementById('content').scrollTo(0, 0);
    onView(v);
    toggleSide(false);
  });
});
function onView(v) {
  if (v === 'overview') renderOverview();
  if (v === 'reports') renderReports();
  if (v === 'channels') renderChannels();
  if (v === 'apps') renderApps();
  if (v === 'strategy') renderStrategy();
  if (v === 'audience') renderAudience();
  if (v === 'review') renderReview();
  if (v === 'orders') renderOrders();
  if (v === 'messages') renderMessages();
  if (v === 'billing') renderBilling();
}
function toggleSide(open) {
  document.getElementById('sidebar').classList.toggle('open', open);
  document.getElementById('sideMask').classList.toggle('show', open);
}

/* ---------- Modal helpers ---------- */
function openModal(title, body, footer) {
  document.getElementById('modalBox').innerHTML =
    '<div class="modal-h"><h3>' + title + '</h3><button class="x" onclick="closeModal()">&times;</button></div>' +
    '<div class="modal-b">' + body + '</div>' +
    '<div class="modal-f">' + footer + '</div>';
  document.getElementById('modalMask').classList.add('open');
}
function closeModal() { document.getElementById('modalMask').classList.remove('open'); }
document.getElementById('modalMask').addEventListener('click', e => { if (e.target.id === 'modalMask') closeModal(); });

/* ---------- Overview ---------- */
const CN = ['#2b6cf6', '#06a7ff', '#1e50c8', '#10b981', '#f59e0b'];
function seriesFor(days) {
  const labels = [], sets = [
    { label: '广告', data: [], color: '#2b6cf6' },
    { label: 'API 计费', data: [], color: '#06a7ff' },
    { label: '订阅', data: [], color: '#1e50c8' },
    { label: 'Agent 分成', data: [], color: '#10b981' }
  ];
  for (let i = days - 1; i >= 0; i--) {
    const dt = new Date(2026, 8, 15 - i);
    labels.push((dt.getMonth() + 1) + '/' + dt.getDate());
    sets[0].data.push(rnd(38000, 52000));
    sets[1].data.push(rnd(18000, 30000));
    sets[2].data.push(rnd(9000, 16000));
    sets[3].data.push(rnd(3000, 8000));
  }
  return { labels, sets };
}
let trendType = 'area';
function setTrendType(t, btn) { trendType = t; document.querySelectorAll('#trendType button').forEach(b => b.classList.remove('active')); btn.classList.add('active'); renderTrend(); }
function renderTrend() {
  const days = +document.getElementById('trendRange').value;
  const { labels, sets } = seriesFor(days);
  if (charts.trend) charts.trend.destroy();
  const isBar = trendType === 'bar', isArea = trendType === 'area';
  charts.trend = new Chart(document.getElementById('trendChart'), {
    type: isBar ? 'bar' : 'line',
    data: { labels, datasets: sets.map(s => isBar
      ? { label: s.label, data: s.data, backgroundColor: s.color, borderRadius: 4, stack: 'a' }
      : { label: s.label, data: s.data, borderColor: s.color, backgroundColor: s.color + '26', fill: isArea, tension: .4, borderWidth: 2.5, pointRadius: 0, pointHoverRadius: 5 }) },
    options: { responsive: true, maintainAspectRatio: false, interaction: { mode: 'index', intersect: false }, plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, boxWidth: 8 } }, tooltip: { callbacks: { label: c => c.dataset.label + ': ¥' + c.parsed.y.toLocaleString() } } }, scales: { y: { stacked: isBar, grid: { color: '#eef0f6' }, ticks: { callback: v => '¥' + (v / 1000) + 'k' } }, x: { stacked: isBar, grid: { display: false } } } }
  });
}
function renderMix() {
  if (charts.mix) charts.mix.destroy();
  charts.mix = new Chart(document.getElementById('mixChart'), {
    type: 'doughnut',
    data: { labels: ['广告变现', 'API 计费', '订阅会员', 'Agent 分成'], datasets: [{ data: [52, 28, 14, 6], backgroundColor: CN, borderWidth: 0 }] },
    options: { responsive: true, maintainAspectRatio: false, cutout: '64%', plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, boxWidth: 8 } } } }
  });
}
function renderRank() {
  const list = channels.filter(c => c.on).sort((a, b) => b.ecpm - a.ecpm);
  const max = Math.max(...list.map(c => c.ecpm)) || 1;
  document.getElementById('rankList').innerHTML = list.map((c, i) =>
    '<div style="display:flex;align-items:center;gap:14px;padding:11px 0;border-bottom:1px solid var(--line)">' +
    '<b style="width:22px;color:var(--ink-dim)">' + (i + 1) + '</b>' +
    '<img src="https://cdn.simpleicons.org/' + c.logo + '" alt="' + c.name + '" style="width:26px;height:26px;object-fit:contain" onerror="this.style.visibility=\'hidden\'" />' +
    '<span style="font-weight:700;min-width:150px">' + c.name + '</span>' +
    '<div class="prog" style="flex:1"><span style="width:' + (c.ecpm / max * 100) + '%"></span></div>' +
    '<b style="min-width:74px;text-align:right">¥' + c.ecpm.toFixed(1) + '</b></div>'
  ).join('');
}
function renderFunnel() {
  const steps = [
    { label: '请求', val: 1284, color: '#1e50c8' },
    { label: '填充', val: 1268, color: '#2b6cf6' },
    { label: '曝光', val: 1201, color: '#3b82f6' },
    { label: '点击', val: 96, color: '#06a7ff' },
    { label: '转化', val: 38, color: '#22c3aa' }
  ];
  const max = steps[0].val;
  document.getElementById('funnel').innerHTML = steps.map((s, i) => {
    const w = Math.max(18, s.val / max * 100);
    const rate = i === 0 ? '100%' : (s.val / steps[i - 1].val * 100).toFixed(1) + '%';
    const unit = s.val >= 100 ? (s.val / 100).toFixed(0) + '万' : s.val + '万';
    return '<div class="funnel-row"><span class="fl-label">' + s.label + '</span>' +
      '<div class="fl-track"><div class="funnel-bar" style="width:' + w + '%;background:' + s.color + '"><span>' + unit + '</span></div></div>' +
      '<span class="fl-rate">' + rate + '</span></div>';
  }).join('');
}
function renderHealth() {
  const score = 87;
  const ring = document.getElementById('healthRing');
  ring.style.background = 'conic-gradient(#2b6cf6 ' + (score * 3.6) + 'deg, #eaeff8 0)';
  const el = document.getElementById('healthScore'); let n = 0;
  const tick = () => { n += 3; if (n >= score) n = score; el.textContent = n; if (n < score) requestAnimationFrame(tick); };
  requestAnimationFrame(tick);
  const items = [
    { t: '收益增长', v: 92 }, { t: '填充率', v: 98 }, { t: '用户体验', v: 81 }, { t: '合规健康', v: 76 }
  ];
  document.getElementById('healthItems').innerHTML = items.map(i =>
    '<div class="hi"><div class="hi-top"><b>' + i.t + '</b><span>' + i.v + '</span></div><div class="prog"><span style="width:' + i.v + '%"></span></div></div>').join('');
}
function renderOverview() { renderTrend(); renderMix(); renderRank(); renderFunnel(); renderHealth(); }

/* ---------- Reports ---------- */
let rpFilled = false;
function fillReportFilters() {
  if (rpFilled) return; rpFilled = true;
  const appSel = document.getElementById('rpApp'), chSel = document.getElementById('rpChan');
  apps.forEach(a => appSel.insertAdjacentHTML('beforeend', '<option>' + a.name + '</option>'));
  [...new Set(reportRows.map(r => r.chan))].forEach(c => chSel.insertAdjacentHTML('beforeend', '<option>' + c + '</option>'));
}
function filteredReports() {
  fillReportFilters();
  const app = document.getElementById('rpApp').value;
  const chan = document.getElementById('rpChan').value;
  const days = +document.getElementById('rpDays').value;
  const kw = document.getElementById('rpSearch').value.trim();
  const cutoff = new Date(2026, 8, 15 - days + 1).toISOString().slice(0, 10);
  return reportRows.filter(r =>
    (!app || r.app === app) && (!chan || r.chan === chan) && r.date >= cutoff &&
    (!kw || r.date.includes(kw) || r.app.includes(kw) || r.chan.includes(kw)));
}
function renderReports() {
  const rows = filteredReports();
  const sum = rows.reduce((a, r) => ({ req: a.req + r.req, imp: a.imp + r.imp, clk: a.clk + r.clk, rev: a.rev + r.rev }), { req: 0, imp: 0, clk: 0, rev: 0 });
  const fill = sum.req ? (sum.imp / sum.req * 100).toFixed(1) : 0;
  const ecpm = sum.imp ? (sum.rev / sum.imp * 1000).toFixed(1) : 0;
  document.getElementById('rpSummary').innerHTML =
    kpiMini('t-green', 'ri-money-cny-circle-line', '¥' + sum.rev.toLocaleString(), '总收益') +
    kpiMini('t-indigo', 'ri-eye-line', sum.imp.toLocaleString(), '曝光/调用') +
    kpiMini('t-cyan', 'ri-focus-2-line', fill + '%', '平均填充率') +
    kpiMini('t-violet', 'ri-funds-box-line', '¥' + ecpm, '平均 eCPM');
  document.getElementById('rpBody').innerHTML = rows.length ? rows.slice(0, 80).map(r =>
    '<tr><td>' + r.date + '</td><td>' + r.app + '</td><td>' + r.chan + '</td><td>' + r.req.toLocaleString() + '</td>' +
    '<td>' + r.fill + '%</td><td>' + r.imp.toLocaleString() + '</td><td>' + r.clk.toLocaleString() + '</td>' +
    '<td>¥' + r.ecpm + '</td><td class="pos">¥' + r.rev.toLocaleString() + '</td></tr>').join('')
    : '<tr><td colspan="9"><div class="empty"><i class="ri-inbox-line"></i>没有符合条件的数据</div></td></tr>';
  renderReportsCharts(rows);
}
let rpTrendType = 'line';
function setRpTrendType(t, btn) { rpTrendType = t; document.querySelectorAll('#rpTrendType button').forEach(b => b.classList.remove('active')); btn.classList.add('active'); renderReports(); }
function renderReportsCharts(rows) {
  const byDate = {}, byChan = {};
  rows.forEach(r => { byDate[r.date] = (byDate[r.date] || 0) + r.rev; byChan[r.chan] = (byChan[r.chan] || 0) + r.rev; });
  const dates = Object.keys(byDate).sort();
  const chans = Object.keys(byChan).sort((a, b) => byChan[b] - byChan[a]);
  if (charts.rpTrend) charts.rpTrend.destroy();
  charts.rpTrend = new Chart(document.getElementById('rpTrendChart'), {
    type: rpTrendType,
    data: { labels: dates.map(d => d.slice(5)), datasets: [{ label: '收益', data: dates.map(d => byDate[d]), borderColor: '#2b6cf6', backgroundColor: rpTrendType === 'bar' ? '#2b6cf6' : 'rgba(43,108,246,.15)', fill: rpTrendType !== 'bar', tension: .4, borderWidth: 2.5, borderRadius: 4, pointRadius: 0, pointHoverRadius: 5 }] },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => '¥' + c.parsed.y.toLocaleString() } } }, scales: { y: { grid: { color: '#eef0f6' }, ticks: { callback: v => '¥' + (v / 1000) + 'k' } }, x: { grid: { display: false } } } }
  });
  if (charts.rpChan) charts.rpChan.destroy();
  charts.rpChan = new Chart(document.getElementById('rpChanChart'), {
    type: 'bar',
    data: { labels: chans, datasets: [{ label: '收益', data: chans.map(c => byChan[c]), backgroundColor: chans.map((_, i) => CN[i % CN.length]), borderRadius: 6 }] },
    options: { indexAxis: 'y', responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => '¥' + c.parsed.x.toLocaleString() } } }, scales: { x: { grid: { color: '#eef0f6' }, ticks: { callback: v => '¥' + (v / 1000) + 'k' } }, y: { grid: { display: false } } } }
  });
}
function kpiMini(t, ic, val, lbl) {
  return '<div class="kpi"><div class="top"><span class="ki ' + t + '"><i class="' + ic + '"></i></span></div><div class="val" style="font-size:24px">' + val + '</div><div class="lbl">' + lbl + '</div></div>';
}
function exportCSV() {
  const rows = filteredReports();
  const head = ['日期', '应用', '渠道', '请求', '填充率', '曝光', '点击', 'eCPM', '收益'];
  const csv = [head.join(',')].concat(rows.map(r => [r.date, r.app, r.chan, r.req, r.fill + '%', r.imp, r.clk, r.ecpm, r.rev].join(','))).join('\n');
  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob); a.download = 'jubian_report.csv'; a.click();
  toast('已导出 ' + rows.length + ' 条数据');
}

/* ---------- Channels ---------- */
function renderChannels() {
  document.getElementById('chOnCount').textContent = channels.filter(c => c.on).length;
  document.getElementById('chnCards').innerHTML = channels.map(c =>
    '<div class="chn-card"><div class="ch-top">' +
    '<img src="https://cdn.simpleicons.org/' + c.logo + '" onerror="this.style.visibility=\'hidden\'" alt="' + c.name + '" />' +
    '<div><b>' + c.name + '</b><small>' + c.type + '</small></div>' +
    '<label class="switch"><input type="checkbox" ' + (c.on ? 'checked' : '') + ' onchange="toggleChannel(\'' + c.id + '\',this.checked)"><span class="sl"></span></label></div>' +
    '<div class="ch-metrics"><div><small>eCPM</small><b>¥' + c.ecpm.toFixed(1) + '</b></div><div><small>填充率</small><b>' + c.fill + '%</b></div><div><small>今日收益</small><b>¥' + c.rev.toLocaleString() + '</b></div></div></div>'
  ).join('');
}
function toggleChannel(id, on) {
  const c = channels.find(x => x.id === id); c.on = on;
  document.getElementById('chOnCount').textContent = channels.filter(x => x.on).length;
  toast((on ? '已开启 ' : '已关闭 ') + c.name + '，竞价分配已更新', on ? 'ok' : 'warn');
}
function openChannelModal() {
  openModal('接入新渠道',
    '<div class="form-row"><label>渠道名称</label><input id="ncName" placeholder="如 AppLovin / Yandex" /></div>' +
    '<div class="form-2"><div class="form-row"><label>渠道类型</label><select id="ncType"><option>广告聚合</option><option>海外广告</option><option>游戏激励</option><option>API 分账</option><option>会员订阅</option></select></div>' +
    '<div class="form-row"><label>App ID / 密钥</label><input id="ncKey" placeholder="渠道分配的 ID" /></div></div>',
    '<button class="btn btn-ghost btn-sm" onclick="closeModal()">取消</button><button class="btn btn-primary btn-sm" onclick="addChannel()">确认接入</button>');
}
function addChannel() {
  const name = document.getElementById('ncName').value.trim();
  if (!name) { toast('请填写渠道名称', 'warn'); return; }
  channels.push({ id: 'c' + Date.now(), name, logo: 'buffer', type: document.getElementById('ncType').value, on: true, ecpm: rnd(15, 40), fill: +(90 + Math.random() * 8).toFixed(1), rev: 0 });
  closeModal(); renderChannels(); toast('渠道「' + name + '」已接入');
}

/* ---------- Apps ---------- */
function renderApps() {
  document.getElementById('appBody').innerHTML = apps.map(a =>
    '<tr><td><div class="cell-app"><img class="ax" src="' + a.img + '" alt="" /><div><div>' + a.name + '</div><small style="color:var(--ink-dim);font-weight:500">' + a.cat + '</small></div></div></td>' +
    '<td>' + a.platform + '</td><td>' + a.slots + ' 个</td>' +
    '<td><span class="pill ' + (a.status === 'on' ? 'on' : 'off') + '">' + (a.status === 'on' ? '● 运行中' : '○ 已暂停') + '</span></td>' +
    '<td class="' + (a.revenue ? 'pos' : '') + '">¥' + a.revenue.toLocaleString() + '</td>' +
    '<td>' + (a.fill ? a.fill + '%' : '—') + '</td>' +
    '<td><div class="row-act">' +
    '<button title="' + (a.status === 'on' ? '暂停' : '启用') + '" onclick="toggleApp(' + a.id + ')"><i class="ri-' + (a.status === 'on' ? 'pause' : 'play') + '-line"></i></button>' +
    '<button title="编辑" onclick="openAppModal(' + a.id + ')"><i class="ri-edit-line"></i></button>' +
    '<button title="删除" onclick="delApp(' + a.id + ')"><i class="ri-delete-bin-line"></i></button></div></td></tr>'
  ).join('');
}
function toggleApp(id) { const a = apps.find(x => x.id === id); a.status = a.status === 'on' ? 'off' : 'on'; if (a.status === 'off') { a.revenue = 0; a.fill = 0; } else { a.fill = +(95 + Math.random() * 4).toFixed(1); a.revenue = rnd(5000, 30000); } renderApps(); toast(a.name + (a.status === 'on' ? ' 已启用' : ' 已暂停'), a.status === 'on' ? 'ok' : 'warn'); }
function delApp(id) {
  const a = apps.find(x => x.id === id);
  openModal('删除应用', '<p>确定删除应用 <b>' + a.name + '</b> 吗？该操作会移除其全部广告位配置，且不可恢复。</p>',
    '<button class="btn btn-ghost btn-sm" onclick="closeModal()">取消</button><button class="btn btn-primary btn-sm" style="background:var(--danger);box-shadow:none" onclick="confirmDelApp(' + id + ')">确认删除</button>');
}
function confirmDelApp(id) { const i = apps.findIndex(x => x.id === id); const nm = apps[i].name; apps.splice(i, 1); closeModal(); renderApps(); toast('已删除「' + nm + '」', 'warn'); }
function openAppModal(id) {
  const a = id ? apps.find(x => x.id === id) : null;
  const cats = ['休闲游戏', '竞速游戏', '化妆品', '日用快消', '休闲工具'];
  openModal(a ? '编辑应用' : '新建应用',
    '<div class="form-row"><label>应用名称</label><input id="apName" value="' + (a ? a.name : '') + '" placeholder="如 花漾美妆商城" /></div>' +
    '<div class="form-2"><div class="form-row"><label>行业分类</label><select id="apCat">' + cats.map(c => '<option ' + (a && a.cat === c ? 'selected' : '') + '>' + c + '</option>').join('') + '</select></div>' +
    '<div class="form-row"><label>平台</label><select id="apPlat"><option ' + sel(a, 'iOS / Android') + '>iOS / Android</option><option ' + sel(a, 'Web / 小程序') + '>Web / 小程序</option><option ' + sel(a, 'H5 / 小程序') + '>H5 / 小程序</option><option ' + sel(a, '小程序') + '>小程序</option><option ' + sel(a, 'Android') + '>Android</option></select></div></div>' +
    '<div class="form-row"><label>广告位 / 计费项数量</label><input id="apSlots" type="number" min="1" value="' + (a ? a.slots : 3) + '" /></div>',
    '<button class="btn btn-ghost btn-sm" onclick="closeModal()">取消</button><button class="btn btn-primary btn-sm" onclick="saveApp(' + (id || 0) + ')">保存</button>');
}
function sel(a, v) { return a && a.platform === v ? 'selected' : ''; }
function catImg(cat) { return cat.includes('游戏') ? (cat.includes('竞速') ? IMG.game2 : IMG.game1) : cat.includes('化妆') ? IMG.beauty : cat.includes('快消') ? IMG.fmcg : IMG.casual; }
function saveApp(id) {
  const name = document.getElementById('apName').value.trim();
  if (!name) { toast('请填写应用名称', 'warn'); return; }
  const plat = document.getElementById('apPlat').value, slots = +document.getElementById('apSlots').value || 1;
  const cat = document.getElementById('apCat').value;
  if (id) { const a = apps.find(x => x.id === id); a.name = name; a.platform = plat; a.slots = slots; a.cat = cat; a.img = catImg(cat); toast('应用已更新'); }
  else { apps.push({ id: Date.now(), name, cat, img: catImg(cat), platform: plat, slots, status: 'on', revenue: rnd(2000, 12000), fill: +(94 + Math.random() * 5).toFixed(1) }); toast('应用「' + name + '」已创建'); }
  closeModal(); renderApps();
}

/* ---------- Strategy ---------- */
let stratMode = 'hybrid';
function renderStrategy() {
  const modes = [
    { id: 'hybrid', name: 'Bidding + Waterfall 混合', desc: '实时竞价与瀑布流结合，收益最优（推荐）' },
    { id: 'bidding', name: '纯实时竞价 Bidding', desc: '全部渠道实时出价，适合高价值流量' },
    { id: 'waterfall', name: '瀑布流 Waterfall', desc: '按固定优先级排序，适合渠道较少时' }
  ];
  document.getElementById('stratModes').innerHTML = modes.map(m =>
    '<label class="set-item" style="cursor:pointer"><div class="st"><b>' + m.name + '</b><small>' + m.desc + '</small></div>' +
    '<input type="radio" name="sm" ' + (m.id === stratMode ? 'checked' : '') + ' onchange="stratMode=\'' + m.id + '\';toast(\'已切换为 ' + m.name + '\')" style="width:20px;height:20px;accent-color:var(--brand)"></label>').join('');
  if (charts.ab) charts.ab.destroy();
  charts.ab = new Chart(document.getElementById('abChart'), {
    type: 'bar',
    data: { labels: ['第1周', '第2周', '第3周', '第4周'], datasets: [
      { label: '策略 A（对照）', data: [42, 45, 44, 46], backgroundColor: '#c2d6ff' },
      { label: '策略 B（AI 优化）', data: [43, 49, 54, 61], backgroundColor: '#2b6cf6' }] },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, boxWidth: 8 } } }, scales: { y: { grid: { color: '#eef0f6' }, ticks: { callback: v => '¥' + v + 'k' } }, x: { grid: { display: false } } } }
  });
}

/* ---------- Billing ---------- */
function renderBilling() {
  document.getElementById('billBody').innerHTML = billing.map(b =>
    '<tr><td>' + b.no + '</td><td>' + b.type + '</td>' +
    '<td class="' + (b.amt < 0 ? 'neg' : 'pos') + '">' + (b.amt < 0 ? '-¥' + Math.abs(b.amt).toLocaleString() : '+¥' + b.amt.toLocaleString()) + '</td>' +
    '<td>' + b.way + '</td>' +
    '<td><span class="pill ' + (b.st === 'ok' ? 'on' : 'warn') + '">' + (b.st === 'ok' ? '● 已完成' : '● 处理中') + '</span></td>' +
    '<td>' + b.time + '</td></tr>').join('');
}
function openWithdrawModal() {
  openModal('申请提现',
    '<p style="color:var(--ink-soft);margin-bottom:16px">可提现余额 <b style="color:var(--brand)">¥128,640</b></p>' +
    '<div class="form-row"><label>提现金额（元）</label><input id="wdAmt" type="number" placeholder="最低 100 元" /></div>' +
    '<div class="form-row"><label>结算账户</label><select id="wdAcc"><option>招商银行 ****8821</option><option>支付宝</option><option>微信</option></select></div>',
    '<button class="btn btn-ghost btn-sm" onclick="closeModal()">取消</button><button class="btn btn-primary btn-sm" onclick="doWithdraw()">提交申请</button>');
}
function doWithdraw() {
  const amt = +document.getElementById('wdAmt').value;
  if (!amt || amt < 100) { toast('提现金额至少 100 元', 'warn'); return; }
  if (amt > 128640) { toast('超出可提现余额', 'warn'); return; }
  billing.unshift({ no: 'W' + Date.now(), type: '提现', amt: -amt, way: document.getElementById('wdAcc').value, st: 'warn', time: '2026-09-16 ' + new Date().toTimeString().slice(0, 5) });
  closeModal(); renderBilling(); toast('提现申请已提交，预计 1 个工作日到账');
}

/* ---------- Settings ---------- */
function saveSettings() {
  const nm = document.getElementById('setName').value.trim();
  const em = document.getElementById('setEmail').value.trim();
  Auth.login(Object.assign({}, user, { name: nm, email: em }));
  document.getElementById('uName').textContent = nm || '开发者';
  toast('资料已保存');
}

/* ---------- Audience & Intent ---------- */
const segments = [
  { id: 1, name: '高价值付费人群', tint: 't-green', ic: 'ri-vip-crown-line', size: '42.8万', arpu: 86, intent: '购买意图', on: true, strategy: '溢价竞价 + 会员/礼包推荐，优先高价广告源' },
  { id: 2, name: '活跃留存人群', tint: 't-indigo', ic: 'ri-heart-pulse-line', size: '128.6万', arpu: 32, intent: '浏览意图', on: true, strategy: '激励视频优先，控制频次保体验' },
  { id: 3, name: '价格敏感人群', tint: 't-cyan', ic: 'ri-price-tag-3-line', size: '76.3万', arpu: 18, intent: '比价意图', on: true, strategy: '优惠券 + 信息流带货，强化转化钩子' },
  { id: 4, name: '流失预警人群', tint: 't-rose', ic: 'ri-alarm-warning-line', size: '23.1万', arpu: 9, intent: '流失意图', on: false, strategy: '召回广告 + 兜底渠道，降低打扰' },
  { id: 5, name: '泛新客人群', tint: 't-amber', ic: 'ri-user-add-line', size: '95.4万', arpu: 12, intent: '探索意图', on: true, strategy: '轻量原生广告，先建立信任再变现' }
];
const intentData = { labels: ['购买意图', '浏览意图', '比价意图', '探索意图', '流失意图'], data: [28, 34, 19, 10, 9], colors: ['#10b981', '#2b6cf6', '#06a7ff', '#f59e0b', '#ef4444'] };
function renderAudience() {
  if (charts.intent) charts.intent.destroy();
  charts.intent = new Chart(document.getElementById('intentChart'), {
    type: 'doughnut',
    data: { labels: intentData.labels, datasets: [{ data: intentData.data, backgroundColor: intentData.colors, borderWidth: 0 }] },
    options: { responsive: true, maintainAspectRatio: false, cutout: '62%', plugins: { legend: { position: 'right', labels: { usePointStyle: true, boxWidth: 8, padding: 12 } } } }
  });
  const tips = [
    { c: '#10b981', t: '购买意图', x: '直接推商品/会员，接入高价竞价源', p: 'eCPM ×1.8' },
    { c: '#2b6cf6', t: '浏览意图', x: '激励视频 + 原生信息流，提升时长', p: '+38% 时长' },
    { c: '#06a7ff', t: '比价意图', x: '优惠券 + 比价落地页分成', p: '×2.1 转化' },
    { c: '#f59e0b', t: '探索意图', x: '轻广告密度，优先留存', p: '留存 +12%' },
    { c: '#ef4444', t: '流失意图', x: '召回广告 + 兜底，避免过度打扰', p: '召回 8.4%' }
  ];
  document.getElementById('intentTips').innerHTML = tips.map(t =>
    '<div class="tip-row"><span class="tdot" style="background:' + t.c + '"></span><span class="tt">' + t.t + '</span><span class="tx">' + t.x + '</span><span class="tp">' + t.p + '</span></div>').join('');
  renderSegments();
}
function renderSegments() {
  document.getElementById('segGrid').innerHTML = segments.map(s =>
    '<div class="seg"><div class="seg-top"><span class="seg-ic ' + s.tint + '"><i class="' + s.ic + '"></i></span>' +
    '<div><b>' + s.name + '</b><span class="intent">主导意图：' + s.intent + '</span></div>' +
    '<label class="switch"><input type="checkbox" ' + (s.on ? 'checked' : '') + ' onchange="toggleSeg(' + s.id + ',this.checked)"><span class="sl"></span></label></div>' +
    '<div class="seg-stat"><div><small>人群规模</small><b>' + s.size + '</b></div><div><small>人均 ARPU</small><b>¥' + s.arpu + '</b></div></div>' +
    '<div class="seg-strategy"><span>' + s.strategy + '</span><a onclick="openStrategyEdit(' + s.id + ')">调整</a></div></div>').join('');
}
function toggleSeg(id, on) { const s = segments.find(x => x.id === id); s.on = on; toast((on ? '已启用 ' : '已暂停 ') + s.name + ' 定向策略', on ? 'ok' : 'warn'); }
function openStrategyEdit(id) {
  const s = segments.find(x => x.id === id);
  openModal('调整定向策略 · ' + s.name,
    '<div class="form-row"><label>主导意图</label><select id="segIntent"><option ' + (s.intent === '购买意图' ? 'selected' : '') + '>购买意图</option><option ' + (s.intent === '浏览意图' ? 'selected' : '') + '>浏览意图</option><option ' + (s.intent === '比价意图' ? 'selected' : '') + '>比价意图</option><option ' + (s.intent === '探索意图' ? 'selected' : '') + '>探索意图</option><option ' + (s.intent === '流失意图' ? 'selected' : '') + '>流失意图</option></select></div>' +
    '<div class="form-row"><label>变现策略</label><input id="segStrategy" value="' + s.strategy + '" /></div>' +
    '<div class="form-row"><label>竞价溢价系数：<b id="segMul" style="color:var(--brand)">1.5</b>×</label><input type="range" min="0.5" max="3" step="0.1" value="1.5" style="width:100%" oninput="document.getElementById(\'segMul\').textContent=this.value" /></div>',
    '<button class="btn btn-ghost btn-sm" onclick="closeModal()">取消</button><button class="btn btn-primary btn-sm" onclick="saveSeg(' + id + ')">保存策略</button>');
}
function saveSeg(id) {
  const s = segments.find(x => x.id === id);
  s.intent = document.getElementById('segIntent').value;
  s.strategy = document.getElementById('segStrategy').value.trim() || s.strategy;
  closeModal(); renderSegments(); toast(s.name + ' 策略已更新并下发');
}
function openAudienceModal() {
  openModal('新建人群包',
    '<div class="form-row"><label>人群包名称</label><input id="segName" placeholder="如 近7日高活跃玩家" /></div>' +
    '<div class="form-2"><div class="form-row"><label>主导意图</label><select id="segNewIntent"><option>购买意图</option><option>浏览意图</option><option>比价意图</option><option>探索意图</option><option>流失意图</option></select></div>' +
    '<div class="form-row"><label>圈选方式</label><select><option>行为标签组合</option><option>RFM 模型</option><option>Lookalike 相似扩量</option><option>自定义规则</option></select></div></div>',
    '<button class="btn btn-ghost btn-sm" onclick="closeModal()">取消</button><button class="btn btn-primary btn-sm" onclick="addSeg()">创建人群包</button>');
}
function addSeg() {
  const name = document.getElementById('segName').value.trim();
  if (!name) { toast('请填写人群包名称', 'warn'); return; }
  segments.push({ id: Date.now(), name, tint: 't-violet', ic: 'ri-group-2-line', size: rnd(5, 90) + '.' + rnd(0, 9) + '万', arpu: rnd(10, 60), intent: document.getElementById('segNewIntent').value, on: true, strategy: 'AI 自动匹配最优变现策略' });
  closeModal(); renderSegments(); toast('人群包「' + name + '」已创建');
}

/* ---------- AI Creative Review ---------- */
const RVIMG = {
  beauty: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=500&q=80',
  game: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=500&q=80',
  fmcg: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=500&q=80',
  casual: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=500&q=80',
  race: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=500&q=80',
  cosmetic2: 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=500&q=80'
};
let materials = [
  { id: 1, title: '夏日限定美妆礼盒', app: '花漾美妆商城', img: RVIMG.beauty, type: '开屏广告', status: 'pending', score: 92, tags: ['美妆', '促销', '高点击'], risks: [] },
  { id: 2, title: '极速漂移 全新赛道', app: '王牌飞车竞速', img: RVIMG.race, type: '激励视频', status: 'pending', score: 88, tags: ['游戏', '竞速', '男性向'], risks: [] },
  { id: 3, title: '买一送一 限时秒杀', app: '洁净生活日化旗舰', img: RVIMG.fmcg, type: '信息流', status: 'risk', score: 61, tags: ['日化', '促销'], risks: ['疑似夸大宣传', '价格未标原价'] },
  { id: 4, title: '轻松记账 理财小助手', app: '悠享记账', img: RVIMG.casual, type: '信息流', status: 'pending', score: 90, tags: ['工具', '理财', '轻量'], risks: [] },
  { id: 5, title: '泡泡龙冲榜赢好礼', app: '萌宠泡泡龙', img: RVIMG.game, type: '插屏广告', status: 'pending', score: 85, tags: ['游戏', '休闲', '女性向'], risks: [] },
  { id: 6, title: '大牌口红 5 折抢购', app: '花漾美妆商城', img: RVIMG.cosmetic2, type: '信息流', status: 'pass', score: 95, tags: ['美妆', '大牌', '高转化'], risks: [] }
];
let rvFilter = 'all';
function setReviewFilter(f, btn) { rvFilter = f; document.querySelectorAll('#rvTabs button').forEach(b => b.classList.remove('active')); btn.classList.add('active'); renderReview(); }
function renderReview() {
  const pending = materials.filter(m => m.status === 'pending').length;
  const risk = materials.filter(m => m.status === 'risk').length;
  document.getElementById('rvPending').textContent = pending;
  document.getElementById('rvRisk').textContent = risk;
  const badge = document.getElementById('reviewBadge'); if (badge) { badge.textContent = pending; badge.style.display = pending ? '' : 'none'; }
  const list = materials.filter(m => rvFilter === 'all' ? true : rvFilter === 'risk' ? m.status === 'risk' : m.status === rvFilter);
  const box = document.getElementById('rvGrid');
  if (!list.length) { box.innerHTML = '<div class="empty" style="grid-column:1/-1"><i class="ri-checkbox-circle-line"></i>该分类下没有物料</div>'; return; }
  box.innerHTML = list.map(m => {
    const verdict = m.status === 'pass' ? '<span class="rv-verdict pass"><i class="ri-shield-check-line"></i> AI 建议通过</span>'
      : m.status === 'risk' ? '<span class="rv-verdict risk"><i class="ri-error-warning-line"></i> AI 命中风险</span>'
      : '<span class="rv-verdict pending"><i class="ri-time-line"></i> 待人工确认</span>';
    const risks = m.risks.map(r => '<span class="tag-chip risk"><i class="ri-alert-line"></i>' + r + '</span>').join('');
    const tags = m.tags.map(t => '<span class="tag-chip"># ' + t + '</span>').join('');
    return '<div class="rv-card"><div class="rv-thumb"><img src="' + m.img + '" alt="" onerror="this.src=\'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500&q=80\'" />' +
      '<span class="rv-type">' + m.type + '</span><span class="rv-score">AI 评分 ' + m.score + '</span></div>' +
      '<div class="rv-body"><div class="rv-title">' + m.title + '</div><div class="rv-app">' + m.app + '</div>' + verdict +
      '<div class="tags">' + risks + tags + '<span class="tag-chip add" onclick="addTag(' + m.id + ')"><i class="ri-add-line"></i>打标</span></div>' +
      '<div class="rv-acts"><button class="ok" onclick="reviewAct(' + m.id + ',\'pass\')"><i class="ri-check-line"></i>通过</button>' +
      '<button class="no" onclick="reviewAct(' + m.id + ',\'reject\')"><i class="ri-close-line"></i>拒绝</button>' +
      '<button class="rc" onclick="toast(\'已转人工复核\')"><i class="ri-user-search-line"></i></button></div></div></div>';
  }).join('');
}
function reviewAct(id, act) {
  const m = materials.find(x => x.id === id);
  if (act === 'pass') { m.status = 'pass'; toast('物料「' + m.title + '」已通过', 'ok'); }
  else { materials = materials.filter(x => x.id !== id); toast('物料「' + m.title + '」已拒绝', 'warn'); }
  renderReview();
}
function addTag(id) {
  const m = materials.find(x => x.id === id);
  openModal('为物料打标 · ' + m.title,
    '<p style="color:var(--ink-soft);margin-bottom:12px">已有标签：' + (m.tags.map(t => '# ' + t).join('、') || '无') + '</p>' +
    '<div class="form-row"><label>新增标签（多个用逗号分隔）</label><input id="tagInput" placeholder="如 节日营销, 高转化, 女性向" /></div>' +
    '<div style="display:flex;flex-wrap:wrap;gap:6px">' + ['节日营销', '高转化', '女性向', '男性向', '国潮', '低俗风险'].map(t => '<span class="tag-chip add" onclick="var i=document.getElementById(\'tagInput\');i.value=(i.value?i.value+\', \':\'\')+\'' + t + '\'">+ ' + t + '</span>').join('') + '</div>',
    '<button class="btn btn-ghost btn-sm" onclick="closeModal()">取消</button><button class="btn btn-primary btn-sm" onclick="saveTag(' + id + ')">保存标签</button>');
}
function saveTag(id) {
  const m = materials.find(x => x.id === id);
  const raw = document.getElementById('tagInput').value.trim();
  if (!raw) { toast('请输入标签', 'warn'); return; }
  raw.split(/[,，]/).map(s => s.trim()).filter(Boolean).forEach(t => { if (!m.tags.includes(t)) m.tags.push(t); });
  closeModal(); renderReview(); toast('已为「' + m.title + '」更新标签');
}

/* ---------- Brand Order Marketplace ---------- */
let orders = [
  { id: 1, brand: '花西子', ini: '花', color: 'linear-gradient(135deg,#f472b6,#db2777)', cat: '美妆', title: '国风美妆小程序商城 + AI 虚拟试妆', appType: '微信小程序', need: '需要搭建国风美妆商城小程序，集成 AI 虚拟试妆、会员体系与优惠券营销，要求高颜值、加载快，并接入广告与分成变现。', budget: '¥5万 - 8万', cycle: '6 周', tags: ['小程序', 'AI试妆', '电商', '会员'], status: 'open', origin: 'market', applicants: 12, acceptedByMe: false, messages: [] },
  { id: 2, brand: '米哈游', ini: '米', color: 'linear-gradient(135deg,#60a5fa,#2563eb)', cat: '游戏', title: '休闲小游戏联运与激励变现接入', appType: 'iOS / Android', need: '旗下休闲小游戏寻求联运与 SDK 接入，需完成激励视频/插屏变现策略配置与竞价优化，目标提升 ARPU 20% 以上。', budget: '¥3万 - 5万', cycle: '4 周', tags: ['游戏', 'SDK', '激励视频', '竞价'], status: 'open', origin: 'market', applicants: 26, acceptedByMe: false, messages: [] },
  { id: 3, brand: '蓝月亮', ini: '蓝', color: 'linear-gradient(135deg,#38bdf8,#0284c7)', cat: '日化快消', title: 'H5 扫码营销活动页开发', appType: 'H5 落地页', need: '新品上市需要一套扫码抽奖 + 优惠券领取的 H5 营销活动页，支持防伪码核销，并在活动页轻量接入广告变现。', budget: '¥1万 - 2万', cycle: '3 周', tags: ['H5', '营销活动', '防伪码'], status: 'open', origin: 'market', applicants: 8, acceptedByMe: false, messages: [] },
  { id: 4, brand: '元气森林', ini: '元', color: 'linear-gradient(135deg,#34d399,#059669)', cat: '电商', title: '会员积分商城系统搭建', appType: 'Web + 小程序', need: '搭建会员积分商城，打通积分获取与兑换、任务体系与数据看板，需支持多端同步与后续广告/联名变现。', budget: '¥8万 - 12万', cycle: '8 周', tags: ['积分商城', '会员', '多端'], status: 'open', origin: 'market', applicants: 15, acceptedByMe: false, messages: [] },
  { id: 5, brand: '得力', ini: '得', color: 'linear-gradient(135deg,#fbbf24,#d97706)', cat: '休闲工具', title: '记账/效率工具 App 变现优化', appType: 'iOS / Android', need: '现有效率工具 App 日活 20 万，希望优化广告变现结构，引入激励与订阅混合模式，提升整体收益。', budget: '面议', cycle: '面议', tags: ['工具', '变现优化', '订阅'], status: 'open', origin: 'market', applicants: 5, acceptedByMe: false, messages: [] },
  { id: 6, brand: '网易有道', ini: '道', color: 'linear-gradient(135deg,#f87171,#dc2626)', cat: '教育', title: 'AI 口语练习 App 激励变现方案', appType: 'iOS / Android', need: 'AI 口语练习 App 需要设计"看广告解锁练习次数"的激励变现，并平衡付费订阅转化，要求不影响学习体验。', budget: '¥3万 - 6万', cycle: '5 周', tags: ['教育', 'AI', '激励', '订阅'], status: 'open', origin: 'market', applicants: 19, acceptedByMe: false, messages: [] }
];
let orderTab = 'market';
function setOrderTab(t, btn) { orderTab = t; document.querySelectorAll('#odTabs button').forEach(b => b.classList.remove('active')); btn.classList.add('active'); renderOrders(); }
function orderStats() {
  const total = orders.filter(o => o.origin === 'market').length;
  const open = orders.filter(o => o.origin === 'market' && o.status === 'open').length;
  const mine = orders.filter(o => o.acceptedByMe).length;
  document.getElementById('odTotal').textContent = total;
  document.getElementById('odOpen').textContent = open;
  document.getElementById('odMine').textContent = mine;
  const badge = document.getElementById('orderBadge'); if (badge) { badge.textContent = open; badge.style.display = open ? '' : 'none'; }
}
function budgetHit(o) {
  const f = document.getElementById('odBudget').value; if (!f) return true;
  const m = o.budget.match(/(\d+)万\s*-\s*(\d+)万/);
  const min = m ? +m[1] : (o.budget.includes('万') ? +(o.budget.match(/(\d+)/) || [0, 0])[1] : 0);
  const [lo, hi] = f.split('-').map(Number);
  return min >= lo && min <= hi;
}
function renderOrders() {
  orderStats();
  const cat = document.getElementById('odCat').value;
  const kw = document.getElementById('odSearch').value.trim();
  let list = orders.filter(o => orderTab === 'market' ? o.origin === 'market' : orderTab === 'published' ? o.origin === 'published' : o.acceptedByMe);
  list = list.filter(o => (!cat || o.cat === cat) && budgetHit(o) && (!kw || o.brand.includes(kw) || o.title.includes(kw)));
  const box = document.getElementById('orderGrid');
  if (!list.length) { box.innerHTML = '<div class="empty" style="grid-column:1/-1"><i class="ri-inbox-line"></i>' + (orderTab === 'published' ? '你还没有发布商单，点右上角「发布商单」' : orderTab === 'accepted' ? '你还没有承接商单，去市场看看吧' : '没有符合条件的商单') + '</div>'; return; }
  box.innerHTML = list.map(o => {
    const st = o.status === 'open' ? '<span class="oc-status open">招募中</span>' : o.status === 'talking' ? '<span class="oc-status talking">洽谈中</span>' : '<span class="oc-status taken">已承接</span>';
    const avatars = Array.from({ length: Math.min(3, o.applicants) }, (_, i) => '<img src="https://i.pravatar.cc/40?img=' + ((o.id * 7 + i * 5) % 70 + 1) + '" alt="" />').join('');
    let acts;
    if (o.origin === 'published') acts = '<button class="btn btn-ghost btn-sm" onclick="openChat(' + o.id + ')"><i class="ri-chat-3-line"></i> 查看应征(' + o.applicants + ')</button><button class="btn btn-ghost btn-sm" onclick="viewOrder(' + o.id + ')"><i class="ri-eye-line"></i> 详情</button>';
    else if (o.acceptedByMe) acts = '<button class="btn btn-primary btn-sm" onclick="openChat(' + o.id + ')"><i class="ri-chat-3-line"></i> 继续对接</button><button class="btn btn-ghost btn-sm" onclick="viewOrder(' + o.id + ')"><i class="ri-eye-line"></i> 详情</button>';
    else acts = '<button class="btn btn-primary btn-sm" onclick="openAccept(' + o.id + ')"><i class="ri-hand-heart-line"></i> 承接</button><button class="btn btn-ghost btn-sm" onclick="openChat(' + o.id + ')"><i class="ri-chat-3-line"></i> 咨询</button>';
    return '<div class="order-card">' + st +
      '<div class="oc-head"><span class="oc-logo" style="background:' + o.color + '">' + o.ini + '</span><div class="oc-brand"><b>' + o.brand + '</b><small>' + o.cat + ' · ' + o.appType + '</small></div></div>' +
      '<div class="oc-title">' + o.title + '</div><div class="oc-need">' + o.need + '</div>' +
      '<div class="oc-meta"><div class="bud"><small>预算</small><b>' + o.budget + '</b></div><div><small>周期</small><b>' + o.cycle + '</b></div><div><small>应征</small><b>' + o.applicants + ' 人</b></div></div>' +
      '<div class="oc-tags">' + o.tags.map(t => '<span class="chip"># ' + t + '</span>').join('') + '</div>' +
      '<div class="oc-acts">' + acts + '</div></div>';
  }).join('');
}
function viewOrder(id) {
  const o = orders.find(x => x.id === id);
  openModal(o.title,
    '<div class="oc-head" style="margin-bottom:16px"><span class="oc-logo" style="background:' + o.color + '">' + o.ini + '</span><div class="oc-brand"><b>' + o.brand + '</b><small>' + o.cat + ' · ' + o.appType + '</small></div></div>' +
    '<p style="color:var(--ink-soft);line-height:1.7;margin-bottom:16px">' + o.need + '</p>' +
    '<div class="oc-meta" style="border-top:1px solid var(--line);border-bottom:0"><div class="bud"><small>预算</small><b>' + o.budget + '</b></div><div><small>周期</small><b>' + o.cycle + '</b></div><div><small>应征人数</small><b>' + o.applicants + ' 人</b></div><div><small>状态</small><b>' + (o.status === 'open' ? '招募中' : o.status === 'talking' ? '洽谈中' : '已承接') + '</b></div></div>' +
    '<div class="oc-tags" style="margin-top:14px">' + o.tags.map(t => '<span class="chip"># ' + t + '</span>').join('') + '</div>',
    '<button class="btn btn-ghost btn-sm" onclick="closeModal()">关闭</button>' + (o.origin === 'market' && !o.acceptedByMe ? '<button class="btn btn-primary btn-sm" onclick="openAccept(' + o.id + ')">承接商单</button>' : '<button class="btn btn-primary btn-sm" onclick="openChat(' + o.id + ')">对接沟通</button>'));
}
function openAccept(id) {
  const o = orders.find(x => x.id === id);
  openModal('承接商单 · ' + o.brand,
    '<p style="color:var(--ink-soft);margin-bottom:16px">向品牌方提交你的报价与方案要点，通过后即可进入对接沟通。</p>' +
    '<div class="form-row"><label>商单</label><input value="' + o.title + '" readonly style="background:var(--surface-2)" /></div>' +
    '<div class="form-2"><div class="form-row"><label>你的报价（元）</label><input id="acPrice" type="number" placeholder="如 45000" /></div>' +
    '<div class="form-row"><label>预计交付周期</label><input id="acCycle" placeholder="如 5 周" /></div></div>' +
    '<div class="form-row"><label>方案要点 / 优势</label><input id="acNote" placeholder="简述你的实现方案与过往案例" /></div>',
    '<button class="btn btn-ghost btn-sm" onclick="closeModal()">取消</button><button class="btn btn-primary btn-sm" onclick="doAccept(' + id + ')">提交承接</button>');
}
function doAccept(id) {
  const o = orders.find(x => x.id === id);
  const price = document.getElementById('acPrice').value;
  if (!price) { toast('请填写你的报价', 'warn'); return; }
  o.acceptedByMe = true; o.status = 'talking'; o.applicants += 1;
  o.messages.push({ me: true, who: '我（报价 ¥' + (+price).toLocaleString() + '）', text: document.getElementById('acNote').value.trim() || '您好，我对这个商单很感兴趣，已提交报价，期待进一步沟通。' });
  o.messages.push({ me: false, who: o.brand + ' · 商务', text: '收到你的报价，方案看起来不错，我们约个时间详细聊聊需求细节～' });
  closeModal(); toast('已提交承接，进入对接沟通');
  setOrderTabTo('accepted'); openChat(id);
}
function setOrderTabTo(t) { orderTab = t; document.querySelectorAll('#odTabs button').forEach(b => b.classList.toggle('active', b.dataset.t === t)); renderOrders(); }

function openPublishModal() {
  openModal('发布商单',
    '<div class="form-row"><label>品牌 / 公司名称</label><input id="pbBrand" placeholder="如 示例科技" /></div>' +
    '<div class="form-row"><label>商单标题</label><input id="pbTitle" placeholder="如 会员积分商城小程序开发" /></div>' +
    '<div class="form-2"><div class="form-row"><label>行业分类</label><select id="pbCat"><option>游戏</option><option>美妆</option><option>日化快消</option><option>休闲工具</option><option>电商</option><option>教育</option></select></div>' +
    '<div class="form-row"><label>需要制作的应用类型</label><select id="pbApp"><option>微信小程序</option><option>iOS / Android</option><option>H5 落地页</option><option>Web + 小程序</option><option>API / SDK 接入</option></select></div></div>' +
    '<div class="form-row"><label>需求 / 诉求描述</label><input id="pbNeed" placeholder="描述你要做什么应用、核心功能与变现诉求" /></div>' +
    '<div class="form-2"><div class="form-row"><label>预算</label><input id="pbBudget" placeholder="如 ¥5万 - 8万 或 面议" /></div>' +
    '<div class="form-row"><label>周期</label><input id="pbCycle" placeholder="如 6 周" /></div></div>',
    '<button class="btn btn-ghost btn-sm" onclick="closeModal()">取消</button><button class="btn btn-primary btn-sm" onclick="doPublish()">发布到市场</button>');
}
function doPublish() {
  const brand = document.getElementById('pbBrand').value.trim();
  const title = document.getElementById('pbTitle').value.trim();
  const need = document.getElementById('pbNeed').value.trim();
  if (!brand || !title) { toast('请填写品牌与商单标题', 'warn'); return; }
  const colors = ['linear-gradient(135deg,#60a5fa,#2563eb)', 'linear-gradient(135deg,#34d399,#059669)', 'linear-gradient(135deg,#fbbf24,#d97706)', 'linear-gradient(135deg,#f472b6,#db2777)'];
  orders.unshift({ id: Date.now(), brand, ini: brand[0], color: colors[rnd(0, 3)], cat: document.getElementById('pbCat').value, title, appType: document.getElementById('pbApp').value, need: need || '（暂无详细描述）', budget: document.getElementById('pbBudget').value.trim() || '面议', cycle: document.getElementById('pbCycle').value.trim() || '面议', tags: [document.getElementById('pbCat').value, document.getElementById('pbApp').value], status: 'open', origin: 'published', applicants: 0, acceptedByMe: false, messages: [{ me: false, who: '平台助手', text: '你的商单已发布到市场，开发者应征后会在这里通知你～' }] });
  closeModal(); toast('商单「' + title + '」已发布到市场'); setOrderTabTo('published');
}

/* ---------- Message Center (WeChat style) ---------- */
let activeChat = null;
[2, 3, 6].forEach((id, i) => {
  const o = orders.find(x => x.id === id);
  o.messages = [
    { me: false, who: o.brand + ' · 商务', text: '您好！看到您可能对「' + o.title + '」感兴趣，欢迎沟通～', t: '09:1' + (2 + i) },
    { me: false, who: o.brand + ' · 商务', text: '这个商单预算 ' + o.budget + '，周期 ' + o.cycle + '，方便介绍下您的团队与过往案例吗？', t: '09:1' + (4 + i) }
  ];
  o.unread = i === 0 ? 2 : 1;
});
function convList() { return orders.filter(o => o.messages && o.messages.length).sort((a, b) => (b.unread || 0) - (a.unread || 0)); }
function updateMsgBadge() { const n = convList().reduce((s, o) => s + (o.unread || 0), 0); const b = document.getElementById('msgBadge'); if (b) { b.textContent = n; b.style.display = n ? '' : 'none'; } }
function renderMessages() {
  updateMsgBadge();
  const list = convList();
  document.getElementById('chatList').innerHTML = list.map(o => {
    const last = o.messages[o.messages.length - 1];
    const prev = (last.me ? '我: ' : '') + last.text;
    const unread = o.unread ? '<span class="unread">' + o.unread + '</span>' : '';
    return '<div class="cl-item ' + (activeChat === o.id ? 'active' : '') + '" onclick="selectChat(' + o.id + ')">' +
      '<span class="cl-ava" style="background:' + o.color + '">' + o.ini + unread + '</span>' +
      '<div class="cl-main"><div class="cl-top"><b>' + o.brand + '</b><span class="cl-time">' + (last.t || '刚刚') + '</span></div>' +
      '<div class="cl-prev">' + prev + '</div></div></div>';
  }).join('') || '<div class="empty" style="padding:40px 16px"><i class="ri-chat-off-line"></i>暂无会话，去商单市场咨询或承接吧</div>';
  if (activeChat && list.find(o => o.id === activeChat)) renderRoom();
  else { document.getElementById('chatEmpty').style.display = 'flex'; document.getElementById('chatRoom').style.display = 'none'; }
}
function selectChat(id) { activeChat = id; const o = orders.find(x => x.id === id); o.unread = 0; renderMessages(); }
function renderRoom() {
  const o = orders.find(x => x.id === activeChat);
  document.getElementById('chatEmpty').style.display = 'none';
  document.getElementById('chatRoom').style.display = 'flex';
  const lg = document.getElementById('crLogo'); lg.style.background = o.color; lg.textContent = o.ini;
  document.getElementById('crName').textContent = o.brand;
  document.getElementById('crDesc').textContent = o.title;
  const st = document.getElementById('crStatus'); const map = { open: ['open', '招募中'], talking: ['talking', '洽谈中'], taken: ['taken', '已合作'] };
  st.className = 'cr-status ' + map[o.status][0]; st.textContent = map[o.status][1];
  document.getElementById('crBody').innerHTML = '<div class="cr-date">今天</div>' + o.messages.map(m => {
    const ava = m.me ? '<span class="cr-ava" style="background:linear-gradient(135deg,#4e8bff,#2b6cf6)">我</span>' : '<span class="cr-ava" style="background:' + o.color + '">' + o.ini + '</span>';
    return '<div class="cr-msg ' + (m.me ? 'me' : 'them') + '">' + ava + '<div class="bubble">' + m.text + '</div></div>';
  }).join('');
  const quicks = ['方便约个电话详聊吗？', '预算方面还有空间吗？', '周期可以放宽一些吗？', '我发一份方案给您'];
  if (o.acceptedByMe || o.origin === 'published') quicks.push('确认合作，走签约');
  document.getElementById('crQuick').innerHTML = quicks.map(x => '<span onclick="quickRoom(\'' + x + '\')">' + x + '</span>').join('');
  const b = document.getElementById('crBody'); b.scrollTop = b.scrollHeight;
}
function quickRoom(t) { if (t.indexOf('确认合作') > -1) { dealOrder(activeChat); return; } document.getElementById('crInput').value = t; sendRoom(); }
function sendRoom() {
  const inp = document.getElementById('crInput'); const t = inp.value.trim(); if (!t) return;
  const o = orders.find(x => x.id === activeChat);
  o.messages.push({ me: true, who: '我', text: t, t: '刚刚' }); inp.value = ''; renderRoom();
  const replies = ['好的，这个没问题～', '收到，我和团队确认下细节。', '可以的，我们尽快推进。', '明白，稍后发您一版方案。', '这个点可以谈，预算方面也有空间。'];
  setTimeout(() => { o.messages.push({ me: false, who: o.brand + ' · 商务', text: replies[rnd(0, replies.length - 1)], t: '刚刚' }); if (activeChat === o.id) renderRoom(); }, 900);
}
function openChat(id) {
  const o = orders.find(x => x.id === id);
  if (!o.messages || !o.messages.length) o.messages = [{ me: false, who: o.brand + ' · 商务', text: '您好，欢迎咨询「' + o.title + '」，有什么想了解的可以直接问～', t: '刚刚' }];
  o.unread = 0; activeChat = id; closeModal(); gotoView('messages');
}
function dealOrder(id) {
  const o = orders.find(x => x.id === id); o.status = 'taken';
  o.messages.push({ me: false, who: o.brand + ' · 商务', text: '🎉 很高兴与您达成合作！我们会尽快发起签约与里程碑排期。', t: '刚刚' });
  toast('🎉 已与「' + o.brand + '」达成合作，商单进入执行阶段');
  if (activeChat === id) renderRoom();
  renderMessages(); renderOrders();
}
/* ---------- Init ---------- */
renderOverview();

/* ---------- Dropdowns ---------- */
function toggleDD(id) {
  const el = document.getElementById(id);
  document.querySelectorAll('.dropdown').forEach(d => { if (d !== el) d.classList.remove('open'); });
  el.classList.toggle('open');
}
document.addEventListener('click', e => { if (!e.target.closest('.dd-wrap')) document.querySelectorAll('.dropdown').forEach(d => d.classList.remove('open')); });
function gotoView(v) { const l = document.querySelector('.side-link[data-view="' + v + '"]'); if (l) l.click(); document.querySelectorAll('.dropdown').forEach(d => d.classList.remove('open')); }
if (user) {
  const dn = document.getElementById('ddName'); if (dn) dn.textContent = user.name || '开发者';
  const de = document.getElementById('ddEmail'); if (de) de.textContent = user.email || '';
}

/* ---------- Live: revenue ticker + activity feed ---------- */
let liveRevenue = 86420;
function tickRevenue() {
  liveRevenue += rnd(20, 260);
  const el = document.getElementById('kpiRevenue');
  if (el) { el.textContent = '¥' + liveRevenue.toLocaleString(); el.classList.remove('flash'); void el.offsetWidth; el.classList.add('flash'); }
}
const feedEvents = [
  { app: '萌宠泡泡龙', act: '激励视频完成', tint: 't-indigo', ic: 'ri-gift-line' },
  { app: '花漾美妆商城', act: '开屏广告曝光', tint: 't-rose', ic: 'ri-image-line' },
  { app: '洁净生活日化旗舰', act: '信息流点击', tint: 't-cyan', ic: 'ri-cursor-line' },
  { app: '悠享记账', act: '会员订阅成交', tint: 't-green', ic: 'ri-vip-crown-line' },
  { app: '王牌飞车竞速', act: '插屏广告曝光', tint: 't-amber', ic: 'ri-fullscreen-line' },
  { app: '花漾美妆商城', act: '优惠券核销分成', tint: 't-violet', ic: 'ri-coupon-line' }
];
function pushFeed() {
  const box = document.getElementById('liveFeed'); if (!box) return;
  const e = feedEvents[rnd(0, feedEvents.length - 1)];
  const amt = (Math.random() * 6 + 0.4).toFixed(1);
  const t = new Date();
  const av = 'https://i.pravatar.cc/60?img=' + rnd(1, 70);
  const row = document.createElement('div');
  row.className = 'feed-row';
  row.innerHTML = '<img class="fav" src="' + av + '" alt="" />' +
    '<span class="fdi ' + e.tint + '"><i class="' + e.ic + '"></i></span>' +
    '<div class="fd-main"><b>' + e.app + '</b><small>' + e.act + '</small></div>' +
    '<div class="fd-amt">+¥' + amt + '</div>' +
    '<div class="fd-time">' + t.toTimeString().slice(0, 8) + '</div>';
  box.prepend(row);
  while (box.children.length > 7) box.removeChild(box.lastChild);
}
for (let i = 0; i < 6; i++) pushFeed();
setInterval(tickRevenue, 2200);
setInterval(pushFeed, 2600);




