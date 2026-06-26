import React from 'react';

export const FILTER_CHIPS = [
  { id: 'All', label: 'All' },
  { id: 'Essential', label: 'Essential' },
  { id: 'Major', label: 'Major' },
  { id: 'Minor', label: 'Minor' },
  { id: '5', label: '5' },
  { id: '7', label: '7' },
  { id: 'maj7', label: 'maj7' },
  { id: 'm7', label: 'm7' },
  { id: '6', label: '6' },
  { id: 'sus', label: 'sus' },
  { id: 'dim', label: 'dim' },
  { id: 'aug', label: 'aug' },
];

interface FilterBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  activeChip: string;
  onChipChange: (chipId: string) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({ 
  searchTerm, 
  onSearchChange,
  activeChip,
  onChipChange
}) => {
  return (
    <div style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ position: 'relative' }}>
        <input
          type="text"
          placeholder="Search by root (e.g., C, F#)..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          style={{
            width: '100%',
            padding: '0.75rem 1rem 0.75rem 2.5rem',
            borderRadius: 'var(--radius)',
            border: '1px solid var(--border-color)',
            backgroundColor: 'var(--surface-color)',
            color: 'var(--text-main)',
            fontFamily: 'inherit',
            fontSize: '1rem',
            outline: 'none',
            transition: 'border-color 0.2s',
            boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)',
            boxSizing: 'border-box'
          }}
        />
        <svg 
          width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }}
        >
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </div>

      <div className="filter-chips-container">
        {FILTER_CHIPS.map(chip => (
          <button
            key={chip.id}
            onClick={() => onChipChange(chip.id)}
            className={`filter-chip ${activeChip === chip.id ? 'active' : ''}`}
          >
            {chip.label}
          </button>
        ))}
      </div>
    </div>
  );
};
