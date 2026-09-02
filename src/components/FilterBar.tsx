import React, { useRef, useEffect, useState } from 'react';

export const FILTER_CHIPS = [
  { id: 'All', label: 'All' },
  { id: 'Essential', label: 'Essential' },
  { id: 'Major', label: 'Major' },
  { id: 'Minor', label: 'Minor' },
  { id: 'Power', label: 'Power' },
  { id: '7th', label: '7th' },
  { id: 'Extended', label: 'Extended' },
  { id: 'Sus', label: 'Sus' },
  { id: 'Dim', label: 'Dim' },
  { id: 'Aug', label: 'Aug' },
];

const PRIMARY_CHIP_IDS = new Set(['All', 'Essential', 'Major', 'Minor']);
const MORE_CHIP_IDS = ['Power', '7th', 'Extended', 'Sus', 'Dim', 'Aug'];

interface FilterBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  activeChip: string;
  onChipChange: (chipId: string) => void;
  availableChips?: Set<string>;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchTerm,
  onSearchChange,
  activeChip,
  onChipChange,
  availableChips,
}) => {
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  const visibleChips = FILTER_CHIPS.filter(
    (chip) => !availableChips || availableChips.has(chip.id)
  );
  const primaryChips = visibleChips.filter((chip) => PRIMARY_CHIP_IDS.has(chip.id));
  const moreChips = visibleChips.filter((chip) => MORE_CHIP_IDS.includes(chip.id));
  const isMoreActive = MORE_CHIP_IDS.includes(activeChip);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    };

    if (moreOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('touchstart', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, [moreOpen]);

  const renderChip = (chip: { id: string; label: string }) => (
    <button
      key={chip.id}
      type="button"
      onClick={() => onChipChange(chip.id)}
      className={`filter-chip ${activeChip === chip.id ? 'active' : ''}`}
    >
      {chip.label}
    </button>
  );

  return (
    <div className="filter-bar">
      <div className="filter-bar__search">
        <input
          type="text"
          placeholder="Search chords..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="filter-bar__search-input"
        />
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--text-muted)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="filter-bar__search-icon"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </div>

      <div className="filter-chips-container">
        {primaryChips.map(renderChip)}

        {moreChips.length > 0 && (
          <div className="filter-more mobile-only" ref={moreRef}>
            <button
              type="button"
              className={`filter-chip filter-more__trigger ${isMoreActive ? 'active' : ''}`}
              onClick={() => setMoreOpen((prev) => !prev)}
              aria-expanded={moreOpen}
            >
              More
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`filter-more__chevron ${moreOpen ? 'filter-more__chevron--open' : ''}`}
                aria-hidden="true"
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
            {moreOpen && (
              <div className="filter-more__menu">
                {moreChips.map((chip) => (
                  <button
                    key={chip.id}
                    type="button"
                    className={`filter-more__option ${activeChip === chip.id ? 'selected' : ''}`}
                    onClick={() => {
                      onChipChange(chip.id);
                      setMoreOpen(false);
                    }}
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="desktop-only filter-chips-container__rest">
          {moreChips.map(renderChip)}
        </div>
      </div>
    </div>
  );
};
