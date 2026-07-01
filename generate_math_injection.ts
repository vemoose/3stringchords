import * as fs from 'fs';
import * as path from 'path';

const chordsPath = path.resolve('./src/data/chords.ts');
const backupPath = path.resolve('./src/data/chords.ts.bak');

// Backup the file
fs.copyFileSync(chordsPath, backupPath);
console.log('Backed up to chords.ts.bak');

const content = fs.readFileSync(chordsPath, 'utf-8');

// Match the existing GDG_CHORDS array string
const gdgMatch = content.match(/export const GDG_CHORDS: Chord\[\] = (\[[\s\S]*?\]);\n/);
if (!gdgMatch) {
  console.error('Could not find GDG_CHORDS array');
  process.exit(1);
}

const gdg = new Function(`return ${gdgMatch[1]}`)();
const SCALE_NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

function getNote(stringIdx: number, fret: number) {
  const base = stringIdx === 2 ? 2 : 7;
  return (base + fret) % 12;
}

function getRequiredNotes(rootStr: string, quality: string) {
  const R = SCALE_NOTES.indexOf(rootStr);
  if (quality === 'Major') return [(R+4)%12, (R+7)%12];
  if (quality === 'Minor') return [(R+3)%12, (R+7)%12];
  if (quality === '7') return [(R+4)%12, (R+10)%12];
  if (quality === 'm7') return [(R+3)%12, (R+10)%12];
  return [];
}

function isPlayable(frets: number[]) {
  const pressed = frets.filter(f => f > 0);
  if (pressed.length === 0) return true;
  return Math.max(...pressed) - Math.min(...pressed) <= 4;
}

function areAllNotesHigh(frets: number[]) {
  const pressed = frets.filter(f => f > 0);
  if (pressed.length === 0) return false;
  return pressed.every(f => f >= 15);
}

const targetQualities = ['Major', 'Minor', '7', 'm7'];

// We will keep a map of chord keys (root + quality) to our newly built variations
const newChordsMap = new Map<string, any>();

let droppedCount = 0;

for (const quality of targetQualities) {
  for (const root of SCALE_NOTES) {
    const key = `${root} ${quality}`;
    const R = SCALE_NOTES.indexOf(root);
    const req = getRequiredNotes(root, quality);
    
    // We will collect variations for this chord here
    const mathVariations: any[] = [];
    
    for (let f3 = 0; f3 <= 15; f3++) {
      for (let f2 = 0; f2 <= 15; f2++) {
        for (let f1 = 0; f1 <= 15; f1++) {
          if (!isPlayable([f3, f2, f1])) continue;
          if (areAllNotesHigh([f3, f2, f1])) {
            droppedCount++;
            continue;
          }
          
          const notes = [getNote(3, f3), getNote(2, f2), getNote(1, f1)];
          const hasRoot = notes.includes(R);
          if (!hasRoot) continue;

          const hasReq1 = notes.includes(req[0]);
          const hasReq2 = notes.includes(req[1]);
          
          if (hasRoot && hasReq1 && hasReq2) {
            mathVariations.push([f3, f2, f1]);
          }
        }
      }
    }

    // De-duplicate math variations
    const uniqueMathStrs = Array.from(new Set(mathVariations.map(v => JSON.stringify(v))));
    const uniqueMath = uniqueMathStrs.map(s => JSON.parse(s));

    // Handle symmetrically flipped chords
    // For a chord [A, B, C], its flip is [C, B, A].
    const processedVariations = [];
    const seen = new Set<string>();

    for (const v of uniqueMath) {
      const vStr = JSON.stringify(v);
      const flipped = [v[2], v[1], v[0]];
      const flippedStr = JSON.stringify(flipped);
      
      if (seen.has(vStr) || seen.has(flippedStr)) continue;

      const isFlippable = vStr !== flippedStr && uniqueMathStrs.includes(flippedStr);
      
      const newVar = {
        id: `math_${v.join('_')}`,
        startingFret: Math.max(1, Math.min(...v.filter((f:number)=>f>0))),
        positions: [
          { string: 3, fret: v[0], finger: 1 },
          { string: 2, fret: v[1], finger: 1 },
          { string: 1, fret: v[2], finger: 1 }
        ]
      };

      if (isFlippable) {
        (newVar as any).isFlippable = true;
        // Keep the one where string 3 fret <= string 1 fret to have a deterministic primary shape
        if (v[0] > v[2]) {
          newVar.positions[0].fret = flipped[0];
          newVar.positions[1].fret = flipped[1];
          newVar.positions[2].fret = flipped[2];
          newVar.id = `math_${flipped.join('_')}`;
        }
      }
      
      processedVariations.push(newVar);
      seen.add(vStr);
      seen.add(flippedStr);
    }
    
    // Sort logically
    processedVariations.sort((a, b) => a.startingFret - b.startingFret);

    newChordsMap.set(key, processedVariations);
  }
}

console.log(`Dropped ${droppedCount} shapes entirely >= fret 15`);

// We only want to process the GDG array and update the existing targetQualities with new ones,
// keeping other qualities like Power/Sus untouched.
const newGdg = [...gdg];

for (const quality of targetQualities) {
  for (const root of SCALE_NOTES) {
    const key = `${root} ${quality}`;
    const newVars = newChordsMap.get(key);
    
    let existingChord = newGdg.find((c: any) => c.root === root && c.quality === quality);
    if (existingChord) {
      // Completely replace variations with our mathematical, deduped list
      existingChord.variations = newVars;
    } else if (newVars && newVars.length > 0) {
      // Add the chord if it didn't exist
      newGdg.push({
        id: `${root.toLowerCase().replace('#', 'sharp')}${quality === 'Major' ? '' : quality.toLowerCase()}`,
        root,
        quality,
        suffix: quality === 'Major' ? '' : (quality === 'Minor' ? 'm' : (quality === '7' ? '7' : 'm7')),
        variations: newVars
      });
    }
  }
}

const newGdgString = JSON.stringify(newGdg, null, 2).replace(/"([^"]+)":/g, '$1:');
const newContent = content.replace(gdgMatch[1], newGdgString);

fs.writeFileSync(chordsPath, newContent, 'utf-8');
console.log('Successfully injected mathematical chords and saved to chords.ts.');
