const state = {
  line: "all",
  query: "",
  timeline: "cse",
  openId: null,
  weight: "",
};

const els = {
  meta: document.getElementById("aed-meta"),
  footer: document.getElementById("aed-footer"),
  tabs: document.getElementById("timeline-tabs"),
  timeline: document.getElementById("timeline"),
  search: document.getElementById("search"),
  filters: document.getElementById("filters"),
  list: document.getElementById("drug-list"),
  weight: document.getElementById("weight"),
  weightHint: document.getElementById("weight-hint"),
};

function lineTag(line) {
  if (line === "1st") return '<span class="tag tag--1st">1st line</span>';
  if (line === "2nd") return '<span class="tag tag--2nd">2nd line</span>';
  if (line === "3rd") return '<span class="tag tag--3rd">3rd 麻醉</span>';
  if (line === "immune") return '<span class="tag tag--immune">免疫／NORSE</span>';
  return "";
}

function fmtNum(n, round = 1) {
  if (!Number.isFinite(n)) return "—";
  const factor = 10 ** round;
  const v = Math.round(n * factor) / factor;
  return Number.isInteger(v) ? String(v) : String(v);
}

function applyMax(value, max) {
  if (max == null || !Number.isFinite(max)) return { value, capped: false };
  if (value > max) return { value: max, capped: true };
  return { value, capped: false };
}

function calcItem(item, kg) {
  if (!item) return null;
  const round = item.round ?? 1;

  if (item.kind === "none") {
    return { text: item.text || "—", detail: item.note || "" };
  }

  if (item.kind === "fixed") {
    return {
      text: `${fmtNum(item.fixed, round)} ${item.unit}`,
      detail: item.note || "固定劑量",
    };
  }

  if (item.kind === "fixedRange") {
    return {
      text: `${fmtNum(item.fixedMin, round)}–${fmtNum(item.fixedMax, round)} ${item.unit}`,
      detail: item.note || "固定劑量範圍",
    };
  }

  if (!Number.isFinite(kg) || kg <= 0) {
    return { text: "輸入體重後計算", detail: item.note || "" };
  }

  if (item.kind === "perKg") {
    let raw = item.perKg * kg;
    const capped = applyMax(raw, item.max);
    const suffix = capped.capped ? `（已達上限 ${item.max} ${item.unit}）` : "";
    return {
      text: `${fmtNum(capped.value, round)} ${item.unit}`,
      detail: `${item.perKg} × ${fmtNum(kg, 1)} kg${suffix}${item.note ? ` · ${item.note}` : ""}`,
    };
  }

  if (item.kind === "perKgRange") {
    const minRaw = item.perKgMin * kg;
    const maxRaw = item.perKgMax * kg;
    const minC = applyMax(minRaw, item.max);
    const maxC = applyMax(maxRaw, item.max);
    const suffix = minC.capped || maxC.capped ? `（含上限 ${item.max}）` : "";
    return {
      text: `${fmtNum(minC.value, round)}–${fmtNum(maxC.value, round)} ${item.unit}`,
      detail: `${item.perKgMin}–${item.perKgMax} × ${fmtNum(kg, 1)} kg${suffix}${
        item.note ? ` · ${item.note}` : ""
      }`,
    };
  }

  if (item.kind === "tier") {
    const tier = (item.tiers || []).find((t) => kg <= t.maxKg);
    if (!tier) return { text: "—", detail: "" };
    if (tier.fixed != null) {
      return {
        text: `${fmtNum(tier.fixed, round)} ${tier.unit || item.unit || "mg"}`,
        detail: tier.note || `體重分層 ≤${tier.maxKg === Infinity ? "∞" : tier.maxKg} kg`,
      };
    }
    if (tier.perKg != null) {
      const capped = applyMax(tier.perKg * kg, tier.max);
      const suffix = capped.capped ? `（已達上限 ${tier.max}）` : "";
      return {
        text: `${fmtNum(capped.value, tier.round ?? round)} ${tier.unit || "mg"}`,
        detail: `${tier.perKg} × ${fmtNum(kg, 1)} kg${suffix}${tier.note ? ` · ${tier.note}` : ""}`,
      };
    }
  }

  return { text: "—", detail: "" };
}

function calcBlock(title, items, kg) {
  if (!items || !items.length) return "";
  const rows = items
    .map((item) => {
      const r = calcItem(item, kg);
      if (!r) return "";
      return `
        <div class="calc-row">
          <div class="calc-row__label">${item.label || title}</div>
          <div class="calc-row__value">${r.text}</div>
          <div class="calc-row__detail">${r.detail || ""}</div>
        </div>`;
    })
    .join("");
  return `
    <div class="calc-block">
      <div class="calc-block__title">${title}</div>
      ${rows}
    </div>`;
}

function weightKg() {
  const n = Number(state.weight);
  return Number.isFinite(n) && n > 0 ? n : null;
}

