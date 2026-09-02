/**
 * Generates Major, Minor, 7, m7 chords via mathematical enumeration.
 * Reads current chords.ts and preserves Power + triad qualities (sus2/sus4/dim/aug).
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

const TARGET_QUALITIES = ['Major', 'Minor', '7', 'm7'] as const;

const QUALITY_SUFFIX: Record<(typeof TARGET_QUALITIES)[number], string> = {
  Major: '',
  Minor: 'm',
  '7': '7',
  m7: 'm7',
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
  const base = root.toLowerCase().replace('#', 'sharp');
  if (quality === 'Major') return `${base}_major`;
  if (quality === 'Minor') return `${base}m`;
  if (quality === '7') return `${base}_7`;
  return `${base}_m7`;
}

function classifyVoicing(
  quality: (typeof TARGET_QUALITIES)[number],
  hasRoot: boolean,
  hasMaj3: boolean,
  hasMin3: boolean,
  has5: boolean,
  hasb7: boolean
): { voicingType: string; badge: string; helperText?: string } | null {
  if (quality === 'Major') {
    if (hasRoot && hasMaj3 && has5) return { voicingType: 'full', badge: 'Standard' };
    if (hasRoot && hasMaj3 && !has5) {
      return { voicingType: 'no5', badge: 'Easy', helperText: 'No 5th. Easier version.' };
    }
    if (hasRoot && !hasMaj3 && !hasMin3 && has5) {
      return {
        voicingType: 'power',
        badge: 'Power Shape',
        helperText: 'Common one-finger CBG shape.',
      };
    }
  } else if (quality === 'Minor') {
    if (hasRoot && hasMin3 && has5) return { voicingType: 'full', badge: 'Standard' };
    if (hasRoot && hasMin3 && !has5) {
      return { voicingType: 'no5', badge: 'Easy', helperText: 'No 5th. Easier version.' };
    }
  } else if (quality === '7') {
    if (hasRoot && hasMaj3 && hasb7) return { voicingType: 'full', badge: 'Standard' };
    if (hasRoot && has5 && hasb7 && !hasMaj3 && !hasMin3) {
      return { voicingType: 'no3', badge: 'Blues Shape', helperText: 'Works well for blues styles.' };
    }
    if (hasRoot && hasb7 && !has5 && !hasMaj3 && !hasMin3) {
      return { voicingType: 'sparse7', badge: 'Blues Shape', helperText: 'Sparse 7th shape.' };
    }
    if (!hasRoot && hasMaj3 && has5 && hasb7) {
      return { voicingType: 'rootless', badge: 'Advanced', helperText: 'Rootless shape.' };
    }
  } else if (quality === 'm7') {
    if (hasRoot && hasMin3 && hasb7) return { voicingType: 'full', badge: 'Standard' };
    if (hasRoot && has5 && hasb7 && !hasMin3 && !hasMaj3) {
      return { voicingType: 'no3', badge: 'Blues Shape', helperText: 'Works well for blues styles.' };
    }
    if (!hasRoot && hasMin3 && has5 && hasb7) {
      return { voicingType: 'rootless', badge: 'Advanced', helperText: 'Rootless shape.' };
    }
  }
  return null;
}

function generateVariations(
  rootStr: string,
  quality: (typeof TARGET_QUALITIES)[number],
  tuningName: string,
  tuningIntervals: number[]
) {
  const R = SCALE_NOTES.indexOf(rootStr);
  const reqMaj3 = (R + 4) % 12;
  const reqMin3 = (R + 3) % 12;
  const req5 = (R + 7) % 12;
  const reqb7 = (R + 10) % 12;

  const mathVariations: {
    frets: number[];
    voicingType: string;
    badge: string;
    helperText?: string;
  }[] = [];

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

        const classified = classifyVoicing(
          quality,
          notes.includes(R),
          notes.includes(reqMaj3),
          notes.includes(reqMin3),
          notes.includes(req5),
          notes.includes(reqb7)
        );

        if (classified) {
          mathVariations.push({ frets, ...classified });
        }
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
      voicingType: v.voicingType,
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
      voicingType: v.voicingType,
      badge: badge ?? v.badge,
      isEssential,
      helperText: v.helperText,
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

function resortPowerVariations(
  variations: any[],
  rootStr: string,
  tuningName: string
): any[] {
  const R = SCALE_NOTES.indexOf(rootStr);
  const scored = variations.map((v) => {
    const frets = [3, 2, 1].map(
      (s) => v.positions.find((p: { string: number }) => p.string === s)?.fret ?? 0
    ) as [number, number, number];
    const { score, isEssential } = scoreCbgVoicing({
      frets,
      quality: 'Power (5)',
      voicingType: 'power',
      tuningName,
      rootIndex: R,
    });
    return { ...v, score, isEssential };
  });
  scored.sort((a, b) =>
    compareCbgVoicings(
      {
        frets: [3, 2, 1].map(
          (s) => a.positions.find((p: { string: number }) => p.string === s)?.fret ?? 0
        ) as [number, number, number],
        score: a.score,
      },
      {
        frets: [3, 2, 1].map(
          (s) => b.positions.find((p: { string: number }) => p.string === s)?.fret ?? 0
        ) as [number, number, number],
        score: b.score,
      }
    )
  );
  return scored.map(({ score: _, ...rest }) => rest);
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

  const currentChords = new Function(`return ${match[1]}`)();
  const preserved = currentChords
    .filter(
      (c: { quality: string }) =>
        !TARGET_QUALITIES.includes(c.quality as (typeof TARGET_QUALITIES)[number])
    )
    .map((c: { quality: string; root: string; variations: any[] }) => {
      if (c.quality === 'Power (5)') {
        return { ...c, variations: resortPowerVariations(c.variations, c.root, tuningName) };
      }
      return c;
    });

  const regenerated: unknown[] = [];

  for (const quality of TARGET_QUALITIES) {
    for (const root of SCALE_NOTES) {
      const variations = generateVariations(root, quality, tuningName, tuningIntervals);
      regenerated.push({
        id: makeId(root, quality),
        root,
        quality,
        suffix: QUALITY_SUFFIX[quality],
        variations,
      });
    }
  }

  const merged = [...preserved, ...regenerated];
  merged.sort((a: { root: string; quality: string }, b: { root: string; quality: string }) => {
    const rootDiff = SCALE_NOTES.indexOf(a.root) - SCALE_NOTES.indexOf(b.root);
    if (rootDiff !== 0) return rootDiff;
    return QUALITY_ORDER.indexOf(a.quality) - QUALITY_ORDER.indexOf(b.quality);
  });

  const newTuningString = JSON.stringify(merged, null, 2).replace(/"([^"]+)":/g, '$1:');
  content = content.replace(match[1], newTuningString);
  console.log(`Regenerated ${tuningName}`);
}

fs.writeFileSync(chordsPath, content, 'utf-8');
console.log('Done — chords.ts updated.');
