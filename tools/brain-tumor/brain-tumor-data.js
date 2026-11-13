window.BRAIN_TUMOR = {
  meta: {
    title: "WHO CNS5 腦腫瘤分類",
    source: "Louis DN et al. Neuro Oncol. 2021;23(8):1231–1251.",
    doi: "10.1093/neuonc/noab106",
    note: "2021 WHO Classification of Tumors of the CNS（第 5 版）摘要整理；僅供臨床快速參考。",
  },

  pearls: [
    {
      title: "分級寫法",
      body: "改用阿拉伯數字（CNS WHO grade 1–4），且「在同一 type 內」分級，不再跨不同 entity 共用同一套羅馬數字。",
    },
    {
      title: "整合診斷",
      body: "建議 layered report：Integrated diagnosis → Histological diagnosis → CNS WHO grade → Molecular information。",
    },
    {
      title: "NOS vs NEC",
      body: "NOS：必要資訊（常是分子）尚未取得或失敗。NEC：已完整檢查，但結果不符合標準 WHO 診斷。",
    },
    {
      title: "分子可決定分級",
      body: "例如 IDH-mutant astrocytoma 的 CDKN2A/B homozygous deletion；IDH-wildtype diffuse glioma 的 TERT / EGFR / +7/−10 可升級為 GBM grade 4。",
    },
  ],

  algorithms: [
    {
      id: "adult-diffuse",
      title: "成人瀰漫性神經膠質瘤",
      steps: [
        "先分 IDH 狀態（IHC R132H ± sequencing）。",
        "IDH-mutant → 查 1p/19q：codeleted＝Oligodendroglioma；非 codeleted＝Astrocytoma, IDH-mutant。",
        "Astrocytoma, IDH-mutant：grade 2–4；有 CDKN2A/B homozygous deletion 視為 grade 4（即使組織學未達）。",
        "IDH-wildtype adult diffuse glioma：若有 microvascular proliferation／necrosis，或分子特徵（TERT promoter mutation、EGFR amplification、+7/−10）→ Glioblastoma, IDH-wildtype, CNS WHO grade 4。",
      ],
    },
    {
      id: "ped-hgg",
      title: "兒童型高惡性神經膠質瘤",
      steps: [
        "中線部位＋H3 K27 改變（含 K27M 或 EZHIP／H3K27me3 喪失等）→ Diffuse midline glioma, H3 K27-altered。",
        "大腦半球＋H3 G34 突變 → Diffuse hemispheric glioma, H3 G34-mutant（grade 4）。",
        "H3-wildtype 且 IDH-wildtype 的兒童高惡性 → Diffuse pediatric-type HGG（常需 methylome／PDGFRA、MYCN、EGFR）。",
        "嬰兒半球高惡性＋RTK fusion（NTRK／ALK／ROS／MET）→ Infant-type hemispheric glioma。",
      ],
    },
    {
      id: "ependymoma",
      title: "室管膜瘤（依部位＋分子）",
      steps: [
        "上幕：優先 ZFTA fusion（常併 RELA）或 YAP1 fusion；否則寫部位定義型／NOS。",
        "後顱窩：PFA vs PFB（methylome／H3K27me3 等）；可另標 CNS WHO grade 2 或 3。",
        "脊髓：注意 MYCN-amplified 亞型；另有 myxopapillary（現為 grade 2）與 subependymoma。",
        "不再單獨列出「anaplastic ependymoma」為獨立 type。",
      ],
    },
    {
      id: "medullo",
      title: "髓母細胞瘤",
      steps: [
        "分子分組為主：WNT-activated；SHH-activated（再分 TP53-wildtype／mutant）；non-WNT/non-SHH。",
        "組織學定義仍可寫（classic／desmoplastic-nodular／MBEN／large cell-anaplastic），但宜與分子整合。",
        "WNT：常 CTNNB1（或 APC）；SHH：PTCH1／SUFU／SMO／TP53／MYCN／GLI2；Group 3/4：MYC／MYCN／PRDM6 等。",
      ],
    },
  ],

  families: [
    {
      id: "adult-diffuse",
      name: "Adult-type diffuse gliomas",
      nameZh: "成人型瀰漫性神經膠質瘤",
      group: "glioma",
      tumors: [
        {
          name: "Astrocytoma, IDH-mutant",
          grades: "2, 3, 4",
          molecular: "IDH1/2, ATRX, TP53, CDKN2A/B",
          note: "CDKN2A/B homozygous deletion → grade 4",
        },
        {
          name: "Oligodendroglioma, IDH-mutant and 1p/19q-codeleted",
          grades: "2, 3",
          molecular: "IDH1/2, 1p/19q, TERT promoter, CIC, FUBP1, NOTCH1",
        },
        {
          name: "Glioblastoma, IDH-wildtype",
          grades: "4",
          molecular: "IDH-wildtype；TERT promoter / EGFR amp / +7/−10",
          note: "即使組織學低惡性，符合分子特徵仍可診斷 GBM",
        },
      ],
    },
    {
      id: "ped-lgg",
      name: "Pediatric-type diffuse low-grade gliomas",
      nameZh: "兒童型瀰漫性低惡性神經膠質瘤",
      group: "glioma",
      tumors: [
        {
          name: "Diffuse astrocytoma, MYB- or MYBL1-altered",
          grades: "1",
          molecular: "MYB, MYBL1",
        },
        {
          name: "Angiocentric glioma",
          grades: "1",
          molecular: "MYB",
        },
        {
          name: "Polymorphous low-grade neuroepithelial tumor of the young (PLNTY)",
          grades: "1",
          molecular: "BRAF, FGFR family",
        },
        {
          name: "Diffuse low-grade glioma, MAPK pathway-altered",
          grades: "—",
          molecular: "FGFR1, BRAF",
        },
      ],
    },
    {
      id: "ped-hgg",
      name: "Pediatric-type diffuse high-grade gliomas",
      nameZh: "兒童型瀰漫性高惡性神經膠質瘤",
      group: "glioma",
      tumors: [
        {
          name: "Diffuse midline glioma, H3 K27-altered",
          grades: "4",
          molecular: "H3 K27, TP53, ACVR1, PDGFRA, EGFR, EZHIP",
        },
        {
          name: "Diffuse hemispheric glioma, H3 G34-mutant",
          grades: "4",
          molecular: "H3 G34, TP53, ATRX",
        },
        {
          name: "Diffuse pediatric-type high-grade glioma, H3- and IDH-wildtype",
          grades: "4",
          molecular: "PDGFRA, MYCN, EGFR；常靠 methylome",
        },
        {
          name: "Infant-type hemispheric glioma",
          grades: "—",
          molecular: "NTRK family, ALK, ROS1, MET fusions",
        },
      ],
    },
    {
      id: "circumscribed",
      name: "Circumscribed astrocytic gliomas",
      nameZh: "限界性星狀細胞腫瘤",
      group: "glioma",
      tumors: [
        {
          name: "Pilocytic astrocytoma",
          grades: "1",
          molecular: "KIAA1549-BRAF, BRAF, NF1",
        },
        {
          name: "High-grade astrocytoma with piloid features",
          grades: "—",
          molecular: "BRAF, NF1, ATRX, CDKN2A/B（methylome）",
        },
        {
          name: "Pleomorphic xanthoastrocytoma",
          grades: "2, 3",
          molecular: "BRAF, CDKN2A/B",
        },
        {
          name: "Subependymal giant cell astrocytoma",
          grades: "1",
          molecular: "TSC1, TSC2",
        },
        {
          name: "Chordoid glioma",
          grades: "2",
          molecular: "PRKCA",
        },
        {
          name: "Astroblastoma, MN1-altered",
          grades: "—",
          molecular: "MN1",
        },
      ],
    },
    {
      id: "glioneuronal",
      name: "Glioneuronal and neuronal tumors",
      nameZh: "神經膠質神經元／神經元腫瘤",
      group: "glioma",
      tumors: [
        { name: "Ganglioglioma", molecular: "BRAF" },
        { name: "Desmoplastic infantile ganglioglioma / astrocytoma" },
        { name: "Dysembryoplastic neuroepithelial tumor", molecular: "FGFR1" },
        {
          name: "Diffuse glioneuronal tumor with oligodendroglioma-like features and nuclear clusters (DGONC)",
          molecular: "Chromosome 14；（methylome）",
          provisional: true,
        },
        { name: "Papillary glioneuronal tumor", molecular: "PRKCA" },
        { name: "Rosette-forming glioneuronal tumor", molecular: "FGFR1, PIK3CA, NF1" },
        { name: "Myxoid glioneuronal tumor", molecular: "PDGFRA" },
        {
          name: "Diffuse leptomeningeal glioneuronal tumor",
          molecular: "KIAA1549-BRAF, 1p；（methylome）",
        },
        { name: "Gangliocytoma" },
        {
          name: "Multinodular and vacuolating neuronal tumor",
          grades: "1",
          molecular: "MAPK pathway",
        },
        {
          name: "Dysplastic cerebellar gangliocytoma (Lhermitte-Duclos)",
          molecular: "PTEN",
        },
        { name: "Central neurocytoma" },
        {
          name: "Extraventricular neurocytoma",
          molecular: "FGFR1-TACC1；IDH-wildtype",
        },
        { name: "Cerebellar liponeurocytoma" },
      ],
    },
    {
      id: "ependymal",
      name: "Ependymal tumors",
      nameZh: "室管膜腫瘤",
      group: "glioma",
      tumors: [
        { name: "Supratentorial ependymoma", grades: "2, 3" },
        {
          name: "Supratentorial ependymoma, ZFTA fusion-positive",
          molecular: "ZFTA（常併 RELA／MAML2）",
        },
        {
          name: "Supratentorial ependymoma, YAP1 fusion-positive",
          molecular: "YAP1",
        },
        { name: "Posterior fossa ependymoma", grades: "2, 3" },
        {
          name: "Posterior fossa ependymoma, group PFA",
          molecular: "H3 K27me3 loss／EZHIP；（methylome）",
        },
        {
          name: "Posterior fossa ependymoma, group PFB",
          molecular: "methylome",
        },
        { name: "Spinal ependymoma", molecular: "NF2" },
        {
          name: "Spinal ependymoma, MYCN-amplified",
          molecular: "MYCN",
        },
        {
          name: "Myxopapillary ependymoma",
          grades: "2",
          note: "由 grade 1 上調為 2",
        },
        { name: "Subependymoma", grades: "1" },
      ],
    },
    {
      id: "choroid",
      name: "Choroid plexus tumors",
      nameZh: "脈絡叢腫瘤",
      group: "other",
      tumors: [
        { name: "Choroid plexus papilloma", grades: "1" },
        { name: "Atypical choroid plexus papilloma", grades: "2" },
        { name: "Choroid plexus carcinoma", grades: "3" },
      ],
    },
    {
      id: "embryonal",
      name: "Embryonal tumors",
      nameZh: "胚胎性腫瘤",
      group: "embryonal",
      tumors: [
        {
          name: "Medulloblastoma, WNT-activated",
          molecular: "CTNNB1, APC",
        },
        {
          name: "Medulloblastoma, SHH-activated and TP53-wildtype",
          molecular: "PTCH1, SUFU, SMO, MYCN, GLI2",
        },
        {
          name: "Medulloblastoma, SHH-activated and TP53-mutant",
          molecular: "TP53 ± PTCH1／SUFU／SMO／MYCN／GLI2",
        },
        {
          name: "Medulloblastoma, non-WNT/non-SHH",
          molecular: "MYC, MYCN, PRDM6, KDM6A；（methylome）",
        },
        {
          name: "Medulloblastoma, histologically defined",
          note: "classic / DN / MBEN / LCA",
        },
        {
          name: "Atypical teratoid/rhabdoid tumor",
          molecular: "SMARCB1, SMARCA4",
        },
        {
          name: "Cribriform neuroepithelial tumor",
          provisional: true,
        },
        {
          name: "Embryonal tumor with multilayered rosettes",
          molecular: "C19MC, DICER1",
        },
        {
          name: "CNS neuroblastoma, FOXR2-activated",
          molecular: "FOXR2",
        },
        {
          name: "CNS tumor with BCOR internal tandem duplication",
          molecular: "BCOR ITD",
        },
        { name: "CNS embryonal tumor", note: "無法更精確分類時使用" },
      ],
    },
    {
      id: "pineal",
      name: "Pineal tumors",
      nameZh: "松果體腫瘤",
      group: "other",
      tumors: [
        { name: "Pineocytoma" },
        { name: "Pineal parenchymal tumor of intermediate differentiation" },
        { name: "Pineoblastoma", note: "含多個分子亞型（如 miRNA processing）" },
        { name: "Papillary tumor of the pineal region" },
        {
          name: "Desmoplastic myxoid tumor of the pineal region, SMARCB1-mutant",
          molecular: "SMARCB1",
        },
      ],
    },
    {
      id: "nerve",
      name: "Cranial and paraspinal nerve tumors",
      nameZh: "顱神經／脊神經腫瘤",
      group: "other",
      tumors: [
        { name: "Schwannoma" },
        { name: "Neurofibroma" },
        { name: "Perineurioma" },
        { name: "Hybrid nerve sheath tumor" },
        { name: "Malignant melanotic nerve sheath tumor" },
        { name: "Malignant peripheral nerve sheath tumor" },
        { name: "Paraganglioma" },
      ],
    },
    {
      id: "meningioma",
      name: "Meningiomas",
      nameZh: "腦膜瘤",
      group: "meningeal",
      tumors: [
        {
          name: "Meningioma",
          grades: "1, 2, 3",
          molecular:
            "NF2, AKT1, TRAF7, SMO, PIK3CA；亞型相關 KLF4, SMARCE1, BAP1；grade 3 相關 TERT promoter, CDKN2A/B；H3K27me3",
          note: "單一 type，依組織亞型與分子再分級",
        },
      ],
    },
    {
      id: "mesenchymal",
      name: "Mesenchymal, non-meningothelial tumors",
      nameZh: "間葉性非腦膜腫瘤（節選）",
      group: "other",
      tumors: [
        { name: "Solitary fibrous tumor", grades: "1, 2, 3", molecular: "NAB2-STAT6" },
        { name: "Hemangioblastoma" },
        {
          name: "Intracranial mesenchymal tumor, FET-CREB fusion-positive",
          molecular: "FET-CREB",
        },
        { name: "CIC-rearranged sarcoma", molecular: "CIC" },
        {
          name: "Primary intracranial sarcoma, DICER1-mutant",
          molecular: "DICER1",
        },
        { name: "Ewing sarcoma" },
        { name: "Mesenchymal chondrosarcoma / Chondrosarcoma" },
        { name: "Chordoma（含 poorly differentiated）" },
      ],
    },
    {
      id: "melanocytic",
      name: "Melanocytic tumors",
      nameZh: "黑色素細胞腫瘤",
      group: "other",
      tumors: [
        {
          name: "Meningeal melanocytosis / melanomatosis",
          molecular: "NRAS（diffuse）",
        },
        {
          name: "Meningeal melanocytoma / melanoma",
          molecular: "GNAQ, GNA11, PLCB4, CYSLTR2",
        },
      ],
    },
    {
      id: "hematolymphoid",
      name: "Hematolymphoid tumors",
      nameZh: "造血淋巴腫瘤（節選）",
      group: "other",
      tumors: [
        { name: "Primary diffuse large B-cell lymphoma of the CNS" },
        { name: "Immunodeficiency-associated CNS lymphoma" },
        { name: "Intravascular large B-cell lymphoma" },
        { name: "MALT lymphoma of the dura" },
        { name: "Erdheim-Chester / Rosai-Dorfman / LCH / JXG / histiocytic sarcoma" },
      ],
    },
    {
      id: "germ",
      name: "Germ cell tumors",
      nameZh: "生殖細胞腫瘤",
      group: "other",
      tumors: [
        { name: "Germinoma" },
        { name: "Mature / Immature teratoma" },
        { name: "Embryonal carcinoma / Yolk sac tumor / Choriocarcinoma" },
        { name: "Mixed germ cell tumor" },
      ],
    },
    {
      id: "sellar",
      name: "Tumors of the sellar region",
      nameZh: "鞍區腫瘤",
      group: "other",
      tumors: [
        { name: "Adamantinomatous craniopharyngioma" },
        { name: "Papillary craniopharyngioma" },
        {
          name: "Pituicytoma / granular cell tumor / spindle cell oncocytoma",
        },
        { name: "Pituitary adenoma / PitNET" },
        { name: "Pituitary blastoma" },
      ],
    },
    {
      id: "metastasis",
      name: "Metastases to the CNS",
      nameZh: "轉移瘤",
      group: "other",
      tumors: [
        { name: "Metastases to brain / spinal cord parenchyma" },
        { name: "Metastases to the meninges" },
      ],
    },
  ],

  markers: [
    { gene: "IDH1 / IDH2", role: "Adult diffuse glioma 分型起點；mutant vs wildtype" },
    { gene: "1p/19q codeletion", role: "Oligodendroglioma 必要條件（搭配 IDH-mutant）" },
    { gene: "ATRX / TP53", role: "常見於 IDH-mutant astrocytoma；G34 glioma" },
    { gene: "CDKN2A/B homozygous deletion", role: "IDH-mutant astrocytoma → grade 4；meningioma grade 3 相關" },
    { gene: "TERT promoter", role: "GBM IDH-wildtype 分子標準之一；亦見於 oligodendroglioma、meningioma" },
    { gene: "EGFR amplification", role: "GBM IDH-wildtype 分子標準之一" },
    { gene: "+7 / −10", role: "GBM IDH-wildtype 分子標準之一" },
    { gene: "H3 K27 (K27M) / EZHIP / H3K27me3", role: "Diffuse midline glioma；後顱窩 ependymoma 分組輔助" },
    { gene: "H3 G34", role: "Diffuse hemispheric glioma, H3 G34-mutant" },
    { gene: "BRAF (V600E / KIAA1549-BRAF)", role: "PA、PXA、ganglioglioma、DLGNT、部分 ped LGG" },
    { gene: "FGFR1 / FGFR fusions", role: "MAPK-altered LGG、DNET、PLNTY、extraventricular neurocytoma" },
    { gene: "MYB / MYBL1", role: "Pediatric diffuse LGG／angiocentric glioma" },
    { gene: "NTRK / ALK / ROS1 / MET", role: "Infant-type hemispheric glioma" },
    { gene: "ZFTA (RELA) / YAP1", role: "Supratentorial ependymoma 分子型" },
    { gene: "MYCN", role: "Spinal ependymoma, MYCN-amplified；部分 medulloblastoma／ped HGG" },
    { gene: "CTNNB1 / APC", role: "Medulloblastoma, WNT-activated" },
    { gene: "PTCH1 / SUFU / SMO / GLI2", role: "Medulloblastoma, SHH-activated" },
    { gene: "SMARCB1 / SMARCA4", role: "AT/RT；松果體 desmoplastic myxoid tumor" },
    { gene: "C19MC / DICER1", role: "ETMR；DICER1 亦見 intracranial sarcoma" },
    { gene: "FOXR2", role: "CNS neuroblastoma, FOXR2-activated" },
    { gene: "BCOR ITD", role: "CNS tumor with BCOR internal tandem duplication" },
    { gene: "NF2 / AKT1 / TRAF7 / SMO / PIK3CA", role: "Meningioma 常見驅動基因" },
    { gene: "NAB2-STAT6", role: "Solitary fibrous tumor" },
    { gene: "DNA methylome profiling", role: "多種腫瘤分型／亞型（尤其 ependymoma、medullo、罕見胚胎性腫瘤）" },
  ],
};
