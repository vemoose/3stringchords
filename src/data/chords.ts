export type Finger = 1 | 2 | 3 | 4;

export interface Position {
  string: number;
  fret: number;
  finger: Finger;
}

export interface ChordVariation {
  id: string;
  startingFret: number;
  positions: Position[];
}

export interface Chord {
  id: string;
  root: string;
  quality: string;
  suffix: string;
  variations: ChordVariation[];
}

export const ROOT_NOTES = [
  { value: 'G', label: 'G' },
  { value: 'G#', label: 'G#' },
  { value: 'A', label: 'A' },
  { value: 'A#', label: 'A#' },
  { value: 'B', label: 'B' },
  { value: 'C', label: 'C' },
  { value: 'C#', label: 'C#' },
  { value: 'D', label: 'D' },
  { value: 'D#', label: 'D#' },
  { value: 'E', label: 'E' },
  { value: 'F', label: 'F' },
  { value: 'F#', label: 'F#' },
];

export const CHORD_QUALITIES = [
  { value: 'Power (5)', label: 'Power (5)', suffix: '5' },
  { value: 'Major', label: 'Major', suffix: '' },
  { value: 'Minor', label: 'Minor', suffix: 'm' },
  { value: '7', label: 'Dominant 7', suffix: '7' },
  { value: 'm7', label: 'Minor 7', suffix: 'm7' },
  { value: 'sus', label: 'Suspended', suffix: 'sus' },
];

export const ENHARMONIC_MAP: Record<string, string> = {
  'C#': 'Db',
  'D#': 'Eb',
  'F#': 'Gb',
  'G#': 'Ab',
  'A#': 'Bb'
};

export const formatChordName = (root: string, suffix: string): string => {
  const enharmonic = ENHARMONIC_MAP[root];
  if (enharmonic) {
    return `${root}${suffix} / ${enharmonic}${suffix}`;
  }
  return `${root}${suffix}`;
};

export type Tuning = 'GDG' | 'DAD' | 'EBE';

