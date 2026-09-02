/**
 * Comprehensive chord library audit.
 * Run: npx tsx audit_all_chords.ts
 */
import {
  GDG_CHORDS,
  DAD_CHORDS,
  EBE_CHORDS,
  AEA_CHORDS,
  CGC_CHORDS,
  type Chord,
} from './src/data/chords';

const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const TUNINGS: Record<string, { intervals: number[]; chords: Chord[] }> = {
  GDG: { intervals: [7, 2, 7], chords: GDG_CHORDS },
  DAD: { intervals: [2, 9, 2], chords: DAD_CHORDS },
  EBE: { intervals: [4, 11, 4], chords: EBE_CHORDS },
  AEA: { intervals: [9, 4, 9], chords: AEA_CHORDS },
  CGC: { intervals: [0, 7, 0], chords: CGC_CHORDS },
};

// Pitch classes that MUST be present for each quality (root always required separately)
const REQUIRED: Record<string, (R: number) => number[]> = {
  'Power (5)': (R) => [(R + 7) % 12],
  Major: (R) => [(R + 4) % 12, (R + 7) % 12],
  Minor: (R) => [(R + 3) % 12, (R + 7) % 12],
  '7': (R) => [(R + 4) % 12, (R + 10) % 12], // full 7th: root+3+b7 (5th optional on 3 strings)
  m7: (R) => [(R + 3) % 12, (R + 10) % 12],
  sus2: (R) => [(R + 2) % 12, (R + 7) % 12],
  sus4: (R) => [(R + 5) % 12, (R + 7) % 12],
  Diminished: (R) => [(R + 3) % 12, (R + 6) % 12],
  Augmented: (R) => [(R + 4) % 12, (R + 8) % 12],
};

// Allowed pitch classes per voicingType (for Major/Minor/7/m7 partial voicings)
const VOICING_RULES: Record<string, { required: (R: number) => number[]; forbidden?: (R: number) => number[] }> = {
  full: { required: (R) => [] }, // checked via quality REQUIRED above
  no5: {
    required: (R) => [],
    forbidden: (R) => [(R + 7) % 12],
  },
  power: {
    required: (R) => [(R + 7) % 12],
    forbidden: (R) => [(R + 4) % 12, (R + 3) % 12],
  },
  no3: {
    required: (R) => [(R + 10) % 12, (R + 7) % 12],
    forbidden: (R) => [(R + 4) % 12, (R + 3) % 12],
  },
  sparse7: {
    required: (R) => [(R + 10) % 12],
    forbidden: (R) => [(R + 4) % 12, (R + 3) % 12, (R + 7) % 12],
  },
  rootless: {
    required: (R) => [],
    forbidden: (R) => [R],
  },
};

