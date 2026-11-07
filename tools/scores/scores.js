/**
 * Clinical scores for neurosurgery / trauma / ICU.
 * Mobile-first calculators; results are for clinical reference only.
 */

const CATEGORIES = ["全部", "意識／預後", "腦出血／中風", "SAH", "創傷", "加護", "脊椎", "血管"];

function opt(value, title, desc = "") {
  return { value, title, desc };
}

function num(v, fallback = null) {
  if (v === "" || v == null) return fallback;
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function pick(values, key) {
  const v = values[key];
  return v === undefined || v === "" ? null : v;
}

const SCORES = [
  {
    id: "gcs",
    name: "GCS",
    nameZh: "格拉斯哥昏迷指數",
    category: "意識／預後",
    blurb: "Eye + Verbal + Motor（3–15）。",
    fields: [
      {
        key: "E",
        label: "Eye opening",
        type: "choice",
        options: [
          opt(4, "4", "Spontaneous"),
          opt(3, "3", "To speech"),
          opt(2, "2", "To pain"),
          opt(1, "1", "None"),
        ],
      },
      {
        key: "V",
        label: "Verbal response",
        type: "choice",
        options: [
          opt(5, "5", "Oriented"),
          opt(4, "4", "Confused"),
          opt(3, "3", "Inappropriate words"),
          opt(2, "2", "Incomprehensible sounds"),
          opt(1, "1", "None"),
          opt("T", "T", "Intubated / tracheostomy"),
        ],
      },
      {
        key: "M",
        label: "Motor response",
        type: "choice",
        options: [
          opt(6, "6", "Obeys commands"),
          opt(5, "5", "Localizes pain"),
          opt(4, "4", "Withdraws"),
          opt(3, "3", "Abnormal flexion"),
          opt(2, "2", "Extension"),
          opt(1, "1", "None"),
        ],
      },
    ],
    compute(v) {
      const E = num(pick(v, "E"));
      const M = num(pick(v, "M"));
      const Vraw = pick(v, "V");
      if (E == null || M == null || Vraw == null) return null;
      if (Vraw === "T") {
        return {
          score: `E${E}VTM${M}`,
          detail: `合計無法以數字表示（插管）。數值近似：${E + M}+T`,
          note: "記錄建議寫成 E_VTM_。",
        };
      }
      const V = num(Vraw);
      const total = E + V + M;
      let band = "輕度";
      if (total <= 8) band = "重度（≤8）";
      else if (total <= 12) band = "中度（9–12）";
      return {
        score: String(total),
        detail: `E${E} V${V} M${M} · ${band}`,
        note: "",
      };
    },
  },
  {
    id: "four",
    name: "FOUR score",
    nameZh: "Full Outline of UnResponsiveness",
    category: "意識／預後",
    blurb: "插管病人也適用；Eye / Motor / Brainstem / Respiration。",
    fields: [
      {
        key: "eye",
        label: "Eye response",
        type: "choice",
        options: [
          opt(4, "4", "Eyelids open / tracking"),
          opt(3, "3", "Eyelids open but not tracking"),
          opt(2, "2", "Closed but open to loud voice"),
          opt(1, "1", "Closed but open to pain"),
          opt(0, "0", "Remain closed with pain"),
        ],
      },
      {
        key: "motor",
        label: "Motor response",
        type: "choice",
        options: [
          opt(4, "4", "Thumbs-up / fist / peace sign"),
          opt(3, "3", "Localizing to pain"),
          opt(2, "2", "Flexion to pain"),
          opt(1, "1", "Extension to pain"),
          opt(0, "0", "No response / myoclonus status"),
        ],
      },
      {
        key: "brainstem",
        label: "Brainstem reflexes",
        type: "choice",
        options: [
          opt(4, "4", "Pupil & corneal reflex present"),
          opt(3, "3", "One pupil wide and fixed"),
          opt(2, "2", "Pupil or corneal reflex absent"),
          opt(1, "1", "Pupil and corneal absent"),
          opt(0, "0", "Absent pupil, corneal, cough"),
        ],
      },
      {
        key: "resp",
        label: "Respiration",
        type: "choice",
        options: [
          opt(4, "4", "Not intubated, regular breathing"),
          opt(3, "3", "Not intubated, Cheyne-Stokes"),
          opt(2, "2", "Not intubated, irregular"),
          opt(1, "1", "Breathes above ventilator rate"),
          opt(0, "0", "Breathes at ventilator rate or apnea"),
        ],
      },
    ],
    compute(v) {
      const keys = ["eye", "motor", "brainstem", "resp"];
      const vals = keys.map((k) => num(pick(v, k)));
      if (vals.some((x) => x == null)) return null;
      const total = vals.reduce((a, b) => a + b, 0);
      return {
        score: String(total),
        detail: `E${vals[0]} M${vals[1]} B${vals[2]} R${vals[3]}（0–16）`,
        note: "",
      };
    },
  },
  {
    id: "mrs",
    name: "mRS",
    nameZh: "modified Rankin Scale",
    category: "意識／預後",
    blurb: "中風／神經預後功能分級（0–6）。",
    fields: [
      {
        key: "grade",
        label: "Grade",
        type: "choice",
        options: [
          opt(0, "0", "無症狀"),
          opt(1, "1", "無明顯失能；可完成原有活動"),
          opt(2, "2", "輕度失能；不能完成所有活動，但不需協助日常生活"),
          opt(3, "3", "中度失能；需部分協助，可獨立行走"),
          opt(4, "4", "中重度失能；不能獨立行走，需協助日常生活"),
          opt(5, "5", "重度失能；臥床、失禁、需持續照護"),
          opt(6, "6", "死亡"),
        ],
      },
    ],
    compute(v) {
      const g = num(pick(v, "grade"));
      if (g == null) return null;
      return { score: `mRS ${g}`, detail: "", note: "" };
    },
  },
  {
    id: "gos",
    name: "GOS",
    nameZh: "Glasgow Outcome Scale",
    category: "意識／預後",
    blurb: "腦傷預後五級。",
    fields: [
      {
        key: "grade",
        label: "Grade",
        type: "choice",
        options: [
          opt(1, "1 Death", "死亡"),
          opt(2, "2 Persistent vegetative", "植物人狀態"),
          opt(3, "3 Severe disability", "重度失能"),
          opt(4, "4 Moderate disability", "中度失能"),
          opt(5, "5 Good recovery", "良好恢復"),
        ],
      },
    ],
    compute(v) {
      const g = num(pick(v, "grade"));
      if (g == null) return null;
      return { score: `GOS ${g}`, detail: "", note: "" };
    },
  },
  {
    id: "gose",
    name: "GOSE",
    nameZh: "Glasgow Outcome Scale–Extended",
    category: "意識／預後",
    blurb: "GOS 延伸八級，研究常用。",
    fields: [
      {
        key: "grade",
        label: "Grade",
        type: "choice",
        options: [
          opt(1, "1", "Death"),
          opt(2, "2", "Vegetative state"),
          opt(3, "3", "Lower severe disability"),
          opt(4, "4", "Upper severe disability"),
          opt(5, "5", "Lower moderate disability"),
          opt(6, "6", "Upper moderate disability"),
          opt(7, "7", "Lower good recovery"),
          opt(8, "8", "Upper good recovery"),
        ],
      },
    ],
    compute(v) {
      const g = num(pick(v, "grade"));
      if (g == null) return null;
      return { score: `GOSE ${g}`, detail: "", note: "" };
    },
  },
  {
    id: "hh",
    name: "Hunt & Hess",
    nameZh: "H&H SAH 臨床分級",
    category: "SAH",
    blurb: "蜘蛛膜下腔出血臨床嚴重度。",
    fields: [
      {
        key: "grade",
        label: "Grade",
        type: "choice",
        options: [
          opt(1, "I", "無症狀，或輕微頭痛／頸僵"),
          opt(2, "II", "中重度頭痛、頸僵；無神經缺損（除腦神經）"),
          opt(3, "III", "嗜睡／混亂，或輕度局部缺損"),
          opt(4, "IV", "木僵，中重度偏癱，早期去大腦僵直可有"),
          opt(5, "V", "深度昏迷，去大腦僵直，瀕死外觀"),
        ],
      },
    ],
    compute(v) {
      const g = num(pick(v, "grade"));
      if (g == null) return null;
      return { score: `H&H ${["", "I", "II", "III", "IV", "V"][g]}`, detail: `Grade ${g}`, note: "" };
    },
  },
  {
    id: "wfns",
    name: "WFNS",
    nameZh: "WFNS SAH grade",
    category: "SAH",
    blurb: "依 GCS 與運動缺損分級。",
    fields: [
      {
        key: "gcs",
        label: "GCS",
        type: "number",
        min: 3,
        max: 15,
        step: 1,
        hint: "輸入總分 3–15",
      },
      {
        key: "motorDeficit",
        label: "Motor deficit",
        type: "choice",
        options: [opt("no", "無", "No major focal motor deficit"), opt("yes", "有", "Major focal motor deficit")],
      },
    ],
    compute(v) {
      const gcs = num(pick(v, "gcs"));
      const def = pick(v, "motorDeficit");
      if (gcs == null || def == null) return null;
      if (gcs < 3 || gcs > 15) return { score: "—", detail: "GCS 需在 3–15", note: "" };
      // I: GCS 15; II: 13–14 no deficit; III: 13–14 with deficit; IV: 7–12; V: 3–6
      let grade;
      if (gcs === 15) grade = 1;
      else if (gcs >= 13) grade = def === "yes" ? 3 : 2;
      else if (gcs >= 7) grade = 4;
      else grade = 5;
      return {
        score: `WFNS ${grade}`,
        detail: `GCS ${gcs} · 運動缺損：${def === "yes" ? "有" : "無"}`,
        note: "",
      };
    },
  },
  {
    id: "mfisher",
    name: "Modified Fisher",
    nameZh: "改良 Fisher 分級",
    category: "SAH",
    blurb: "依 CT 出血量與 IVH 預測血管痙攣風險。",
    fields: [
      {
        key: "grade",
        label: "Grade",
        type: "choice",
        options: [
          opt(0, "0", "無 SAH 或 IVH"),
          opt(1, "1", "薄層 SAH，無兩側腦室 IVH"),
          opt(2, "2", "薄層 SAH + 兩側腦室 IVH"),
          opt(3, "3", "厚層 SAH，無兩側腦室 IVH"),
          opt(4, "4", "厚層 SAH + 兩側腦室 IVH"),
        ],
      },
    ],
    compute(v) {
      const g = num(pick(v, "grade"));
      if (g == null) return null;
      const risk = ["很低", "低", "中低", "中高", "高"][g] || "";
      return { score: `mFisher ${g}`, detail: `血管痙攣風險傾向：${risk}`, note: "厚層通常指 ≥1 mm 或完全填滿腦池。" };
    },
  },
  {
    id: "ich",
    name: "ICH score",
    nameZh: "腦內出血預後分數",
    category: "腦出血／中風",
    blurb: "Hemphill ICH score（0–6）預測 30 日死亡率。",
    fields: [
      {
        key: "gcs",
        label: "GCS",
        type: "choice",
        options: [
          opt(2, "3–4", "+2"),
          opt(1, "5–12", "+1"),
          opt(0, "13–15", "+0"),
        ],
      },
      {
        key: "volume",
        label: "ICH volume",
        type: "choice",
        options: [opt(1, "≥30 mL", "+1"), opt(0, "<30 mL", "+0")],
      },
      {
        key: "ivh",
        label: "Intraventricular hemorrhage",
        type: "choice",
        options: [opt(1, "有", "+1"), opt(0, "無", "+0")],
      },
      {
        key: "infra",
        label: "Infratentorial origin",
        type: "choice",
        options: [opt(1, "是", "+1"), opt(0, "否", "+0")],
      },
      {
        key: "age",
        label: "Age",
        type: "choice",
        options: [opt(1, "≥80 歲", "+1"), opt(0, "<80 歲", "+0")],
      },
    ],
    compute(v) {
      const keys = ["gcs", "volume", "ivh", "infra", "age"];
      const vals = keys.map((k) => num(pick(v, k)));
      if (vals.some((x) => x == null)) return null;
      const total = vals.reduce((a, b) => a + b, 0);
      const mort = ["≈0%", "≈13%", "≈26%", "≈72%", "≈97%", "≈100%", "≈100%"][total];
      return {
        score: String(total),
        detail: `30 日死亡率約 ${mort}（文獻估計）`,
        note: "體積可用 ABC/2；僅供參考。",
      };
    },
  },
  {
    id: "nihss",
    name: "NIHSS",
    nameZh: "美國國衛院中風量表",
    category: "腦出血／中風",
    blurb: "急性中風嚴重度（0–42）。",
    fields: [
      {
        key: "1a",
        label: "1a LOC",
        type: "choice",
        options: [opt(0, "0", "Alert"), opt(1, "1", "Arousable by minor stim"), opt(2, "2", "Arousable by repeated/pain"), opt(3, "3", "Unresponsive / reflex only")],
      },
      {
        key: "1b",
        label: "1b LOC questions",
        type: "choice",
        options: [opt(0, "0", "Both correct"), opt(1, "1", "One correct"), opt(2, "2", "Neither")],
      },
      {
        key: "1c",
        label: "1c LOC commands",
        type: "choice",
        options: [opt(0, "0", "Both correct"), opt(1, "1", "One correct"), opt(2, "2", "Neither")],
      },
      {
        key: "2",
        label: "2 Best gaze",
        type: "choice",
        options: [opt(0, "0", "Normal"), opt(1, "1", "Partial gaze palsy"), opt(2, "2", "Forced deviation")],
      },
      {
        key: "3",
        label: "3 Visual",
        type: "choice",
        options: [opt(0, "0", "No loss"), opt(1, "1", "Partial hemianopia"), opt(2, "2", "Complete hemianopia"), opt(3, "3", "Bilateral / blind")],
      },
      {
        key: "4",
        label: "4 Facial palsy",
        type: "choice",
        options: [opt(0, "0", "Normal"), opt(1, "1", "Minor"), opt(2, "2", "Partial"), opt(3, "3", "Complete")],
      },
      {
        key: "5a",
        label: "5a Left arm",
        type: "choice",
        options: [opt(0, "0", "No drift"), opt(1, "1", "Drift"), opt(2, "2", "Some effort vs gravity"), opt(3, "3", "No effort vs gravity"), opt(4, "4", "No movement")],
      },
      {
        key: "5b",
        label: "5b Right arm",
        type: "choice",
        options: [opt(0, "0", "No drift"), opt(1, "1", "Drift"), opt(2, "2", "Some effort vs gravity"), opt(3, "3", "No effort vs gravity"), opt(4, "4", "No movement")],
      },
      {
        key: "6a",
        label: "6a Left leg",
        type: "choice",
        options: [opt(0, "0", "No drift"), opt(1, "1", "Drift"), opt(2, "2", "Some effort vs gravity"), opt(3, "3", "No effort vs gravity"), opt(4, "4", "No movement")],
      },
      {
        key: "6b",
        label: "6b Right leg",
        type: "choice",
        options: [opt(0, "0", "No drift"), opt(1, "1", "Drift"), opt(2, "2", "Some effort vs gravity"), opt(3, "3", "No effort vs gravity"), opt(4, "4", "No movement")],
      },
      {
        key: "7",
        label: "7 Limb ataxia",
        type: "choice",
        options: [opt(0, "0", "Absent"), opt(1, "1", "One limb"), opt(2, "2", "Two limbs")],
      },
      {
        key: "8",
        label: "8 Sensory",
        type: "choice",
        options: [opt(0, "0", "Normal"), opt(1, "1", "Mild-moderate loss"), opt(2, "2", "Severe / total loss")],
      },
      {
        key: "9",
        label: "9 Best language",
        type: "choice",
        options: [opt(0, "0", "No aphasia"), opt(1, "1", "Mild-moderate"), opt(2, "2", "Severe"), opt(3, "3", "Mute / global")],
      },
      {
        key: "10",
        label: "10 Dysarthria",
        type: "choice",
        options: [opt(0, "0", "Normal"), opt(1, "1", "Mild-moderate"), opt(2, "2", "Severe / unintelligible")],
      },
      {
        key: "11",
        label: "11 Extinction / inattention",
        type: "choice",
        options: [opt(0, "0", "No abnormality"), opt(1, "1", "One modality"), opt(2, "2", "Profound hemi-inattention")],
      },
    ],
    compute(v) {
      const keys = ["1a", "1b", "1c", "2", "3", "4", "5a", "5b", "6a", "6b", "7", "8", "9", "10", "11"];
      const vals = keys.map((k) => num(pick(v, k)));
      if (vals.some((x) => x == null)) return null;
      const total = vals.reduce((a, b) => a + b, 0);
      let band = "極輕微";
      if (total >= 21) band = "重度";
      else if (total >= 16) band = "中重度";
      else if (total >= 5) band = "中度";
      else if (total >= 1) band = "輕度";
      return { score: String(total), detail: band, note: "截肢／關節融合等項目請依 NIHSS 規則計 UN。" };
    },
  },
  {
    id: "iss",
    name: "ISS",
    nameZh: "Injury Severity Score",
    category: "創傷",
    blurb: "六大區域 AIS 最高分，取前三名平方和（最高 75）。",
    fields: [
      { key: "head", label: "Head / neck AIS", type: "choice", options: aisOptions() },
      { key: "face", label: "Face AIS", type: "choice", options: aisOptions() },
      { key: "chest", label: "Chest AIS", type: "choice", options: aisOptions() },
      { key: "abdomen", label: "Abdomen AIS", type: "choice", options: aisOptions() },
      { key: "extremity", label: "Extremity / pelvis AIS", type: "choice", options: aisOptions() },
      { key: "external", label: "External AIS", type: "choice", options: aisOptions() },
    ],
    compute(v) {
      const keys = ["head", "face", "chest", "abdomen", "extremity", "external"];
      const vals = keys.map((k) => num(pick(v, k)));
      if (vals.some((x) => x == null)) return null;
      if (vals.some((x) => x === 6)) {
        return { score: "75", detail: "任一區域 AIS=6 → ISS 定為 75", note: "" };
      }
      const top = [...vals].sort((a, b) => b - a).slice(0, 3);
      const total = top.reduce((s, x) => s + x * x, 0);
      return {
        score: String(total),
        detail: `取 ${top.join(", ")} 的平方和`,
        note: "ISS >15 常作為重大創傷分界。",
      };
    },
  },
  {
    id: "apache2",
    name: "APACHE II",
    nameZh: "急性生理與慢性健康評估",
    category: "加護",
    blurb: "經典 ICU 嚴重度分數（簡化輸入版）。",
    fields: [
      { key: "temp", label: "Rectal temp (°C)", type: "number", step: 0.1, hint: "例如 37.0" },
      { key: "map", label: "MAP (mmHg)", type: "number", step: 1 },
      { key: "hr", label: "Heart rate", type: "number", step: 1 },
      { key: "rr", label: "Respiratory rate", type: "number", step: 1 },
      {
        key: "oxyMode",
        label: "Oxygenation input",
        type: "choice",
        options: [
          opt("aado2", "FiO₂ ≥0.5", "用 A-aDO₂"),
          opt("pao2", "FiO₂ <0.5", "用 PaO₂"),
        ],
      },
      { key: "oxyVal", label: "A-aDO₂ 或 PaO₂ (mmHg)", type: "number", step: 1 },
      { key: "ph", label: "Arterial pH", type: "number", step: 0.01, hint: "若無 pH 可改用 HCO₃ 近似（下方）" },
      { key: "hco3", label: "Serum HCO₃ (若無 ABG pH)", type: "number", step: 0.1 },
      { key: "na", label: "Sodium (mEq/L)", type: "number", step: 1 },
      { key: "k", label: "Potassium (mEq/L)", type: "number", step: 0.1 },
      { key: "cr", label: "Creatinine (mg/dL)", type: "number", step: 0.1 },
      {
        key: "arf",
        label: "Acute renal failure",
        type: "choice",
        options: [opt("no", "否", ""), opt("yes", "是", "Creatinine 分數×2")],
      },
      { key: "hct", label: "Hematocrit (%)", type: "number", step: 0.1 },
      { key: "wbc", label: "WBC (×10³/µL)", type: "number", step: 0.1 },
      { key: "gcs", label: "GCS", type: "number", min: 3, max: 15, step: 1 },
      { key: "age", label: "Age", type: "number", min: 0, max: 120, step: 1 },
      {
        key: "chronic",
        label: "Chronic health points",
        type: "choice",
        options: [
          opt(0, "0", "無重大慢性器官功能不全／免疫低下"),
          opt(2, "2", "有，且非手術或緊急手術後入院"),
          opt(5, "5", "有，且為選擇性術後入院"),
        ],
      },
    ],
    compute(v) {
      const need = ["temp", "map", "hr", "rr", "oxyMode", "oxyVal", "na", "k", "cr", "arf", "hct", "wbc", "gcs", "age", "chronic"];
      for (const k of need) if (pick(v, k) == null || pick(v, k) === "") return null;

      const temp = num(v.temp);
      const map = num(v.map);
      const hr = num(v.hr);
      const rr = num(v.rr);
      const oxyVal = num(v.oxyVal);
      const ph = num(v.ph, null);
      const hco3 = num(v.hco3, null);
      const na = num(v.na);
      const k = num(v.k);
      const cr = num(v.cr);
      const hct = num(v.hct);
      const wbc = num(v.wbc);
      const gcs = num(v.gcs);
      const age = num(v.age);
      const chronic = num(v.chronic);

      let aps = 0;
      aps += apacheTemp(temp);
      aps += apacheMap(map);
      aps += apacheHr(hr);
      aps += apacheRr(rr);
      aps += v.oxyMode === "aado2" ? apacheAa(oxyVal) : apachePao2(oxyVal);
      if (ph != null) aps += apachePh(ph);
      else if (hco3 != null) aps += apacheHco3(hco3);
      else return { score: "—", detail: "請輸入 pH 或 HCO₃", note: "" };
      aps += apacheNa(na);
      aps += apacheK(k);
      let crPts = apacheCr(cr);
      if (v.arf === "yes") crPts *= 2;
      aps += crPts;
      aps += apacheHct(hct);
      aps += apacheWbc(wbc);
      aps += 15 - gcs;

      const agePts = apacheAge(age);
      const total = aps + agePts + chronic;
      return {
        score: String(total),
        detail: `APS ${aps} + Age ${agePts} + Chronic ${chronic}`,
        note: "此為常用簡化實作；正式研究請用完整定義與校正。",
      };
    },
  },
  {
    id: "asa",
    name: "ASA PS",
    nameZh: "ASA 身體狀況分級",
    category: "加護",
    blurb: "麻醉／手術前身體狀態。",
    fields: [
      {
        key: "grade",
        label: "Class",
        type: "choice",
        options: [
          opt(1, "I", "健康"),
          opt(2, "II", "輕度系統性疾病"),
          opt(3, "III", "重度系統性疾病"),
          opt(4, "IV", "重度系統性疾病且持續危及生命"),
          opt(5, "V", "瀕死，不手術預期無法存活"),
          opt(6, "VI", "腦死，器官捐贈手術"),
        ],
      },
      {
        key: "emergency",
        label: "Emergency",
        type: "choice",
        options: [opt("no", "非緊急", ""), opt("yes", "緊急（加 E）", "")],
      },
    ],
    compute(v) {
      const g = num(pick(v, "grade"));
      const em = pick(v, "emergency");
      if (g == null || em == null) return null;
      const roman = ["", "I", "II", "III", "IV", "V", "VI"][g];
      return { score: `ASA ${roman}${em === "yes" ? "E" : ""}`, detail: "", note: "" };
    },
  },
  {
    id: "sins",
    name: "SINS",
    nameZh: "脊椎腫瘤不穩定分數",
    category: "脊椎",
    blurb: "Spinal Instability Neoplastic Score（0–18）。",
    fields: [
      {
        key: "location",
        label: "Location",
        type: "choice",
        options: [
          opt(3, "3", "Junctional (O–C2, C7–T2, T11–L1, L5–S1)"),
          opt(2, "2", "Mobile spine (C3–C6, L2–L4)"),
          opt(1, "1", "Semi-rigid (T3–T10)"),
          opt(0, "0", "Rigid (S2–S5)"),
        ],
      },
      {
        key: "pain",
        label: "Pain",
        type: "choice",
        options: [
          opt(3, "3", "Mechanical / postural pain"),
          opt(1, "1", "Occasional pain, not mechanical"),
          opt(0, "0", "Pain-free lesion"),
        ],
      },
      {
        key: "bone",
        label: "Bone lesion",
        type: "choice",
        options: [opt(2, "2", "Lytic"), opt(1, "1", "Mixed"), opt(0, "0", "Blastic")],
      },
      {
        key: "align",
        label: "Radiographic alignment",
        type: "choice",
        options: [
          opt(4, "4", "Subluxation / translation"),
          opt(2, "2", "De novo deformity (kyphosis/scoliosis)"),
          opt(0, "0", "Normal alignment"),
        ],
      },
      {
        key: "collapse",
        label: "Vertebral body collapse",
        type: "choice",
        options: [
          opt(3, "3", ">50% collapse"),
          opt(2, "2", "<50% collapse"),
          opt(1, "1", "No collapse, >50% body involved"),
          opt(0, "0", "None of the above"),
        ],
      },
      {
        key: "posterolateral",
        label: "Posterolateral involvement",
        type: "choice",
        options: [
          opt(3, "3", "Bilateral"),
          opt(1, "1", "Unilateral"),
          opt(0, "0", "None"),
        ],
      },
    ],
    compute(v) {
      const keys = ["location", "pain", "bone", "align", "collapse", "posterolateral"];
      const vals = keys.map((k) => num(pick(v, k)));
      if (vals.some((x) => x == null)) return null;
      const total = vals.reduce((a, b) => a + b, 0);
      let band = "穩定（0–6）";
      if (total >= 13) band = "不穩定（13–18）";
      else if (total >= 7) band = "潛在不穩定（7–12）";
      return { score: String(total), detail: band, note: "" };
    },
  },
  {
    id: "asia",
    name: "ASIA Imp. Scale",
    nameZh: "ASIA 脊髓損傷分級",
    category: "脊椎",
    blurb: "A–E 完整／不完全損傷分級（快速參考）。",
    fields: [
      {
        key: "grade",
        label: "Grade",
        type: "choice",
        options: [
          opt("A", "A Complete", "S4–5 無感覺也無運動"),
          opt("B", "B Sensory incomplete", "S4–5 有感覺、無運動"),
          opt("C", "C Motor incomplete", "有運動，但關鍵肌力多 <3"),
          opt("D", "D Motor incomplete", "有運動，且關鍵肌力多 ≥3"),
          opt("E", "E Normal", "感覺與運動正常"),
        ],
      },
    ],
    compute(v) {
      const g = pick(v, "grade");
      if (g == null) return null;
      return { score: `ASIA ${g}`, detail: "", note: "正式評分需完整 sensory/motor worksheet。" };
    },
  },
  {
    id: "spetzler",
    name: "Spetzler–Martin",
    nameZh: "腦 AVM 分級",
    category: "血管",
    blurb: "Size + Eloquence + Venous drainage（I–V）。",
    fields: [
      {
        key: "size",
        label: "Size",
        type: "choice",
        options: [opt(1, "1", "<3 cm"), opt(2, "2", "3–6 cm"), opt(3, "3", ">6 cm")],
      },
      {
        key: "eloquence",
        label: "Eloquence",
        type: "choice",
        options: [opt(0, "0", "Non-eloquent"), opt(1, "1", "Eloquent")],
      },
      {
        key: "drain",
        label: "Venous drainage",
        type: "choice",
        options: [opt(0, "0", "Superficial only"), opt(1, "1", "Deep venous drainage")],
      },
    ],
    compute(v) {
      const a = num(pick(v, "size"));
      const b = num(pick(v, "eloquence"));
      const c = num(pick(v, "drain"));
      if (a == null || b == null || c == null) return null;
      const total = a + b + c;
      return { score: `Grade ${total}`, detail: `${a}+${b}+${c}`, note: "" };
    },
  },
];

function aisOptions() {
  return [
    opt(0, "0", "No injury"),
    opt(1, "1", "Minor"),
    opt(2, "2", "Moderate"),
    opt(3, "3", "Serious"),
    opt(4, "4", "Severe"),
    opt(5, "5", "Critical"),
    opt(6, "6", "Maximal / currently untreatable"),
  ];
}

/* ---- APACHE II helpers ---- */
function bandScore(value, rules) {
  for (const [pts, ok] of rules) if (ok(value)) return pts;
  return 0;
}
function apacheTemp(t) {
  return bandScore(t, [
    [4, (x) => x >= 41 || x <= 29.9],
    [3, (x) => (x >= 39 && x <= 40.9) || (x >= 30 && x <= 31.9)],
    [2, (x) => x >= 32 && x <= 33.9],
    [1, (x) => (x >= 38.5 && x <= 38.9) || (x >= 34 && x <= 35.9)],
    [0, () => true],
  ]);
}
function apacheMap(m) {
  return bandScore(m, [
    [4, (x) => x >= 160 || x <= 49],
    [3, (x) => x >= 130 && x <= 159],
    [2, (x) => (x >= 110 && x <= 129) || (x >= 50 && x <= 69)],
    [0, () => true],
  ]);
}
function apacheHr(h) {
  return bandScore(h, [
    [4, (x) => x >= 180 || x <= 39],
    [3, (x) => (x >= 140 && x <= 179) || (x >= 40 && x <= 54)],
    [2, (x) => (x >= 110 && x <= 139) || (x >= 55 && x <= 69)],
    [0, () => true],
  ]);
}
function apacheRr(r) {
  return bandScore(r, [
    [4, (x) => x >= 50 || x <= 5],
    [3, (x) => x >= 35 && x <= 49],
    [2, (x) => x >= 6 && x <= 9],
    [1, (x) => (x >= 25 && x <= 34) || (x >= 10 && x <= 11)],
    [0, () => true],
  ]);
}
function apacheAa(a) {
  return bandScore(a, [
    [4, (x) => x >= 500],
    [3, (x) => x >= 350 && x <= 499],
    [2, (x) => x >= 200 && x <= 349],
    [0, () => true],
  ]);
}
function apachePao2(p) {
  return bandScore(p, [
    [4, (x) => x < 55],
    [3, (x) => x >= 55 && x <= 60],
    [1, (x) => x >= 61 && x <= 70],
    [0, () => true],
  ]);
}
function apachePh(p) {
  return bandScore(p, [
    [4, (x) => x >= 7.7 || x < 7.15],
    [3, (x) => (x >= 7.6 && x <= 7.69) || (x >= 7.15 && x <= 7.24)],
    [2, (x) => x >= 7.25 && x <= 7.32],
    [1, (x) => x >= 7.5 && x <= 7.59],
    [0, () => true],
  ]);
}
function apacheHco3(h) {
  return bandScore(h, [
    [4, (x) => x >= 52 || x < 15],
    [3, (x) => (x >= 41 && x <= 51.9) || (x >= 15 && x <= 17.9)],
    [2, (x) => x >= 18 && x <= 21.9],
    [1, (x) => x >= 32 && x <= 40.9],
    [0, () => true],
  ]);
}
function apacheNa(n) {
  return bandScore(n, [
    [4, (x) => x >= 180 || x <= 110],
    [3, (x) => (x >= 160 && x <= 179) || (x >= 111 && x <= 119)],
    [2, (x) => (x >= 155 && x <= 159) || (x >= 120 && x <= 129)],
    [1, (x) => x >= 150 && x <= 154],
    [0, () => true],
  ]);
}
function apacheK(k) {
  return bandScore(k, [
    [4, (x) => x >= 7 || x < 2.5],
    [3, (x) => x >= 6 && x <= 6.9],
    [2, (x) => x >= 2.5 && x <= 2.9],
    [1, (x) => (x >= 5.5 && x <= 5.9) || (x >= 3 && x <= 3.4)],
    [0, () => true],
  ]);
}
function apacheCr(c) {
  return bandScore(c, [
    [4, (x) => x >= 3.5],
    [3, (x) => x >= 2 && x <= 3.4],
    [2, (x) => x >= 1.5 && x <= 1.9],
    [0, () => true],
  ]);
}
function apacheHct(h) {
  return bandScore(h, [
    [4, (x) => x >= 60 || x < 20],
    [2, (x) => (x >= 50 && x <= 59.9) || (x >= 20 && x <= 29.9)],
    [1, (x) => x >= 46 && x <= 49.9],
    [0, () => true],
  ]);
}
function apacheWbc(w) {
  return bandScore(w, [
    [4, (x) => x >= 40 || x < 1],
    [2, (x) => (x >= 20 && x <= 39.9) || (x >= 1 && x <= 2.9)],
    [1, (x) => x >= 15 && x <= 19.9],
    [0, () => true],
  ]);
}
function apacheAge(a) {
  if (a >= 75) return 6;
  if (a >= 65) return 5;
  if (a >= 55) return 3;
  if (a >= 45) return 2;
  return 0;
}

/* ---- UI ---- */
const state = {
  filter: "全部",
  query: "",
  activeId: null,
  values: {},
};

const els = {
  search: document.getElementById("search"),
  filters: document.getElementById("filters"),
  list: document.getElementById("score-list"),
  hub: document.getElementById("hub-view"),
  calc: document.getElementById("calc-view"),
  back: document.getElementById("back-btn"),
  cat: document.getElementById("calc-cat"),
  title: document.getElementById("calc-title"),
  desc: document.getElementById("calc-desc"),
  form: document.getElementById("calc-form"),
  score: document.getElementById("result-score"),
  detail: document.getElementById("result-detail"),
  note: document.getElementById("result-note"),
};

function filteredScores() {
  const q = state.query.trim().toLowerCase();
  return SCORES.filter((s) => {
    if (state.filter !== "全部" && s.category !== state.filter) return false;
    if (!q) return true;
    const blob = `${s.name} ${s.nameZh} ${s.category} ${s.blurb}`.toLowerCase();
    return blob.includes(q);
  });
}

function renderFilters() {
  els.filters.innerHTML = CATEGORIES.map(
    (c) => `<button type="button" class="chip ${state.filter === c ? "is-on" : ""}" data-filter="${c}">${c}</button>`
  ).join("");
}

function renderList() {
  const items = filteredScores();
  els.list.innerHTML = items
    .map(
      (s) => `
      <li>
        <button type="button" class="score-card" data-open="${s.id}">
          <span class="score-card__name">${s.name}</span>
          <span class="score-card__zh">${s.nameZh}</span>
          <span class="score-card__cat">${s.category}</span>
        </button>
      </li>`
    )
    .join("");
}

function openScore(id) {
  const score = SCORES.find((s) => s.id === id);
  if (!score) return;
  state.activeId = id;
  state.values = {};
  els.hub.hidden = true;
  els.calc.hidden = false;
  els.cat.textContent = score.category;
  els.title.textContent = `${score.name} · ${score.nameZh}`;
  els.desc.textContent = score.blurb;
  els.form.innerHTML = score.fields
    .map((field) => {
      if (field.type === "number") {
        return `
          <div class="field">
            <label class="field__label" for="f-${field.key}">${field.label}</label>
            ${field.hint ? `<span class="field__hint">${field.hint}</span>` : ""}
            <input id="f-${field.key}" name="${field.key}" type="number" inputmode="decimal"
              ${field.min != null ? `min="${field.min}"` : ""}
              ${field.max != null ? `max="${field.max}"` : ""}
              step="${field.step ?? "any"}" />
          </div>`;
      }
      return `
        <fieldset class="field">
          <legend class="field__label">${field.label}</legend>
          ${field.hint ? `<span class="field__hint">${field.hint}</span>` : ""}
          <div class="choices">
            ${field.options
              .map(
                (o) => `
              <label class="choice">
                <input type="radio" name="${field.key}" value="${o.value}" />
                <span class="choice__text"><strong>${o.title}</strong>${o.desc ? `<span>${o.desc}</span>` : ""}</span>
              </label>`
              )
              .join("")}
          </div>
        </fieldset>`;
    })
    .join("");
  updateResult();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function closeScore() {
  state.activeId = null;
  els.calc.hidden = true;
  els.hub.hidden = false;
}

function readForm() {
  const score = SCORES.find((s) => s.id === state.activeId);
  if (!score) return {};
  const values = {};
  for (const field of score.fields) {
    if (field.type === "number") {
      const input = els.form.querySelector(`[name="${field.key}"]`);
      values[field.key] = input ? input.value : "";
    } else {
      const checked = els.form.querySelector(`input[name="${field.key}"]:checked`);
      values[field.key] = checked ? checked.value : "";
    }
  }
  return values;
}

function updateResult() {
  const score = SCORES.find((s) => s.id === state.activeId);
  if (!score) return;
  const result = score.compute(readForm());
  if (!result) {
    els.score.textContent = "—";
    els.detail.textContent = "請完成上方選項";
    els.note.textContent = "";
    return;
  }
  els.score.textContent = result.score;
  els.detail.textContent = result.detail || "";
  els.note.textContent = result.note || "";
}

function boot() {
  renderFilters();
  renderList();

  els.search.addEventListener("input", () => {
    state.query = els.search.value;
    renderList();
  });

  els.filters.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-filter]");
    if (!btn) return;
    state.filter = btn.dataset.filter;
    renderFilters();
    renderList();
  });

  els.list.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-open]");
    if (!btn) return;
    openScore(btn.dataset.open);
  });

  els.back.addEventListener("click", closeScore);
  els.form.addEventListener("input", updateResult);
  els.form.addEventListener("change", updateResult);

  const hash = location.hash.replace(/^#/, "");
  if (hash && SCORES.some((s) => s.id === hash)) openScore(hash);
}

boot();