export const GDG_CHORDS: Chord[] = [
  {
    "id": "a_power",
    "root": "A",
    "suffix": "5",
    "quality": "Power (5)",
    "variations": [
      {
        "id": "barre",
        "startingFret": 1,
        "positions": [
          {
            "string": 3,
            "fret": 2,
            "finger": 1
          },
          {
            "string": 2,
            "fret": 2,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 2,
            "finger": 1
          }
        ]
      },
      {
        "id": "barre_high",
        "startingFret": 14,
        "positions": [
          {
            "string": 3,
            "fret": 14,
            "finger": 1
          },
          {
            "string": 2,
            "fret": 14,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 14,
            "finger": 1
          }
        ]
      }
    ]
  },
  {
    "id": "a_major",
    "root": "A",
    "suffix": "",
    "quality": "Major",
    "variations": [
      {
        "id": "user_primary",
        "startingFret": 2,
        "positions": [
          {
            "string": 3,
            "fret": 2,
            "finger": 1
          },
          {
            "string": 2,
            "fret": 2,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 2,
            "finger": 1
          }
        ]
      },
      {
        "id": "root_pos",
        "startingFret": 1,
        "positions": [
          {
            "string": 3,
            "fret": 2,
            "finger": 1
          },
          {
            "string": 2,
            "fret": 2,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 6,
            "finger": 4
          }
        ]
      },
      {
        "id": "2nd_inv",
        "startingFret": 6,
        "positions": [
          {
            "string": 3,
            "fret": 9,
            "finger": 3
          },
          {
            "string": 2,
            "fret": 7,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 6,
            "finger": 2
          }
        ]
      }
    ]
  },
  {
    "id": "a_minor",
    "root": "A",
    "suffix": "m",
    "quality": "Minor",
    "variations": [
      {
        "id": "user_primary",
        "startingFret": 2,
        "positions": [
          {
            "string": 3,
            "fret": 5,
            "finger": 4
          },
          {
            "string": 2,
            "fret": 2,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 2,
            "finger": 1
          }
        ]
      },
      {
        "id": "pdf_minor",
        "startingFret": 1,
        "positions": [
          {
            "string": 3,
            "fret": 2,
            "finger": 1
          },
          {
            "string": 2,
            "fret": 2,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 5,
            "finger": 3
          }
        ]
      }
    ]
  },
  {
    "id": "a_7",
    "root": "A",
    "suffix": "7",
    "quality": "7",
    "variations": [
      {
        "id": "user_primary",
        "startingFret": 9,
        "positions": [
          {
            "string": 3,
            "fret": 12,
            "finger": 4
          },
          {
            "string": 2,
            "fret": 11,
            "finger": 3
          },
          {
            "string": 1,
            "fret": 9,
            "finger": 1
          }
        ]
      }
    ]
  },
  {
    "id": "a_m7",
    "root": "A",
    "suffix": "m7",
    "quality": "m7",
    "variations": [
      {
        "id": "root_m7",
        "startingFret": 10,
        "positions": [
          {
            "string": 3,
            "fret": 14,
            "finger": 4
          },
          {
            "string": 2,
            "fret": 10,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 12,
            "finger": 2
          }
        ]
      }
    ]
  },
  {
    "id": "asharp_power",
    "root": "A#",
    "suffix": "5",
    "quality": "Power (5)",
    "variations": [
      {
        "id": "barre",
        "startingFret": 1,
        "positions": [
          {
            "string": 3,
            "fret": 3,
            "finger": 1
          },
          {
            "string": 2,
            "fret": 3,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 3,
            "finger": 1
          }
        ]
      },
      {
        "id": "barre_high",
        "startingFret": 15,
        "positions": [
          {
            "string": 3,
            "fret": 15,
            "finger": 1
          },
          {
            "string": 2,
            "fret": 15,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 15,
            "finger": 1
          }
        ]
      }
    ]
  },
  {
    "id": "asharp_major",
    "root": "A#",
    "suffix": "",
    "quality": "Major",
    "variations": [
      {
        "id": "user_primary",
        "startingFret": 3,
        "positions": [
          {
            "string": 3,
            "fret": 3,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 3,
            "finger": 1
          },
          {
            "string": 2,
            "fret": 0,
            "finger": 1
          }
        ]
      },
      {
        "id": "root_pos",
        "startingFret": 1,
        "positions": [
          {
            "string": 3,
            "fret": 3,
            "finger": 1
          },
          {
            "string": 2,
            "fret": 3,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 7,
            "finger": 4
          }
        ]
      },
      {
        "id": "2nd_inv",
        "startingFret": 7,
        "positions": [
          {
            "string": 3,
            "fret": 10,
            "finger": 3
          },
          {
            "string": 2,
            "fret": 8,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 7,
            "finger": 2
          }
        ]
      }
    ]
  },
  {
    "id": "asharp_minor",
    "root": "A#",
    "suffix": "m",
    "quality": "Minor",
    "variations": [
      {
        "id": "user_primary",
        "startingFret": 3,
        "positions": [
          {
            "string": 3,
            "fret": 6,
            "finger": 4
          },
          {
            "string": 2,
            "fret": 3,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 3,
            "finger": 1
          }
        ]
      },
      {
        "id": "user_default",
        "startingFret": 3,
        "positions": [
          {
            "string": 3,
            "fret": 3,
            "finger": 1
          },
          {
            "string": 2,
            "fret": 3,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 6,
            "finger": 4
          }
        ]
      },
      {
        "id": "2nd_inv",
        "startingFret": 6,
        "positions": [
          {
            "string": 3,
            "fret": 10,
            "finger": 3
          },
          {
            "string": 2,
            "fret": 8,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 6,
            "finger": 2
          }
        ]
      }
    ]
  },
  {
    "id": "asharp_7",
    "root": "A#",
    "suffix": "7",
    "quality": "7",
    "variations": [
      {
        "id": "user_primary",
        "startingFret": 1,
        "positions": [
          {
            "string": 3,
            "fret": 1,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 3,
            "finger": 3
          },
          {
            "string": 2,
            "fret": 0,
            "finger": 1
          }
        ]
      },
      {
        "id": "pdf_primary",
        "startingFret": 1,
        "positions": [
          {
            "string": 3,
            "fret": 1,
            "finger": 2
          },
          {
            "string": 1,
            "fret": 1,
            "finger": 3
          }
        ]
      },
      {
        "id": "root_7",
        "startingFret": 3,
        "positions": [
          {
            "string": 3,
            "fret": 3,
            "finger": 3
          },
          {
            "string": 2,
            "fret": 3,
            "finger": 2
          },
          {
            "string": 1,
            "fret": 1,
            "finger": 1
          }
        ]
      }
    ]
  },
  {
    "id": "b_power",
    "root": "B",
    "suffix": "5",
    "quality": "Power (5)",
    "variations": [
      {
        "id": "barre",
        "startingFret": 4,
        "positions": [
          {
            "string": 3,
            "fret": 4,
            "finger": 1
          },
          {
            "string": 2,
            "fret": 4,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 4,
            "finger": 1
          }
        ]
      }
    ]
  },
  {
    "id": "b_major",
    "root": "B",
    "suffix": "",
    "quality": "Major",
    "variations": [
      {
        "id": "user_primary",
        "startingFret": 4,
        "positions": [
          {
            "string": 3,
            "fret": 4,
            "finger": 1
          },
          {
            "string": 2,
            "fret": 4,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 4,
            "finger": 1
          }
        ]
      },
      {
        "id": "root_pos",
        "startingFret": 4,
        "positions": [
          {
            "string": 3,
            "fret": 4,
            "finger": 1
          },
          {
            "string": 2,
            "fret": 4,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 8,
            "finger": 4
          }
        ]
      },
      {
        "id": "2nd_inv",
        "startingFret": 8,
        "positions": [
          {
            "string": 3,
            "fret": 11,
            "finger": 3
          },
          {
            "string": 2,
            "fret": 9,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 8,
            "finger": 2
          }
        ]
      }
    ]
  },
  {
    "id": "b_minor",
    "root": "B",
    "suffix": "m",
    "quality": "Minor",
    "variations": [
      {
        "id": "user_primary",
        "startingFret": 4,
        "positions": [
          {
            "string": 3,
            "fret": 4,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 4,
            "finger": 2
          },
          {
            "string": 2,
            "fret": 0,
            "finger": 1
          }
        ]
      },
      {
        "id": "pdf_minor",
        "startingFret": 4,
        "positions": [
          {
            "string": 3,
            "fret": 4,
            "finger": 1
          },
          {
            "string": 2,
            "fret": 4,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 7,
            "finger": 3
          }
        ]
      },
      {
        "id": "2nd_inv",
        "startingFret": 7,
        "positions": [
          {
            "string": 3,
            "fret": 11,
            "finger": 3
          },
          {
            "string": 2,
            "fret": 9,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 7,
            "finger": 2
          }
        ]
      }
    ]
  },
  {
    "id": "b_7",
    "root": "B",
    "suffix": "7",
    "quality": "7",
    "variations": [
      {
        "id": "user_primary",
        "startingFret": 1,
        "positions": [
          {
            "string": 3,
            "fret": 2,
            "finger": 2
          },
          {
            "string": 2,
            "fret": 1,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 4,
            "finger": 4
          }
        ]
      },
      {
        "id": "pdf_primary",
        "startingFret": 1,
        "positions": [
          {
            "string": 3,
            "fret": 2,
            "finger": 2
          },
          {
            "string": 2,
            "fret": 1,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 2,
            "finger": 3
          }
        ]
      },
      {
        "id": "root_7",
        "startingFret": 1,
        "positions": [
          {
            "string": 3,
            "fret": 4,
            "finger": 3
          },
          {
            "string": 2,
            "fret": 1,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 2,
            "finger": 2
          }
        ]
      }
    ]
  },
  {
    "id": "b_m7",
    "root": "B",
    "suffix": "m7",
    "quality": "m7",
    "variations": [
      {
        "id": "root_m7",
        "startingFret": 1,
        "positions": [
          {
            "string": 3,
            "fret": 4,
            "finger": 4
          },
          {
            "string": 2,
            "fret": 0,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 2,
            "finger": 2
          }
        ]
      }
    ]
  },
  {
    "id": "c_power",
    "root": "C",
    "suffix": "5",
    "quality": "Power (5)",
    "variations": [
      {
        "id": "barre",
        "startingFret": 5,
        "positions": [
          {
            "string": 3,
            "fret": 5,
            "finger": 1
          },
          {
            "string": 2,
            "fret": 5,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 5,
            "finger": 1
          }
        ]
      }
    ]
  },
  {
    "id": "c_major",
    "root": "C",
    "suffix": "",
    "quality": "Major",
    "variations": [
      {
        "id": "user_primary",
        "startingFret": 2,
        "positions": [
          {
            "string": 2,
            "fret": 2,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 5,
            "finger": 4
          },
          {
            "string": 3,
            "fret": 0,
            "finger": 1
          }
        ]
      },
      {
        "id": "pdf_major",
        "startingFret": 2,
        "positions": [
          {
            "string": 3,
            "fret": 5,
            "finger": 4
          },
          {
            "string": 2,
            "fret": 2,
            "finger": 2
          },
          {
            "string": 1,
            "fret": 0,
            "finger": 1
          }
        ]
      },
      {
        "id": "root_pos",
        "startingFret": 5,
        "positions": [
          {
            "string": 3,
            "fret": 5,
            "finger": 1
          },
          {
            "string": 2,
            "fret": 5,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 9,
            "finger": 4
          }
        ]
      },
      {
        "id": "2nd_inv",
        "startingFret": 9,
        "positions": [
          {
            "string": 3,
            "fret": 12,
            "finger": 3
          },
          {
            "string": 2,
            "fret": 10,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 9,
            "finger": 2
          }
        ]
      }
    ]
  },
  {
    "id": "c_minor",
    "root": "C",
    "suffix": "m",
    "quality": "Minor",
    "variations": [
      {
        "id": "user_primary",
        "startingFret": 5,
        "positions": [
          {
            "string": 3,
            "fret": 8,
            "finger": 4
          },
          {
            "string": 2,
            "fret": 5,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 5,
            "finger": 1
          }
        ]
      },
      {
        "id": "pdf_minor",
        "startingFret": 5,
        "positions": [
          {
            "string": 3,
            "fret": 5,
            "finger": 1
          },
          {
            "string": 2,
            "fret": 5,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 8,
            "finger": 3
          }
        ]
      },
      {
        "id": "2nd_inv",
        "startingFret": 8,
        "positions": [
          {
            "string": 3,
            "fret": 12,
            "finger": 3
          },
          {
            "string": 2,
            "fret": 10,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 8,
            "finger": 2
          }
        ]
      }
    ]
  },
  {
    "id": "c_7",
    "root": "C",
    "suffix": "7",
    "quality": "7",
    "variations": [
      {
        "id": "user_primary",
        "startingFret": 2,
        "positions": [
          {
            "string": 3,
            "fret": 3,
            "finger": 2
          },
          {
            "string": 2,
            "fret": 2,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 0,
            "finger": 1
          }
        ]
      },
      {
        "id": "pdf_primary",
        "startingFret": 2,
        "positions": [
          {
            "string": 3,
            "fret": 3,
            "finger": 2
          },
          {
            "string": 2,
            "fret": 2,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 3,
            "finger": 3
          }
        ]
      }
    ]
  },
  {
    "id": "c_m7",
    "root": "C",
    "suffix": "m7",
    "quality": "m7",
    "variations": [
      {
        "id": "root_m7",
        "startingFret": 1,
        "positions": [
          {
            "string": 3,
            "fret": 5,
            "finger": 4
          },
          {
            "string": 2,
            "fret": 1,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 3,
            "finger": 2
          }
        ]
      }
    ]
  },
  {
    "id": "csharp_power",
    "root": "C#",
    "suffix": "5",
    "quality": "Power (5)",
    "variations": [
      {
        "id": "barre",
        "startingFret": 6,
        "positions": [
          {
            "string": 3,
            "fret": 6,
            "finger": 1
          },
          {
            "string": 2,
            "fret": 6,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 6,
            "finger": 1
          }
        ]
      }
    ]
  },
  {
    "id": "csharp_major",
    "root": "C#",
    "suffix": "",
    "quality": "Major",
    "variations": [
      {
        "id": "user_primary",
        "startingFret": 6,
        "positions": [
          {
            "string": 3,
            "fret": 6,
            "finger": 1
          },
          {
            "string": 2,
            "fret": 6,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 6,
            "finger": 1
          }
        ]
      },
      {
        "id": "root_pos",
        "startingFret": 6,
        "positions": [
          {
            "string": 3,
            "fret": 6,
            "finger": 1
          },
          {
            "string": 2,
            "fret": 6,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 10,
            "finger": 4
          }
        ]
      },
      {
        "id": "2nd_inv",
        "startingFret": 10,
        "positions": [
          {
            "string": 3,
            "fret": 13,
            "finger": 3
          },
          {
            "string": 2,
            "fret": 11,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 10,
            "finger": 2
          }
        ]
      }
    ]
  },
  {
    "id": "csharp_minor",
    "root": "C#",
    "suffix": "m",
    "quality": "Minor",
    "variations": [
      {
        "id": "user_primary",
        "startingFret": 6,
        "positions": [
          {
            "string": 3,
            "fret": 9,
            "finger": 4
          },
          {
            "string": 2,
            "fret": 6,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 6,
            "finger": 1
          }
        ]
      },
      {
        "id": "pdf_minor",
        "startingFret": 6,
        "positions": [
          {
            "string": 3,
            "fret": 6,
            "finger": 1
          },
          {
            "string": 2,
            "fret": 6,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 9,
            "finger": 3
          }
        ]
      },
      {
        "id": "2nd_inv",
        "startingFret": 9,
        "positions": [
          {
            "string": 3,
            "fret": 13,
            "finger": 3
          },
          {
            "string": 2,
            "fret": 11,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 9,
            "finger": 2
          }
        ]
      }
    ]
  },
  {
    "id": "csharp_7",
    "root": "C#",
    "suffix": "7",
    "quality": "7",
    "variations": [
      {
        "id": "user_primary",
        "startingFret": 1,
        "positions": [
          {
            "string": 3,
            "fret": 4,
            "finger": 4
          },
          {
            "string": 2,
            "fret": 3,
            "finger": 2
          },
          {
            "string": 1,
            "fret": 1,
            "finger": 1
          }
        ]
      },
      {
        "id": "pdf_primary",
        "startingFret": 3,
        "positions": [
          {
            "string": 3,
            "fret": 4,
            "finger": 2
          },
          {
            "string": 2,
            "fret": 3,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 4,
            "finger": 3
          }
        ]
      },
      {
        "id": "root_7",
        "startingFret": 1,
        "positions": [
          {
            "string": 3,
            "fret": 6,
            "finger": 3
          },
          {
            "string": 2,
            "fret": 3,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 4,
            "finger": 2
          }
        ]
      }
    ]
  },
  {
    "id": "csharp_m7",
    "root": "C#",
    "suffix": "m7",
    "quality": "m7",
    "variations": [
      {
        "id": "root_m7",
        "startingFret": 1,
        "positions": [
          {
            "string": 3,
            "fret": 6,
            "finger": 4
          },
          {
            "string": 2,
            "fret": 2,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 4,
            "finger": 2
          }
        ]
      }
    ]
  },
  {
    "id": "d_power",
    "root": "D",
    "suffix": "5",
    "quality": "Power (5)",
    "variations": [
      {
        "id": "barre",
        "startingFret": 7,
        "positions": [
          {
            "string": 3,
            "fret": 7,
            "finger": 1
          },
          {
            "string": 2,
            "fret": 7,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 7,
            "finger": 1
          }
        ]
      }
    ]
  },
  {
    "id": "d_major",
    "root": "D",
    "suffix": "",
    "quality": "Major",
    "variations": [
      {
        "id": "user_primary",
        "startingFret": 2,
        "positions": [
          {
            "string": 3,
            "fret": 2,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 2,
            "finger": 2
          },
          {
            "string": 2,
            "fret": 0,
            "finger": 1
          }
        ]
      },
      {
        "id": "pdf_major",
        "startingFret": 4,
        "positions": [
          {
            "string": 3,
            "fret": 7,
            "finger": 3
          },
          {
            "string": 2,
            "fret": 4,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 7,
            "finger": 4
          }
        ]
      },
      {
        "id": "root_pos",
        "startingFret": 7,
        "positions": [
          {
            "string": 3,
            "fret": 7,
            "finger": 1
          },
          {
            "string": 2,
            "fret": 7,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 11,
            "finger": 4
          }
        ]
      },
      {
        "id": "2nd_inv",
        "startingFret": 11,
        "positions": [
          {
            "string": 3,
            "fret": 14,
            "finger": 3
          },
          {
            "string": 2,
            "fret": 12,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 11,
            "finger": 2
          }
        ]
      }
    ]
  },
  {
    "id": "d_minor",
    "root": "D",
    "suffix": "m",
    "quality": "Minor",
    "variations": [
      {
        "id": "user_primary",
        "startingFret": 7,
        "positions": [
          {
            "string": 3,
            "fret": 10,
            "finger": 4
          },
          {
            "string": 2,
            "fret": 7,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 7,
            "finger": 1
          }
        ]
      },
      {
        "id": "pdf_minor",
        "startingFret": 7,
        "positions": [
          {
            "string": 3,
            "fret": 7,
            "finger": 1
          },
          {
            "string": 2,
            "fret": 7,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 10,
            "finger": 3
          }
        ]
      },
      {
        "id": "2nd_inv",
        "startingFret": 10,
        "positions": [
          {
            "string": 3,
            "fret": 14,
            "finger": 3
          },
          {
            "string": 2,
            "fret": 12,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 10,
            "finger": 2
          }
        ]
      }
    ]
  },
  {
    "id": "d_7",
    "root": "D",
    "suffix": "7",
    "quality": "7",
    "variations": [
      {
        "id": "user_primary",
        "startingFret": 4,
        "positions": [
          {
            "string": 3,
            "fret": 5,
            "finger": 2
          },
          {
            "string": 2,
            "fret": 4,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 7,
            "finger": 4
          }
        ]
      },
      {
        "id": "pdf_primary",
        "startingFret": 4,
        "positions": [
          {
            "string": 3,
            "fret": 5,
            "finger": 2
          },
          {
            "string": 2,
            "fret": 4,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 5,
            "finger": 3
          }
        ]
      },
      {
        "id": "root_7",
        "startingFret": 4,
        "positions": [
          {
            "string": 3,
            "fret": 7,
            "finger": 3
          },
          {
            "string": 2,
            "fret": 4,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 5,
            "finger": 2
          }
        ]
      }
    ]
  },
  {
    "id": "d_m7",
    "root": "D",
    "suffix": "m7",
    "quality": "m7",
    "variations": [
      {
        "id": "root_m7",
        "startingFret": 1,
        "positions": [
          {
            "string": 3,
            "fret": 7,
            "finger": 4
          },
          {
            "string": 2,
            "fret": 3,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 5,
            "finger": 2
          }
        ]
      }
    ]
  },
  {
    "id": "dsharp_power",
    "root": "D#",
    "suffix": "5",
    "quality": "Power (5)",
    "variations": [
      {
        "id": "barre",
        "startingFret": 8,
        "positions": [
          {
            "string": 3,
            "fret": 8,
            "finger": 1
          },
          {
            "string": 2,
            "fret": 8,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 8,
            "finger": 1
          }
        ]
      }
    ]
  },
  {
    "id": "dsharp_major",
    "root": "D#",
    "suffix": "",
    "quality": "Major",
    "variations": [
      {
        "id": "user_primary",
        "startingFret": 1,
        "positions": [
          {
            "string": 3,
            "fret": 3,
            "finger": 3
          },
          {
            "string": 2,
            "fret": 1,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 0,
            "finger": 1
          }
        ]
      },
      {
        "id": "root_pos",
        "startingFret": 8,
        "positions": [
          {
            "string": 3,
            "fret": 8,
            "finger": 1
          },
          {
            "string": 2,
            "fret": 8,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 12,
            "finger": 4
          }
        ]
      }
    ]
  },
  {
    "id": "dsharp_minor",
    "root": "D#",
    "suffix": "m",
    "quality": "Minor",
    "variations": [
      {
        "id": "user_primary",
        "startingFret": 8,
        "positions": [
          {
            "string": 3,
            "fret": 11,
            "finger": 4
          },
          {
            "string": 2,
            "fret": 8,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 8,
            "finger": 1
          }
        ]
      },
      {
        "id": "pdf_minor",
        "startingFret": 8,
        "positions": [
          {
            "string": 3,
            "fret": 8,
            "finger": 1
          },
          {
            "string": 2,
            "fret": 8,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 11,
            "finger": 3
          }
        ]
      },
      {
        "id": "2nd_inv",
        "startingFret": 11,
        "positions": [
          {
            "string": 3,
            "fret": 15,
            "finger": 3
          },
          {
            "string": 2,
            "fret": 13,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 11,
            "finger": 2
          }
        ]
      }
    ]
  },
  {
    "id": "dsharp_7",
    "root": "D#",
    "suffix": "7",
    "quality": "7",
    "variations": [
      {
        "id": "user_primary",
        "startingFret": 3,
        "positions": [
          {
            "string": 3,
            "fret": 6,
            "finger": 4
          },
          {
            "string": 2,
            "fret": 5,
            "finger": 3
          },
          {
            "string": 1,
            "fret": 3,
            "finger": 1
          }
        ]
      },
      {
        "id": "pdf_primary",
        "startingFret": 5,
        "positions": [
          {
            "string": 3,
            "fret": 6,
            "finger": 2
          },
          {
            "string": 2,
            "fret": 5,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 6,
            "finger": 3
          }
        ]
      },
      {
        "id": "root_7",
        "startingFret": 5,
        "positions": [
          {
            "string": 3,
            "fret": 8,
            "finger": 3
          },
          {
            "string": 2,
            "fret": 5,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 6,
            "finger": 2
          }
        ]
      }
    ]
  },
  {
    "id": "dsharp_m7",
    "root": "D#",
    "suffix": "m7",
    "quality": "m7",
    "variations": [
      {
        "id": "root_m7",
        "startingFret": 4,
        "positions": [
          {
            "string": 3,
            "fret": 8,
            "finger": 4
          },
          {
            "string": 2,
            "fret": 4,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 6,
            "finger": 2
          }
        ]
      }
    ]
  },
  {
    "id": "e_power",
    "root": "E",
    "suffix": "5",
    "quality": "Power (5)",
    "variations": [
      {
        "id": "barre",
        "startingFret": 9,
        "positions": [
          {
            "string": 3,
            "fret": 9,
            "finger": 1
          },
          {
            "string": 2,
            "fret": 9,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 9,
            "finger": 1
          }
        ]
      }
    ]
  },
  {
    "id": "e_major",
    "root": "E",
    "suffix": "",
    "quality": "Major",
    "variations": [
      {
        "id": "user_primary",
        "startingFret": 1,
        "positions": [
          {
            "string": 3,
            "fret": 4,
            "finger": 4
          },
          {
            "string": 2,
            "fret": 2,
            "finger": 2
          },
          {
            "string": 1,
            "fret": 1,
            "finger": 1
          }
        ]
      },
      {
        "id": "pdf_major",
        "startingFret": 6,
        "positions": [
          {
            "string": 3,
            "fret": 9,
            "finger": 3
          },
          {
            "string": 2,
            "fret": 6,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 9,
            "finger": 4
          }
        ]
      },
      {
        "id": "root_pos",
        "startingFret": 9,
        "positions": [
          {
            "string": 3,
            "fret": 9,
            "finger": 1
          },
          {
            "string": 2,
            "fret": 9,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 13,
            "finger": 4
          }
        ]
      }
    ]
  },
  {
    "id": "e_minor",
    "root": "E",
    "suffix": "m",
    "quality": "Minor",
    "variations": [
      {
        "id": "user_primary",
        "startingFret": 1,
        "positions": [
          {
            "string": 3,
            "fret": 4,
            "finger": 3
          },
          {
            "string": 2,
            "fret": 2,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 0,
            "finger": 1
          }
        ]
      },
      {
        "id": "pdf_minor",
        "startingFret": 2,
        "positions": [
          {
            "string": 2,
            "fret": 2,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 4,
            "finger": 3
          },
          {
            "string": 3,
            "fret": 0,
            "finger": 1
          }
        ]
      },
      {
        "id": "pdf_primary",
        "startingFret": 2,
        "positions": [
          {
            "string": 2,
            "fret": 2,
            "finger": 2
          }
        ]
      },
      {
        "id": "root_pos",
        "startingFret": 9,
        "positions": [
          {
            "string": 3,
            "fret": 9,
            "finger": 1
          },
          {
            "string": 2,
            "fret": 9,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 12,
            "finger": 3
          }
        ]
      }
    ]
  },
  {
    "id": "e_7",
    "root": "E",
    "suffix": "7",
    "quality": "7",
    "variations": [
      {
        "id": "user_primary",
        "startingFret": 6,
        "positions": [
          {
            "string": 3,
            "fret": 7,
            "finger": 2
          },
          {
            "string": 2,
            "fret": 6,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 9,
            "finger": 4
          }
        ]
      },
      {
        "id": "pdf_primary",
        "startingFret": 6,
        "positions": [
          {
            "string": 3,
            "fret": 7,
            "finger": 2
          },
          {
            "string": 2,
            "fret": 6,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 7,
            "finger": 3
          }
        ]
      },
      {
        "id": "alt_7",
        "startingFret": 1,
        "positions": [
          {
            "string": 3,
            "fret": 1,
            "finger": 1
          },
          {
            "string": 2,
            "fret": 0,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 1,
            "finger": 2
          }
        ]
      },
      {
        "id": "root_7",
        "startingFret": 6,
        "positions": [
          {
            "string": 3,
            "fret": 9,
            "finger": 3
          },
          {
            "string": 2,
            "fret": 6,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 7,
            "finger": 2
          }
        ]
      }
    ]
  },
  {
    "id": "e_m7",
    "root": "E",
    "suffix": "m7",
    "quality": "m7",
    "variations": [
      {
        "id": "root_m7",
        "startingFret": 5,
        "positions": [
          {
            "string": 3,
            "fret": 9,
            "finger": 4
          },
          {
            "string": 2,
            "fret": 5,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 7,
            "finger": 2
          }
        ]
      }
    ]
  },
  {
    "id": "f_power",
    "root": "F",
    "suffix": "5",
    "quality": "Power (5)",
    "variations": [
      {
        "id": "barre",
        "startingFret": 10,
        "positions": [
          {
            "string": 3,
            "fret": 10,
            "finger": 1
          },
          {
            "string": 2,
            "fret": 10,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 10,
            "finger": 1
          }
        ]
      }
    ]
  },
  {
    "id": "f_major",
    "root": "F",
    "suffix": "",
    "quality": "Major",
    "variations": [
      {
        "id": "user_primary",
        "startingFret": 2,
        "positions": [
          {
            "string": 3,
            "fret": 2,
            "finger": 1
          },
          {
            "string": 2,
            "fret": 3,
            "finger": 2
          },
          {
            "string": 1,
            "fret": 5,
            "finger": 4
          }
        ]
      },
      {
        "id": "pdf_major",
        "startingFret": 1,
        "positions": [
          {
            "string": 3,
            "fret": 5,
            "finger": 3
          },
          {
            "string": 2,
            "fret": 3,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 2,
            "finger": 2
          }
        ]
      },
      {
        "id": "root_pos",
        "startingFret": 10,
        "positions": [
          {
            "string": 3,
            "fret": 10,
            "finger": 1
          },
          {
            "string": 2,
            "fret": 10,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 14,
            "finger": 4
          }
        ]
      }
    ]
  },
  {
    "id": "f_minor",
    "root": "F",
    "suffix": "m",
    "quality": "Minor",
    "variations": [
      {
        "id": "user_primary",
        "startingFret": 1,
        "positions": [
          {
            "string": 3,
            "fret": 1,
            "finger": 1
          },
          {
            "string": 2,
            "fret": 3,
            "finger": 2
          },
          {
            "string": 1,
            "fret": 5,
            "finger": 4
          }
        ]
      },
      {
        "id": "2nd_inv",
        "startingFret": 1,
        "positions": [
          {
            "string": 3,
            "fret": 5,
            "finger": 4
          },
          {
            "string": 2,
            "fret": 3,
            "finger": 2
          },
          {
            "string": 1,
            "fret": 1,
            "finger": 1
          }
        ]
      },
      {
        "id": "pdf_minor",
        "startingFret": 10,
        "positions": [
          {
            "string": 3,
            "fret": 10,
            "finger": 1
          },
          {
            "string": 2,
            "fret": 10,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 13,
            "finger": 3
          }
        ]
      },
      {
        "id": "pdf_primary",
        "startingFret": 1,
        "positions": [
          {
            "string": 3,
            "fret": 1,
            "finger": 1
          },
          {
            "string": 2,
            "fret": 3,
            "finger": 2
          },
          {
            "string": 1,
            "fret": 1,
            "finger": 3
          }
        ]
      }
    ]
  },
  {
    "id": "f_7",
    "root": "F",
    "suffix": "7",
    "quality": "7",
    "variations": [
      {
        "id": "user_primary",
        "startingFret": 5,
        "positions": [
          {
            "string": 3,
            "fret": 8,
            "finger": 4
          },
          {
            "string": 2,
            "fret": 7,
            "finger": 3
          },
          {
            "string": 1,
            "fret": 5,
            "finger": 1
          }
        ]
      },
      {
        "id": "pdf_primary",
        "startingFret": 7,
        "positions": [
          {
            "string": 3,
            "fret": 8,
            "finger": 2
          },
          {
            "string": 2,
            "fret": 7,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 8,
            "finger": 3
          }
        ]
      },
      {
        "id": "alt_7",
        "startingFret": 1,
        "positions": [
          {
            "string": 3,
            "fret": 2,
            "finger": 2
          },
          {
            "string": 2,
            "fret": 1,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 2,
            "finger": 3
          }
        ]
      },
      {
        "id": "root_7",
        "startingFret": 7,
        "positions": [
          {
            "string": 3,
            "fret": 10,
            "finger": 3
          },
          {
            "string": 2,
            "fret": 7,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 8,
            "finger": 2
          }
        ]
      }
    ]
  },
  {
    "id": "f_m7",
    "root": "F",
    "suffix": "m7",
    "quality": "m7",
    "variations": [
      {
        "id": "root_m7",
        "startingFret": 6,
        "positions": [
          {
            "string": 3,
            "fret": 10,
            "finger": 4
          },
          {
            "string": 2,
            "fret": 6,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 8,
            "finger": 2
          }
        ]
      }
    ]
  },
  {
    "id": "fsharp_power",
    "root": "F#",
    "suffix": "5",
    "quality": "Power (5)",
    "variations": [
      {
        "id": "barre",
        "startingFret": 11,
        "positions": [
          {
            "string": 3,
            "fret": 11,
            "finger": 1
          },
          {
            "string": 2,
            "fret": 11,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 11,
            "finger": 1
          }
        ]
      }
    ]
  },
  {
    "id": "fsharp_major",
    "root": "F#",
    "suffix": "",
    "quality": "Major",
    "variations": [
      {
        "id": "user_primary",
        "startingFret": 3,
        "positions": [
          {
            "string": 3,
            "fret": 3,
            "finger": 1
          },
          {
            "string": 2,
            "fret": 4,
            "finger": 2
          },
          {
            "string": 1,
            "fret": 6,
            "finger": 4
          }
        ]
      },
      {
        "id": "user_default",
        "startingFret": 3,
        "positions": [
          {
            "string": 3,
            "fret": 6,
            "finger": 4
          },
          {
            "string": 2,
            "fret": 4,
            "finger": 2
          },
          {
            "string": 1,
            "fret": 3,
            "finger": 1
          }
        ]
      },
      {
        "id": "root_pos",
        "startingFret": 11,
        "positions": [
          {
            "string": 3,
            "fret": 11,
            "finger": 1
          },
          {
            "string": 2,
            "fret": 11,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 15,
            "finger": 4
          }
        ]
      }
    ]
  },
  {
    "id": "fsharp_minor",
    "root": "F#",
    "suffix": "m",
    "quality": "Minor",
    "variations": [
      {
        "id": "user_primary",
        "startingFret": 2,
        "positions": [
          {
            "string": 3,
            "fret": 2,
            "finger": 1
          },
          {
            "string": 2,
            "fret": 4,
            "finger": 2
          },
          {
            "string": 1,
            "fret": 6,
            "finger": 4
          }
        ]
      },
      {
        "id": "pdf_minor",
        "startingFret": 11,
        "positions": [
          {
            "string": 3,
            "fret": 11,
            "finger": 1
          },
          {
            "string": 2,
            "fret": 11,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 14,
            "finger": 3
          }
        ]
      },
      {
        "id": "pdf_primary",
        "startingFret": 2,
        "positions": [
          {
            "string": 3,
            "fret": 2,
            "finger": 1
          },
          {
            "string": 2,
            "fret": 4,
            "finger": 2
          },
          {
            "string": 1,
            "fret": 2,
            "finger": 3
          }
        ]
      },
      {
        "id": "2nd_inv",
        "startingFret": 1,
        "positions": [
          {
            "string": 3,
            "fret": 6,
            "finger": 3
          },
          {
            "string": 2,
            "fret": 4,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 2,
            "finger": 2
          }
        ]
      }
    ]
  },
  {
    "id": "fsharp_7",
    "root": "F#",
    "suffix": "7",
    "quality": "7",
    "variations": [
      {
        "id": "user_primary",
        "startingFret": 8,
        "positions": [
          {
            "string": 3,
            "fret": 9,
            "finger": 2
          },
          {
            "string": 2,
            "fret": 8,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 11,
            "finger": 4
          }
        ]
      },
      {
        "id": "pdf_primary",
        "startingFret": 8,
        "positions": [
          {
            "string": 3,
            "fret": 9,
            "finger": 2
          },
          {
            "string": 2,
            "fret": 8,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 9,
            "finger": 3
          }
        ]
      },
      {
        "id": "alt_7",
        "startingFret": 2,
        "positions": [
          {
            "string": 3,
            "fret": 3,
            "finger": 2
          },
          {
            "string": 2,
            "fret": 2,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 3,
            "finger": 3
          }
        ]
      },
      {
        "id": "root_7",
        "startingFret": 8,
        "positions": [
          {
            "string": 3,
            "fret": 11,
            "finger": 3
          },
          {
            "string": 2,
            "fret": 8,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 9,
            "finger": 2
          }
        ]
      }
    ]
  },
  {
    "id": "fsharp_m7",
    "root": "F#",
    "suffix": "m7",
    "quality": "m7",
    "variations": [
      {
        "id": "root_m7",
        "startingFret": 7,
        "positions": [
          {
            "string": 3,
            "fret": 11,
            "finger": 4
          },
          {
            "string": 2,
            "fret": 7,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 9,
            "finger": 2
          }
        ]
      }
    ]
  },
  {
    "id": "g_power",
    "root": "G",
    "suffix": "5",
    "quality": "Power (5)",
    "variations": [
      {
        "id": "barre",
        "startingFret": 1,
        "positions": [
          {
            "string": 3,
            "fret": 0,
            "finger": 1
          },
          {
            "string": 2,
            "fret": 0,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 0,
            "finger": 1
          }
        ]
      },
      {
        "id": "barre_high",
        "startingFret": 12,
        "positions": [
          {
            "string": 3,
            "fret": 12,
            "finger": 1
          },
          {
            "string": 2,
            "fret": 12,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 12,
            "finger": 1
          }
        ]
      }
    ]
  },
  {
    "id": "g_major",
    "root": "G",
    "suffix": "",
    "quality": "Major",
    "variations": [
      {
        "id": "user_primary",
        "startingFret": 4,
        "positions": [
          {
            "string": 3,
            "fret": 4,
            "finger": 1
          },
          {
            "string": 2,
            "fret": 0,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 0,
            "finger": 1
          }
        ]
      },
      {
        "id": "pdf_major",
        "startingFret": 4,
        "positions": [
          {
            "string": 3,
            "fret": 0,
            "finger": 1
          },
          {
            "string": 2,
            "fret": 0,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 4,
            "finger": 4
          }
        ]
      },
      {
        "id": "2nd_inv",
        "startingFret": 4,
        "positions": [
          {
            "string": 3,
            "fret": 7,
            "finger": 3
          },
          {
            "string": 2,
            "fret": 5,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 4,
            "finger": 2
          }
        ]
      }
    ]
  },
  {
    "id": "g_minor",
    "root": "G",
    "suffix": "m",
    "quality": "Minor",
    "variations": [
      {
        "id": "user_primary",
        "startingFret": 3,
        "positions": [
          {
            "string": 3,
            "fret": 3,
            "finger": 3
          },
          {
            "string": 2,
            "fret": 0,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 0,
            "finger": 1
          }
        ]
      },
      {
        "id": "pdf_primary",
        "startingFret": 3,
        "positions": [
          {
            "string": 3,
            "fret": 3,
            "finger": 1
          },
          {
            "string": 2,
            "fret": 5,
            "finger": 2
          },
          {
            "string": 1,
            "fret": 3,
            "finger": 3
          }
        ]
      },
      {
        "id": "root_pos",
        "startingFret": 1,
        "positions": [
          {
            "string": 3,
            "fret": 0,
            "finger": 1
          },
          {
            "string": 2,
            "fret": 0,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 3,
            "finger": 3
          }
        ]
      },
      {
        "id": "2nd_inv",
        "startingFret": 1,
        "positions": [
          {
            "string": 3,
            "fret": 7,
            "finger": 3
          },
          {
            "string": 2,
            "fret": 5,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 3,
            "finger": 2
          }
        ]
      }
    ]
  },
  {
    "id": "g_7",
    "root": "G",
    "suffix": "7",
    "quality": "7",
    "variations": [
      {
        "id": "user_primary",
        "startingFret": 3,
        "positions": [
          {
            "string": 3,
            "fret": 4,
            "finger": 2
          },
          {
            "string": 2,
            "fret": 3,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 0,
            "finger": 1
          }
        ]
      },
      {
        "id": "alt_7",
        "startingFret": 1,
        "positions": [
          {
            "string": 3,
            "fret": 0,
            "finger": 1
          },
          {
            "string": 2,
            "fret": 3,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 0,
            "finger": 1
          }
        ]
      },
      {
        "id": "root_7",
        "startingFret": 1,
        "positions": [
          {
            "string": 3,
            "fret": 0,
            "finger": 1
          },
          {
            "string": 2,
            "fret": 3,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 4,
            "finger": 2
          }
        ]
      }
    ]
  },
  {
    "id": "g_m7",
    "root": "G",
    "suffix": "m7",
    "quality": "m7",
    "variations": [
      {
        "id": "root_m7",
        "startingFret": 8,
        "positions": [
          {
            "string": 3,
            "fret": 12,
            "finger": 4
          },
          {
            "string": 2,
            "fret": 8,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 10,
            "finger": 2
          }
        ]
      }
    ]
  },
  {
    "id": "gsharp_power",
    "root": "G#",
    "suffix": "5",
    "quality": "Power (5)",
    "variations": [
      {
        "id": "barre",
        "startingFret": 1,
        "positions": [
          {
            "string": 3,
            "fret": 1,
            "finger": 1
          },
          {
            "string": 2,
            "fret": 1,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 1,
            "finger": 1
          }
        ]
      },
      {
        "id": "barre_high",
        "startingFret": 13,
        "positions": [
          {
            "string": 3,
            "fret": 13,
            "finger": 1
          },
          {
            "string": 2,
            "fret": 13,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 13,
            "finger": 1
          }
        ]
      }
    ]
  },
  {
    "id": "gsharp_major",
    "root": "G#",
    "suffix": "",
    "quality": "Major",
    "variations": [
      {
        "id": "user_primary",
        "startingFret": 1,
        "positions": [
          {
            "string": 3,
            "fret": 1,
            "finger": 1
          },
          {
            "string": 2,
            "fret": 1,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 1,
            "finger": 1
          }
        ]
      },
      {
        "id": "root_pos",
        "startingFret": 1,
        "positions": [
          {
            "string": 3,
            "fret": 1,
            "finger": 1
          },
          {
            "string": 2,
            "fret": 1,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 5,
            "finger": 4
          }
        ]
      },
      {
        "id": "2nd_inv",
        "startingFret": 5,
        "positions": [
          {
            "string": 3,
            "fret": 8,
            "finger": 3
          },
          {
            "string": 2,
            "fret": 6,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 5,
            "finger": 2
          }
        ]
      }
    ]
  },
  {
    "id": "gsharp_minor",
    "root": "G#",
    "suffix": "m",
    "quality": "Minor",
    "variations": [
      {
        "id": "user_primary",
        "startingFret": 1,
        "positions": [
          {
            "string": 3,
            "fret": 4,
            "finger": 4
          },
          {
            "string": 2,
            "fret": 1,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 1,
            "finger": 1
          }
        ]
      },
      {
        "id": "root_pos",
        "startingFret": 1,
        "positions": [
          {
            "string": 3,
            "fret": 1,
            "finger": 1
          },
          {
            "string": 2,
            "fret": 1,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 4,
            "finger": 3
          }
        ]
      },
      {
        "id": "2nd_inv",
        "startingFret": 4,
        "positions": [
          {
            "string": 3,
            "fret": 8,
            "finger": 3
          },
          {
            "string": 2,
            "fret": 6,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 4,
            "finger": 2
          }
        ]
      }
    ]
  },
  {
    "id": "gsharp_7",
    "root": "G#",
    "suffix": "7",
    "quality": "7",
    "variations": [
      {
        "id": "user_primary",
        "startingFret": 8,
        "positions": [
          {
            "string": 3,
            "fret": 11,
            "finger": 4
          },
          {
            "string": 2,
            "fret": 10,
            "finger": 3
          },
          {
            "string": 1,
            "fret": 8,
            "finger": 1
          }
        ]
      },
      {
        "id": "alt_7",
        "startingFret": 1,
        "positions": [
          {
            "string": 3,
            "fret": 1,
            "finger": 1
          },
          {
            "string": 2,
            "fret": 4,
            "finger": 3
          },
          {
            "string": 1,
            "fret": 1,
            "finger": 1
          }
        ]
      },
      {
        "id": "root_7",
        "startingFret": 1,
        "positions": [
          {
            "string": 3,
            "fret": 1,
            "finger": 1
          },
          {
            "string": 2,
            "fret": 4,
            "finger": 3
          },
          {
            "string": 1,
            "fret": 5,
            "finger": 4
          }
        ]
      }
    ]
  },
  {
    "id": "gsharp_m7",
    "root": "G#",
    "suffix": "m7",
    "quality": "m7",
    "variations": [
      {
        "id": "root_m7",
        "startingFret": 9,
        "positions": [
          {
            "string": 3,
            "fret": 13,
            "finger": 4
          },
          {
            "string": 2,
            "fret": 9,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 11,
            "finger": 2
          }
        ]
      }
    ]
  }
];

