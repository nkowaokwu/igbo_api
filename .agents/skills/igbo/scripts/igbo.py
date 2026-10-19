#!/usr/bin/env python3
"""Igbo dictionary CLI backed by the Igbo API dataset (igboapi.com repo).

Data: 8.2k rich headwords (word class, definitions, variations, stems),
~1.4k attested bilingual example sentences, 55k normalized Igbo->English
keys (incl. phrases), 212k English->Igbo reverse index, Nsibidi dictionary.

Usage:
  igbo.py lookup <igbo word/phrase>   full entries, diacritic-insensitive
  igbo.py en <english word/phrase>    English -> Igbo candidates
  igbo.py search <substring>          substring search across both directions
  igbo.py examples <query>            search attested example sentences
  igbo.py gloss "<igbo sentence>"     per-chunk gloss (greedy longest match)
  igbo.py nsibidi <query>             Nsibidi characters by symbol/pron/meaning
  igbo.py stats
  igbo.py build [--repo PATH]         (re)compile the SQLite DB from the repo
"""

import json
import os
import re
import sqlite3
import sys
import unicodedata

SKILL_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH = os.path.join(SKILL_DIR, "data", "igbo.db")

SOURCES = [
    "ig-en/ig-en_expanded.json",
    "ig-en/ig-en_normalized_expanded.json",
    "en-ig/en-ig_normalized_expanded.json",
    "ig-en/ig-en_1000_common.json",
    "nsibidi/nsibidi_dictionary.ts",
]


def find_repo():
    """Walk up from the skill directory to the repo root (the skill normally
    lives at <repo>/.agents/skills/igbo)."""
    d = SKILL_DIR
    while True:
        if os.path.isdir(os.path.join(d, "src", "dictionaries")):
            return d
        parent = os.path.dirname(d)
        if parent == d:
            return None
        d = parent

WORD_CLASSES = {
    "ADJ": "adjective", "ADV": "adverb", "AV": "active verb",
    "MV": "medial verb", "PV": "passive/stative verb", "CJN": "conjunction",
    "DEM": "demonstrative", "NM": "name", "NNC": "noun",
    "ND": "nominal modifier", "NNP": "proper noun", "CD": "number",
    "PREP": "preposition", "PRN": "pronoun", "FW": "foreign word",
    "QTF": "quantifier", "WH": "interrogative", "INTJ": "interjection",
    "ISUF": "inflectional suffix", "ESUF": "extensional suffix",
    "SYM": "punctuation",
}


def norm(s):
    """Lowercase and strip all diacritics (tone marks AND dot-below), so
    lookups work regardless of how carefully the input was typed."""
    s = unicodedata.normalize("NFD", s.lower().strip())
    return "".join(c for c in s if not unicodedata.combining(c))


# ---------------------------------------------------------------- build

