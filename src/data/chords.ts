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
];

export const CHORDS: Chord[] = [
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
            "finger": 2
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
    "id": "asharp_m7",
    "root": "A#",
    "suffix": "m7",
    "quality": "m7",
    "variations": [
      {
        "id": "root_m7",
        "startingFret": 1,
        "positions": [
          {
            "string": 3,
            "fret": 3,
            "finger": 4
          },
          {
            "string": 2,
            "fret": -1,
            "finger": 1
          },
          {
            "string": 1,
            "fret": 1,
            "finger": 2
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
            "finger": 1
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
            "finger": 1
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
            "finger": 1
          },
          {
            "string": 2,
            "fret": 3,
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
            "finger": 1
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
            "finger": 1
          },
          {
            "string": 2,
            "fret": 5,
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
            "finger": 3
          },
          {
            "string": 2,
            "fret": 2,
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
            "finger": 1
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
            "finger": 1
          },
          {
            "string": 2,
            "fret": 7,
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
            "finger": 1
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
            "finger": 1
          },
          {
            "string": 2,
            "fret": 10,
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
