window.TBI_GUIDE = {
  meta: {
    title: "TBI Guidelines",
    source: "Brain Trauma Foundation — Coma Guidelines",
    url: "https://braintrauma.org/coma/guidelines-current",
    note: "整理自 BTF 現行 Coma Guidelines 頁面與各篇建議摘要；僅供臨床快速參考，細節請回原站／全文。",
  },

  thresholds: [
    { label: "成人 ICP", value: ">22 mmHg 治療", hint: "Severe TBI 4th" },
    { label: "成人 CPP", value: "60–70 mmHg", hint: "避免積極 >70" },
    { label: "兒童 ICP", value: "<20 mmHg", hint: "Pediatric 3rd" },
    { label: "兒童 CPP", value: "≥40（目標 40–50）", hint: "嬰幼兒偏低端" },
    { label: "院前 SpO₂", value: "≥90%（持續給氧）", hint: "Prehospital 3rd" },
    { label: "院前 SBP", value: "成人 ≥110", hint: "兒依年齡百分位" },
  ],

  guides: [
    {
      id: "severe",
      name: "Severe TBI 4th",
      nameZh: "成人嚴重 TBI 第 4 版",
      year: "2016",
      url: "https://braintrauma.org/coma/guidelines/severe-tbi",
      blurb: "加護／監測／閾值與治療建議主軸。",
    },
    {
      id: "dc2020",
      name: "DC Update 2020",
      nameZh: "減壓性顱骨切除更新",
      year: "2020",
      url: "https://braintrauma.org/coma/guidelines/severe-tbi-craniectomy",
      blurb: "依 RESCUEicp 等證據更新 secondary DC。",
    },
    {
      id: "pediatric",
      name: "Pediatric Severe 3rd",
      nameZh: "兒童嚴重 TBI 第 3 版",
      year: "2019",
      url: "https://braintrauma.org/coma/guidelines/pediatric",
      blurb: "兒童 ICP／CPP、HTS、DC 等。",
    },
    {
      id: "surgical",
      name: "Surgical Management",
      nameZh: "手術處置",
      year: "2006",
      url: "https://braintrauma.org/coma/guidelines/surgical",
      blurb: "EDH／SDH／實質／後顱窩／凹陷骨折適應症。",
    },
    {
      id: "prehospital",
      name: "Prehospital 3rd",
      nameZh: "院前處置第 3 版",
      year: "2023",
      url: "https://braintrauma.org/coma/guidelines/pre-hospital",
      blurb: "避免缺氧／低血壓、ETCO₂、轉送決策。",
    },
    {
      id: "penetrating",
      name: "Penetrating TBI 2nd",
      nameZh: "穿透性 TBI 第 2 版",
      year: "2025",
      url: "https://braintrauma.org/coma/guidelines/penetrating-tbi",
      blurb: "正式發表；ICP／CPP 多與 blunt 一致。",
    },
    {
      id: "prognosis",
      name: "Early Prognosis",
      nameZh: "早期預後指標",
      year: "2000",
      url: "https://braintrauma.org/coma/guidelines/prognosis",
      blurb: "GCS、年齡、瞳孔、低血壓、CT 特徵。",
    },
    {
      id: "eld",
      name: "External Lumbar Drainage",
      nameZh: "外腰椎引流回顧",
      year: "2024",
      url: "https://braintrauma.org/coma/guidelines/review-external-lumbar-drainage",
      blurb: "難治性 ICH 的 ELD systematic review。",
    },
    {
      id: "combat",
      name: "Combat Field",
      nameZh: "戰傷現場處置",
      year: "2005",
      url: "https://braintrauma.org/coma/guidelines/combat-related",
      blurb: "戰術環境：氧合、血壓、氣道、分流。",
    },
  ],

  topics: [
    /* —— Severe TBI 4th —— */
    {
      guide: "severe",
      cat: "治療",
      title: "減壓性顱骨切除（原 4th；見 2020 更新）",
      level: "II A",
      points: [
        "瀰漫性損傷、無 mass lesion、ICP>20 超過 15 min/hr、第一線無效：bifrontal DC 不建議用來改善 6 月 GOS-E；但可降 ICP、縮短 ICU。",
        "大範圍 frontotemporoparietal DC（≥12×15 cm 或直徑 15 cm）優於小骨窗，可降死亡、改善神經預後。",
      ],
    },
    {
      guide: "severe",
      cat: "治療",
      title: "預防性低溫",
      level: "II B",
      points: ["早期（<2.5 h）、短期（48 h）預防性低溫：不建議用於瀰漫性損傷以改善預後。"],
    },
    {
      guide: "severe",
      cat: "治療",
      title: "高滲透壓治療",
      level: "不足／沿用 3rd",
      points: [
        "現行標準下無足夠證據推薦特定高滲劑或劑量對臨床預後的效果。",
        "沿用 3rd（證據未達現行標準）：Mannitol 0.25–1 g/kg 可降 ICP；避免 SBP<90；未監測 ICP 前限用於疝徵或進行性惡化。",
      ],
    },
    {
      guide: "severe",
      cat: "治療",
      title: "CSF 引流",
      level: "III",
      points: [
        "EVD 歸零於 midbrain、持續引流，可能比間歇引流更能降低 ICP burden。",
        "傷後 12 h 內初始 GCS<6 者，可考慮以 CSF 引流降 ICP。",
      ],
    },
    {
      guide: "severe",
      cat: "治療",
      title: "通氣",
      level: "II B",
      points: [
        "長期預防性過度換氣（PaCO₂ ≤25）不建議。",
        "沿用：暫時性過度換氣可用於降 ICP；傷後 24 h 內（CBF 常偏低）應避免；若使用建議監測 SjO₂／PbtO₂。",
      ],
    },
    {
      guide: "severe",
      cat: "治療",
      title: "麻醉／鎮靜／Barbiturate",
      level: "II B",
      points: [
        "不以 barbiturate 誘發 burst suppression 做預防性抗顱內高壓。",
        "高劑量 barbiturate 可用於最大內科／外科仍難治的 ICP；需先維持血流動力穩定。",
        "Propofol 可用於控制 ICP，但不建議為了改善死亡率或 6 月預後；高劑量注意異丙酚輸注症候群等。",
      ],
    },
    {
      guide: "severe",
      cat: "治療",
      title: "類固醇",
      level: "I",
      points: ["不建議用類固醇改善預後或降 ICP；高劑量 methylprednisolone 增加死亡，禁忌。"],
    },
    {
      guide: "severe",
      cat: "支持",
      title: "營養",
      level: "II A / II B",
      points: [
        "最晚第 5–7 天達基礎熱量需求，可降死亡（II A）。",
        "經胃空腸餵食可降低 VAP（II B）。",
      ],
    },
    {
      guide: "severe",
      cat: "支持",
      title: "感染預防",
      level: "II A / III",
      points: [
        "早期氣切可縮短呼吸器天數（不一定降死亡或肺炎）。",
        "不建議 povidone-iodine 口腔護理防 VAP（可能增加 ARDS）。",
        "可考慮抗菌塗層導管降低 EVD 相關感染（III）。",
      ],
    },
    {
      guide: "severe",
      cat: "支持",
      title: "DVT 預防",
      level: "III",
      points: [
        "機械預防＋LMWH／低劑量 UFH 可考慮，但有 ICH 擴大風險。",
        "腦傷穩定且利大於弊時可加藥理預防；劑量／時機證據不足。",
      ],
    },
    {
      guide: "severe",
      cat: "支持",
      title: "癲癇預防",
      level: "II A",
      points: [
        "不建議預防性 phenytoin／valproate 防晚期 PTS。",
        "Phenytoin 可降低早期 PTS（7 天內）；早期 PTS 未證實惡化預後。",
        "目前證據不足推薦 LEV 優於 phenytoin。",
      ],
    },
    {
      guide: "severe",
      cat: "監測",
      title: "ICP 監測",
      level: "II B",
      points: [
        "依 ICP 資訊管理可降低住院內與傷後 2 週死亡。",
        "沿用指示（證據未達現行標準）：可救治、GCS 3–8＋異常 CT；或正常 CT 但 ≥2 項：年齡>40、姿勢異常、SBP<90。",
      ],
    },
    {
      guide: "severe",
      cat: "監測",
      title: "CPP 監測",
      level: "II B",
      points: ["依 guideline 基礎的 CPP 監測／管理，可降低 2 週死亡。"],
    },
    {
      guide: "severe",
      cat: "閾值",
      title: "血壓閾值",
      level: "III",
      points: [
        "可考慮維持 SBP：50–69 歲 ≥100；15–49 歲或 >70 歲 ≥110，以改善死亡／預後。",
      ],
    },
    {
      guide: "severe",
      cat: "閾值",
      title: "ICP 閾值",
      level: "II B / III",
      points: [
        "建議治療 ICP >22 mmHg（與死亡率相關）。",
        "決策可綜合 ICP、臨床與 CT（III）。",
      ],
    },
    {
      guide: "severe",
      cat: "閾值",
      title: "CPP 閾值",
      level: "II B / III",
      points: [
        "目標 CPP 60–70 mmHg；最低宜 60 或 70 視自動調節而定。",
        "避免以大量輸液／升壓劑積極維持 CPP>70（ARDS 風險）。",
      ],
    },
    {
      guide: "severe",
      cat: "監測",
      title: "進階腦監測",
      level: "III",
      points: [
        "可考慮 jugular AVDO₂ 輔助決策，改善 3／6 月預後。",
        "避免 jugular venous saturation <50%。",
      ],
    },

    /* —— DC 2020 —— */
    {
      guide: "dc2020",
      cat: "手術",
      title: "Secondary DC（2020 更新）",
      level: "II A",
      points: [
        "晚期難治性 ICP 升高：secondary DC 建議，可改善死亡與良好預後。",
        "早期難治性 ICP 升高：secondary DC 不建議用來改善死亡／良好預後。",
        "仍建議大骨窗 FTP DC（≥12×15 cm 或直徑 15 cm）。",
        "無論早／晚期難治 ICP，DC 可建議用來降 ICP、縮短 ICU，但與良好預後關係不明。",
      ],
    },

    /* —— Pediatric —— */
    {
      guide: "pediatric",
      cat: "監測",
      title: "ICP／神經影像／PbtO₂",
      level: "III",
      points: [
        "建議使用 ICP 監測。",
        "若用 PbtO₂，建議維持 >10 mmHg（是否常規使用證據不足）。",
        "不能僅因傷後 0–6 h 正常 CT 排除高 ICP。",
        "入院與初次追蹤後 >24 h 不建議常規重做 CT 決定手術，除非惡化或 ICP 上升。",
      ],
    },
    {
      guide: "pediatric",
      cat: "閾值",
      title: "ICP／CPP 閾值",
      level: "III",
      points: [
        "ICP 目標 <20 mmHg。",
        "CPP 至少 40；建議目標 40–50（嬰幼兒偏低、青少年偏高）。",
      ],
    },
    {
      guide: "pediatric",
      cat: "治療",
      title: "高張鹽水",
      level: "II / III",
      points: [
        "Bolus 3% HTS 建議用於顱內高壓：2–5 mL/kg，10–20 min（II）。",
        "持續 3% 0.1–1.0 mL/kg/h 可考慮；用最低劑量維持 ICP<20（III）。",
        "難治 ICP 可考慮 23.4% bolus 0.5 mL/kg（上限 30 mL）。",
        "避免持續 >72 h Na>170（血小板減少／貧血）；>160 注意 DVT。Mannitol 常用但無符合納入標準研究。",
      ],
    },
    {
      guide: "pediatric",
      cat: "治療",
      title: "鎮靜／CSF／癲癇／通氣",
      level: "III",
      points: [
        "ICP 危象時避免 bolus midazolam／fentanyl（低灌流風險）。",
        "不建議長時間持續 propofol 輸注。",
        "EVD CSF 引流可考慮降 ICP。",
        "建議預防早期 PTS（7 天內）；LEV vs phenytoin 證據不足。",
        "傷後 48 h 內不建議預防性嚴重過度換氣（PaCO₂<30）；若用於難治高壓，建議進階缺血評估。",
      ],
    },
    {
      guide: "pediatric",
      cat: "治療",
      title: "體溫／Barbiturate／DC／營養／類固醇",
      level: "II / III",
      points: [
        "預防性中度低溫（32–33°C）不建議優於常溫以改善整體預後（II）；可用於控制 ICP（III）。回溫 0.5–1.0°C／12–24 h 或更慢。",
        "血流動力穩定者，難治高壓可考慮高劑量 barbiturate；需持續動脈壓監測與 CPP 支持。",
        "神經惡化、疝出或內科難治高壓：可考慮 DC。",
        "72 h 內開始腸道營養；不建議免疫調節飲食。",
        "不建議類固醇改善預後或降 ICP（置換治療除外）。",
      ],
    },

    /* —— Surgical —— */
    {
      guide: "surgical",
      cat: "手術",
      title: "急性硬腦膜外血腫（EDH）",
      level: "手術適應",
      points: [
        "體積 >30 cm³：不論 GCS，手術清除。",
        "<30 cm³、厚度 <15 mm、MLS <5 mm、GCS>8 且無病灶徵：可非手術，需可重複 CT＋密切觀察。",
        "昏迷（GCS<9）＋瞳孔不等：盡快手術。",
      ],
    },
    {
      guide: "surgical",
      cat: "手術",
      title: "急性硬腦膜下血腫（SDH）",
      level: "手術適應",
      points: [
        "厚度 >10 mm 或 MLS >5 mm：不論 GCS，手術。",
        "昏迷（GCS<9）皆應 ICP 監測。",
        "昏迷且厚度 <10 mm、MLS <5 mm：若傷後至入院 GCS 降 ≥2、瞳孔不對稱／固定散大、或 ICP>20 → 手術。",
        "有適應症應盡快；昏迷者以 craniotomy ± 去骨瓣＋硬腦膜成形。",
      ],
    },
    {
      guide: "surgical",
      cat: "手術",
      title: "創傷性實質病灶",
      level: "手術適應",
      points: [
        "進行性神經惡化、藥物難治高壓、或 CT 有明顯質量效應 → 手術。",
        "GCS 6–8＋額／顳挫傷 >20 cm³ 且 MLS≥5 mm 及／或基底池受壓；或任何病灶 >50 cm³ → 手術。",
        "無神經妥協、ICP 可控、無明顯質量效應 → 可嚴密監測＋系列影像。",
        "瀰漫水腫難治高壓：48 h 內 bifrontal DC 可為選項；次顳減壓／顳葉切除／半球 DC 亦為選項。",
      ],
    },
    {
      guide: "surgical",
      cat: "手術",
      title: "後顱窩質量效應",
      level: "手術適應",
      points: [
        "CT 質量效應（第四腦室變形／基底池受壓／阻塞性水腦）或相關神經障礙／惡化 → 手術；宜盡快。",
        "主要術式：枕下減壓性切除（suboccipital craniectomy）。",
      ],
    },
    {
      guide: "surgical",
      cat: "手術",
      title: "凹陷顱骨骨折",
      level: "手術適應",
      points: [
        "開放性凹陷超過顱骨厚度：手術以預防感染。",
        "無硬腦膜穿透、無顯著血腫、凹陷 ≤1 cm、無額竇／明顯美容／感染／氣顱／嚴重污染等，可考慮非手術。",
        "閉合性凹陷骨折可非手術。早期清創抬高；無感染時可考慮骨片回置；開放性皆應抗生素。",
      ],
    },

    /* —— Prehospital —— */
    {
      guide: "prehospital",
      cat: "評估",
      title: "氧合／血壓／體溫／通氣",
      level: "Strong／Weak",
      points: [
        "監測缺氧（SpO₂<90）、低血壓（SBP<100）、高血壓（≥150）、過度換氣、體溫異常（Strong）。",
        "成人 SBP 目標 ≥110（Weak；最佳可能更高）。",
        "兒科 SBP 約：≤28 天 >70；1–12 月 >84；1–5 歲 >90；≥6 歲 >100。",
        "持續 SpO₂，維持 >90%；懷疑中重度 TBI 即持續給氧（Strong）。",
        "ETCO₂ 目標 35–45；維持常溫約 36–37°C。",
      ],
    },
    {
      guide: "prehospital",
      cat: "評估",
      title: "GCS／瞳孔",
      level: "Strong",
      points: [
        ">2 歲用標準 GCS；前語言期用 P-GCS。",
        "每 30 min 或意識改變時重測；ABC 復甦後、鎮靜／麻痺前（或代謝後）測量。",
        "瞳孔：記錄外傷、左右差（>1 mm）、固定（對光 <1 mm）、散大；傳至接收醫院。",
      ],
    },
    {
      guide: "prehospital",
      cat: "治療",
      title: "氣道與通氣",
      level: "Strong",
      points: [
        "懷疑嚴重 TBI：持續鼻導管／面罩給氧。",
        "缺氧逐步處理：擺位 → BVM±輔助氣道 → 聲門上／插管（經訓練者）。",
        "GCS<9 或無法維持氣道／氧合 → 建立氣道。",
        "插管後確認位置（聽診、ETCO₂／capnography）；約 10 次／分，避免 ETCO₂<35。",
      ],
    },
    {
      guide: "prehospital",
      cat: "治療",
      title: "疝出徵象／高滲／TXA／輸液",
      level: "Strong／Weak",
      points: [
        "無活動性腦疝徵象：避免過度換氣；目標 ETCO₂ 約 35–40。",
        "活動性／即將疝出：過度換氣目標 ETCO₂ 30–35。",
        "院前不建議預防性高滲劑（Weak）；TXA 一般不廣泛用於預防 ICH／高 ICP（Strong；系統可另訂）。",
        "低血壓盡快以血品及／或等張液糾正；GCS<8 疑高 ICP 可考慮高張液（Weak）。",
      ],
    },
    {
      guide: "prehospital",
      cat: "轉送",
      title: "轉送決策",
      level: "Strong",
      points: [
        "中重度 TBI 宜直接送至可立即 CT、神經外科、ICP 監測／治療的機構。",
        "兒童優先兒科創傷中心或具兒科資格之成人中心。",
        "運送方式以縮短至決定性處置時間為準。",
      ],
    },

    /* —— Penetrating —— */
    {
      guide: "penetrating",
      cat: "監測",
      title: "穿透性 TBI：ICP／CPP（摘要）",
      level: "III / IV / Consensus",
      points: [
        "成人與兒童嚴重 pTBI：建議 ICP 監測以降低死亡（可能延長 ICU）。",
        "ICP 維持 <22 mmHg（與 blunt 第 4 版一致）。",
        "CPP：成人依 4th（60–70）；兒童依 pediatric 3rd（約 40–50，依年齡）。",
        "ICP 監測有助發現擴張中的顱內病灶（專家共識）。完整章節見原站／tbiguidelines。",
      ],
    },

    /* —— Prognosis —— */
    {
      guide: "prognosis",
      cat: "預後",
      title: "早期預後指標",
      level: "Class I 特徵",
      points: [
        "GCS：復甦後測量；分數越低，不良預後機率逐步上升。",
        "年齡：越高，不良預後機率越高。",
        "雙側對光反射消失：不良預後高 PPV；散大建議 >4 mm；固定＝對光 <1 mm。",
        "SBP<90：不良預後 PPV约 67%；合併缺氧約 79%。",
        "CT（傷後 12 h 內）：異常、壓縮／消失基底池、tSAH（尤其基底池）等高相關。",
      ],
    },

    /* —— ELD —— */
    {
      guide: "eld",
      cat: "回顧",
      title: "外腰椎引流（ELD）meta-analysis",
      level: "證據等級不一",
      points: [
        "難治創傷性顱內高壓：ELD 可立即顯著降 ICP（合併效應約 −19.5 mmHg）。",
        "24 h 內持續效果、疝出／腦膜炎風險：低等級證據顯示相對可行。",
        "神經預後證據極低。高度選擇病例（基底池開放、無大灶血腫）值得高品質研究；理想條件未定。",
      ],
    },

    /* —— Combat —— */
    {
      guide: "combat",
      cat: "現場",
      title: "戰傷現場：氧合／血壓／氣道",
      level: "Guideline／Option",
      points: [
        "盡量避免缺氧與低血壓；SaO₂≥90；SBP<90 時在戰術允許下補液。",
        "例行預防性過度換氣不建議；僅在明確疝出徵象時短暫使用（成人约 20 次／分），徵象改善即停。",
        "高張鹽水 <500 mL 可用於低血容量；之後等張／膠體。",
        "穿透傷建議預防性廣效抗生素。GCS／瞳孔在各梯次重複評估；爆炸／化學傷可致虹膜麻痺，勿單憑散大認定疝出。",
      ],
    },
  ],
};