def build(repo):
    dic = os.path.join(repo, "src", "dictionaries")
    if not os.path.isdir(dic):
        sys.exit(f"error: {dic} not found (pass --repo PATH to the igbo_api checkout)")

    def load(rel):
        with open(os.path.join(dic, rel), encoding="utf-8") as f:
            return json.load(f)

    expanded = load("ig-en/ig-en_expanded.json")
    ig2en = load("ig-en/ig-en_normalized_expanded.json")
    en2ig = load("en-ig/en-ig_normalized_expanded.json")
    common = load("ig-en/ig-en_1000_common.json")

    # nsibidi_dictionary.ts is `export default [...]` of plain object literals
    with open(os.path.join(dic, "nsibidi/nsibidi_dictionary.ts"), encoding="utf-8") as f:
        ts = f.read()
    body = ts[ts.index("export default") + len("export default"):].strip().rstrip(";")
    nsibidi = parse_ts_array(body)

    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    if os.path.exists(DB_PATH):
        os.remove(DB_PATH)
    db = sqlite3.connect(DB_PATH)
    db.executescript(
        """
        CREATE TABLE entries(word TEXT, word_norm TEXT, word_class TEXT,
            definitions TEXT, variations TEXT, stems TEXT, examples TEXT,
            is_common INTEGER);
        CREATE TABLE ig2en(key TEXT, key_norm TEXT, defs TEXT);
        CREATE TABLE en2ig(en TEXT, ig TEXT);
        CREATE TABLE examples(igbo TEXT, igbo_norm TEXT, english TEXT,
            english_lower TEXT, headword TEXT);
        CREATE TABLE nsibidi(sym TEXT, pro TEXT, pro_norm TEXT, form TEXT, defs TEXT);
        """
    )

    common_norm = {norm(k) for k in common}
    for word, terms in expanded.items():
        for t in terms:
            db.execute(
                "INSERT INTO entries VALUES(?,?,?,?,?,?,?,?)",
                (
                    word,
                    norm(word),
                    t.get("wordClass") or "",
                    json.dumps(t.get("definitions") or [], ensure_ascii=False),
                    json.dumps(t.get("variations") or [], ensure_ascii=False),
                    json.dumps(t.get("stems") or [], ensure_ascii=False),
                    json.dumps(t.get("examples") or [], ensure_ascii=False),
                    1 if norm(word) in common_norm else 0,
                ),
            )
            for ex in t.get("examples") or []:
                ig, en = ex.get("igbo", ""), ex.get("english", "")
                if ig and en:
                    db.execute(
                        "INSERT INTO examples VALUES(?,?,?,?,?)",
                        (ig, norm(ig), en, en.lower(), word),
                    )

    for key, defs in ig2en.items():
        if isinstance(defs, str):
            defs = [defs]
        db.execute("INSERT INTO ig2en VALUES(?,?,?)",
                   (key, norm(key), json.dumps(defs, ensure_ascii=False)))

    for en, ig in en2ig.items():
        if isinstance(ig, str):
            ig = [ig]
        db.execute("INSERT INTO en2ig VALUES(?,?)",
                   (en.lower(), json.dumps(ig, ensure_ascii=False)))

    for ch in nsibidi:
        db.execute(
            "INSERT INTO nsibidi VALUES(?,?,?,?,?)",
            (ch.get("sym") or "", ch.get("pro") or "",
             norm(ch.get("pro") or ""), ch.get("form") or "", ch.get("defs") or ""),
        )

    db.executescript(
        """
        CREATE INDEX idx_entries_norm ON entries(word_norm);
        CREATE INDEX idx_ig2en_norm ON ig2en(key_norm);
        CREATE INDEX idx_en2ig ON en2ig(en);
        CREATE INDEX idx_examples_norm ON examples(igbo_norm);
        """
    )
    db.commit()
    counts = {t: db.execute(f"SELECT COUNT(*) FROM {t}").fetchone()[0]
              for t in ("entries", "ig2en", "en2ig", "examples", "nsibidi")}
    db.close()
    size = os.path.getsize(DB_PATH) / 1e6
    print(f"built {DB_PATH} ({size:.1f} MB): " +
          ", ".join(f"{k}={v}" for k, v in counts.items()))


def parse_ts_array(body):
    """Parse the nsibidi TS array of flat object literals (sym/pro/form/defs,
    single-quoted strings or null) without needing node."""
    items = []
    for obj in re.finditer(r"\{(.*?)\}", body, re.S):
        item = {}
        for m in re.finditer(r"(\w+):\s*(?:'((?:[^'\\]|\\.)*)'|null)", obj.group(1)):
            val = m.group(2)
            item[m.group(1)] = val.replace("\\'", "'") if val is not None else None
        if item:
            items.append(item)
    return items


# ---------------------------------------------------------------- queries