function renderMeta() {
  const meta = window.AED_META || {};
  els.meta.innerHTML = `來源：<a href="${meta.doi || "#"}" target="_blank" rel="noopener">${
    meta.source || "文獻"
  }</a>`;
  els.footer.textContent = meta.note || "僅供臨床參考。";
}

function renderWeightHint() {
  const kg = weightKg();
  if (!els.weightHint) return;
  els.weightHint.textContent = kg
    ? `已用 ${fmtNum(kg, 1)} kg 計算下方劑量`
    : "輸入體重後，依 mg/kg 自動換算 loading／infusion";
}

function renderTimelineTabs() {
  const timelines = window.AED_TIMELINES || [];
  els.tabs.innerHTML = timelines
    .map(
      (t) =>
        `<button type="button" class="chip ${state.timeline === t.id ? "is-on" : ""}" data-timeline="${t.id}">${t.name} · ${t.nameZh}</button>`
    )
    .join("");
}

function renderTimeline() {
  const t = (window.AED_TIMELINES || []).find((x) => x.id === state.timeline);
  if (!t) {
    els.timeline.innerHTML = "";
    return;
  }
  els.timeline.innerHTML = t.steps
    .map(
      (s) => `
      <li>
        <div class="timeline__t">${s.t}</div>
        <div>
          <div class="timeline__title">${s.title}</div>
          <p class="timeline__detail">${s.detail}</p>
        </div>
      </li>`
    )
    .join("");
}

function renderFilters() {
  els.filters.innerHTML = (window.AED_LINES || [])
    .map(
      (l) =>
        `<button type="button" class="chip ${state.line === l.id ? "is-on" : ""}" data-line="${l.id}">${l.label}</button>`
    )
    .join("");
}

function filteredDrugs() {
  const q = state.query.trim().toLowerCase();
  return (window.AED_DRUGS || []).filter((d) => {
    if (state.line !== "all" && d.line !== state.line) return false;
    if (!q) return true;
    const blob = `${d.name} ${d.nameZh} ${d.mechanism} ${d.sideEffects} ${d.notes}`.toLowerCase();
    return blob.includes(q);
  });
}

function renderDrugs() {
  const kg = weightKg();
  const drugs = filteredDrugs();
  els.list.innerHTML = drugs
    .map((d) => {
      const open = state.openId === d.id;
      const dose = d.dose || {};
      return `
      <li class="drug ${open ? "is-open" : ""}" data-id="${d.id}">
        <button type="button" class="drug__head" data-toggle="${d.id}" aria-expanded="${open}">
          <span class="drug__name">${d.name}</span>
          <span class="drug__zh">${d.nameZh}</span>
          <span class="drug__tags">
            ${lineTag(d.line)}
            <span class="tag">${d.route}</span>
          </span>
        </button>
        <div class="drug__body">
          <div class="dose-panel">
            ${calcBlock("依體重計算 · Loading", dose.loading, kg)}
            ${calcBlock("依體重計算 · Maintenance", dose.maintenance, kg)}
          </div>
          <div class="row"><span class="row__k">原文 Loading</span><span class="row__v">${d.loading}</span></div>
          <div class="row"><span class="row__k">原文 Maintenance</span><span class="row__v">${d.maintenance}</span></div>
          <div class="row"><span class="row__k">機制</span><span class="row__v">${d.mechanism}</span></div>
          <div class="row"><span class="row__k">起效／半衰期</span><span class="row__v">${d.onset} ／ ${d.halfLife}</span></div>
          <div class="row row--side"><span class="row__k">副作用／注意</span><span class="row__v">${d.sideEffects}</span></div>
          <div class="row"><span class="row__k">臨床備註</span><span class="row__v">${d.notes}</span></div>
        </div>
      </li>`;
    })
    .join("");
}

function boot() {
  const saved = localStorage.getItem("aed-weight-kg");
  if (saved && els.weight) {
    els.weight.value = saved;
    state.weight = saved;
  }

  renderMeta();
  renderWeightHint();
  renderTimelineTabs();
  renderTimeline();
  renderFilters();
  renderDrugs();

  els.tabs.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-timeline]");
    if (!btn) return;
    state.timeline = btn.dataset.timeline;
    renderTimelineTabs();
    renderTimeline();
  });

  els.filters.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-line]");
    if (!btn) return;
    state.line = btn.dataset.line;
    renderFilters();
    renderDrugs();
  });

  els.search.addEventListener("input", () => {
    state.query = els.search.value;
    renderDrugs();
  });

  if (els.weight) {
    els.weight.addEventListener("input", () => {
      state.weight = els.weight.value;
      localStorage.setItem("aed-weight-kg", state.weight);
      renderWeightHint();
      renderDrugs();
    });
  }

  els.list.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-toggle]");
    if (!btn) return;
    const id = btn.dataset.toggle;
    state.openId = state.openId === id ? null : id;
    renderDrugs();
  });
}

boot();
