const state = {
  items: [],
  meta: null,
  query: "",
  filter: "all",
  selected: new Set(),
  optimalCodes: new Set(),
  lastTotal: 0,
};

const els = {
  search: document.getElementById("search"),
  list: document.getElementById("code-list"),
  listEmpty: document.getElementById("list-empty"),
  resultsCount: document.getElementById("results-count"),
  dataMeta: document.getElementById("data-meta"),
  picked: document.getElementById("picked-summary"),
  ruleCard: document.getElementById("rule-card"),
  ruleMode: document.getElementById("rule-mode"),
  ruleList: document.getElementById("rule-list"),
  ruleTotal: document.getElementById("rule-total"),
  selectedCount: document.getElementById("selected-count"),
  selectedList: document.getElementById("selected-list"),
  selectedEmpty: document.getElementById("selected-empty"),
  selectedPanel: document.getElementById("selected-panel"),
  clear: document.getElementById("clear-selection"),
  dock: document.getElementById("dock"),
  dockCount: document.getElementById("dock-count"),
  dockTotal: document.getElementById("dock-total"),
  dockSelected: document.getElementById("dock-selected"),
  dockResult: document.getElementById("dock-result"),
};

function codeFamily(code) {
  const match = String(code).match(/(\d{2})/);
  return match ? match[1] : "";
}

/** ABB only when every code shares the same 83 or 64 prefix. */
function usesAbb(codes) {
  if (codes.length < 2) return false;
  const families = codes.map(codeFamily);
  const first = families[0];
  return (first === "83" || first === "64") && families.every((f) => f === first);
}

function ratesFor(codes) {
  const abb = usesAbb(codes);
  if (codes.length <= 1) return [1];
  if (codes.length === 2) return abb ? [1, 0.5] : [1, 1];
  return abb ? [1, 0.5, 0.5] : [1, 1, 0.5];
}

function modeLabel(codes) {
  if (codes.length <= 1) return "單碼 · 全額";
  if (usesAbb(codes)) {
    const fam = codeFamily(codes[0]);
    return codes.length === 2
      ? `ABB · 同開頭 ${fam}（全／半）`
      : `ABB · 同開頭 ${fam}（全／半／半）`;
  }
  return codes.length === 2
    ? "AAB · 不同開頭（全／全）"
    : "AAB · 不同開頭（全／全／半）";
}

function combinations(arr, k) {
  const out = [];
  const n = arr.length;
  if (k > n || k <= 0) return out;
  const idx = Array.from({ length: k }, (_, i) => i);
  while (true) {
    out.push(idx.map((i) => arr[i]));
    let i = k - 1;
    while (i >= 0 && idx[i] === i + n - k) i -= 1;
    if (i < 0) break;
    idx[i] += 1;
    for (let j = i + 1; j < k; j += 1) idx[j] = idx[j - 1] + 1;
  }
  return out;
}

function permutations(arr) {
  if (arr.length <= 1) return [arr.slice()];
  const out = [];
  for (let i = 0; i < arr.length; i += 1) {
    const rest = arr.slice(0, i).concat(arr.slice(i + 1));
    for (const p of permutations(rest)) out.push([arr[i], ...p]);
  }
  return out;
}

function scoreOrder(ordered) {
  const codes = ordered.map((item) => item.code);
  const rates = ratesFor(codes);
  const lines = ordered.map((item, i) => {
    const rate = rates[i];
    const billed = (item.points || 0) * rate;
    return { item, rate, billed };
  });
  const total = lines.reduce((sum, line) => sum + line.billed, 0);
  return { lines, total, mode: modeLabel(codes), abb: usesAbb(codes) };
}

function optimize(selectedItems) {
  const usable = selectedItems.filter(
    (item) => typeof item.points === "number" && !Number.isNaN(item.points)
  );
  if (usable.length === 0) return null;

  let best = null;
  const maxK = Math.min(3, usable.length);
  for (let k = 1; k <= maxK; k += 1) {
    for (const combo of combinations(usable, k)) {
      for (const ordered of permutations(combo)) {
        const scored = scoreOrder(ordered);
        if (
          !best ||
          scored.total > best.total + 1e-9 ||
          (Math.abs(scored.total - best.total) < 1e-9 &&
            scored.lines.length > best.lines.length)
        ) {
          best = scored;
        }
      }
    }
  }
  return best;
}

