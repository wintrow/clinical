#!/usr/bin/env python3
"""Rebuild data/billing-codes.json from NHI open data + local required lists.

Run monthly (or anytime points change):
  python scripts/update-billing-codes.py
"""

from __future__ import annotations

import csv
import json
import urllib.request
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data"
EXTRACT = ROOT / "_extract"
NHI_URL = "https://info.nhi.gov.tw/api/iode0000s01/Dataset?rId=A21030000I-D20021-001"
SPINE_DOC = Path(r"d:\Dropbox\臨床\Note\Spine手術帳碼.docx")
OPD_DOC = Path(r"d:\Dropbox\臨床\Note\OPD injection.docx")


def decode_bytes(raw: bytes) -> str:
    for enc in ("utf-8-sig", "utf-8", "cp950", "big5"):
        try:
            return raw.decode(enc)
        except UnicodeDecodeError:
            continue
    raise RuntimeError("Unable to decode NHI CSV")


def field(row: dict, *names: str) -> str:
    for name in names:
        if name in row:
            return (row[name] or "").strip()
    for key, value in row.items():
        for name in names:
            if name in key:
                return (value or "").strip()
    return ""


def parse_points(value: str):
    value = (value or "").strip().replace(",", "")
    if not value:
        return None
    try:
        return float(value)
    except ValueError:
        return None


def download_nhi() -> list[dict]:
    DATA.mkdir(parents=True, exist_ok=True)
    csv_path = DATA / "nhi-payment.csv"
    print(f"Downloading NHI CSV → {csv_path}")
    urllib.request.urlretrieve(NHI_URL, csv_path)
    text = decode_bytes(csv_path.read_bytes())
    rows = list(csv.DictReader(text.splitlines()))
    print(f"NHI rows: {len(rows)}")
    return rows


def index_nhi(rows: list[dict]) -> dict[str, dict]:
    indexed = {}
    for row in rows:
        code = field(row, "診療項目代碼")
        if not code:
            continue
        indexed[code] = {
            "code": code,
            "points": parse_points(field(row, "健保支付點數")),
            "name_zh": field(row, "中文項目名稱"),
            "name_en": field(row, "英文項目名稱"),
            "note": field(row, "備註"),
            "effective_from": field(row, "生效起日"),
            "effective_to": field(row, "生效迄日"),
        }
    return indexed


def load_json_extract(name: str) -> dict:
    path = EXTRACT / f"{name}.json"
    if not path.exists():
        raise FileNotFoundError(
            f"Missing {path}. Re-extract Word docs first or keep previous extract."
        )
    return json.loads(path.read_text(encoding="utf-8"))


def maybe_refresh_extracts() -> None:
    try:
        from docx import Document
    except ImportError:
        print("python-docx not installed; using existing _extract/*.json")
        return

    EXTRACT.mkdir(parents=True, exist_ok=True)
    mapping = [("spine", SPINE_DOC), ("opd", OPD_DOC)]
    for name, path in mapping:
        if not path.exists():
            print(f"Skip refresh {name}: {path} not found")
            continue
        doc = Document(str(path))
        paragraphs = [p.text.strip() for p in doc.paragraphs if p.text.strip()]
        tables = []
        for table in doc.tables:
            rows = [
                [c.text.strip().replace("\n", " ") for c in row.cells]
                for row in table.rows
            ]
            tables.append(rows)
        (EXTRACT / f"{name}.json").write_text(
            json.dumps({"paragraphs": paragraphs, "tables": tables}, ensure_ascii=False, indent=2),
            encoding="utf-8",
        )
        print(f"Refreshed extract: {name}")


def load_sidecar(name: str) -> dict:
    path = Path(__file__).with_name(name)
    if not path.exists():
        return {}
    return json.loads(path.read_text(encoding="utf-8"))


def apply_nhi_fields(item: dict, nhi: dict, *, mapped: bool = False) -> dict:
    if item.get("doc_points") is None and item.get("points") is not None:
        item["doc_points"] = item.get("points")
    item["points"] = nhi["points"]
    item["name_zh"] = nhi.get("name_zh") or item.get("name_zh") or ""
    item["name_en"] = nhi.get("name_en") or item.get("name_en") or ""
    item["note"] = nhi.get("note") or item.get("note") or ""
    item["effective_from"] = nhi.get("effective_from")
    item["effective_to"] = nhi.get("effective_to")
    item["nhi_code"] = nhi["code"]
    item["points_verified"] = "nhi"
    if mapped and item.get("code") != nhi["code"]:
        item["his_code"] = item["code"]
    return item


def enrich_items(items: dict[str, dict], nhi_by_code: dict[str, dict]) -> dict[str, dict]:
    his_map = load_sidecar("his-nhi-map.json")
    local_zh = load_sidecar("local-zh-names.json")

    for code, item in list(items.items()):
        nhi = nhi_by_code.get(code)
        if nhi:
            apply_nhi_fields(item, nhi, mapped=False)
            continue

        mapped = his_map.get(code)
        if mapped and mapped in nhi_by_code:
            apply_nhi_fields(item, nhi_by_code[mapped], mapped=True)
            src = item.get("source") or ""
            if "nhi" not in src:
                item["source"] = f"{src}+nhi" if src else "nhi"
            continue

        if not item.get("name_zh") and code in local_zh:
            item["name_zh"] = local_zh[code]
        if item.get("self_pay"):
            item["points_verified"] = "self-pay"
        else:
            item["points_verified"] = "hospital"

    return items


