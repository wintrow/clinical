(() => {
  const data = window.BRAIN_TUMOR;
  if (!data) return;

  const $ = (id) => document.getElementById(id);
  const searchEl = $("search");
  const filtersEl = $("filters");
  const familyListEl = $("family-list");
  const markerListEl = $("marker-list");
  const pearlsEl = $("pearls");
  const algorithmsEl = $("algorithms");
  const tabsEl = $("view-tabs");
  const metaEl = $("bt-meta");
  const footerEl = $("bt-footer");

  const GROUPS = [
    { id: "all", label: "全部" },
    { id: "glioma", label: "神經膠質／神經元" },
    { id: "embryonal", label: "胚胎性" },
    { id: "meningeal", label: "腦膜" },
    { id: "other", label: "其他" },
  ];

  const VIEWS = [
    { id: "classify", label: "分類" },
    { id: "molecular", label: "分子標記" },
    { id: "keys", label: "臨床重點" },
  ];

  let group = "all";
  let view = "classify";
  let query = "";

  function norm(s) {
    return String(s || "")
      .toLowerCase()
      .replace(/\s+/g, " ");
  }

  function matchesQuery(parts) {
    if (!query) return true;
    const hay = norm(parts.filter(Boolean).join(" "));
    return query.split(/\s+/).every((q) => hay.includes(q));
  }

  function renderMeta() {
    if (metaEl) {
      metaEl.innerHTML = `${data.meta.source} · DOI <a href="https://doi.org/${data.meta.doi}" target="_blank" rel="noopener">${data.meta.doi}</a>`;
    }
    if (footerEl) {
      footerEl.textContent = `${data.meta.note}`;
    }
  }

  function renderTabs() {
    tabsEl.innerHTML = "";
    VIEWS.forEach((v) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "chip" + (view === v.id ? " is-active" : "");
      btn.textContent = v.label;
      btn.setAttribute("aria-pressed", view === v.id ? "true" : "false");
      btn.addEventListener("click", () => {
        view = v.id;
        render();
      });
      tabsEl.appendChild(btn);
    });
  }

  function renderFilters() {
    filtersEl.hidden = view !== "classify";
    if (view !== "classify") return;
    filtersEl.innerHTML = "";
    GROUPS.forEach((g) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "chip chip--soft" + (group === g.id ? " is-active" : "");
      btn.textContent = g.label;
      btn.addEventListener("click", () => {
        group = g.id;
        renderFamilies();
        renderFilters();
      });
      filtersEl.appendChild(btn);
    });
  }

  function tumorCard(t) {
    const li = document.createElement("li");
    li.className = "tumor-card";
    const title = document.createElement("div");
    title.className = "tumor-card__name";
    title.textContent = t.name;
    if (t.provisional) {
      const tag = document.createElement("span");
      tag.className = "tag";
      tag.textContent = "provisional";
      title.appendChild(tag);
    }
    li.appendChild(title);

    const meta = document.createElement("div");
    meta.className = "tumor-card__meta";
    if (t.grades) {
      const g = document.createElement("span");
      g.innerHTML = `<em>CNS WHO</em> ${t.grades}`;
      meta.appendChild(g);
    }
    if (t.molecular) {
      const m = document.createElement("span");
      m.className = "tumor-card__mol";
      m.textContent = t.molecular;
      meta.appendChild(m);
    }
    if (meta.childNodes.length) li.appendChild(meta);

    if (t.note) {
      const note = document.createElement("p");
      note.className = "tumor-card__note";
      note.textContent = t.note;
      li.appendChild(note);
    }
    return li;
  }

  function renderFamilies() {
    familyListEl.innerHTML = "";
    let shown = 0;
    data.families.forEach((fam) => {
      if (group !== "all" && fam.group !== group) return;
      const tumors = fam.tumors.filter((t) =>
        matchesQuery([fam.name, fam.nameZh, t.name, t.molecular, t.note, t.grades])
      );
      if (!tumors.length) return;
      shown += tumors.length;

      const section = document.createElement("section");
      section.className = "family";
      section.innerHTML = `
        <header class="family__head">
          <h3>${fam.nameZh}</h3>
          <p>${fam.name}</p>
        </header>
      `;
      const ul = document.createElement("ul");
      ul.className = "tumor-list";
      tumors.forEach((t) => ul.appendChild(tumorCard(t)));
      section.appendChild(ul);
      familyListEl.appendChild(section);
    });

    if (!shown) {
      familyListEl.innerHTML = `<p class="empty-hint">沒有符合「${query}」的腫瘤類型。</p>`;
    }
  }

  function renderMarkers() {
    markerListEl.innerHTML = "";
    const rows = data.markers.filter((m) => matchesQuery([m.gene, m.role]));
    if (!rows.length) {
      markerListEl.innerHTML = `<p class="empty-hint">沒有符合的分子標記。</p>`;
      return;
    }
    const table = document.createElement("div");
    table.className = "marker-table";
    rows.forEach((m) => {
      const row = document.createElement("div");
      row.className = "marker-row";
      row.innerHTML = `
        <div class="marker-row__gene">${m.gene}</div>
        <div class="marker-row__role">${m.role}</div>
      `;
      table.appendChild(row);
    });
    markerListEl.appendChild(table);
  }

  function renderKeys() {
    pearlsEl.innerHTML = "";
    data.pearls.forEach((p) => {
      const card = document.createElement("article");
      card.className = "pearl";
      card.innerHTML = `<h3>${p.title}</h3><p>${p.body}</p>`;
      pearlsEl.appendChild(card);
    });

    algorithmsEl.innerHTML = "";
    data.algorithms.forEach((a) => {
      const card = document.createElement("article");
      card.className = "algo";
      const ol = a.steps.map((s) => `<li>${s}</li>`).join("");
      card.innerHTML = `<h3>${a.title}</h3><ol>${ol}</ol>`;
      algorithmsEl.appendChild(card);
    });
  }

  function setPanels() {
    $("panel-classify").hidden = view !== "classify";
    $("panel-molecular").hidden = view !== "molecular";
    $("panel-keys").hidden = view !== "keys";
    searchEl.placeholder =
      view === "molecular"
        ? "搜尋基因／分子標記…"
        : view === "keys"
          ? "此頁可不搜尋；可切回分類／分子"
          : "搜尋腫瘤名稱、分子、部位…";
    searchEl.disabled = view === "keys";
  }

  function render() {
    renderTabs();
    renderFilters();
    setPanels();
    if (view === "classify") renderFamilies();
    if (view === "molecular") renderMarkers();
    if (view === "keys") renderKeys();
  }

  searchEl.addEventListener("input", () => {
    query = norm(searchEl.value.trim());
    if (view === "classify") renderFamilies();
    if (view === "molecular") renderMarkers();
  });

  renderMeta();
  render();
})();
