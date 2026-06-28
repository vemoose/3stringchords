import * as fs from 'fs';
import * as path from 'path';

const chordsPath = path.resolve('./src/data/chords.ts');
let content = fs.readFileSync(chordsPath, 'utf-8');

const regex = /export const GDG_CHORDS: Chord\[\] = (\[[\s\S]*?\]);\n\nexport const DAD_CHORDS/;
const match = content.match(regex);
if (!match) process.exit(1);

const gdgString = match[1];
const gdg = new Function(`return ${gdgString}`)();

const SCALE_NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const ALLOWED_QUALITIES = ['Major', 'Minor', 'Power (5)', '7', 'm7', 'Suspended'];

function getOuterFret(root: string) {
  return (SCALE_NOTES.indexOf(root) - SCALE_NOTES.indexOf('G') + 12) % 12;
}

function getMiddleFret(root: string) {
  return (SCALE_NOTES.indexOf(root) - SCALE_NOTES.indexOf('D') + 12) % 12;
}

// Ensure the chord exists in the array
function getOrCreateChord(root: string, quality: string, suffix: string) {
  let chord = cleanedGdg.find((c: any) => c.root === root && c.quality === quality);
  if (!chord) {
    chord = {
      id: `${root.toLowerCase().replace('#', 'sharp')}${suffix}`,
      root,
      quality,
      suffix,
      variations: []
    };
    cleanedGdg.push(chord);
  }
  return chord;
}

function addVariation(chord: any, id: string, frets: number[]) {
  // frets is [string3, string2, string1]
  // Check if it already exists
  const exists = chord.variations.some((v: any) => 
    v.positions.length === 3 &&
    v.positions.find((p: any) => p.string === 3)?.fret === frets[0] &&
    v.positions.find((p: any) => p.string === 2)?.fret === frets[1] &&
    v.positions.find((p: any) => p.string === 1)?.fret === frets[2]
  );
  if (!exists && Math.max(...frets) <= 15) {
    chord.variations.push({
      id,
      startingFret: Math.max(1, Math.min(...frets.filter(f => f > 0))),
      positions: [
        { string: 3, fret: frets[0], finger: 1 }, // finger is just a placeholder here
        { string: 2, fret: frets[1], finger: 1 },
        { string: 1, fret: frets[2], finger: 1 }
      ]
    });
  }
}

// Clean up existing
let cleanedGdg = gdg.filter((c: any) => ALLOWED_QUALITIES.includes(c.quality));
cleanedGdg.forEach((c: any) => {
  c.variations = c.variations.filter((v: any) => v.positions && v.positions.length === 3 && v.positions.every((p: any) => p.fret <= 15));
});

// Inject Universal Shapes
for (const root of SCALE_NOTES) {
  // POWER (5)
  const pwr = getOrCreateChord(root, 'Power (5)', '5');
  const outerFret = getOuterFret(root);
  const midFret = getMiddleFret(root);
  addVariation(pwr, 'outer_root', [outerFret, outerFret, outerFret]);
  addVariation(pwr, 'outer_root_high', [outerFret + 12, outerFret + 12, outerFret + 12]);
  addVariation(pwr, 'mid_root', [midFret + 2, midFret, midFret + 2]);
  if (midFret < 5) addVariation(pwr, 'mid_root_high', [midFret + 14, midFret + 12, midFret + 14]);

  // SUSPENDED (sus4)
  const sus = getOrCreateChord(root, 'Suspended', 'sus4');
  addVariation(sus, 'outer_root_sus', [outerFret, outerFret, outerFret + 5]);
  addVariation(sus, 'mid_root_sus', [midFret, midFret, midFret + 2]);
  
  let highFret = outerFret;
  if (highFret < 5) highFret += 12;
  addVariation(sus, 'high_root_sus', [highFret - 5, highFret - 2, highFret]);
}

// Rewrite GDG_CHORDS
const newGdgString = `export const GDG_CHORDS: Chord[] = ${JSON.stringify(cleanedGdg, null, 2).replace(/"([^"]+)":/g, '$1:')};`;

const newContent = content.replace(match[0], newGdgString + '\n\nexport const DAD_CHORDS');
fs.writeFileSync('src/data/chords.ts', newContent, 'utf-8');
console.log('Successfully refined GDG_CHORDS.');
