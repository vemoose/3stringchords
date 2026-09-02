/**
 * Generates sus2, sus4, Diminished, and Augmented chords using CBG-focused scoring.
 */
import * as fs from 'fs';
import * as path from 'path';
import { scoreCbgVoicing, compareCbgVoicings } from './cbgScoring';

const chordsPath = path.resolve('./src/data/chords.ts');
let content = fs.readFileSync(chordsPath, 'utf-8');

const SCALE_NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const TUNINGS: Record<string, number[]> = {
  GDG: [7, 2, 7],
  DAD: [2, 9, 2],
  EBE: [4, 11, 4],
  AEA: [9, 4, 9],
  CGC: [0, 7, 0],
};

const TARGET_QUALITIES = ['sus2', 'sus4', 'Diminished', 'Augmented'] as const;

const QUALITY_SUFFIX: Record<(typeof TARGET_QUALITIES)[number], string> = {
  sus2: 'sus2',
  sus4: 'sus4',
  Diminished: 'dim',
  Augmented: 'aug',
};

const REQUIRED_INTERVALS: Record<(typeof TARGET_QUALITIES)[number], (R: number) => number[]> = {
  sus2: (R) => [(R + 2) % 12, (R + 7) % 12],
  sus4: (R) => [(R + 5) % 12, (R + 7) % 12],
  Diminished: (R) => [(R + 3) % 12, (R + 6) % 12],
  Augmented: (R) => [(R + 4) % 12, (R + 8) % 12],
};

function getNote(stringIdx: number, fret: number, tuningIntervals: number[]) {
  return (tuningIntervals[3 - stringIdx] + fret) % 12;
}

function isPlayable(frets: number[]) {
  if (frets.some((f) => f > 15)) return false;
  const pressed = frets.filter((f) => f > 0);
  if (pressed.length === 0) return true;
  return Math.max(...pressed) - Math.min(...pressed) <= 5;
}

function makeId(root: string, quality: (typeof TARGET_QUALITIES)[number]) {
  return `${root.toLowerCase().replace('#', 'sharp')}${QUALITY_SUFFIX[quality]}`;
}

function generateVariations(
  rootStr: string,
  quality: (typeof TARGET_QUALITIES)[number],
  tuningName: string,
  tuningIntervals: number[]
) {
  const R = SCALE_NOTES.indexOf(rootStr);
  const required = REQUIRED_INTERVALS[quality](R);
  const mathVariations: { frets: number[]; voicingType: 'full'; badge: string }[] = [];

  for (let f3 = 0; f3 <= 15; f3++) {
    for (let f2 = 0; f2 <= 15; f2++) {
      for (let f1 = 0; f1 <= 15; f1++) {
        const frets = [f3, f2, f1];
        if (!isPlayable(frets)) continue;

        const notes = [
          getNote(3, f3, tuningIntervals),
          getNote(2, f2, tuningIntervals),
          getNote(1, f1, tuningIntervals),
        ];

        const hasRoot = notes.includes(R);
        const hasAllRequired = required.every((n) => notes.includes(n));
        if (!hasRoot || !hasAllRequired) continue;

        mathVariations.push({ frets, voicingType: 'full', badge: 'Standard' });
      }
    }
  }

  const uniqueMathMap = new Map<string, (typeof mathVariations)[number]>();
  for (const v of mathVariations) {
    uniqueMathMap.set(JSON.stringify(v.frets), v);
  }
  const uniqueMath = Array.from(uniqueMathMap.values());

  const processedVariations: any[] = [];
  const seen = new Set<string>();

  for (const v of uniqueMath) {
    const vStr = JSON.stringify(v.frets);
    const flippedFrets = [v.frets[2], v.frets[1], v.frets[0]];
    const flippedStr = JSON.stringify(flippedFrets);

    if (seen.has(vStr) || seen.has(flippedStr)) continue;

    const isFlippable = vStr !== flippedStr && uniqueMathMap.has(flippedStr);

    let primaryFrets = v.frets as [number, number, number];
    if (isFlippable && v.frets[0] > v.frets[2]) {
      primaryFrets = flippedFrets as [number, number, number];
    }

    const { score, isEssential, badge } = scoreCbgVoicing({
      frets: primaryFrets,
      quality,
      voicingType: 'full',
      tuningName,
      rootIndex: R,
    });

    const pressed = primaryFrets.filter((f) => f > 0);
    const startFret = pressed.length > 0 ? Math.max(1, Math.min(...pressed)) : 1;

    const newVar: Record<string, unknown> = {
      id: `math_${primaryFrets.join('_')}`,
      startingFret: startFret,
      positions: [
        { string: 3, fret: primaryFrets[0], finger: 1 },
        { string: 2, fret: primaryFrets[1], finger: 1 },
        { string: 1, fret: primaryFrets[2], finger: 1 },
      ],
      voicingType: 'full',
      badge: badge ?? 'Standard',
      isEssential,
      score,
    };

    if (isFlippable) {
      newVar.isFlippable = true;
    }

    processedVariations.push(newVar);
    seen.add(vStr);
    seen.add(flippedStr);
  }

  processedVariations.sort((a, b) =>
    compareCbgVoicings(
      { frets: [a.positions[0].fret, a.positions[1].fret, a.positions[2].fret], score: a.score as number },
      { frets: [b.positions[0].fret, b.positions[1].fret, b.positions[2].fret], score: b.score as number }
    )
  );
  return processedVariations.slice(0, 20).map(({ score: _, ...rest }) => rest);
}

const QUALITY_ORDER = [
  'Power (5)',
  'Major',
  'Minor',
  '7',
  'm7',
  'sus2',
  'sus4',
  'Diminished',
  'Augmented',
];

for (const [tuningName, tuningIntervals] of Object.entries(TUNINGS)) {
  const matchRegex = new RegExp(
    `export const ${tuningName}_CHORDS: Chord\\[\\] = (\\[[\\s\\S]*?\\]);\\n`
  );
  const match = content.match(matchRegex);
  if (!match) {
    console.error(`Could not find ${tuningName}_CHORDS`);
    continue;
  }

  const tuningChords = new Function(`return ${match[1]}`)();

  const preserved = tuningChords.filter(
    (c: { quality: string }) =>
      !TARGET_QUALITIES.includes(c.quality as (typeof TARGET_QUALITIES)[number]) &&
      c.quality !== 'Suspended'
  );

  for (const quality of TARGET_QUALITIES) {
    for (const root of SCALE_NOTES) {
      const variations = generateVariations(root, quality, tuningName, tuningIntervals);
      if (variations.length === 0) {
        console.warn(`No voicings for ${root} ${quality} in ${tuningName}`);
        continue;
      }
      preserved.push({
        id: makeId(root, quality),
        root,
        quality,
        suffix: QUALITY_SUFFIX[quality],
        variations,
      });
    }
  }

  preserved.sort((a: { root: string; quality: string }, b: { root: string; quality: string }) => {
    const rootDiff = SCALE_NOTES.indexOf(a.root) - SCALE_NOTES.indexOf(b.root);
    if (rootDiff !== 0) return rootDiff;
    return QUALITY_ORDER.indexOf(a.quality) - QUALITY_ORDER.indexOf(b.quality);
  });

  const newTuningString = JSON.stringify(preserved, null, 2).replace(/"([^"]+)":/g, '$1:');
  content = content.replace(match[1], newTuningString);
  console.log(`Regenerated triads for ${tuningName}`);
}

fs.writeFileSync(chordsPath, content, 'utf-8');
console.log('Done — chords.ts updated.');
