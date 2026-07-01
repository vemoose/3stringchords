import * as fs from 'fs';

const chordsPath = './src/data/chords.ts';
const content = fs.readFileSync(chordsPath, 'utf-8');
const match = content.match(/export const GDG_CHORDS: Chord\[\] = (\[[\s\S]*?\]);\n/);
if (!match) process.exit(1);

const gdg = new Function(`return ${match[1]}`)();
const SCALE_NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

function getNote(stringIdx: number, fret: number) {
  // Strings: 3 (low G)=7, 2 (D)=2, 1 (high G)=7
  const base = stringIdx === 2 ? 2 : 7;
  return (base + fret) % 12;
}

function getRequiredNotes(rootStr: string, quality: string) {
  const R = SCALE_NOTES.indexOf(rootStr);
  if (quality === 'Major') return [(R+4)%12, (R+7)%12]; // Needs 3rd, 5th
  if (quality === 'Minor') return [(R+3)%12, (R+7)%12]; // Needs m3, 5th
  if (quality === '7') return [(R+4)%12, (R+10)%12]; // Needs 3rd, b7 (5th optional)
  if (quality === 'm7') return [(R+3)%12, (R+10)%12]; // Needs m3, b7 (5th optional)
  return [];
}

function isPlayable(frets: number[]) {
  const pressed = frets.filter(f => f > 0);
  if (pressed.length === 0) return true;
  return Math.max(...pressed) - Math.min(...pressed) <= 4;
}

const targetQualities = ['Major', 'Minor', '7', 'm7'];
let markdown = `# Mathematical Chords Comparison\n\n`;
markdown += `This compares all theoretically playable voicings (fret span <= 4) against the existing manual shapes for Major, Minor, 7, and m7 chords.\n\n`;

for (const quality of targetQualities) {
  markdown += `## ${quality} Chords\n\n`;
  markdown += `| Root | Existing Shapes | Mathematical Shapes | Status |\n`;
  markdown += `|---|---|---|---|\n`;

  for (const root of SCALE_NOTES) {
    const existingChord = gdg.find((c: any) => c.root === root && c.quality === quality);
    const existingVariations = existingChord ? existingChord.variations : [];
    const existingStrings = existingVariations.map((v: any) => 
      `[${v.positions.find((p:any)=>p.string===3)?.fret}, ${v.positions.find((p:any)=>p.string===2)?.fret}, ${v.positions.find((p:any)=>p.string===1)?.fret}]`
    );

    // Generate mathematical shapes
    const mathShapes: string[] = [];
    const req = getRequiredNotes(root, quality);
    const R = SCALE_NOTES.indexOf(root);

    for (let f3 = 0; f3 <= 15; f3++) {
      for (let f2 = 0; f2 <= 15; f2++) {
        for (let f1 = 0; f1 <= 15; f1++) {
          if (!isPlayable([f3, f2, f1])) continue;
          
          const notes = [getNote(3, f3), getNote(2, f2), getNote(1, f1)];
          const hasRoot = notes.includes(R);
          if (!hasRoot) continue; // Must have root

          const hasReq1 = notes.includes(req[0]);
          const hasReq2 = notes.includes(req[1]);
          
          // For 7 and m7, 5th is (R+7)%12 and is optional. But we only have 3 strings, so if we have Root, 3rd, and 7th, we are full.
          if (hasRoot && hasReq1 && hasReq2) {
            mathShapes.push(`[${f3}, ${f2}, ${f1}]`);
          }
        }
      }
    }

    // De-duplicate math shapes
    const uniqueMathShapes = Array.from(new Set(mathShapes));
    
    // Sort shapes logically (by lowest fret)
    uniqueMathShapes.sort((a, b) => {
      const aFrets = JSON.parse(a);
      const bFrets = JSON.parse(b);
      return Math.min(...aFrets.filter((f:number)=>f>0)) - Math.min(...bFrets.filter((f:number)=>f>0));
    });

    const exStr = existingStrings.length > 0 ? existingStrings.join(', ') : '*(None)*';
    const mathStr = uniqueMathShapes.length > 0 ? uniqueMathShapes.join(', ') : '*(None)*';
    
    let status = '';
    if (uniqueMathShapes.every(m => existingStrings.includes(m)) && existingStrings.every(e => uniqueMathShapes.includes(e))) {
      status = '⚪ Identical';
    } else if (existingStrings.length === 0 && uniqueMathShapes.length > 0) {
      status = '🟢 Purely New';
    } else {
      status = '🟡 Differ (Review)';
    }

    markdown += `| ${root} | ${exStr} | ${mathStr} | ${status} |\n`;
  }
  markdown += `\n`;
}

fs.writeFileSync('math_comparison_report.md', markdown, 'utf-8');
console.log('Report generated at math_comparison_report.md');
