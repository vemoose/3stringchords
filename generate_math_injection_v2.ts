import * as fs from 'fs';
import * as path from 'path';

const chordsPath = path.resolve('./src/data/chords.ts');
// We read from the pure manual backup to ensure clean slate
const backupPath = path.resolve('./src/data/chords.ts.bak');

const content = fs.readFileSync(backupPath, 'utf-8');
let targetContent = fs.readFileSync(chordsPath, 'utf-8');

const SCALE_NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const TUNINGS: Record<string, number[]> = {
  'GDG': [7, 2, 7],
  'DAD': [2, 9, 2],
  'EBE': [4, 11, 4],
  'AEA': [9, 4, 9],
  'CGC': [0, 7, 0]
};

function getNote(stringIdx: number, fret: number, tuningIntervals: number[]) {
  const base = tuningIntervals[3 - stringIdx];
  return (base + fret) % 12;
}

function isPlayable(frets: number[]) {
  const pressed = frets.filter(f => f > 0);
  if (pressed.length === 0) return true;
  return Math.max(...pressed) - Math.min(...pressed) <= 5;
}

const targetQualities = ['Major', 'Minor', '7', 'm7'];

for (const [tuningName, tuningIntervals] of Object.entries(TUNINGS)) {
  const matchRegex = new RegExp(`export const ${tuningName}_CHORDS: Chord\\[\\] = (\\[[\\s\\S]*?\\]);\\n`);
  const backupMatch = content.match(matchRegex);
  const targetMatch = targetContent.match(matchRegex);

  if (!backupMatch || !targetMatch) {
    console.error(`Could not find ${tuningName}_CHORDS array in one of the files.`);
    continue;
  }

  const baseChords = new Function(`return ${backupMatch[1]}`)();
  const newChordsMap = new Map<string, any>();

  for (const quality of targetQualities) {
    for (const rootStr of SCALE_NOTES) {
      const key = `${rootStr} ${quality}`;
      const R = SCALE_NOTES.indexOf(rootStr);
      
      let reqMaj3 = (R + 4) % 12;
      let reqMin3 = (R + 3) % 12;
      let req5 = (R + 7) % 12;
      let reqb7 = (R + 10) % 12;

      const mathVariations: any[] = [];
      
      for (let f3 = 0; f3 <= 15; f3++) {
        for (let f2 = 0; f2 <= 15; f2++) {
          for (let f1 = 0; f1 <= 15; f1++) {
            if (!isPlayable([f3, f2, f1])) continue;
            
            const notes = [
              getNote(3, f3, tuningIntervals), 
              getNote(2, f2, tuningIntervals), 
              getNote(1, f1, tuningIntervals)
            ];
            
            const hasRoot = notes.includes(R);
            const hasMaj3 = notes.includes(reqMaj3);
            const hasMin3 = notes.includes(reqMin3);
            const has5 = notes.includes(req5);
            const hasb7 = notes.includes(reqb7);

            let voicingType = null;
            let badge = '';
            let helperText = '';

            if (quality === 'Major') {
              if (hasRoot && hasMaj3 && has5) {
                voicingType = 'full'; badge = 'Standard';
              } else if (hasRoot && hasMaj3 && !has5) {
                voicingType = 'no5'; badge = 'Easy'; helperText = 'No 5th. Easier version.';
              } else if (hasRoot && !hasMaj3 && has5) {
                voicingType = 'power'; badge = 'Power Shape'; helperText = 'Common one-finger CBG shape.';
              }
            } else if (quality === 'Minor') {
              if (hasRoot && hasMin3 && has5) {
                voicingType = 'full'; badge = 'Standard';
              } else if (hasRoot && hasMin3 && !has5) {
                voicingType = 'no5'; badge = 'Easy'; helperText = 'No 5th. Easier version.';
              }
            } else if (quality === '7') {
              if (hasRoot && hasMaj3 && hasb7) {
                voicingType = 'full'; badge = 'Standard';
              } else if (hasRoot && has5 && hasb7 && !hasMaj3) {
                voicingType = 'no3'; badge = 'Blues Shape'; helperText = 'Works well for blues styles.';
              } else if (hasRoot && hasb7 && !has5 && !hasMaj3) {
                voicingType = 'sparse7'; badge = 'Blues Shape'; helperText = 'Sparse 7th shape.';
              } else if (!hasRoot && hasMaj3 && has5 && hasb7) {
                voicingType = 'rootless'; badge = 'Advanced'; helperText = 'Rootless shape.';
              }
            } else if (quality === 'm7') {
              if (hasRoot && hasMin3 && hasb7) {
                voicingType = 'full'; badge = 'Standard';
              } else if (hasRoot && has5 && hasb7 && !hasMin3) {
                voicingType = 'no3'; badge = 'Blues Shape'; helperText = 'Works well for blues styles.';
              } else if (!hasRoot && hasMin3 && has5 && hasb7) {
                voicingType = 'rootless'; badge = 'Advanced'; helperText = 'Rootless shape.';
              }
            }

            if (voicingType) {
              mathVariations.push({
                frets: [f3, f2, f1],
                voicingType,
                badge,
                helperText
              });
            }
          }
        }
      }

      // De-duplicate math variations
      const uniqueMathMap = new Map();
      for (const v of mathVariations) {
        uniqueMathMap.set(JSON.stringify(v.frets), v);
      }
      const uniqueMath = Array.from(uniqueMathMap.values());

      const processedVariations = [];
      const seen = new Set<string>();

      for (const v of uniqueMath) {
        const vStr = JSON.stringify(v.frets);
        const flippedFrets = [v.frets[2], v.frets[1], v.frets[0]];
        const flippedStr = JSON.stringify(flippedFrets);
        
        if (seen.has(vStr) || seen.has(flippedStr)) continue;

        const isFlippable = vStr !== flippedStr && uniqueMathMap.has(flippedStr);
        
        let primaryFrets = v.frets;
        if (isFlippable && v.frets[0] > v.frets[2]) {
          primaryFrets = flippedFrets;
        }
        
        const pressed = primaryFrets.filter((f:number) => f > 0);
        const startFret = pressed.length > 0 ? Math.max(1, Math.min(...pressed)) : 1;
        const maxFret = pressed.length > 0 ? Math.max(...pressed) : 0;
        const openCount = 3 - pressed.length;
        const span = pressed.length > 0 ? maxFret - Math.min(...pressed) : 0;

        // Scoring based on community recognition and usage
        let score = 100;
        
        // Full chords (Root+3rd+5th) should take top priority if playable
        if (v.voicingType === 'full') score += 50;
        if (v.voicingType === 'power') score += 15;
        if (v.voicingType === 'no5') score += 10;
        if (v.voicingType === 'rootless' || v.voicingType === 'sparse7') score -= 50;
        
        // 1-finger barres get a small bump, but shouldn't overpower a good full shape
        if (span === 0 && pressed.length === 3) score += 10;
        
        // Open string chords are the absolute most common in CBG
        if (openCount === 3) score += 60;
        else if (openCount === 2) score += 20;
        else if (openCount === 1) score += 10;
        
        // Small penalty for wider stretches to prefer compact chords when tied
        score -= span;
        
        // Classic Blues 7th shape
        if ((quality === '7' || quality === 'm7') && 
            primaryFrets[0] === primaryFrets[1] && 
            primaryFrets[2] === primaryFrets[0] + 3) {
          score += 50;
        }
        
        // Penalties for high/awkward positions, but less penalty if it's a simple barre
        const highFretPenaltyMult = (span === 0) ? 0.5 : 1; 
        
        if (startFret > 5) score -= (startFret - 5) * 5 * highFretPenaltyMult;
        if (startFret > 7) score -= 20 * highFretPenaltyMult;
        if (maxFret > 9) score -= 30 * highFretPenaltyMult;

        let finalBadge = v.badge;
        if (startFret > 7 && score < 100) {
          finalBadge = 'High Position';
        } else if (openCount === 0 && v.badge === 'Standard') {
          finalBadge = 'Movable';
        }

        const newVar = {
          id: `math_${primaryFrets.join('_')}`,
          startingFret: startFret,
          positions: [
            { string: 3, fret: primaryFrets[0], finger: 1 },
            { string: 2, fret: primaryFrets[1], finger: 1 },
            { string: 1, fret: primaryFrets[2], finger: 1 }
          ],
          voicingType: v.voicingType,
          badge: finalBadge,
          isEssential: score >= 110,
          helperText: v.helperText,
          score
        };

        if (isFlippable) {
          (newVar as any).isFlippable = true;
        }
        
        processedVariations.push(newVar);
        seen.add(vStr);
        seen.add(flippedStr);
      }
      
      // Sort logic
      processedVariations.sort((a, b) => b.score - a.score);

      // Limit to top 20 max
      const limitedVariations = processedVariations.slice(0, 20);
      newChordsMap.set(key, limitedVariations);
    }
  }

  const newTuningChords = [...baseChords];

  for (const quality of targetQualities) {
    for (const root of SCALE_NOTES) {
      const key = `${root} ${quality}`;
      const newVars = newChordsMap.get(key);
      
      let existingChord = newTuningChords.find((c: any) => c.root === root && c.quality === quality);
      if (existingChord) {
        existingChord.variations = newVars;
      } else if (newVars && newVars.length > 0) {
        newTuningChords.push({
          id: `${root.toLowerCase().replace('#', 'sharp')}${quality === 'Major' ? '' : quality.toLowerCase()}`,
          root,
          quality,
          suffix: quality === 'Major' ? '' : (quality === 'Minor' ? 'm' : (quality === '7' ? '7' : 'm7')),
          variations: newVars
        });
      }
    }
  }

  // Clean up the `score` field
  for (const c of newTuningChords) {
    if (c.variations) {
      for (const v of c.variations) {
        delete v.score;
      }
    }
  }

  const newTuningString = JSON.stringify(newTuningChords, null, 2).replace(/"([^"]+)":/g, '$1:');
  targetContent = targetContent.replace(targetMatch[1], newTuningString);
  console.log(`Successfully processed and injected chords for ${tuningName}.`);
}

fs.writeFileSync(chordsPath, targetContent, 'utf-8');
console.log('Successfully saved to chords.ts.');