function formatPoints(n) {
  if (n == null || Number.isNaN(n)) return "—";
  return Number(n).toLocaleString("zh-TW", {
    maximumFractionDigits: 1,
  });
}

function haystack(item) {
  return [
    item.code,
    item.name_zh,
    item.name_en,
    item.note,
    item.local_note,
    item.dept,
    item.section,
    item.category,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function matchesFilter(item) {
  switch (state.filter) {
    case "spine":
      return item.category === "spine" || item.source?.includes("spine");
    case "opd":
      return item.category === "opd-injection";
    case "830":
      return String(item.code).startsWith("830");
    default:
      return true;
  }
}

const RESULT_LIMIT = 200;

function needsQuery() {
  // Full NHI library is huge — require a keyword unless a shortlist filter is on.
  return state.filter === "all";
}

function filteredItems() {
  const q = state.query.trim().toLowerCase();
  const tokens = q ? q.split(/\s+/).filter(Boolean) : [];

  if (needsQuery() && tokens.length === 0) {
    return { items: [], total: state.items.length, needsQuery: true, truncated: false };
  }

  const matched = state.items.filter((item) => {
    if (!matchesFilter(item)) return false;
    if (!tokens.length) return true;
    const text = haystack(item);
    return tokens.every((t) => text.includes(t));
  });

  return {
    items: matched.slice(0, RESULT_LIMIT),
    total: matched.length,
    needsQuery: false,
    truncated: matched.length > RESULT_LIMIT,
  };
}

function selectedItems() {
  return state.items.filter((item) => state.selected.has(item.code));
}

function unselect(code) {
  state.selected.delete(code);
  refresh();
}

function renderList() {
  const result = filteredItems();
  const items = result.items;

  if (result.needsQuery) {
    els.resultsCount.textContent = `全庫 ${result.total} 筆`;
    els.list.innerHTML = "";
    els.listEmpty.hidden = false;
    els.listEmpty.textContent =
      "輸入中文、英文或代碼搜尋健保署全庫；或切換 Spine／injection／NS 看常用清單。";
    return;
  }

  els.resultsCount.textContent = result.truncated
    ? `${result.total} 筆（顯示前 ${RESULT_LIMIT}）`
    : `${result.total} 筆`;
  els.listEmpty.hidden = items.length > 0;
  els.listEmpty.textContent = "沒有符合的項目。";
  els.list.innerHTML = items
    .map((item) => {
      const checked = state.selected.has(item.code);
      const optimal = state.optimalCodes.has(item.code);
      const tags = [];
      if (item.self_pay) tags.push('<span class="tag tag--pay">自費</span>');
      if (item.local && item.category === "opd-injection") tags.push('<span class="tag">injection</span>');
      if (String(item.code).startsWith("830")) tags.push('<span class="tag">NS</span>');
      if (item.section) tags.push(`<span class="tag">${item.section}</span>`);
      if (item.category === "spine") tags.push('<span class="tag">Spine</span>');
      if (item.nhi_code && item.nhi_code !== item.code) {
        tags.push(`<span class="tag">健保 ${item.nhi_code}</span>`);
      }
      const names = [item.name_zh, item.name_en].filter(Boolean).join(" · ");
      return `
        <li>
          <label class="code-item ${checked ? "is-checked" : ""} ${optimal ? "is-optimal" : ""}">
            <input type="checkbox" data-code="${item.code}" ${checked ? "checked" : ""} />
            <span>
              <span class="code-item__code">${item.code}</span>
              <p class="code-item__names">${names || "（無名稱）"}</p>
              <span class="code-item__tags">${tags.join("")}</span>
            </span>
            <span class="code-item__points">${formatPoints(item.points)}</span>
          </label>
        </li>
      `;
    })
    .join("");
}

function renderSelected(items) {
  els.selectedCount.textContent = String(items.length);
  els.selectedEmpty.hidden = items.length > 0;
  els.selectedList.innerHTML = items
    .map((item) => {
      const on = state.optimalCodes.has(item.code);
      const names = [item.name_zh, item.name_en].filter(Boolean).join(" · ");
      return `
        <li class="selected-row ${on ? "is-optimal" : ""}">
          <div class="selected-row__main">
            <div class="selected-row__code ${on ? "on" : ""}">${item.code}</div>
            <p class="selected-row__meta">${names || "（無名稱）"}</p>
          </div>
          <div class="selected-row__side">
            <span class="selected-row__points">${formatPoints(item.points)}</span>
            <button type="button" class="remove-btn" data-remove="${item.code}">取消</button>
          </div>
        </li>
      `;
    })
    .join("");
}

function renderResult(items) {
  const best = optimize(items);
  state.optimalCodes = new Set(best ? best.lines.map((l) => l.item.code) : []);
  state.lastTotal = best ? best.total : 0;

  if (!best) {
    els.picked.innerHTML = '<p class="picked__empty">勾選後會顯示最高點數組合。</p>';
    els.ruleCard.hidden = true;
    return;
  }

  els.picked.innerHTML = `<p class="picked__empty">已從 ${items.length} 個已選中，選出 ${best.lines.length} 碼。</p>`;
  els.ruleCard.hidden = false;
  els.ruleMode.textContent = best.mode;
  els.ruleList.innerHTML = best.lines
    .map((line, i) => {
      const slot = "ABC"[i];
      const pct = Math.round(line.rate * 100);
      const names = [line.item.name_zh, line.item.name_en].filter(Boolean).join(" · ");
      return `
        <li>
          <span class="slot">${slot}</span>
          <span>${line.item.code}<br /><small>${names}</small></span>
          <span class="calc">${formatPoints(line.item.points)} × ${pct}% = ${formatPoints(line.billed)}</span>
        </li>
      `;
    })
    .join("");
  els.ruleTotal.textContent = formatPoints(best.total);
}

function renderDock(count) {
  const show = count > 0;
  els.dock.hidden = !show;
  els.dockCount.textContent = String(count);
  els.dockTotal.textContent = formatPoints(state.lastTotal);
}

function refresh() {
  const items = selectedItems();
  renderResult(items);
  renderSelected(items);
  renderList();
  renderDock(items.length);
}

function boot() {
  const data = window.BILLING_CODES;
  if (!data || !Array.isArray(data.items)) {
    throw new Error("找不到 billing-codes 資料，請先執行 update-billing-codes.py");
  }
  state.items = data.items || [];
  state.meta = data.meta || {};

  const updated = state.meta.updated || "—";
  const nhiCount = state.meta.count_nhi ?? "—";
  els.dataMeta.innerHTML = `點數更新：<strong>${updated}</strong> · 健保全庫 ${nhiCount} + 院內碼 · 共 ${
    state.meta.count ?? state.items.length
  } · <a href="${
    state.meta.nhi_query || "https://info.nhi.gov.tw/INAE5000/INAE5001S01"
  }" target="_blank" rel="noopener">健保署</a>`;

  els.search.addEventListener("input", () => {
    state.query = els.search.value;
    renderList();
  });

  document.querySelectorAll('input[name="filter"]').forEach((input) => {
    input.addEventListener("change", () => {
      if (input.checked) {
        state.filter = input.value;
        renderList();
      }
    });
  });

  els.list.addEventListener("change", (event) => {
    const input = event.target.closest('input[type="checkbox"][data-code]');
    if (!input) return;
    const code = input.dataset.code;
    if (input.checked) state.selected.add(code);
    else state.selected.delete(code);
    refresh();
  });

  els.selectedList.addEventListener("click", (event) => {
    const btn = event.target.closest("[data-remove]");
    if (!btn) return;
    unselect(btn.dataset.remove);
  });

  els.clear.addEventListener("click", () => {
    state.selected.clear();
    refresh();
  });

  els.dockSelected.addEventListener("click", () => {
    els.selectedPanel.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  els.dockResult.addEventListener("click", () => {
    document
      .querySelector(".panel--result")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  refresh();
}

try {
  boot();
} catch (err) {
  els.dataMeta.textContent = `載入失敗：${err.message}`;
  console.error(err);
}