def connect():
    """Open the DB, compiling it first if missing or older than the sources."""
    repo = find_repo()
    if repo:
        dic = os.path.join(repo, "src", "dictionaries")
        newest = max(os.path.getmtime(os.path.join(dic, s))
                     for s in SOURCES if os.path.exists(os.path.join(dic, s)))
        if not os.path.exists(DB_PATH) or os.path.getmtime(DB_PATH) < newest:
            print("(compiling dictionary database — one-time step)", file=sys.stderr)
            build(repo)
    elif not os.path.exists(DB_PATH):
        sys.exit(f"error: {DB_PATH} missing and no igbo_api checkout found"
                 " above the skill — run: igbo.py build --repo PATH")
    return sqlite3.connect(DB_PATH)


def like(s):
    return "%" + s.replace("%", "").replace("_", " ") + "%"


def print_entry(word, wc, defs, variations, stems, examples, is_common):
    wc_label = WORD_CLASSES.get(wc, wc) if wc else "?"
    flags = " [common]" if is_common else ""
    print(f"{word}  ({wc or '?'} = {wc_label}){flags}")
    for d in json.loads(defs):
        print(f"  - {d}")
    v = json.loads(variations)
    if v:
        print(f"  variations: {', '.join(v)}")
    s = json.loads(stems)
    if s:
        print(f"  stems: {', '.join(s)}")
    for ex in json.loads(examples):
        print(f"  ex: {ex.get('igbo', '')}  =  {ex.get('english', '')}")


def cmd_lookup(db, query, limit=25):
    q = norm(query)
    rows = db.execute(
        "SELECT word, word_class, definitions, variations, stems, examples, is_common"
        " FROM entries WHERE word_norm = ? ORDER BY is_common DESC LIMIT ?",
        (q, limit)).fetchall()
    for r in rows:
        print_entry(*r)
    # normalized index catches phrases and forms missing from the rich entries
    extra = db.execute(
        "SELECT key, defs FROM ig2en WHERE key_norm = ? LIMIT ?", (q, limit)).fetchall()
    for key, defs in extra:
        print(f"{key}  ->  {'; '.join(json.loads(defs)[:15])}  [normalized index]")
    if not rows and not extra:
        print(f"no exact match for {query!r}; trying substring search:")
        cmd_search(db, query, limit=10)


def cmd_en(db, query, limit=40):
    q = query.lower().strip()
    row = db.execute("SELECT ig FROM en2ig WHERE en = ?", (q,)).fetchone()
    hits = []
    if row:
        hits = json.loads(row[0])
        print(f"{q}  ->  {', '.join(hits)}")
    # also surface rich entries whose definitions contain the word, for context
    rows = db.execute(
        "SELECT word, word_class, definitions, variations, stems, examples, is_common"
        " FROM entries WHERE definitions LIKE ? ORDER BY is_common DESC,"
        " LENGTH(definitions) LIMIT ?", (like(q), limit)).fetchall()
    pat = re.compile(r"\b" + re.escape(q) + r"\b", re.I)
    shown = 0
    for r in rows:
        if any(pat.search(d) for d in json.loads(r[2])):
            print_entry(*r)
            shown += 1
            if shown >= 12:
                break
    if not row and not shown:
        print(f"no match for {query!r} (try a simpler/singular form)")


def cmd_search(db, query, limit=20):
    q = norm(query)
    found = 0
    for r in db.execute(
        "SELECT word, word_class, definitions, variations, stems, examples, is_common"
        " FROM entries WHERE word_norm LIKE ? ORDER BY is_common DESC,"
        " LENGTH(word_norm) LIMIT ?", (like(q), limit)):
        print_entry(*r)
        found += 1
    for key, defs in db.execute(
        "SELECT key, defs FROM ig2en WHERE key_norm LIKE ?"
        " AND key_norm NOT IN (SELECT word_norm FROM entries)"
        " ORDER BY LENGTH(key_norm) LIMIT ?", (like(q), limit)):
        print(f"{key}  ->  {'; '.join(json.loads(defs)[:15])}  [normalized index]")
        found += 1
    if not found:
        print(f"no Igbo forms contain {query!r}"
              " (this searches Igbo words; for English->Igbo use: en <word>)")


