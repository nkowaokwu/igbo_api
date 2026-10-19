---
name: igbo
description: Igbo dictionary and translation assistant backed by this repo's dataset (8k+ rich headwords, 1.7k attested bilingual examples, 267k lookup keys, Nsibidi). Use whenever the user asks to translate to/from Igbo, asks what an Igbo word or phrase means, asks about Igbo grammar/tone/spelling, or mentions Nsibidi script. LLM built-in Igbo knowledge is weak — always consult this dictionary instead of answering from memory.
---

# Igbo dictionary skill

All queries go through one zero-dependency CLI (Python 3 stdlib + SQLite,
offline). Run it from this skill's base directory:

```
python3 scripts/igbo.py <command> <query>
```

On first use it compiles `src/dictionaries/` into a local SQLite DB
(`data/igbo.db`, ~19 MB, takes a few seconds) and rebuilds automatically
whenever the source dictionaries change. No setup required.

| command | purpose |
|---|---|
| `lookup <igbo>` | Igbo → English, diacritic-insensitive; full entries (word class, definitions, variations, stems, examples) |
| `en <english>` | English → Igbo: reverse-index hit + rich entries whose definitions contain the word |
| `search <substr>` | substring search across Igbo forms |
| `examples <query>` | search the 1.7k attested bilingual sentences (matches either language) |
| `gloss "<igbo sentence>"` | per-chunk gloss, greedy longest phrase match; handles n'/m' elision |
| `nsibidi <query>` | Nsibidi characters by symbol, pronunciation, or meaning |
| `stats` | table counts |
| `build [--repo PATH]` | force-recompile the DB (normally automatic) |

Run several lookups in one shell call (`cmd1; cmd2; ...`) to save round-trips.

## Data trust levels

1. **Rich entries and examples** (from `lookup`, `en`, `examples`) — hand-curated,
   authoritative. Tone-marked. Prefer these always.
2. **`[normalized index]` lines** — machine-expanded, NOISY (spurious synonyms like
   "housefly" under ụlọ). Use only as leads; confirm via a rich entry or example.
3. The dataset leans Onitsha/older-source in places (e.g. house appears as ụnò in
   rich entries, ụlọ in the modern index). Note dialect variation when relevant.

## Translation workflow — non-negotiable discipline

LLMs hallucinate plausible-sounding Igbo. Never emit an Igbo word you have not
verified this session via `lookup`/`en`/`examples`.

**English → Igbo:**
1. `en <word>` each content word; pick candidates from rich entries, noting word class.
2. `lookup` each chosen candidate to confirm the gloss round-trips and to get
   correct diacritics; copy spelling exactly (dot-below vowels and tone marks).
3. `examples <word>` for attested sentences — reuse their constructions as
   translation memory rather than composing syntax from scratch.
4. Assemble using the grammar crib below; state uncertainty honestly when the
   dictionary lacks an attested pattern.

**Igbo → English:**
1. `gloss "<sentence>"` first. For `???` tokens, strip affixes (see crib) and
   `lookup` the stem; verbs are listed with a leading hyphen (`-ri`, `-gba`).
2. `examples <key word>` to check idioms — many multi-word entries are idiomatic.

## Orthography

- Igbo alphabet includes ị ọ ụ (dot below) and ṅ — these are distinct letters, not
  decoration. i/ị, o/ọ, u/ụ distinguish words.
- Tone marks in this dataset: acute = high, grave = low, macron (ō) = downstep.
  Everyday Igbo text usually omits tone marks but keeps dots. When answering, give
  the dictionary's tone-marked form at least once, then the plain-dotted form.
- `n'` is elided `na` (in/at/and) before vowels: `n'ụlọ` = `na ụlọ`.

## Grammar crib

- Word order SVO. No grammatical gender; `ọ/o` = he/she/it.
- Vowel harmony: two sets {i e o u} vs {ị a ọ ụ}; prefixes/suffixes harmonize with
  the stem (e.g. infinitive i-/ị-: iri "to eat", ịsa "to wash").
- Verb tense/aspect: progressive `na-` + participle (ọ na-eri "s/he is eating");
  future `ga-` (ọ ga-eri); past/factative suffix -rV echoing stem vowel (o riri
  "s/he ate"); perfect -la/-le (o riela); negation -ghị (ọ righị).
- Word classes in output: AV=active verb, PV=passive/stative verb, MV=medial verb,
  NNC=noun, ND=nominal modifier, ISUF/ESUF=inflectional/extensional suffix,
  CJN, DEM, PRN, PREP, WH=interrogative, QTF, INTJ, CD=number, FW=foreign word.
  Extensional suffixes (-kwa, -ghị, -la, -pụ...) stack on verb stems — strip them
  when a gloss fails.
- `[common]` flag marks the ~1000 highest-frequency words; prefer them when
  multiple candidates fit.

## Notes

The compiled `data/igbo.db` is a local artifact (gitignored); delete it any time
to force a clean rebuild. The hosted https://igboapi.com API additionally offers
audio pronunciations and dialect data behind an API key, but this skill is fully
offline by design.