const EXPECTED_QUALITIES = [
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

const QUALITY_SUFFIX: Record<string, string> = {
  'Power (5)': '5',
  Major: '',
  Minor: 'm',
  '7': '7',
  m7: 'm7',
  sus2: 'sus2',
  sus4: 'sus4',
  Diminished: 'dim',
  Augmented: 'aug',
};

function getPitchClass(stringNum: number, fret: number, tuning: number[]) {
  const base = tuning[3 - stringNum];
  return (base + fret) % 12;
}

function getFrets(variation: Chord['variations'][0]) {
  return [3, 2, 1].map((s) => variation.positions.find((p) => p.string === s)?.fret ?? -1);
}

interface Issue {
  tuning: string;
  chord: string;
  variationId: string;
  type: string;
  detail: string;
}

const issues: Issue[] = [];

for (const [tuningName, { intervals, chords }] of Object.entries(TUNINGS)) {
  // Completeness: 12 roots × 9 qualities
  for (const root of NOTES) {
    for (const quality of EXPECTED_QUALITIES) {
      const found = chords.find((c) => c.root === root && c.quality === quality);
      if (!found) {
        issues.push({
          tuning: tuningName,
          chord: `${root} ${quality}`,
          variationId: '-',
          type: 'MISSING_CHORD',
          detail: 'Expected chord not in library',
        });
      } else if (found.variations.length === 0) {
        issues.push({
          tuning: tuningName,
          chord: `${root} ${quality}`,
          variationId: '-',
          type: 'NO_VARIATIONS',
          detail: 'Chord exists but has zero voicings',
        });
      }
    }
  }

  for (const chord of chords) {
    const R = NOTES.indexOf(chord.root);
    const expectedSuffix = QUALITY_SUFFIX[chord.quality];
    const expectedId = `${chord.root.toLowerCase().replace('#', 'sharp')}${expectedSuffix ?? '?'}`;

    if (expectedSuffix && chord.suffix !== expectedSuffix) {
      issues.push({
        tuning: tuningName,
        chord: `${chord.root} ${chord.quality}`,
        variationId: '-',
        type: 'SUFFIX_MISMATCH',
        detail: `suffix "${chord.suffix}" expected "${expectedSuffix}"`,
      });
    }

    if (expectedSuffix !== undefined && chord.id !== expectedId) {
      issues.push({
        tuning: tuningName,
        chord: `${chord.root} ${chord.quality}`,
        variationId: '-',
        type: 'ID_MISMATCH',
        detail: `id "${chord.id}" expected "${expectedId}"`,
      });
    }

    const qualityReq = REQUIRED[chord.quality];

    for (const v of chord.variations) {
      const frets = getFrets(v);
      if (frets.some((f) => f < 0)) {
        issues.push({
          tuning: tuningName,
          chord: `${chord.root} ${chord.quality}`,
          variationId: v.id,
          type: 'MISSING_STRING',
          detail: 'Variation missing a string position',
        });
        continue;
      }

      if (frets.some((f) => f > 15)) {
        issues.push({
          tuning: tuningName,
          chord: `${chord.root} ${chord.quality}`,
          variationId: v.id,
          type: 'FRET_TOO_HIGH',
          detail: `frets ${frets.join(',')} exceed 15`,
        });
      }

      const pressed = frets.filter((f) => f > 0);
      if (pressed.length > 0) {
        const span = Math.max(...pressed) - Math.min(...pressed);
        if (span > 5) {
          issues.push({
            tuning: tuningName,
            chord: `${chord.root} ${chord.quality}`,
            variationId: v.id,
            type: 'UNPLAYABLE_SPAN',
            detail: `span ${span} > 5, frets [${frets.join(', ')}]`,
          });
        }
      }

      const pcs = frets.map((f, i) => getPitchClass(3 - i, f, intervals));
      const pcSet = new Set(pcs);

      // Interval validation
      if (qualityReq) {
        const voicingType = v.voicingType ?? 'full';
        const needsRoot = voicingType !== 'rootless';

        if (needsRoot && !pcs.includes(R)) {
          issues.push({
            tuning: tuningName,
            chord: `${chord.root} ${chord.quality}`,
            variationId: v.id,
            type: 'MISSING_ROOT',
            detail: `notes ${pcs.map((p) => NOTES[p]).join(', ')}`,
          });
        }

        if (voicingType === 'full' || !VOICING_RULES[voicingType]) {
          const req = qualityReq(R);
          for (const n of req) {
            if (!pcs.includes(n)) {
              issues.push({
                tuning: tuningName,
                chord: `${chord.root} ${chord.quality}`,
                variationId: v.id,
                type: 'WRONG_INTERVALS',
                detail: `missing ${NOTES[n]}, got ${pcs.map((p) => NOTES[p]).join(', ')}`,
              });
            }
          }
        } else {
          const rules = VOICING_RULES[voicingType];
          for (const n of rules.required(R)) {
            if (!pcs.includes(n)) {
              issues.push({
                tuning: tuningName,
                chord: `${chord.root} ${chord.quality}`,
                variationId: v.id,
                type: 'WRONG_VOICING',
                detail: `${voicingType} missing ${NOTES[n]}`,
              });
            }
          }
          if (rules.forbidden) {
            for (const n of rules.forbidden(R)) {
              if (pcs.includes(n)) {
                issues.push({
                  tuning: tuningName,
                  chord: `${chord.root} ${chord.quality}`,
                  variationId: v.id,
                  type: 'WRONG_VOICING',
                  detail: `${voicingType} should not contain ${NOTES[n]}`,
                });
              }
            }
          }
        }
      }

      // startingFret sanity
      const computedStart =
        pressed.length > 0 ? Math.max(1, Math.min(...pressed)) : 1;
      if (v.startingFret !== computedStart) {
        issues.push({
          tuning: tuningName,
          chord: `${chord.root} ${chord.quality}`,
          variationId: v.id,
          type: 'STARTING_FRET',
          detail: `stored ${v.startingFret}, expected ${computedStart}`,
        });
      }

      // Duplicate variation IDs within chord
      void pcSet; // used above
    }

    const ids = chord.variations.map((v) => v.id);
    const dupIds = ids.filter((id, i) => ids.indexOf(id) !== i);
    if (dupIds.length) {
      issues.push({
        tuning: tuningName,
        chord: `${chord.root} ${chord.quality}`,
        variationId: dupIds[0],
        type: 'DUPLICATE_ID',
        detail: 'Duplicate variation id within chord',
      });
    }
  }
}

// Cross-tuning transposition check (GDG → others via semitone shift)
const GDG = TUNINGS.GDG.chords;
const SHIFTS: Record<string, number> = { DAD: 7, EBE: 9, AEA: 2, CGC: 5 };

for (const [tuningName, shift] of Object.entries(SHIFTS)) {
  const other = TUNINGS[tuningName].chords;
  for (const gChord of GDG) {
    const expectedRoot = NOTES[(NOTES.indexOf(gChord.root) + shift) % 12];
    const oChord = other.find(
      (c) => c.root === expectedRoot && c.quality === gChord.quality
    );
    if (!oChord) continue;

    // Compare variation counts — should be identical for math-generated chords
    const mathQualities = ['Major', 'Minor', '7', 'm7', 'sus2', 'sus4', 'Diminished', 'Augmented'];
    if (mathQualities.includes(gChord.quality)) {
      if (gChord.variations.length !== oChord.variations.length) {
        issues.push({
          tuning: tuningName,
          chord: `${expectedRoot} ${gChord.quality}`,
          variationId: '-',
          type: 'TRANSPOSE_COUNT',
          detail: `GDG ${gChord.root} has ${gChord.variations.length} vars, ${tuningName} has ${oChord.variations.length}`,
        });
      }
    }
  }
}

// Summary stats
console.log('\n=== CHORD LIBRARY AUDIT ===\n');

for (const [name, { chords }] of Object.entries(TUNINGS)) {
  const byQuality: Record<string, number> = {};
  let totalVars = 0;
  for (const c of chords) {
    byQuality[c.quality] = (byQuality[c.quality] ?? 0) + 1;
    totalVars += c.variations.length;
  }
  console.log(`${name}: ${chords.length} chords, ${totalVars} total voicings`);
  for (const q of EXPECTED_QUALITIES) {
    const count = chords.filter((c) => c.quality === q).length;
    const vars = chords.filter((c) => c.quality === q).reduce((s, c) => s + c.variations.length, 0);
    console.log(`  ${q}: ${count} roots, ${vars} voicings`);
  }
}

console.log(`\n=== ISSUES: ${issues.length} ===\n`);

const byType: Record<string, Issue[]> = {};
for (const i of issues) {
  (byType[i.type] ??= []).push(i);
}

for (const [type, list] of Object.entries(byType).sort()) {
  console.log(`\n--- ${type} (${list.length}) ---`);
  for (const i of list.slice(0, 8)) {
    console.log(`  [${i.tuning}] ${i.chord} / ${i.variationId}: ${i.detail}`);
  }
  if (list.length > 8) console.log(`  ... and ${list.length - 8} more`);
}

if (issues.length === 0) {
  console.log('\n✓ No issues found.');
}

process.exit(issues.length > 0 ? 1 : 0);
