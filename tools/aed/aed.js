const state = {
  line: "all",
  query: "",
  timeline: "cse",
  openId: null,
};

const els = {
  meta: document.getElementById("aed-meta"),
  footer: document.getElementById("aed-footer"),
  tabs: document.getElementById("timeline-tabs"),
  timeline: document.getElementById("timeline"),
  search: document.getElementById("search"),
  filters: document.getElementById("filters"),
  list: document.getElementById("drug-list"),
};

function lineTag(line) {
  if (line === "1st") return '<span class="tag tag--1st">1st line</span>';
  if (line === "2nd") return '<span class="tag tag--2nd">2nd line</span>';
  if (line === "3rd") return '<span class="tag tag--3rd">3rd 麻醉</span>';
  if (line === "immune") return '<span class="tag tag--immune">免疫／NORSE</span>';
  return "";
}

function renderMeta() {
  const meta = window.AED_META || {};
  els.meta.innerHTML = `來源：<a href="${meta.doi || "#"}" target="_blank" rel="noopener">${
    meta.source || "文獻"
  }</a>`;
  els.footer.textContent = meta.note || "僅供臨床參考。";
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
  const drugs = filteredDrugs();
  els.list.innerHTML = drugs
    .map((d) => {
      const open = state.openId === d.id;
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
          <div class="row"><span class="row__k">機制</span><span class="row__v">${d.mechanism}</span></div>
          <div class="row"><span class="row__k">起效／半衰期</span><span class="row__v">${d.onset} ／ ${d.halfLife}</span></div>
          <div class="row"><span class="row__k">Loading</span><span class="row__v">${d.loading}</span></div>
          <div class="row"><span class="row__k">Maintenance</span><span class="row__v">${d.maintenance}</span></div>
          <div class="row row--side"><span class="row__k">副作用／注意</span><span class="row__v">${d.sideEffects}</span></div>
          <div class="row"><span class="row__k">臨床備註</span><span class="row__v">${d.notes}</span></div>
        </div>
      </li>`;
    })
    .join("");
}

function boot() {
  renderMeta();
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

  els.list.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-toggle]");
    if (!btn) return;
    const id = btn.dataset.toggle;
    state.openId = state.openId === id ? null : id;
    renderDrugs();
  });
}

boot();
