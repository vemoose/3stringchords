import * as fs from 'fs';
import * as path from 'path';

const chordsPath = path.resolve('./src/data/chords.ts');
const content = fs.readFileSync(chordsPath, 'utf-8');

function extractChords(tuningName: string) {
  const regex = new RegExp(`export const ${tuningName}_CHORDS: Chord\\[\\] = (\\[[\\s\\S]*?\\]);\\n\\nexport const`);
  const match = content.match(regex);
  if (!match) {
    // try matching the last one
    const regexEnd = new RegExp(`export const ${tuningName}_CHORDS: Chord\\[\\] = (\\[[\\s\\S]*?\\]);?$`);
    const matchEnd = content.match(regexEnd);
    if (!matchEnd) return null;
    return new Function(`return ${matchEnd[1]}`)();
  }
  return new Function(`return ${match[1]}`)();
}

const gdg = extractChords('GDG');
const dad = extractChords('DAD');
const ebe = extractChords('EBE');

const expectedRoots = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const expectedQualities = ['Major', 'Minor', 'Power (5)', '7', 'm7', 'maj7', '6', 'Suspended', 'Diminished', 'Augmented'];

function analyze(chords: any[], name: string) {
  const found = new Set(chords.map(c => `${c.root} ${c.quality}`));
  let missing = [];
  
  for (const root of expectedRoots) {
    for (const q of expectedQualities) {
      if (!found.has(`${root} ${q}`)) {
        missing.push(`${root} ${q}`);
      }
    }
  }
  console.log(`\n--- ${name} ---`);
  console.log(`Total chords: ${chords.length}`);
  console.log(`Missing variations (${missing.length}):`);
  if (missing.length > 0 && missing.length < 20) {
    console.log(missing.join(', '));
  } else if (missing.length >= 20) {
    console.log(`Missing ${missing.length} chords. Examples: ${missing.slice(0, 10).join(', ')}...`);
  }
}

analyze(gdg, 'GDG');
analyze(dad, 'DAD');
analyze(ebe, 'EBE');