export const DAD_CHORDS: Chord[] = [
  {
    "id": "d_power5",
    "root": "D",
    "quality": "Power (5)",
    "suffix": "5",
    "variations": [
      {
        "id": "var_0_0_0",
        "startingFret": 1,
        "positions": [
          {
            "string": 3,
            "fret": 0,
            "finger": 1
          },
          {
            "string": 2,
            "fret": 0,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 0,
            "finger": 1
          }
        ]
      }
    ]
  },
  {
    "id": "dsharp_power5",
    "root": "D#",
    "quality": "Power (5)",
    "suffix": "5",
    "variations": [
      {
        "id": "var_1_1_1",
        "startingFret": 1,
        "positions": [
          {
            "string": 3,
            "fret": 1,
            "finger": 1
          },
          {
            "string": 2,
            "fret": 1,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 1,
            "finger": 1
          }
        ]
      }
    ]
  },
  {
    "id": "e_power5",
    "root": "E",
    "quality": "Power (5)",
    "suffix": "5",
    "variations": [
      {
        "id": "var_2_2_2",
        "startingFret": 1,
        "positions": [
          {
            "string": 3,
            "fret": 2,
            "finger": 1
          },
          {
            "string": 2,
            "fret": 2,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 2,
            "finger": 1
          }
        ]
      }
    ]
  },
  {
    "id": "f_power5",
    "root": "F",
    "quality": "Power (5)",
    "suffix": "5",
    "variations": [
      {
        "id": "var_3_3_3",
        "startingFret": 2,
        "positions": [
          {
            "string": 3,
            "fret": 3,
            "finger": 1
          },
          {
            "string": 2,
            "fret": 3,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 3,
            "finger": 1
          }
        ]
      },
      {
        "id": "var_x_3_3",
        "startingFret": 2,
        "positions": [
          {
            "string": 2,
            "fret": 3,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 3,
            "finger": 1
          }
        ]
      }
    ]
  },
  {
    "id": "fsharp_power5",
    "root": "F#",
    "quality": "Power (5)",
    "suffix": "5",
    "variations": [
      {
        "id": "var_4_4_4",
        "startingFret": 3,
        "positions": [
          {
            "string": 3,
            "fret": 4,
            "finger": 1
          },
          {
            "string": 2,
            "fret": 4,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 4,
            "finger": 1
          }
        ]
      }
    ]
  },
  {
    "id": "g_power5",
    "root": "G",
    "quality": "Power (5)",
    "suffix": "5",
    "variations": [
      {
        "id": "var_5_5_5",
        "startingFret": 4,
        "positions": [
          {
            "string": 3,
            "fret": 5,
            "finger": 1
          },
          {
            "string": 2,
            "fret": 5,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 5,
            "finger": 1
          }
        ]
      },
      {
        "id": "var_x_5_5",
        "startingFret": 4,
        "positions": [
          {
            "string": 2,
            "fret": 5,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 5,
            "finger": 1
          }
        ]
      }
    ]
  },
  {
    "id": "gsharp_power5",
    "root": "G#",
    "quality": "Power (5)",
    "suffix": "5",
    "variations": [
      {
        "id": "var_6_6_6",
        "startingFret": 5,
        "positions": [
          {
            "string": 3,
            "fret": 6,
            "finger": 1
          },
          {
            "string": 2,
            "fret": 6,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 6,
            "finger": 1
          }
        ]
      }
    ]
  },
  {
    "id": "a_power5",
    "root": "A",
    "quality": "Power (5)",
    "suffix": "5",
    "variations": [
      {
        "id": "var_7_7_7",
        "startingFret": 6,
        "positions": [
          {
            "string": 3,
            "fret": 7,
            "finger": 1
          },
          {
            "string": 2,
            "fret": 7,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 7,
            "finger": 1
          }
        ]
      },
      {
        "id": "var_2_0_2",
        "startingFret": 1,
        "positions": [
          {
            "string": 3,
            "fret": 2,
            "finger": 1
          },
          {
            "string": 2,
            "fret": 0,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 2,
            "finger": 1
          }
        ]
      }
    ]
  },
  {
    "id": "asharp_power5",
    "root": "A#",
    "quality": "Power (5)",
    "suffix": "5",
    "variations": [
      {
        "id": "var_8_8_8",
        "startingFret": 7,
        "positions": [
          {
            "string": 3,
            "fret": 8,
            "finger": 1
          },
          {
            "string": 2,
            "fret": 8,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 8,
            "finger": 1
          }
        ]
      }
    ]
  },
  {
    "id": "b_power5",
    "root": "B",
    "quality": "Power (5)",
    "suffix": "5",
    "variations": [
      {
        "id": "var_9_9_9",
        "startingFret": 8,
        "positions": [
          {
            "string": 3,
            "fret": 9,
            "finger": 1
          },
          {
            "string": 2,
            "fret": 9,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 9,
            "finger": 1
          }
        ]
      },
      {
        "id": "var_4_2_4",
        "startingFret": 1,
        "positions": [
          {
            "string": 3,
            "fret": 4,
            "finger": 3
          },
          {
            "string": 2,
            "fret": 2,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 4,
            "finger": 4
          }
        ]
      }
    ]
  },
  {
    "id": "c_power5",
    "root": "C",
    "quality": "Power (5)",
    "suffix": "5",
    "variations": [
      {
        "id": "var_10_10_10",
        "startingFret": 9,
        "positions": [
          {
            "string": 3,
            "fret": 10,
            "finger": 1
          },
          {
            "string": 2,
            "fret": 10,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 10,
            "finger": 1
          }
        ]
      },
      {
        "id": "var_5_3_5",
        "startingFret": 2,
        "positions": [
          {
            "string": 3,
            "fret": 5,
            "finger": 3
          },
          {
            "string": 2,
            "fret": 3,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 5,
            "finger": 4
          }
        ]
      }
    ]
  },
  {
    "id": "csharp_power5",
    "root": "C#",
    "quality": "Power (5)",
    "suffix": "5",
    "variations": [
      {
        "id": "var_11_11_11",
        "startingFret": 10,
        "positions": [
          {
            "string": 3,
            "fret": 11,
            "finger": 1
          },
          {
            "string": 2,
            "fret": 11,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 11,
            "finger": 1
          }
        ]
      }
    ]
  },
  {
    "id": "asharp_major",
    "root": "A#",
    "quality": "Major",
    "suffix": "",
    "variations": [
      {
        "id": "var_0_1_3",
        "startingFret": 1,
        "positions": [
          {
            "string": 3,
            "fret": 0,
            "finger": 1
          },
          {
            "string": 2,
            "fret": 1,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 3,
            "finger": 3
          }
        ]
      }
    ]
  },
  {
    "id": "a_minor",
    "root": "A",
    "quality": "Minor",
    "suffix": "m",
    "variations": [
      {
        "id": "var_7_7_10",
        "startingFret": 6,
        "positions": [
          {
            "string": 3,
            "fret": 7,
            "finger": 1
          },
          {
            "string": 2,
            "fret": 7,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 10,
            "finger": 4
          }
        ]
      }
    ]
  },
  {
    "id": "b_major",
    "root": "B",
    "quality": "Major",
    "suffix": "",
    "variations": [
      {
        "id": "var_1_2_4",
        "startingFret": 1,
        "positions": [
          {
            "string": 3,
            "fret": 1,
            "finger": 1
          },
          {
            "string": 2,
            "fret": 2,
            "finger": 2
          },
          {
            "string": 1,
            "fret": 4,
            "finger": 4
          }
        ]
      }
    ]
  },
  {
    "id": "b_minor",
    "root": "B",
    "quality": "Minor",
    "suffix": "m",
    "variations": [
      {
        "id": "var_0_2_4",
        "startingFret": 1,
        "positions": [
          {
            "string": 3,
            "fret": 0,
            "finger": 1
          },
          {
            "string": 2,
            "fret": 2,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 4,
            "finger": 3
          }
        ]
      }
    ]
  },
  {
    "id": "c_major",
    "root": "C",
    "quality": "Major",
    "suffix": "",
    "variations": [
      {
        "id": "var_2_3_5",
        "startingFret": 1,
        "positions": [
          {
            "string": 3,
            "fret": 2,
            "finger": 1
          },
          {
            "string": 2,
            "fret": 3,
            "finger": 2
          },
          {
            "string": 1,
            "fret": 5,
            "finger": 4
          }
        ]
      }
    ]
  },
  {
    "id": "c_minor",
    "root": "C",
    "quality": "Minor",
    "suffix": "m",
    "variations": [
      {
        "id": "var_1_3_5",
        "startingFret": 1,
        "positions": [
          {
            "string": 3,
            "fret": 1,
            "finger": 1
          },
          {
            "string": 2,
            "fret": 3,
            "finger": 3
          },
          {
            "string": 1,
            "fret": 5,
            "finger": 4
          }
        ]
      }
    ]
  },
  {
    "id": "d_major",
    "root": "D",
    "quality": "Major",
    "suffix": "",
    "variations": [
      {
        "id": "var_0_0_4",
        "startingFret": 3,
        "positions": [
          {
            "string": 3,
            "fret": 0,
            "finger": 1
          },
          {
            "string": 2,
            "fret": 0,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 4,
            "finger": 1
          }
        ]
      }
    ]
  },
  {
    "id": "d_minor",
    "root": "D",
    "quality": "Minor",
    "suffix": "m",
    "variations": [
      {
        "id": "var_0_0_3",
        "startingFret": 2,
        "positions": [
          {
            "string": 3,
            "fret": 0,
            "finger": 1
          },
          {
            "string": 2,
            "fret": 0,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 3,
            "finger": 1
          }
        ]
      }
    ]
  },
  {
    "id": "d_suspended",
    "root": "D",
    "quality": "Suspended",
    "suffix": "sus",
    "variations": [
      {
        "id": "var_0_0_5",
        "startingFret": 4,
        "positions": [
          {
            "string": 3,
            "fret": 0,
            "finger": 1
          },
          {
            "string": 2,
            "fret": 0,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 5,
            "finger": 1
          }
        ]
      }
    ]
  },
  {
    "id": "e_major",
    "root": "E",
    "quality": "Major",
    "suffix": "",
    "variations": [
      {
        "id": "var_2_2_6",
        "startingFret": 1,
        "positions": [
          {
            "string": 3,
            "fret": 2,
            "finger": 1
          },
          {
            "string": 2,
            "fret": 2,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 6,
            "finger": 4
          }
        ]
      }
    ]
  },
  {
    "id": "e_minor",
    "root": "E",
    "quality": "Minor",
    "suffix": "m",
    "variations": [
      {
        "id": "var_2_2_5",
        "startingFret": 1,
        "positions": [
          {
            "string": 3,
            "fret": 2,
            "finger": 1
          },
          {
            "string": 2,
            "fret": 2,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 5,
            "finger": 4
          }
        ]
      }
    ]
  },
  {
    "id": "e_suspended",
    "root": "E",
    "quality": "Suspended",
    "suffix": "sus",
    "variations": [
      {
        "id": "var_7_7_9",
        "startingFret": 6,
        "positions": [
          {
            "string": 3,
            "fret": 7,
            "finger": 1
          },
          {
            "string": 2,
            "fret": 7,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 9,
            "finger": 3
          }
        ]
      }
    ]
  },
  {
    "id": "f_major",
    "root": "F",
    "quality": "Major",
    "suffix": "",
    "variations": [
      {
        "id": "var_7_8_10",
        "startingFret": 6,
        "positions": [
          {
            "string": 3,
            "fret": 7,
            "finger": 1
          },
          {
            "string": 2,
            "fret": 8,
            "finger": 2
          },
          {
            "string": 1,
            "fret": 10,
            "finger": 4
          }
        ]
      }
    ]
  },
  {
    "id": "f_minor",
    "root": "F",
    "quality": "Minor",
    "suffix": "m",
    "variations": [
      {
        "id": "var_6_8_10",
        "startingFret": 5,
        "positions": [
          {
            "string": 3,
            "fret": 6,
            "finger": 1
          },
          {
            "string": 2,
            "fret": 8,
            "finger": 3
          },
          {
            "string": 1,
            "fret": 10,
            "finger": 4
          }
        ]
      }
    ]
  },
  {
    "id": "g_major",
    "root": "G",
    "quality": "Major",
    "suffix": "",
    "variations": [
      {
        "id": "var_0_2_5",
        "startingFret": 1,
        "positions": [
          {
            "string": 3,
            "fret": 0,
            "finger": 1
          },
          {
            "string": 2,
            "fret": 2,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 5,
            "finger": 4
          }
        ]
      },
      {
        "id": "var_5_5_9",
        "startingFret": 4,
        "positions": [
          {
            "string": 3,
            "fret": 5,
            "finger": 1
          },
          {
            "string": 2,
            "fret": 5,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 9,
            "finger": 4
          }
        ]
      }
    ]
  },
  {
    "id": "g_minor",
    "root": "G",
    "quality": "Minor",
    "suffix": "m",
    "variations": [
      {
        "id": "var_0_1_5",
        "startingFret": 1,
        "positions": [
          {
            "string": 3,
            "fret": 0,
            "finger": 1
          },
          {
            "string": 2,
            "fret": 1,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 5,
            "finger": 4
          }
        ]
      },
      {
        "id": "var_0_10_8",
        "startingFret": 7,
        "positions": [
          {
            "string": 3,
            "fret": 0,
            "finger": 1
          },
          {
            "string": 2,
            "fret": 10,
            "finger": 3
          },
          {
            "string": 1,
            "fret": 8,
            "finger": 1
          }
        ]
      }
    ]
  },
  {
    "id": "g_suspended",
    "root": "G",
    "quality": "Suspended",
    "suffix": "sus",
    "variations": [
      {
        "id": "var_0_3_5",
        "startingFret": 2,
        "positions": [
          {
            "string": 3,
            "fret": 0,
            "finger": 1
          },
          {
            "string": 2,
            "fret": 3,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 5,
            "finger": 3
          }
        ]
      }
    ]
  },
  {
    "id": "fsharp_major",
    "root": "F#",
    "quality": "Major",
    "suffix": "",
    "variations": [
      {
        "id": "var_4_4_8",
        "startingFret": 3,
        "positions": [
          {
            "string": 3,
            "fret": 4,
            "finger": 1
          },
          {
            "string": 2,
            "fret": 4,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 8,
            "finger": 4
          }
        ]
      }
    ]
  },
  {
    "id": "fsharp_minor",
    "root": "F#",
    "quality": "Minor",
    "suffix": "m",
    "variations": [
      {
        "id": "var_4_4_7",
        "startingFret": 3,
        "positions": [
          {
            "string": 3,
            "fret": 4,
            "finger": 1
          },
          {
            "string": 2,
            "fret": 4,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 7,
            "finger": 4
          }
        ]
      }
    ]
  },
  {
    "id": "a_7",
    "root": "A",
    "quality": "7",
    "suffix": "7",
    "variations": [
      {
        "id": "var_6_7_7",
        "startingFret": 5,
        "positions": [
          {
            "string": 3,
            "fret": 6,
            "finger": 1
          },
          {
            "string": 2,
            "fret": 7,
            "finger": 2
          },
          {
            "string": 1,
            "fret": 7,
            "finger": 3
          }
        ]
      }
    ]
  },
  {
    "id": "b_7",
    "root": "B",
    "quality": "7",
    "suffix": "7",
    "variations": [
      {
        "id": "var_8_9_9",
        "startingFret": 7,
        "positions": [
          {
            "string": 3,
            "fret": 8,
            "finger": 1
          },
          {
            "string": 2,
            "fret": 9,
            "finger": 2
          },
          {
            "string": 1,
            "fret": 9,
            "finger": 3
          }
        ]
      }
    ]
  },
  {
    "id": "c_7",
    "root": "C",
    "quality": "7",
    "suffix": "7",
    "variations": [
      {
        "id": "var_9_10_10",
        "startingFret": 8,
        "positions": [
          {
            "string": 3,
            "fret": 9,
            "finger": 1
          },
          {
            "string": 2,
            "fret": 10,
            "finger": 2
          },
          {
            "string": 1,
            "fret": 10,
            "finger": 3
          }
        ]
      }
    ]
  },
  {
    "id": "d_7",
    "root": "D",
    "quality": "7",
    "suffix": "7",
    "variations": [
      {
        "id": "var_0_4_7",
        "startingFret": 3,
        "positions": [
          {
            "string": 3,
            "fret": 0,
            "finger": 1
          },
          {
            "string": 2,
            "fret": 4,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 7,
            "finger": 4
          }
        ]
      }
    ]
  },
  {
    "id": "e_7",
    "root": "E",
    "quality": "7",
    "suffix": "7",
    "variations": [
      {
        "id": "var_2_2_1",
        "startingFret": 1,
        "positions": [
          {
            "string": 3,
            "fret": 2,
            "finger": 2
          },
          {
            "string": 2,
            "fret": 2,
            "finger": 3
          },
          {
            "string": 1,
            "fret": 1,
            "finger": 1
          }
        ]
      }
    ]
  },
  {
    "id": "f_7",
    "root": "F",
    "quality": "7",
    "suffix": "7",
    "variations": [
      {
        "id": "var_3_3_2",
        "startingFret": 1,
        "positions": [
          {
            "string": 3,
            "fret": 3,
            "finger": 2
          },
          {
            "string": 2,
            "fret": 3,
            "finger": 3
          },
          {
            "string": 1,
            "fret": 2,
            "finger": 1
          }
        ]
      }
    ]
  },
  {
    "id": "g_7",
    "root": "G",
    "quality": "7",
    "suffix": "7",
    "variations": [
      {
        "id": "var_5_5_4",
        "startingFret": 3,
        "positions": [
          {
            "string": 3,
            "fret": 5,
            "finger": 2
          },
          {
            "string": 2,
            "fret": 5,
            "finger": 3
          },
          {
            "string": 1,
            "fret": 4,
            "finger": 1
          }
        ]
      }
    ]
  }
];

