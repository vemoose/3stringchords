import * as fs from 'fs';
import * as path from 'path';

const chordsPath = path.resolve('./src/data/chords.ts');
const content = fs.readFileSync(chordsPath, 'utf-8');

function extractChords(tuningName: string) {
  const regex = new RegExp(`export const ${tuningName}_CHORDS: Chord\\[\\] = (\\[[\\s\\S]*?\\]);\\n\\nexport const`);
  const match = content.match(regex);
  if (!match) {
    const regexEnd = new RegExp(`export const ${tuningName}_CHORDS: Chord\\[\\] = (\\[[\\s\\S]*?\\]);?$`);
    const matchEnd = content.match(regexEnd);
    if (!matchEnd) return [];
    return new Function(`return ${matchEnd[1]}`)();
  }
  return new Function(`return ${match[1]}`)();
}

const gdg = extractChords('GDG');
const oldDad = extractChords('DAD');
const oldEbe = extractChords('EBE');

const SCALE_NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

function transposeRoot(root: string, semitones: number) {
  const index = SCALE_NOTES.indexOf(root);
  if (index === -1) return root; // fallback
  return SCALE_NOTES[(index + semitones + 12) % 12];
}

function generateNew(baseChords: any[], semitones: number) {
  return baseChords.map(chord => {
    const newRoot = transposeRoot(chord.root, semitones);
    const newId = newRoot.toLowerCase().replace('#', 'sharp') + (chord.suffix ? chord.suffix : '');
    return {
      ...chord,
      id: newId,
      root: newRoot
    };
  });
}

const newDad = generateNew(gdg, 7); // G -> D is +7
const newEbe = generateNew(gdg, 9); // G -> E is +9

function compare(oldList: any[], newList: any[], name: string) {
  const oldMap = new Map(oldList.map(c => [`${c.root} ${c.quality}`, c]));
  const newMap = new Map(newList.map(c => [`${c.root} ${c.quality}`, c]));

  const allKeys = Array.from(new Set([...oldMap.keys(), ...newMap.keys()])).sort();

  let markdown = `### ${name} Tuning Comparison\n\n`;
  markdown += `| Chord | Old Shapes | New Shapes | Status |\n`;
  markdown += `|---|---|---|---|\n`;

  for (const key of allKeys) {
    const oldC = oldMap.get(key);
    const newC = newMap.get(key);

    const oldStr = oldC ? oldC.variations.map((v: any) => `[${v.positions.map((p: any) => p.fret).join(', ')}]`).join(', ') : '*(Missing)*';
    const newStr = newC ? newC.variations.map((v: any) => `[${v.positions.map((p: any) => p.fret).join(', ')}]`).join(', ') : '*(Missing)*';

    let status = '';
    if (!oldC && newC) status = '🟢 Added';
    else if (oldC && !newC) status = '🔴 Removed';
    else if (oldStr === newStr) status = '⚪ Identical';
    else status = '🟡 Changed / Expanded';

    markdown += `| ${key} | ${oldStr} | ${newStr} | ${status} |\n`;
  }
  return markdown;
}

const mdOutput = `# Chord Library Comparison\n\n` + compare(oldDad, newDad, 'DAD') + `\n\n` + compare(oldEbe, newEbe, 'EBE');

fs.writeFileSync('comparison.md', mdOutput, 'utf-8');
console.log('Comparison generated in comparison.md');
