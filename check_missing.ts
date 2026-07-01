import * as fs from 'fs';

const oldContent = fs.readFileSync('./src/data/chords.ts.bak', 'utf-8');
const newContent = fs.readFileSync('./src/data/chords.ts', 'utf-8');

const oldMatch = oldContent.match(/export const GDG_CHORDS: Chord\[\] = (\[[\s\S]*?\]);\n/);
const newMatch = newContent.match(/export const GDG_CHORDS: Chord\[\] = (\[[\s\S]*?\]);\n/);

if (!oldMatch || !newMatch) process.exit(1);

const oldGdg = new Function(`return ${oldMatch[1]}`)();
const newGdg = new Function(`return ${newMatch[1]}`)();

const SCALE_NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

function getNote(stringIdx: number, fret: number) {
  const base = stringIdx === 2 ? 2 : 7;
  return SCALE_NOTES[(base + fret) % 12];
}

const targetQualities = ['Major', 'Minor', '7', 'm7'];

let md = '# Dropped Chords Analysis\n\n';
md += 'Here is the full list of the 32 manually inputted chord shapes that were dropped by the mathematical generator, along with the actual notes they produce to show why they were mathematically rejected.\n\n';
md += '| Chord | Dropped Shape | Actual Notes Produced | Reason |\n';
md += '|---|---|---|---|\n';

for (const oldChord of oldGdg) {
  if (!targetQualities.includes(oldChord.quality)) continue;
  
  const newChord = newGdg.find((c: any) => c.root === oldChord.root && c.quality === oldChord.quality);
  if (!newChord) continue;
  
  const getPosStr = (v: any) => {
    const p3 = v.positions.find((p:any)=>p.string===3)?.fret;
    const p2 = v.positions.find((p:any)=>p.string===2)?.fret;
    const p1 = v.positions.find((p:any)=>p.string===1)?.fret;
    return `[${p3}, ${p2}, ${p1}]`;
  };
  
  const newStrs = new Set(newChord.variations.map(getPosStr));
  
  for (const oldVar of oldChord.variations) {
    const oldStr = getPosStr(oldVar);
    const flippedStr = `[${oldVar.positions.find((p:any)=>p.string===1)?.fret}, ${oldVar.positions.find((p:any)=>p.string===2)?.fret}, ${oldVar.positions.find((p:any)=>p.string===3)?.fret}]`;
    
    if (!newStrs.has(oldStr) && !newStrs.has(flippedStr)) {
      const f3 = oldVar.positions.find((p:any)=>p.string===3)?.fret;
      const f2 = oldVar.positions.find((p:any)=>p.string===2)?.fret;
      const f1 = oldVar.positions.find((p:any)=>p.string===1)?.fret;
      
      const n3 = getNote(3, f3);
      const n2 = getNote(2, f2);
      const n1 = getNote(1, f1);
      
      const notes = [n3, n2, n1];
      const hasRoot = notes.includes(oldChord.root);
      
      let reason = '';
      if (!hasRoot) {
        reason = 'Missing Root Note';
      } else {
        reason = 'Missing 3rd Note (Power Chord)';
      }
      
      md += `| **${oldChord.root} ${oldChord.quality}** | \`${oldStr}\` | ${n3}, ${n2}, ${n1} | ${reason} |\n`;
    }
  }
}

fs.writeFileSync('/Users/aarondeaville/.gemini/antigravity/brain/6f2c997a-923a-475f-b2dc-1087bf46a448/discarded_chords.md', md, 'utf-8');
console.log('Done');
