/**
 * Tool registry — add entries here as tools are built.
 * Each item: { id, name, description, href }
 */
const TOOLS = [
  {
    id: "surgery-billing",
    name: "手術記帳",
    description: "搜尋帳碼、勾選後自動算出 ABB／AAB 最高點數組合。",
    href: "tools/surgery-billing/index.html",
  },
  {
    id: "scores",
    name: "臨床分數",
    description: "GCS、ICH、H&H、ISS、APACHE、mRS、GOS 等常用量表。",
    href: "tools/scores/index.html",
  },
];

const toolList = document.getElementById("tool-list");
const emptyState = document.getElementById("empty-state");
const topbar = document.querySelector(".topbar");
const toolCountEl = document.querySelector(".pulse-panel__meta span:last-child");

function renderTools() {
  if (!toolList || !emptyState) return;

  if (TOOLS.length === 0) {
    toolList.hidden = true;
    toolList.innerHTML = "";
    emptyState.hidden = false;
    if (toolCountEl) toolCountEl.textContent = "0 tools";
    return;
  }

  emptyState.hidden = true;
  toolList.hidden = false;
  toolList.innerHTML = TOOLS.map(
    (tool) => `
      <li>
        <a class="tool-link" href="${tool.href}">
          <span class="tool-link__name">${tool.name}</span>
          <span class="tool-link__arrow" aria-hidden="true">→</span>
          <span class="tool-link__desc">${tool.description}</span>
        </a>
      </li>
    `
  ).join("");

  if (toolCountEl) {
    toolCountEl.textContent = `${TOOLS.length} tool${TOOLS.length > 1 ? "s" : ""}`;
  }
}

function setupTopbar() {
  if (!topbar) return;

  const onScroll = () => {
    topbar.classList.toggle("is-scrolled", window.scrollY > 8);
  };

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

renderTools();
setupTopbar();
