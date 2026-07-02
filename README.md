# Igbo API

[![Deploy to Firebase](https://github.com/nkowaokwu/igbo_api/actions/workflows/deploy.yml/badge.svg)](https://github.com/nkowaokwu/igbo_api/actions/workflows/deploy.yml) [![Dockerize Igbo API](https://github.com/nkowaokwu/igbo_api/actions/workflows/dockerize.yml/badge.svg)](https://github.com/nkowaokwu/igbo_api/actions/workflows/dockerize.yml)

[Contributing](./.github/CONTRIBUTING.md) | [Documentation](https://igboapi.com/docs) | [Code of Conduct](./.github/CODE_OF_CONDUCT.md) | [Slack Channel](https://igboapi.slack.com)

> Igbo is the principal native language of the Igbo people, an ethnic group of southeastern Nigeria, and is spoken by approx 45 million people with more than 20 different dialects.

## Demo

[Try the Igbo API here](https://igboapi.com)

## Get Started

Visit our [docs website](https://docs.igboapi.com) to get started with using the Igbo API.

Visit the [Igbo API Docs repo](https://github.com/nkowaokwu/igbo_api_docs) to help improve our docs.

## Use the Dictionary from Your Coding Agent

This repo ships an [Agent Skill](.agents/skills/igbo/SKILL.md) that turns the
Igbo API dataset into a translation assistant for AI coding agents. LLMs have
weak built-in Igbo; the skill makes them look every word up in this repo's
dictionaries (8k+ hand-curated headwords, 1.7k attested bilingual example
sentences, 267k lookup keys, and the Nsibidi dictionary) instead of guessing.

**Zero setup.** Clone the repo, open a skill-compatible agent inside it —
[Claude Code](https://claude.com/claude-code), [Codex CLI](https://developers.openai.com/codex/skills),
or any agent supporting the open `SKILL.md` format — and ask an Igbo question:

> Translate "Chiamaka, come play your udu!" as a sister would say it, affectionately.

The skill triggers automatically, compiles a local SQLite database from
`src/dictionaries/` on first use (a few seconds, requires only Python 3), and
verifies every word against the dataset before answering. It rebuilds itself
whenever the source dictionaries change.

The underlying CLI also works standalone, no agent required:

```bash
python3 .agents/skills/igbo/scripts/igbo.py lookup ùdù     # Igbo → English
python3 .agents/skills/igbo/scripts/igbo.py en drum        # English → Igbo
python3 .agents/skills/igbo/scripts/igbo.py gloss "Òbìàgèlì bì n'Àba"
python3 .agents/skills/igbo/scripts/igbo.py examples market
python3 .agents/skills/igbo/scripts/igbo.py nsibidi mud
```
