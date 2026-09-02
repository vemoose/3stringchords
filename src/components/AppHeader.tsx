import React, { useEffect, useState, useRef } from 'react';
import { CustomDropdown } from './CustomDropdown';
import { SCALE_TYPES } from '../data/scales';
import type { ScaleType } from '../data/scales';
import type { Tuning } from '../data/chords';

export type ViewMode = 'library' | 'practice';

const KEY_OPTIONS = [
  { value: 'Any Key', label: 'Any Key' },
  { value: 'C', label: 'C' },
  { value: 'C# / Db', label: 'C# / Db' },
  { value: 'D', label: 'D' },
  { value: 'D# / Eb', label: 'D# / Eb' },
  { value: 'E', label: 'E' },
  { value: 'F', label: 'F' },
  { value: 'F# / Gb', label: 'F# / Gb' },
  { value: 'G', label: 'G' },
  { value: 'G# / Ab', label: 'G# / Ab' },
  { value: 'A', label: 'A' },
  { value: 'A# / Bb', label: 'A# / Bb' },
  { value: 'B', label: 'B' },
];

const TUNING_OPTIONS = [
  { value: 'GDG', label: 'G-D-G' },
  { value: 'DAD', label: 'D-A-D' },
  { value: 'EBE', label: 'E-B-E' },
  { value: 'AEA', label: 'A-E-A (Beta)' },
  { value: 'CGC', label: 'C-G-C (Beta)' },
];

const TUNING_DISPLAY: Record<Tuning, string> = {
  GDG: 'G-D-G',
  DAD: 'D-A-D',
  EBE: 'E-B-E',
  AEA: 'A-E-A',
  CGC: 'C-G-C',
};