def cmd_examples(db, query, limit=20):
    q = norm(query)
    rows = db.execute(
        "SELECT igbo, english, headword FROM examples"
        " WHERE igbo_norm LIKE ? OR english_lower LIKE ? LIMIT ?",
        (like(q), like(query.lower()), limit)).fetchall()
    for ig, en, hw in rows:
        print(f"{ig}\n  = {en}   [{hw}]")
    if not rows:
        print("no examples found")


def cmd_gloss(db, sentence, max_ngram=4):
    # split off elided prepositions/prefixes: n'Àba -> n' + Àba
    sentence = re.sub(r"(\w['’])(?=\w)", r"\1 ", sentence)
    tokens = [t for t in re.split(r"[\s,;:!?.]+", sentence) if t]
    # n' / m' are elisions of na
    tokens = ["na" if re.fullmatch(r"[nm]['’]", t) else t for t in tokens]
    i = 0
    while i < len(tokens):
        hit = None
        for n in range(min(max_ngram, len(tokens) - i), 0, -1):
            chunk = " ".join(tokens[i:i + n])
            q = norm(chunk)
            defs = []
            for (d,) in db.execute(
                    "SELECT definitions FROM entries WHERE word_norm = ?", (q,)):
                defs.extend(json.loads(d))
            if not defs:
                for (d,) in db.execute(
                        "SELECT defs FROM ig2en WHERE key_norm = ?", (q,)):
                    defs.extend(json.loads(d))
            if defs:
                uniq = list(dict.fromkeys(defs))
                hit = (chunk, n, uniq)
                break
        if hit:
            chunk, n, defs = hit
            print(f"{chunk}  ->  {'; '.join(defs[:6])}")
            i += n
        else:
            print(f"{tokens[i]}  ->  ??? (not in dictionary — check affixes/stem)")
            i += 1


def cmd_nsibidi(db, query, limit=20):
    q = norm(query)
    rows = db.execute(
        "SELECT sym, pro, form, defs FROM nsibidi"
        " WHERE sym LIKE ? OR pro_norm LIKE ? OR defs LIKE ? LIMIT ?",
        (like(query), like(q), like(query.lower()), limit)).fetchall()
    for sym, pro, form, defs in rows:
        print(f"{sym}  pron: {pro or '-'}  form: {form or '-'}  =  {defs}")
    if not rows:
        print("no nsibidi match")


def cmd_stats(db):
    for t in ("entries", "ig2en", "en2ig", "examples", "nsibidi"):
        n = db.execute(f"SELECT COUNT(*) FROM {t}").fetchone()[0]
        print(f"{t}: {n}")


def main():
    args = sys.argv[1:]
    if not args or args[0] in ("-h", "--help"):
        print(__doc__)
        return
    cmd, rest = args[0], args[1:]
    if cmd == "build":
        repo = find_repo()
        if "--repo" in rest:
            repo = rest[rest.index("--repo") + 1]
        if not repo:
            sys.exit("error: no igbo_api checkout found — pass --repo PATH")
        build(repo)
        return
    db = connect()
    query = " ".join(rest)
    if cmd == "lookup":
        cmd_lookup(db, query)
    elif cmd == "en":
        cmd_en(db, query)
    elif cmd == "search":
        cmd_search(db, query)
    elif cmd == "examples":
        cmd_examples(db, query)
    elif cmd == "gloss":
        cmd_gloss(db, query)
    elif cmd == "nsibidi":
        cmd_nsibidi(db, query)
    elif cmd == "stats":
        cmd_stats(db)
    else:
        sys.exit(f"unknown command {cmd!r} — see --help")


if __name__ == "__main__":
    main()
