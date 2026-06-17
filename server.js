<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate"/>
<meta http-equiv="Pragma" content="no-cache"/>
<meta http-equiv="Expires" content="0"/>
<title>Bifrost — Editor Dashboard</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Sora:wght@600;700&display=swap" rel="stylesheet"/>
<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
:root {
  --bg: #1e3d35; --bg-light: #2a5045; --bg-card: #1a3530;
  --accent: #235347; --accent-md: #2d6b5c; --accent-lt: #3a8a73; --accent-hl: #4aab8f;
  --sidebar: #0f2520; --card: #ffffff;
  --border: rgba(74,171,143,0.18); --border-md: rgba(74,171,143,0.3);
  --text: #1a1a1a; --mid: #555; --muted: #999;
  --shadow: 0 2px 20px rgba(0,0,0,0.15); --shadow-hover: 0 8px 32px rgba(0,0,0,0.22);
  --r-xl: 22px; --r-lg: 16px; --r-md: 12px; --r-sm: 8px;
  --sw: 210px; --ease: 0.2s ease;
}
html { font-size: 15px; scroll-behavior: smooth; }
body { font-family: 'Inter', sans-serif; background: var(--bg); color: var(--text); display: flex; min-height: 100vh; }
::-webkit-scrollbar { width: 5px; }
::-webkit-scrollbar-thumb { background: var(--accent-lt); border-radius: 10px; }
::-webkit-scrollbar-track { background: transparent; }

