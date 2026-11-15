(() => {
  "use strict";

  const desk = document.querySelector(".hd");
  if (!desk) return;
  const still = matchMedia("(prefers-reduced-motion: reduce)");
  const frozen = new URLSearchParams(location.search).has("static");
  const calm = () => still.matches || frozen;
  const $ = (s, el = desk) => el.querySelector(s);
  const $$ = (s, el = desk) => Array.from(el.querySelectorAll(s));

  const I = {
    chevD: '<path d="M4.5 6.5 8 10l3.5-3.5"/>',
    chevL: '<path d="M10 3.5 5.5 8l4.5 4.5"/>',
    chevR: '<path d="M6 3.5 10.5 8 6 12.5"/>',
    search: '<circle cx="7" cy="7" r="4.3"/><path d="m10.3 10.3 3.4 3.4"/>',
    plus: '<path d="M8 2.8v10.4M2.8 8h10.4"/>',
    gear: '<circle cx="8" cy="8" r="2.1"/><circle cx="8" cy="8" r="4.6"/><path d="M8 1.6v1.8M8 12.6v1.8M1.6 8h1.8M12.6 8h1.8M3.5 3.5l1.3 1.3M11.2 11.2l1.3 1.3M3.5 12.5l1.3-1.3M11.2 4.8l1.3-1.3"/>',
    video: '<rect x="1" y="4.2" width="9.6" height="7.6" rx="1.6" fill="currentColor" stroke="none"/><path d="m11.4 7 3.6-2.2v6.4L11.4 9z" fill="currentColor" stroke="none"/>',
    sun: '<circle cx="8" cy="8" r="2.6"/><path d="M8 1.5v1.6M8 12.9v1.6M1.5 8h1.6M12.9 8h1.6M3.4 3.4l1.1 1.1M11.5 11.5l1.1 1.1M3.4 12.6l1.1-1.1M11.5 4.5l1.1-1.1"/>',
    cloud: '<path d="M4.6 12h7a2.6 2.6 0 0 0 .3-5.2A3.8 3.8 0 0 0 4.6 6a3 3 0 0 0 0 6z"/>',
    rain: '<path d="M4.6 9.6h7a2.6 2.6 0 0 0 .3-5.2A3.8 3.8 0 0 0 4.6 3.6a3 3 0 0 0 0 6zM5.5 11.6l-.6 1.6M8.2 11.6l-.6 1.6M10.9 11.6l-.6 1.6"/>',
    list: '<circle cx="3.5" cy="4.5" r="1.7"/><circle cx="3.5" cy="11.5" r="1.7"/><path d="M7.5 4.5h6.5M7.5 11.5h6.5"/>',
    cake: '<path d="M2.5 13.5h11M3.5 13.5V9.5h9v4M5 9.5V7.5h6v2M8 7.5V5.5"/><path d="M8 2.2c.7.8.7 1.6 0 2.2-.7-.6-.7-1.4 0-2.2z" fill="currentColor"/>',
    moon: '<path d="M12.8 10.2A5.2 5.2 0 0 1 5.8 3.2a5.2 5.2 0 1 0 7 7z"/><path d="M11 2.6v2M10 3.6h2"/>',
    late: '<circle cx="7" cy="8" r="5.2"/><path d="M7 5.2V8l1.8 1.2"/><circle cx="12.4" cy="12.4" r="2.1" fill="currentColor" stroke="none"/>',
    glass: '<path d="M4 2h8M4 14h8M5 2c0 3.2 3 4 3 6s-3 2.8-3 6M11 2c0 3.2-3 4-3 6s3 2.8 3 6"/>',
    win: '<rect x="1.8" y="3" width="12.4" height="10" rx="2"/><path d="M1.8 6h12.4"/>',
    out: '<path d="M5.5 10.5 11 5M6.5 5H11v4.5"/>',
    check: '<path d="m3.5 8.4 2.9 2.9 6.1-6.6"/>',
    warn: '<path d="M8 2.5 14.2 13H1.8z"/><path d="M8 6.5v3M8 11.2v.1"/>',
    pin: '<path d="M8 14s4.5-4.2 4.5-7.5a4.5 4.5 0 0 0-9 0C3.5 9.8 8 14 8 14z"/><circle cx="8" cy="6.5" r="1.5"/>'
  };
  const ico = (k, cls = "") => `<svg class="ic ${cls}" viewBox="0 0 16 16" aria-hidden="true">${I[k]}</svg>`;

  const TODAY = 27;
  const DAYS = { 25: "Sunday", 26: "Monday", 27: "Tuesday", 28: "Wednesday", 29: "Thursday", 30: "Friday", 31: "Saturday" };
  const WX = { 25: ["sun", "Clear", 15, 9], 26: ["cloud", "Cloudy", 17, 10], 27: ["sun", "Clear", 18, 11], 28: ["cloud", "Cloudy", 16, 10], 29: ["rain", "Rain", 14, 9], 30: ["cloud", "Cloudy", 15, 8], 31: ["sun", "Clear", 17, 9] };
  const h = (hh, mm = 0) => hh * 60 + mm;
  const EV = [
    { id: "standup", d: 27, t: "Team standup", s: h(9, 30), e: h(10, 15), cal: "work", video: "Google Meet", people: [["Mira Solheim", "yes"], ["Sam Lee", "yes"], ["Leo Park", "yes"]], notes: "Blockers first, then the board." },
    { id: "design", d: 27, t: "Design review", s: h(11), e: h(12), cal: "work", loc: "Studio 2", people: [["Noor Haddad", "yes"], ["Leo Park", "yes"], ["Mira Solheim", "maybe"]], notes: "Bring the panel prototypes." },
    { id: "roadmap", d: 27, t: "Roadmap sync", s: h(11, 30), e: h(12, 15), cal: "work", video: "Google Meet", invite: "Priya Natarajan", clash: "Design review", people: [["Priya Natarajan", "yes"], ["Mira Solheim", "yes"]], notes: "Agenda:\n1. Q4 priorities\n2. Hiring plan" },
    { id: "lunch", d: 27, t: "Lunch with Ana", s: h(12, 45), e: h(13, 45), cal: "life", loc: "Café Alma" },
    { id: "mira", d: 27, t: "1:1 with Mira", s: h(14), e: h(14, 30), cal: "work", video: "Google Meet", people: [["Mira Solheim", "yes"]] },
    { id: "pickup", d: 27, t: "School pickup", s: h(15, 45), e: h(16, 15), cal: "life" },
    { id: "gym", d: 27, t: "Gym", s: h(18), e: h(19), cal: "life", solo: true },
    { id: "interviews", d: 28, t: "Customer interviews", s: h(10), e: h(11), cal: "work", video: "Google Meet", people: [["Sam Lee", "yes"], ["Leo Park", "yes"]] },
    { id: "dentist", d: 28, t: "Dentist", s: h(13, 30), e: h(14, 15), cal: "life", loc: "Rosen Dental" },
    { id: "kickoff", d: 28, t: "Launch kickoff", s: h(15), e: h(16), cal: "work", video: "Google Meet", invite: "Noor Haddad", people: [["Noor Haddad", "yes"], ["Sam Lee", "yes"], ["Priya Natarajan", "none"], ["Leo Park", "none"]] },
    { id: "mom", d: 30, t: "Mom’s birthday", allDay: true, cal: "life", solo: true }
  ];
  const byId = Object.fromEntries(EV.map((e) => [e.id, e]));
  const REM = [{ id: "invoice", t: "Send invoice", at: "4:00 PM", c: "blue", done: false }, { id: "passport", t: "Renew passport", c: "green", done: false }];
  const WORD = { accept: "Accepted", maybe: "Maybe", decline: "Declined" };

  const st = { open: true, day: TODAY, page: null, remOpen: false, sel: -1, now: h(10, 40), reply: {}, pending: {}, focus: false };

  const fmt = (m) => { const hh = Math.floor(m / 60), mm = m % 60; return `${hh % 12 || 12}:${String(mm).padStart(2, "0")} ${hh < 12 ? "AM" : "PM"}`; };
  const dur = (m) => (m >= 60 ? `${Math.floor(m / 60)}h${m % 60 ? ` ${m % 60}m` : ""}` : `${m} min`);
  const inLabel = (m) => (m >= 60 ? `in ${Math.floor(m / 60)}h ${m % 60}m` : `in ${m}m`);
  const day = (d) => EV.filter((e) => e.d === d).sort((a, b) => (a.allDay ? -1 : b.allDay ? 1 : a.s - b.s));
  const meetings = (d) => EV.filter((e) => e.d === d && !e.allDay && !e.solo).length;
  const unanswered = (e) => e.invite && !st.reply[e.id];
  const past = (e) => e.d < TODAY || (e.d === TODAY && !e.allDay && e.e <= st.now);
  const nextEv = () => EV.find((e) => e.d === TODAY && !e.allDay && e.s > st.now && !unanswered(e));
  const longDate = (d) => `${DAYS[d]}, October ${d}`;
  const shortDate = (d) => `${DAYS[d].slice(0, 3)}, Oct ${d}`;
  const when = (e) => {
    if (e.d !== TODAY) return e.d === TODAY + 1 ? "tomorrow" : shortDate(e.d);
    if (e.allDay) return "today";
    if (e.s <= st.now && e.e > st.now) return "now";
    if (e.e <= st.now) return "ended";
    return inLabel(e.s - st.now);
  };

  const panel = $(".pn");
  const item = $(".hd-item");
  const pages = $(".pn-pages", panel);
  const main = $(".pn-main", panel);
  const sub = $(".pn-sub", panel);

  function row(e, k, wide) {
    const dim = past(e) ? " dim" : "";
    const bar = "k-" + (e.invite && unanswered(e) ? "inv" : e.cal);
    const time = e.allDay ? "All day" : wide ? (e.d === TODAY ? fmt(e.s) : DAYS[e.d].slice(0, 3)) : fmt(e.s);
    return `<button type="button" class="pn-row${dim}" data-open="${e.id}" data-k="${k}"><i class="pn-bar ${bar}"></i><span class="pn-t">${time}</span><span class="pn-ti">${e.t}</span>${unanswered(e) ? '<i class="pn-dot" title="Needs reply"></i>' : ""}${e.video ? ico("video", "pn-vid") : ""}</button>`;
  }

  function nextCard(e, k) {
    return `<button type="button" class="pn-next" data-open="${e.id}" data-k="${k}"><span class="pn-next-h"><b>Next</b>${ico("chevR")}</span><span class="pn-next-t">${e.t}</span><span class="pn-next-w"><span>${fmt(e.s)} – ${fmt(e.e)}</span><em data-live="${e.id}">${when(e)}</em></span>${e.loc ? `<span class="pn-next-l">${e.loc}</span>` : ""}</button>`;
  }

  function reminders() {
    const left = REM.filter((r) => !r.done).length;
    return `<div class="pn-rem${st.remOpen ? " open" : ""}"><button type="button" class="pn-rem-h" data-act="rem" aria-expanded="${st.remOpen}">${ico("list", "pn-rem-i")}<span>${left ? `${left} reminder${left > 1 ? "s" : ""}` : "All done"}</span>${ico("chevD", "pn-rem-c")}</button><div class="pn-rem-b"><div>${REM.map(remRow).join("")}</div></div></div>`;
  }
  const remRow = (r) => `<div class="pn-r${r.done ? " done" : ""}"><button type="button" class="pn-tick ${r.c}" data-tick="${r.id}" aria-pressed="${r.done}" aria-label="Complete ${r.t}">${ico("check")}</button><span class="pn-r-t"><b>${r.t}</b>${r.at ? `<small>${r.at}</small>` : ""}</span><i class="pn-cdot ${r.c}"></i></div>`;

  function agenda() {
    let k = 0, out = "";
    const d = st.day;
    if (d === TODAY) {
      out += `<div class="pn-band today"><span>Today</span></div><div class="pn-sec">${reminders()}`;
      const nx = nextEv();
      day(d).forEach((e) => { out += e === nx ? nextCard(e, k++) : row(e, k++); });
      out += `</div>`;
      const tm = day(d + 1);
      if (tm.length) {
        out += `<div class="pn-band"><span>Tomorrow</span></div><div class="pn-sec">${tm.slice(0, 2).map((e) => row(e, k++)).join("")}`;
        if (tm.length > 2) out += `<button type="button" class="pn-more" data-day="${d + 1}" data-k="${k++}">${tm.length - 2} more tomorrow</button>`;
        out += `</div>`;
      }
    } else {
      const tag = d === TODAY + 1 ? "Tomorrow" : d === TODAY - 1 ? "Yesterday" : "";
      out += `<div class="pn-band sel"><span>${longDate(d)}</span>${tag ? `<em>${tag}</em>` : ""}</div><div class="pn-sec">`;
      const list = day(d);
      out += list.length ? list.map((e) => row(e, k++)).join("") : `<p class="pn-empty">Nothing scheduled. Free all day.</p>`;
      out += `</div>`;
      const nd = d + 1, nl = day(nd);
      if (DAYS[nd] && nl.length) out += `<div class="pn-band"><span>${longDate(nd)}</span></div><div class="pn-sec">${nl.map((e) => row(e, k++)).join("")}</div>`;
      const inv = EV.filter((e) => unanswered(e) && e.d !== d && e.d !== nd);
      if (inv.length) out += `<div class="pn-band acc"><span>Needs reply · ${inv.length}</span></div><div class="pn-sec">${inv.map((e) => row(e, k++, true)).join("")}</div>`;
    }
    return out;
  }

  function context() {
    const d = st.day, w = WX[d], n = meetings(d);
    const bits = d === TODAY ? [`${n} meetings`, `${w[2]}°C`, "Ana’s birthday"] : [shortDate(d), n ? `${n} meeting${n > 1 ? "s" : ""}` : "free all day", `${w[2]}°C`];
    return `${ico(w[0], "pn-wx")}<span>${bits.join(" · ")}</span>${ico("chevR", "pn-ctx-c")}`;
  }

  function strip() {
    return Object.keys(DAYS).map(Number).map((d) => {
      const n = day(d).filter((e) => !e.allDay).length;
      const inv = day(d).some(unanswered);
      const all = day(d).some((e) => e.allDay);
      const cls = ["pn-day", d === TODAY ? "today" : "", d === st.day && d !== TODAY ? "sel" : "", d < TODAY ? "pastd" : ""].join(" ");
      const bar = n ? `<i class="ld" style="width:${Math.min(14, 4 + n * 2)}px"></i>` : all ? '<i class="ld" style="width:4px"></i>' : "";
      return `<button type="button" class="${cls}" data-day="${d}" aria-label="${longDate(d)}" aria-pressed="${d === st.day}"><span class="wd">${DAYS[d][0]}</span><span class="dn">${d}</span><span class="lm">${bar}${inv ? '<i class="iv"></i>' : ""}</span></button>`;
    }).join("");
  }

  function paintMain(dir) {
    $(".pn-strip", panel).innerHTML = strip();
    $(".pn-ctx", panel).innerHTML = context();
    $(".pn-todaypill", panel).hidden = st.day === TODAY;
    const ag = $(".pn-agenda-in", panel);
    ag.innerHTML = agenda();
    st.sel = Math.min(st.sel, $$("[data-k]", ag).length - 1);
    mark();
    if (dir && !calm()) ag.animate([{ transform: `translateX(${dir * 26}px)`, opacity: 0 }, { transform: "none", opacity: 1 }], { duration: 420, easing: "cubic-bezier(0.23, 1, 0.32, 1)" });
    fit();
  }

  function mark() {
    $$(".pn-agenda [data-k]", panel).forEach((el) => el.classList.toggle("on", Number(el.dataset.k) === st.sel));
  }

  function people(e) {
    if (!e.people) return "";
    return `<h4>People · ${e.people.length}</h4><ul class="pn-ppl">${e.people.map(([n, s]) => `<li><i class="pd ${s}"></i>${n}${n === e.invite ? "<small>organizer</small>" : ""}</li>`).join("")}</ul>`;
  }

  function replyBlock(e) {
    if (!e.invite) return "";
    const p = st.pending[e.id], r = st.reply[e.id];
    const chosen = p ? p.kind : r;
    const btn = (k, label) => `<button type="button" class="pn-rb ${k}${chosen === k ? " on" : ""}${chosen && chosen !== k ? " off" : ""}" data-reply="${k}" aria-pressed="${chosen === k}">${label}</button>`;
    let line = `<p class="pn-rs">From ${e.invite}${e.clash ? ` · ${ico("warn")} overlaps ${e.clash}` : ""}</p>`;
    if (p) line = `<p class="pn-rs live" aria-live="polite">Sending in <b>${p.left}s</b> · <button type="button" class="pn-undo" data-act="undo">Undo</button></p>`;
    else if (r) line = `<p class="pn-rs done" aria-live="polite">${ico("check")}${WORD[r]} · sent to ${e.invite}</p>`;
    return `<div class="pn-reply">${btn("accept", "Accept")}${btn("maybe", "Maybe")}${btn("decline", "Decline")}</div>${line}`;
  }

  function eventPage(e) {
    const time = e.allDay ? `All day · ${longDate(e.d)}` : `${fmt(e.s)} – ${fmt(e.e)} · ${dur(e.e - e.s)}`;
    const lead = e.d !== TODAY ? `${longDate(e.d)}` : "";
    return `<div class="pn-pg">
      <button type="button" class="pn-back" data-act="back">${ico("chevL")}Back</button>
      <h3>${e.t}</h3>
      ${lead ? `<p class="pn-sub2">${lead}</p>` : ""}
      <p class="pn-sub2">${time}</p>
      <p class="pn-in" data-live="${e.id}">${when(e)}</p>
      ${e.loc ? `<p class="pn-loc">${ico("pin")}${e.loc}</p>` : ""}
      ${e.video ? `<button type="button" class="pn-join" data-act="join">${ico("video")}Join ${e.video}</button>` : ""}
      <div class="pn-rbox">${replyBlock(e)}</div>
      ${people(e)}
      ${e.notes ? `<h4>Notes</h4><p class="pn-notes">${e.notes.replace(/\n/g, "<br>")}</p>` : ""}
      ${e.allDay ? "" : `<button type="button" class="pn-link" data-act="late">${ico("late")}<span>Running late</span></button>`}
      ${e.allDay ? "" : `<button type="button" class="pn-pill" data-act="count">${ico("glass")}<span>Count down to this</span></button>`}
      <button type="button" class="pn-pill quiet" data-act="openapp">${ico("win")}<span>Open in Cadence</span>${ico("out")}</button>
    </div>`;
  }

  function dayPage(d) {
    const w = WX[d], list = day(d).filter((e) => !e.allDay), n = meetings(d);
    const nx = d === TODAY ? nextEv() : list[0];
    const lastEnd = list.length ? Math.max(...list.filter((e) => e.e <= h(17)).map((e) => e.e), h(9)) : 0;
    const free = d === TODAY ? "free 1h 30m from 4:30 PM" : list.length ? `free from ${fmt(lastEnd)}` : "free all day";
    const bday = d === TODAY ? "Birthday: Ana" : day(d).find((e) => e.allDay)?.t;
    const rem = d === TODAY ? REM : [];
    return `<div class="pn-pg">
      <button type="button" class="pn-back" data-act="back">${ico("chevL")}Back</button>
      <h3>${longDate(d)}</h3>
      <p class="pn-sub2">${n} meeting${n === 1 ? "" : "s"}${nx ? ` · ${d === TODAY ? "next" : "first"} ${fmt(nx.s)}` : ""}</p>
      <p class="pn-sub2">${free}</p>
      <p class="pn-fact mono">${ico(w[0])}${w[1]} · ${w[2]}°C / ${w[3]}°C <span class="pn-aw">Weather</span></p>
      ${bday ? `<p class="pn-fact">${ico("cake", "acc")}${bday}</p>` : ""}
      <button type="button" class="pn-pill${st.focus ? " on" : ""}" data-act="focus" aria-pressed="${st.focus}">${ico(st.focus ? "check" : "moon")}<span>${st.focus ? "Focus blocked 4:30 – 6:00 PM" : "Block as focus"}</span></button>
      ${rem.length ? `<h4>${rem.filter((r) => !r.done).length} reminders</h4><div class="pn-rems">${rem.map(remRow).join("")}</div>` : ""}
    </div>`;
  }

  function natural(page) {
    if (page === main) return $(".pn-top", panel).offsetHeight + Math.min($(".pn-agenda-in", panel).offsetHeight, 420);
    return $(".pn-pg", sub) ? $(".pn-pg", sub).offsetHeight : 200;
  }

  function fit() {
    const maxH = desk.clientHeight - panel.getBoundingClientRect().top + desk.getBoundingClientRect().top - 14;
    const zoom = panel.offsetWidth ? panel.getBoundingClientRect().width / panel.offsetWidth : 1;
    panel.style.height = `${Math.min(natural(st.page ? sub : main), maxH / zoom)}px`;
  }

  function openPage(kind, id) {
    st.page = { kind, id };
    sub.innerHTML = kind === "event" ? eventPage(byId[id]) : dayPage(id);
    sub.scrollTop = 0;
    panel.classList.add("pushed");
    fit();
    setTimeout(() => { const b = $(".pn-back", sub); if (b && panel.contains(document.activeElement)) b.focus({ preventScroll: true }); }, 30);
  }

  function back() {
    if (!st.page) return false;
    st.page = null;
    panel.classList.remove("pushed");
    paintMain(0);
    panel.focus({ preventScroll: true });
    return true;
  }

  function setDay(d) {
    if (!DAYS[d] || d === st.day) return;
    const dir = Math.sign(d - st.day);
    st.day = d;
    st.sel = -1;
    paintMain(dir);
  }

  function refreshSub() {
    if (!st.page) return;
    const top = sub.scrollTop;
    sub.innerHTML = st.page.kind === "event" ? eventPage(byId[st.page.id]) : dayPage(st.page.id);
    sub.scrollTop = top;
    fit();
  }

  const timers = {};
  function reply(id, kind) {
    clearInterval(timers[id]);
    if (st.reply[id] === kind && !st.pending[id]) return;
    st.pending[id] = { kind, left: 8, prev: st.reply[id] };
    timers[id] = setInterval(() => {
      const p = st.pending[id];
      p.left -= 1;
      if (p.left <= 0) {
        clearInterval(timers[id]);
        st.reply[id] = p.kind;
        delete st.pending[id];
      }
      refreshSub();
    }, 1000);
    refreshSub();
  }
  function undo(id) {
    clearInterval(timers[id]);
    const p = st.pending[id];
    if (p) { if (p.prev) st.reply[id] = p.prev; else delete st.reply[id]; }
    delete st.pending[id];
    refreshSub();
  }

  function flash(el, text) {
    const s = el.querySelector("span");
    if (!s || el.dataset.busy) return;
    const was = s.textContent;
    el.dataset.busy = "1";
    s.textContent = text;
    el.classList.add("on");
    setTimeout(() => { s.textContent = was; el.classList.remove("on"); delete el.dataset.busy; }, 1600);
  }

  function setOpen(on) {
    st.open = on;
    const ir = item.getBoundingClientRect(), pr = panel.getBoundingClientRect();
    if (pr.width) panel.style.transformOrigin = `${Math.round(((ir.left + ir.width / 2 - pr.left) / pr.width) * 100)}% -8px`;
    panel.classList.toggle("shut", !on);
    item.setAttribute("aria-expanded", String(on));
    item.classList.toggle("on", on);
    if (on) fit();
  }

  item.addEventListener("click", () => setOpen(!st.open));

  panel.addEventListener("click", (ev) => {
    const t = ev.target.closest("button");
    if (!t || !panel.contains(t)) return;
    panel.focus({ preventScroll: true });
    if (t.dataset.day) { const d = Number(t.dataset.day); if (d === st.day && d !== TODAY) setDay(TODAY); else setDay(d); return; }
    if (t.dataset.open) { st.sel = Number(t.dataset.k); openPage("event", t.dataset.open); return; }
    if (t.dataset.tick) {
      const r = REM.find((x) => x.id === t.dataset.tick);
      r.done = !r.done;
      if (st.page) refreshSub(); else { const row = t.closest(".pn-r"); row.classList.toggle("done", r.done); t.setAttribute("aria-pressed", r.done); const n = REM.filter((x) => !x.done).length; $(".pn-rem-h span", panel).textContent = n ? `${n} reminder${n > 1 ? "s" : ""}` : "All done"; }
      return;
    }
    if (t.dataset.reply) { reply(st.page.id, t.dataset.reply); return; }
    switch (t.dataset.act) {
      case "rem": st.remOpen = !st.remOpen; $(".pn-rem", panel).classList.toggle("open", st.remOpen); t.setAttribute("aria-expanded", st.remOpen); setTimeout(fit, 0); if (!calm()) { const end = performance.now() + 500; const loop = () => { fit(); if (performance.now() < end) requestAnimationFrame(loop); }; loop(); } break;
      case "ctx": openPage("day", st.day); break;
      case "today": setDay(TODAY); break;
      case "prev": setDay(st.day - 1); break;
      case "next": setDay(st.day + 1); break;
      case "back": back(); break;
      case "undo": undo(st.page.id); break;
      case "focus": st.focus = !st.focus; refreshSub(); break;
      case "join": flash(t, "Opening Google Meet…"); break;
      case "late": flash(t, "Told them: 5 min late"); break;
      case "count": flash(t, "Counting down in the menu bar"); break;
      case "openapp": flash(t, "Opens in the Cadence window"); break;
    }
  });

  panel.addEventListener("keydown", (ev) => {
    if (ev.key === "Escape") {
      ev.preventDefault();
      if (!back() && st.day !== TODAY) setDay(TODAY);
      return;
    }
    if (st.page) return;
    const items = $$(".pn-agenda [data-k]", panel);
    if (ev.key === "ArrowDown" || ev.key === "ArrowUp") {
      ev.preventDefault();
      st.sel = Math.max(0, Math.min(items.length - 1, st.sel + (ev.key === "ArrowDown" ? 1 : -1)));
      mark();
      const el = items[st.sel];
      if (el) el.scrollIntoView({ block: "nearest" });
    } else if (ev.key === "Enter" && st.sel >= 0 && document.activeElement === panel) {
      ev.preventDefault();
      items[st.sel]?.click();
    } else if (ev.key === "ArrowLeft" || ev.key === "ArrowRight") {
      ev.preventDefault();
      setDay(st.day + (ev.key === "ArrowRight" ? 1 : -1));
    }
  });

  let sx = null, wx = 0, wt = 0;
  sub.addEventListener("pointerdown", (ev) => { if (ev.pointerType !== "mouse" || ev.button === 0) sx = ev.clientX; });
  sub.addEventListener("pointermove", (ev) => {
    if (sx === null) return;
    const dx = ev.clientX - sx;
    if (dx > 6 && !calm()) sub.style.transform = `translateX(${Math.min(dx, 120)}px)`;
  });
  const endSwipe = (ev) => {
    if (sx === null) return;
    const dx = ev.clientX - sx;
    sx = null;
    sub.style.transform = "";
    if (dx > 60) back();
  };
  sub.addEventListener("pointerup", endSwipe);
  sub.addEventListener("pointercancel", () => { sx = null; sub.style.transform = ""; });
  sub.addEventListener("wheel", (ev) => {
    if (Math.abs(ev.deltaX) < Math.abs(ev.deltaY)) return;
    clearTimeout(wt);
    wx += ev.deltaX;
    if (wx < -60) { wx = 0; back(); }
    wt = setTimeout(() => (wx = 0), 200);
  }, { passive: true });

  const roll = (el, text) => {
    if (!el) return;
    const old = el.lastElementChild;
    if (old && old.textContent === text) return;
    if (calm()) { el.innerHTML = `<span>${text}</span>`; return; }
    const next = document.createElement("span");
    next.textContent = text;
    next.className = "in";
    el.appendChild(next);
    if (old) { old.className = "out"; setTimeout(() => old.remove(), 360); }
  };
  let step = 0, timer = 0;
  const tick = () => {
    step = (step + 1) % 4;
    st.now = h(10, 40 + step);
    roll($('[data-roll="min"]'), String(step));
    roll($('[data-roll="left"]'), String(20 - step));
    $$("[data-live]", panel).forEach((el) => (el.textContent = when(byId[el.dataset.live])));
  };
  const start = () => { if (!timer && !calm() && !document.hidden) timer = setInterval(tick, 3200); };
  const stop = () => { clearInterval(timer); timer = 0; };
  document.addEventListener("visibilitychange", () => (document.hidden ? stop() : start()));
  still.addEventListener("change", () => { panel.classList.toggle("calm", calm()); calm() ? stop() : start(); });

  panel.classList.toggle("calm", calm());
  $(".pn-ctx", panel).dataset.act = "ctx";
  paintMain(0);

  function fromHash() {
    const p = new URLSearchParams(location.hash.slice(1));
    if (p.has("closed")) { setOpen(false); return; }
    const dmap = { sun: 25, mon: 26, tue: 27, wed: 28, thu: 29, fri: 30, sat: 31 };
    if (p.get("day")) setDay(dmap[p.get("day")] || Number(p.get("day")) || TODAY);
    if (p.has("reminders")) { st.remOpen = true; paintMain(0); }
    if (p.has("dayview")) openPage("day", st.day);
    const r = p.get("reply");
    const ev = p.get("event") || (r ? "roadmap" : null);
    if (ev && byId[ev]) {
      if (r) {
        const kind = { accepted: "accept", accept: "accept", maybe: "maybe", declined: "decline", decline: "decline" }[r] || (r === "sending" ? "accept" : null);
        if (r === "sending") st.pending[ev] = { kind, left: 6 }; else if (kind) st.reply[ev] = kind;
      }
      openPage("event", ev);
    }
  }
  if (location.hash) {
    panel.classList.add("calm");
    fromHash();
    requestAnimationFrame(() => requestAnimationFrame(() => panel.classList.toggle("calm", calm())));
  }
  window.addEventListener("hashchange", () => { back(); fromHash(); });
  window.addEventListener("resize", fit);
  if (document.fonts) document.fonts.ready.then(fit);
  start();
})();
