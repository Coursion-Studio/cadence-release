(() => {
  "use strict";

  const S = window.Stage || {};
  const still = matchMedia("(prefers-reduced-motion: reduce)");
  const frozen = new URLSearchParams(location.search).has("static");
  const calm = () => still.matches || frozen;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const typing = (el) => el && (/^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName) || el.isContentEditable);
  const watch = S.watch || ((el, enter) => enter());
  const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  $$(".btn.store[aria-disabled]").forEach((a) => a.addEventListener("click", (e) => e.preventDefault()));

  $$('[data-stage="inbox"]').forEach((section) => {
    const box = $(".ibx", section);
    const list = $(".ibx-list", box);
    const count = $(".ibx-count", box);
    const INVITES = [
      { title: "Design review", when: "Today 14:00–15:00", who: "Maya Chen", n: 6, via: "Google", clash: true },
      { title: "Q4 planning", when: "Fri 09:00–12:00", who: "Jonas Weber", n: 12, via: "Microsoft" },
      { title: "Dinner with the Okafors", when: "Sat 19:30–22:00", who: "Ada Okafor", n: 4, via: "iCloud" }
    ];
    const WORD = { accept: "Accepted", maybe: "Maybe", decline: "Declined" };
    let inView = false, rows = [];

    function build() {
      list.innerHTML = "";
      rows = INVITES.map((inv, i) => {
        const li = document.createElement("li");
        li.className = "ibx-row";
        li.setAttribute("role", "option");
        li.setAttribute("aria-selected", String(i === 0));
        li.tabIndex = i === 0 ? 0 : -1;
        li.innerHTML =
          `<div class="ibx-in"><span class="ibx-dot" aria-hidden="true"></span>` +
          `<div class="ibx-tx"><span class="ibx-t"><span>${esc(inv.title)}</span>${inv.clash ? '<em class="ibx-clash">double-booked</em>' : ""}</span>` +
          `<span class="ibx-m">${esc(inv.when)} · ${esc(inv.who)} · ${inv.n} invited</span></div>` +
          `<div class="ibx-act"><div class="ibx-btns">` +
          `<button type="button" class="ibx-btn accept" data-r="accept">Accept<kbd>A</kbd></button>` +
          `<button type="button" class="ibx-btn" data-r="maybe">Maybe<kbd>M</kbd></button>` +
          `<button type="button" class="ibx-btn" data-r="decline">Decline<kbd>D</kbd></button></div>` +
          `<div class="ibx-state"><span class="ibx-chip"><span class="ibx-word"></span><span class="sub"></span></span><button type="button" class="ibx-undo">Undo</button></div></div></div>`;
        const row = { li, inv, state: null, timers: [] };
        li.addEventListener("click", (e) => {
          const b = e.target.closest("[data-r]");
          select(row, !b);
          if (b) reply(row, b.dataset.r);
          if (e.target.closest(".ibx-undo")) undo(row);
        });
        list.appendChild(li);
        return row;
      });
      box.classList.remove("empty");
      tally();
    }

    const open = () => rows.filter((r) => !r.state);
    const visible = () => rows.filter((r) => !r.li.classList.contains("gone"));

    function tally() {
      const n = open().length;
      if (count.textContent !== String(n)) {
        count.textContent = String(n);
        if (!calm()) { count.classList.add("bump"); setTimeout(() => count.classList.remove("bump"), 220); }
      }
    }

    function select(row, focus) {
      rows.forEach((r) => {
        const on = r === row;
        r.li.setAttribute("aria-selected", String(on));
        r.li.tabIndex = on ? 0 : -1;
      });
      if (focus && row) row.li.focus({ preventScroll: true });
    }

    function selected() { return rows.find((r) => r.li.getAttribute("aria-selected") === "true"); }

    function label(row, sub) {
      $(".ibx-chip .ibx-word", row.li).textContent = WORD[row.state];
      $(".ibx-chip .sub", row.li).textContent = sub;
    }

    function reply(row, kind) {
      if (!row || row.state) return;
      row.state = kind;
      row.li.dataset.state = kind;
      label(row, `· sent through ${row.inv.via}`);
      tally();
      if (calm()) {
        label(row, "· confirmed");
        if (!frozen) row.timers.push(setTimeout(() => retire(row), 2600));
        return;
      }
      row.timers.push(setTimeout(() => label(row, "· confirmed"), 1100));
      row.timers.push(setTimeout(() => retire(row), 2600));
    }

    function undo(row) {
      if (!row.state) return;
      row.timers.forEach(clearTimeout);
      row.timers = [];
      row.state = null;
      delete row.li.dataset.state;
      select(row, true);
      tally();
    }

    function retire(row) {
      row.li.classList.add("gone");
      const next = visible().find((r) => !r.state);
      if (selected() === row) select(next, document.activeElement === row.li);
      if (!visible().length) setTimeout(() => box.classList.add("empty"), calm() ? 0 : 280);
    }

    $(".ibx-reset", box).addEventListener("click", () => { build(); select(rows[0], true); });

    watch(section, () => { inView = true; }, () => { inView = false; }, 0.3);

    document.addEventListener("keydown", (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey || typing(e.target)) return;
      const inside = box.contains(document.activeElement);
      if (!inView && !inside) return;
      const k = e.key.toLowerCase();
      const map = { a: "accept", m: "maybe", d: "decline" };
      if (map[k]) {
        const row = selected();
        if (row && !row.state) { e.preventDefault(); reply(row, map[k]); }
        return;
      }
      if (!inside || (e.key !== "ArrowDown" && e.key !== "ArrowUp")) return;
      const vis = visible();
      const at = vis.indexOf(selected());
      const to = vis[Math.max(0, Math.min(vis.length - 1, at + (e.key === "ArrowDown" ? 1 : -1)))];
      if (to) { e.preventDefault(); select(to, true); }
    });

    build();
    if (frozen) reply(rows[0], "accept");
  });

  $$('[data-stage="menubar"]').forEach((section) => {
    const item = $(".mb-item", section);
    const title = $(".mb-title", section);
    const panel = $(".mb-panel", section);
    const when = $(".mb-when", section);
    const join = $(".mb-join", section);
    const toast = $(".mb-toast", section);
    let m = 2, inView = false, loop = 0, lastHot = 0, toastTimer = 0;

    function paint() {
      const now = m <= 0;
      item.classList.toggle("now", now);
      title.textContent = now ? "Standup · now" : `Standup in ${m}m`;
      when.textContent = now ? "Now · 15m left · 09:30–09:45" : `In ${m} minute${m === 1 ? "" : "s"} · 09:30–09:45`;
    }

    function setOpen(on) {
      panel.classList.toggle("open", on);
      item.setAttribute("aria-expanded", String(on));
    }

    function say(text) {
      toast.textContent = text;
      toast.classList.add("on");
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => toast.classList.remove("on"), 1800);
    }

    function doJoin() {
      join.classList.add("flash");
      setTimeout(() => join.classList.remove("flash"), 450);
      say("Opening Google Meet…");
    }

    function tick() {
      clearTimeout(loop);
      if (!inView || calm() || document.hidden) return;
      if (m <= 0) { loop = setTimeout(() => { m = 3; paint(); tick(); }, 5200); return; }
      loop = setTimeout(() => { m -= 1; paint(); tick(); }, 1700);
    }

    item.addEventListener("click", (e) => {
      if (e.altKey) { setOpen(true); say("⌥-click lists today as a plain menu"); return; }
      setOpen(!panel.classList.contains("open"));
    });
    item.addEventListener("dblclick", doJoin);
    join.addEventListener("click", doJoin);

    document.addEventListener("keydown", (e) => {
      if (!inView || typing(e.target)) return;
      if (e.ctrlKey && e.altKey && e.code === "KeyF") {
        e.preventDefault();
        const t = performance.now();
        if (t - lastHot < 450) { lastHot = 0; setOpen(true); doJoin(); return; }
        lastHot = t;
        setOpen(!panel.classList.contains("open"));
      } else if (e.key === "Enter" && section.contains(document.activeElement) && panel.classList.contains("open") && document.activeElement !== item) {
        doJoin();
      }
    });

    watch(section, () => { if (!inView) { inView = true; tick(); } }, () => { inView = false; clearTimeout(loop); }, 0.35);
    document.addEventListener("visibilitychange", tick);
    paint();
  });

  $$('[data-stage="conflicts"]').forEach((section) => {
    const cf = $(".cf", section);
    const status = $(".cf-status", section);
    const first = status.textContent;
    const cards = $$(".cf-card", cf);

    function reset() {
      cf.classList.remove("resolved");
      cards.forEach((c) => { c.classList.remove("declined"); const b = $(".cf-decline", c); b.disabled = false; b.textContent = "Decline"; });
      $$(".cf-bar", cf).forEach((b) => b.classList.remove("gone"));
      status.textContent = first;
    }

    cards.forEach((card) => {
      $(".cf-decline", card).addEventListener("click", () => {
        if (cf.classList.contains("resolved")) return;
        card.classList.add("declined");
        $(".cf-bar." + card.dataset.side, cf).classList.add("gone");
        cf.classList.add("resolved");
        cards.forEach((c) => { $(".cf-decline", c).disabled = true; });
        $(".cf-decline", card).textContent = "Declined";
        status.textContent = `Declined “${$("b", card).textContent}”. The clash is gone.`;
        const again = document.createElement("button");
        again.type = "button";
        again.className = "cf-reset";
        again.textContent = "Show it again";
        again.addEventListener("click", reset);
        status.appendChild(again);
      });
    });
  });

  $$('[data-stage="zones"]').forEach((section) => {
    const zr = $(".zr", section);
    const body = $(".zr-body", zr);
    const START = 8, END = 18;
    const OFFS = [0, -5, 4.5];
    const EVENTS = [
      { from: 9.5, to: 9.75, title: "Standup", note: "Google Meet", c: "#5AAEFF" },
      { from: 11, to: 11.5, title: "Sync with Bengaluru", note: "Teams · 15:30–16:00 there", c: "#3FD485" },
      { from: 14, to: 15, title: "Design review", note: "Zoom · needs reply", pend: true },
      { from: 15.5, to: 16.5, title: "Call with New York", note: "Zoom · 10:30–11:30 there", c: "#C79BFF" }
    ];
    const fmt = (h) => {
      const t = ((h % 24) + 24) % 24;
      const hh = Math.floor(t + 1e-6), mm = Math.round((t - hh) * 60);
      return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
    };
    let v = 15, row = 34;

    for (let h = START; h <= END; h++) {
      const r = document.createElement("div");
      r.className = "zr-row";
      if (h === END) r.style.height = "0";
      r.innerHTML = OFFS.map((o) => `<span>${fmt(h + o)}</span>`).join("");
      body.appendChild(r);
    }
    const evs = EVENTS.map((e) => {
      const el = document.createElement("div");
      el.className = "zr-ev" + (e.pend ? " pend" : "");
      if (e.c) el.style.setProperty("--c", e.c);
      el.innerHTML = `${esc(e.title)}<small>${esc(fmt(e.from))}–${esc(fmt(e.to))} · ${esc(e.note)}</small>`;
      body.appendChild(el);
      return { el, e };
    });
    const scrub = document.createElement("div");
    scrub.className = "zr-scrub";
    scrub.setAttribute("aria-hidden", "true");
    scrub.innerHTML = "<b></b><b></b><b></b>";
    body.appendChild(scrub);
    const tags = $$("b", scrub);

    function layout() {
      row = parseFloat(getComputedStyle(zr).getPropertyValue("--row")) || 34;
      const top = $(".zr-row", body).offsetTop;
      evs.forEach(({ el, e }) => {
        el.style.top = `${top + (e.from - START) * row + 1}px`;
        el.style.height = `${Math.max(row * 0.5, (e.to - e.from) * row) - 2}px`;
      });
      paint();
    }

    function paint() {
      const top = $(".zr-row", body).offsetTop;
      scrub.style.transform = `translateY(${top + (v - START) * row}px)`;
      tags.forEach((t, i) => { t.textContent = fmt(v + OFFS[i]); });
      zr.setAttribute("aria-valuenow", String(v));
      zr.setAttribute("aria-valuetext", `${fmt(v)} London, ${fmt(v - 5)} New York, ${fmt(v + 4.5)} Bengaluru`);
    }

    function fromY(y) {
      const top = body.getBoundingClientRect().top + $(".zr-row", body).offsetTop;
      const h = START + (y - top) / row;
      v = Math.max(START, Math.min(END, Math.round(h * 4) / 4));
      paint();
    }

    zr.addEventListener("pointermove", (e) => { if (e.pointerType === "mouse" || zr.classList.contains("zr-dragging")) fromY(e.clientY); });
    zr.addEventListener("pointerdown", (e) => { zr.classList.add("zr-dragging"); fromY(e.clientY); });
    ["pointerup", "pointercancel", "pointerleave"].forEach((t) => zr.addEventListener(t, () => zr.classList.remove("zr-dragging")));
    zr.addEventListener("keydown", (e) => {
      const step = { ArrowUp: -0.25, ArrowDown: 0.25, PageUp: -1, PageDown: 1 }[e.key];
      if (step === undefined && e.key !== "Home" && e.key !== "End") return;
      e.preventDefault();
      v = e.key === "Home" ? START : e.key === "End" ? END : Math.max(START, Math.min(END, v + step));
      paint();
    });
    addEventListener("resize", layout);
    layout();
  });

  $$(".brew[data-cmd]").forEach((btn) => {
    const state = $(".brew-state", btn);
    let t = 0;
    btn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(btn.dataset.cmd);
        state.textContent = "Copied";
        btn.classList.add("done");
      } catch (_) {
        const r = document.createRange();
        r.selectNodeContents($("code", btn));
        const sel = getSelection();
        sel.removeAllRanges();
        sel.addRange(r);
        state.textContent = "Press ⌘C";
      }
      clearTimeout(t);
      t = setTimeout(() => { state.textContent = "Copy"; btn.classList.remove("done"); }, 1800);
    });
  });

  $$(".hd").forEach((desk) => {
    const left = $('[data-roll="left"]', desk);
    const min = $('[data-roll="min"]', desk);
    if (!left || !min) return;
    const roll = (el, text) => {
      const old = el.lastElementChild;
      if (old && old.textContent === text) return;
      const next = document.createElement("span");
      next.textContent = text;
      next.className = "in";
      el.appendChild(next);
      if (old) { old.className = "out"; setTimeout(() => old.remove(), 360); }
    };
    let step = 0, timer = 0;
    const tick = () => {
      step = (step + 1) % 4;
      roll(min, String(step));
      roll(left, String(20 - step));
    };
    const start = () => { if (!timer && !calm() && !document.hidden) timer = setInterval(tick, 3200); };
    const stop = () => { clearInterval(timer); timer = 0; };
    document.addEventListener("visibilitychange", () => (document.hidden ? stop() : start()));
    still.addEventListener("change", () => (calm() ? stop() : start()));
    start();
  });

  $$(".copy[data-copy]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const pre = document.getElementById(btn.dataset.copy);
      const lines = pre.textContent.split("\n");
      const keep = [];
      let cont = false;
      lines.forEach((l) => {
        if (l.startsWith("$ ")) { keep.push(l.slice(2)); cont = l.trimEnd().endsWith("\\"); }
        else if (cont) { keep.push(l); cont = l.trimEnd().endsWith("\\"); }
      });
      try {
        await navigator.clipboard.writeText(keep.join("\n"));
        btn.textContent = "Copied";
        btn.classList.add("done");
      } catch (_) {
        btn.textContent = "Select and copy";
      }
      setTimeout(() => { btn.textContent = "Copy"; btn.classList.remove("done"); }, 1600);
    });
  });

  $$(".wg").forEach((wg) => {
    const clock = $(".isl-c", wg);
    if (!clock) return;
    let s = 12 * 60 + 48, timer = 0;
    const run = () => {
      clearInterval(timer);
      if (calm()) return;
      timer = setInterval(() => {
        s = s > 0 ? s - 1 : 15 * 60;
        clock.textContent = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
      }, 1000);
    };
    watch(wg, run, () => clearInterval(timer), 0.2);
  });
})();
