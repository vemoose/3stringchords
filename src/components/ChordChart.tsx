import type { ChordVariation } from '../data/chords';

export const ChordChart = ({ variation }: { variation: ChordVariation }) => {
  let { startingFret } = variation;
  const { positions } = variation;

  // Calculate the highest fret used in this variation
  const maxFret = Math.max(0, ...positions.map(p => p.fret));

  // If the chord can fit entirely within the first 5 frets, anchor it to the nut (fret 1)
  if (maxFret <= 5) {
    startingFret = 1;
  }

  // The user wants exactly 5 frets to show for a uniform look
  const numFrets = 5;

  const stringSpacing = 30;
  const fretSpacing = 35;
  const topMargin = 30;
  const leftMargin = 45; // Increased margin to prevent cutoff and give spacing from dots
  
  const width = leftMargin * 2 + stringSpacing * 2;
  const height = topMargin + fretSpacing * numFrets + 20;

  const getStringX = (stringNum: number) => {
    // stringNum: 3 is lowest (left), 1 is highest (right)
    return leftMargin + (3 - stringNum) * stringSpacing;
  };

  const getFretY = (fretIndex: number) => {
    return topMargin + fretIndex * fretSpacing;
  };

  const getStringThickness = (stringNum: number) => {
    // 3 = Low G (thickest), 2 = D (medium), 1 = High G (thinnest)
    if (stringNum === 3) return 3;
    if (stringNum === 2) return 2;
    return 1;
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <filter id="dot-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.3" floodColor="currentColor" />
          </filter>
        </defs>
        
        {/* Frets */}
        {Array.from({ length: numFrets + 1 }).map((_, i) => {
          const y = getFretY(i);
          const isNut = startingFret === 1 && i === 0;
          return (
            <line
              key={`fret-${i}`}
              x1={leftMargin}
              y1={y}
              x2={width - leftMargin}
              y2={y}
              stroke="var(--text-main)"
              strokeWidth={isNut ? 6 : 1.5}
              strokeLinecap={isNut ? "square" : "round"}
            />
          );
        })}

        {/* Strings */}
        {[3, 2, 1].map(str => {
          const x = getStringX(str);
          return (
            <line
              key={`str-${str}`}
              x1={x}
              y1={topMargin}
              x2={x}
              y2={getFretY(numFrets)}
              stroke="var(--text-main)"
              strokeWidth={getStringThickness(str)}
              strokeLinecap="round"
            />
          );
        })}

        {/* Fret Numbers Indicator on the left */}
        {Array.from({ length: numFrets }).map((_, i) => {
          const actualFret = startingFret + i;
          // Only show dot markers or fret numbers for typical frets (3, 5, 7, 9, 12, 15)
          // Or just show the starting fret explicitly
          if (i === 0 && startingFret > 1) {
            return (
              <text
                key={`fret-num-${i}`}
                x={leftMargin - 18}
                y={getFretY(i) + fretSpacing / 2}
                fill="var(--text-muted)"
                fontSize="12"
                fontFamily="sans-serif"
                fontWeight="bold"
                textAnchor="end"
                alignmentBaseline="middle"
              >
                {actualFret}fr
              </text>
            );
          }
          // Optionally add dots on the fretboard for 3, 5, 7, 9, 12
          const markerFrets = [3, 5, 7, 9, 12, 15];
          if (markerFrets.includes(actualFret)) {
             return (
               <circle 
                 key={`marker-${i}`}
                 cx={leftMargin + stringSpacing}
                 cy={getFretY(i) + fretSpacing / 2}
                 r={4}
                 fill="var(--text-muted)"
                 opacity={0.3}
               />
             );
          }
          return null;
        })}

        {/* Finger Dots & Open indicators */}
        {positions.map((pos, idx) => {
          const x = getStringX(pos.string);
          
          if (pos.fret === 0) {
            return (
              <circle
                key={`pos-${idx}`}
                cx={x}
                cy={topMargin - 10}
                r={4}
                fill="none"
                stroke="var(--text-muted)"
                strokeWidth={2}
              />
            );
          }

          if (typeof pos.fret !== 'number') return null;

          const relativeFret = pos.fret - startingFret;
          // Ensure it's within bounds
          if (relativeFret < 0 || relativeFret >= numFrets) return null;

          const y = getFretY(relativeFret) + fretSpacing / 2;

          return (
            <g key={`pos-${idx}`}>
              <circle
                cx={x}
                cy={y}
                r={12}
                fill="var(--accent-color)"
                filter="url(#dot-shadow)"
              />
              {pos.finger && (
                <text
                  x={x}
                  y={y + 1}
                  fill="#ffffff"
                  fontSize="12"
                  fontFamily="sans-serif"
                  fontWeight="bold"
                  textAnchor="middle"
                  alignmentBaseline="middle"
                >
                  {pos.finger}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
};
