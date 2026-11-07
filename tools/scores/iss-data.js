/**
 * AIS detailed items for ISS, adapted from Taiwan trauma ISS reference
 * (運用創傷嚴重程度分數評估創傷嚴重程度).
 * value = AIS score for that injury description.
 */
window.ISS_REGIONS = [
  {
    key: "head",
    label: "頭頸部 Head / Neck",
    hint: "同區只取最高 AIS。有 # 者若伴隨非頭部外傷神經缺損，AIS +1。",
    groups: [
      {
        name: "無損傷",
        options: [{ value: 0, title: "0", desc: "無頭頸部損傷" }],
      },
      {
        name: "軟組織",
        options: [
          { value: 1, title: "1", desc: "頭皮撕裂傷 <10cm 或 <100 cm²" },
          { value: 2, title: "2", desc: "頭皮撕裂傷 >10cm 或 >100 cm²" },
          { value: 3, title: "3", desc: "頭皮撕裂傷及超過 20% 血液流失" },
          { value: 4, title: "4", desc: "凹陷性顱骨骨折 >2cm" },
          { value: 5, title: "5", desc: "頭顱穿刺傷 >2cm 深" },
        ],
      },
      {
        name: "頭骨",
        options: [
          { value: 2, title: "2", desc: "單純頭蓋骨骨折" },
          { value: 3, title: "3", desc: "頭顱穿刺傷 <2cm 深；顱底骨折；粉碎／複雜／凹陷性顱骨骨折" },
        ],
      },
      {
        name: "頸椎／脊髓",
        options: [
          { value: 1, title: "1", desc: "頸椎損傷但無骨折或脫位" },
          { value: 2, title: "2", desc: "頸椎 spinous/transverse process 脫位或骨折；輕度壓迫性骨折 <20%" },
          { value: 3, title: "3", desc: "頸椎壓迫性骨折 >20%；柱挫傷；lamina/body/pedicle/facet 脫位或骨折；椎間盤突出合併神經症狀" },
          { value: 4, title: "4", desc: "頸脊髓不完全神經損傷；頸脊脊髓壓迫" },
          { value: 5, title: "5", desc: "頸脊柱撕裂傷；C4 或其下頸脊髓完全損傷" },
        ],
      },
      {
        name: "腦部",
        options: [
          { value: 1, title: "1", desc: "頭痛或二度眩暈但無意識喪失；腦神經根損傷" },
          { value: 2, title: "2", desc: "健忘／嗜睡／僵鈍但對聲音有反應；無意識 <1h；氣腦；臂神經叢損傷；大腦挫傷 <30cc（直徑 <4cm 或中線偏移 <5mm）；小腦挫傷 <15cc（直徑 <3cm）；SAH；輕度腦水腫" },
          { value: 3, title: "3", desc: "無意識 1–6h；無意識 <1h 並伴隨神經缺損；硬膜破損或部分腦組織喪失；硬腦膜上／下出血 <50cc 且 <1cm 厚；腦內出血 <30cc；腦室內出血；中度腦水腫；小腦挫傷 15–30cc；大腦挫傷 30–50cc 或中線偏移 >5mm" },
          { value: 4, title: "4", desc: "無意識 1–6h 並伴隨神經缺損；無意識 6–24h；只對疼痛有反應；硬膜撕裂或部分腦組織喪失；硬膜上／下出血 >50cc；腦內出血 >30cc；嚴重腦水腫；DAI；腦幹損傷" },
          { value: 5, title: "5", desc: "無意識 >24h；大腦挫傷 >50cc；小腦挫傷 >30cc" },
        ],
      },
      {
        name: "血管／其他",
        options: [
          { value: 1, title: "1", desc: "輕度外頸靜脈撕裂傷" },
          { value: 2, title: "2", desc: "外頸動脈／脊椎動脈# 輕微撕裂／內膜撕裂／栓塞；內頸靜脈輕微撕裂；甲狀腺挫傷；喉管輕微撕裂／挫傷" },
          { value: 3, title: "3", desc: "總頸／內頸動脈# 輕微撕裂／內膜裂開／栓塞；外頸／脊椎動脈#／頸靜脈嚴重撕裂；甲狀腺撕裂；咽挫傷／輕微撕裂；喉管破裂" },
          { value: 4, title: "4", desc: "總頸／內頸動脈# 嚴重撕裂傷；咽破裂；嚴重咽喉破損" },
        ],
      },
      {
        name: "AIS 6（ISS=75）",
        options: [
          { value: 6, title: "6", desc: "顱骨及腦組織嚴重破壞；腦幹嚴重損傷；斷頭；C3 或其上頸脊髓損傷" },
        ],
      },
    ],
  },
  {
    key: "face",
    label: "臉 Face",
    hint: "有 * 之骨折若為開放／移位／粉碎，AIS +1。",
    groups: [
      {
        name: "無損傷",
        options: [{ value: 0, title: "0", desc: "無顏面損傷" }],
      },
      {
        name: "軟組織",
        options: [
          { value: 1, title: "1", desc: "撕裂傷 <10cm 或 <25 cm²" },
          { value: 2, title: "2", desc: "撕裂傷 >10cm 或 >25 cm²" },
          { value: 3, title: "3", desc: "撕裂傷合併全身超過 20% 血液流失" },
        ],
      },
      {
        name: "臉骨",
        options: [
          { value: 1, title: "1", desc: "鼻骨、下頷骨* 骨折" },
          { value: 2, title: "2", desc: "顴骨、眼窩骨* 骨折；LeFort I、II" },
          { value: 3, title: "3", desc: "LeFort III 骨折" },
          { value: 4, title: "4", desc: "LeFort III 合併全身超過 20% 血液流失" },
        ],
      },
      {
        name: "其他",
        options: [
          { value: 1, title: "1", desc: "眼睛、耳朵、表淺舌撕裂傷；牙齒斷裂或脫位" },
          { value: 2, title: "2", desc: "舌深部撕裂傷；眼球破裂；視網膜剝離" },
          { value: 3, title: "3", desc: "視神經撕裂" },
        ],
      },
    ],
  },
  {
    key: "chest",
    label: "胸部 Chest / Thorax",
    hint: "有 $ 之肺損傷若合併出血>20%、嚴重漏氣或空氣栓塞，AIS +1。",
    groups: [
      {
        name: "無損傷",
        options: [{ value: 0, title: "0", desc: "無胸部損傷" }],
      },
      {
        name: "軟組織／胸壁",
        options: [
          { value: 1, title: "1", desc: "胸脊椎肌肉拉傷；胸壁／胸骨挫傷；一根肋骨骨折" },
          { value: 2, title: "2", desc: "胸骨骨折；二至三根肋骨骨折" },
          { value: 3, title: "3", desc: "撕裂傷合併全身>20% 血液流失；氣胸；血胸；氣／血縱隔；一側肋骨骨折>4 根；連枷胸無肺挫傷；單側肺挫傷或撕裂傷$" },
          { value: 4, title: "4", desc: "開放性氣胸；雙側血氣胸；一側肋骨>4 根合併血氣胸；兩側肋骨皆>4 根；連枷胸合併肺挫傷；兩側肺挫傷或撕裂傷$" },
          { value: 5, title: "5", desc: "張力性氣胸；兩側肋骨>4 根合併血氣胸；兩側連枷胸或 <15 歲合併連枷胸" },
        ],
      },
      {
        name: "胸椎／脊髓",
        options: [
          { value: 2, title: "2", desc: "胸椎 spinous/transverse process 脫位或骨折；輕度胸椎壓迫性骨折 <20%" },
          { value: 3, title: "3", desc: "胸椎壓迫性骨折 >20%；lamina/body/pedicle/facet 脫位或骨折；胸脊髓挫傷伴隨短暫神經失能" },
          { value: 4, title: "4", desc: "胸脊脊髓未完全損傷症候群" },
          { value: 5, title: "5", desc: "胸脊髓撕裂傷或完全損傷症候群" },
        ],
      },
      {
        name: "心、肺、食道、橫膈",
        options: [
          { value: 2, title: "2", desc: "細支氣管挫傷；肋膜／心包膜／胸導管撕裂傷；橫膈挫傷" },
          { value: 3, title: "3", desc: "食道／支氣管挫傷；單側肺挫傷或撕裂傷$；心臟輕微挫傷或撕裂傷" },
          { value: 4, title: "4", desc: "氣管／主支氣管或食道撕裂／支氣管破裂；兩側肺挫傷或撕裂傷$；心包填塞；嚴重心肌挫傷；橫隔膜撕裂或穿孔" },
          { value: 5, title: "5", desc: "氣管／主支氣管或食道全斷裂；心包損傷合併心臟脫疝；心臟破裂" },
        ],
      },
      {
        name: "血管／神經",
        options: [
          { value: 1, title: "1", desc: "迷走神經損傷" },
          { value: 2, title: "2", desc: "橫隔神經損傷" },
          { value: 3, title: "3", desc: "鎖骨下／無名／肺動靜脈、上下腔靜脈輕微撕裂／內膜裂開／栓塞" },
          { value: 4, title: "4", desc: "主動脈輕微撕裂／內膜裂開／栓塞；鎖骨下／無名／肺動靜脈或上下腔靜脈嚴重撕裂" },
          { value: 5, title: "5", desc: "主動脈嚴重撕裂傷" },
        ],
      },
      {
        name: "AIS 6（ISS=75）",
        options: [
          { value: 6, title: "6", desc: "複雜性心肌撕裂傷；胸部嚴重壓軋傷（crush injury）" },
        ],
      },
    ],
  },
  {
    key: "abdomen",
    label: "腹部／骨盆腔 Abdomen",
    hint: "實質器官可參考 OIS。同區只取最高 AIS。",
    groups: [
      {
        name: "無損傷",
        options: [{ value: 0, title: "0", desc: "無腹骨盆損傷" }],
      },
      {
        name: "軟組織／血管",
        options: [
          { value: 1, title: "1", desc: "撕裂傷 <20cm 或 <100 cm²" },
          { value: 2, title: "2", desc: "撕裂傷 >20cm 或 >100 cm²；內／外髂靜脈輕微撕裂" },
          { value: 3, title: "3", desc: "撕裂傷全身>20% 血液流失；總髂骨或其他命名動靜脈輕微撕裂；腹腔動脈內膜裂開；內／外髂靜脈嚴重撕裂；後腹膜腔血腫" },
          { value: 4, title: "4", desc: "腹主動脈內膜裂開或輕微撕裂；腹腔動脈輕微撕裂；總髂骨或其他命名動靜脈嚴重撕裂" },
          { value: 5, title: "5", desc: "腹主動脈、腹腔動脈嚴重撕裂傷" },
        ],
      },
      {
        name: "腰椎／脊髓",
        options: [
          { value: 1, title: "1", desc: "腰脊椎肌肉拉傷；腰神經根損傷" },
          { value: 2, title: "2", desc: "輕微腰椎壓迫性骨折 <20%；spinous/transverse process 脫位或骨折" },
          { value: 3, title: "3", desc: "腰椎壓迫性骨折 >20%；lamina/body/pedicle/facet 脫位或骨折；腰脊髓挫傷伴隨短暫或不完全神經失能" },
          { value: 4, title: "4", desc: "腰脊髓挫傷伴隨完全神經失能" },
        ],
      },
      {
        name: "脾／肝／膽／胰／腎",
        options: [
          { value: 2, title: "2", desc: "脾／肝／胰／腎輕微挫傷或撕裂（含表淺裂傷、OIS1–2）；膽囊輕微挫傷或撕裂；肝外膽管 OIS1–2" },
          { value: 3, title: "3", desc: "脾／肝／胰／腎中度挫傷或撕裂（血腫≥50%、裂傷較深、出血>1000cc、OIS3）；肝外膽管 OIS3–4" },
          { value: 4, title: "4", desc: "脾重度分葉碎裂 OIS4；肝嚴重裂傷（<50% 實質）／多處裂傷>3cm OIS4；胰多處挫傷／撕裂（含胰頭）OIS4；腎涉及主要血管及集尿系統 OIS4；總膽管或肝管斷裂／肝外膽管 OIS5" },
          { value: 5, title: "5", desc: "脾嚴重粉碎／脾動靜脈斷裂 OIS5；肝複雜破裂（>50% 實質）／門脈或肝後下腔靜脈區 OIS5；胰複雜破裂大量缺損 OIS5；腎複雜破裂／腎門血管斷裂" },
        ],
      },
      {
        name: "泌尿／腸胃／生殖",
        options: [
          { value: 1, title: "1", desc: "腎上腺表淺撕裂；陰囊／陰莖／睪丸／陰道／女陰／卵巢／會陰表淺撕裂或挫傷" },
          { value: 2, title: "2", desc: "膀胱挫傷或表淺撕裂；尿道／輸尿管挫傷或表淺撕裂 OIS1–2；胃／十二指腸／腸繫膜／大腸輕微挫傷或撕裂、肛門表淺撕裂；腎上腺嚴重撕裂大量缺損；生殖器嚴重裂傷" },
          { value: 3, title: "3", desc: "膀胱部分撕裂；尿道斷裂及組織缺損 OIS4、輸尿管斷裂 OIS3–5；胃／十二指腸／腸繫膜／大腸破裂（OIS1–2）、肛門嚴重撕裂；會陰嚴重複雜撕裂；胎盤剝離；腎上腺嚴重撕裂出血>1000cc" },
          { value: 4, title: "4", desc: "膀胱全層破裂 OIS2–5；球狀體／括約肌部尿道斷裂及組織缺損 OIS5；胃／十二指腸／腸繫膜／大腸／小腸橫截斷裂、肛門複雜撕裂大量缺損 OIS3–5" },
          { value: 5, title: "5", desc: "十二指腸伴隨胰頭／胰管／乳突部 OIS4–5；直腸嚴重撕裂伴隨組織喪失或明顯污染" },
        ],
      },
      {
        name: "AIS 6（ISS=75）",
        options: [
          { value: 6, title: "6", desc: "肝臟由血管接合處完全斷裂分離" },
        ],
      },
    ],
  },
  {
    key: "extremity",
    label: "四肢／骨盆 Extremity / Pelvis",
    hint: "有 * 之骨折若為開放／移位／粉碎，AIS +1。",
    groups: [
      {
        name: "無損傷",
        options: [{ value: 0, title: "0", desc: "無四肢／骨盆損傷" }],
      },
      {
        name: "關節／軟組織",
        options: [
          { value: 1, title: "1", desc: "肩肘腕膝踝挫傷；A-C／肩肘腕指髖踝趾扭傷；上肢肌腱損傷" },
          { value: 2, title: "2", desc: "膝扭傷；A-C／肩肘腕手髕膝踝脫位；下肢肌肉或肌腱撕裂；上肢肌肉撕裂；腔室症候群" },
        ],
      },
      {
        name: "骨折／截肢／壓軋",
        options: [
          { value: 1, title: "1", desc: "指骨、趾骨骨折或脫位" },
          { value: 2, title: "2", desc: "鎖骨／肩胛／肱骨*／橈尺骨*／腓骨／腕掌骨／脛骨*／跟骨／跗蹠骨／髕骨骨折；手指或腳趾截斷；膝以下壓軋傷；上臂前臂手指大腿小腿腳趾 degloving" },
          { value: 3, title: "3", desc: "股骨骨折；膝以下或上肢創傷性截肢；全身>20% 血液流失；膝以上壓軋傷；手／掌／膝／踝／足／足底 degloving" },
          { value: 4, title: "4", desc: "膝以上創傷性截肢" },
        ],
      },
      {
        name: "骨盆",
        options: [
          { value: 2, title: "2", desc: "簡單性骨盆骨折" },
          { value: 3, title: "3", desc: "粉碎性骨盆骨折" },
          { value: 4, title: "4", desc: "嚴重壓軋性骨盆骨折，出血 <20%" },
          { value: 5, title: "5", desc: "嚴重壓軋性骨盆骨折，出血 >20%" },
        ],
      },
      {
        name: "血管／神經",
        options: [
          { value: 1, title: "1", desc: "臂靜脈表淺撕裂；臂動脈或其他命名動脈輕微撕裂；指／正中／橈／尺神經挫傷或輕微撕裂" },
          { value: 2, title: "2", desc: "腋／臂／股／膕窩靜脈內膜裂開或輕微撕裂；臂動脈嚴重撕裂；正中／橈／尺／股／脛／腓神經撕裂" },
          { value: 3, title: "3", desc: "股動脈內膜裂開或輕微撕裂；腋／臂／膕窩／其他命名動靜脈或股靜脈嚴重撕裂；坐骨神經撕裂" },
          { value: 4, title: "4", desc: "股動脈嚴重撕裂傷" },
        ],
      },
    ],
  },
  {
    key: "external",
    label: "外觀 External",
    hint: "有 @ 之灼傷若 <5 歲或含臉／手／生殖器，AIS +1。",
    groups: [
      {
        name: "無損傷",
        options: [{ value: 0, title: "0", desc: "無外觀／燒燙傷相關損傷" }],
      },
      {
        name: "燒燙傷／吸入／電擊",
        options: [
          { value: 1, title: "1", desc: "1° 灼傷 <100% BSA；2° 灼傷 <10% BSA；高伏特電擊無肌肉壞死；輕度吸入性灼傷（COHb <20%）" },
          { value: 2, title: "2", desc: "2° 灼傷 10–19% BSA；3° 灼傷 <10% BSA；高伏特電擊+肌肉壞死；中度吸入性灼傷（COHb 20–40%）" },
          { value: 3, title: "3", desc: "全身>20% 血液流失；2° 或 3° 灼傷 20–29% BSA@；重度吸入性灼傷（COHb >40%）" },
          { value: 4, title: "4", desc: "2° 或 3° 灼傷 30–39% BSA@" },
          { value: 5, title: "5", desc: "2° 或 3° 灼傷 40–89% BSA@" },
        ],
      },
      {
        name: "體溫過低",
        options: [
          { value: 1, title: "1", desc: "體溫 36–34°C" },
          { value: 2, title: "2", desc: "體溫 33–32°C" },
          { value: 3, title: "3", desc: "體溫 31–30°C" },
          { value: 4, title: "4", desc: "體溫 29–28°C" },
          { value: 5, title: "5", desc: "體溫 ≤27°C" },
        ],
      },
      {
        name: "AIS 6（ISS=75）",
        options: [
          { value: 6, title: "6", desc: "2° 或 3° 灼傷面積 >90% BSA；高伏特電擊合併心臟停止" },
        ],
      },
    ],
  },
];
