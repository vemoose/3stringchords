import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  rectSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useEffect, useState } from 'react';
import { ChordCard } from './ChordCard';
import type { Chord, Tuning } from '../data/chords';

export type SavedItem = { chordId: string; variationId: string; tuning?: string };

export function matchesTuning(item: SavedItem, tuning: Tuning): boolean {
  return item.tuning === tuning || (!item.tuning && tuning === 'GDG');
}

export function reorderSavedItems(
  items: SavedItem[],
  tuning: Tuning,
  fromDisplayIndex: number,
  toDisplayIndex: number,
): SavedItem[] {
  const tuningIndices: number[] = [];
  const tuningItems: SavedItem[] = [];

  items.forEach((item, i) => {
    if (matchesTuning(item, tuning)) {
      tuningIndices.push(i);
      tuningItems.push(item);
    }
  });

  const reordered = arrayMove(tuningItems, fromDisplayIndex, toDisplayIndex);
  const result = [...items];
  tuningIndices.forEach((origIdx, i) => {
    result[origIdx] = reordered[i];
  });
  return result;
}

interface PracticeEntry {
  id: string;
  item: SavedItem;
  chord: Chord;
  displayIndex: number;
}

interface PracticeListProps {
  entries: PracticeEntry[];
  onReorder: (fromIndex: number, toIndex: number) => void;
  isSaved: (chordId: string, variationId: string) => boolean;
  onToggleSave: (chordId: string, variationId: string) => void;
  onExpand: (chord: Chord, variationId: string) => void;
  expandedChordId: string | null;
}

function DragHandleIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <circle cx="9" cy="6" r="1.5" />
      <circle cx="15" cy="6" r="1.5" />
      <circle cx="9" cy="12" r="1.5" />
      <circle cx="15" cy="12" r="1.5" />
      <circle cx="9" cy="18" r="1.5" />
      <circle cx="15" cy="18" r="1.5" />
    </svg>
  );
}

function ChevronUpIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="18 15 12 9 6 15" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

interface SortableItemProps {
  entry: PracticeEntry;
  total: number;
  onMove: (fromIndex: number, direction: 'up' | 'down') => void;
  isSaved: (chordId: string, variationId: string) => boolean;
  onToggleSave: (chordId: string, variationId: string) => void;
  onExpand: (chord: Chord, variationId: string) => void;
  isExpanded: boolean;
}

function SortablePracticeItem({
  entry,
  total,
  onMove,
  isSaved,
  onToggleSave,
  onExpand,
  isExpanded,
}: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: entry.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isFirst = entry.displayIndex === 0;
  const isLast = entry.displayIndex === total - 1;

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`practice-list-item${isDragging ? ' practice-list-item--dragging' : ''}`}
    >
      <div className="practice-list-controls" aria-label={`Position ${entry.displayIndex + 1} controls`}>
        <span className="practice-list-number" aria-hidden="true">
          {entry.displayIndex + 1}
        </span>

        <div className="practice-list-move-buttons">
          <button
            type="button"
            className="practice-list-move-btn"
            onClick={() => onMove(entry.displayIndex, 'up')}
            disabled={isFirst}
            aria-label={`Move ${entry.chord.root} ${entry.chord.quality} up`}
          >
            <ChevronUpIcon />
          </button>
          <button
            type="button"
            className="practice-list-move-btn"
            onClick={() => onMove(entry.displayIndex, 'down')}
            disabled={isLast}
            aria-label={`Move ${entry.chord.root} ${entry.chord.quality} down`}
          >
            <ChevronDownIcon />
          </button>
        </div>

        <button
          type="button"
          ref={setActivatorNodeRef}
          className="practice-list-drag-handle"
          aria-label={`Drag to reorder ${entry.chord.root} ${entry.chord.quality}`}
          {...attributes}
          {...listeners}
        >
          <DragHandleIcon />
        </button>
      </div>

      <div className="practice-list-card">
        <ChordCard
          chord={entry.chord}
          initialVariationId={entry.item.variationId}
          isSaved={(varId) => isSaved(entry.chord.id, varId)}
          onToggleSave={onToggleSave}
          onExpand={onExpand}
          isExpanded={isExpanded}
        />
      </div>
    </li>
  );
}

export function PracticeList({
  entries,
  onReorder,
  isSaved,
  onToggleSave,
  onExpand,
  expandedChordId,
}: PracticeListProps) {
  const [isDesktopGrid, setIsDesktopGrid] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(min-width: 769px)').matches,
  );

  useEffect(() => {
    const media = window.matchMedia('(min-width: 769px)');
    const handleChange = (event: MediaQueryListEvent) => setIsDesktopGrid(event.matches);
    media.addEventListener('change', handleChange);
    return () => media.removeEventListener('change', handleChange);
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const sortableIds = entries.map((e) => e.id);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = entries.findIndex((e) => e.id === active.id);
    const newIndex = entries.findIndex((e) => e.id === over.id);
    if (oldIndex !== -1 && newIndex !== -1) {
      onReorder(oldIndex, newIndex);
    }
  };

  const handleMove = (fromIndex: number, direction: 'up' | 'down') => {
    const toIndex = direction === 'up' ? fromIndex - 1 : fromIndex + 1;
    if (toIndex < 0 || toIndex >= entries.length) return;
    onReorder(fromIndex, toIndex);
  };

  return (
    <div className={`practice-list${isDesktopGrid ? ' practice-list--grid' : ''}`}>
      <p className="practice-list-hint">
        Drag the handle or use the arrows to set your practice order
      </p>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={sortableIds}
          strategy={isDesktopGrid ? rectSortingStrategy : verticalListSortingStrategy}
        >
          <ol className="practice-list-items">
            {entries.map((entry) => (
              <SortablePracticeItem
                key={entry.id}
                entry={entry}
                total={entries.length}
                onMove={handleMove}
                isSaved={isSaved}
                onToggleSave={onToggleSave}
                onExpand={onExpand}
                isExpanded={expandedChordId === entry.chord.id}
              />
            ))}
          </ol>
        </SortableContext>
      </DndContext>
    </div>
  );
}