interface AppHeaderProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  activeTuning: Tuning;
  onTuningChange: (tuning: Tuning) => void;
  activeKey: string;
  onKeyChange: (key: string) => void;
  activeScaleType: ScaleType;
  onScaleTypeChange: (scale: ScaleType) => void;
  savedCount: number;
  onOpenFretboard: () => void;
  onOpenTuner: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  viewMode,
  onViewModeChange,
  activeTuning,
  onTuningChange,
  activeKey,
  onKeyChange,
  activeScaleType,
  onScaleTypeChange,
  savedCount,
  onOpenFretboard,
  onOpenTuner,
}) => {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const filtersRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem('color-scheme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      if (filtersRef.current && !filtersRef.current.contains(e.target as Node)) {
        setFiltersOpen(false);
      }
    };

    if (filtersOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('touchstart', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, [filtersOpen]);

  const toggleTheme = () => {
    let nextTheme: 'light' | 'dark' = 'dark';

    if (theme === 'system') {
      const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      nextTheme = isSystemDark ? 'light' : 'dark';
    } else {
      nextTheme = theme === 'light' ? 'dark' : 'light';
    }

    setTheme(nextTheme);
    document.documentElement.style.colorScheme = nextTheme;
    const meta = document.querySelector('meta[name="color-scheme"]');
    if (meta) {
      meta.setAttribute('content', nextTheme);
    }
    localStorage.setItem('color-scheme', nextTheme);
  };

  const handleKeyChange = (val: string) => {
    if (activeKey === 'Any Key' && val !== 'Any Key') {
      onScaleTypeChange('Major');
    }
    onKeyChange(val);
  };

  const themeMenuItem = (
    <button
      type="button"
      className="filters-menu__action filters-menu__action--theme"
      onClick={() => {
        toggleTheme();
        setFiltersOpen(false);
      }}
    >
      {theme === 'dark' ? 'Light mode' : 'Dark mode'}
    </button>
  );

  const mobileMoreMenu = (
    <div className="filters-menu-wrapper" ref={filtersRef}>
      <button
        type="button"
        className="custom-dropdown__trigger"
        onClick={() => setFiltersOpen((prev) => !prev)}
        aria-expanded={filtersOpen}
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
          className={`custom-dropdown__chevron ${filtersOpen ? 'custom-dropdown__chevron--open' : ''}`}
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>
      {filtersOpen && (
        <div className="filters-menu">
          {viewMode === 'library' && activeKey !== 'Any Key' && (
            <div className="filters-menu__row">
              <span className="filters-menu__label">Scale</span>
              <CustomDropdown
                variant="compact"
                value={activeScaleType}
                onChange={(val) => onScaleTypeChange(val as ScaleType)}
                options={SCALE_TYPES.map((type) => ({ value: type, label: type }))}
              />
            </div>
          )}
          {viewMode === 'library' && (
            <>
              <button
                type="button"
                className="filters-menu__action"
                onClick={() => {
                  onOpenFretboard();
                  setFiltersOpen(false);
                }}
              >
                Fretboard
                <span className="filters-menu__hint">{TUNING_DISPLAY[activeTuning]}</span>
              </button>
              <button
                type="button"
                className="filters-menu__action"
                onClick={() => {
                  onOpenTuner();
                  setFiltersOpen(false);
                }}
              >
                Tuner
              </button>
            </>
          )}
          {themeMenuItem}
        </div>
      )}
    </div>
  );

  const themeToggleBtn = (
    <button
      type="button"
      className="theme-toggle-btn"
      onClick={toggleTheme}
      title="Toggle theme"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
      )}
    </button>
  );

  const viewTabs = (
    <div className="view-tabs" role="tablist" aria-label="View mode">
      <button
        type="button"
        role="tab"
        aria-selected={viewMode === 'library'}
        className={`view-tab ${viewMode === 'library' ? 'view-tab--active' : ''}`}
        onClick={() => onViewModeChange('library')}
      >
        Library
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={viewMode === 'practice'}
        className={`view-tab ${viewMode === 'practice' ? 'view-tab--active' : ''}`}
        onClick={() => onViewModeChange('practice')}
      >
        Practice
        {savedCount > 0 && (
          <span className="view-tab__badge" aria-label={`${savedCount} saved chords`}>
            {savedCount}
          </span>
        )}
      </button>
    </div>
  );

  const libraryControls = (
    <>
      <CustomDropdown
        value={activeTuning}
        onChange={(val) => onTuningChange(val as Tuning)}
        options={TUNING_OPTIONS}
      />
      <CustomDropdown
        value={activeKey}
        onChange={handleKeyChange}
        options={KEY_OPTIONS}
      />
      {activeKey !== 'Any Key' && (
        <CustomDropdown
          value={activeScaleType}
          onChange={(val) => onScaleTypeChange(val as ScaleType)}
          options={SCALE_TYPES.map((type) => ({ value: type, label: type }))}
        />
      )}
      <button type="button" className="header-tool-btn" onClick={onOpenFretboard}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="3" x2="18" y2="21"></line><line x1="14" y1="3" x2="14" y2="21"></line><line x1="10" y1="3" x2="10" y2="21"></line><line x1="6" y1="3" x2="6" y2="21"></line><line x1="2" y1="6" x2="22" y2="6"></line><line x1="2" y1="12" x2="22" y2="12"></line><line x1="2" y1="18" x2="22" y2="18"></line></svg>
        Fretboard
        <span className="header-tool-btn__hint">{TUNING_DISPLAY[activeTuning]}</span>
      </button>
      <button type="button" className="header-tool-btn" onClick={onOpenTuner}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18V5l12-2v13"></path>
          <circle cx="6" cy="18" r="3"></circle>
          <circle cx="18" cy="16" r="3"></circle>
        </svg>
        Tuner
      </button>
    </>
  );

  return (
    <div className={`app-header-group${viewMode === 'practice' ? ' app-header-group--practice' : ''}`}>
      <header className="app-header app-header--mobile mobile-only">
        <div className="app-header__top-row">
          {viewTabs}
        </div>
        {viewMode === 'library' && (
          <div className="mobile-filter-row">
            <CustomDropdown
              variant="compact"
              value={activeTuning}
              onChange={(val) => onTuningChange(val as Tuning)}
              options={TUNING_OPTIONS}
            />
            <CustomDropdown
              variant="compact"
              value={activeKey}
              onChange={handleKeyChange}
              options={KEY_OPTIONS}
            />
            {mobileMoreMenu}
          </div>
        )}
      </header>

      <header className="app-header app-header--desktop desktop-only">
        {viewTabs}

        {viewMode === 'library' && (
          <>
            <div className="header-divider" aria-hidden="true" />
            <div className="header-settings-group">
              {libraryControls}
            </div>
          </>
        )}

        <div className="app-header__actions">
          <a
            href="https://ko-fi.com/vemoose"
            target="_blank"
            rel="noopener noreferrer"
            className="header-coffee-link"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            <span className="header-coffee-link__label">Buy me a coffee</span>
          </a>
          {themeToggleBtn}
        </div>
      </header>
    </div>
  );
};
