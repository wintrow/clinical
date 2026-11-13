(() => {
  const data = window.TBI_GUIDE;
  if (!data) return;

  const $ = (id) => document.getElementById(id);
  const searchEl = $("search");
  const filtersEl = $("filters");
  const thresholdsEl = $("thresholds");
  const guideListEl = $("guide-list");
  const topicListEl = $("topic-list");
  const metaEl = $("tbi-meta");
  const footerEl = $("tbi-footer");

  let guide = "all";
  let query = "";

  function norm(s) {
    return String(s || "")
      .toLowerCase()
      .replace(/\s+/g, " ");
  }

  function matches(parts) {
    if (!query) return true;
    const hay = norm(parts.filter(Boolean).join(" "));
    return query.split(/\s+/).every((q) => hay.includes(q));
  }

  function renderMeta() {
    metaEl.innerHTML = `來源：<a href="${data.meta.url}" target="_blank" rel="noopener">${data.meta.source}</a>`;
    footerEl.textContent = data.meta.note;
  }

  function renderThresholds() {
    thresholdsEl.innerHTML = "";
    data.thresholds.forEach((t) => {
      const card = document.createElement("div");
      card.className = "th-card";
      card.innerHTML = `
        <div class="th-card__label">${t.label}</div>
        <div class="th-card__value">${t.value}</div>
        <div class="th-card__hint">${t.hint}</div>
      `;
      thresholdsEl.appendChild(card);
    });
  }

  function renderFilters() {
    filtersEl.innerHTML = "";
    const opts = [{ id: "all", label: "全部" }].concat(
      data.guides.map((g) => ({ id: g.id, label: g.nameZh }))
    );
    opts.forEach((o) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "chip" + (guide === o.id ? " is-active" : "");
      btn.textContent = o.label;
      btn.addEventListener("click", () => {
        guide = o.id;
        renderFilters();
        renderGuides();
        renderTopics();
      });
      filtersEl.appendChild(btn);
    });
  }

  function renderGuides() {
    guideListEl.innerHTML = "";
    data.guides
      .filter((g) => guide === "all" || g.id === guide)
      .filter((g) => matches([g.name, g.nameZh, g.blurb, g.year]))
      .forEach((g) => {
        const a = document.createElement("a");
        a.className = "guide-card";
        a.href = g.url;
        a.target = "_blank";
        a.rel = "noopener";
        a.innerHTML = `
          <div class="guide-card__top">
            <span class="guide-card__zh">${g.nameZh}</span>
            <span class="guide-card__year">${g.year}</span>
          </div>
          <div class="guide-card__en">${g.name}</div>
          <p class="guide-card__blurb">${g.blurb}</p>
          <span class="guide-card__link">BTF 原文 →</span>
        `;
        guideListEl.appendChild(a);
      });
  }

  function levelClass(level) {
    const s = String(level || "").toUpperCase();
    if (s.includes("I") && !s.includes("II") && !s.includes("III") && !s.includes("IV")) return "lvl--1";
    if (s.includes("II A") || s === "IIA") return "lvl--2a";
    if (s.includes("II B") || s === "IIB" || s.includes("II /")) return "lvl--2b";
    if (s.includes("III") || s.includes("IV")) return "lvl--3";
    if (s.includes("STRONG")) return "lvl--strong";
    return "lvl--other";
  }

  function renderTopics() {
    topicListEl.innerHTML = "";
    const rows = data.topics.filter((t) => {
      if (guide !== "all" && t.guide !== guide) return false;
      return matches([t.title, t.cat, t.level, ...(t.points || [])]);
    });

    if (!rows.length) {
      topicListEl.innerHTML = `<p class="empty-hint">沒有符合的建議。</p>`;
      return;
    }

    const byGuide = new Map();
    rows.forEach((t) => {
      if (!byGuide.has(t.guide)) byGuide.set(t.guide, []);
      byGuide.get(t.guide).push(t);
    });

    byGuide.forEach((topics, gid) => {
      const gmeta = data.guides.find((g) => g.id === gid);
      const section = document.createElement("section");
      section.className = "topic-section";
      section.innerHTML = `
        <header class="topic-section__head">
          <h2>${gmeta ? gmeta.nameZh : gid}</h2>
          <p>${gmeta ? gmeta.name : ""}</p>
        </header>
      `;
      const list = document.createElement("div");
      list.className = "topic-list";
      topics.forEach((t) => {
        const card = document.createElement("article");
        card.className = "topic-card";
        const pts = t.points.map((p) => `<li>${p}</li>`).join("");
        card.innerHTML = `
          <div class="topic-card__bar">
            <span class="topic-card__cat">${t.cat}</span>
            <span class="lvl ${levelClass(t.level)}">${t.level}</span>
          </div>
          <h3>${t.title}</h3>
          <ul>${pts}</ul>
        `;
        list.appendChild(card);
      });
      section.appendChild(list);
      topicListEl.appendChild(section);
    });
  }

  searchEl.addEventListener("input", () => {
    query = norm(searchEl.value.trim());
    renderGuides();
    renderTopics();
  });

  renderMeta();
  renderThresholds();
  renderFilters();
  renderGuides();
  renderTopics();
})();