export const EBE_CHORDS: Chord[] = [
  {
    "id": "e",
    "root": "E",
    "quality": "Major",
    "suffix": "",
    "variations": [
      {
        "id": "var_1",
        "startingFret": 3,
        "positions": [
          {
            "string": 3,
            "fret": 0,
            "finger": 1
          },
          {
            "string": 2,
            "fret": 0,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 4,
            "finger": 1
          }
        ]
      }
    ]
  },
  {
    "id": "em",
    "root": "E",
    "quality": "Minor",
    "suffix": "m",
    "variations": [
      {
        "id": "var_1",
        "startingFret": 2,
        "positions": [
          {
            "string": 3,
            "fret": 0,
            "finger": 1
          },
          {
            "string": 2,
            "fret": 0,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 3,
            "finger": 1
          }
        ]
      }
    ]
  },
  {
    "id": "e7",
    "root": "E",
    "quality": "7",
    "suffix": "7",
    "variations": [
      {
        "id": "var_1",
        "startingFret": 2,
        "positions": [
          {
            "string": 3,
            "fret": 0,
            "finger": 1
          },
          {
            "string": 2,
            "fret": 3,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 4,
            "finger": 2
          }
        ]
      }
    ]
  },
  {
    "id": "fsharp",
    "root": "F#",
    "quality": "Major",
    "suffix": "",
    "variations": [
      {
        "id": "var_1",
        "startingFret": 5,
        "positions": [
          {
            "string": 3,
            "fret": 9,
            "finger": 1
          },
          {
            "string": 2,
            "fret": 7,
            "finger": 2
          },
          {
            "string": 1,
            "fret": 6,
            "finger": 3
          }
        ]
      }
    ]
  },
  {
    "id": "fsharpm",
    "root": "F#",
    "quality": "Minor",
    "suffix": "m",
    "variations": [
      {
        "id": "var_1",
        "startingFret": 1,
        "positions": [
          {
            "string": 3,
            "fret": 2,
            "finger": 1
          },
          {
            "string": 2,
            "fret": 2,
            "finger": 2
          },
          {
            "string": 1,
            "fret": 5,
            "finger": 3
          }
        ]
      }
    ]
  },
  {
    "id": "fsharp7",
    "root": "F#",
    "quality": "7",
    "suffix": "7",
    "variations": [
      {
        "id": "var_1",
        "startingFret": 1,
        "positions": [
          {
            "string": 3,
            "fret": 2,
            "finger": 1
          },
          {
            "string": 2,
            "fret": 2,
            "finger": 2
          },
          {
            "string": 1,
            "fret": 0,
            "finger": 1
          }
        ]
      }
    ]
  },
  {
    "id": "g",
    "root": "G",
    "quality": "Major",
    "suffix": "",
    "variations": [
      {
        "id": "var_1",
        "startingFret": 2,
        "positions": [
          {
            "string": 3,
            "fret": 3,
            "finger": 1
          },
          {
            "string": 2,
            "fret": 0,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 3,
            "finger": 2
          }
        ]
      }
    ]
  },
  {
    "id": "gm",
    "root": "G",
    "quality": "Minor",
    "suffix": "m",
    "variations": [
      {
        "id": "var_1",
        "startingFret": 2,
        "positions": [
          {
            "string": 3,
            "fret": 3,
            "finger": 1
          },
          {
            "string": 2,
            "fret": 3,
            "finger": 2
          },
          {
            "string": 1,
            "fret": 6,
            "finger": 3
          }
        ]
      }
    ]
  },
  {
    "id": "g7",
    "root": "G",
    "quality": "7",
    "suffix": "7",
    "variations": [
      {
        "id": "var_1",
        "startingFret": 1,
        "positions": [
          {
            "string": 3,
            "fret": 3,
            "finger": 1
          },
          {
            "string": 2,
            "fret": 3,
            "finger": 2
          },
          {
            "string": 1,
            "fret": 1,
            "finger": 3
          }
        ]
      }
    ]
  },
  {
    "id": "a",
    "root": "A",
    "quality": "Major",
    "suffix": "",
    "variations": [
      {
        "id": "var_1",
        "startingFret": 1,
        "positions": [
          {
            "string": 3,
            "fret": 5,
            "finger": 1
          },
          {
            "string": 2,
            "fret": 2,
            "finger": 2
          },
          {
            "string": 1,
            "fret": 0,
            "finger": 1
          }
        ]
      }
    ]
  },
  {
    "id": "am",
    "root": "A",
    "quality": "Minor",
    "suffix": "m",
    "variations": [
      {
        "id": "var_1",
        "startingFret": 4,
        "positions": [
          {
            "string": 3,
            "fret": 5,
            "finger": 1
          },
          {
            "string": 2,
            "fret": 5,
            "finger": 2
          },
          {
            "string": 1,
            "fret": 8,
            "finger": 3
          }
        ]
      }
    ]
  },
  {
    "id": "a7",
    "root": "A",
    "quality": "7",
    "suffix": "7",
    "variations": [
      {
        "id": "var_1",
        "startingFret": 2,
        "positions": [
          {
            "string": 3,
            "fret": 5,
            "finger": 1
          },
          {
            "string": 2,
            "fret": 5,
            "finger": 2
          },
          {
            "string": 1,
            "fret": 3,
            "finger": 3
          }
        ]
      }
    ]
  },
  {
    "id": "b",
    "root": "B",
    "quality": "Major",
    "suffix": "",
    "variations": [
      {
        "id": "var_1",
        "startingFret": 10,
        "positions": [
          {
            "string": 3,
            "fret": 14,
            "finger": 1
          },
          {
            "string": 2,
            "fret": 12,
            "finger": 2
          },
          {
            "string": 1,
            "fret": 11,
            "finger": 3
          }
        ]
      }
    ]
  },
  {
    "id": "bm",
    "root": "B",
    "quality": "Minor",
    "suffix": "m",
    "variations": [
      {
        "id": "var_1",
        "startingFret": 6,
        "positions": [
          {
            "string": 3,
            "fret": 7,
            "finger": 1
          },
          {
            "string": 2,
            "fret": 7,
            "finger": 2
          },
          {
            "string": 1,
            "fret": 10,
            "finger": 3
          }
        ]
      }
    ]
  },
  {
    "id": "b7",
    "root": "B",
    "quality": "7",
    "suffix": "7",
    "variations": [
      {
        "id": "var_1",
        "startingFret": 4,
        "positions": [
          {
            "string": 3,
            "fret": 7,
            "finger": 1
          },
          {
            "string": 2,
            "fret": 7,
            "finger": 2
          },
          {
            "string": 1,
            "fret": 5,
            "finger": 3
          }
        ]
      }
    ]
  },
  {
    "id": "b5",
    "root": "B",
    "quality": "Power (5)",
    "suffix": "5",
    "variations": [
      {
        "id": "var_1",
        "startingFret": 1,
        "positions": [
          {
            "string": 3,
            "fret": 2,
            "finger": 1
          },
          {
            "string": 2,
            "fret": 0,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 2,
            "finger": 2
          }
        ]
      }
    ]
  },
  {
    "id": "c",
    "root": "C",
    "quality": "Major",
    "suffix": "",
    "variations": [
      {
        "id": "var_1",
        "startingFret": 1,
        "positions": [
          {
            "string": 3,
            "fret": 3,
            "finger": 1
          },
          {
            "string": 2,
            "fret": 1,
            "finger": 2
          },
          {
            "string": 1,
            "fret": 0,
            "finger": 1
          }
        ]
      }
    ]
  },
  {
    "id": "cm",
    "root": "C",
    "quality": "Minor",
    "suffix": "m",
    "variations": [
      {
        "id": "var_1",
        "startingFret": 7,
        "positions": [
          {
            "string": 3,
            "fret": 8,
            "finger": 1
          },
          {
            "string": 2,
            "fret": 8,
            "finger": 2
          },
          {
            "string": 1,
            "fret": 11,
            "finger": 3
          }
        ]
      }
    ]
  },
  {
    "id": "c7",
    "root": "C",
    "quality": "7",
    "suffix": "7",
    "variations": [
      {
        "id": "var_1",
        "startingFret": 5,
        "positions": [
          {
            "string": 3,
            "fret": 8,
            "finger": 1
          },
          {
            "string": 2,
            "fret": 8,
            "finger": 2
          },
          {
            "string": 1,
            "fret": 6,
            "finger": 3
          }
        ]
      }
    ]
  },
  {
    "id": "csharpm",
    "root": "C#",
    "quality": "Minor",
    "suffix": "m",
    "variations": [
      {
        "id": "var_1",
        "startingFret": 1,
        "positions": [
          {
            "string": 3,
            "fret": 4,
            "finger": 1
          },
          {
            "string": 2,
            "fret": 2,
            "finger": 2
          },
          {
            "string": 1,
            "fret": 0,
            "finger": 1
          }
        ]
      }
    ]
  },
  {
    "id": "d",
    "root": "D",
    "quality": "Major",
    "suffix": "",
    "variations": [
      {
        "id": "var_1",
        "startingFret": 1,
        "positions": [
          {
            "string": 3,
            "fret": 5,
            "finger": 1
          },
          {
            "string": 2,
            "fret": 3,
            "finger": 2
          },
          {
            "string": 1,
            "fret": 2,
            "finger": 3
          }
        ]
      }
    ]
  },
  {
    "id": "dm",
    "root": "D",
    "quality": "Minor",
    "suffix": "m",
    "variations": [
      {
        "id": "var_1",
        "startingFret": 9,
        "positions": [
          {
            "string": 3,
            "fret": 10,
            "finger": 1
          },
          {
            "string": 2,
            "fret": 10,
            "finger": 2
          },
          {
            "string": 1,
            "fret": 13,
            "finger": 3
          }
        ]
      }
    ]
  },
  {
    "id": "d7",
    "root": "D",
    "quality": "7",
    "suffix": "7",
    "variations": [
      {
        "id": "var_1",
        "startingFret": 7,
        "positions": [
          {
            "string": 3,
            "fret": 10,
            "finger": 1
          },
          {
            "string": 2,
            "fret": 10,
            "finger": 2
          },
          {
            "string": 1,
            "fret": 8,
            "finger": 3
          }
        ]
      }
    ]
  },
  {
    "id": "gsharpm",
    "root": "G#",
    "quality": "Minor",
    "suffix": "m",
    "variations": [
      {
        "id": "var_1",
        "startingFret": 3,
        "positions": [
          {
            "string": 3,
            "fret": 4,
            "finger": 1
          },
          {
            "string": 2,
            "fret": 0,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 4,
            "finger": 2
          }
        ]
      }
    ]
  }
];
