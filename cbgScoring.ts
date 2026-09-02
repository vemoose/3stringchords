/**
 * Scoring heuristics for ranking 3-string cigar box guitar / dulcimer chord shapes.
 * Higher score = more commonly used by CBG players (open strings, one-finger barres, low positions).
 */

const TUNING_STRINGS: Record<string, { bass: number; mid: number; treble: number }> = {
  GDG: { bass: 7, mid: 2, treble: 7 },
  DAD: { bass: 2, mid: 9, treble: 2 },
  EBE: { bass: 4, mid: 11, treble: 4 },
  AEA: { bass: 9, mid: 4, treble: 9 },
  CGC: { bass: 0, mid: 7, treble: 0 },
};

export interface ScoreInput {
  frets: [number, number, number]; // [string3, string2, string1]
  quality: string;
  voicingType: string;
  tuningName: string;
  rootIndex: number;
}

export interface ScoreResult {
  score: number;
  isEssential: boolean;
  badge?: string;
}

function getOuterFret(rootIndex: number, bassPitch: number) {
  return (rootIndex - bassPitch + 12) % 12;
}

function getMidFret(rootIndex: number, midPitch: number) {
  return (rootIndex - midPitch + 12) % 12;
}

export function scoreCbgVoicing(input: ScoreInput): ScoreResult {
  const { frets, quality, voicingType, tuningName, rootIndex } = input;
  const [f3, f2, f1] = frets;

  const pressed = frets.filter((f) => f > 0);
  const startFret = pressed.length > 0 ? Math.min(...pressed) : 0;
  const maxFret = pressed.length > 0 ? Math.max(...pressed) : 0;
  const openCount = 3 - pressed.length;
  const span = pressed.length > 0 ? maxFret - startFret : 0;

  let score = 0;

  // --- Open-string shapes (the bread and butter of CBG) ---
  if (openCount === 3) score += 120;
  else if (openCount === 2) score += 60;
  else if (openCount === 1) score += 28;

  // --- Voicing quality ---
  if (voicingType === 'full') score += 50;
  else if (voicingType === 'no5') score += 18;
  else if (voicingType === 'power') score += 8;
  else if (voicingType === 'no3') score += 20;
  else if (voicingType === 'sparse7') score += 5;
  else if (voicingType === 'rootless') score -= 60;

  // Power-5 shapes under Major/Minor are not the same chord — rank real triads first
  if ((quality === 'Major' || quality === 'Minor') && voicingType === 'power') {
    score -= 80;
  }

  // Incomplete major/minor triads (no 5th) are fallback shapes, not the primary voicing
  if ((quality === 'Major' || quality === 'Minor') && voicingType === 'no5') {
    score -= 18;
  }

  // Prefer proper 7th voicings over sparse shapes when both exist
  if ((quality === '7' || quality === 'm7') && voicingType === 'sparse7') {
    score -= 40;
  }

  // Full 7th chords deserve priority over partial blues shapes
  if ((quality === '7' || quality === 'm7') && voicingType === 'full') {
    score += 28;
  }

  // Full triads with open bass string (e.g. C major 0-2-5 on GDG) — very common teaching shape
  if (voicingType === 'full' && f3 === 0 && openCount >= 2) score += 35;

  // Full major/minor in low open position beats power 5 chords for the same root
  if (voicingType === 'full' && (quality === 'Major' || quality === 'Minor') && maxFret <= 5) {
    score += 25;
  }

  // --- One-finger barres ---
  if (f3 === f2 && f2 === f1 && pressed.length === 3) {
    score += 45; // [n,n,n] all-finger barre
  } else if (f3 === f2 && f1 === f3 + 3 && (quality === '7' || quality === 'm7')) {
    score += 55; // classic blues 7th: barre + 3 on high string
  } else if (f3 === f2 && f1 === f3 + 5 && quality === 'sus4') {
    score += 50; // classic sus4: barre + 5 on high string
  } else if (f3 === f2 && f1 === f3 + 2 && quality === 'sus2') {
    score += 35; // sus2 barre (less common than open sus2)
  } else if (f3 === f2 && pressed.length >= 2) {
    score += 22; // partial barre on bass/mid
  }

  // --- Tuning-aware canonical "outer root" & "mid root" shapes ---
  const tuning = TUNING_STRINGS[tuningName];
  if (tuning) {
    const outer = getOuterFret(rootIndex, tuning.bass);
    const mid = getMidFret(rootIndex, tuning.mid);

    if (f3 === outer && f2 === outer && f1 === outer) score += 40;
    if (f3 === outer && f2 === outer && f1 === outer + 5 && quality === 'sus4') score += 45;
    if (f3 === mid && f2 === mid && f1 === mid + 2 && quality === 'sus4') score += 30;
    if (f3 === mid && f2 === mid && f1 === mid + 2 && quality === 'sus2') score += 30;

    // high-root sus: [outer-5, outer-2, outer] or octave variant
    const highRoot = outer < 5 ? outer + 12 : outer;
    if (f3 === highRoot - 5 && f2 === highRoot - 2 && f1 === highRoot && quality === 'sus4') {
      score += 38;
    }

    // Open sus shapes using open strings (e.g. G sus4 = 0-0-5, C sus4 = 0-3-5)
    if (quality === 'sus4' && f3 === 0 && maxFret <= 5) score += 30;
    if (quality === 'sus2' && f3 === 0 && openCount >= 2 && maxFret <= 7) score += 40;
  }

  // --- Playability / position ---
  score -= span * 4;

  if (maxFret <= 3) score += 18;
  else if (maxFret <= 5) score += 10;
  else if (maxFret <= 7) score += 0;
  else if (maxFret <= 9) score -= 30;
  else score -= 55;

  if (startFret > 5) score -= (startFret - 5) * 8;
  if (startFret > 8) score -= 25;

  const isEssential = score >= 130;

  let badge: string | undefined;
  if (voicingType === 'full') badge = 'Standard';
  else if (voicingType === 'power') badge = 'Power Shape';
  else if (voicingType === 'no5') badge = 'Easy';
  else if (voicingType === 'no3' || voicingType === 'sparse7') badge = 'Blues Shape';
  else if (voicingType === 'rootless') badge = 'Advanced';

  if (startFret > 7 && score < 100) {
    badge = 'High Position';
  } else if (openCount === 0 && badge === 'Standard') {
    badge = 'Movable';
  }

  return { score, isEssential, badge };
}

/** Sort comparator: higher score first; tie-break by lower fret position. */
export function compareCbgVoicings(
  a: { frets: [number, number, number]; score: number },
  b: { frets: [number, number, number]; score: number }
): number {
  if (b.score !== a.score) return b.score - a.score;
  const maxA = Math.max(...a.frets);
  const maxB = Math.max(...b.frets);
  if (maxA !== maxB) return maxA - maxB;
  const minA = Math.min(...a.frets.filter((f) => f > 0), 99);
  const minB = Math.min(...b.frets.filter((f) => f > 0), 99);
  return minA - minB;
}