/* ── ONBOARDING ── */
#onboarding-overlay {
  position: fixed; inset: 0; background: rgba(15,37,32,0.97);
  z-index: 9999; display: flex; align-items: center; justify-content: center;
}
.ob-box {
  background: #fff; border-radius: 26px; padding: 44px 50px;
  width: 520px; max-width: 96vw; box-shadow: 0 32px 80px rgba(0,0,0,0.45);
}
.ob-logo { display: flex; align-items: center; gap: 10px; margin-bottom: 28px; }
.ob-logo-b {
  width: 34px; height: 34px; background: var(--accent-hl); border-radius: 9px;
  display: flex; align-items: center; justify-content: center;
  font-family: 'Sora',sans-serif; font-weight: 700; font-size: 1rem; color: #fff;
}
.ob-logo-name { font-family: 'Sora',sans-serif; font-size: 1rem; font-weight: 700; color: #0f2520; letter-spacing: 0.07em; }
.ob-progress { display: flex; gap: 5px; margin-bottom: 30px; }
.ob-dot { height: 4px; border-radius: 2px; flex: 1; background: #e8e8e8; transition: background 0.3s ease; }
.ob-dot.done { background: var(--accent-hl); }
.ob-step { display: none; }
.ob-step.active { display: block; }
.ob-eyebrow { font-size: 0.67rem; font-weight: 700; letter-spacing: 0.11em; text-transform: uppercase; color: var(--accent-hl); margin-bottom: 5px; }
.ob-title { font-family: 'Sora',sans-serif; font-size: 1.45rem; font-weight: 700; color: #0f2520; margin-bottom: 5px; }
.ob-sub { font-size: 0.82rem; color: #888; margin-bottom: 22px; line-height: 1.6; }
.ob-label { font-size: 0.78rem; font-weight: 600; color: #444; margin-bottom: 6px; display: block; }
.ob-input {
  width: 100%; border: 1.5px solid #e4e4e4; border-radius: 11px;
  padding: 11px 14px; font-family: 'Inter',sans-serif; font-size: 0.88rem;
  outline: none; transition: border 0.2s; margin-bottom: 18px; color: #1a1a1a;
}
.ob-input:focus { border-color: var(--accent-hl); box-shadow: 0 0 0 3px rgba(74,171,143,0.1); }
.ob-textarea {
  width: 100%; border: 1.5px solid #e4e4e4; border-radius: 11px;
  padding: 11px 14px; font-family: 'Inter',sans-serif; font-size: 0.88rem;
  outline: none; transition: border 0.2s; margin-bottom: 6px; color: #1a1a1a;
  resize: vertical; min-height: 110px; line-height: 1.6;
}
.ob-textarea:focus { border-color: var(--accent-hl); box-shadow: 0 0 0 3px rgba(74,171,143,0.1); }
.ob-word-count { font-size: 0.73rem; color: #aaa; margin-bottom: 18px; text-align: right; }
.ob-word-count.ok { color: var(--accent-hl); font-weight: 600; }
.ob-word-count.warn { color: #e67e22; }
.ob-pfp-area { display: flex; align-items: center; gap: 18px; margin-bottom: 22px; }
.ob-pfp-preview {
  width: 70px; height: 70px; border-radius: 50%; background: #e8f5f1;
  border: 2.5px solid var(--accent-hl); display: flex; align-items: center; justify-content: center;
  overflow: hidden; flex-shrink: 0;
}
.ob-pfp-preview img { width: 100%; height: 100%; object-fit: cover; display: none; }
.ob-pfp-preview svg { stroke: var(--accent-hl); fill: none; stroke-width: 1.5; }
.ob-pfp-btn {
  border: 1.5px solid var(--accent-hl); background: transparent; color: var(--accent-lt);
  border-radius: 10px; padding: 9px 18px; font-family: 'Inter',sans-serif;
  font-size: 0.82rem; font-weight: 600; cursor: pointer; transition: background 0.2s; display: inline-block;
}
.ob-pfp-btn:hover { background: #e8f5f1; }
.ob-skills-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 7px; margin-bottom: 22px; }
.ob-skill-chip {
  border: 1.5px solid #e0e0e0; border-radius: 10px; padding: 9px 8px; text-align: center;
  font-size: 0.71rem; font-weight: 600; color: #666; cursor: pointer;
  transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 6px;
  background: #fafafa;
}
.ob-skill-chip.selected { border-color: var(--accent-hl); background: #eaf7f3; color: var(--accent); }
.ob-skill-chip img { width: 15px; height: 15px; object-fit: contain; flex-shrink: 0; }
.ob-btn-row { display: flex; gap: 10px; align-items: center; }
.ob-next {
  flex: 1; background: var(--accent-hl); color: #fff; border: none; border-radius: 12px;
  padding: 13px; font-family: 'Inter',sans-serif; font-size: 0.92rem; font-weight: 700;
  cursor: pointer; transition: background 0.2s;
}
.ob-next:hover { background: var(--accent-lt); }
.ob-skip {
  font-size: 0.79rem; color: #bbb; cursor: pointer; white-space: nowrap;
  padding: 4px 8px; border-radius: 8px; transition: color 0.2s; background: none; border: none; font-family: 'Inter',sans-serif;
}
.ob-skip:hover { color: #888; }

/* ── SIDEBAR ── */
.sidebar {
  width: var(--sw); background: var(--sidebar);
  height: 100vh; position: fixed; left: 0; top: 0;
  display: flex; flex-direction: column; padding: 22px 14px; z-index: 200;
}
.sidebar-brand { display: flex; align-items: center; gap: 10px; padding: 4px 8px 26px; }
.brand-b {
  width: 32px; height: 32px; background: var(--accent-hl); border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  font-family: 'Sora',sans-serif; font-weight: 700; font-size: 1rem; color: #fff; flex-shrink: 0;
}
.brand-name { font-family: 'Sora',sans-serif; font-size: 0.95rem; font-weight: 700; color: #fff; letter-spacing: 0.07em; }
.sidebar-nav { display: flex; flex-direction: column; gap: 3px; flex: 1; }
.nav-btn {
  display: flex; align-items: center; gap: 11px; padding: 11px 12px; border-radius: var(--r-md);
  border: none; background: transparent; color: rgba(255,255,255,0.45);
  cursor: pointer; font-family: 'Inter',sans-serif; font-size: 0.875rem; font-weight: 500;
  width: 100%; text-align: left; position: relative; transition: background var(--ease), color var(--ease);
}
.nav-btn svg { width: 18px; height: 18px; stroke: currentColor; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; flex-shrink: 0; }
.nav-btn:hover { background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.85); }
.nav-btn.active { background: var(--accent-hl); color: #fff; }
.nav-badge { margin-left: auto; background: #e74c3c; color: #fff; font-size: 0.68rem; font-weight: 700; padding: 2px 7px; border-radius: 20px; }
.sidebar-bottom { padding-top: 14px; border-top: 1px solid rgba(255,255,255,0.08); }
.logout-nav { color: rgba(255,120,100,0.7); }
.logout-nav:hover { background: rgba(231,76,60,0.12); color: #e74c3c; }

/* ── MAIN ── */
.main { margin-left: var(--sw); flex: 1; padding: 30px 30px 60px; min-height: 100vh; }
.page { display: none; }
.page.active { display: block; }
.eyebrow { font-size: 0.72rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--accent-hl); margin-bottom: 4px; }
.page-title { font-family: 'Sora',sans-serif; font-size: 1.7rem; font-weight: 700; color: #fff; }
.section-heading { font-family: 'Sora',sans-serif; font-size: 0.98rem; font-weight: 700; color: var(--text); }

/* ══ HOME ══ */
.home-layout { display: grid; grid-template-columns: 260px 1fr; gap: 22px; align-items: start; }
.profile-card {
  background: var(--card); border-radius: var(--r-xl); border: 2px solid var(--accent-hl);
  box-shadow: var(--shadow); padding: 24px 20px 20px;
  display: flex; flex-direction: column; align-items: center; text-align: center;
}
.profile-avatar-area { position: relative; margin-bottom: 14px; }
.avatar-ring { width: 90px; height: 90px; border-radius: 50%; border: 3px solid var(--accent-hl); padding: 3px; }
.avatar-img  { width: 100%; height: 100%; border-radius: 50%; object-fit: cover; display: block; }
.avatar-edit {
  position: absolute; bottom: 0; right: -2px; width: 26px; height: 26px;
  background: var(--accent-hl); border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; border: 2px solid #fff;
}
.avatar-edit svg { width: 12px; height: 12px; stroke: #fff; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
.profile-name   { font-family: 'Sora',sans-serif; font-size: 1.1rem; font-weight: 700; margin-bottom: 3px; }
.profile-handle { font-size: 0.77rem; color: var(--accent); font-weight: 500; margin-bottom: 16px; }
.p-stats { display: flex; align-items: center; width: 100%; background: #f7f7f7; border-radius: var(--r-md); padding: 11px 0; margin-bottom: 18px; }
.pstat { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 2px; }
.pstat-num { font-family: 'Sora',sans-serif; font-size: 1.1rem; font-weight: 700; }
.pstat-lbl { font-size: 0.65rem; color: var(--muted); font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; }
.pstat-div { width: 1px; height: 26px; background: #e0e0e0; }
.profile-sec { width: 100%; text-align: left; margin-bottom: 14px; }
.profile-sec-lbl { font-size: 0.68rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted); margin-bottom: 8px; }
.chips { display: flex; flex-wrap: wrap; gap: 6px; }
.chip  { background: #eaf7f3; border: 1.5px solid var(--accent-hl); color: var(--accent); font-size: 0.71rem; font-weight: 600; padding: 4px 10px; border-radius: 20px; }
.profile-bio { font-size: 0.81rem; color: var(--mid); line-height: 1.6; }
.portfolio-col { display: flex; flex-direction: column; gap: 18px; }
.portfolio-card { background: var(--card); border-radius: var(--r-xl); border: 1.5px solid var(--border); box-shadow: var(--shadow); padding: 22px; }
.portfolio-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.portfolio-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 11px; }
.add-slot {
  background: #f4f4f4; border: 2px dashed #ccc; border-radius: var(--r-lg); aspect-ratio: 16/10;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 5px; cursor: pointer; color: #bbb; font-size: 0.74rem;
  transition: border-color var(--ease), color var(--ease);
}
.add-slot:hover { border-color: var(--accent-hl); color: var(--accent); }
.add-slot svg { stroke: currentColor; fill: none; stroke-width: 2; }
.p-item {
  aspect-ratio: 16/10; border-radius: var(--r-lg); position: relative; overflow: hidden;
  display: flex; align-items: flex-end; cursor: pointer;
  transition: transform var(--ease), box-shadow var(--ease); border: 1.5px solid rgba(0,0,0,0.06); background: #111;
}
.p-item:hover { transform: scale(1.025); box-shadow: 0 6px 20px rgba(0,0,0,0.14); }
.p-item img, .p-item video { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; border-radius: inherit; }
.p-tag { position: relative; z-index: 2; font-size: 0.68rem; font-weight: 700; background: rgba(0,0,0,0.52); color: #fff; padding: 3px 9px; border-radius: 20px; margin: 7px; }
.p-overlay { position: absolute; top:0; right:0; padding: 6px; pointer-events: none; z-index: 3; }
.p-del { pointer-events: auto; background: rgba(0,0,0,0.65); color: #fff; border: none; border-radius: 50%; width: 24px; height: 24px; font-size: 0.7rem; cursor: pointer; display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity var(--ease); }
.p-item:hover .p-del { opacity: 1; }
.p-item video, .p-item audio { pointer-events: auto; }

/* ══ BREEZE STAT CARDS ══ */
.hstats-wrap {
  background: var(--card);
  border-radius: var(--r-xl);
  border: 1.5px solid var(--border);
  box-shadow: var(--shadow);
  padding: 20px 18px;
}
.hstats-row {
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
}
.hstat {
  background: #f7fbf9;
  border: 1.5px solid rgba(74,171,143,0.15);
  border-radius: var(--r-lg);
  padding: 14px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 130px;
  cursor: pointer;
  transition: box-shadow 0.25s ease, border-color 0.25s ease, transform 0.25s ease;
  animation: breeze 3s ease-in-out infinite;
}
.hstat:nth-child(1) { animation-delay: 0s; }
.hstat:nth-child(2) { animation-delay: 0.25s; }
.hstat:nth-child(3) { animation-delay: 0.5s; }
.hstat:nth-child(4) { animation-delay: 0.75s; }
.hstat:nth-child(5) { animation-delay: 1s; }
@keyframes breeze {
  0%, 100% { transform: translateY(0px); }
  50%       { transform: translateY(-6px); }
}
.hstat:hover {
  box-shadow: 0 8px 24px rgba(74,171,143,0.22);
  border-color: var(--accent-hl);
  transform: translateY(-8px) !important;
}
.hstat-icon {
  width: 40px; height: 40px; border-radius: var(--r-sm);
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.hstat-icon svg { fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
.hstat-num { font-family: 'Sora',sans-serif; font-size: 1.1rem; font-weight: 700; color: #1a1a1a; }
.hstat-lbl { font-size: 0.68rem; color: var(--muted); font-weight: 500; margin-top: 2px; }
@media (prefers-reduced-motion: reduce) { .hstat { animation: none; } }

.reviews-card { background: var(--card); border-radius: var(--r-xl); border: 1.5px solid var(--border); box-shadow: var(--shadow); padding: 20px 22px; }
.reviews-list { display: flex; flex-direction: column; gap: 15px; margin-top: 14px; }
.review-item { display: flex; gap: 12px; align-items: flex-start; }
.review-av    { width: 34px; height: 34px; border-radius: 50%; object-fit: cover; flex-shrink: 0; }
.review-body  { flex: 1; }
.review-top   { display: flex; justify-content: space-between; align-items: center; margin-bottom: 3px; }
.review-name  { font-size: 0.84rem; font-weight: 700; }
.review-stars { color: #f9a825; font-size: 0.76rem; letter-spacing: 1px; }
.review-text  { font-size: 0.79rem; color: var(--mid); line-height: 1.55; font-style: italic; }

/* ══ EXPLORE ══ */
.explore-header { margin-bottom: 24px; }
.explore-header h1 { font-family: 'Sora',sans-serif; font-size: 1.7rem; font-weight: 700; color: #fff; margin-bottom: 14px; }
.explore-controls { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }
.search-bar {
  display: flex; align-items: center; gap: 10px; background: #fff;
  border: 1.5px solid rgba(74,171,143,0.35); border-radius: var(--r-md); padding: 10px 16px; flex: 1; min-width: 220px;
}
.search-bar svg  { stroke: #bbb; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; flex-shrink: 0; }
.search-bar input { border: none; outline: none; font-family: 'Inter',sans-serif; font-size: 0.875rem; color: var(--text); background: transparent; width: 100%; }
.search-bar input::placeholder { color: #bbb; }
.explore-count { font-size: 0.78rem; color: rgba(255,255,255,0.45); font-weight: 500; white-space: nowrap; }
.client-feed { display: flex; flex-direction: column; gap: 14px; }
.cc {
  background: #fff; border-radius: 18px; border: 1px solid #ecefee;
  box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.05);
  overflow: hidden; position: relative;
  opacity: 0; transform: translateY(14px);
  transition: opacity .5s ease, transform .5s ease, box-shadow .25s ease, border-color .25s ease;
}
.cc.in-view { opacity: 1; transform: translateY(0); }
.cc:hover { box-shadow: 0 6px 14px rgba(0,0,0,0.06), 0 20px 40px rgba(15,37,32,0.12); border-color: rgba(74,171,143,0.35); transform: translateY(-3px); }
.cc-main { padding: 18px 22px 16px; cursor: pointer; }
.cc-top { display: grid; grid-template-columns: 48px minmax(0,1fr) auto; gap: 14px; align-items: center; margin-bottom: 12px; }
.cc-av { width: 48px; height: 48px; border-radius: 14px; object-fit: cover; border: 1.5px solid #e8f5f1; }
.cc-name { font-size: 0.72rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--accent-lt); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.cc-name-sub { font-size: 0.7rem; color: #aaa; font-weight: 500; margin-top: 2px; }
.cc-budget-wrap { text-align: right; }
.cc-budget { font-family: 'Sora', sans-serif; font-size: 1.35rem; font-weight: 700; color: #0f2520; line-height: 1; letter-spacing: -0.01em; }
.cc-budget-lbl { font-size: 0.62rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #aab2af; margin-top: 4px; }
.cc-title { font-family: 'Sora', sans-serif; font-size: 1.05rem; font-weight: 700; color: #1a1a1a; margin-bottom: 6px; line-height: 1.35; }
.cc-desc-preview { font-size: 0.84rem; color: #5a5a5a; line-height: 1.55; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; margin-bottom: 12px; }
.cc-types { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 14px; }
.cc-type-pill { background: #f3f7f5; color: #4a6a60; font-size: 0.7rem; font-weight: 600; padding: 4px 10px; border-radius: 20px; border: 1px solid #e8f0ec; }
.cc-meta { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding-top: 12px; border-top: 1px dashed #eef2f0; }
.cc-meta-left { display: flex; align-items: center; gap: 18px; flex-wrap: wrap; }
.cc-meta-item { display: flex; align-items: center; gap: 6px; font-size: 0.78rem; color: #777; font-weight: 500; }
.cc-meta-item svg { stroke: #aab2af; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
.cc-meta-item strong { color: #333; font-weight: 700; }
.cc-detail { display: grid; grid-template-rows: 0fr; transition: grid-template-rows .35s ease; }
.cc-detail-inner { overflow: hidden; min-height: 0; }
.cc.open .cc-detail, .cc:hover .cc-detail { grid-template-rows: 1fr; }
.cc-detail-content { padding: 4px 22px 20px; border-top: 1px solid #f1f4f3; margin-top: 4px; }
.cc-detail-title { font-size: 0.65rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--accent-lt); margin: 14px 0 6px; }
.cc-detail-text { font-size: 0.84rem; color: #444; line-height: 1.65; }
.cc-detail-list { font-size: 0.83rem; color: #555; line-height: 1.7; padding-left: 18px; }
.cc-detail-list li { margin-bottom: 2px; }
.cc-apply-row { display: flex; justify-content: space-between; align-items: center; margin-top: 18px; gap: 12px; flex-wrap: wrap; }
.cc-apply-meta { font-size: 0.76rem; color: #999; }
.apply-btn {
  background: var(--accent-hl); color: #fff; border: none; border-radius: 12px;
  padding: 12px 28px; font-family: 'Inter',sans-serif; font-size: 0.86rem; font-weight: 700;
  cursor: pointer; transition: background .2s, transform .2s, box-shadow .2s;
  white-space: nowrap; box-shadow: 0 4px 12px rgba(74,171,143,0.25);
}
.apply-btn:hover { background: var(--accent-lt); transform: translateY(-1px); box-shadow: 0 6px 18px rgba(74,171,143,0.35); }
.apply-btn.applied { background: #e8f5ee; color: var(--accent); cursor: default; border: 1.5px solid rgba(74,171,143,0.3); box-shadow: none; }
.apply-btn.applied:hover { transform: none; }

/* ══ INBOX ══ */
.inbox-wrap { display: grid; grid-template-columns: 290px 1fr; gap: 18px; height: calc(100vh - 72px); }
.convo-panel { background: var(--card); border-radius: var(--r-xl); border: 1.5px solid var(--border); box-shadow: var(--shadow); display: flex; flex-direction: column; overflow: hidden; }
.convo-panel-hdr { padding: 16px 16px 0; flex-shrink: 0; }
.convo-panel-title { font-family: 'Sora',sans-serif; font-size: 1rem; font-weight: 700; display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
.inbox-badge { background: var(--accent-hl); color: #fff; font-size: 0.7rem; font-weight: 700; padding: 2px 8px; border-radius: 20px; }
.inbox-search { display: flex; align-items: center; gap: 8px; background: #f4f4f4; border: 1px solid #eee; border-radius: var(--r-md); padding: 8px 12px; margin-bottom: 12px; }
.inbox-search svg { stroke: #bbb; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; flex-shrink: 0; }
.inbox-search input { border: none; outline: none; background: transparent; font-family: 'Inter',sans-serif; font-size: 0.81rem; color: var(--text); width: 100%; }
.inbox-search input::placeholder { color: #ccc; }
.convo-list { overflow-y: auto; flex: 1; border-top: 1px solid #f5f5f5; }
.convo-item { display: flex; align-items: center; gap: 11px; padding: 13px 16px; cursor: pointer; border-bottom: 1px solid #fafafa; transition: background var(--ease); }
.convo-item:hover  { background: #f7fdf9; }
.convo-item.active { background: #eaf7f3; border-left: 3px solid var(--accent-hl); }
.convo-av      { width: 40px; height: 40px; border-radius: 50%; object-fit: cover; flex-shrink: 0; }
.convo-info    { flex: 1; min-width: 0; }
.convo-name    { font-size: 0.85rem; font-weight: 700; }
.convo-preview { font-size: 0.74rem; color: var(--muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-top: 2px; }
.convo-unread  { width: 8px; height: 8px; background: var(--accent-hl); border-radius: 50%; flex-shrink: 0; }
.chat-pane { background: var(--card); border-radius: var(--r-xl); border: 1.5px solid var(--border); box-shadow: var(--shadow); display: flex; flex-direction: column; overflow: hidden; }
.chat-hdr { display: flex; align-items: center; gap: 12px; padding: 14px 18px; border-bottom: 1.5px solid #f0f0f0; flex-shrink: 0; }
.chat-hdr-av { width: 38px; height: 38px; border-radius: 50%; overflow: hidden; background: #eaf7f3; border: 2px solid var(--accent-hl); flex-shrink: 0; }
.chat-hdr-av img { width: 100%; height: 100%; object-fit: cover; }
.chat-hdr-name   { font-size: 0.88rem; font-weight: 700; }
.chat-hdr-status { font-size: 0.71rem; color: #4caf50; font-weight: 500; }
.chat-msgs { flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 10px; }
.chat-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: #ccc; gap: 10px; text-align: center; }
.chat-empty p { font-size: 0.81rem; }
.bubble { max-width: 74%; padding: 10px 15px; border-radius: 18px; font-size: 0.83rem; line-height: 1.5; }
.bubble.recv { background: #f1f1f1; color: var(--text); border-bottom-left-radius: 4px; align-self: flex-start; }
.bubble.sent { background: var(--accent-hl); color: #fff; border-bottom-right-radius: 4px; align-self: flex-end; }
.chat-input-row { display: flex; gap: 10px; padding: 13px 15px; border-top: 1.5px solid #f0f0f0; flex-shrink: 0; }
.chat-input { flex: 1; border: 1.5px solid #e8e8e8; border-radius: var(--r-md); padding: 10px 15px; font-family: 'Inter',sans-serif; font-size: 0.84rem; outline: none; transition: border var(--ease); }
.chat-input:focus { border-color: var(--accent-hl); }
.send-btn { width: 42px; height: 42px; background: var(--accent-hl); border: none; border-radius: var(--r-md); display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0; transition: background var(--ease); }
.send-btn:hover { background: var(--accent-lt); }

/* ══ SETTINGS ══ */
.settings-grid { display: grid; grid-template-columns: repeat(auto-fill,minmax(300px,1fr)); gap: 15px; margin-top: 26px; }
.settings-card { background: var(--card); border-radius: var(--r-xl); border: 1.5px solid var(--border); box-shadow: var(--shadow); padding: 18px; display: flex; align-items: center; gap: 14px; transition: transform var(--ease); }
.settings-card:hover { transform: translateY(-2px); }
.s-icon { width: 44px; height: 44px; border-radius: var(--r-sm); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.s-icon svg { stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
.s-info { flex: 1; }
.s-info h3 { font-size: 0.88rem; font-weight: 700; margin-bottom: 3px; }
.s-info p  { font-size: 0.77rem; color: var(--muted); line-height: 1.45; }

/* ══ BUTTONS ══ */
.btn-accent { background: var(--accent-hl); color: #fff; border: none; border-radius: var(--r-md); padding: 10px 20px; font-family: 'Inter',sans-serif; font-size: 0.875rem; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 7px; transition: background var(--ease), transform var(--ease); }
.btn-accent:hover { background: var(--accent-lt); transform: translateY(-1px); }
.btn-accent.sm  { padding: 8px 16px; font-size: 0.81rem; }
.btn-accent.full{ width: 100%; justify-content: center; margin-top: 14px; }
.btn-outline { border: 1.5px solid var(--accent-hl); background: transparent; color: var(--accent); border-radius: var(--r-md); padding: 8px 15px; font-family: 'Inter',sans-serif; font-size: 0.81rem; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: background var(--ease); }
.btn-outline:hover { background: #eaf7f3; }
.upload-lbl { cursor: pointer; }
.chat-attach-btn { width: 42px; height: 42px; background: #eaf7f3; border: 1.5px solid #d4ece4; border-radius: var(--r-md); display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0; transition: background var(--ease); }
.chat-attach-btn:hover { background: #d4ece4; }
.chat-attach-preview { display: flex; flex-wrap: wrap; gap: 8px; padding: 0 15px 10px; }
.chat-attach-preview:empty { display: none; }
.chat-attach-chip { display: inline-flex; align-items: center; gap: 6px; background: #eaf7f3; border: 1px solid #d4ece4; border-radius: 16px; padding: 4px 10px; font-size: 0.72rem; color: #235347; max-width: 200px; }
.chat-attach-chip span { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.chat-attach-chip button { background: none; border: none; cursor: pointer; font-size: 0.85rem; line-height: 1; color: #235347; padding: 0; }
.bubble-file { display: inline-flex; align-items: center; gap: 8px; padding: 8px 12px; background: rgba(255,255,255,0.15); border-radius: 10px; text-decoration: none; color: inherit; font-size: 0.78rem; max-width: 240px; }
.bubble-file.recv-file { background: #eaf7f3; color: #235347; }
.bubble-file svg { flex-shrink: 0; }
.bubble-file span { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.bubble-img { display: block; max-width: 220px; max-height: 200px; border-radius: 10px; }

.portfolio-limit-lbl { font-size: 0.78rem; font-weight: 600; color: var(--mid); background: #f4f4f4; padding: 5px 12px; border-radius: 20px; }
.btn-danger { background: #FFEBEE; color: #D32F2F; border: 1.5px solid #FFCDD2; border-radius: var(--r-md); padding: 8px 16px; font-family: 'Inter',sans-serif; font-size: 0.81rem; font-weight: 600; cursor: pointer; transition: background var(--ease); }
.btn-danger:hover { background: #FFCDD2; }

@media (max-width: 1100px) { .portfolio-grid { grid-template-columns: repeat(2,1fr); } }
@media (max-width: 960px) { :root { --sw: 60px; } .brand-name { display: none; } .nav-btn span { display: none; } .nav-btn { justify-content: center; padding: 12px; } .nav-badge { position: absolute; top: 5px; right: 5px; } .home-layout { grid-template-columns: 1fr; } .inbox-wrap { grid-template-columns: 1fr; height: auto; } .hstats-row { gap: 8px; } .hstat { min-width: 110px; padding: 12px; } }
@media (max-width: 640px) { .main { padding: 16px 12px 40px; } .settings-grid { grid-template-columns: 1fr; } .portfolio-grid { grid-template-columns: repeat(2,1fr); } .hstats-row { flex-wrap: wrap; } .hstat { min-width: calc(50% - 6px); } }

/* ══ SETTINGS MODAL ══ */
.s-modal-bg { position: fixed; inset: 0; background: rgba(15,20,25,0.55); backdrop-filter: blur(6px); display: none; align-items: center; justify-content: center; z-index: 999; padding: 20px; }
.s-modal-bg.show { display: flex; animation: fadeBg .2s ease; }
@keyframes fadeBg { from { opacity: 0; } to { opacity: 1; } }
.s-modal { background: #fff; border-radius: 18px; width: 100%; max-width: 460px; box-shadow: 0 30px 80px rgba(0,0,0,0.35); overflow: hidden; animation: popUp .25s cubic-bezier(.2,.9,.3,1.2); }
@keyframes popUp { from { transform: scale(.92) translateY(10px); opacity: 0; } to { transform: scale(1) translateY(0); opacity: 1; } }
.s-modal-hdr { display: flex; justify-content: space-between; align-items: center; padding: 18px 22px; border-bottom: 1px solid #eee; }
.s-modal-hdr h3 { font-family: 'Sora',sans-serif; font-size: 1.05rem; font-weight: 700; color: #1a1a1a; }
.s-modal-close { background: none; border: none; font-size: 1.1rem; cursor: pointer; color: #888; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
.s-modal-close:hover { background: #f3f3f3; color: #000; }
.s-modal-body { padding: 22px; max-height: 70vh; overflow-y: auto; }
.s-modal-body label { display: block; font-size: 0.78rem; font-weight: 600; color: #444; margin: 10px 0 6px; }
.s-modal-body input[type=text], .s-modal-body input[type=email], .s-modal-body input[type=password] { width: 100%; padding: 10px 12px; border: 1.5px solid #e3e3e3; border-radius: 10px; font-family: 'Inter',sans-serif; font-size: 0.88rem; outline: none; transition: border .2s; }
.s-modal-body input:focus { border-color: var(--accent); }
.s-toggle-row { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #f0f0f0; }
.s-toggle-row:last-child { border-bottom: none; }
.s-toggle-row span { font-size: 0.86rem; color: #333; font-weight: 500; }
.s-switch { position: relative; width: 38px; height: 22px; background: #ddd; border-radius: 12px; cursor: pointer; transition: background .2s; flex-shrink: 0; }
.s-switch::after { content: ''; position: absolute; top: 2px; left: 2px; width: 18px; height: 18px; background: #fff; border-radius: 50%; transition: transform .2s; box-shadow: 0 1px 3px rgba(0,0,0,0.2); }
.s-switch.on { background: var(--accent); }
.s-switch.on::after { transform: translateX(16px); }
.s-modal-body .btn-accent { margin-top: 16px; width: 100%; padding: 11px; font-size: 0.88rem; }
.s-modal-body p.s-hint { font-size: 0.8rem; color: var(--muted); line-height: 1.5; margin-bottom: 8px; }
.s-modal-body textarea { width: 100%; padding: 10px 12px; border: 1.5px solid #e3e3e3; border-radius: 10px; font-family: 'Inter',sans-serif; font-size: 0.88rem; outline: none; transition: border .2s; resize: vertical; min-height: 90px; }
.s-modal-body textarea:focus { border-color: var(--accent); }
.sm-chips { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 6px; }
.sm-chip { background: #eaf7f3; border: 1.5px solid var(--accent-hl); color: var(--accent); font-size: 0.74rem; font-weight: 600; padding: 4px 10px; border-radius: 20px; display: inline-flex; align-items: center; gap: 6px; }
.sm-chip button { background: none; border: none; color: var(--accent); cursor: pointer; font-weight: 700; font-size: 0.9rem; line-height: 1; }

/* ── FILTERS ── */
.filter-btn { display: inline-flex; align-items: center; gap: 6px; border: none; background: #eaf7f3; color: var(--accent); border-radius: 9px; padding: 6px 12px; font-family: 'Inter',sans-serif; font-size: 0.78rem; font-weight: 700; cursor: pointer; transition: background var(--ease); margin-left: auto; flex-shrink: 0; }
.filter-btn:hover { background: #d3ede4; }
.filter-btn.active { background: var(--accent-hl); color: #fff; }
.filter-count { background: var(--accent-hl); color: #fff; font-size: 0.65rem; font-weight: 700; min-width: 18px; height: 18px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; padding: 0 5px; }
.filter-btn.active .filter-count { background: #fff; color: var(--accent-hl); }
.filter-panel { background: #fff; border: 1.5px solid var(--border-md); border-radius: 14px; padding: 18px 20px; margin-top: 14px; box-shadow: 0 6px 20px rgba(0,0,0,0.12); display: none; animation: filterIn .25s ease; }
.filter-panel.show { display: block; }
@keyframes filterIn { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
.filter-row { display: grid; grid-template-columns: 1fr 1.4fr; gap: 24px; margin-bottom: 14px; }
@media (max-width: 760px) { .filter-row { grid-template-columns: 1fr; } }
.filter-label { font-size: 0.7rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #666; margin-bottom: 10px; display: block; }
.filter-range { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
.filter-range input { width: 100%; padding: 8px 10px; border: 1.5px solid #e3e3e3; border-radius: 9px; font-family: 'Inter',sans-serif; font-size: 0.82rem; outline: none; }
.filter-range input:focus { border-color: var(--accent-hl); }
.filter-dash { color: #aaa; font-weight: 600; }
.filter-slider { width: 100%; accent-color: var(--accent-hl); }
.filter-chips { display: flex; flex-wrap: wrap; gap: 6px; }
.filter-chip { border: 1.5px solid #e0e0e0; background: #fafafa; color: #555; font-size: 0.75rem; font-weight: 600; padding: 6px 12px; border-radius: 20px; cursor: pointer; transition: all .2s; font-family: 'Inter',sans-serif; }
.filter-chip:hover { border-color: var(--accent-hl); color: var(--accent); }
.filter-chip.selected { background: var(--accent-hl); border-color: var(--accent-hl); color: #fff; }
.filter-actions { display: flex; justify-content: flex-end; gap: 10px; padding-top: 6px; border-top: 1px solid #f0f0f0; }

/* ── STATS DETAIL MODAL ── */
.stat-modal-bg { position: fixed; inset: 0; background: rgba(15,37,32,0.65); backdrop-filter: blur(10px); display: none; align-items: center; justify-content: center; z-index: 1000; padding: 20px; opacity: 0; transition: opacity .25s ease; }
.stat-modal-bg.show { display: flex; opacity: 1; }
.stat-modal { background: #fff; border-radius: 22px; width: 100%; max-width: 620px; max-height: 86vh; overflow: hidden; box-shadow: 0 40px 100px rgba(0,0,0,0.45); display: flex; flex-direction: column; transform: translateY(60px) scale(0.85) rotateX(10deg); transform-origin: center 80%; opacity: 0; transition: transform .55s cubic-bezier(.16,1,.3,1), opacity .35s ease; }
.stat-modal-bg.show .stat-modal { transform: translateY(0) scale(1) rotateX(0); opacity: 1; }
.stat-modal-head { padding: 22px 26px; display: flex; align-items: center; gap: 14px; color: #fff; position: relative; }
.stat-modal-head .stat-modal-icon { width: 50px; height: 50px; border-radius: 14px; background: rgba(255,255,255,0.18); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.stat-modal-head .stat-modal-icon svg { stroke: #fff; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
.stat-modal-head h3 { font-family: 'Sora',sans-serif; font-size: 1.15rem; font-weight: 700; }
.stat-modal-head p { font-size: 0.78rem; opacity: 0.85; margin-top: 2px; }
.stat-modal-close { position: absolute; top: 16px; right: 16px; width: 32px; height: 32px; border-radius: 50%; background: rgba(255,255,255,0.2); border: none; color: #fff; font-size: 1rem; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background .2s; }
.stat-modal-close:hover { background: rgba(255,255,255,0.35); }
.stat-modal-body { padding: 22px 26px 26px; overflow-y: auto; }
.stat-list { display: flex; flex-direction: column; gap: 10px; }
.stat-row { display: flex; align-items: center; gap: 12px; padding: 12px 14px; background: #f7fbf9; border: 1px solid #eef4f1; border-radius: 12px; transition: transform .2s, box-shadow .2s; opacity: 0; transform: translateX(-12px); animation: rowIn .4s cubic-bezier(.2,.8,.2,1) forwards; }
@keyframes rowIn { to { opacity: 1; transform: translateX(0); } }
.stat-row:hover { transform: translateX(4px); box-shadow: 0 4px 14px rgba(0,0,0,0.06); }
.stat-row-thumb { width: 46px; height: 46px; border-radius: 11px; background: linear-gradient(135deg, var(--accent-hl), var(--accent)); display: flex; align-items: center; justify-content: center; color: #fff; font-family: 'Sora',sans-serif; font-weight: 700; font-size: 0.95rem; flex-shrink: 0; }
.stat-row-body { flex: 1; min-width: 0; }
.stat-row-title { font-size: 0.88rem; font-weight: 700; color: #1a1a1a; }
.stat-row-sub { font-size: 0.74rem; color: #888; margin-top: 2px; }
.stat-row-side { font-size: 0.8rem; font-weight: 700; color: var(--accent); white-space: nowrap; }
.stat-row-stars { color: #f9a825; font-size: 0.78rem; letter-spacing: 1px; }
.stat-empty { text-align: center; padding: 30px 10px; color: #aaa; font-size: 0.85rem; }
</style>
</head>
<body>

<!-- ══ ONBOARDING ══ -->
<div id="onboarding-overlay">
  <div class="ob-box">
    <div class="ob-logo">
      <div class="ob-logo-b">B</div>
      <span class="ob-logo-name">BIFROST</span>
    </div>
    <div class="ob-progress">
      <div class="ob-dot done" id="dot-0"></div>
      <div class="ob-dot" id="dot-1"></div>
      <div class="ob-dot" id="dot-2"></div>
      <div class="ob-dot" id="dot-3"></div>
    </div>
    <div class="ob-step active" id="ob-step-0">
      <p class="ob-eyebrow">Welcome to Bifrost</p>
      <h2 class="ob-title">What's your name?</h2>
      <p class="ob-sub">This is how clients and other creators will see you on the platform.</p>
      <label class="ob-label">Full Name</label>
      <input class="ob-input" type="text" id="ob-name" placeholder="e.g. Alex Rivera" autocomplete="off"/>
      <div class="ob-btn-row">
        <button class="ob-next" onclick="obNext(0)">Continue →</button>
      </div>
    </div>
    <div class="ob-step" id="ob-step-1">
      <p class="ob-eyebrow">Step 2 of 4</p>
      <h2 class="ob-title">What tools do you use?</h2>
      <p class="ob-sub">Select your editing apps to get matched with the right clients.</p>
      <div class="ob-skills-grid" id="ob-skills-grid"></div>
      <div class="ob-btn-row">
        <button class="ob-next" onclick="obNext(1)">Continue →</button>
        <button class="ob-skip" onclick="obSkip(1)">Skip</button>
      </div>
    </div>
    <div class="ob-step" id="ob-step-2">
      <p class="ob-eyebrow">Step 3 of 4</p>
      <h2 class="ob-title">Write your bio</h2>
      <p class="ob-sub">Tell clients about your experience, style, and what you specialise in. Minimum 100 letters.</p>
      <label class="ob-label">Bio</label>
      <textarea class="ob-textarea" id="ob-bio" placeholder="e.g. I'm a video editor and motion designer with 4+ years of professional experience..."></textarea>
      <p class="ob-word-count" id="ob-word-count">0 / 100 letters</p>
      <div class="ob-btn-row">
        <button class="ob-next" id="ob-bio-btn" onclick="obNext(2)">Continue →</button>
        <button class="ob-skip" onclick="obSkip(2)">Skip</button>
      </div>
    </div>
    <div class="ob-step" id="ob-step-3">
      <p class="ob-eyebrow">Step 4 of 4</p>
      <h2 class="ob-title">Add a profile photo</h2>
      <p class="ob-sub">A photo helps you stand out and builds trust with clients.</p>
      <div class="ob-pfp-area">
        <div class="ob-pfp-preview" id="ob-pfp-preview">
          <svg viewBox="0 0 24 24" width="28" height="28"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          <img id="ob-pfp-img" src="" alt=""/>
        </div>
        <div>
          <label class="ob-pfp-btn" for="ob-pfp-upload">Upload Photo</label>
          <input type="file" id="ob-pfp-upload" accept="image/*" style="display:none"/>
          <p style="font-size:0.73rem;color:#bbb;margin-top:7px;">JPG, PNG or WebP · Max 5MB</p>
        </div>
      </div>
      <div class="ob-btn-row">
        <button class="ob-next" onclick="obFinish()">Enter Bifrost →</button>
        <button class="ob-skip" onclick="obFinish()">Skip</button>
      </div>
    </div>
  </div>
</div>

<!-- ══ SIDEBAR ══ -->
<aside class="sidebar">
  <div class="sidebar-brand">
    <span class="brand-b">B</span>
    <span class="brand-name">BIFROST</span>
  </div>
  <nav class="sidebar-nav">
    <button class="nav-btn active" data-page="home">
      <svg viewBox="0 0 24 24"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"/><path d="M9 21V12h6v9"/></svg>
      <span>Home</span>
    </button>
    <button class="nav-btn" data-page="explore">
      <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      <span>Explore</span>
    </button>
    <button class="nav-btn" data-page="inbox">
      <svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
      <span>Inbox</span>
      <span class="nav-badge">3</span>
    </button>
    <button class="nav-btn" data-page="settings">
      <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
      <span>Settings</span>
    </button>
  </nav>
  <div class="sidebar-bottom">
    <button class="nav-btn logout-nav" onclick="if(confirm('Sign out of Bifrost?')){fetch('https://creatorbridge-backend-tjrd.onrender.com/auth/logout',{method:'POST',credentials:'include'}).finally(()=>{window.location.href='index.html';});}">
      <svg viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
      <span>Logout</span>
    </button>
  </div>
</aside>

<!-- ══ MAIN ══ -->
<main class="main">

  <!-- HOME -->
  <section class="page active" id="page-home">
    <div class="home-layout">
      <div>
        <div class="profile-card">
          <div class="profile-avatar-area">
            <div class="avatar-ring">
              <img src="data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'%3E%3Crect width='120' height='120' fill='%23eaf7f3'/%3E%3Ccircle cx='60' cy='46' r='22' fill='%234aab8f'/%3E%3Cpath d='M18 112c0-23 19-38 42-38s42 15 42 38' fill='%234aab8f'/%3E%3C/svg%3E" alt="Profile" class="avatar-img" id="profile-avatar-img"/>
            </div>
            <label class="avatar-edit" title="Change photo">
              <svg viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>
              <input type="file" accept="image/*" id="avatar-upload" style="display:none"/>
            </label>
          </div>
          <h2 class="profile-name" id="profile-name-display">Alex Rivera</h2>
          <p class="profile-handle" id="profile-handle-display">@alexrivera · Video Editor</p>
          <div class="p-stats">
            <div class="pstat"><span class="pstat-num">5</span><span class="pstat-lbl">Followers</span></div>
            <div class="pstat-div"></div>
            <div class="pstat"><span class="pstat-num">7</span><span class="pstat-lbl">Following</span></div>
            <div class="pstat-div"></div>
            <div class="pstat"><span class="pstat-num" id="post-count">0</span><span class="pstat-lbl">Posts</span></div>
          </div>
          <div class="profile-sec">
            <p class="profile-sec-lbl">Skills</p>
            <div class="chips" id="profile-skills-chips">
              <span class="chip">Premiere Pro</span><span class="chip">After Effects</span><span class="chip">DaVinci</span><span class="chip">Photoshop</span>
            </div>
          </div>
          <div class="profile-sec">
            <p class="profile-sec-lbl">Bio</p>
            <p class="profile-bio" id="profile-bio-display"><em style="color:#aaa;">No bio yet. Click Edit Profile to add one.</em></p>
          </div>
          <button class="btn-accent full" onclick="navigateTo('settings')">
            <svg viewBox="0 0 24 24" width="14" height="14" stroke="#fff" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>
            Edit Profile
          </button>
        </div>
      </div>

      <div class="portfolio-col">
        <!-- PORTFOLIO -->
        <div class="portfolio-card">
          <div class="portfolio-header">
            <h3 class="section-heading">My Portfolio</h3>
            <span class="portfolio-limit-lbl" id="portfolio-limit-lbl">0 / 9</span>
            <input type="file" accept="image/*,video/*,audio/*" multiple id="portfolio-upload" style="display:none"/>
          </div>
          <div class="portfolio-grid" id="portfolio-grid">
            <div class="add-slot" id="add-slot">
              <svg viewBox="0 0 24 24" width="26" height="26"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              <span>Add Work</span>
            </div>
          </div>
        </div>

        <!-- ══ BREEZE STAT CARDS ══ -->
        <div class="hstats-wrap">
          <div class="hstats-row">
            <div class="hstat" data-stat="projects">
              <div class="hstat-icon" style="background:#E8F5E9;">
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="#388E3C" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <div>
                <p class="hstat-num">24</p>
                <p class="hstat-lbl">Projects Done</p>
              </div>
            </div>
            <div class="hstat" data-stat="ratings">
              <div class="hstat-icon" style="background:#FFF8E1;">
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="#F9A825" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              </div>
              <div>
                <p class="hstat-num">4.8 ★</p>
                <p class="hstat-lbl">Avg Rating</p>
              </div>
            </div>
            <div class="hstat" data-stat="clients">
              <div class="hstat-icon" style="background:#E3F2FD;">
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="#1976D2" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              </div>
              <div>
                <p class="hstat-num">18</p>
                <p class="hstat-lbl">Total Clients</p>
              </div>
            </div>
            <div class="hstat" data-stat="earnings">
              <div class="hstat-icon" style="background:#E8F5E9;">
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="#2E7D32" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              </div>
              <div>
                <p class="hstat-num">&#8377;84k</p>
                <p class="hstat-lbl">Earnings</p>
              </div>
            </div>
            <div class="hstat" data-stat="response">
              <div class="hstat-icon" style="background:#FCE4EC;">
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="#C2185B" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              </div>
              <div>
                <p class="hstat-num">96%</p>
                <p class="hstat-lbl">Response Rate</p>
              </div>
            </div>
          </div>
        </div>

        <!-- REVIEWS -->
        <div class="reviews-card">
          <h3 class="section-heading">Recent Reviews</h3>
          <div class="reviews-list">
            <div class="review-item"><img src="https://i.pravatar.cc/36?img=3" class="review-av"/><div class="review-body"><div class="review-top"><span class="review-name">TechCraft Studios</span><span class="review-stars">&#9733;&#9733;&#9733;&#9733;&#9733;</span></div><p class="review-text">"Incredibly fast, clean edits. Delivered way ahead of schedule. Will definitely rehire!"</p></div></div>
            <div class="review-item"><img src="https://i.pravatar.cc/36?img=7" class="review-av"/><div class="review-body"><div class="review-top"><span class="review-name">Travel Vlogger Co.</span><span class="review-stars">&#9733;&#9733;&#9733;&#9733;&#9733;</span></div><p class="review-text">"Turned raw footage into a cinematic masterpiece. Communication was perfect throughout."</p></div></div>
            <div class="review-item"><img src="https://i.pravatar.cc/36?img=15" class="review-av"/><div class="review-body"><div class="review-top"><span class="review-name">Fitness Brand Pro</span><span class="review-stars">&#9733;&#9733;&#9733;&#9733;&#9734;</span></div><p class="review-text">"Great reels, very on-brand. One revision needed but handled super quickly."</p></div></div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- EXPLORE -->
  <section class="page" id="page-explore">
    <div class="explore-header">
      <p class="eyebrow">Marketplace</p>
      <h1>Explore Clients</h1>
      <div class="explore-controls">
        <div class="search-bar">
          <svg viewBox="0 0 24 24" width="15" height="15"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" placeholder="Search by skill, budget, client or type…" id="explore-search"/>
          <button id="filter-toggle" class="filter-btn" type="button" title="Filter clients">
            <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
            Filters <span id="filter-count-pill" class="filter-count" style="display:none;">0</span>
          </button>
        </div>
        <span class="explore-count" id="explore-count">15 listings</span>
      </div>
      <div class="filter-panel" id="filter-panel">
        <div class="filter-row">
          <div class="filter-group">
            <label class="filter-label">Budget range (₹)</label>
            <div class="filter-range">
              <input type="number" id="filter-min" min="100" max="100000" step="500" placeholder="Min" value="100"/>
              <span class="filter-dash">—</span>
              <input type="number" id="filter-max" min="100" max="100000" step="500" placeholder="Max" value="100000"/>
            </div>
            <input type="range" id="filter-max-slider" min="100" max="100000" step="500" value="100000" class="filter-slider"/>
          </div>
          <div class="filter-group">
            <label class="filter-label">Type of work</label>
            <div class="filter-chips" id="filter-work-chips">
              <button type="button" class="filter-chip" data-work="yt">Editing YT Videos</button>
              <button type="button" class="filter-chip" data-work="thumb">Making Thumbnails</button>
              <button type="button" class="filter-chip" data-work="reel">Editing Reels</button>
              <button type="button" class="filter-chip" data-work="short">Editing Shorts</button>
              <button type="button" class="filter-chip" data-work="podcast">Podcast Edit</button>
              <button type="button" class="filter-chip" data-work="doc">Documentary</button>
              <button type="button" class="filter-chip" data-work="ad">Ads / Promo</button>
              <button type="button" class="filter-chip" data-work="music">Music Video</button>
            </div>
          </div>
        </div>
        <div class="filter-actions">
          <button class="btn-outline" type="button" id="filter-reset">Reset</button>
          <button class="btn-accent sm" type="button" id="filter-apply">Apply Filters</button>
        </div>
      </div>
    </div>
    <div class="client-feed" id="client-feed"></div>
  </section>

  <!-- INBOX -->
  <section class="page" id="page-inbox">
    <div class="inbox-wrap">
      <div class="convo-panel">
        <div class="convo-panel-hdr">
          <div class="convo-panel-title">Inbox <span class="inbox-badge" id="inbox-badge">3</span></div>
          <div class="inbox-search">
            <svg viewBox="0 0 24 24" width="14" height="14"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" placeholder="Search conversations…" id="inbox-search-input"/>
          </div>
        </div>
        <div class="convo-list" id="convo-list"></div>
      </div>
      <div class="chat-pane">
        <div class="chat-hdr">
          <div class="chat-hdr-av" id="chat-hdr-av"></div>
          <div><p class="chat-hdr-name" id="chat-hdr-name">Select a conversation</p><p class="chat-hdr-status">Online</p></div>
        </div>
        <div class="chat-msgs" id="chat-msgs">
          <div class="chat-empty">
            <svg viewBox="0 0 24 24" width="40" height="40" stroke="#ccc" fill="none" stroke-width="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            <p>Click a conversation to start chatting</p>
          </div>
        </div>
        <div class="chat-input-row">
          <label class="chat-attach-btn" for="chat-attach" title="Attach file">
            <svg viewBox="0 0 24 24" width="18" height="18" stroke="#235347" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
            <input type="file" id="chat-attach" multiple style="display:none" accept="image/*,video/*,audio/*,application/pdf,.doc,.docx,.zip"/>
          </label>
          <input type="text" class="chat-input" id="chat-input" placeholder="Type a message…"/>
          <button class="send-btn" id="send-btn">
            <svg viewBox="0 0 24 24" width="17" height="17" fill="white"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          </button>
        </div>
        <div class="chat-attach-preview" id="chat-attach-preview"></div>
      </div>
    </div>
  </section>

  <!-- SETTINGS -->
  <section class="page" id="page-settings">
    <p class="eyebrow">Account</p>
    <h1 class="page-title">Settings</h1>
    <div class="settings-grid">
      <div class="settings-card"><div class="s-icon" style="background:#E8F5E9"><svg viewBox="0 0 24 24" width="22" height="22" stroke="#388E3C" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></div><div class="s-info"><h3>Change Password</h3><p>Update your account password with a strong unique one.</p></div><button class="btn-accent sm" data-setting="password">Update</button></div>
      <div class="settings-card"><div class="s-icon" style="background:#E3F2FD"><svg viewBox="0 0 24 24" width="22" height="22" stroke="#1976D2" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg></div><div class="s-info"><h3>Notification Preferences</h3><p>Control email, push, and in-app alerts.</p></div><button class="btn-accent sm" data-setting="notifications">Manage</button></div>
      <div class="settings-card"><div class="s-icon" style="background:#FFF8E1"><svg viewBox="0 0 24 24" width="22" height="22" stroke="#F9A825" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div><div class="s-info"><h3>Account Information</h3><p>Edit your name, username and email address.</p></div><button class="btn-accent sm" data-setting="account">Edit</button></div>
      <div class="settings-card"><div class="s-icon" style="background:#EDE7F6"><svg viewBox="0 0 24 24" width="22" height="22" stroke="#7B1FA2" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></div><div class="s-info"><h3>Privacy Settings</h3><p>Control who can see your profile and work.</p></div><button class="btn-accent sm" data-setting="privacy">Configure</button></div>
      <div class="settings-card"><div class="s-icon" style="background:#FCE4EC"><svg viewBox="0 0 24 24" width="22" height="22" stroke="#C2185B" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg></div><div class="s-info"><h3>Payment &amp; Billing</h3><p>Manage payout methods and invoices.</p></div><button class="btn-accent sm" data-setting="billing">View</button></div>
      <div class="settings-card"><div class="s-icon" style="background:#FFEBEE"><svg viewBox="0 0 24 24" width="22" height="22" stroke="#D32F2F" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg></div><div class="s-info"><h3>Logout</h3><p>Sign out of Bifrost on this device.</p></div><button class="btn-danger" data-setting="logout">Logout</button></div>
    </div>
  </section>

  <!-- SETTINGS MODAL -->
  <div class="s-modal-bg" id="s-modal-bg">
    <div class="s-modal" id="s-modal">
      <div class="s-modal-hdr"><h3 id="s-modal-title">Setting</h3><button class="s-modal-close" id="s-modal-close">&#10005;</button></div>
      <div class="s-modal-body" id="s-modal-body"></div>
    </div>
  </div>

  <!-- STATS DETAIL MODAL -->
  <div class="stat-modal-bg" id="stat-modal-bg">
    <div class="stat-modal" id="stat-modal">
      <div class="stat-modal-head" id="stat-modal-head">
        <div class="stat-modal-icon" id="stat-modal-icon"></div>
        <div>
          <h3 id="stat-modal-title">Title</h3>
          <p id="stat-modal-sub">Subtitle</p>
        </div>
        <button class="stat-modal-close" id="stat-modal-close">&#10005;</button>
      </div>
      <div class="stat-modal-body" id="stat-modal-body"></div>
    </div>
  </div>

</main>

<script>
/* ══ ONBOARDING ══ */
var EDITING_TOOLS = [
  { name:'Premiere Pro',    icon:'https://upload.wikimedia.org/wikipedia/commons/4/40/Adobe_Premiere_Pro_CC_icon.svg' },
  { name:'After Effects',   icon:'https://upload.wikimedia.org/wikipedia/commons/c/cb/Adobe_After_Effects_CC_icon.svg' },
  { name:'DaVinci Resolve', icon:'https://upload.wikimedia.org/wikipedia/commons/9/90/DaVinci_Resolve_17_logo.svg' },
  { name:'Final Cut Pro',   icon:'https://upload.wikimedia.org/wikipedia/commons/9/9e/Final_Cut_Pro_X_icon.png' },
  { name:'Photoshop',       icon:'https://upload.wikimedia.org/wikipedia/commons/a/af/Adobe_Photoshop_CC_icon.svg' },
  { name:'Lightroom',       icon:'https://upload.wikimedia.org/wikipedia/commons/b/b6/Adobe_Photoshop_Lightroom_CC_logo.svg' },
  { name:'Adobe Express',   icon:'https://upload.wikimedia.org/wikipedia/commons/8/8e/Adobe_Express_Logo.svg' },
  { name:'CapCut',          icon:'https://upload.wikimedia.org/wikipedia/commons/e/e9/CapCut_logo.svg' },
  { name:'InShot',          icon:'https://upload.wikimedia.org/wikipedia/commons/a/a2/InShot_app_logo.png' },
  { name:'iMovie',          icon:'https://upload.wikimedia.org/wikipedia/en/4/40/IMovie_Icon.png' },
  { name:'Filmora',         icon:'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Filmora_logo_new.svg/600px-Filmora_logo_new.svg.png' },
  { name:'Vegas Pro',       icon:'https://upload.wikimedia.org/wikipedia/commons/a/a5/VEGAS_Pro_logo.png' },
  { name:'Audition',        icon:'https://upload.wikimedia.org/wikipedia/commons/0/0d/Adobe_Audition_CC_icon_%282020%29.svg' },
  { name:'Blender',         icon:'https://upload.wikimedia.org/wikipedia/commons/0/0c/Blender_logo_no_text.svg' },
  { name:'Canva',           icon:'https://upload.wikimedia.org/wikipedia/commons/0/08/Canva_icon_2021.svg' },
  { name:'Figma',           icon:'https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg' },
  { name:'Illustrator',     icon:'https://upload.wikimedia.org/wikipedia/commons/f/fb/Adobe_Illustrator_CC_icon.svg' },
];
var selectedSkills = new Set();
var obProfileImg = null;
var obName = '';
var obBio = '';
var grid = document.getElementById('ob-skills-grid');
EDITING_TOOLS.forEach(function(tool) {
  var chip = document.createElement('div');
  chip.className = 'ob-skill-chip';
  chip.innerHTML = '<img src="' + tool.icon + '" alt="" onerror="this.style.display=\'none\'"/>' + tool.name;
  chip.addEventListener('click', function() {
    chip.classList.toggle('selected');
    if (chip.classList.contains('selected')) selectedSkills.add(tool.name);
    else selectedSkills.delete(tool.name);
  });
  grid.appendChild(chip);
});
document.getElementById('ob-bio').addEventListener('input', function() {
  var letters = this.value.trim().length;
  var el = document.getElementById('ob-word-count');
  el.textContent = letters + ' / 100 letters minimum';
  el.className = 'ob-word-count' + (letters >= 100 ? ' ok' : letters > 60 ? ' warn' : '');
});
document.getElementById('ob-pfp-upload').addEventListener('change', function() {
  var f = this.files[0]; if (!f) return;
  obProfileImg = URL.createObjectURL(f);
  var img = document.getElementById('ob-pfp-img');
  img.src = obProfileImg; img.style.display = 'block';
  document.querySelector('.ob-pfp-preview svg').style.display = 'none';
});
function obNext(step) {
  if (step === 0) {
    var val = document.getElementById('ob-name').value.trim();
    if (!val) { document.getElementById('ob-name').focus(); return; }
    obName = val;
  }
  if (step === 2) {
    var bioText = document.getElementById('ob-bio').value.trim();
    if (bioText.length < 100) {
      document.getElementById('ob-bio').focus();
      document.getElementById('ob-word-count').style.color = '#e74c3c';
      document.getElementById('ob-word-count').textContent = bioText.length + ' / 100 letters — please write at least 100 letters';
      return;
    }
    obBio = bioText;
  }
  goToStep(step + 1);
}
function obSkip(step) { goToStep(step + 1); }
function goToStep(nextStep) {
  document.querySelectorAll('.ob-step').forEach(function(s) { s.classList.remove('active'); });
  document.getElementById('ob-step-' + nextStep).classList.add('active');
  for (var i = 0; i <= nextStep; i++) {
    var d = document.getElementById('dot-' + i);
    if (d) d.classList.add('done');
  }
}
function obFinish() {
  if (obName) {
    document.getElementById('profile-name-display').textContent = obName;
    document.getElementById('profile-handle-display').textContent = '@' + obName.toLowerCase().replace(/\s+/g,'') + ' · Video Editor';
  }
  if (obProfileImg) document.getElementById('profile-avatar-img').src = obProfileImg;
  if (selectedSkills.size > 0) {
    var el = document.getElementById('profile-skills-chips');
    el.innerHTML = '';
    selectedSkills.forEach(function(s) {
      var c = document.createElement('span'); c.className = 'chip'; c.textContent = s; el.appendChild(c);
    });
  }
  if (obBio) document.getElementById('profile-bio-display').textContent = obBio;
  document.getElementById('onboarding-overlay').style.display = 'none';
  fetch('https://creatorbridge-backend-tjrd.onrender.com/auth/onboarding', {
    method: 'POST', credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ bio: obBio, skills: Array.from(selectedSkills), img: obProfileImg })
  }).catch(function(){});
}

(async function restoreProfile() {
  function applyProfile(p, name) {
    document.getElementById('onboarding-overlay').style.display = 'none';
    if (name) { document.getElementById('profile-name-display').textContent = name; document.getElementById('profile-handle-display').textContent = '@' + name.toLowerCase().replace(/\s+/g,'') + ' · Video Editor'; }
    if (p.img) document.getElementById('profile-avatar-img').src = p.img;
    if (p.bio) document.getElementById('profile-bio-display').textContent = p.bio;
    if (p.skills && p.skills.length) { var el = document.getElementById('profile-skills-chips'); el.innerHTML = ''; p.skills.forEach(function(s) { var c = document.createElement('span'); c.className = 'chip'; c.textContent = s; el.appendChild(c); }); }
  }
  try {
    var res = await fetch('https://creatorbridge-backend-tjrd.onrender.com/auth/onboarding', { credentials: 'include' });
    if (res.ok) {
      var data = await res.json();
      if (data.onboarding && data.onboarding.done) {
        // Also get name from /auth/me
        var meRes = await fetch('https://creatorbridge-backend-tjrd.onrender.com/auth/me', { credentials: 'include' });
        var me = meRes.ok ? await meRes.json() : {};
        localStorage.setItem('cb_onboarding_done', '1');
        localStorage.setItem('cb_profile', JSON.stringify({ ...data.onboarding, name: me.user && me.user.name }));
        applyProfile(data.onboarding, me.user && me.user.name);
        return;
      }
    }
  } catch(e) {}
  // Clear any stale data from a previously logged-in account
  localStorage.removeItem('cb_onboarding_done');
  localStorage.removeItem('cb_profile');
})();

/* ══ NAV ══ */
function navigateTo(page) {
  document.querySelectorAll('.page').forEach(function(p) { p.classList.remove('active'); });
  var el = document.getElementById('page-' + page); if (el) el.classList.add('active');
  document.querySelectorAll('.nav-btn[data-page]').forEach(function(b) { b.classList.toggle('active', b.dataset.page === page); });
}
document.querySelectorAll('.nav-btn[data-page]').forEach(function(btn) {
  btn.addEventListener('click', function() { navigateTo(btn.dataset.page); });
});

/* ══ AVATAR ══ */
document.getElementById('avatar-upload').addEventListener('change', function() {
  var f = this.files[0]; if (!f) return;
  document.getElementById('profile-avatar-img').src = URL.createObjectURL(f);
});

/* ══ PORTFOLIO ══ */
var postCount = 0;
function updatePostCount() { document.getElementById('post-count').textContent = postCount; updatePortfolioLimitUI(); }
var PORTFOLIO_LIMIT = 9;
function updatePortfolioLimitUI() {
  var lbl = document.getElementById('portfolio-limit-lbl');
  if (lbl) lbl.textContent = postCount + ' / ' + PORTFOLIO_LIMIT;
  var slot = document.getElementById('add-slot');
  if (slot) slot.style.display = postCount >= PORTFOLIO_LIMIT ? 'none' : '';
}
document.getElementById('portfolio-upload').addEventListener('change', function() {
  var gridEl = document.getElementById('portfolio-grid');
  var slot = document.getElementById('add-slot');
  var remaining = PORTFOLIO_LIMIT - postCount;
  var files = Array.from(this.files).slice(0, Math.max(0, remaining));
  if (this.files.length > files.length) {
    alert('You can upload a maximum of ' + PORTFOLIO_LIMIT + ' works. Only ' + files.length + ' added.');
  }
  files.forEach(function(file) {
    var url = URL.createObjectURL(file);
    var isVideo = file.type.startsWith('video/');
    var isAudio = file.type.startsWith('audio/');
    var item = document.createElement('div'); item.className = 'p-item';
    var label = file.name.split('.')[0].slice(0,16);
    if (isVideo) {
      item.innerHTML = '<video src="'+url+'" controls preload="metadata" playsinline></video><span class="p-tag">&#9654; '+label+'</span><div class="p-overlay"><button class="p-del">&#10005;</button></div>';
    } else if (isAudio) {
      item.style.background='#1a3530';
      item.innerHTML = '<div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;"><svg viewBox="0 0 24 24" width="32" height="32" stroke="#4aab8f" fill="none" stroke-width="1.5"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg><audio controls src="'+url+'" style="width:90%;height:28px;"></audio></div><span class="p-tag">&#9834; '+label+'</span><div class="p-overlay"><button class="p-del">&#10005;</button></div>';
    } else {
      item.innerHTML = '<img src="'+url+'" alt="'+label+'"/><span class="p-tag">'+label+'</span><div class="p-overlay"><button class="p-del">&#10005;</button></div>';
    }
    item.querySelector('.p-del').addEventListener('click', function(e) {
      e.stopPropagation(); item.remove(); postCount = Math.max(0,postCount-1); updatePostCount();
    });
    gridEl.insertBefore(item, slot);
    postCount++; updatePostCount();
  });
  this.value='';
});
document.getElementById('add-slot').addEventListener('click', function() { document.getElementById('portfolio-upload').click(); });

/* ══ CLIENTS ══ */
var CLIENTS = [
  { name:'TechCraft Studios',     av:'https://i.pravatar.cc/44?img=3',  title:'YouTube Rebrand & Animated Intro',          types:['Full YT Edit','Intro Animation','Thumbnails'], budget:'₹65,000',   days:'7 days',     desc:'We need a motion designer to create a 10s animated intro and rebrand 50+ YouTube thumbnails consistently across our channel.',              skills:['After Effects','Premiere Pro','Photoshop'] },
  { name:'Gaming Channel X',      av:'https://i.pravatar.cc/44?img=7',  title:'Weekly Gaming Highlight Reels',             types:['Highlights','Short-form','Reels'],              budget:'₹32k/mo',   days:'2 days/vid', desc:'200K sub gaming channel. Need a fast editor to cut weekly 8-10 min highlights from 4 hours of raw gameplay. Ongoing contract.',           skills:['DaVinci Resolve','Premiere Pro'] },
  { name:'Travel Vlogger Co.',    av:'https://i.pravatar.cc/44?img=9',  title:'Cinematic Travel Documentary — 3 Episodes', types:['Documentary','Color Grade','Music Sync'],       budget:'₹98,000',   days:'21 days',    desc:'Filmed across Southeast Asia. Need cinematic editor for 3 episodes. Color grade and music sync are critical to the visual tone.',           skills:['DaVinci Resolve','Final Cut Pro','Lightroom'] },
  { name:'Fitness Brand Pro',     av:'https://i.pravatar.cc/44?img=15', title:'Instagram Reels Package — 12 Clips',        types:['Reels','Social Cuts','Captions'],               budget:'₹40,000',   days:'5 days',     desc:'Fast-paced energetic workout reels for Instagram. Trending audio, text overlays, quick cuts. Must feel native to Reels algorithm.',         skills:['Premiere Pro','After Effects'] },
  { name:'Podcast Studio B',      av:'https://i.pravatar.cc/44?img=22', title:'Video Podcast Edit — Weekly',               types:['Podcast Edit','Multi-Cam','Audiograms'],        budget:'₹48k/mo',   days:'3 days/ep',  desc:'2-hour video podcast weekly. Clean multi-cam edit, intro/outro, chapter markers, and social audiograms needed each episode.',               skills:['Premiere Pro','Photoshop'] },
  { name:'Startup Founders HQ',   av:'https://i.pravatar.cc/44?img=25', title:'Product Demo Video — SaaS Platform',        types:['Product Demo','Screen Edit','Motion GFX'],      budget:'₹28,000',   days:'4 days',     desc:'Sleek modern product demo for our SaaS. Screen recordings + VO provided. Motion graphic text overlays and branded lower thirds.',           skills:['After Effects','DaVinci Resolve'] },
  { name:'Food Creator Network',  av:'https://i.pravatar.cc/44?img=33', title:'Cooking Content Batch — 20 Videos',         types:['Batch Edit','Color Grade','Captions'],          budget:'₹72,000',   days:'10 days',    desc:'5 cooking videos a week, backlog of 20. Consistent color grade, captions, transitions. Experience with food content preferred.',            skills:['Premiere Pro','DaVinci Resolve'] },
  { name:'Music Artist Agency',   av:'https://i.pravatar.cc/44?img=41', title:'Official Music Video Edit',                 types:['Music Video','Color Grade','VFX Cuts'],         budget:'₹1,20,000', days:'14 days',    desc:'Official MV for indie artist with 300K streams. Dynamic editing matching song energy + cinematic color grade. Full footage provided.',      skills:['After Effects','DaVinci Resolve','Premiere Pro'] },
  { name:'E-commerce Brand X',    av:'https://i.pravatar.cc/44?img=47', title:'Product Ads — Facebook & TikTok',           types:['Ad Edits','TikTok Cuts','Facebook Reels'],      budget:'₹36,000',   days:'6 days',     desc:'5 short product ads (15-30s) for Facebook and TikTok. UGC-style but polished — fast cuts, captions, trending audio.',                      skills:['Premiere Pro','After Effects'] },
  { name:'Documentary House',     av:'https://i.pravatar.cc/44?img=51', title:'Social Impact Documentary — 20 Mins',       types:['Documentary','Interview Edit','Sound Mix'],     budget:'₹1,60,000', days:'30 days',    desc:'Social impact doc on urban farming. Interviews, B-roll, narration. Looking for thoughtful editor who understands pacing and story.',        skills:['DaVinci Resolve','Final Cut Pro'] },
  { name:'Corporate Media Co.',   av:'https://i.pravatar.cc/44?img=55', title:'Internal Training Series — 6 Parts',        types:['Training Videos','Lower Thirds','Screen Edit'], budget:'₹60,000',   days:'12 days',    desc:'6-part enterprise training series. Screen recordings + presenter on-cam. Clean, professional with branded lower thirds.',                  skills:['Premiere Pro','Photoshop'] },
  { name:'Real Estate Influencer',av:'https://i.pravatar.cc/44?img=59', title:'Luxury Property Tours — Ongoing',           types:['Property Tours','Drone Edit','VO Sync'],        budget:'₹56k/mo',   days:'3 days/vid', desc:'Monthly contract for luxury property tour videos. Drone footage, walkthroughs, voiceover sync. Premium real estate look.',                 skills:['DaVinci Resolve','Premiere Pro','Lightroom'] },
  { name:'Educational Platform',  av:'https://i.pravatar.cc/44?img=62', title:'Online Course Videos — 15 Modules',         types:['Course Edit','Chapter Markers','Thumbnails'],   budget:'₹88,000',   days:'18 days',    desc:'Online digital marketing course — 15 modules, 10-15 min each. Clean cuts, chapters, intro/outro stings, thumbnail per module.',            skills:['Premiere Pro','After Effects','Photoshop'] },
  { name:'Fashion Label Zed',     av:'https://i.pravatar.cc/44?img=66', title:'Summer Collection Campaign Video',           types:['Campaign Video','Social Cuts','Color Grade'],   budget:'₹72,000',   days:'8 days',     desc:'90s hero video for summer drop + 6 social cuts. Aesthetic moody color grade essential. Think Zara meets A24 editorial feel.',               skills:['DaVinci Resolve','After Effects'] },
  { name:'Kids Science Channel',  av:'https://i.pravatar.cc/44?img=70', title:'Animated Explainer Episodes — 5 Parts',     types:['Animation Edit','Motion GFX','VO Sync'],        budget:'₹1,04,000', days:'20 days',    desc:'5 animated explainer episodes for kids (ages 6-10). Fun motion graphics, upbeat pacing, bright visuals. Assets provided.',                 skills:['After Effects','Premiere Pro'] }
];
var appliedSet = new Set();
function deliverablesFor(c) {
  var base = ['Final edit in 1080p/4K with project files','Up to 2 rounds of revisions included','Source assets + organised bins handover'];
  if (/reel|short|tiktok/i.test(c.title)) base.unshift('Vertical 9:16 master + 1:1 social cut');
  if (/podcast/i.test(c.title)) base.unshift('Episode master + 3 short audiograms');
  if (/documentary|cinematic/i.test(c.title)) base.unshift('Color-graded master + LUT pack');
  return base.slice(0, 3);
}
function expectationsFor(c) {
  return ['Daily progress updates via inbox','Footage shared via Google Drive / Frame.io','Comfortable matching brand tone & references'];
}
var ccObserver = null;
function ensureObserver() {
  if (ccObserver || typeof IntersectionObserver === 'undefined') return;
  ccObserver = new IntersectionObserver(function(entries){
    entries.forEach(function(en){ if (en.isIntersecting) { en.target.classList.add('in-view'); ccObserver.unobserve(en.target); } });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
}
function renderClients(list) {
  var feed = document.getElementById('client-feed');
  var countEl = document.getElementById('explore-count');
  feed.innerHTML = '';
  countEl.textContent = list.length + ' listing' + (list.length !== 1 ? 's' : '');
  if (!list.length) {
    feed.innerHTML = '<div style="background:#fff;border-radius:14px;padding:48px;text-align:center;color:#bbb;font-size:0.86rem;">No clients match your search.</div>';
    return;
  }
  ensureObserver();
  list.forEach(function(c, idx) {
    var gi = CLIENTS.indexOf(c);
    var div = document.createElement('div'); div.className = 'cc';
    div.style.transitionDelay = Math.min(idx * 40, 280) + 'ms';
    var typePills = c.types.map(function(t){ return '<span class="cc-type-pill">'+t+'</span>'; }).join('');
    var deliverables = deliverablesFor(c).map(function(d){ return '<li>'+d+'</li>'; }).join('');
    var expectations = expectationsFor(c).map(function(d){ return '<li>'+d+'</li>'; }).join('');
    var isApplied = appliedSet.has(gi);
    var applicants = 4 + ((gi * 7) % 22);
    div.innerHTML =
      '<div class="cc-main">'+
        '<div class="cc-top">'+
          '<img class="cc-av" src="'+c.av+'" alt="'+c.name+'"/>'+
          '<div style="min-width:0;"><div class="cc-name">'+c.name+'</div><div class="cc-name-sub">Verified client</div></div>'+
          '<div class="cc-budget-wrap"><div class="cc-budget">'+c.budget+'</div><div class="cc-budget-lbl">Budget</div></div>'+
        '</div>'+
        '<div class="cc-title">'+c.title+'</div>'+
        '<p class="cc-desc-preview">'+c.desc+'</p>'+
        '<div class="cc-types">'+typePills+'</div>'+
        '<div class="cc-meta">'+
          '<div class="cc-meta-left">'+
            '<span class="cc-meta-item"><svg width="14" height="14" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg><strong>'+c.days+'</strong></span>'+
            '<span class="cc-meta-item"><svg width="14" height="14" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>'+applicants+' applied</span>'+
          '</div>'+
          '<span style="font-size:0.72rem;color:#bbb;font-weight:600;">Hover to expand</span>'+
        '</div>'+
      '</div>'+
      '<div class="cc-detail"><div class="cc-detail-inner"><div class="cc-detail-content">'+
        '<div class="cc-detail-title">Project Brief</div><p class="cc-detail-text">'+c.desc+'</p>'+
        '<div class="cc-detail-title">Deliverables</div><ul class="cc-detail-list">'+deliverables+'</ul>'+
        '<div class="cc-detail-title">Client Expectations</div><ul class="cc-detail-list">'+expectations+'</ul>'+
        '<div class="cc-apply-row">'+
          '<span class="cc-apply-meta">Posted recently · '+applicants+' editors have applied</span>'+
          '<button class="apply-btn '+(isApplied?'applied':'')+'" data-ci="'+gi+'">'+(isApplied?'&#10003; Applied':'Apply Now')+'</button>'+
        '</div>'+
      '</div></div></div>';
    div.querySelector('.cc-main').addEventListener('click', function(e) {
      if (e.target.closest('.apply-btn')) return;
      var open = div.classList.contains('open');
      document.querySelectorAll('.cc.open').forEach(function(x){ if (x !== div) x.classList.remove('open'); });
      div.classList.toggle('open', !open);
    });
    div.querySelector('.apply-btn').addEventListener('click', function(e) {
      e.stopPropagation();
      var i = parseInt(e.currentTarget.dataset.ci);
      if (appliedSet.has(i)) return;
      appliedSet.add(i);
      e.currentTarget.innerHTML = '&#10003; Applied';
      e.currentTarget.classList.add('applied');
    });
    feed.appendChild(div);
    if (ccObserver) ccObserver.observe(div); else div.classList.add('in-view');
  });
}
document.getElementById('explore-search').addEventListener('input', function() {
  var q = this.value.toLowerCase();
  renderClients(q ? CLIENTS.filter(function(c){
    return c.title.toLowerCase().includes(q) || c.name.toLowerCase().includes(q) ||
      c.skills.some(function(s){ return s.toLowerCase().includes(q); }) ||
      c.types.some(function(t){ return t.toLowerCase().includes(q); });
  }) : CLIENTS);
});

/* ══ INBOX ══ */
var CONVOS = [
  { name:'Tech Creator',   av:'https://i.pravatar.cc/42?img=3',  unread:true,  msgs:[{t:'Hey! Love your portfolio. When are you free?',f:'them'},{t:'Thanks! Free this week. What does the project look like?',f:'me'},{t:'10-min YouTube doc. Full edit, color grade, thumbnails.',f:'them'},{t:"I'd love to take it on. What's your timeline?",f:'me'}] },
  { name:'Gaming Channel', av:'https://i.pravatar.cc/42?img=7',  unread:true,  msgs:[{t:'We saw your reel! Fast cuts — exactly what we need.',f:'them'},{t:'Appreciate that! Gaming content is my thing. Format?',f:'me'},{t:'Weekly highlights, ~8 mins. Raw footage is 4 hours.',f:'them'}] },
  { name:'Travel Vlogger', av:'https://i.pravatar.cc/42?img=9',  unread:false, msgs:[{t:'Back from Vietnam! Ready to send the footage.',f:'them'},{t:'Amazing! How many hours total?',f:'me'},{t:'About 60 hours across 3 episodes. Story is incredible.',f:'them'},{t:"Let's schedule a call to align on direction first.",f:'me'}] },
  { name:'Fitness Brand',  av:'https://i.pravatar.cc/42?img=15', unread:false, msgs:[{t:'Reel 3 looks great! One revision — more energy on transitions.',f:'them'},{t:'Got it! Punching them up. Give me a couple hours.',f:'me'}] },
  { name:'Podcast Studio', av:'https://i.pravatar.cc/42?img=22', unread:true,  msgs:[{t:'Episode 48 ready to send. Same format as last week?',f:'them'},{t:'Yes! Send it over, back in 2 days.',f:'me'},{t:'Perfect. Uploading to shared drive now.',f:'them'}] }
];
var activeChatIdx = null;
function countUnread(){ return CONVOS.filter(function(c){ return c.unread; }).length; }
function renderConvoList(filter) {
  var list = document.getElementById('convo-list'); list.innerHTML = '';
  var visible = filter ? CONVOS.filter(function(c){ return c.name.toLowerCase().includes(filter); }) : CONVOS;
  visible.forEach(function(c) {
    var ri = CONVOS.indexOf(c);
    var item = document.createElement('div');
    item.className = 'convo-item'+(ri===activeChatIdx?' active':'');
    item.innerHTML = '<img class="convo-av" src="'+c.av+'" alt="'+c.name+'"/><div class="convo-info"><p class="convo-name">'+c.name+'</p><p class="convo-preview">'+c.msgs[c.msgs.length-1].t+'</p></div>'+(c.unread?'<span class="convo-unread"></span>':'');
    item.addEventListener('click', function(){ openChat(ri); });
    list.appendChild(item);
  });
  var n = countUnread();
  var b = document.getElementById('inbox-badge'); b.textContent=n; b.style.display=n?'inline':'none';
  var nb = document.querySelector('.nav-btn[data-page="inbox"] .nav-badge'); if(nb){ nb.textContent=n; nb.style.display=n?'inline':'none'; }
}
function openChat(idx) {
  activeChatIdx = idx; CONVOS[idx].unread = false;
  document.getElementById('chat-hdr-name').textContent = CONVOS[idx].name;
  document.getElementById('chat-hdr-av').innerHTML = '<img src="'+CONVOS[idx].av+'" style="width:100%;height:100%;object-fit:cover;"/>';
  var area = document.getElementById('chat-msgs'); area.innerHTML = '';
  CONVOS[idx].msgs.forEach(function(m){ addBubble(m.t,m.f,area); });
  area.scrollTop = area.scrollHeight;
  renderConvoList(document.getElementById('inbox-search-input').value.toLowerCase());
}
var pendingAttachments = [];
function renderAttachPreview(){
  var pv=document.getElementById('chat-attach-preview'); pv.innerHTML='';
  pendingAttachments.forEach(function(f,i){
    var chip=document.createElement('div'); chip.className='chat-attach-chip';
    chip.innerHTML='<span>'+f.name+'</span><button title="Remove">&times;</button>';
    chip.querySelector('button').addEventListener('click',function(){ pendingAttachments.splice(i,1); renderAttachPreview(); });
    pv.appendChild(chip);
  });
}
function addBubble(text,from,area){
  var b=document.createElement('div'); b.className='bubble '+(from==='me'?'sent':'recv'); b.textContent=text; area.appendChild(b);
}
function addFileBubble(file,url,from,area){
  var b=document.createElement('div'); b.className='bubble '+(from==='me'?'sent':'recv');
  if(file.type && file.type.indexOf('image/')===0){
    b.innerHTML='<img class="bubble-img" src="'+url+'" alt="'+file.name+'"/>';
  } else {
    var cls='bubble-file'+(from==='me'?'':' recv-file');
    b.innerHTML='<a class="'+cls+'" href="'+url+'" download="'+file.name+'" target="_blank"><svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg><span>'+file.name+'</span></a>';
  }
  area.appendChild(b);
}
document.getElementById('chat-attach').addEventListener('change',function(){
  Array.from(this.files).forEach(function(f){ pendingAttachments.push(f); });
  this.value=''; renderAttachPreview();
});
function sendMsg(){
  var input=document.getElementById('chat-input'); var text=input.value.trim();
  if(activeChatIdx===null) return;
  if(!text && pendingAttachments.length===0) return;
  var c=CONVOS[activeChatIdx];
  var area=document.getElementById('chat-msgs');
  pendingAttachments.forEach(function(f){
    var url=URL.createObjectURL(f);
    c.msgs.push({t:'[file] '+f.name,f:'me'});
    addFileBubble(f,url,'me',area);
  });
  pendingAttachments=[]; renderAttachPreview();
  if(text){ c.msgs.push({t:text,f:'me'}); addBubble(text,'me',area); }
  area.scrollTop=area.scrollHeight;
  input.value=''; renderConvoList(document.getElementById('inbox-search-input').value.toLowerCase());
  setTimeout(function(){
    var replies=["Sounds great, let's do it!","Got it, will check and reply.","Awesome work as always!","That works perfectly for us.","Perfect, sending files now."];
    var reply=replies[Math.floor(Math.random()*replies.length)];
    c.msgs.push({t:reply,f:'them'}); addBubble(reply,'them',area); area.scrollTop=area.scrollHeight;
    renderConvoList(document.getElementById('inbox-search-input').value.toLowerCase());
  },1400);
}
document.getElementById('send-btn').addEventListener('click',sendMsg);
document.getElementById('chat-input').addEventListener('keydown',function(e){ if(e.key==='Enter') sendMsg(); });
document.getElementById('inbox-search-input').addEventListener('input',function(){ renderConvoList(this.value.toLowerCase()); });

/* ══ SETTINGS MODAL ══ */
var SETTINGS_FORMS = {
  password: { title:'Change Password', body:'<p class="s-hint">Choose a strong, unique password you don\'t use elsewhere.</p><label>Current Password</label><input type="password" id="sm-curpass" placeholder="••••••••"/><label>New Password</label><input type="password" id="sm-newpass" placeholder="At least 8 characters"/><label>Confirm New Password</label><input type="password" id="sm-confpass" placeholder="Repeat new password"/><button class="btn-accent" onclick="saveSetting(\'Password updated successfully\')">Update Password</button>' },
  notifications: { title:'Notification Preferences', body:'<div class="s-toggle-row"><span>Email — New client messages</span><div class="s-switch on" onclick="this.classList.toggle(\'on\')"></div></div><div class="s-toggle-row"><span>Email — Project invites</span><div class="s-switch on" onclick="this.classList.toggle(\'on\')"></div></div><div class="s-toggle-row"><span>Push — Chat replies</span><div class="s-switch on" onclick="this.classList.toggle(\'on\')"></div></div><div class="s-toggle-row"><span>Push — Payment received</span><div class="s-switch on" onclick="this.classList.toggle(\'on\')"></div></div><div class="s-toggle-row"><span>Weekly marketplace digest</span><div class="s-switch" onclick="this.classList.toggle(\'on\')"></div></div><button class="btn-accent" onclick="saveSetting(\'Notification preferences saved\')">Save Preferences</button>' },
  account: { title:'Edit Profile', body:'<p class="s-hint">Update your full profile — this is what clients will see.</p><label>Full Name</label><input type="text" id="sm-name"/><label>Username</label><input type="text" id="sm-user"/><label>Email Address</label><input type="email" id="sm-email"/><label>Role / Title</label><input type="text" id="sm-role" placeholder="e.g. Video Editor, Motion Designer"/><label>Bio</label><textarea id="sm-bio" placeholder="Tell clients about yourself…"></textarea><label>Skills (comma separated)</label><input type="text" id="sm-skills" placeholder="Premiere Pro, After Effects, Canva"/><div class="sm-chips" id="sm-skill-preview"></div><button class="btn-accent" onclick="saveAccount()">Save Changes</button>' },
  privacy: { title:'Privacy Settings', body:'<div class="s-toggle-row"><span>Public profile visible</span><div class="s-switch on" onclick="this.classList.toggle(\'on\')"></div></div><div class="s-toggle-row"><span>Show portfolio to non-clients</span><div class="s-switch on" onclick="this.classList.toggle(\'on\')"></div></div><div class="s-toggle-row"><span>Allow direct messages</span><div class="s-switch on" onclick="this.classList.toggle(\'on\')"></div></div><div class="s-toggle-row"><span>Show online status</span><div class="s-switch" onclick="this.classList.toggle(\'on\')"></div></div><div class="s-toggle-row"><span>Appear in search results</span><div class="s-switch on" onclick="this.classList.toggle(\'on\')"></div></div><button class="btn-accent" onclick="saveSetting(\'Privacy settings updated\')">Save Settings</button>' },
  billing: { title:'Payment & Billing', body:'<p class="s-hint">Manage where Bifrost sends your earnings.</p><label>Account Holder Name</label><input type="text" value="Alex Rivera"/><label>Bank / UPI ID</label><input type="text" placeholder="alexrivera@upi"/><label>PAN / Tax ID</label><input type="text" placeholder="ABCDE1234F"/><div class="s-toggle-row"><span>Auto-invoice on project close</span><div class="s-switch on" onclick="this.classList.toggle(\'on\')"></div></div><button class="btn-accent" onclick="saveSetting(\'Billing details saved\')">Save Billing Info</button>' }
};
function openSetting(key) {
  if (key === 'logout') { if (confirm('Sign out of Bifrost?')) { fetch('https://creatorbridge-backend-tjrd.onrender.com/auth/logout', { method: 'POST', credentials: 'include' }).finally(() => { window.location.href = 'index.html'; }); } return; }
  var s = SETTINGS_FORMS[key]; if (!s) return;
  document.getElementById('s-modal-title').textContent = s.title;
  document.getElementById('s-modal-body').innerHTML = s.body;
  document.getElementById('s-modal-bg').classList.add('show');
  if (key === 'account') {
    var nameEl = document.getElementById('profile-name-display');
    var handleEl = document.getElementById('profile-handle-display');
    var bioEl = document.getElementById('profile-bio-display');
    var skillsWrap = document.getElementById('profile-skills-chips');
    var handle = (handleEl.textContent || '').split('·');
    var user = (handle[0] || '').trim().replace(/^@/, '');
    var role = (handle[1] || 'Video Editor').trim();
    document.getElementById('sm-name').value = nameEl.textContent.trim();
    document.getElementById('sm-user').value = user;
    document.getElementById('sm-email').value = 'alex@bifrost.io';
    document.getElementById('sm-role').value = role;
    var bioTxt = bioEl.querySelector('em') ? '' : bioEl.textContent.trim();
    document.getElementById('sm-bio').value = bioTxt;
    var current = Array.from(skillsWrap.querySelectorAll('.chip')).map(function(c){ return c.textContent.trim(); });
    document.getElementById('sm-skills').value = current.join(', ');
    updateSkillPreview();
    document.getElementById('sm-skills').addEventListener('input', updateSkillPreview);
  }
}
function updateSkillPreview() {
  var raw = document.getElementById('sm-skills').value;
  var arr = raw.split(',').map(function(s){ return s.trim(); }).filter(Boolean);
  document.getElementById('sm-skill-preview').innerHTML = arr.map(function(s){ return '<span class="sm-chip">'+s+'</span>'; }).join('');
}
function closeSetting() { document.getElementById('s-modal-bg').classList.remove('show'); }
function saveSetting(msg) { closeSetting(); setTimeout(function(){ alert(msg); }, 150); }
function saveAccount() {
  var name = document.getElementById('sm-name').value.trim() || 'Editor';
  var user = (document.getElementById('sm-user').value.trim() || name.toLowerCase().replace(/\s+/g,''));
  var role = document.getElementById('sm-role').value.trim() || 'Video Editor';
  var bio  = document.getElementById('sm-bio').value.trim();
  var skills = document.getElementById('sm-skills').value.split(',').map(function(s){ return s.trim(); }).filter(Boolean);
  document.getElementById('profile-name-display').textContent = name;
  document.getElementById('profile-handle-display').textContent = '@' + user + ' · ' + role;
  var bioEl = document.getElementById('profile-bio-display');
  if (bio) bioEl.textContent = bio;
  else bioEl.innerHTML = '<em style="color:#aaa;">No bio yet. Click Edit Profile to add one.</em>';
  if (skills.length) {
    var el = document.getElementById('profile-skills-chips'); el.innerHTML = '';
    skills.forEach(function(s){ var c=document.createElement('span'); c.className='chip'; c.textContent=s; el.appendChild(c); });
  }
  saveSetting('Profile updated');
}
document.querySelectorAll('[data-setting]').forEach(function(b){ b.addEventListener('click', function(){ openSetting(this.dataset.setting); }); });
document.getElementById('s-modal-close').addEventListener('click', closeSetting);
document.getElementById('s-modal-bg').addEventListener('click', function(e){ if (e.target === this) closeSetting(); });

/* ══ EXPLORE FILTERS ══ */
var FILTER = { min: 100, max: 100000, work: new Set(), query: '' };
function parseBudget(b) {
  var s = String(b).replace(/[^\d.k]/gi, '').toLowerCase();
  var hasK = s.indexOf('k') !== -1;
  s = s.replace(/k/g, '');
  var n = parseFloat(s) || 0;
  if (hasK) n *= 1000;
  return n;
}
function matchesWork(c, key) {
  var hay = (c.title + ' ' + c.types.join(' ') + ' ' + c.desc).toLowerCase();
  switch(key) {
    case 'yt':      return /youtube|yt|video podcast|episode|long-form/.test(hay);
    case 'thumb':   return /thumbnail/.test(hay);
    case 'reel':    return /reel|instagram/.test(hay);
    case 'short':   return /short|shorts|tiktok|9:16/.test(hay);
    case 'podcast': return /podcast|audiogram/.test(hay);
    case 'doc':     return /documentary|cinematic/.test(hay);
    case 'ad':      return /ad|ads|promo|campaign|product demo/.test(hay);
    case 'music':   return /music video|mv\b/.test(hay);
  }
  return true;
}
function applyAllFilters() {
  var q = FILTER.query;
  var list = CLIENTS.filter(function(c) {
    var b = parseBudget(c.budget);
    if (b < FILTER.min || b > FILTER.max) return false;
    if (FILTER.work.size > 0) {
      var ok = false;
      FILTER.work.forEach(function(k){ if (matchesWork(c, k)) ok = true; });
      if (!ok) return false;
    }
    if (q) {
      var match = c.title.toLowerCase().includes(q) || c.name.toLowerCase().includes(q) ||
        c.skills.some(function(s){ return s.toLowerCase().includes(q); }) ||
        c.types.some(function(t){ return t.toLowerCase().includes(q); });
      if (!match) return false;
    }
    return true;
  });
  renderClients(list);
  updateFilterCount();
}
function updateFilterCount() {
  var n = FILTER.work.size + (FILTER.min > 100 ? 1 : 0) + (FILTER.max < 100000 ? 1 : 0);
  var pill = document.getElementById('filter-count-pill');
  var btn = document.getElementById('filter-toggle');
  pill.textContent = n;
  pill.style.display = n > 0 ? 'inline-flex' : 'none';
  btn.classList.toggle('active', n > 0);
}
document.getElementById('explore-search').addEventListener('input', function() {
  FILTER.query = this.value.toLowerCase();
  applyAllFilters();
});
document.getElementById('filter-toggle').addEventListener('click', function() {
  document.getElementById('filter-panel').classList.toggle('show');
});
document.getElementById('filter-max-slider').addEventListener('input', function() {
  document.getElementById('filter-max').value = this.value;
});
document.getElementById('filter-max').addEventListener('input', function() {
  var v = Math.max(100, Math.min(100000, parseInt(this.value) || 100000));
  document.getElementById('filter-max-slider').value = v;
});
document.querySelectorAll('#filter-work-chips .filter-chip').forEach(function(chip) {
  chip.addEventListener('click', function() {
    chip.classList.toggle('selected');
    var k = chip.dataset.work;
    if (chip.classList.contains('selected')) FILTER.work.add(k); else FILTER.work.delete(k);
  });
});
document.getElementById('filter-apply').addEventListener('click', function() {
  FILTER.min = Math.max(100, parseInt(document.getElementById('filter-min').value) || 100);
  FILTER.max = Math.max(FILTER.min, parseInt(document.getElementById('filter-max').value) || 100000);
  applyAllFilters();
  document.getElementById('filter-panel').classList.remove('show');
});
document.getElementById('filter-reset').addEventListener('click', function() {
  FILTER.min = 100; FILTER.max = 100000; FILTER.work.clear();
  document.getElementById('filter-min').value = 100;
  document.getElementById('filter-max').value = 100000;
  document.getElementById('filter-max-slider').value = 100000;
  document.querySelectorAll('#filter-work-chips .filter-chip').forEach(function(c){ c.classList.remove('selected'); });
  applyAllFilters();
});

/* ══ STATS DETAIL MODAL ══ */
var STAT_DATA = {
  projects: { title:'Projects Completed', sub:'24 projects delivered to clients', color:'linear-gradient(135deg,#388E3C,#1B5E20)', iconSvg:'<svg viewBox="0 0 24 24" width="24" height="24"><polyline points="20 6 9 17 4 12"/></svg>', rows:[['TC','TechCraft YouTube Rebrand','Animated intro + 50 thumbnails','₹65,000'],['GC','Gaming Channel Highlights','12 weekly highlight reels','₹38,400'],['TV','Travel Documentary, Vietnam','3-episode cinematic cut','₹98,000'],['FB','Fitness Brand Reels Pack','12 Instagram Reels','₹40,000'],['PS','Podcast Studio B — Ep. 48','Weekly multi-cam edit','₹12,000'],['SF','SaaS Product Demo','Motion-GFX explainer','₹28,000'],['FC','Food Creator Batch','20 cooking videos','₹72,000'],['MA','Music Artist — Official MV','Cinematic music video','₹1,20,000'],['EB','E-commerce Ad Set','5 product ads','₹36,000'],['DH','Urban Farming Doc — 20m','Long-form documentary','₹1,60,000']] },
  ratings:  { title:'Average Rating — 4.8 ★', sub:'Based on 24 verified client reviews', color:'linear-gradient(135deg,#F9A825,#E65100)', iconSvg:'<svg viewBox="0 0 24 24" width="24" height="24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>', rows:[['TC','TechCraft Studios','"Fast, clean edits. Way ahead of schedule."','★★★★★'],['TV','Travel Vlogger Co.','"Cinematic masterpiece. Perfect comms."','★★★★★'],['FB','Fitness Brand Pro','"Great reels, very on-brand."','★★★★☆'],['PS','Podcast Studio B','"Reliable every week. Quality is consistent."','★★★★★'],['MA','Music Artist Agency','"Captured the song energy perfectly."','★★★★★'],['EB','E-commerce Brand X','"Punchy ads, ready for paid traffic."','★★★★☆']] },
  clients:  { title:'Total Clients — 18', sub:'Active and past collaborations', color:'linear-gradient(135deg,#1976D2,#0D47A1)', iconSvg:'<svg viewBox="0 0 24 24" width="24" height="24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>', rows:[['TC','TechCraft Studios','3 projects','Active'],['GC','Gaming Channel X','Ongoing monthly','Active'],['TV','Travel Vlogger Co.','2 projects','Active'],['FB','Fitness Brand Pro','4 reel packs','Active'],['PS','Podcast Studio B','Weekly retainer','Active'],['SF','Startup Founders HQ','1 project','Past'],['FC','Food Creator Network','Batch contract','Active'],['MA','Music Artist Agency','2 MVs','Past']] },
  earnings: { title:'Total Earnings — ₹84,000', sub:'Last 90 days', color:'linear-gradient(135deg,#2E7D32,#1B5E20)', iconSvg:'<svg viewBox="0 0 24 24" width="24" height="24"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>', rows:[['₹','YouTube long-form edits','8 projects','₹38,000'],['₹','Reels & shorts','3 packs','₹18,000'],['₹','Podcast edits','Weekly retainer','₹16,000'],['₹','Thumbnails & graphics','12 sets','₹7,500'],['₹','Color grading add-ons','5 projects','₹4,500']] },
  response: { title:'Response Rate — 96%', sub:'Avg first reply within 2h 14m', color:'linear-gradient(135deg,#C2185B,#880E4F)', iconSvg:'<svg viewBox="0 0 24 24" width="24" height="24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>', rows:[['⏱','Inbox replies (last 30d)','48 / 50 answered','96%'],['⏱','Avg first-response time','—','2h 14m'],['⏱','Project status updates','Daily on average','100%'],['⏱','Missed messages','—','2'],['⏱','Read-receipts on','—','Yes']] }
};
function openStatModal(key) {
  var d = STAT_DATA[key]; if (!d) return;
  var head = document.getElementById('stat-modal-head');
  head.style.background = d.color;
  document.getElementById('stat-modal-icon').innerHTML = d.iconSvg;
  document.getElementById('stat-modal-title').textContent = d.title;
  document.getElementById('stat-modal-sub').textContent = d.sub;
  var body = document.getElementById('stat-modal-body');
  body.innerHTML = '<div class="stat-list">' + d.rows.map(function(r, i) {
    var side = r[3] || '';
    var isStars = /^★+/.test(side);
    return '<div class="stat-row" style="animation-delay:'+(i*50)+'ms;">'+
      '<div class="stat-row-thumb">'+r[0]+'</div>'+
      '<div class="stat-row-body"><div class="stat-row-title">'+r[1]+'</div><div class="stat-row-sub">'+r[2]+'</div></div>'+
      (side ? '<div class="'+(isStars?'stat-row-stars':'stat-row-side')+'">'+side+'</div>' : '')+
    '</div>';
  }).join('') + '</div>';
  document.getElementById('stat-modal-bg').classList.add('show');
}
function closeStatModal() { document.getElementById('stat-modal-bg').classList.remove('show'); }
document.querySelectorAll('.hstat[data-stat]').forEach(function(s) {
  s.addEventListener('click', function() { openStatModal(s.dataset.stat); });
});
document.getElementById('stat-modal-close').addEventListener('click', closeStatModal);
document.getElementById('stat-modal-bg').addEventListener('click', function(e) { if (e.target === this) closeStatModal(); });
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') { closeStatModal(); closeSetting(); }
});

/* ══ AUTH GUARD ══ */
const AUTH_API_BASE = 'https://creatorbridge-backend-tjrd.onrender.com';
(async function() {
  try {
    const res = await fetch(`${AUTH_API_BASE}/auth/me`, { credentials: 'include' });
    if (!res.ok) throw new Error('not authed');
    const data = await res.json();
    if (!data.user) throw new Error('no user');
  } catch(e) {
    window.location.href = 'index.html';
  }
})();

/* ══ INIT ══ */
renderClients(CLIENTS);
renderConvoList();
</script>
</body>
</html>