def nhi_category(code: str) -> str:
    if code.startswith("830"):
        return "surgery-830"
    return "nhi"


def build_items(nhi_by_code: dict[str, dict]) -> dict[str, dict]:
    items: dict[str, dict] = {}

    # Full NHI payment standard (現行給付)
    for code, nhi in nhi_by_code.items():
        note = nhi.get("note") or ""
        items[code] = {
            "code": code,
            "points": nhi.get("points"),
            "name_zh": nhi.get("name_zh") or "",
            "name_en": nhi.get("name_en") or "",
            # Keep notes short in the bundle for mobile load size
            "note": note if len(note) <= 180 else note[:177] + "…",
            "effective_from": nhi.get("effective_from"),
            "effective_to": nhi.get("effective_to"),
            "source": "nhi",
            "category": nhi_category(code),
            "nhi_code": code,
            "points_verified": "nhi",
        }

    spine = load_json_extract("spine")
    for row in spine["tables"][0]:
        code, zh, en, pts = row[0], row[1], row[2], row[3]
        doc_points = parse_points(pts)
        base = items.get(code, {})
        nhi = nhi_by_code.get(code)
        item = {
            **base,
            "code": code,
            "points": nhi["points"] if nhi and nhi["points"] is not None else doc_points,
            "name_zh": (nhi["name_zh"] if nhi and nhi["name_zh"] else zh) or zh,
            "name_en": (nhi["name_en"] if nhi and nhi["name_en"] else en) or en,
            "note": (nhi.get("note") if nhi else base.get("note")) or "",
            "source": "spine+nhi" if nhi else "spine",
            "category": "spine",
            "doc_points": doc_points,
            "local": True,
        }
        if nhi:
            item["effective_from"] = nhi.get("effective_from")
            item["effective_to"] = nhi.get("effective_to")
            item["nhi_code"] = code
            item["points_verified"] = "nhi"
        if "*" in (en or ""):
            item["local_note"] = en
        items[code] = item

    opd = load_json_extract("opd")
    section = None
    for row in opd["tables"][0]:
        code = (row[0] or "").strip()
        name = (row[1] or "").strip() if len(row) > 1 else ""
        pts = (row[2] or "").strip() if len(row) > 2 else ""
        dept = (row[3] or "").strip() if len(row) > 3 else ""
        flag = (row[4] or "").strip() if len(row) > 4 else ""
        if not code:
            continue
        if code in ("Sono", "Fluoro", "Injection", "Prolotherapy", "RF", "收費碼") or (
            not name and not pts
        ):
            if code != "收費碼":
                section = code
            continue
        self_pay = ("自費" in flag) or ("SELF" in name.upper()) or ("Self-Pay" in name)
        # Keep HIS codes as separate searchable rows even if NHI twin exists
        item = {
            "code": code,
            "points": parse_points(pts),
            "name_zh": "",
            "name_en": name,
            "note": flag,
            "dept": dept,
            "section": section,
            "source": "opd-injection",
            "category": "opd-injection",
            "self_pay": self_pay,
            "doc_points": parse_points(pts),
            "local": True,
        }
        items[code] = item

    return enrich_items(items, nhi_by_code)


def main() -> None:
    maybe_refresh_extracts()
    rows = download_nhi()
    nhi_by_code = index_nhi(rows)
    items = build_items(nhi_by_code)
    verified = sum(1 for v in items.values() if v.get("points_verified") == "nhi")
    payload = {
        "meta": {
            "updated": date.today().isoformat(),
            "nhi_source": NHI_URL,
            "nhi_query": "https://info.nhi.gov.tw/INAE5000/INAE5001S01",
            "description": "健保署現行支付標準全庫 + Spine/injection 院內碼；可中英文／代碼搜尋",
            "verified": "nhi-open-data+his-map",
            "count": len(items),
            "count_nhi": len(nhi_by_code),
            "count_830": sum(1 for c in items if c.startswith("830")),
            "nhi_verified": verified,
        },
        "items": sorted(items.values(), key=lambda x: x.get("code") or ""),
    }
    out = DATA / "billing-codes.json"
    # Pretty JSON only for debugging size; ship compact JS for phones
    out.write_text(json.dumps(payload, ensure_ascii=False), encoding="utf-8")
    js_out = DATA / "billing-codes.js"
    js_out.write_text(
        "window.BILLING_CODES = "
        + json.dumps(payload, ensure_ascii=False, separators=(",", ":"))
        + ";\n",
        encoding="utf-8",
    )
    print(
        f"Wrote {out} & {js_out.name} | total={payload['meta']['count']} "
        f"nhi={payload['meta']['count_nhi']} 830={payload['meta']['count_830']} "
        f"verified={payload['meta']['nhi_verified']} "
        f"js_mb={js_out.stat().st_size / 1e6:.2f}"
    )


if __name__ == "__main__":
    main()
