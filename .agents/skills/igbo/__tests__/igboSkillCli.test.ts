import { execFileSync } from 'child_process';
import path from 'path';
import fs from 'fs';

const CLI = path.resolve(__dirname, '../scripts/igbo.py');
const DB = path.resolve(__dirname, '../data/igbo.db');

const runCli = (...args: string[]): string =>
  execFileSync('python3', [CLI, ...args], { encoding: 'utf8', timeout: 120000 });

describe('igbo agent skill CLI', () => {
  beforeAll(() => {
    // Force a clean compile so the test covers the auto-build path
    if (fs.existsSync(DB)) {
      fs.unlinkSync(DB);
    }
    runCli('stats');
  }, 120000);

  it('compiles the database from src/dictionaries with all tables populated', () => {
    const stats = Object.fromEntries(
      runCli('stats')
        .trim()
        .split('\n')
        .map((line) => line.split(': '))
    );
    expect(Number(stats.entries)).toBeGreaterThan(8000);
    expect(Number(stats.examples)).toBeGreaterThan(1500);
    expect(Number(stats.ig2en)).toBeGreaterThan(50000);
    expect(Number(stats.en2ig)).toBeGreaterThan(200000);
    expect(Number(stats.nsibidi)).toBeGreaterThan(5000);
  });

  it('looks up an Igbo word with full diacritics', () => {
    expect(runCli('lookup', 'ùdù')).toContain('earthenware pot');
  });

  it('looks up an Igbo word diacritic-insensitively', () => {
    expect(runCli('lookup', 'udu')).toContain('earthenware pot');
  });

  it('finds Igbo candidates for an English word', () => {
    const output = runCli('en', 'drum');
    expect(output).toContain('igba');
    expect(output).toContain('egwu');
  });

  it('glosses a sentence and expands the n’ elision to na', () => {
    const output = runCli('gloss', "Òbìàgèlì bì n'Àba");
    expect(output).toContain('na  ->');
    expect(output).toContain('Àba');
  });

  it('searches attested bilingual examples in either language', () => {
    expect(runCli('examples', 'market')).toContain('afịa');
  });

  it('finds nsibidi characters by meaning', () => {
    expect(runCli('nsibidi', 'mud')).toContain('ápị̀tị́');
  });
});
